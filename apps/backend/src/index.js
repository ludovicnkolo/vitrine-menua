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
app.use(helmet());

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(limiter);

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size to prevent DoS

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
});
