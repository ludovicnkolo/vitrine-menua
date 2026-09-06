const express = require('express');
const prisma = require('../prisma');
const crypto = require('node:crypto');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('node:fs');
const path = require('node:path');
const router = express.Router();

const { authenticateJWT, requireRoles } = require('../middlewares/auth');
const { transporter } = require('../utils/mailer');

const logAudit = async (userId, action, targetId, targetType, details, dossierId = null) => {
  try {
    const validUserId = (userId && userId !== 'MASTER-ADMIN') ? userId : null;
    await prisma.auditLog.create({
      data: {
        userId: validUserId,
        action,
        targetId: targetId ? String(targetId) : null,
        targetType,
        details: details || '',
        dossierId
      }
    });
  } catch (err) {
    console.error('[AUDIT ERROR]', err.message);
  }
};

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
router.get('/roles', async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/roles', requireRoles('Super-administrateur', 'Administrateur technique'), async (req, res) => {
  try {
    const { name, permissions, description, status } = req.body;
    const role = await prisma.role.create({
      data: { name, permissions, description, status: status || 'Actif' }
    });
    await logAudit(req.user?.id, 'CREATION_ROLE', role.id, 'ROLE', `Rôle créé : ${role.name}`);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/roles/:id', requireRoles('Super-administrateur', 'Administrateur technique'), async (req, res) => {
  try {
    const { name, permissions, description, status } = req.body;
    const role = await prisma.role.update({
      where: { id: req.params.id },
      data: { 
        ...(name && { name }), 
        ...(permissions !== undefined && { permissions }), 
        ...(description !== undefined && { description }), 
        ...(status && { status }) 
      }
    });
    await logAudit(req.user?.id, 'MODIFICATION_ROLE', role.id, 'ROLE', `Rôle modifié : ${role.name}`);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/roles/:id', requireRoles('Super-administrateur', 'Administrateur technique'), async (req, res) => {
  try {
    const existing = await prisma.role.findUnique({ where: { id: req.params.id } });
    await prisma.role.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.id, 'SUPPRESSION_ROLE', req.params.id, 'ROLE', `Rôle supprimé : ${existing?.name || req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DASHBOARD STATS (TOUR DE CONTROLE) ---
router.get('/dashboard-stats', async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 1. Radar des Urgences et Engagements (SLAs)
    const urgentsFormulaires = await prisma.formulaire.count({ where: { status: { not: 'TRAITE' }, priority: 'URGENT' } });
    const urgentsMessages = await prisma.messagePersonnel.count({ where: { status: { not: 'TRAITE' }, priorite: 'URGENT' } });
    const alertesPrioritaires = urgentsFormulaires + urgentsMessages;

    const tachesCritiques = await prisma.tache.count({
      where: {
        status: { notIn: ['TERMINEE', 'ARCHIVE'] },
        echeance: { lte: twentyFourHoursFromNow }
      }
    });
    const missionsCritiques = await prisma.mission.count({
      where: {
        status: { notIn: ['TERMINEE', 'ANNULEE'] },
        echeance: { lte: twentyFourHoursFromNow }
      }
    });
    const delaisCritiques = tachesCritiques + missionsCritiques;

    // 2. Santé des Opérations (Détection des goulots)
    const dossiersBloques = await prisma.dossier.count({ where: { status: 'EN_ATTENTE_CLIENT' } });
    const tachesBloquees = await prisma.tache.count({ where: { status: 'BLOQUEE' } });
    const operationsBloquees = dossiersBloques + tachesBloquees;

    const verificationsEnAttente = await prisma.tache.count({
      where: { status: 'A_CONTROLER' }
    });

    // 3. Flux d'Acquisition (Lien Magique)
    // On simule par les documents récents créés par des clients
    const nouveauxDepots = await prisma.document.count({
      where: { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } }
    });

    // 4. Météo de Charge (Gestion RH & Capacité)
    const activeUsers = await prisma.utilisateur.findMany({
      where: { isBlocked: false, role: { name: { not: 'Client' } } },
      select: { id: true, name: true }
    });
    const userTaches = await prisma.tache.findMany({
      where: { assignedToId: { in: activeUsers.map(u => u.id) }, status: 'EN_COURS' },
      select: { assignedToId: true }
    });
    
    const meteoCharge = activeUsers.map(u => {
      const count = userTaches.filter(t => t.assignedToId === u.id).length;
      let etat = 'VERT';
      if (count > 5) etat = 'ROUGE';
      else if (count >= 3) etat = 'ORANGE';
      return { name: u.name, tachesEnCours: count, etat };
    });

    // 5. Entonnoir de Production (Période)
    const startDateQuery = req.query.startDate;
    const endDateQuery = req.query.endDate;
    
    let startPeriod, endPeriod;
    
    if (startDateQuery) {
      startPeriod = new Date(startDateQuery);
      startPeriod.setHours(0,0,0,0);
    } else {
      startPeriod = new Date(now);
      startPeriod.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Lundi
      startPeriod.setHours(0,0,0,0);
    }
    
    if (endDateQuery) {
      endPeriod = new Date(endDateQuery);
      endPeriod.setHours(23,59,59,999);
    } else {
      endPeriod = new Date(now);
    }

    const messagesTraitesPeriode = await prisma.formulaire.count({ where: { status: 'TRAITE', updatedAt: { gte: startPeriod, lte: endPeriod } } }) +
                                   await prisma.messagePersonnel.count({ where: { status: 'TRAITE', createdAt: { gte: startPeriod, lte: endPeriod } } });
    
    const missionsDemarreesPeriode = await prisma.mission.count({ where: { createdAt: { gte: startPeriod, lte: endPeriod } } });
    const tachesCompleteesPeriode = await prisma.tache.count({ where: { status: 'TERMINEE', updatedAt: { gte: startPeriod, lte: endPeriod } } });
    const dossiersCloturesPeriode = await prisma.dossier.count({ where: { status: 'CLOTURE', updatedAt: { gte: startPeriod, lte: endPeriod } } });

    res.json({
      alertesPrioritaires,
      delaisCritiques,
      operationsBloquees,
      verificationsEnAttente,
      nouveauxDepots,
      meteoCharge,
      entonnoirPeriode: [
        { name: 'Messages Traités', value: messagesTraitesPeriode },
        { name: 'Missions Démarrées', value: missionsDemarreesPeriode },
        { name: 'Tâches Terminées', value: tachesCompleteesPeriode },
        { name: 'Dossiers Clôturés', value: dossiersCloturesPeriode }
      ]
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur de chargement des statistiques', details: e.message, stack: e.stack });
  }
});

// --- UTILISATEURS ---
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: { id: true, name: true, email: true, roleId: true, role: true, profile: true, idCardUrl: true, isBlocked: true, lastLogin: true, createdAt: true, telephone: true, lieuResidence: true, experienceCle: true, langues: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/users', requireRoles('Super-administrateur', 'Responsable opérationnel'), async (req, res) => {
  try {
    const { name, email, roleId, phone, country, city, education, status, profile, idCardUrl, telephone, lieuResidence, experienceCle, langues } = req.body;
    const bcrypt = require('bcryptjs');
    const crypto = require('node:crypto');

    if (!name || !email) {
      return res.status(400).json({ error: 'Le nom et l\'email sont obligatoires.' });
    }

    // --- Validation unicité email et téléphone ---
    const existingEmail = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: `Un collaborateur avec l'email "${email}" existe déjà.` });
    }

    const tel = telephone || phone || null;
    if (tel) {
      const normalizedTel = tel.replace(/\s/g, '');
      const existingTel = await prisma.utilisateur.findFirst({ where: { telephone: { equals: normalizedTel } } });
      if (existingTel) {
        return res.status(409).json({ error: `Un collaborateur avec le numéro "${tel}" existe déjà.` });
      }
    }

    // Generate token for password setup
    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    // Default fallback password in case they don't use the link
    const hashedPassword = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10); 
    
    // Statut par défaut : Inactif (isBlocked=true) sauf si l'admin choisit explicitement Actif au moment de la création
    const isBlockedDefault = status === 'Actif' ? false : true;

    const user = await prisma.utilisateur.create({
      data: {
        name,
        email,
        password: hashedPassword,
        resetToken: token,
        resetTokenExpiry,
        roleId: roleId || null,
        telephone: tel,
        lieuResidence: lieuResidence || null,
        experienceCle: experienceCle || null,
        langues: langues || null,
        profile: profile || '',
        idCardUrl: idCardUrl || null,
        isBlocked: isBlockedDefault
      }
    });
    
    await logAudit(req.user?.id, 'CREATION_UTILISATEUR', user.id, 'USER', `Utilisateur créé : ${user.name} (${user.email})`);

    // Send email — Use ADMIN_FRONTEND_URL env var (the CRM admin frontend, NOT the backend)
    try {
      const adminFrontend = process.env.ADMIN_FRONTEND_URL || 'http://localhost:5173';
      const setupUrl = `${adminFrontend}/setup-password?token=${token}`;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'contact@menuaconsulting.com',
        to: email,
        subject: 'Création de votre compte Menua Consulting',
        html: `
          <h3>Bienvenue ${name},</h3>
          <p>Un compte collaborateur a été créé pour vous sur l'espace Menua Consulting.</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour configurer votre mot de passe :</p>
          <a href="${setupUrl}" style="display:inline-block;padding:10px 20px;background:#141824;color:#fff;text-decoration:none;border-radius:4px;">Créer mon mot de passe</a>
          <p>Ce lien est valable 24 heures.</p>
          <p style="color:#666;font-size:0.85em;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : ${setupUrl}</p>
        `
      });
    } catch (emailErr) {
      console.error("Erreur lors de l'envoi de l'email de configuration:", emailErr);
    }
    
    res.json(user);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
  }
});


