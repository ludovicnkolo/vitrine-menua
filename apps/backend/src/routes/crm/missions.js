const express = require('express');
const prisma = require('../../prisma');
const crypto = require('node:crypto');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('node:fs');
const path = require('node:path');
const router = express.Router();

const { authenticateJWT, requireRoles, isSuperAdmin, isAdmin, isManager } = require('../../middlewares/auth');
const { notify } = require('../../utils/notify');
const { transporter } = require('../../utils/mailer');
const { logAudit } = require('../../utils/audit');

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER || 'contact@menuaconsulting.com',
    password: process.env.IMAP_PASSWORD || '',
    host: process.env.IMAP_HOST || 'ssl0.ovh.net',
    port: process.env.IMAP_PORT ? Number.parseInt(process.env.IMAP_PORT) : 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

const getPaginationParams = (query, defaultLimit = 6) => {
  const page = Number.parseInt(query.page) || 1;
  const limit = Number.parseInt(query.limit) || defaultLimit;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const sendPaginatedResponse = (res, data, total, page, limit) => {
  res.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1
  });
};

const resolveCreatorId = async (req) => {
  let creatorId = req.user.id;
  if (creatorId === 'MASTER-ADMIN') {
    let masterUser = await prisma.utilisateur.findUnique({ where: { email: 'contact@menuaconsulting.com' } });
    if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
    return masterUser?.id || creatorId;
  }
  return creatorId;
};

const generateReference = async (model, prefix) => {
  const lastRecord = await prisma[model].findFirst({
    orderBy: { createdAt: 'desc' },
    select: { reference: true }
  });
  let nextNum = 1;
  if (lastRecord && lastRecord.reference) {
    const regex = new RegExp(`${prefix}-(\\d+)`);
    const match = lastRecord.reference.match(regex);
    if (match) nextNum = Number.parseInt(match[1], 10) + 1;
  }
  return `${prefix}-${String(nextNum).padStart(2, '0')}`;
};

const generateSubDossierReference = async (parentDossierId) => {
  const parent = await prisma.dossier.findUnique({ where: { id: parentDossierId }, select: { reference: true } });
  if (!parent || !parent.reference) return `DOS-SUB-${Math.floor(Math.random() * 1000)}`;
  
  const children = await prisma.dossier.findMany({ 
    where: { parentDossierId },
    select: { reference: true }
  });
  
  let maxSeq = 0;
  for (const child of children) {
    if (!child.reference) continue;
    const parts = child.reference.split('-');
    if (parts.length >= 3) {
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    } else if (parts.length === 2) {
        // Just in case it was a DOS-XX format incorrectly saved as a child previously
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  return `${parent.reference}-${String(maxSeq + 1).padStart(2, '0')}`;
};

router.use(authenticateJWT);

// --- ROLES ---
async function checkAndUpdateMissionStatus(missionId, prisma) {
  const mission = await prisma.mission.findUnique({ where: { id: missionId }, include: { taches: true, dossier: { include: { missions: true } } } });
  if (!mission) return;

  const allTaches = mission.taches;
  let newStatus = mission.status;

  if (allTaches.length > 0 && allTaches.every(t => t.status === 'TERMINE')) {
    newStatus = 'TERMINE';
  } else if (mission.status === 'NOUVEAU' && allTaches.some(t => t.status !== 'NOUVEAU')) {
    newStatus = 'OUVERT';
  } else if (mission.status === 'TERMINE' && allTaches.some(t => t.status !== 'TERMINE')) {
    newStatus = 'OUVERT';
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({ where: { id: mission.id }, data: { status: newStatus, previousStatus: mission.status } });
    if (newStatus === 'TERMINE' && mission.dossier) {
       checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (newStatus === 'OUVERT' && mission.dossier && mission.dossier.status === 'NOUVEAU') {
       await prisma.dossier.update({ where: { id: mission.dossier.id }, data: { status: 'OUVERT' } });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prisma) {
  const freshDossier = await prisma.dossier.findUnique({ where: { id: dossier.id }, include: { missions: true } });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions;
  if (allMissions.length > 0 && allMissions.every(m => m.status === 'TERMINE')) {
    if (freshDossier.status !== 'TERMINE' && freshDossier.status !== 'ARCHIVE' && freshDossier.status !== 'BLOQUE') {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'TERMINE', previousStatus: freshDossier.status } });
    }
  } else if (freshDossier.status === 'TERMINE' && allMissions.some(m => m.status !== 'TERMINE')) {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'OUVERT', previousStatus: freshDossier.status } });
  }
}

