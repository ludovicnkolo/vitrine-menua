const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Route de connexion (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    // Utilisateur maître (Bypass DB) via .env
    const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL;
    const MASTER_PASS = process.env.MASTER_ADMIN_PASSWORD;

    if (MASTER_EMAIL && MASTER_PASS && email === MASTER_EMAIL && password === MASTER_PASS) {
      const token = jwt.sign(
        { id: 'MASTER-ADMIN', email: MASTER_EMAIL, role: 'ADMIN' },
        JWT_SECRET,
        { expiresIn: '12h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: 'MASTER-ADMIN',
          name: 'Fondateur',
          email: MASTER_EMAIL,
          role: 'ADMIN',
          profile: 'Master'
        }
      });
    }

    const user = await prisma.utilisateur.findUnique({ where: { email }, include: { role: true } });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'Ce compte a été bloqué.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Générer le token JWT valide pendant 12 heures
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role?.name || 'SANS ROLE' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name || 'SANS ROLE',
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Route utilitaire pour créer le premier admin s'il n'y en a aucun (Très utile pour l'initialisation)
router.post('/setup', async (req, res) => {
  try {
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      await prisma.role.create({ data: { name: 'ADMIN' } });
    }
    
    const adminCount = await prisma.utilisateur.count({ where: { role: { name: 'ADMIN' } } });
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Le système est déjà initialisé.' });
    }

    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    const roleRecord = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const user = await prisma.utilisateur.create({
      data: {
        email: 'admin@menuaconsulting.com',
        password: hashedPassword,
        name: 'Super Administrateur',
        roleId: roleRecord.id
      }
    });

    res.json({ success: true, message: 'Administrateur créé avec succès', email: user.email, password: 'Admin@2026' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'initialisation.' });
  }
});

module.exports = router;