router.patch('/users/:id', requireRoles('Super-administrateur', 'Responsable opérationnel'), async (req, res) => {
  try {
    const { name, email, roleId, profile, status, idCardUrl, telephone, lieuResidence, experienceCle, langues } = req.body;
    const user = await prisma.utilisateur.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(roleId !== undefined && { roleId }),
        ...(profile !== undefined && { profile }),
        ...(telephone !== undefined && { telephone }),
        ...(lieuResidence !== undefined && { lieuResidence }),
        ...(experienceCle !== undefined && { experienceCle }),
        ...(langues !== undefined && { langues }),
        ...(idCardUrl !== undefined && { idCardUrl }),
        ...(status && { isBlocked: status === 'Inactif' })
      }
    });
    await logAudit(req.user?.id, 'MODIFICATION_UTILISATEUR', user.id, 'USER', `Utilisateur modifié : ${user.name}`);
    res.json(user);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

router.delete('/users/:id', requireRoles('Super-administrateur', 'Responsable opérationnel'), async (req, res) => {
  try {
    const existing = await prisma.utilisateur.findUnique({ where: { id: req.params.id } });
    await prisma.utilisateur.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.id, 'SUPPRESSION_UTILISATEUR', req.params.id, 'USER', `Utilisateur supprimé : ${existing?.name || req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- CLIENTS (Externes) ---
router.get('/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({ include: { entreprise: true } });
    res.json(clients);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const { name, email, telephone, contactSecondaire, secteurActivite, description, type, siret, raisonSociale, emailEntreprise, telephoneEntreprise } = req.body;
    const client = await prisma.client.create({
      data: {
        name,
        email,
        telephone: telephone || null,
        contactSecondaire: contactSecondaire || null,
        secteurActivite: secteurActivite || null,
        description: description || null,
        type: type || 'PARTICULIER',
        status: 'ACTIF',
        ...(type === 'Société' && {
          entreprise: {
            create: {
              siret: siret || null,
              raisonSociale: raisonSociale || null,
              emailEntreprise: emailEntreprise || null,
              telephoneEntreprise: telephoneEntreprise || null
            }
          }
        })
      }
    });
    await logAudit(req.user?.id, 'CREATION_CLIENT', client.id, 'CLIENT', `Client créé : ${client.name} (${client.type})`);
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      const duplicateField = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'email';
      return res.status(409).json({ error: `Un client existe déjà avec cette donnée (${duplicateField}).` });
    }
    res.status(500).json({ error: 'Impossible de créer le client. Vérifiez les données saisies et réessayez.' });
  }
});

router.patch('/clients/:id', async (req, res) => {
  try {
    const { name, email, telephone, contactSecondaire, secteurActivite, description, type, siret, raisonSociale, emailEntreprise, telephoneEntreprise, status } = req.body;
    
    // Si c'est une société, on met à jour ou crée les données de l'entreprise
    let entrepriseUpdate = undefined;
    if (type === 'Société') {
      entrepriseUpdate = {
        upsert: {
          create: { siret, raisonSociale, emailEntreprise, telephoneEntreprise },
          update: { siret, raisonSociale, emailEntreprise, telephoneEntreprise }
        }
      };
    }

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
        ...(contactSecondaire !== undefined && { contactSecondaire }),
        ...(secteurActivite !== undefined && { secteurActivite }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(status && { status }),
        ...(entrepriseUpdate && { entreprise: entrepriseUpdate })
      }
    });
    await logAudit(req.user?.id, 'MODIFICATION_CLIENT', client.id, 'CLIENT', `Client modifié : ${client.name}`);
    res.json(client);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

router.delete('/clients/:id', requireRoles('Super-administrateur', 'Responsable opérationnel'), async (req, res) => {
  try {
    const existing = await prisma.client.findUnique({ where: { id: req.params.id } });
    await prisma.client.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.id, 'SUPPRESSION_CLIENT', req.params.id, 'CLIENT', `Client supprimé : ${existing?.name || req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- DOSSIERS ---
router.get('/dossiers', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status, role, origin } = req.query;



    let inMemoryFilter = false;
    const where = {};
    if (req.query.rootOnly === 'true') {
      where.parentDossierId = null;
      if (req.user.role === 'Responsable opérationnel') {
        // Only sees dossiers where they are explicitly the traitant, or have a mission
        where.OR = [
          { traitantId: req.user.id },
          { missions: { some: { assignedToId: req.user.id } } }
        ];
      } else if (req.user.role === 'Relecteur' || req.user.role === 'Collaborateur') {
        // Only sees dossiers where they have a task assigned
        where.OR = [
          { missions: { some: { taches: { some: { assignedToId: req.user.id } } } } }
        ];
      }
    } else {
      if (req.user.role === 'Responsable opérationnel' || req.user.role === 'Relecteur' || req.user.role === 'Collaborateur') {
        inMemoryFilter = true;
      }
    }

    if (status && status !== 'all') where.status = status;
    if (origin && origin !== 'all') where.origin = origin;
    if (role && role !== 'all') {
      where.createdBy = { role: { name: role } };
    }
    
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { id: { contains: s} },
        { reference: { contains: s} },
        { name: { contains: s} },
        { createdBy: { name: { contains: s} } }
      ];
    }
    
    let total = await prisma.dossier.count({ where });
    let dossiers = await prisma.dossier.findMany({
      where,
      skip: inMemoryFilter ? undefined : skip,
      take: inMemoryFilter ? undefined : limit,
      orderBy: { reference: 'desc' },
      include: { 
        traitant: { include: { role: true } },
        missions: {
          include: { assignedTo: { include: { role: true } }, taches: true }
        },
        authorizedForMissions: {
          include: { assignedTo: true, taches: true }
        },
        missionsLinked: {
          include: { assignedTo: true, taches: true }
        },
        tachesLinked: {
          include: { assignedTo: true }
        },
        authorizedForTaches: {
          include: { assignedTo: true }
        },
        client: true, 
        createdBy: { include: { role: true } },
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } },
        subDossiers: { include: { subDossiers: true } },
        parentDossier: true
      }
    });

    if (inMemoryFilter) {
      let accessibleSet = new Set();
      const dossiersMap = new Map();
      dossiers.forEach(d => dossiersMap.set(d.id, d));
      
      const getDescendants = (folderId) => {
        let desc = [];
        dossiers.forEach(d => {
          if (d.parentDossierId === folderId) {
            desc.push(d.id);
            desc = desc.concat(getDescendants(d.id));
          }
        });
        return desc;
      };

      const getAncestors = (folderId) => {
        let anc = [];
        let current = dossiersMap.get(folderId);
        while (current && current.parentDossierId) {
          anc.push(current.parentDossierId);
          current = dossiersMap.get(current.parentDossierId);
        }
        return anc;
      };

      // writeSet: dossiers where user can create sub-folders and upload files
      const writeSet = new Set();

      dossiers.forEach(d => {
        // --- Traitant: sees + writes all descendants of this dossier ---
        if (d.traitantId === req.user.id) {
          accessibleSet.add(d.id);
          writeSet.add(d.id);
          getDescendants(d.id).forEach(id => { accessibleSet.add(id); writeSet.add(id); });
          getAncestors(d.id).forEach(id => accessibleSet.add(id)); // ancestors: nav only
          return;
        }

        // --- Mission/Tache assigned: authorized dossiers visible + dossier mission writable ---
        let isAuthorized = false;
        if (d.authorizedForMissions && d.authorizedForMissions.some(m => m.assignedToId === req.user.id)) isAuthorized = true;
        if (d.missionsLinked && d.missionsLinked.some(m => m.assignedToId === req.user.id)) isAuthorized = true;
        if (d.authorizedForTaches && d.authorizedForTaches.some(t => t.assignedToId === req.user.id)) isAuthorized = true;
        if (d.tachesLinked && d.tachesLinked.some(t => t.assignedToId === req.user.id)) isAuthorized = true;
        
        if (req.user.role === 'Relecteur' || req.user.role === 'Collaborateur') {
          if (d.authorizedForMissions && d.authorizedForMissions.some(m => m.taches.some(t => t.assignedToId === req.user.id))) isAuthorized = true;
          if (d.missionsLinked && d.missionsLinked.some(m => m.taches.some(t => t.assignedToId === req.user.id))) isAuthorized = true;
        }
        
        if (isAuthorized) {
          accessibleSet.add(d.id);
          getDescendants(d.id).forEach(id => accessibleSet.add(id));
          getAncestors(d.id).forEach(id => accessibleSet.add(id)); // nav only, read-only

          // Write access only on the explicit dossierMission / dossierTache
          if (d.missionsLinked && d.missionsLinked.some(m => m.assignedToId === req.user.id)) {
            writeSet.add(d.id);
            getDescendants(d.id).forEach(id => writeSet.add(id));
          }
          if (d.tachesLinked && d.tachesLinked.some(t => t.assignedToId === req.user.id)) {
            writeSet.add(d.id);
            getDescendants(d.id).forEach(id => writeSet.add(id));
          }
        } else {
          // Dossier that directly holds a mission assigned to user (root-level mission, no sub-dossier)
          const hasMissionOnRoot = (d.missions && d.missions.some(m => m.assignedToId === req.user.id))
            || ((req.user.role === 'Relecteur' || req.user.role === 'Collaborateur') && d.missions && d.missions.some(m => m.taches.some(t => t.assignedToId === req.user.id)));
          
          if (hasMissionOnRoot) {
            accessibleSet.add(d.id);
          }
        }
      });

      dossiers = dossiers.filter(d => accessibleSet.has(d.id));
      
      // Use the writeSet computed during access resolution
      const isSuperAdm = req.user.role === 'Super-administrateur' || req.user.role === 'Administrateur';
      dossiers = dossiers.map(d => ({
        ...d,
        canWrite: isSuperAdm || writeSet.has(d.id)
      }));

      total = dossiers.length;
      if (limit) dossiers = dossiers.slice(skip, skip + limit);
    }

    sendPaginatedResponse(res, dossiers, total, page, limit);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

