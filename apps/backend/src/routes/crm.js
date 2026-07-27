const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('node:crypto');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('node:fs');
const path = require('node:path');
const prisma = new PrismaClient();
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth');
const { transporter } = require('../utils/mailer');

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

router.post('/roles', async (req, res) => {
  try {
    const { name, permissions, description, status } = req.body;
    const role = await prisma.role.create({
      data: { name, permissions, description, status: status || 'Actif' }
    });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/roles/:id', async (req, res) => {
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
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    await prisma.role.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UTILISATEURS ---
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: { id: true, name: true, email: true, roleId: true, role: true, profile: true, idCardUrl: true, isBlocked: true, createdAt: true, telephone: true, lieuResidence: true, experienceCle: true, langues: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, roleId, phone, country, city, education, status, profile, idCardUrl, telephone, lieuResidence, experienceCle, langues } = req.body;
    const bcrypt = require('bcryptjs');
    const crypto = require('node:crypto');
    const nodemailer = require('nodemailer');
    
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    // Default fallback password in case they don't use the link
    const hashedPassword = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10); 
    
    const user = await prisma.utilisateur.create({
      data: {
        name,
        email,
        password: hashedPassword,
        resetToken: token,
        resetTokenExpiry,
        roleId: roleId || null,
        telephone: telephone || phone || null,
        lieuResidence: lieuResidence || null,
        experienceCle: experienceCle || null,
        langues: langues || null,
        profile: profile || '',
        idCardUrl: idCardUrl || null,
        isBlocked: status === 'Inactif'
      }
    });
    
    // Send email
    try {
      const proto = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers.host;
      const origin = host ? `${proto}://${host}` : (process.env.VITE_API_URL || 'http://localhost:5173');
      const setupUrl = `${origin}/setup-password?token=${token}`;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'contact@menuaconsulting.com',
        to: email,
        subject: 'Création de votre compte Menua Consulting',
        html: `
          <h3>Bienvenue ${name},</h3>
          <p>Un compte collaborateur a été créé pour vous sur l'espace Menua Consulting.</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour configurer votre mot de passe et activer votre accès :</p>
          <a href="${setupUrl}" style="display:inline-block;padding:10px 20px;background:#141824;color:#fff;text-decoration:none;border-radius:4px;">Créer mon mot de passe</a>
          <p>Ce lien est valable 24 heures.</p>
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

router.patch('/users/:id', async (req, res) => {
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
    res.json(user);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await prisma.utilisateur.delete({ where: { id: req.params.id } });
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
    res.status(201).json(client);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création du client.' });
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
    res.json(client);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: req.params.id } });
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

    const where = {};
    if (status && status !== 'all') where.status = status;
    if (origin && origin !== 'all') where.origin = origin;
    if (role && role !== 'all') {
      where.createdBy = { role: { name: role } };
    }
    
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { id: { contains: s, mode: 'insensitive' } },
        { reference: { contains: s, mode: 'insensitive' } },
        { name: { contains: s, mode: 'insensitive' } },
        { createdBy: { name: { contains: s, mode: 'insensitive' } } }
      ];
    }
    
    const total = await prisma.dossier.count({ where });
    const dossiers = await prisma.dossier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { 
        missions: true, 
        client: true, 
        createdBy: { include: { role: true } }
      }
    });
    sendPaginatedResponse(res, dossiers, total, page, limit);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/dossiers', async (req, res) => {
  try {
    const { name, description, priority, origin } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('dossier', 'DOS');

    const dossier = await prisma.dossier.create({
      data: {
        reference,
        name,
        description,
        priority: priority || 'NORMAL',
        status: 'OUVERT', // mapped from NOUVEAU
        origin: origin || 'INTERNE',
        createdById: creatorId,
        clientId: req.body.clientId || null,
        targetUserId: req.body.targetUserId || null
      }
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
router.get('/audit', async (req, res) => {
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
    const { status, name } = req.body;
    const dossier = await prisma.dossier.update({
      where: { id: req.params.id },
      data: { status, name }
    });

    await prisma.auditLog.create({ data: { userId: req.user.id, action: 'MODIFICATION_DOSSIER', targetId: dossier.id, targetType: 'DOSSIER', details: `Statut modifié: ${status || 'Inchangé'}`, dossierId: dossier.id }});

    res.json(dossier);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier.' });
  }
});

router.delete('/dossiers/:id', async (req, res) => {
  try {
    await prisma.dossier.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Dossier supprimé' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- TÂCHES ---
router.get('/tasks', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;

    const where = { parentMissionId: null }; // Only parent tasks
    if (status && status !== 'all') where.status = status;
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { reference: { contains: s, mode: 'insensitive' } },
        { dossier: { name: { contains: s, mode: 'insensitive' } } },
        { dossier: { reference: { contains: s, mode: 'insensitive' } } },
        { dossierId: { contains: s, mode: 'insensitive' } },
        { createdBy: { name: { contains: s, mode: 'insensitive' } } },
        { assignedTo: { name: { contains: s, mode: 'insensitive' } } }
      ];
    }
    
    const total = await prisma.mission.count({ where });
    const tasks = await prisma.mission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { 
        dossier: true, 
        assignedTo: { include: { role: true } }, 
        createdBy: { include: { role: true } },
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
    const { dossierId, description, assignedToId, parentMissionId, echeance, attachment, messageId } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('mission', 'MSN');

    const task = await prisma.mission.create({
      data: {
        reference,
        description,
        dossierId,
        assignedToId,
        createdById: creatorId,
        status: 'TO_ASSIGN',
        echeance: echeance ? new Date(echeance) : null,
        attachment,
        ...(parentMissionId && { parentMissionId })
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
    const dataToUpdate = { status, assignedToId };
    if (description !== undefined) dataToUpdate.description = description;
    if (attachment !== undefined) dataToUpdate.attachment = attachment;
    
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
    await prisma.mission.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Tâche supprimée' });
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
    if (status && status !== 'all') where.status = status;
    if (search) {
      const s = search.toLowerCase();
      where.OR = [
        { reference: { contains: s, mode: 'insensitive' } },
        { mission: { reference: { contains: s, mode: 'insensitive' } } },
        { missionId: { contains: s, mode: 'insensitive' } },
        { createdBy: { name: { contains: s, mode: 'insensitive' } } },
        { assignedTo: { name: { contains: s, mode: 'insensitive' } } }
      ];
    }

    const total = await prisma.tache.count({ where });
    const taches = await prisma.tache.findMany({
      where,
      skip,
      take: limit,
      include: {
        mission: true,
        assignedTo: { select: { id: true, name: true, role: true } },
        createdBy: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    sendPaginatedResponse(res, taches, total, page, limit);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' });
  }
});

router.post('/taches', async (req, res) => {
  try {
    const { missionId, description, assignedToId, echeance, attachment } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference('tache', 'TCH');

    const tache = await prisma.tache.create({
      data: {
        reference,
        description,
        missionId,
        assignedToId,
        createdById: creatorId,
        status: 'TO_ASSIGN',
        echeance: echeance ? new Date(echeance) : null,
        attachment
      }
    });

    res.json(tache);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
  }
});

router.patch('/taches/:id', async (req, res) => {
  try {
    const tache = await prisma.tache.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(tache);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/taches/:id', async (req, res) => {
  try {
    await prisma.tache.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});
// --- MESSAGES (FORMULAIRES) ---
router.post('/messages/interne', async (req, res) => {
  try {
    const { subType, objet, bodyText, attachment, dossierId, missionId } = req.body;
    
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
      }
    });
    res.json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du message interne.' });
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
      let where = { type: tabType };
      if (statusFilter === 'traite') {
         where.status = { in: ['TERMINE', 'ARCHIVE'] };
      } else if (statusFilter === 'nontraite') {
         where.status = { notIn: ['TERMINE', 'ARCHIVE'] };
      }
      if (search) {
         where.OR = [
           { nomPrenom: { contains: search } },
           { email: { contains: search } }
         ];
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
        recrutement: f.recrutement
      }));
    } else {
      let where = { type: tabType };
      if (statusFilter === 'traite') {
         where.status = { in: ['TERMINE', 'ARCHIVE'] };
      } else if (statusFilter === 'nontraite') {
         where.status = { notIn: ['TERMINE', 'ARCHIVE'] };
      }
      if (search) {
         where.OR = [
           { nomPrenom: { contains: search } },
           { email: { contains: search } }
         ];
      }

      total = await prisma.messagePersonnel.count({ where });
      const records = await prisma.messagePersonnel.findMany({
         where,
         orderBy: { createdAt: 'desc' },
         skip,
         take: limit,
         include: { dossier: true, mission: true }
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
        createdAt: e.createdAt,
        sourceType: e.mission ? 'Mission' : (e.dossier ? 'Dossier' : null),
        sourceRef: e.mission?.reference || e.dossier?.reference || e.id
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
    const { status } = req.body;
    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.update({ where: { id }, data: { status } });
      return res.json({ success: true, message: 'Statut mis à jour' });
    }
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.update({ where: { id }, data: { status } });
      return res.json({ success: true, message: 'Statut mis à jour' });
    }
    res.status(404).json({ error: 'Message non trouvé' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
