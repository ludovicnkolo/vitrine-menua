const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT } = require('../middlewares/auth');
const multer = require('multer');
const { uploadToS3, getPresignedUrl } = require('../services/s3Service');
const { randomUUID } = require('crypto');
const path = require('path');

const router = express.Router();
const prisma = new PrismaClient();

// Multer in memory for S3 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max per file
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// Create a new Magic Link
router.post('/generate', authenticateJWT, async (req, res) => {
  try {
    const { dossierId, type, expiresInDays = 7 } = req.body;
    
    if (!dossierId || !type) {
      return res.status(400).json({ success: false, error: 'dossierId et type requis.' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays, 10));

    const magicLink = await prisma.lienMagique.create({
      data: {
        type, // 'ACQUISITION' or 'LIVRAISON'
        dossierId,
        createdBy: req.user.id,
        expiresAt
      }
    });

    res.json({ success: true, data: magicLink });
  } catch (error) {
    console.error("Erreur génération lien magique:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// List Magic Links for a Dossier
router.get('/dossier/:dossierId', authenticateJWT, async (req, res) => {
  try {
    const { dossierId } = req.params;
    const links = await prisma.lienMagique.findMany({
      where: { dossierId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: links });
  } catch (error) {
    console.error("Erreur listing liens magiques:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// Revoke a Magic Link
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    await prisma.lienMagique.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur révocation lien magique:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});


// ─── PUBLIC ROUTES (CLIENT FACING) ──────────────────────────────────────────

// Verify token and get info (Dossier name, allowed actions)
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const magicLink = await prisma.lienMagique.findUnique({
      where: { token },
      include: {
        dossier: {
          include: { client: true, documents: true }
        }
      }
    });

    if (!magicLink) {
      return res.status(404).json({ success: false, error: 'Lien invalide ou introuvable.' });
    }

    if (new Date() > new Date(magicLink.expiresAt)) {
      return res.status(403).json({ success: false, error: 'Ce lien a expiré.' });
    }

    // Only expose safe information
    const data = {
      id: magicLink.id,
      type: magicLink.type,
      dossierRef: magicLink.dossier.reference,
      clientName: magicLink.dossier.client?.raisonSocial || magicLink.dossier.client?.nom || 'Client',
      documents: []
    };

    // If LIVRAISON, generate presigned URLs for documents attached to this dossier
    if (magicLink.type === 'LIVRAISON') {
      const activeDocs = magicLink.dossier.documents.filter(d => !d.isDeleted);
      const docsWithUrls = await Promise.all(activeDocs.map(async (doc) => {
        // If it's an S3 object (no path traversal ./), we generate a presigned URL
        let downloadUrl = doc.url;
        if (!doc.url.startsWith('/') && !doc.url.startsWith('http')) {
          downloadUrl = await getPresignedUrl(doc.url, 3600, false); // force download
        }
        return {
          id: doc.id,
          name: doc.name,
          type: doc.type,
          downloadUrl
        };
      }));
      data.documents = docsWithUrls;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Erreur vérification lien magique:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// Upload files via Magic Link (ACQUISITION)
router.post('/upload/:token', upload.array('files', 10), async (req, res) => {
  try {
    const { token } = req.params;
    const magicLink = await prisma.lienMagique.findUnique({ where: { token } });

    if (!magicLink) return res.status(404).json({ success: false, error: 'Lien invalide.' });
    if (new Date() > new Date(magicLink.expiresAt)) return res.status(403).json({ success: false, error: 'Lien expiré.' });
    if (magicLink.type !== 'ACQUISITION') return res.status(403).json({ success: false, error: 'Ce lien ne permet pas le dépôt de fichiers.' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Aucun fichier fourni.' });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const s3Key = `dossiers/${magicLink.dossierId}/${randomUUID()}-${safeName}`;
      
      // Upload to S3
      await uploadToS3(file.buffer, s3Key, file.mimetype);

      // Create Document in DB
      const doc = await prisma.document.create({
        data: {
          dossierId: magicLink.dossierId,
          name: file.originalname,
          type: "Document Client (Dépôt Magique)",
          url: s3Key,
          uploadedById: magicLink.createdBy // Fallback to the person who generated the link
        }
      });
      uploadedDocs.push(doc);
    }

    // Optionally mark link as used if it's a one-time link, but here we can keep it open until expiry
    res.json({ success: true, message: `${uploadedDocs.length} fichier(s) uploadé(s) avec succès.`, count: uploadedDocs.length });
  } catch (error) {
    console.error("Erreur upload via lien magique:", error);
    res.status(500).json({ success: false, error: 'Erreur lors du transfert de fichiers.' });
  }
});

module.exports = router;
