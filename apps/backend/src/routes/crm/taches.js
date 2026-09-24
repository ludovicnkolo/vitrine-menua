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

router.get('/taches', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;

    const where = {};
    // ── Filtrage par rôle (Zero-Trust Interne) ──────────────────────────
    if (req.user.role === 'Responsable opérationnel' || req.user.role === 'Collaborateur') {
      where.OR = [
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { mission: { assignedToId: req.user.id } },
        { mission: { dossier: { traitantId: req.user.id } } }
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
      where.mission = {
        ...where.mission,
        status: { not: 'BLOQUE' },
        dossier: { status: { not: 'BLOQUE' } }
      };
    }
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { reference: { contains: s} },
        { mission: { reference: { contains: s} } },
        { missionId: { contains: s} },
        { createdBy: { name: { contains: s} } },
        { assignedTo: { name: { contains: s} } }
      ];
    }

    const total = await prisma.tache.count({ where });
    const taches = await prisma.tache.findMany({
      where,
      skip,
      take: limit,
      include: {
        mission: { include: { dossier: { select: { name: true, reference: true } } } },
        dossierTache: { include: { subDossiers: true } },
        authorizedDossiers: { include: { subDossiers: true } },
        assignedTo: { select: { id: true, name: true, role: { select: { name: true } } } },
        relecteur: { select: { id: true, name: true, role: { select: { name: true } } } },
        createdBy: { select: { id: true, name: true, role: { select: { name: true } } } }
      },
      orderBy: { reference: 'desc' }
    });
    sendPaginatedResponse(res, taches, total, page, limit);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' });
  }
});

router.post('/taches', async (req, res) => {
  try {
    const userRole = req.user.role;
    // Relecteur et Collaborateur ne peuvent pas créer de tâches
    if (userRole === 'Relecteur' || userRole === 'Collaborateur') {
      return res.status(403).json({ error: "Accès refusé. Vous n'avez pas les droits pour créer une tâche." });
    }

    if (req.body.missionId) {
      const targetMission = await prisma.mission.findUnique({
        where: { id: req.body.missionId },
        include: { dossier: { select: { traitantId: true, status: true } } }
      });
      if (!targetMission) return res.status(404).json({ error: "Mission introuvable." });
      if (['TERMINE', 'ARCHIVE'].includes(targetMission.status) || ['TERMINE', 'ARCHIVE'].includes(targetMission.dossier?.status)) {
        return res.status(403).json({ error: "Action impossible : le parent (mission ou dossier) est clôturé." });
      }
      if (userRole === 'Responsable opérationnel' && (!targetMission.dossier || targetMission.dossier.traitantId !== req.user.id)) {
        return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le responsable du dossier de cette mission." });
      }
    }

    const { missionId, description, assignedToId, relecteurId, echeance, attachment, dossierTacheId, authorizedDossierIds } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('tache', 'TCH');

    const tacheData = {
      reference,
      description,
      missionId,
      assignedToId,
      relecteurId,
      createdById: creatorId,
      status: 'NOUVEAU',
      echeance: echeance ? new Date(echeance) : null,
      attachment
    };

    if (dossierTacheId) {
      tacheData.dossierTacheId = dossierTacheId;
    }

    if (authorizedDossierIds && authorizedDossierIds.length > 0) {
      tacheData.authorizedDossiers = {
        connect: authorizedDossierIds.map(id => ({ id }))
      };
    }

    const tache = await prisma.tache.create({
      data: tacheData
    });

    // Notification : tâche assignée au collaborateur
    if (tache.assignedToId) {
      await notify(tache.assignedToId, {
        type: 'TACHE_ASSIGNEE',
        title: 'Nouvelle tâche assignée',
        message: `Une nouvelle tâche (${tache.reference || tache.id.slice(0,8).toUpperCase()}) vous a été assignée.`,
        targetId: tache.id, targetType: 'TACHE'
      });
    }

    const missionToUpdate = await prisma.mission.findUnique({ where: { id: missionId } });
    if (missionToUpdate && missionToUpdate.status === 'NOUVEAU') {
      await prisma.mission.update({
        where: { id: missionId },
        data: { status: 'OUVERT' }
      });
      // Verbose audit log removed
    }

    await logAudit(
      req.user?.id,
      'CREATION_TACHE',
      tache.id,
      'TACHE',
      `Tâche créée: ${tache.description || tache.reference}`,
      tache.dossierTacheId || null
    );

    res.json(tache);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
  }
});