// Force nodemon restart to load new Prisma Client
router.post('/dossiers', async (req, res) => {
  try {
    if (req.user.role !== 'Super-administrateur' && req.user.role !== 'Administrateur') {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut créer un dossier." });
    }

    const { name, description, priority, origin, categorie } = req.body;
    const creatorId = await resolveCreatorId(req);
    const isSubFolder = req.body.parentDossierId ? true : false;
    const reference = isSubFolder 
      ? await generateSubDossierReference(req.body.parentDossierId)
      : await generateReference('dossier', 'DOS');

    let traitantId = req.body.traitantId || null;
    if (traitantId === 'MASTER-ADMIN') traitantId = creatorId;

    let targetUserId = req.body.targetUserId || null;
    if (targetUserId === 'MASTER-ADMIN') targetUserId = creatorId;

    const defaultSubFolders = (categorie === 'Dossiers clients' && !req.body.parentDossierId)
      ? ['ADMINISTRATION & FINANCES', 'OPÉRATIONS & RÉALISATIONS', 'RELATIONS & DÉVELOPPEMENT']
      : [];

    // Use a transaction to atomically create the main dossier + all GED sub-folders
    const dossier = await prisma.$transaction(async (tx) => {
      const created = await tx.dossier.create({
        data: {
          reference,
          name,
          description,
          priority: priority || 'NORMAL',
          status: 'NOUVEAU',
          origin: origin || 'INTERNE',
          createdById: creatorId,
          traitantId: traitantId,
          clientId: req.body.clientId || null,
          targetUserId: targetUserId,
          parentDossierId: req.body.parentDossierId || null,
          categorie: categorie || null
        }
      });

      // Create default GED sub-folders with deterministic references (index-based, no DB query)
      for (let i = 0; i < defaultSubFolders.length; i++) {
        const subRef = `${reference}-${String(i + 1).padStart(2, '0')}`;
        await tx.dossier.create({
          data: {
            reference: subRef,
            name: defaultSubFolders[i],
            description: `Sous-dossier par défaut: ${defaultSubFolders[i]}`,
            priority: priority || 'NORMAL',
            status: 'OUVERT',
            origin: origin || 'INTERNE',
            createdById: creatorId,
            traitantId: traitantId,
            clientId: req.body.clientId || null,
            targetUserId: targetUserId,
            parentDossierId: created.id,
            categorie: categorie || null
          }
        });
      }

      return created;
    });

    await prisma.auditLog.create({ data: { userId: creatorId, action: 'CREATION_DOSSIER', targetId: dossier.id, targetType: 'DOSSIER', details: `Dossier créé: ${dossier.name}`, dossierId: dossier.id }});

    res.status(201).json(dossier);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création du dossier.' });
  }
});

