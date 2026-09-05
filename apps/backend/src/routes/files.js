const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

const { uploadToS3, getPresignedUrl } = require('../services/s3Service');

// Utilisation du stockage en mémoire pour multer avant l'envoi vers S3
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5000000, 
    files: 1,
    fields: 10,
    fieldSize: 1024 * 1024 
  } // Limite stricte pour éviter les DoS
});

// Route POST : Upload sécurisé d'un fichier dans un bucket
router.post('/upload', authenticateJWT, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Aucun fichier uploadé.' });
  }

  try {
    let bucket = req.body.bucket || 'temp';
    if (bucket.includes('..') || bucket.startsWith('/') || bucket.startsWith('\\')) {
      bucket = 'temp';
    }

    const randomHex = crypto.randomBytes(8).toString('hex');
    const uniqueSuffix = Date.now() + '-' + randomHex;
    const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const finalFilename = uniqueSuffix + '-' + safeOriginalName;
    const s3Key = `${bucket}/${finalFilename}`;

    // Upload to S3 directly from memory
    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);

    res.json({
      success: true,
      message: 'Fichier sauvegardé avec succès sur S3.',
      fileData: {
        filename: finalFilename,
        bucket: bucket,
        path: s3Key, // Chemin relatif/S3 Key à sauvegarder en BDD
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'upload vers S3.' });
  }
});

// Route GET : Téléchargement sécurisé via le backend (Redirection S3 Presigned URL)
router.get('/download/:bucket/:filename', authenticateJWT, async (req, res) => {
  const { bucket, filename } = req.params;
  
  if (bucket.includes('..') || filename.includes('..') || bucket.includes('/') || filename.includes('/')) {
    return res.status(403).json({ success: false, error: 'Accès interdit.' });
  }

  const s3Key = `${bucket}/${filename}`;

  try {
    const url = await getPresignedUrl(s3Key, 3600, false); // false = force download via content-disposition
    res.redirect(url);
  } catch (error) {
    console.error("Erreur génération URL S3:", error);
    res.status(500).json({ success: false, error: 'Erreur lors de la génération du lien de téléchargement.' });
  }
});

// Route GET : Consultation inline (Affichage navigateur via Presigned URL)
router.get('/view/:bucket/:filename', authenticateJWT, async (req, res) => {
  const { bucket, filename } = req.params;
  
  if (bucket.includes('..') || filename.includes('..') || bucket.includes('/') || filename.includes('/')) {
    return res.status(403).json({ success: false, error: 'Accès interdit.' });
  }

  const s3Key = `${bucket}/${filename}`;

  try {
    const url = await getPresignedUrl(s3Key, 3600, true); // true = inline display
    res.redirect(url);
  } catch (error) {
    console.error("Erreur génération URL S3 inline:", error);
    res.status(500).json({ success: false, error: 'Erreur de lecture du fichier.' });
  }
});

module.exports = router;

