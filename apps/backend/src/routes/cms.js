const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateJWT } = require('../middlewares/auth');
const multer = require('multer');
const { uploadToS3, getPresignedUrl } = require('../services/s3Service');
const { randomUUID } = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for images
});

// Récupérer toutes les publications (public ou admin)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const publications = await prisma.publication.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    const pubsWithUrl = await Promise.all(publications.map(async (pub) => {
      let imageUrl = pub.coverImage;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = await getPresignedUrl(imageUrl, 3600, true); // 1 hour for admin view
      }
      return { ...pub, coverImageUrl: imageUrl };
    }));

    res.json({ success: true, data: pubsWithUrl });
  } catch (error) {
    console.error("Erreur GET publications:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// Créer une nouvelle publication
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, type, category, excerpt, location, contentHtml, sections, coverImage, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Le titre est obligatoire.' });
    }

    const pubType = type || 'ACTUALITE';
    if (pubType === 'ACTUALITE' && !category) {
      return res.status(400).json({ success: false, error: 'La rubrique (category) est obligatoire pour une actualité.' });
    }

    const pub = await prisma.publication.create({
      data: {
        title,
        type: type || 'ACTUALITE',
        category,
        excerpt,
        location,
        contentHtml: contentHtml || '',
        sections: sections ? JSON.stringify(sections) : null,
        coverImage,
        status: status || 'BROUILLON',
        authorId: req.user.id,
        publishedAt: status === 'PUBLIE' ? new Date() : null
      }
    });

    res.json({ success: true, data: pub });
  } catch (error) {
    console.error("Erreur POST publication:", error);
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la publication.' });
  }
});

// Mettre à jour une publication
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, category, excerpt, location, contentHtml, sections, coverImage, status } = req.body;
    
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Publication introuvable.' });
    }

    const dataToUpdate = {
      title,
      type,
      category,
      excerpt,
      location,
      contentHtml,
      sections: sections ? JSON.stringify(sections) : null,
      coverImage,
      status
    };

    if (status === 'PUBLIE' && existing.status !== 'PUBLIE') {
      dataToUpdate.publishedAt = new Date();
    }

    const pub = await prisma.publication.update({
      where: { id },
      data: dataToUpdate
    });

    res.json({ success: true, data: pub });
  } catch (error) {
    console.error("Erreur PUT publication:", error);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour.' });
  }
});

// Supprimer une publication
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.publication.delete({ where: { id } });
    res.json({ success: true, message: 'Publication supprimée avec succès.' });
  } catch (error) {
    console.error("Erreur DELETE publication:", error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression.' });
  }
});

// Route publique pour le site vitrine (sans authentification)
router.get('/public', async (req, res) => {
  try {
    const { type } = req.query;
    const where = { status: 'PUBLIE' };
    if (type) where.type = type;

    const publications = await prisma.publication.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' }
    });
    
    const pubsWithUrl = await Promise.all(publications.map(async (pub) => {
      let imageUrl = pub.coverImage;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = await getPresignedUrl(imageUrl, 24 * 3600, true);
      }
      // Presign section images
      let parsedSections = [];
      if (pub.sections) {
        try {
          const secs = JSON.parse(pub.sections);
          parsedSections = await Promise.all(secs.map(async (s) => {
            let sImageUrl = s.imageKey;
            if (sImageUrl && !sImageUrl.startsWith('http') && !sImageUrl.startsWith('/')) {
              sImageUrl = await getPresignedUrl(sImageUrl, 24 * 3600, true);
            }
            return { ...s, imageUrl: sImageUrl };
          }));
        } catch (_) {}
      }
      return { ...pub, coverImageUrl: imageUrl, sections: parsedSections };
    }));

    res.json({ success: true, data: pubsWithUrl });
  } catch (error) {
    console.error("Erreur GET publications publiques:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// Route publique pour récupérer une publication spécifique
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pub = await prisma.publication.findUnique({
      where: { id },
      include: { author: { select: { name: true } } }
    });

    const isPreview = req.query.preview === 'true';

    if (!pub || (pub.status !== 'PUBLIE' && !isPreview)) {
      return res.status(404).json({ success: false, error: 'Publication introuvable.' });
    }

    let imageUrl = pub.coverImage;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = await getPresignedUrl(imageUrl, 24 * 3600, true);
    }

    // Presign section images
    let parsedSections = [];
    if (pub.sections) {
      try {
        const secs = JSON.parse(pub.sections);
        parsedSections = await Promise.all(secs.map(async (s) => {
          let sImageUrl = s.imageKey;
          if (sImageUrl && !sImageUrl.startsWith('http') && !sImageUrl.startsWith('/')) {
            sImageUrl = await getPresignedUrl(sImageUrl, 24 * 3600, true);
          }
          return { ...s, imageUrl: sImageUrl };
        }));
      } catch (_) {}
    }
    
    res.json({ success: true, data: { ...pub, coverImageUrl: imageUrl, sections: parsedSections } });
  } catch (error) {
    console.error("Erreur GET publication publique:", error);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

// Route d'upload d'image pour le CMS
router.post('/upload', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucune image fournie.' });
    }
    
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `cms/images/${randomUUID()}-${safeName}`;
    
    await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);
    
    res.json({ success: true, url: s3Key });
  } catch (error) {
    console.error("Erreur upload image CMS:", error);
    res.status(500).json({ success: false, error: "Erreur lors de l'upload de l'image." });
  }
});

module.exports = router;