router.get('/dashboard-stats', async (req, res) => {
  try {
    const dossiersCount = await prisma.dossier.count();
    const tasksCount = await prisma.mission.count();
    const clientsCount = await prisma.client.count();
    const messagesCount = await prisma.messagePersonnel.count();
    res.json({ dossiers: dossiersCount, tasks: tasksCount, clients: clientsCount, messages: messagesCount });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
  }
});

// --- AUDIT LOGS ---
router.get('/audit', requireRoles('Super-administrateur', 'Administrateur technique'), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200 // limit to last 200 for performance
    });
    res.json(logs);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération du journal d\'audit.' });
  }
});

router.patch('/dossiers/:id', async (req, res) => {
  try {
    if (req.user.role !== 'Super-administrateur' && req.user.role !== 'Administrateur') {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut modifier un dossier." });
    }

    const { status, name, description, traitantId } = req.body;
    const updateData = {};
    if (status !== undefined) {
      if (status === 'CLOTURE' || status === 'ARCHIVE') {
        const incompleteMissions = await prisma.mission.count({
          where: { dossierId: req.params.id, status: { notIn: ['TERMINEE', 'ANNULEE'] } }
        });
        const incompleteTaches = await prisma.tache.count({
          where: { dossierId: req.params.id, status: { notIn: ['TERMINEE', 'ANNULEE'] } }
        });
        if (incompleteMissions > 0 || incompleteTaches > 0) {
          return res.status(400).json({ error: "Impossible de clôturer ou d'archiver le dossier : des missions ou tâches ne sont pas terminées." });
        }
      }
      updateData.status = status;
    }
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (traitantId !== undefined) {
      updateData.traitantId = traitantId === 'MASTER-ADMIN' ? await resolveCreatorId(req) : traitantId;
    }

    const dossier = await prisma.dossier.update({
      where: { id: req.params.id },
      data: updateData
    });

    let validUserId = req.user.id;
    if (validUserId === 'MASTER-ADMIN') {
      const masterUser = await prisma.utilisateur.findFirst();
      validUserId = masterUser ? masterUser.id : null;
    }

    try {
      await prisma.auditLog.create({ 
        data: { 
          userId: validUserId, 
          action: 'MODIFICATION_DOSSIER', 
          targetId: dossier.id, 
          targetType: 'DOSSIER', 
          details: `Dossier modifié: ${name || dossier.name}`, 
          dossierId: dossier.id 
        }
      });
    } catch(auditErr) {
      console.warn("Audit log creation failed:", auditErr);
    }

    res.json(dossier);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier.' });
  }
});

