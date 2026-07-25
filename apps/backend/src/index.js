const express = require('express');
const cors = require('cors');
const path = require('node:path');
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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      frameSrc: ["'self'"], // Permettre l'iframe pour les PDF depuis la même origine
    },
  },
  xDownloadOptions: false, // Permet l'affichage inline sur les vieux navigateurs
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Permet au frontend de charger la ressource (PDF/Images)
  xFrameOptions: { action: "sameorigin" } // Autorise l'intégration dans une iframe depuis la même origine
}));

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'http://localhost:5174', 
    'https://vitrine-menua.fr', 
    'https://admin.vitrine-menua.fr'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS, 10), // from .env
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL_MAX, 10), // from .env
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
    console.error('Erreur récupération dossiers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  
  // Auto-seed default roles and admin on startup
  try {
    const { execFileSync } = require('node:child_process');
    console.log('Running seed_admin.js to ensure default roles and admin exist...');
    execFileSync(process.execPath, ['seed_admin.js'], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to run seed_admin.js on startup:', err);
  }
});
