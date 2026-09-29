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
const { transporter } = require("../utils/mailer");

// Multer in memory for S3 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max per file
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// Create a new Magic Link
router.post("/generate", authenticateJWT, async (req, res) => {
  try {
    const { dossierId, type, expiresInDays = 7, note, attachedDocumentIds } = req.body;

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
        attachedDocumentIds: attachedDocumentIds
          ? JSON.stringify(attachedDocumentIds)
          : null,
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
      ["BLOQUE", "ARCHIVE", "CORBEILLE", "CLOTURE", "ANNULEE"].includes(
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
        ANNULEE: "Ce dossier a été annulé.",
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

    // If LIVRAISON, generate presigned URLs for documents attached to this link only
    if (magicLink.type === "LIVRAISON") {
      let allowedIds = null;
      if (magicLink.attachedDocumentIds) {
        try {
          allowedIds = JSON.parse(magicLink.attachedDocumentIds);
        } catch (_) {}
      }

      const activeDocs = magicLink.dossier.documents.filter((d) => {
        if (d.isDeleted) return false;
        if (allowedIds && allowedIds.length > 0) {
          return allowedIds.includes(d.id);
        }
        // Fallback si pas d'IDs enregistrés : ne rien montrer
        return false;
      });
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

    // ── Traçabilité : log l'accès au lien ───────────────────────────────────
    try {
      await logAudit(
        null,
        "ACCES_LIEN_MAGIQUE",
        magicLink.id,
        "MAGIC_LINK",
        `Accès au lien magique (${magicLink.type}) — IP: ${req.ip || "inconnue"}`,
        magicLink.dossierId,
      );
    } catch (_) {}

    res.json({ success: true, data });
  } catch (error) {
    console.error("Erreur vérification lien magique:", error);
    res.status(500).json({ success: false, error: "Erreur serveur." });
  }
});

// ─── Log download via Magic Link ─────────────────────────────────────────────
router.post("/log-download/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { documentName } = req.body;
    const magicLink = await prisma.lienMagique.findUnique({ where: { token } });
    if (!magicLink) return res.status(404).json({ success: false });

    await logAudit(
      null,
      "TELECHARGEMENT_DOCUMENT_MAGIQUE",
      magicLink.id,
      "MAGIC_LINK",
      `Téléchargement via lien magique : "${documentName || "inconnu"}" — IP: ${req.ip || "inconnue"}`,
      magicLink.dossierId,
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur log téléchargement:", error);
    res.status(500).json({ success: false });
  }
});

// ─── Send Magic Link by email ─────────────────────────────────────────────────
router.post("/send-email/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientEmail, magicUrl } = req.body;

    if (!recipientEmail || !magicUrl) {
      return res.status(400).json({ success: false, error: "Email et URL requis." });
    }

    const magicLink = await prisma.lienMagique.findUnique({
      where: { id },
      include: { dossier: { include: { client: true } } },
    });
    if (!magicLink) {
      return res.status(404).json({ success: false, error: "Lien introuvable." });
    }

    const isLivraison = magicLink.type === "LIVRAISON";
    const dossierRef = magicLink.dossier?.reference || "votre dossier";
    const expiresAt = new Date(magicLink.expiresAt).toLocaleDateString("fr-FR");

    const subject = isLivraison
      ? `Menua Consulting – Documents mis à votre disposition (Réf. ${dossierRef})`
      : `Menua Consulting – Demande de documents (Réf. ${dossierRef})`;

    const actionLabel = isLivraison
      ? "Accéder à mes documents"
      : "Déposer mes documents";

    const bodyText = isLivraison
      ? `Bonjour,\n\nMenua Consulting met à votre disposition des documents dans le cadre de votre dossier (Réf. ${dossierRef}).\n\nVeuillez cliquer sur le lien ci-dessous pour y accéder :\n${magicUrl}\n\nCe lien est valable jusqu'au ${expiresAt}.\n\nCordialement,\nMenua Consulting`
      : `Bonjour,\n\nMenua Consulting vous invite à déposer des documents dans le cadre de votre dossier (Réf. ${dossierRef}).\n\nVeuillez cliquer sur le lien ci-dessous pour effectuer votre dépôt :\n${magicUrl}\n\nCe lien est valable jusqu'au ${expiresAt}.${magicLink.note ? "\n\nMessage de votre conseiller :\n" + magicLink.note : ""}\n\nCordialement,\nMenua Consulting`;

    const bodyHtml = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <tr><td style="background:#141824;padding:28px 40px;text-align:center">
        <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:1px">Menua Consulting</span>
      </td></tr>
      <tr><td style="padding:36px 40px">
        <p style="color:#141824;font-size:16px;margin:0 0 16px">Bonjour,</p>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px">
          ${isLivraison
            ? `Menua Consulting met à votre disposition des documents dans le cadre de votre dossier <strong>(Réf. ${dossierRef})</strong>.`
            : `Menua Consulting vous invite à déposer des documents dans le cadre de votre dossier <strong>(Réf. ${dossierRef})</strong>.`
          }
        </p>
        ${magicLink.note ? `<div style="background:#f8fafc;border-left:4px solid #141824;padding:14px 18px;margin:0 0 24px;border-radius:4px"><p style="margin:0;color:#141824;font-size:14px;line-height:1.6">${magicLink.note.replace(/\n/g, "<br>")}</p></div>` : ""}
        <div style="text-align:center;margin:32px 0">
          <a href="${magicUrl}" style="background:#141824;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block">${actionLabel}</a>
        </div>
        <p style="color:#999;font-size:13px;margin:0">Ce lien est valable jusqu'au <strong>${expiresAt}</strong>. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:16px 40px;text-align:center">
        <p style="color:#999;font-size:12px;margin:0">© Menua Consulting · contact@menuaconsulting.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    await transporter.sendMail({
      from: `"Menua Consulting" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    await logAudit(
      req.user.id,
      "ENVOI_EMAIL_LIEN_MAGIQUE",
      magicLink.id,
      "MAGIC_LINK",
      `Lien magique (${magicLink.type}) envoyé par email à ${recipientEmail}`,
      magicLink.dossierId,
    );

    res.json({ success: true, message: "Email envoyé avec succès." });
  } catch (error) {
    console.error("Erreur envoi email lien magique:", error);
    res.status(500).json({ success: false, error: "Erreur lors de l'envoi de l'email." });
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