router.delete('/dossiers/:id', async (req, res) => {
  try {
    if (req.user.role !== 'Super-administrateur' && req.user.role !== 'Administrateur') {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut supprimer un dossier." });
    }
    
    await prisma.dossier.deleteMany({
      where: { parentDossierId: req.params.id }
    });
    const dossier = await prisma.dossier.delete({
      where: { id: req.params.id }
    });

    try {
      await prisma.auditLog.create({ 
        data: { 
          userId: req.user.id, 
          action: 'SUPPRESSION_DOSSIER', 
          targetId: req.params.id, 
          targetType: 'DOSSIER', 
          details: `Dossier supprimé: ${dossier.name}` 
        }
      });
    } catch(e) {}

    res.json({ success: true, message: 'Dossier supprimé' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

router.get('/dossiers/:id/tree', async (req, res) => {
  try {
    const allDossiers = await prisma.dossier.findMany({
      select: { id: true, name: true, parentDossierId: true, reference: true }
    });
    
    const buildTree = (parentId) => {
      return allDossiers
        .filter(d => d.parentDossierId === parentId)
        .map(d => ({
          ...d,
          subDossiers: buildTree(d.id)
        }));
    };
    
    const rootDossier = allDossiers.find(d => d.id === req.params.id);
    if (!rootDossier) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }
    
    rootDossier.subDossiers = buildTree(rootDossier.id);
    res.json(rootDossier);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération de l\'arborescence.' });
  }
});

// --- TÂCHES ---
router.get('/tasks', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;



    const where = { parentMissionId: null }; // Only parent tasks

    if (req.user.role === 'Responsable opérationnel') {
      where.OR = [
        { dossier: { origin: { not: 'INTERNE' } } },
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { taches: { some: { assignedToId: req.user.id } } }
      ];
    } else if (req.user.role === 'Relecteur' || req.user.role === 'Collaborateur') {
      where.OR = [
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { taches: { some: { assignedToId: req.user.id } } }
      ];
    }

    if (status && status !== 'all') where.status = status;
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
        createdBy: { include: { role: true } },
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: 'desc' } },
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
    const { dossierId, description, assignedToId, parentMissionId, echeance, attachment, messageId, dossierMissionId, authorizedDossierIds } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('mission', 'MSN');

    const task = await prisma.mission.create({
      data: {
        reference,
        description,
        dossierId,
        assignedToId,
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

    res.status(201).json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: error.message || 'Erreur lors de la création de la tâche.' });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const { status, assignedToId, description, attachment } = req.body;
    const dataToUpdate = { assignedToId };
    if (description !== undefined) dataToUpdate.description = description;
    if (attachment !== undefined) dataToUpdate.attachment = attachment;
    
    if (status !== undefined) {
      if (status === 'TERMINEE') {
        const incompleteTaches = await prisma.tache.count({
          where: { missionId: req.params.id, status: { notIn: ['TERMINEE', 'ANNULEE'] } }
        });
        if (incompleteTaches > 0) {
          return res.status(400).json({ error: "Impossible de terminer la mission : certaines tâches associées ne sont pas terminées." });
        }
      }
      const currentTask = await prisma.mission.findUnique({ where: { id: req.params.id } });
      if (currentTask && currentTask.status !== status) {
        dataToUpdate.status = status;
        dataToUpdate.previousStatus = currentTask.status;
      }
    }
    
    const task = await prisma.mission.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });
    res.json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    if (req.user.role !== 'Super-administrateur' && req.user.role !== 'Administrateur') {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut supprimer une mission." });
    }

    const mission = await prisma.mission.delete({
      where: { id: req.params.id }
    });

    try {
      await prisma.auditLog.create({ 
        data: { 
          userId: req.user.id, 
          action: 'SUPPRESSION_MISSION', 
          targetId: req.params.id, 
          targetType: 'MISSION', 
          details: `Mission supprimée: ${mission.subject || mission.id}` 
        }
      });
    } catch(e) {}

    res.json({ success: true, message: 'Mission supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});


// ─── TACHES (Nouvelle table) ──────────────────────────────────────────────────
router.get('/taches', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;

    const where = {};
    if (req.user.role === 'Collaborateur') {
      where.assignedToId = req.user.id;
    } else if (req.user.role === 'Responsable opérationnel') {
      where.OR = [
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { mission: { assignedToId: req.user.id } }
      ];
    } else if (req.user.role === 'Relecteur') {
      where.OR = [
        { assignedToId: req.user.id },
        { createdById: req.user.id },
        { mission: { assignedToId: req.user.id } }
      ];
    }

    if (status && status !== 'all') where.status = status;
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
        mission: true,
        dossierTache: { include: { subDossiers: true } },
        authorizedDossiers: { include: { subDossiers: true } },
        assignedTo: { select: { id: true, name: true, role: true } },
        createdBy: { select: { id: true, name: true } }
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
    const { missionId, description, assignedToId, echeance, attachment, dossierTacheId, authorizedDossierIds } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('tache', 'TCH');

    const tacheData = {
      reference,
      description,
      missionId,
      assignedToId,
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

    res.json(tache);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
  }
});


async function checkAndUpdateMissionStatus(missionId, prisma) {
  const mission = await prisma.mission.findUnique({ where: { id: missionId }, include: { taches: true, dossier: { include: { missions: true } } } });
  if (!mission) return;

  const allTaches = mission.taches;
  let newStatus = mission.status;

  if (allTaches.length > 0 && allTaches.every(t => t.status === 'TERMINEE')) {
    newStatus = 'TERMINEE';
  } else if (mission.status === 'NON_DEMARREE' && allTaches.some(t => t.status !== 'NOUVEAU')) {
    newStatus = 'EN_COURS';
  } else if (mission.status === 'TERMINEE' && allTaches.some(t => t.status !== 'TERMINEE')) {
    newStatus = 'EN_COURS';
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({ where: { id: mission.id }, data: { status: newStatus, previousStatus: mission.status } });
    if (newStatus === 'TERMINEE' && mission.dossier) {
       checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (newStatus === 'EN_COURS' && mission.dossier && mission.dossier.status === 'NOUVEAU') {
       await prisma.dossier.update({ where: { id: mission.dossier.id }, data: { status: 'OUVERT' } });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prisma) {
  const freshDossier = await prisma.dossier.findUnique({ where: { id: dossier.id }, include: { missions: true } });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions;
  if (allMissions.length > 0 && allMissions.every(m => m.status === 'TERMINEE')) {
    if (freshDossier.status !== 'CLOTURE' && freshDossier.status !== 'ARCHIVE' && freshDossier.status !== 'BLOQUE') {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'CLOTURE', previousStatus: freshDossier.status } });
    }
  } else if (freshDossier.status === 'CLOTURE' && allMissions.some(m => m.status !== 'TERMINEE')) {
       await prisma.dossier.update({ where: { id: freshDossier.id }, data: { status: 'OUVERT', previousStatus: freshDossier.status } });
  }
}

router.patch('/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback, managerFeedback, ...rest } = req.body;

    const currentTache = await prisma.tache.findUnique({ where: { id } });
    if (!currentTache) return res.status(404).json({ error: 'Tâche introuvable.' });

    const userRole = req.user?.role || '';
    const isSuperAdmin = userRole === 'Super-administrateur' || req.user?.id === 'MASTER-ADMIN';
    const isController = userRole === 'Relecteur' || userRole === 'Responsable opérationnel' || isSuperAdmin;

    // Build the data payload
    const dataToUpdate = { ...rest };

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

    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/taches/:id', async (req, res) => {
  try {
    if (req.user.role !== 'Super-administrateur' && req.user.role !== 'Administrateur') {
      return res.status(403).json({ error: "Accès refusé. Seul un administrateur peut supprimer une tâche." });
    }
    
    const tache = await prisma.tache.delete({
      where: { id: req.params.id }
    });

    try {
      await prisma.auditLog.create({ 
        data: { 
          userId: req.user.id, 
          action: 'SUPPRESSION_TACHE', 
          targetId: req.params.id, 
          targetType: 'TACHE', 
          details: `Tâche supprimée: ${tache.subject || tache.id}` 
        }
      });
    } catch(e) {}

    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- DOCUMENTS ---
// Attacher un fichier (déjà uploadé via /api/files/upload) à un dossier ou une mission
router.post('/documents', async (req, res) => {
  try {
    const { name, filename, bucket, dossierId, missionId } = req.body;
    const creatorId = await resolveCreatorId(req);
    if (!filename || (!dossierId && !missionId)) {
      return res.status(400).json({ error: 'filename et dossierId ou missionId sont requis.' });
    }
    const document = await prisma.document.create({
      data: {
        name: name || filename,
        url: `${bucket || 'formulaires'}/${filename}`,
        uploadedById: creatorId,
        ...(dossierId && { dossierId }),
        ...(missionId && { missionId })
      },
      include: { uploadedBy: true }
    });
    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du document: ' + error.message });
  }
});

// Lister les documents d'une entité
router.get('/documents/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const where = type === 'dossier' ? { dossierId: id } : { missionId: id };
    const docs = await prisma.document.findMany({
      where,
      include: { uploadedBy: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents.' });
  }
});

router.delete('/documents/:id', async (req, res) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) return res.status(404).json({ error: 'Document introuvable.' });
    
    await prisma.document.delete({ where: { id: req.params.id } });
    
    try {
      const { deleteFromS3 } = require('../services/s3Service');
      await deleteFromS3(doc.url);
    } catch (fsErr) {
      console.error("Erreur de suppression S3 du fichier:", fsErr);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du document.' });
  }
});

// --- MESSAGES (FORMULAIRES) ---
router.post('/messages/interne', async (req, res) => {
  try {
    const { subType, objet, bodyText, attachment, dossierId, missionId, tacheId, assignedToId } = req.body;
    // [SECURITY] req.body intentionally not logged — contains PII (names, message content)
    
    // Récupérer les infos complètes de l'expéditeur
    let senderName = req.user?.id === 'MASTER-ADMIN' ? (process.env.MASTER_ADMIN_NAME || 'Super Administrateur') : 'Administrateur';
    let senderEmail = req.user?.email || 'admin@menua';
    let senderRole = req.user?.role || 'Admin';

    if (req.user?.id && req.user.id !== 'MASTER-ADMIN') {
      const dbUser = await prisma.utilisateur.findUnique({
        where: { id: req.user.id },
        include: { role: true }
      });
      if (dbUser) {
        senderName = dbUser.name;
        senderEmail = dbUser.email;
        senderRole = dbUser.role?.name || 'Sans rôle';
      }
    }

    const message = await prisma.messagePersonnel.create({
      data: {
        messageId: crypto.randomUUID(),
        type: 'INTERNE',
        subType: subType || 'SMS Collaborateur',
        nomPrenom: senderName,
        email: senderEmail,
        objet: objet,
        bodyText: bodyText,
        attachment: attachment,
        status: 'EN_ATTENTE',
        dossierId: dossierId || null,
        missionId: missionId || null,
        tacheId: tacheId || null,
        assignedToId: assignedToId || null,
      }
    });
    res.json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du message interne.', details: error.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const tabType = (req.query.type || 'CONTACT').toUpperCase(); 
    const statusFilter = req.query.status || 'all'; 
    const search = req.query.search || '';

    let messages = [];
    let total = 0;

    if (tabType === 'CONTACT' || tabType === 'RECRUTEMENT') {
      if (req.user.role === 'Collaborateur' || req.user.role === 'Relecteur') {
        return res.status(403).json({ error: 'Accès interdit aux formulaires externes.' });
      }

      let where = { type: tabType };
      const andConditions = [];

      if (req.user.role === 'Responsable opérationnel') {
        andConditions.push({
          OR: [
            { assignedToId: req.user.id },
            { assignedToId: null }
          ]
        });
      }
      if (statusFilter === 'traite') {
         where.status = { in: ['TERMINE', 'ARCHIVE'] };
      } else if (statusFilter === 'nontraite') {
         where.status = { notIn: ['TERMINE', 'ARCHIVE'] };
      }
      if (search) {
         andConditions.push({
           OR: [
             { nomPrenom: { contains: search } },
             { email: { contains: search } }
           ]
         });
      }
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }
      
      total = await prisma.formulaire.count({ where });
      const records = await prisma.formulaire.findMany({
         where,
         orderBy: { createdAt: 'desc' },
         skip,
         take: limit,
         include: { contact: true, recrutement: true }
      });
      
      messages = records.map(f => ({
        id: f.id,
        type: f.type,
        status: f.status,
        statusSubmitter: f.statusSubmitter,
        nomPrenom: f.nomPrenom,
        email: f.email,
        telephone: f.telephone,
        raisonSocial: f.raisonSocial,
        description: f.description,
        objet: f.objet || (f.type === 'CONTACT' ? 'Demande de contact' : 'Candidature'),
        bodyHtml: f.bodyHtml,
        createdAt: f.createdAt,
        contact: f.contact,
        recrutement: f.recrutement,
        verifaliaStatus: f.verifaliaStatus
      }));
    } else {
      let where = { type: tabType, isDeleted: false };
      
      if (req.user.role === 'Collaborateur' || req.user.role === 'Relecteur') {
        where.OR = [
          { subType: { contains: req.user.name } },
          { email: req.user.email },
          { assignedToId: req.user.id },
          { Tache: { assignedToId: req.user.id } },
          { mission: { assignedToId: req.user.id } }
        ];
      } else if (req.user.role === 'Responsable opérationnel') {
        where.assignedToId = req.user.id;
      }

      if (statusFilter === 'traite') {
         where.status = { in: ['TERMINE', 'ARCHIVE'] };
      } else if (statusFilter === 'nontraite') {
         where.status = { notIn: ['TERMINE', 'ARCHIVE'] };
      }
      
      if (search) {
         const searchFilter = {
           OR: [
             { nomPrenom: { contains: search } },
             { email: { contains: search } }
           ]
         };
         if (where.OR) {
           where.AND = [ { OR: where.OR }, searchFilter ];
           delete where.OR;
         } else {
           where.OR = searchFilter.OR;
         }
      }

      total = await prisma.messagePersonnel.count({ where });
      const records = await prisma.messagePersonnel.findMany({
         where,
         orderBy: { createdAt: 'desc' },
         skip,
         take: limit,
         include: { dossier: true, mission: true, Tache: true }
      });

      messages = records.map(e => ({
        id: e.id,
        type: e.type,
        status: e.status,
        nomPrenom: e.nomPrenom,
        email: e.email,
        objet: e.objet,
        bodyHtml: e.bodyText || e.bodyHtml,
        subType: e.subType || 'Indéfini',
        attachment: e.attachment,
        etiquette: e.etiquette,
        priorite: e.priorite,
        createdAt: e.createdAt,
        dossierId: e.dossierId,
        missionId: e.missionId,
        tacheId: e.tacheId,
        assignedToId: e.assignedToId,
        sourceType: e.Tache ? 'Tâche' : (e.mission ? 'Mission' : (e.dossier ? 'Dossier' : null)),
        sourceRef: e.Tache?.reference || e.mission?.reference || e.dossier?.reference || e.id
      }));
    }

    sendPaginatedResponse(res, messages, total, page, limit);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

// --- SYNC IMAP ---
const { syncMessages } = require('../controllers/imapController');
router.post('/messages/sync-imap', syncMessages);


router.post('/messages/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;
    
    // Check if it's a Formulaire
    let form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.update({ where: { id }, data: { assignedToId: assignedToId || null } });
      return res.json({ success: true, message: 'Formulaire assigné' });
    }
    
    // Otherwise check MessagePersonnel
    let msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.update({ where: { id }, data: { assignedToId: assignedToId || null } });
      return res.json({ success: true, message: 'Message assigné' });
    }
    
    res.status(404).json({ error: 'Message non trouvé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'assignation' });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.delete({ where: { id } });
      return res.json({ success: true, message: 'Message supprimé' });
    }
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.delete({ where: { id } });
      return res.json({ success: true, message: 'Message supprimé' });
    }
    res.status(404).json({ error: 'Message non trouvé' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

router.patch('/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dossierId, lieuTraitement, numeroReference, etiquette, priorite } = req.body;
    
    const dataToUpdate = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (etiquette !== undefined) dataToUpdate.etiquette = etiquette;
    if (priorite !== undefined) dataToUpdate.priorite = priorite;
    if (dossierId !== undefined) {
      dataToUpdate.dossierId = dossierId;
    }

    if (numeroReference && lieuTraitement) {
      if (lieuTraitement === 'Dossier') {
         const entity = await prisma.dossier.findFirst({ where: { reference: numeroReference } });
         if (!entity) return res.status(404).json({ error: `Le Dossier avec la référence "${numeroReference}" n'existe pas.` });
         dataToUpdate.dossierId = entity.id;
      } else if (lieuTraitement === 'Mission') {
         const entity = await prisma.mission.findFirst({ where: { reference: numeroReference } });
         if (!entity) return res.status(404).json({ error: `La Mission avec la référence "${numeroReference}" n'existe pas.` });
         dataToUpdate.missionId = entity.id;
      } else if (lieuTraitement === 'Tâche') {
         const entity = await prisma.tache.findFirst({ where: { reference: numeroReference } });
         if (!entity) return res.status(404).json({ error: `La Tâche avec la référence "${numeroReference}" n'existe pas.` });
         dataToUpdate.tacheId = entity.id;
      }
    }

    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.update({ where: { id }, data: dataToUpdate });
      return res.json({ success: true, message: 'Statut mis à jour' });
    }
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.update({ where: { id }, data: dataToUpdate });
      return res.json({ success: true, message: 'Statut mis à jour' });
    }
    res.status(404).json({ error: 'Message non trouvé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Nouvelle route : Soft Delete d'un message
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    
    if (msg) {
      await prisma.messagePersonnel.update({ where: { id }, data: { isDeleted: true } });
      return res.json({ success: true, message: 'Message supprimé avec succès (Soft Delete).' });
    }
    
    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.delete({ where: { id } });
      return res.json({ success: true, message: 'Formulaire supprimé avec succès.' });
    }

    res.status(404).json({ error: 'Message/Formulaire introuvable.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
