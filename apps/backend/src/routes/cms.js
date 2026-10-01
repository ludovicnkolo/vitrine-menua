const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middlewares/auth");
const multer = require("multer");
const { uploadToS3, getPresignedUrl } = require("../services/s3Service");
const { randomUUID } = require("crypto");

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for images
});

// ── Génère une URL permanente et publique pour une image CMS stockée sur OVH S3 ──
// Les images CMS sont publiques : pas besoin d'URL présignée qui expire.
// Format OVH : https://<bucket>.<endpoint-sans-https>/<key>
function getCmsPublicUrl(key) {
  if (!key) return null;
  if (key.startsWith("http") || key.startsWith("/")) return key; // Déjà une URL ou un chemin local
  const endpoint = (process.env.S3_ENDPOINT || "https://s3.eu-west-par.io.cloud.ovh.net/")
    .replace(/\/+$/, "") // Enlève le slash final
    .replace(/^https?:\/\//, ""); // Enlève le protocole
  const bucket = process.env.S3_BUCKET || "menua-ged-prod";
  return `https://${bucket}.${endpoint}/${key}`;
}
// ── Paramètres des formulaires ──
const fs = require("node:fs");
const path = require("node:path");
const FORM_SETTINGS_PATH = path.join(__dirname, "../config/form_settings.json");

// Récupérer les paramètres des formulaires
router.get("/settings/forms", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "Super-administrateur" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Accès refusé" });
    }
    const raw = fs.readFileSync(FORM_SETTINGS_PATH, "utf-8");
    res.json({ success: true, data: JSON.parse(raw) });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Erreur lecture paramètres" });
  }
});

// Mettre à jour les paramètres des formulaires
router.put("/settings/forms", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "Super-administrateur" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Accès refusé" });
    }
    const current = JSON.parse(fs.readFileSync(FORM_SETTINGS_PATH, "utf-8"));
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id,
    };
    fs.writeFileSync(FORM_SETTINGS_PATH, JSON.stringify(updated, null, 2));
    res.json({ success: true, data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Erreur écriture paramètres" });
  }
});

// Récupérer toutes les publications (public ou admin)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const publications = await prisma.publication.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const pubsWithUrl = await Promise.all(
      publications.map(async (pub) => {
        let imageUrl = pub.coverImage;
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
          try {
            // URL présignée pour l'admin (protégé par JWT) — valide 1h
            imageUrl = await getPresignedUrl(imageUrl, 3600, true);
          } catch (_) {
            // Fallback : essayer l'URL publique OVH
            imageUrl = getCmsPublicUrl(pub.coverImage);
          }
        }
        // Sections images
        let parsedSections = [];
        if (pub.sections) {
          try {
            const secs = JSON.parse(pub.sections);
            parsedSections = await Promise.all(
              secs.map(async (s) => {
                let sImageUrl = s.imageKey;
                if (sImageUrl && !sImageUrl.startsWith("http") && !sImageUrl.startsWith("/")) {
                  try {
                    sImageUrl = await getPresignedUrl(sImageUrl, 3600, true);
                  } catch (_) {
                    sImageUrl = getCmsPublicUrl(s.imageKey);
                  }
                }
                return { ...s, imageUrl: sImageUrl };
              }),
            );
          } catch (_) {}
        }
        return { ...pub, coverImageUrl: imageUrl, sections: parsedSections };
      }),
    );

    res.json({ success: true, data: pubsWithUrl });
  } catch (error) {
    console.error("Erreur GET publications:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// Créer une nouvelle publication
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const {
      title,
      title_en,
      type,
      category,
      category_en,
      location,
      contentHtml,
      contentHtml_en,
      sections,
      sections_en,
      coverImage,
      status,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "Le titre est obligatoire." });
    }

    const pubType = type || "ACTUALITE";
    if (pubType === "ACTUALITE" && !category) {
      return res
        .status(400)
        .json({
          success: false,
          error: "La rubrique (category) est obligatoire pour une actualité.",
        });
    }

    const pub = await prisma.publication.create({
      data: {
        title,
        title_en: title_en || null,
        type: type || "ACTUALITE",
        category,
        category_en: category_en || null,
        location,
        contentHtml: contentHtml || "",
        contentHtml_en: contentHtml_en || null,
        sections: sections ? JSON.stringify(sections) : null,
        sections_en: sections_en ? JSON.stringify(sections_en) : null,
        coverImage,
        status: status || "BROUILLON",
        authorId: req.user.id,
        publishedAt: status === "PUBLIE" ? new Date() : null,
      },
    });

    res.json({ success: true, data: pub });
  } catch (error) {
    console.error("Erreur POST publication:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Erreur lors de la création de la publication.",
      });
  }
});

// Mettre à jour une publication
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      title_en,
      type,
      category,
      category_en,
      location,
      contentHtml,
      contentHtml_en,
      sections,
      sections_en,
      coverImage,
      status,
    } = req.body;

    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, error: "Publication introuvable." });
    }

    const dataToUpdate = {
      title,
      title_en: title_en || null,
      type,
      category,
      category_en: category_en || null,
      location,
      contentHtml,
      contentHtml_en: contentHtml_en || null,
      sections: sections ? JSON.stringify(sections) : null,
      sections_en: sections_en ? JSON.stringify(sections_en) : null,
      coverImage,
      status,
    };

    if (status === "PUBLIE" && existing.status !== "PUBLIE") {
      dataToUpdate.publishedAt = new Date();
    }

    const pub = await prisma.publication.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ success: true, data: pub });
  } catch (error) {
    console.error("Erreur PUT publication:", error);
    res
      .status(500)
      .json({ success: false, error: "Erreur lors de la mise à jour." });
  }
});

