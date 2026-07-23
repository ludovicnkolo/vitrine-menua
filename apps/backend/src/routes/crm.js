const express = require('express');
const { PrismaClient } = require('@prisma/client');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const prisma = new PrismaClient();
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth');

const imapConfig = {
  imap: {
    user: 'contact@menuaconsulting.com',
    password: 'Menua2026?consulting',
    host: 'ssl0.ovh.net',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false }
  }
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
    const crypto = require('crypto');
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
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'ssl0.ovh.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'contact@menuaconsulting.com',
          pass: process.env.SMTP_PASS || 'Menua2026?consulting',
        },
      });
      
      const setupUrl = `http://localhost:5173/setup-password?token=${token}`; // TODO: use real origin
      
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
    const dossiers = await prisma.dossier.findMany({
      include: { 
        missions: true, 
        client: true, 
        createdBy: { include: { role: true } }
      }
    });
    res.json(dossiers);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/dossiers', async (req, res) => {
  try {
    const { name, description, priority, origin } = req.body;
    let creatorId = req.user.id;
    
    // Handle the bypass login 'MASTER-ADMIN'
    if (creatorId === 'MASTER-ADMIN') {
      let masterUser = await prisma.utilisateur.findUnique({ where: { email: 'contact@menuaconsulting.com' } });
      if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
      creatorId = masterUser?.id || creatorId;
    }

    const lastDossier = await prisma.dossier.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { reference: true }
    });
    let nextNum = 1;
    if (lastDossier && lastDossier.reference) {
      const match = lastDossier.reference.match(/DOS-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const reference = `DOS-${String(nextNum).padStart(2, '0')}`;

    const dossier = await prisma.dossier.create({
      data: {
        reference,
        name,
        description,
        priority: priority || 'NORMAL',
        status: 'OUVERT', // mapped from NOUVEAU
        origin: origin || 'INTERNE',
        createdById: creatorId
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
    const tasks = await prisma.mission.findMany({
      include: { 
        dossier: true, 
        assignedTo: { include: { role: true } }, 
        createdBy: { include: { role: true } },
        subMissions: {
          include: { assignedTo: true, createdBy: true }
        }
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { dossierId, description, assignedToId, parentMissionId } = req.body;
    let creatorId = req.user.id;
    
    // Handle the bypass login 'MASTER-ADMIN' which doesn't exist in DB
    if (creatorId === 'MASTER-ADMIN') {
      let masterUser = await prisma.utilisateur.findUnique({ where: { email: 'contact@menuaconsulting.com' } });
      if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
      creatorId = masterUser?.id || creatorId;
    }

    const lastMission = await prisma.mission.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { reference: true }
    });
    let nextNum = 1;
    if (lastMission && lastMission.reference) {
      const match = lastMission.reference.match(/MSN-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    const reference = `MSN-${String(nextNum).padStart(2, '0')}`;

    const task = await prisma.mission.create({
      data: {
        reference,
        description,
        dossierId,
        assignedToId,
        createdById: creatorId,
        status: 'TO_ASSIGN',
        ...(parentMissionId && { parentMissionId })
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: error.message || 'Erreur lors de la création de la tâche.' });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const { status, assignedToId } = req.body;
    const task = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status, assignedToId }
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

// --- MESSAGES (FORMULAIRES) ---
router.get('/messages', async (req, res) => {
  try {
    const fromForms = await prisma.formulaire.findMany({
      include: { contact: true, recrutement: true },
      orderBy: { createdAt: 'desc' }
    });
    const fromEmails = await prisma.messagePersonnel.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const combined = [
      ...fromForms.map(f => ({
        id: f.id,
        type: f.type,
        status: f.status,
        statusSubmitter: f.statusSubmitter,
        nomPrenom: f.nomPrenom,
        email: f.email,
        objet: f.objet || (f.type === 'CONTACT' ? 'Demande de contact' : 'Candidature'),
        bodyHtml: f.bodyHtml,
        createdAt: f.createdAt,
        contact: f.contact,
        recrutement: f.recrutement
      })),
      ...fromEmails.map(e => ({
        id: e.id,
        type: e.type,
        status: e.status,
        nomPrenom: e.nomPrenom,
        email: e.email,
        objet: e.objet,
        bodyHtml: e.bodyText || e.bodyHtml,
        createdAt: e.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(combined);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

// --- SYNC IMAP ---
router.post('/messages/sync-imap', async (req, res) => {
  let connection;
  try {
    connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX');
    const searchCriteria = ['ALL'];
    const fetchOptions = { bodies: [''], struct: true };
    const messages = await connection.search(searchCriteria, fetchOptions);
    const last10 = messages.slice(-10);
    
    let addedCount = 0;
    
    for (const item of last10) {
      const all = item.parts.find(p => p.which === '');
      const uid = item.attributes.uid;
      const parsed = await simpleParser(all.body);
      
      const messageId = parsed.messageId || `uid-${uid}-${Date.now()}`;
      const subject = parsed.subject || "Sans objet";
      let nomPrenom = "Inconnu";
      let email = "inconnu@inconnu.com";
      
      if (parsed.from && parsed.from.value && parsed.from.value.length > 0) {
        nomPrenom = parsed.from.value[0].name || parsed.from.value[0].address || "Inconnu";
        email = parsed.from.value[0].address || "inconnu@inconnu.com";
      }
      
      if (parsed.replyTo && parsed.replyTo.value && parsed.replyTo.value.length > 0) {
        email = parsed.replyTo.value[0].address;
      }
      
      const bodyText = parsed.text || "Aucun contenu";
      const date = parsed.date || new Date();
      
      const existing = await prisma.messagePersonnel.findUnique({ where: { messageId } });
      if (!existing) {
        await prisma.messagePersonnel.create({
          data: {
            messageId,
            type: 'PERSONNEL',
            status: 'NOUVEAU',
            nomPrenom,
            email,
            objet: subject,
            bodyText,
            createdAt: date,
            receivedAt: date
          }
        });
        addedCount++;
      }
    }
    
    connection.end();
    res.json({ success: true, addedCount });
  } catch (error) {
    console.error("Erreur IMAP Sync:", error);
    if (connection) connection.end();
    res.status(500).json({ error: 'Erreur de synchronisation IMAP' });
  }
});

module.exports = router;