const { syncMessages } = require('../../controllers/imapController');

router.get('/tasks', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;



    const where = { parentMissionId: null }; // Only parent tasks

    if (req.user.role === 'Responsable opérationnel' || req.user.role === 'Collaborateur') {
      where.OR = [
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { dossier: { traitantId: req.user.id } },
        { taches: { some: { assignedToId: req.user.id } } }
      ];
    } else if (req.user.role === 'Relecteur') {
      where.relecteurId = req.user.id;
    }

    const isSuperAdm = req.user.role === 'Super-administrateur';
    if (status && status !== 'all') {
      where.status = status;
    }
    if (!isSuperAdm) {
      if (where.status === 'BLOQUE') {
        where.id = 'unauthorized_so_return_empty';
      } else if (!where.status) {
        where.status = { not: 'BLOQUE' };
      }
      where.dossier = {
        ...where.dossier,
        status: { not: 'BLOQUE' }
      };
    }
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { reference: { contains: s} },
        { dossier: { name: { contains: s} } },
        { dossier: { reference: { contains: s} } },
        { dossierId: { contains: s} },
        { createdBy: { name: { contains: s} } },
        { assignedTo: { name: { contains: s} } }
      ];
    }
    
    const total = await prisma.mission.count({ where });
    const tasks = await prisma.mission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { reference: 'desc' },
      include: { 
        dossier: { include: { subDossiers: true } }, 
        dossierMission: { include: { subDossiers: true } },
        authorizedDossiers: { include: { subDossiers: true } },
        assignedTo: { include: { role: true } },
        relecteur: { include: { role: true } },
        createdBy: { include: { role: true } },
        documents: { where: { isDeleted: false }, include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } },
        subMissions: {
          include: { assignedTo: true, createdBy: true }
        },
        taches: {
          include: { assignedTo: true, createdBy: true }
        }
      }
    });
    sendPaginatedResponse(res, tasks, total, page, limit);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const userRole = req.user.role;
    // Relecteur et Collaborateur ne peuvent pas créer de missions
    if (userRole === 'Relecteur' || userRole === 'Collaborateur') {
      return res.status(403).json({ error: "Accès refusé. Vous n'avez pas les droits pour créer une mission." });
    }

    if (req.body.dossierId) {
      const targetDossier = await prisma.dossier.findUnique({ where: { id: req.body.dossierId }, select: { traitantId: true, status: true } });
      if (!targetDossier) return res.status(404).json({ error: "Dossier introuvable." });
      if (['TERMINE', 'ARCHIVE'].includes(targetDossier.status)) {
        return res.status(403).json({ error: "Action impossible : le dossier parent est clôturé." });
      }
      if (userRole === 'Responsable opérationnel' && targetDossier.traitantId !== req.user.id) {
        return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le responsable de ce dossier." });
      }
    }

    const { dossierId, description, assignedToId, relecteurId, parentMissionId, echeance, attachment, messageId, dossierMissionId, authorizedDossierIds } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('mission', 'MSN');

    const task = await prisma.mission.create({
      data: {
        reference,
        description,
        dossierId,
        assignedToId,
        relecteurId,
        createdById: creatorId,
        status: 'NON_DEMARREE',
        echeance: echeance ? new Date(echeance) : null,
        attachment,
        ...(parentMissionId && { parentMissionId }),
        ...(dossierMissionId && { dossierMissionId }),
        ...(authorizedDossierIds && authorizedDossierIds.length > 0 && {
          authorizedDossiers: { connect: authorizedDossierIds.map(id => ({ id })) }
        })
      }
    });

    const dossierToUpdate = await prisma.dossier.findUnique({ where: { id: dossierId } });
    if (dossierToUpdate && dossierToUpdate.status === 'NOUVEAU') {
      await prisma.dossier.update({
        where: { id: dossierId },
        data: { status: 'OUVERT' }
      });
      await logAudit(req.user?.id, 'MODIFICATION_DOSSIER', dossierId, 'DOSSIER', `Statut automatique -> OUVERT (Mission créée)`);
    }

    if (messageId) {
      const form = await prisma.formulaire.findUnique({ where: { id: messageId } });
      if (form) {
        await prisma.formulaire.update({ where: { id: messageId }, data: { status: 'TRAITE' } });
      } else {
        const msg = await prisma.messagePersonnel.findUnique({ where: { id: messageId } });
        if (msg) {
          await prisma.messagePersonnel.update({ where: { id: messageId }, data: { status: 'TRAITE', missionId: task.id } });
        }
      }
    }

    await logAudit(
      req.user?.id,
      'CREATION_MISSION',
      task.id,
      'MISSION',
      `Mission créée: ${task.description || task.reference}`,
      task.dossierId
    );

    // --- Création automatique du sous-dossier GED pour cette mission ---
    if (dossierId) {
      const parentDossier = dossierToUpdate || await prisma.dossier.findUnique({ where: { id: dossierId } });
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

      // Déterminer le nom du propriétaire (client, collab ou interne)
      let ownerName = 'INTERNE';
      if (parentDossier?.clientId) {
        const client = await prisma.client.findUnique({ where: { id: parentDossier.clientId }, select: { name: true, entreprise: { select: { raisonSociale: true } } } });
        ownerName = (client?.entreprise?.raisonSociale || client?.name || 'CLIENT').replace(/\s+/g, '_');
      } else if (parentDossier?.targetUserId) {
        const user = await prisma.utilisateur.findUnique({ where: { id: parentDossier.targetUserId }, select: { name: true } });
        ownerName = (user?.name || 'COLLAB').replace(/\s+/g, '_');
      }

      const missionSubFolderName = `Mission-${ownerName}-${dateStr}`;

      // Vérifier si un dossier du même nom existe déjà dans ce parent
      const existingGedFolder = await prisma.dossier.findFirst({
        where: { name: missionSubFolderName, parentDossierId: dossierId }
      });

      if (existingGedFolder) {
        // Utiliser un suffixe unique basé sur la référence de la mission
        const uniqueName = `${missionSubFolderName}-${task.reference}`;
        const gedRef = await generateReference('dossier', 'DOS');
        await prisma.dossier.create({
          data: {
            reference: gedRef,
            name: uniqueName,
            description: `Sous-dossier GED auto-généré pour la mission ${task.reference}`,
            origin: parentDossier?.origin || 'INTERNE',
            status: 'OUVERT',
            parentDossierId: dossierId,
            isSystem: true,
            createdById: creatorId,
            ...(parentDossier?.clientId && { clientId: parentDossier.clientId }),
            ...(parentDossier?.targetUserId && { targetUserId: parentDossier.targetUserId }),
            ...(parentDossier?.traitantId && { traitantId: parentDossier.traitantId })
          }
        });
      } else {
        const gedRef = await generateReference('dossier', 'DOS');
        await prisma.dossier.create({
          data: {
            reference: gedRef,
            name: missionSubFolderName,
            description: `Sous-dossier GED auto-généré pour la mission ${task.reference}`,
            origin: parentDossier?.origin || 'INTERNE',
            status: 'OUVERT',
            parentDossierId: dossierId,
            isSystem: true,
            createdById: creatorId,
            ...(parentDossier?.clientId && { clientId: parentDossier.clientId }),
            ...(parentDossier?.targetUserId && { targetUserId: parentDossier.targetUserId }),
            ...(parentDossier?.traitantId && { traitantId: parentDossier.traitantId })
          }
        });
      }
    }
    // --- Fin création sous-dossier GED ---

    res.status(201).json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: error.message || 'Erreur lors de la création de la tâche.' });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    
    // ── Vérification Zero-Trust (Accès en Modification) ──────────────────────
    const currentMissionForAuth = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: { dossier: { select: { traitantId: true, status: true } } }
    });
    if (!currentMissionForAuth) return res.status(404).json({ error: 'Mission introuvable.' });
    
    // Empêcher la modification si le parent est clôturé (sauf pour déclôturer par admin)
    if (req.body.status !== 'OUVERT' && (['TERMINE', 'ARCHIVE'].includes(currentMissionForAuth.dossier?.status))) {
        return res.status(403).json({ error: "Action impossible : le dossier parent est clôturé." });
    }
    
    if (req.body.status && currentMissionForAuth.status === req.body.status) {
      return res.status(400).json({ error: "Action impossible : la mission est déjà dans ce statut (peut-être modifiée par un autre utilisateur)." });
    }

    const isAuthorized = 
      isSuperAdmin(userRole) || isAdmin(userRole) ||
      currentMissionForAuth.assignedToId === userId || 
      currentMissionForAuth.createdById === userId ||
      currentMissionForAuth.dossier?.traitantId === userId;
      
    if (!isAuthorized) {
      return res.status(403).json({ error: "Accès refusé. Vous n'avez pas l'autorisation de modifier cette mission." });
    }

    const { status, assignedToId, relecteurId, description, attachment, echeance } = req.body;
    const dataToUpdate = {};
    if (description !== undefined) dataToUpdate.description = description;
    if (attachment !== undefined) dataToUpdate.attachment = attachment;
    if (echeance !== undefined) dataToUpdate.echeance = echeance ? new Date(echeance) : null;

    // Ré-attribution : réservée aux Super-Admin, Admin Tech, Admin et Responsable Op.
    if (assignedToId !== undefined && assignedToId !== currentMissionForAuth.assignedToId) {
      if (!isManager(userRole)) {
        return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas ré-attribuer une mission." });
      }
      if (userRole === 'Responsable opérationnel') {
        const mission = await prisma.mission.findUnique({ where: { id: req.params.id }, include: { dossier: { select: { traitantId: true } } } });
        if (!mission?.dossier || mission.dossier.traitantId !== userId) {
          return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le responsable de ce dossier." });
        }
      }
      dataToUpdate.assignedToId = assignedToId;
    }
    
    if (relecteurId !== undefined && relecteurId !== currentMissionForAuth.relecteurId) {
      if (!isManager(userRole)) {
        return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas assigner un relecteur." });
      }
      dataToUpdate.relecteurId = relecteurId;
    }

    // Statut BLOQUÉ réservé aux Super-Admin / Admin Tech
    if (status === 'BLOQUE' && !isSuperAdmin(userRole)) {
      return res.status(403).json({ error: "Accès refusé. Seul un Super-Administrateur peut bloquer une mission." });
    }
    
    if (status !== undefined) {
      if (status === 'TERMINEE') {
        const incompleteTaches = await prisma.tache.count({
          where: { missionId: req.params.id, status: { notIn: ['TERMINEE', 'ANNULEE'] } }
        });
        if (incompleteTaches > 0) {
          return res.status(400).json({ error: "Impossible de terminer la mission : certaines tâches associées ne sont pas terminées." });
        }
      }
      const currentTask = await prisma.mission.findUnique({ where: { id: req.params.id }, include: { dossier: { select: { traitantId: true } } } });
      if (currentTask && currentTask.status !== status) {
        // Responsable Op. ne peut terminer que les missions de ses dossiers
        if (userRole === 'Responsable opérationnel' && (status === 'TERMINEE' || status === 'EN_ATTENTE' || status === 'ANNULEE')) {
          if (!currentTask.dossier || currentTask.dossier.traitantId !== userId) {
            return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le responsable de cette mission." });
          }
        }
        dataToUpdate.status = status;
        dataToUpdate.previousStatus = currentTask.status;
      }
    }
    
    const task = await prisma.mission.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });

    // ── Notifications Zero-Trust ────────────────────────────────────────────
    if (dataToUpdate.status && dataToUpdate.status !== currentMissionForAuth.status) {
      const missionRef = task.reference || task.id.slice(0, 8).toUpperCase();
      const newStatus = dataToUpdate.status;

      if (newStatus === 'OUVERT' && task.assignedToId) {
        // Mission démarrée: notifier l'assigné
        await notify(task.assignedToId, {
          type: 'TACHE_ASSIGNEE',
          title: 'Mission démarrée',
          message: `La mission ${missionRef} a été démarrée.`,
          targetId: task.id, targetType: 'MISSION'
        });
      }
      if (newStatus === 'TERMINEE') {
        // Mission terminée: notifier le Super-Admin et le responsable du dossier
        const superAdmins = await prisma.utilisateur.findMany({
          where: { role: { name: 'Super-administrateur' } }, select: { id: true }
        });
        const recipients = [...superAdmins.map(u => u.id), currentMissionForAuth.dossier?.traitantId].filter(Boolean);
        if (recipients.length) await notify(recipients, {
          type: 'MISSION_TERMINEE',
          title: 'Mission terminée',
          message: `La mission ${missionRef} a été clôturée avec succès.`,
          targetId: task.id, targetType: 'MISSION'
        });
      }
    }
    // ── Fin Notifications ────────────────────────────────────────────────────

    await logAudit(
      req.user?.id,
      'MODIFICATION_MISSION',
      task.id,
      'MISSION',
      `Mission modifiée (Statut: ${task.status})`,
      task.dossierId
    );

    res.json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut supprimer une mission." });
    }

    const mission = await prisma.mission.delete({
      where: { id: req.params.id }
    });

    await logAudit(
      req.user?.id,
      'SUPPRESSION_MISSION',
      req.params.id,
      'MISSION',
      `Mission supprimée: ${mission.subject || mission.description || mission.id}`,
      mission.dossierId
    );

    res.json({ success: true, message: 'Mission supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});


// ─── TACHES (Nouvelle table) ──────────────────────────────────────────────────

module.exports = router;