// Supprimer une publication
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.publication.delete({ where: { id } });
    res.json({ success: true, message: "Publication supprimée avec succès." });
  } catch (error) {
    console.error("Erreur DELETE publication:", error);
    res
      .status(500)
      .json({ success: false, error: "Erreur lors de la suppression." });
  }
});

// Route publique pour le site vitrine (sans authentification)
router.get("/public", async (req, res) => {
  try {
    const { type } = req.query;
    const where = { status: "PUBLIE" };
    if (type) where.type = type;

    const publications = await prisma.publication.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
    });

    const pubsWithUrl = publications.map((pub) => {
      // URL permanente publique (jamais d'expiration)
      const imageUrl = getCmsPublicUrl(pub.coverImage);
      // Sections images
      let parsedSections = [];
      if (pub.sections) {
        try {
          const secs = JSON.parse(pub.sections);
          parsedSections = secs.map((s) => ({
            ...s,
            imageUrl: getCmsPublicUrl(s.imageKey),
          }));
        } catch (_) {}
      }
      return { ...pub, coverImageUrl: imageUrl, sections: parsedSections };
    });

    res.json({ success: true, data: pubsWithUrl });
  } catch (error) {
    console.error("Erreur GET publications publiques:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// Route publique pour récupérer une publication spécifique
router.get("/public/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pub = await prisma.publication.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });

    const isPreview = req.query.preview === "true";

    if (!pub || (pub.status !== "PUBLIE" && !isPreview)) {
      return res
        .status(404)
        .json({ success: false, error: "Publication introuvable." });
    }

    // URL permanente publique (jamais d'expiration)
    const imageUrl = getCmsPublicUrl(pub.coverImage);

    // Sections images — URLs permanentes
    let parsedSections = [];
    if (pub.sections) {
      try {
        const secs = JSON.parse(pub.sections);
        parsedSections = secs.map((s) => ({
          ...s,
          imageUrl: getCmsPublicUrl(s.imageKey),
        }));
      } catch (_) {}
    }

    res.json({
      success: true,
      data: { ...pub, coverImageUrl: imageUrl, sections: parsedSections },
    });
  } catch (error) {
    console.error("Erreur GET publication publique:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// Route d'upload d'image pour le CMS
router.post(
  "/upload",
  authenticateJWT,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: "Aucune image fournie." });
      }

      const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const s3Key = `cms/images/${randomUUID()}-${safeName}`;

      try {
        // Upload l'image avec ACL public-read pour permettre les URLs permanentes
        const { PutObjectCommand } = require("@aws-sdk/client-s3");
        const { s3Client } = require("../services/s3Service");
        const putCmd = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET || "menua-ged-prod",
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          ACL: "public-read", // Rend l'image accessible publiquement via URL permanente
        });
        await s3Client.send(putCmd);
        // Retourner la clé S3 (sera convertie en URL publique à l'affichage)
        res.json({ success: true, url: s3Key, publicUrl: getCmsPublicUrl(s3Key) });
      } catch (s3Error) {
        console.warn(
          "[CMS] OVH S3 indisponible, fallback stockage local:",
          s3Error.message,
        );

        const fs = require("fs");
        const path = require("path");

        const vitrinePath = path.join(
          __dirname,
          "../../../vitrine/public/uploads/cms/images",
        );
        const adminPath = path.join(
          __dirname,
          "../../../admin/public/uploads/cms/images",
        );

        const fileName = s3Key.split("/").pop();
        const fileBuffer = req.file.buffer;
        const fileMime = req.file.mimetype;

        fs.mkdirSync(vitrinePath, { recursive: true });
        fs.mkdirSync(adminPath, { recursive: true });

        fs.writeFileSync(path.join(vitrinePath, fileName), fileBuffer);
        fs.writeFileSync(path.join(adminPath, fileName), fileBuffer);

        const localUrl = `/uploads/cms/images/${fileName}`;

        // Retry S3 upload in background (every 30s, up to 10 attempts)
        let retries = 0;
        const maxRetries = 10;
        const retryInterval = setInterval(async () => {
          retries++;
          try {
            await uploadToS3(fileBuffer, s3Key, fileMime);
            console.log(
              `[CMS] Retry S3 réussi (tentative ${retries}) pour ${s3Key}`,
            );
            clearInterval(retryInterval);
            // Cleanup local files after successful S3 upload
            try {
              fs.unlinkSync(path.join(vitrinePath, fileName));
            } catch (_) {}
            try {
              fs.unlinkSync(path.join(adminPath, fileName));
            } catch (_) {}
          } catch (retryErr) {
            if (retries >= maxRetries) {
              console.error(
                `[CMS] Abandon du retry S3 après ${maxRetries} tentatives pour ${s3Key}`,
              );
              clearInterval(retryInterval);
            } else {
              console.warn(
                `[CMS] Retry S3 échoué (tentative ${retries}/${maxRetries}) :`,
                retryErr.message,
              );
            }
          }
        }, 30 * 1000); // retry every 30 seconds

        res.json({ success: true, url: localUrl, fallback: true });
      }
    } catch (error) {
      console.error("Erreur upload image CMS:", error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de l'upload de l'image." });
    }
  },
);

module.exports = router;
