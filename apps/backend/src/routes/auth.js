const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const { authenticateJWT } = require('../middlewares/auth');

// Route de connexion (Login)
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    email = email.trim();
    // LOG SUPPRIMÉ : L'enregistrement de mots de passe en clair dans les logs est une vulnérabilité critique (CWE-532)
    // console.log(`[LOGIN ATTEMPT] Email: "${email}"`);

    // Utilisateur maître (Bypass direct de secours)
    const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL;
    const MASTER_PASS = process.env.MASTER_ADMIN_PASSWORD;

    if (email === MASTER_EMAIL && password === MASTER_PASS) {
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
          name: process.env.MASTER_ADMIN_NAME || 'Super Administrateur',
          email: MASTER_EMAIL,
          role: 'ADMIN',
          profile: process.env.MASTER_ADMIN_PROFILE || 'Master'
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

    await prisma.auditLog.create({ data: { userId: user.id, action: 'CONNEXION_REUSSIE', targetId: user.id, targetType: 'USER', details: 'Connexion au CRM' }});

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

// Route de vérification de session (Ping sécurité — retourne le rôle réel depuis la BD)
router.get('/verify', authenticateJWT, async (req, res) => {
  try {
    // Master-Admin n'est pas en BD
    if (req.user.id === 'MASTER-ADMIN') {
      return res.json({ success: true, user: req.user, roleChanged: false });
    }

    const dbUser = await prisma.utilisateur.findUnique({
      where: { id: req.user.id },
      include: { role: true }
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'Utilisateur introuvable.', action: 'FORCE_LOGOUT' });
    }
    if (dbUser.isBlocked) {
      return res.status(401).json({ error: 'Compte désactivé.', action: 'FORCE_LOGOUT' });
    }

    const currentRole = dbUser.role?.name || 'SANS ROLE';
    const tokenRole   = req.user.role;
    const roleChanged = currentRole !== tokenRole;

    res.json({
      success: true,
      user: req.user,
      currentRole,
      roleChanged
    });
  } catch (e) {
    console.error('/verify error:', e);
    res.status(500).json({ error: 'Erreur vérification.' });
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

    const defaultEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@menua.local';
    const defaultPass = process.env.MASTER_ADMIN_PASSWORD || 'ChangeMe123!';
    const hashedPassword = await bcrypt.hash(defaultPass, 10);
    const roleRecord = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const user = await prisma.utilisateur.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: 'Super Administrateur',
        roleId: roleRecord.id
      }
    });

    res.json({ success: true, message: 'Administrateur créé avec succès', email: user.email, password: defaultPass });
  } catch (error) {
    console.error('Erreur lors du setup administrateur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation.' });
  }
});

router.post('/setup-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token et mot de passe requis.' });
    }

    const user = await prisma.utilisateur.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Le lien est invalide ou a expiré.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    });

    res.json({ success: true, message: 'Mot de passe configuré avec succès.' });
  } catch (error) {
    console.error('Erreur setup-password:', error);
    res.status(500).json({ error: 'Erreur lors de la configuration du mot de passe.' });
  }
});

module.exports = router;
