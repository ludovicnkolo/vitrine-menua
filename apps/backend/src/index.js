const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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
