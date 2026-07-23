const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: '../../.env' });

const app = express();
const prisma = new PrismaClient();

// Confiance au reverse proxy (Nginx) pour obtenir l'adresse IP réelle de l'utilisateur
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow PDF inline rendering
  xDownloadOptions: false, // Permet l'affichage inline sur les vieux navigateurs
  crossOriginResourcePolicy: false, // Permet au frontend de charger la ressource
  xFrameOptions: false // Autorise l'intégration dans une iframe
}));

// CORS doit être défini AVANT le rate limiter pour éviter les erreurs NetworkError bloquantes du navigateur
app.use(cors());

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS), // from .env
  max: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX), // from .env
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(limiter);
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT })); // from .env

// Middlewares
const logAudit = async (userId, action, targetId, targetType, details) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetId,
        targetType,
        details: JSON.stringify(details)
      }
    });
  } catch (error) {
    console.error('Failed to log audit', error);
  }
};

// Routes placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MENUA CRM Backend is running' });
});

// Forms routes (Contact & Join)
const formsRouter = require('./routes/forms');
app.use('/api/forms', formsRouter);

// Auth routes (Login, Setup)
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Files routes (Secure Buckets)
const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

// CRM routes (Dossiers, Tasks, Users)
const crmRouter = require('./routes/crm');
app.use('/api/crm', crmRouter);

// Get all dossiers
app.get('/api/dossiers', async (req, res) => {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: { tasks: true }
    });
    res.json(dossiers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  
  // Auto-seed default roles and admin on startup
  try {
    const { execSync } = require('child_process');
    console.log('Running seed_admin.js to ensure default roles and admin exist...');
    execSync('node seed_admin.js', { cwd: __dirname + '/../', stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to run seed_admin.js on startup:', err);
  }
});
