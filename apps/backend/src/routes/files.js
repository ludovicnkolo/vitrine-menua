const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

// Configuration du stockage Multer (DiskStorage) vers l'architecture des buckets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Le bucket est envoyé par le frontend (ex: 'vitrine/formulaires_contact', 'admin/rapports')
    let bucket = req.body.bucket || 'temp';
    
    // Validation stricte anti-path traversal (SonarQube Blocker fix)
    // 1. Bloquer les segments dangereux évidents
    if (bucket.includes('..') || bucket.startsWith('/') || bucket.startsWith('\\')) {
      bucket = 'temp';
    }

    // Le dossier racine (le faux disque de 20Go monté)
    const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
    const resolvedRoot = path.resolve(rootPath);
    const destPath = path.resolve(rootPath, bucket);

    // 2. Vérification que le chemin résolu est bien un enfant du rootPath (protection absolue)
    if (!destPath.startsWith(resolvedRoot + path.sep) && destPath !== resolvedRoot) {
      return cb(new Error(`Accès refusé : chemin de bucket invalide '${bucket}'`));
    }

    // Création automatique du sous-dossier (bucket) s'il n'existe pas
    fs.mkdirSync(destPath, { recursive: true });
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier 100% unique (Timestamp + Nombre aléatoire + Nom d'origine nettoyé)
    const randomHex = crypto.randomBytes(8).toString('hex');
    const uniqueSuffix = Date.now() + '-' + randomHex;
    // On nettoie le nom original pour éviter les caractères bizarres
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeOriginalName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite à 10 Mo pour les pièces jointes internes
});

// Route POST : Upload sécurisé d'un fichier dans un bucket
router.post('/upload', authenticateJWT, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Aucun fichier uploadé.' });
  }

  // Le fichier est maintenant physiquement sur le disque virtuel (ex: /app/storage/buckets/dossiers_clients/...)
  res.json({
    success: true,
    message: 'Fichier sauvegardé avec succès.',
    fileData: {
      filename: req.file.filename,
      bucket: req.body.bucket || 'temp',
      path: `${req.body.bucket || 'temp'}/${req.file.filename}`, // Chemin relatif à sauvegarder en BDD
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Route GET : Téléchargement sécurisé (Stream) via le backend
router.get('/download/:bucket/:filename', authenticateJWT, (req, res) => {
  const { bucket, filename } = req.params;
  
  // Validation stricte pour empêcher la navigation dans les dossiers (Path Traversal)
  if (bucket.includes('..') || filename.includes('..') || bucket.includes('/') || filename.includes('/')) {
    return res.status(403).json({ success: false, error: 'Accès interdit.' });
  }

  const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
  const filePath = path.join(rootPath, bucket, filename);

  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Fichier introuvable.' });
  }

  // Optionnel : Ajouter ici une logique métier pour vérifier si req.user a le droit de lire ce fichier spécifique
  
  // Renvoyer le fichier sous forme de flux (Download)
  const absoluteFilePath = path.resolve(filePath);
  res.download(absoluteFilePath, filename, (err) => {
    if (err) {
      console.error("Erreur lors de l'envoi du fichier:", err);
      // Ne pas renvoyer de réponse si les headers ont déjà été envoyés
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Erreur lors du téléchargement.' });
      }
    }
  });
});

// Route GET : Consultation inline (Stream) pour affichage dans le navigateur
router.get('/view/:bucket/:filename', authenticateJWT, (req, res) => {
  const { bucket, filename } = req.params;
  
  if (bucket.includes('..') || filename.includes('..') || bucket.includes('/') || filename.includes('/')) {
    return res.status(403).json({ success: false, error: 'Accès interdit.' });
  }

  const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
  let filePath = path.join(rootPath, bucket, filename);

  if (!fs.existsSync(filePath)) {
    // Check fallback local storage
    const fallbackPath = path.join(__dirname, '../../../storage', bucket, filename);
    if (fs.existsSync(fallbackPath)) {
      filePath = fallbackPath;
    } else {
      return res.status(404).json({ success: false, error: 'Fichier introuvable.' });
    }
  }

  const options = {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline'; object-src 'self' blob:; frame-src 'self' blob:;"
    }
  };

  const absoluteFilePath = path.resolve(filePath);
  res.sendFile(absoluteFilePath, options, (err) => {
    if (err && !res.headersSent) {
      console.error("Erreur lors de l'envoi du fichier:", err);
      res.status(500).json({ success: false, error: 'Erreur lors de la visualisation.' });
    }
  });
});

module.exports = router;

