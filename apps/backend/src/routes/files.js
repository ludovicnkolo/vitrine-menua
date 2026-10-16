const express = require("express");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");
const { Readable } = require("node:stream");
const crypto = require("node:crypto");
const { authenticateJWT } = require("../middlewares/auth");
const prisma = require("../prisma");
const { logAudit } = require("../utils/audit");
const { notify } = require("../utils/notify");
const { ensureClientSharingFolders } = require("../services/sharingFolderService");

const router = express.Router();

const {
  uploadToS3,
  getPresignedUrl,
  purgeFromS3,
  verifyUploadIntegrity,
} = require("../services/s3Service");

// Utilisation du stockage en mémoire pour multer avant l'envoi vers S3
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB — supporte les rapports, livrables et dossiers volumineux
    files: 1,
    fields: 10,
    fieldSize: 1024 * 1024,
  },
});

// Route POST : Upload sécurisé d'un fichier dans un bucket
router.post(
  "/upload",
  authenticateJWT,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Aucun fichier uploadé." });
    }

    try {
      let bucket = req.body.bucket || "temp";
      if (
        bucket.includes("..") ||
        bucket.startsWith("/") ||
        bucket.startsWith("\\")
      ) {
        bucket = "temp";
      }

      const randomHex = crypto.randomBytes(8).toString("hex");
      const uniqueSuffix = Date.now() + "-" + randomHex;
      const safeOriginalName = req.file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_",
      );
      const finalFilename = uniqueSuffix + "-" + safeOriginalName;
      const s3Key = `${bucket}/${finalFilename}`;

      // Upload to S3 directly from memory
      await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);

      // Vérification d'intégrité post-upload (prévient tout NoSuchKey ultérieur)
      await verifyUploadIntegrity(s3Key);

      res.json({
        success: true,
        message: "Fichier sauvegardé avec succès sur S3.",
        fileData: {
          filename: finalFilename,
          bucket: bucket,
          path: s3Key, // Chemin relatif/S3 Key à sauvegarder en BDD
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("S3 Upload Error:", error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de l'upload vers S3." });
    }
  },
);

// ─── ROUTE ATOMIQUE : Upload S3 + Rattachement BDD en une seule opération ──────
// Résout le bug de désynchronisation OVH ↔ BDD (P1).
// Si l'enregistrement en base échoue, le fichier est automatiquement supprimé
// de S3 (rollback), garantissant la cohérence entre OVH et le CRM.
router.post(
  "/upload-and-attach",
  authenticateJWT,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Aucun fichier uploadé." });
    }

    const { dossierId, missionId, name } = req.body;
    if (!dossierId && !missionId) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "dossierId ou missionId est requis pour rattacher le document.",
        });
    }

    let bucket = req.body.bucket || "ged";
    if (
      bucket.includes("..") ||
      bucket.startsWith("/") ||
      bucket.startsWith("\\")
    ) {
      bucket = "ged";
    }

    const randomHex = crypto.randomBytes(8).toString("hex");
    const uniqueSuffix = Date.now() + "-" + randomHex;
    const safeOriginalName = req.file.originalname.replace(
      /[^a-zA-Z0-9.-]/g,
      "_",
    );
    const finalFilename = uniqueSuffix + "-" + safeOriginalName;
    const s3Key = `${bucket}/${finalFilename}`;

    // ── ÉTAPE 1 : Upload S3 + vérification d'intégrité ──────────────────────────
    try {
      await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);
      // Contrôle post-upload : s'assurer que la clé est réellement accessible en OVH
      await verifyUploadIntegrity(s3Key);
    } catch (s3Error) {
      console.error({ event: "upload_s3_failed", error: s3Error.message });
      return res
        .status(502)
        .json({
          success: false,
          error: "Erreur lors de l'upload vers OVH. Aucune donnée enregistrée.",
        });
    }

    // ── ÉTAPE 2 : Enregistrement en BDD — avec rollback S3 si erreur ────────────
    let document;
    try {
      // Résolution de l'ID utilisateur (gestion du cas MASTER-ADMIN)
      let uploadedById = req.user?.id;
      if (uploadedById === "MASTER-ADMIN") {
        const masterUser =
          (await prisma.utilisateur.findUnique({
            where: { email: "contact@menuaconsulting.com" },
          })) || (await prisma.utilisateur.findFirst());
        uploadedById = masterUser?.id || uploadedById;
      }

      const rawSize = req.file.size;
      const formattedSize = req.body.fileSize || (rawSize < 1024 * 1024 
        ? `${Math.round(rawSize / 1024)} Ko` 
        : `${(rawSize / (1024 * 1024)).toFixed(1)} Mo`);

      let effectiveDossierId = dossierId;
      const isClientUpload =
        req.body.category === "DEPOT_CLIENT" ||
        req.body.category === "ENTRANT" ||
        req.body.direction === "ENTRANT" ||
        Boolean(req.body.demandId) ||
        Boolean(req.user?.clientId);

      const isSentToClient =
        req.body.category === "RESTITUTION" ||
        req.body.category === "LIVRABLE" ||
        req.body.category === "SORTANT" ||
        req.body.direction === "SORTANT" ||
        req.body.isSentToClient === "true" ||
        req.body.isSentToClient === true;

      let targetDossier = null;
      if (dossierId) {
        try {
          targetDossier = await prisma.dossier.findUnique({
            where: { id: dossierId },
            select: { id: true, clientId: true, parentDossierId: true },
          });
        } catch (err) {
          console.error("Erreur récupération targetDossier:", err);
        }
      }

      const effectiveClientId = req.user?.clientId || targetDossier?.clientId || null;

      // Si le dossier est un dossier client, router vers Sortant ou Entrant
      if (dossierId && (targetDossier?.clientId || req.user?.clientId || isClientUpload || isSentToClient)) {
        try {
          const folders = await ensureClientSharingFolders(dossierId);
          if (folders) {
            if (isClientUpload && folders.entrantFolder?.id) {
              // Documents transmis par le client -> sous-dossier « Entrant »
              effectiveDossierId = folders.entrantFolder.id;
            } else if (isSentToClient && folders.sortantFolder?.id) {
              // Documents et livrables transmis au client -> sous-dossier « Sortant »
              effectiveDossierId = folders.sortantFolder.id;
            }
          }
        } catch (folderErr) {
          console.error("Erreur routage dossier partage client:", folderErr);
        }
      }

      // ── Clôture et invalidation immédiate de toute demande active ──────────────
      // Que ce soit un lien magique d'acquisition ou une demande initiée dans le CRM,
      // dès qu'une pièce est transmise (ou que demandId est fourni), la demande est
      // invalidée / clôturée immédiatement, même avant son expiration.
      if (isClientUpload || req.body.demandId) {
        try {
          // 1. Clôture directe par ID de demande si précisé (Lien Magique ou Document DEMANDE)
          if (req.body.demandId) {
            await prisma.lienMagique.updateMany({
              where: { id: req.body.demandId },
              data: {
                isUsed: true,
                expiresAt: new Date(Date.now() - 1000),
              },
            }).catch(() => {});

            await prisma.document.updateMany({
              where: { id: req.body.demandId },
              data: {
                status: "TRAITE",
              },
            }).catch(() => {});
          }

          // 2. Recherche exhaustive de tous les dossiers associés au client
          const dossiersToClose = new Set();
          if (dossierId) dossiersToClose.add(dossierId);
          if (targetDossier?.id) dossiersToClose.add(targetDossier.id);
          if (effectiveDossierId) dossiersToClose.add(effectiveDossierId);

          if (effectiveClientId) {
            const clientDossiers = await prisma.dossier.findMany({
              where: { clientId: effectiveClientId },
              select: { id: true },
            });
            clientDossiers.forEach((d) => dossiersToClose.add(d.id));
          }

          const closeDossierIds = Array.from(dossiersToClose);

          if (closeDossierIds.length > 0) {
            // Clôturer les documents de catégorie DEMANDE
            await prisma.document.updateMany({
              where: {
                dossierId: { in: closeDossierIds },
                category: "DEMANDE",
                status: "ACTION_REQUISE",
              },
              data: {
                status: "TRAITE",
              },
            }).catch((e) => console.error("Erreur clôture document DEMANDE:", e));

            // Clôturer et invalider les liens magiques d'acquisition (même avant expiration)
            await prisma.lienMagique.updateMany({
              where: {
                dossierId: { in: closeDossierIds },
                type: "ACQUISITION",
              },
              data: {
                isUsed: true,
                expiresAt: new Date(Date.now() - 1000),
              },
            }).catch((e) => console.error("Erreur clôture lienMagique ACQUISITION:", e));
          }
        } catch (closeErr) {
          console.error("Erreur clôture demandes/liens magiques:", closeErr);
        }
      }

      document = await prisma.document.create({
        data: {
          name: name || req.file.originalname,
          url: s3Key,
          uploadedById,
          status: req.body.status || (isClientUpload ? "EN_COURS" : "VALIDE"),
          note: req.body.note || null,
          fileSize: formattedSize,
          category:
            req.body.category ||
            (isClientUpload ? "DEPOT_CLIENT" : isSentToClient ? "SORTANT" : "DOCUMENT"),
          ...(effectiveDossierId && { dossierId: effectiveDossierId }),
          ...(missionId && { missionId }),
        },
        include: { uploadedBy: true },
      });
    } catch (dbError) {
      // ── ROLLBACK : Suppression du fichier S3 pour éviter un orphelin ───────────
      console.error({
        event: "db_insert_failed_rolling_back_s3",
        s3Key,
        error: dbError.message,
      });
      try {
        await purgeFromS3(s3Key);
        console.info({ event: "s3_rollback_success", s3Key });
      } catch (rollbackError) {
        // Le fichier reste dans S3 — logué pour nettoyage manuel / cron futur
        console.error({
          event: "s3_rollback_failed",
          s3Key,
          error: rollbackError.message,
        });
      }
      return res.status(500).json({
        success: false,
        error:
          "Erreur lors de l'enregistrement en base de données. Le fichier n'a pas été conservé.",
      });
    }

    // ── ÉTAPE 3 : Audit trail & Notification Super-Admin ─────────────────────────
    try {
      let dossierInfo = null;
      if (document.dossierId) {
        dossierInfo = await prisma.dossier.findUnique({
          where: { id: document.dossierId },
          include: { client: true },
        });
        if (!dossierInfo?.client && dossierInfo?.parentDossierId) {
          const parent = await prisma.dossier.findUnique({
            where: { id: dossierInfo.parentDossierId },
            include: { client: true },
          });
          if (parent?.client) dossierInfo.client = parent.client;
          if (!dossierInfo.reference) dossierInfo.reference = parent?.reference;
        }
      }

      const clientName =
        dossierInfo?.client?.raisonSociale ||
        dossierInfo?.client?.name ||
        req.user?.name ||
        "Client";
      const dossierName =
        dossierInfo?.name || dossierInfo?.reference || "Dossier";

      if (isClientUpload) {
        // 1. Audit trail pour le dépôt client
        await logAudit(
          req.user?.id,
          "DEPOT_DOCUMENT_CLIENT",
          document.id,
          "DOCUMENT",
          `Dépôt du fichier « ${document.name} » par le client « ${clientName} » dans le dossier « ${dossierName} » (${dossierInfo?.reference || ""})`,
          document.dossierId || null,
        );

        // 2. Notification aux Super-Administrateurs avec Nom du fichier, Nom du client et Nom du dossier
        const superAdmins = await prisma.utilisateur.findMany({
          where: { role: { name: "Super-administrateur" } },
          select: { id: true },
        });

        if (superAdmins.length > 0) {
          await notify(
            superAdmins.map((sa) => sa.id),
            {
              type: "DEPOT_DOCUMENT_CLIENT",
              title: "Nouveau document déposé par un client",
              message: `Le client « ${clientName} » a transmis le fichier « ${document.name} » dans le dossier « ${dossierName} » (${dossierInfo?.reference || ""}).`,
              targetId: document.dossierId || null,
              targetType: "DOSSIER",
            },
          );
        }

        // 3. Événement temps réel WebSocket
        const io = req.app?.get("io");
        if (io) {
          io.emit("entity_updated_global", {
            entity: "DOCUMENT",
            action: "CLIENT_UPLOAD",
            dossierId: document.dossierId,
            documentId: document.id,
            clientName,
            fileName: document.name,
          });
        }
      } else {
        await logAudit(
          req.user?.id,
          "AJOUT_DOCUMENT",
          document.id,
          "DOCUMENT",
          `Document rattaché (atomique): ${document.name}`,
          document.dossierId || null,
        );
      }
    } catch (auditError) {
      console.warn({ event: "audit_log_failed", error: auditError.message });
    }

    return res.status(201).json({
      success: true,
      message: "Document uploadé et rattaché avec succès.",
      document,
    });
  },
);

