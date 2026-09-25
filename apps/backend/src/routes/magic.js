const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middlewares/auth");
const multer = require("multer");
const { uploadToS3, getPresignedUrl } = require("../services/s3Service");
const { randomUUID } = require("crypto");
const path = require("path");

const router = express.Router();
const prisma = new PrismaClient();
const { logAudit } = require("../utils/audit");
const { notify } = require("../utils/notify");

// Multer in memory for S3 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per file
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// Create a new Magic Link
router.post("/generate", authenticateJWT, async (req, res) => {
  try {
    const { dossierId, type, expiresInDays = 7, note } = req.body;

    if (!dossierId || !type) {
      return res
        .status(400)
        .json({ success: false, error: "dossierId et type requis." });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays, 10));

    const magicLink = await prisma.lienMagique.create({
      data: {
        type,
        dossierId,
        createdBy: req.user.id,
        expiresAt,
        note: note || null,
      },
    });

    await logAudit(
      req.user.id,
      "CREATION_LIEN_MAGIQUE",
      magicLink.id,
      "MAGIC_LINK",
      `Lien magique (${type}) généré pour le dossier`,
      dossierId,
    );

    res.json({ success: true, data: magicLink });
  } catch (error) {
    console.error("Erreur génération lien magique:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// List Magic Links for a Dossier
router.get("/dossier/:dossierId", authenticateJWT, async (req, res) => {
  try {
    const { dossierId } = req.params;
    const links = await prisma.lienMagique.findMany({
      where: { dossierId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: links });
  } catch (error) {
    console.error("Erreur listing liens magiques:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// Revoke a Magic Link
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const link = await prisma.lienMagique.findUnique({
      where: { id: req.params.id },
    });
    if (link) {
      await prisma.lienMagique.delete({ where: { id: req.params.id } });
      await logAudit(
        req.user.id,
        "REVOCATION_LIEN_MAGIQUE",
        req.params.id,
        "MAGIC_LINK",
        `Lien magique révoqué`,
        link.dossierId,
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur révocation lien magique:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// ─── PUBLIC ROUTES (CLIENT FACING) ──────────────────────────────────────────

// Verify token and get info (Dossier name, allowed actions)
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const magicLink = await prisma.lienMagique.findUnique({
      where: { token },
      include: {
        dossier: {
          include: { client: true, documents: true },
        },
      },
    });

    if (!magicLink) {
      return res
        .status(404)
        .json({ success: false, error: "Lien invalide ou introuvable." });
    }

    if (new Date() > new Date(magicLink.expiresAt)) {
      return res
        .status(403)
        .json({
          success: false,
          error:
            "Ce lien a expiré. Veuillez contacter votre conseiller pour obtenir un nouveau lien.",
        });
    }

    // ── Vérification du statut du dossier ────────────────────────────────────
    const dossierStatus = magicLink.dossier?.status;
    if (
      ["BLOQUE", "ARCHIVE", "CORBEILLE", "CLOTURE", "ANNULE"].includes(
        dossierStatus,
      )
    ) {
      const statusMessages = {
        BLOQUE:
          "Ce lien est temporairement suspendu. Veuillez contacter votre conseiller.",
        ARCHIVE:
          "Ce dossier est archivé. Les échanges de documents ne sont plus possibles.",
        CORBEILLE: "Ce dossier n'est plus disponible.",
        CLOTURE:
          "Ce dossier est clôturé. Les échanges de documents ne sont plus possibles.",
        ANNULE: "Ce dossier a été annulé.",
      };
      return res
        .status(403)
        .json({
          success: false,
          error:
            statusMessages[dossierStatus] || "Ce dossier n'est plus actif.",
        });
    }

    // Only expose safe information
    const data = {
      id: magicLink.id,
      type: magicLink.type,
      note: magicLink.note || null,
      dossierRef: magicLink.dossier.reference,
      clientName:
        magicLink.dossier.client?.raisonSocial ||
        magicLink.dossier.client?.nom ||
        "Client",
      documents: [],
    };

    // If LIVRAISON, generate presigned URLs for documents attached to this dossier
    if (magicLink.type === "LIVRAISON") {
      const activeDocs = magicLink.dossier.documents.filter(
        (d) => !d.isDeleted,
      );
      const docsWithUrls = await Promise.all(
        activeDocs.map(async (doc) => {
          // If it's an S3 object (no path traversal ./), we generate a presigned URL
          let downloadUrl = doc.url;
          if (!doc.url.startsWith("/") && !doc.url.startsWith("http")) {
            downloadUrl = await getPresignedUrl(doc.url, 3600, false); // force download
          }
          return {
            id: doc.id,
            name: doc.name,
            type: doc.type,
            downloadUrl,
          };
        }),
      );
      data.documents = docsWithUrls;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Erreur vérification lien magique:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// Upload files via Magic Link (ACQUISITION)
router.post("/upload/:token", upload.array("files", 10), async (req, res) => {
  try {
    const { token } = req.params;
    const magicLink = await prisma.lienMagique.findUnique({ where: { token } });

    if (!magicLink)
      return res.status(404).json({ success: false, error: "Lien invalide." });
    if (new Date() > new Date(magicLink.expiresAt))
      return res.status(403).json({ success: false, error: "Lien expiré." });
    if (magicLink.type !== "ACQUISITION")
      return res
        .status(403)
        .json({
          success: false,
          error: "Ce lien ne permet pas le dépôt de fichiers.",
        });

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Aucun fichier fourni." });
    }

    const uploadedDocs = [];

    for (const file of req.files) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const s3Key = `dossiers/${magicLink.dossierId}/${randomUUID()}-${safeName}`;

      // Upload to S3
      await uploadToS3(file.buffer, s3Key, file.mimetype);

      // Create Document in DB
      const doc = await prisma.document.create({
        data: {
          dossierId: magicLink.dossierId,
          name: file.originalname,
          url: s3Key,
          uploadedById: magicLink.createdBy,
        },
      });
      uploadedDocs.push(doc);
    }

    if (uploadedDocs.length > 0) {
      await logAudit(
        magicLink.createdBy,
        "DEPOT_DOCUMENT_MAGIQUE",
        uploadedDocs[0].id,
        "DOCUMENT",
        `${uploadedDocs.length} document(s) déposé(s) via Lien Magique (${uploadedDocs.map((d) => d.name).join(", ")})`,
        magicLink.dossierId,
      );

      // ── Notification Super-Admin & Traitant ──
      try {
        const superAdmins = await prisma.utilisateur.findMany({
          where: { role: { name: "Super-administrateur" } },
          select: { id: true },
        });
        const dossier = await prisma.dossier.findUnique({
          where: { id: magicLink.dossierId },
          select: { traitantId: true },
        });

        const notifyIds = new Set();
        superAdmins.forEach((sa) => notifyIds.add(sa.id));
        if (dossier && dossier.traitantId) notifyIds.add(dossier.traitantId);

        if (notifyIds.size > 0) {
          await notify(Array.from(notifyIds), {
            type: "DOCUMENT_AJOUTE",
            title: "Nouveau dépôt client",
            message: `Le client a déposé ${uploadedDocs.length} document(s) via son lien sécurisé.`,
            targetId: magicLink.dossierId,
            targetType: "DOSSIER",
          });
        }
      } catch (notifErr) {
        console.error("Erreur notification dépôt magique:", notifErr);
      }
    }

    res.json({
      success: true,
      message: `${uploadedDocs.length} fichier(s) uploadé(s) avec succès.`,
      count: uploadedDocs.length,
    });
  } catch (error) {
    console.error("Erreur upload via lien magique:", error);
    res
      .status(500)
      .json({ success: false, error: "Erreur lors du transfert de fichiers." });
  }
});

module.exports = router;
