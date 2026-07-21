const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth');

router.use(authenticateJWT);

// --- UTILISATEURS ---
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, profile: true, idCardUrl: true, isBlocked: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, role, phone, country, city, education, status, profile, idCardUrl } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Menua@2026', 10); // Mot de passe par défaut
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ASSOCIÉ',
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
    const { name, email, role, profile, status, idCardUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(profile !== undefined && { profile }),
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
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- CLIENTS (Externes) ---
router.get('/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    console.error(error); console.error(error); res.status(500).json({ error: error.message });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const { name, email, company, phone, status, idCardUrl } = req.body;
    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        phone,
        idCardUrl: idCardUrl || null,
        status: status || 'ACTIF',
      }
    });
    res.status(201).json(client);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création du client.' });
  }
});

router.patch('/clients/:id', async (req, res) => {
  try {
    const { name, email, company, phone, status, idCardUrl } = req.body;
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(company !== undefined && { company }),
        ...(phone !== undefined && { phone }),
        ...(idCardUrl !== undefined && { idCardUrl }),
        ...(status && { status })
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
      include: { tasks: true, client: true, createdBy: true }
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
      let masterUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!masterUser) {
         masterUser = await prisma.user.create({
            data: { email: 'master@admin.com', password: 'temp', name: 'Master Admin', role: 'ADMIN' }
         });
      }
      creatorId = masterUser.id;
    }

    const dossier = await prisma.dossier.create({
      data: {
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
    const tasks = await prisma.task.findMany({
      include: { dossier: true, assignedTo: true, createdBy: true }
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
      let masterUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!masterUser) {
         masterUser = await prisma.user.create({
            data: {
               email: 'master@admin.com',
               password: 'temp',
               name: 'Master Admin',
               role: 'ADMIN'
            }
         });
      }
      creatorId = masterUser.id;
    }

    const task = await prisma.task.create({
      data: {
        description,
        dossierId,
        assignedToId,
        createdById: creatorId,
        status: 'TO_ASSIGN'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const { status, assignedToId } = req.body;
    const task = await prisma.task.update({
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
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// --- MESSAGES ---
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error); res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

module.exports = router;