// Route GET : Téléchargement sécurisé via le backend (Redirection S3 Presigned URL)
router.get("/download/:bucket/:filename", authenticateJWT, async (req, res) => {
  const { bucket, filename } = req.params;

  if (
    bucket.includes("..") ||
    filename.includes("..") ||
    bucket.includes("/")
  ) {
    return res.status(403).json({ success: false, error: "Accès interdit." });
  }

  const s3Key = `${bucket}/${filename}`;

  try {
    const url = await getPresignedUrl(s3Key, 3600, false); // false = force download via content-disposition
    res.redirect(url);
  } catch (error) {
    console.error("Erreur génération URL S3:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Erreur lors de la génération du lien de téléchargement.",
      });
  }
});

// Route GET : Consultation inline (Affichage navigateur via Presigned URL)
// Le wildcard (*) permet de capturer des clés S3 multi-niveaux comme :
// menua-ged-prod/dossiers/dos-05/fichier.pdf
router.get("/view/*", authenticateJWT, async (req, res) => {
  // req.params[0] contient tout ce qui suit /view/
  const fullPath = decodeURIComponent(req.params[0] || "");
  const slashIndex = fullPath.indexOf("/");

  if (slashIndex === -1) {
    return res.status(400).json({ success: false, error: "Chemin S3 invalide." });
  }

  const bucket = fullPath.substring(0, slashIndex);
  const filename = fullPath.substring(slashIndex + 1);

  if (bucket.includes("..") || filename.includes("..")) {
    return res.status(403).json({ success: false, error: "Accès interdit." });
  }

  const s3Key = `${bucket}/${filename}`;

  try {
    const url = await getPresignedUrl(s3Key, 3600, true); // true = inline display

    if (req.query.stream === "true") {
      // Proxy le fichier depuis S3 via le backend pour éviter le blocage CORS
      // S3 OVH ne retourne pas Access-Control-Allow-Origin sur les URLs présignées
      const fetchResponse = await fetch(url);
      if (!fetchResponse.ok) {
        console.error(`[S3] ${fetchResponse.status} pour la clé : ${s3Key}`);
        return res
          .status(fetchResponse.status)
          .json({
            success: false,
            error: `Fichier introuvable (S3 ${fetchResponse.status}).`,
          });
      }
      let contentType = fetchResponse.headers.get("content-type");
      if (!contentType || contentType === "application/octet-stream" || contentType === "binary/octet-stream") {
        if (/\.jpe?g$/i.test(filename)) contentType = "image/jpeg";
        else if (/\.png$/i.test(filename)) contentType = "image/png";
        else if (/\.gif$/i.test(filename)) contentType = "image/gif";
        else if (/\.webp$/i.test(filename)) contentType = "image/webp";
        else if (/\.svg$/i.test(filename)) contentType = "image/svg+xml";
        else if (/\.pdf$/i.test(filename)) contentType = "application/pdf";
        else contentType = "application/octet-stream";
      }
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "private, max-age=3600");
      const arrayBuffer = await fetchResponse.arrayBuffer();
      return res.end(Buffer.from(arrayBuffer));
    }

    // Sans stream=true : redirection simple vers S3 (pour téléchargement direct)
    res.redirect(url);
  } catch (error) {
    console.error("Erreur génération URL S3 inline:", error);
    res
      .status(500)
      .json({ success: false, error: "Erreur de lecture du fichier." });
  }
});
// ─── P3 : REMPLACEMENT DE DOCUMENT (PHYSIQUE) ────────────────────────────────
// Remplace le fichier S3 d'un document existant, en conservant son ID en base.
// Si l'upload réussit mais la BDD échoue, le nouveau fichier S3 est supprimé (rollback).
// Si tout réussit, l'ancien fichier S3 est supprimé pour libérer de l'espace.
router.post(
  "/replace/:id",
  authenticateJWT,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Aucun fichier uploadé." });
    }

    try {
      const docId = req.params.id;
      const document = await prisma.document.findUnique({
        where: { id: docId },
      });
      if (!document) {
        return res
          .status(404)
          .json({ success: false, error: "Document introuvable." });
      }
      if (document.isDeleted) {
        return res
          .status(409)
          .json({
            success: false,
            error:
              "Ce document est dans la corbeille. Restaurez-le pour le modifier.",
          });
      }

      const oldS3Key = document.url;
      let bucket = oldS3Key.split("/")[0] || "ged";

      const randomHex = crypto.randomBytes(8).toString("hex");
      const uniqueSuffix = Date.now() + "-" + randomHex;
      const safeOriginalName = req.file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_",
      );
      const finalFilename = uniqueSuffix + "-" + safeOriginalName;
      const newS3Key = `${bucket}/${finalFilename}`;

      // ── ÉTAPE 1 : Upload nouveau fichier S3 + vérification d'intégrité
      try {
        await uploadToS3(req.file.buffer, newS3Key, req.file.mimetype);
        // Contrôle post-upload : garantir que la nouvelle clé est accessible avant de modifier la BDD
        await verifyUploadIntegrity(newS3Key);
      } catch (s3Error) {
        console.error({
          event: "replace_s3_upload_failed",
          error: s3Error.message,
        });
        return res
          .status(502)
          .json({
            success: false,
            error: "Erreur lors de l'upload du nouveau fichier vers OVH.",
          });
      }

      // ── ÉTAPE 2 : Mise à jour BDD (avec rollback)
      let updatedDoc;
      try {
        updatedDoc = await prisma.document.update({
          where: { id: docId },
          data: {
            url: newS3Key,
            // Optionnel: on peut mettre à jour le nom si le client le souhaite,
            // mais généralement on garde le nom logique ou on prend le nouveau originalname.
            // Ici on met à jour le nom si on le reçoit, sinon le nom d'origine du fichier.
            name: req.body.name || req.file.originalname,
          },
          include: { uploadedBy: true },
        });
      } catch (dbError) {
        // ── ROLLBACK : Suppression du nouveau fichier S3
        console.error({
          event: "replace_db_update_failed_rolling_back_s3",
          newS3Key,
          error: dbError.message,
        });
        try {
          await purgeFromS3(newS3Key);
        } catch (rollbackError) { }
        return res
          .status(500)
          .json({
            success: false,
            error: "Erreur lors de la mise à jour en base de données.",
          });
      }

      // ── ÉTAPE 3 : Suppression de l'ANCIEN fichier S3
      try {
        await purgeFromS3(oldS3Key);
      } catch (cleanupError) {
        console.warn({
          event: "replace_old_s3_cleanup_failed",
          oldS3Key,
          error: cleanupError.message,
        });
        // Non bloquant. Le cron P4 finira par nettoyer les orphelins si nécessaire,
        // bien que cet ancien fichier n'ait plus de ref en BDD.
      }

      // Audit trail
      try {
        await logAudit(
          req.user?.id,
          "MODIFICATION_DOCUMENT",
          document.id,
          "DOCUMENT",
          `Document remplacé: ${document.name} -> ${updatedDoc.name}`,
          document.dossierId || null,
        );
      } catch (e) { }

      return res.json({
        success: true,
        message: "Fichier remplacé avec succès.",
        document: updatedDoc,
      });
    } catch (error) {
      console.error("Replace Error:", error);
      res
        .status(500)
        .json({
          success: false,
          error: "Erreur serveur lors du remplacement.",
        });
    }
  },
);

module.exports = router;
