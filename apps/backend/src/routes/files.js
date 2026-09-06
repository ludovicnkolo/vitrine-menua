const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { authenticateJWT } = require('../middlewares/auth');
const prisma = require('../prisma');
const { logAudit } = require('../utils/audit');

const router = express.Router();

const { uploadToS3, getPresignedUrl, deleteFromS3 } = require('../services/s3Service');

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

// ─── ROUTE ATOMIQUE : Upload S3 + Rattachement BDD en une seule opération ──────
// Résout le bug de désynchronisation OVH ↔ BDD (P1).
// Si l'enregistrement en base échoue, le fichier est automatiquement supprimé
// de S3 (rollback), garantissant la cohérence entre OVH et le CRM.
router.post('/upload-and-attach', authenticateJWT, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Aucun fichier uploadé.' });
  }

  const { dossierId, missionId, name } = req.body;
  if (!dossierId && !missionId) {
    return res.status(400).json({ success: false, error: 'dossierId ou missionId est requis pour rattacher le document.' });
  }

  let bucket = req.body.bucket || 'ged';
  if (bucket.includes('..') || bucket.startsWith('/') || bucket.startsWith('\\')) {
    bucket = 'ged';
  }

  const randomHex = crypto.randomBytes(8).toString('hex');
  const uniqueSuffix = Date.now() + '-' + randomHex;
  const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const finalFilename = uniqueSuffix + '-' + safeOriginalName;
  const s3Key = `${bucket}/${finalFilename}`;

  // ── ÉTAPE 1 : Upload S3 ──────────────────────────────────────────────────────
  try {
    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);
  } catch (s3Error) {
    console.error({ event: 'upload_s3_failed', error: s3Error.message });
    return res.status(502).json({ success: false, error: 'Erreur lors de l\'upload vers OVH. Aucune donnée enregistrée.' });
  }

  // ── ÉTAPE 2 : Enregistrement en BDD — avec rollback S3 si erreur ────────────
  let document;
  try {
    // Résolution de l'ID utilisateur (gestion du cas MASTER-ADMIN)
    let uploadedById = req.user?.id;
    if (uploadedById === 'MASTER-ADMIN') {
      const masterUser = await prisma.utilisateur.findUnique({ where: { email: 'contact@menuaconsulting.com' } })
        || await prisma.utilisateur.findFirst();
      uploadedById = masterUser?.id || uploadedById;
    }

    document = await prisma.document.create({
      data: {
        name: name || req.file.originalname,
        url: s3Key,
        uploadedById,
        ...(dossierId && { dossierId }),
        ...(missionId && { missionId }),
      },
      include: { uploadedBy: true }
    });
  } catch (dbError) {
    // ── ROLLBACK : Suppression du fichier S3 pour éviter un orphelin ───────────
    console.error({ event: 'db_insert_failed_rolling_back_s3', s3Key, error: dbError.message });
    try {
      await deleteFromS3(s3Key);
      console.info({ event: 's3_rollback_success', s3Key });
    } catch (rollbackError) {
      // Le fichier reste dans S3 — logué pour nettoyage manuel / cron futur
      console.error({ event: 's3_rollback_failed', s3Key, error: rollbackError.message });
    }
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'enregistrement en base de données. Le fichier n\'a pas été conservé.'
    });
  }

  // ── ÉTAPE 3 : Audit trail ────────────────────────────────────────────────────
  try {
    await logAudit(
      req.user?.id,
      'AJOUT_DOCUMENT',
      document.id,
      'DOCUMENT',
      `Document rattaché (atomique): ${document.name}`,
      document.dossierId || null
    );
  } catch (auditError) {
    // L'audit n'est pas bloquant — on logue mais on ne fait pas échouer la requête
    console.warn({ event: 'audit_log_failed', error: auditError.message });
  }

  return res.status(201).json({
    success: true,
    message: 'Document uploadé et rattaché avec succès.',
    document
  });
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