router.patch('/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback, managerFeedback, echeance, assignedToId, relecteurId, ...rest } = req.body;

    const currentTache = await prisma.tache.findUnique({
      where: { id },
      include: { mission: { include: { dossier: { select: { traitantId: true, status: true } } } } }
    });
    if (!currentTache) return res.status(404).json({ error: 'Tâche introuvable.' });

    if (['TERMINE', 'ARCHIVE'].includes(currentTache.mission?.status) || ['TERMINE', 'ARCHIVE'].includes(currentTache.mission?.dossier?.status)) {
        return res.status(403).json({ error: "Action impossible : le parent (mission ou dossier) est clôturé." });
    }

    // Prévention des actions concurrentes (race conditions) sur le statut
    if (status && currentTache.status === status) {
      return res.status(400).json({ error: "Action impossible : la tâche est déjà dans ce statut (peut-être modifiée par un autre utilisateur)." });
    }

    const userRole = req.user?.role || '';
    const userId = req.user?.id;
    const isSA = isSuperAdmin(userRole);
    const dossierTraitantId = currentTache.mission?.dossier?.traitantId;

    // ── Vérification Zero-Trust (Accès en Modification) ──────────────────────
    const isAuthorized = 
      isSuperAdmin(userRole) || isAdmin(userRole) ||
      currentTache.assignedToId === userId || 
      currentTache.createdById === userId ||
      currentTache.mission?.assignedToId === userId ||
      dossierTraitantId === userId;
      
    if (!isAuthorized) {
      return res.status(403).json({ error: "Accès refusé. Vous n'avez pas l'autorisation de modifier cette tâche." });
    }

    // ── GARDE-FOUS STRICTS PAR RÔLE ──────────────────────────────────────────
    if (status !== undefined && status !== currentTache.status) {

      // Statut BLOQUÉ : Super-Admin et Admin Technique seulement
      if (status === 'BLOQUE' && !isSA) {
        return res.status(403).json({ error: "Accès refusé. Seul un Super-Administrateur peut bloquer une tâche." });
      }

      // ── Collaborateur : transitions autorisées ──────────────────────────────
      if (userRole === 'Collaborateur') {
        const allowedFromCollaborateur = {
          'NOUVEAU': ['EN_COURS'],
          'EN_COURS': ['A_VERIFIER', 'EN_ATTENTE'],
          'EN_ATTENTE': ['EN_COURS'] // reprendre après attente
        };
        const allowed = allowedFromCollaborateur[currentTache.status] || [];
        if (!allowed.includes(status)) {
          return res.status(403).json({ error: `Accès refusé. Un Collaborateur ne peut pas passer une tâche de '${currentTache.status}' à '${status}'.` });
        }
        // Doit être assigné à la tâche
        if (currentTache.assignedToId !== userId) {
          return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas assigné à cette tâche." });
        }
      }

      // ── Relecteur : transitions autorisées ─────────────────────────────────
      else if (userRole === 'Relecteur') {
        const allowedFromRelecteur = {
          'A_VERIFIER': ['FINALISER', 'A_CORRIGER']
        };
        const allowed = allowedFromRelecteur[currentTache.status] || [];
        if (!allowed.includes(status)) {
          return res.status(403).json({ error: `Accès refusé. Un Relecteur ne peut pas passer une tâche de '${currentTache.status}' à '${status}'.` });
        }
      }

      // ── Responsable Opérationnel : transitions autorisées ───────────────────
      else if (userRole === 'Responsable opérationnel') {
        // Doit être responsable du dossier de la mission
        if (dossierTraitantId && dossierTraitantId !== userId) {
          return res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le responsable de ce dossier." });
        }
        const allowedFromManager = {
          'NOUVEAU': ['EN_COURS', 'EN_ATTENTE', 'ANNULEE'],
          'EN_COURS': ['A_VERIFIER', 'EN_ATTENTE', 'ANNULEE'],
          'EN_ATTENTE': ['EN_COURS', 'ANNULEE'],
          'A_VERIFIER': ['FINALISER', 'A_CORRIGER'],
          'FINALISER': ['TERMINE', 'A_CORRIGER'],
          'A_CORRIGER': ['REATTRIBUEE', 'EN_COURS']
        };
        const allowed = allowedFromManager[currentTache.status] || [];
        if (!allowed.includes(status)) {
          return res.status(403).json({ error: `Accès refusé. Un Responsable ne peut pas passer une tâche de '${currentTache.status}' à '${status}'.` });
        }
      }
      // Super-Admin et Admin Tech : toutes les transitions autorisées
    }

    // Build the data payload
    const dataToUpdate = { ...rest };
    if (echeance !== undefined) {
      dataToUpdate.echeance = echeance ? new Date(echeance) : null;
    }
    if (assignedToId !== undefined && assignedToId !== currentTache.assignedToId) {
      if (!isManager(userRole)) {
        return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas ré-attribuer une tâche." });
      }
      dataToUpdate.assignedToId = assignedToId;
    }
    if (relecteurId !== undefined && relecteurId !== currentTache.relecteurId) {
      if (!isManager(userRole)) {
        return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas assigner un relecteur." });
      }
      dataToUpdate.relecteurId = relecteurId;
    }

    if (status !== undefined && status !== currentTache.status) {
      if (status === 'A_CORRIGER' || status === 'REATTRIBUEE') {
         if (managerFeedback) dataToUpdate.managerFeedback = managerFeedback.trim();
      }
      if (status === 'EN_VALIDATION_FINALE' || status === 'A_CORRIGER') {
         if (adminFeedback) dataToUpdate.adminFeedback = adminFeedback.trim();
      }
      dataToUpdate.previousStatus = currentTache.status;
      dataToUpdate.status = status;
    } else if (status !== undefined) {
      if (adminFeedback !== undefined) dataToUpdate.adminFeedback = adminFeedback;
      if (managerFeedback !== undefined) dataToUpdate.managerFeedback = managerFeedback;
    }

    const tache = await prisma.tache.update({
      where: { id },
      data: dataToUpdate
    });
    
    if (status !== undefined && status !== currentTache.status && tache.missionId) {
       await checkAndUpdateMissionStatus(tache.missionId, prisma);
    }

    // ── Notifications Zero-Trust ────────────────────────────────────────────
    if (status !== undefined && status !== currentTache.status) {
      const tacheRef = tache.reference || tache.id.slice(0, 8).toUpperCase();
      // Récupérer le responsable du dossier pour notifier
      const missionWithDossier = await prisma.mission.findUnique({
        where: { id: tache.missionId },
        include: { dossier: { select: { traitantId: true } } }
      });
      const traitantId = missionWithDossier?.dossier?.traitantId;

      if (status === 'A_VERIFIER' && tache.assignedToId) {
        // Notifier le relecteur/responsable : tâche soumise pour relecture
        const targets = [traitantId].filter(Boolean);
        if (targets.length) await notify(targets, {
          type: 'TACHE_A_VERIFIER',
          title: 'Tâche soumise pour relecture',
          message: `La tâche ${tacheRef} a été soumise pour vérification.`,
          targetId: tache.id, targetType: 'TACHE'
        });
      }
      if (status === 'FINALISER') {
        // Notifier le Super-Admin : tâche en validation finale
        const superAdmins = await prisma.utilisateur.findMany({
          where: { role: { name: 'Super-administrateur' } }, select: { id: true }
        });
        if (superAdmins.length) await notify(superAdmins.map(u => u.id), {
          type: 'TACHE_FINALISER',
          title: 'Tâche à valider et clôturer',
          message: `La tâche ${tacheRef} est approuvée et attend votre clôture finale.`,
          targetId: tache.id, targetType: 'TACHE'
        });
      }
      if (status === 'A_CORRIGER' && tache.assignedToId) {
        // Notifier le collaborateur : tâche renvoyée en correction
        await notify(tache.assignedToId, {
          type: 'TACHE_A_CORRIGER',
          title: 'Tâche renvoyée en correction',
          message: `Votre tâche ${tacheRef} a été renvoyée en correction. Veuillez la revoir.`,
          targetId: tache.id, targetType: 'TACHE'
        });
      }
      if (status === 'TERMINE' && tache.assignedToId) {
        // Notifier le collaborateur : tâche validée et clôturée
        await notify(tache.assignedToId, {
          type: 'TACHE_CLOTUREE',
          title: 'Tâche validée et clôturée ✓',
          message: `Votre tâche ${tacheRef} a été validée et clôturée avec succès.`,
          targetId: tache.id, targetType: 'TACHE'
        });
      }
    }
    // ── Fin Notifications ────────────────────────────────────────────────────

    await logAudit(
      req.user?.id,
      'MODIFICATION_TACHE',
      tache.id,
      'TACHE',
      `Tâche modifiée (Statut: ${tache.status})`,
      tache.dossierTacheId || null
    );

    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/taches/:id', async (req, res) => {
  try {
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut supprimer une tâche." });
    }
    
    const tache = await prisma.tache.delete({
      where: { id: req.params.id }
    });

    await logAudit(
      req.user?.id,
      'SUPPRESSION_TACHE',
      req.params.id,
      'TACHE',
      `Tâche supprimée: ${tache.description || tache.reference || tache.id}`,
      tache.dossierTacheId || null
    );

    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- DOCUMENTS ---
// Attacher un fichier (déjà uploadé via /api/files/upload) à un dossier ou une mission

module.exports = router;
