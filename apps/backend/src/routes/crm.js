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
      select: { id: true, name: true, email: true, role: true, profile: true, status: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, role, phone, country, city, education, status, profile } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Menua@2026', 10); // Mot de passe par défaut
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ASSOCIÉ',
        profile: profile || '',
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
  }
});

// --- CLIENTS (Externes) ---
router.get('/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const { name, email, company, phone, status } = req.body;
    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        phone,
        status: status || 'ACTIF',
      }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du client.' });
  }
});

// --- DOSSIERS ---
router.get('/dossiers', async (req, res) => {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: { tasks: true, client: true }
    });
    res.json(dossiers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/dossiers', async (req, res) => {
  try {
    const { name, description, priority } = req.body;
    const dossier = await prisma.dossier.create({
      data: {
        name,
        description,
        priority: priority || 'NORMAL',
        status: 'OUVERT' // mapped from NOUVEAU
      }
    });
    res.status(201).json(dossier);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du dossier.' });
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
    res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier.' });
  }
});

router.delete('/dossiers/:id', async (req, res) => {
  try {
    await prisma.dossier.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Dossier supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
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
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { dossierId, description, assignedToId } = req.body;
    const task = await prisma.task.create({
      data: {
        description,
        dossierId,
        assignedToId,
        createdById: req.user.id,
        status: 'TO_ASSIGN'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche.' });
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
    res.status(500).json({ error: 'Erreur de mise à jour.' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
