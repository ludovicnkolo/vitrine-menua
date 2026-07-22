const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth');

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
    const hashedPassword = await bcrypt.hash('Menua@2026', 10); // Mot de passe par défaut
    const user = await prisma.utilisateur.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    const count = await prisma.dossier.count();
    const reference = `DOS-${String(count + 1).padStart(2, '0')}`;

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
    res.status(201).json(dossier);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création du dossier.' });
  }
});

router.patch('/dossiers/:id', async (req, res) => {
  try {
    const { status, name } = req.body;
    const dossier = await prisma.dossier.update({
      where: { id: req.params.id },
      data: { status, name }
    });
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
        createdBy: { include: { role: true } } 
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { dossierId, description, assignedToId } = req.body;
    let creatorId = req.user.id;
    
    // Handle the bypass login 'MASTER-ADMIN' which doesn't exist in DB
    if (creatorId === 'MASTER-ADMIN') {
      let masterUser = await prisma.utilisateur.findUnique({ where: { email: 'contact@menuaconsulting.com' } });
      if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
      creatorId = masterUser?.id || creatorId;
    }

    const count = await prisma.mission.count();
    const reference = `MSN-${String(count + 1).padStart(2, '0')}`;

    const task = await prisma.mission.create({
      data: {
        reference,
        description,
        dossierId,
        assignedToId,
        createdById: creatorId,
        status: 'TO_ASSIGN'
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
    const formulaires = await prisma.formulaire.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contact: true,
        recrutement: true
      }
    });
    const messagePersonnels = await prisma.messagePersonnel.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const allMessages = [...formulaires, ...messagePersonnels].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allMessages);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

module.exports = router;
