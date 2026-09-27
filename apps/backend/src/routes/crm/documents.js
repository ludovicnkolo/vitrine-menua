const express = require("express");
const prisma = require("../../prisma");
const crypto = require("node:crypto");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const fs = require("node:fs");
const path = require("node:path");
const router = express.Router();

const {
  authenticateJWT,
  requireRoles,
  isSuperAdmin,
  isAdmin,
  isManager,
} = require("../../middlewares/auth");
const { transporter } = require("../../utils/mailer");
const { logAudit } = require("../../utils/audit");

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER || "contact@menuaconsulting.com",
    password: process.env.IMAP_PASSWORD || "",
    host: process.env.IMAP_HOST || "ssl0.ovh.net",
    port: process.env.IMAP_PORT ? Number.parseInt(process.env.IMAP_PORT) : 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

const getPaginationParams = (query, defaultLimit = 6) => {
  const page = Number.parseInt(query.page) || 1;
  const limit = Number.parseInt(query.limit) || defaultLimit;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const sendPaginatedResponse = (res, data, total, page, limit) => {
  res.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  });
};

const resolveCreatorId = async (req) => {
  let creatorId = req.user.id;
  if (creatorId === "MASTER-ADMIN") {
    let masterUser = await prisma.utilisateur.findUnique({
      where: { email: "contact@menuaconsulting.com" },
    });
    if (!masterUser) masterUser = await prisma.utilisateur.findFirst();
    return masterUser?.id || creatorId;
  }
  return creatorId;
};

const generateReference = async (model, prefix) => {
  const lastRecord = await prisma[model].findFirst({
    orderBy: { createdAt: "desc" },
    select: { reference: true },
  });
  let nextNum = 1;
  if (lastRecord && lastRecord.reference) {
    const regex = new RegExp(`${prefix}-(\\d+)`);
    const match = lastRecord.reference.match(regex);
    if (match) nextNum = Number.parseInt(match[1], 10) + 1;
  }
  return `${prefix}-${String(nextNum).padStart(2, "0")}`;
};

const generateSubDossierReference = async (parentDossierId) => {
  const parent = await prisma.dossier.findUnique({
    where: { id: parentDossierId },
    select: { reference: true },
  });
  if (!parent || !parent.reference)
    return `DOS-SUB-${Math.floor(Math.random() * 1000)}`;

  const children = await prisma.dossier.findMany({
    where: { parentDossierId },
    select: { reference: true },
  });

  let maxSeq = 0;
  for (const child of children) {
    if (!child.reference) continue;
    const parts = child.reference.split("-");
    if (parts.length >= 3) {
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    } else if (parts.length === 2) {
      // Just in case it was a DOS-XX format incorrectly saved as a child previously
      const seq = parseInt(parts[1], 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }
  return `${parent.reference}-${String(maxSeq + 1).padStart(2, "0")}`;
};

router.use(authenticateJWT);

// --- ROLES ---
async function checkAndUpdateMissionStatus(missionId, prisma) {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: { taches: true, dossier: { include: { missions: true } } },
  });
  if (!mission) return;

  const allTaches = mission.taches;
  let newStatus = mission.status;

  if (allTaches.length > 0 && allTaches.every((t) => t.status === "TERMINE")) {
    newStatus = "TERMINE";
  } else if (
    mission.status === "NOUVEAU" &&
    allTaches.some((t) => t.status !== "NOUVEAU")
  ) {
    newStatus = "NOUVEAU";
  } else if (
    mission.status === "TERMINE" &&
    allTaches.some((t) => t.status !== "TERMINE")
  ) {
    newStatus = "NOUVEAU";
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({
      where: { id: mission.id },
      data: { status: newStatus, previousStatus: mission.status },
    });
    if (newStatus === "TERMINE" && mission.dossier) {
      checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (
      newStatus === "NOUVEAU" &&
      mission.dossier &&
      mission.dossier.status === "NOUVEAU"
    ) {
      await prisma.dossier.update({
        where: { id: mission.dossier.id },
        data: { status: "NOUVEAU" },
      });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prisma) {
  const freshDossier = await prisma.dossier.findUnique({
    where: { id: dossier.id },
    include: { missions: true },
  });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions;
  if (
    allMissions.length > 0 &&
    allMissions.every((m) => m.status === "TERMINE")
  ) {
    if (
      freshDossier.status !== "TERMINE" &&
      freshDossier.status !== "ARCHIVE" &&
      freshDossier.status !== "BLOQUE"
    ) {
      await prisma.dossier.update({
        where: { id: freshDossier.id },
        data: { status: "TERMINE", previousStatus: freshDossier.status },
      });
    }
  } else if (
    freshDossier.status === "TERMINE" &&
    allMissions.some((m) => m.status !== "TERMINE")
  ) {
    await prisma.dossier.update({
      where: { id: freshDossier.id },
      data: { status: "NOUVEAU", previousStatus: freshDossier.status },
    });
  }
}

const { syncMessages } = require("../../controllers/imapController");

router.post("/documents", async (req, res) => {
  try {
    const { name, filename, bucket, dossierId, missionId } = req.body;
    const creatorId = await resolveCreatorId(req);
    if (!filename || (!dossierId && !missionId)) {
      return res
        .status(400)
        .json({ error: "filename et dossierId ou missionId sont requis." });
    }
    const document = await prisma.document.create({
      data: {
        name: name || filename,
        url: `${bucket || "formulaires"}/${filename}`,
        uploadedById: creatorId,
        ...(dossierId && { dossierId }),
        ...(missionId && { missionId }),
      },
      include: { uploadedBy: true },
    });

    await logAudit(
      req.user?.id,
      "AJOUT_DOCUMENT",
      document.id,
      "DOCUMENT",
      `Document rattaché: ${document.name}`,
      document.dossierId || null,
    );

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Erreur lors de l'enregistrement du document: " + error.message,
      });
  }
});

// Lister les documents d'une entité (exclut les documents supprimés)
// Lister la corbeille (documents soft-deleted)
router.get("/documents/trash/list", async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      where: { isDeleted: true },
      include: {
        uploadedBy: true,
        dossier: { select: { id: true, name: true } },
        mission: { select: { id: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const dossiersRaw = await prisma.dossier.findMany({
      where: { status: "CORBEILLE" },
      include: { parentDossier: { select: { status: true } } },
      orderBy: { updatedAt: "desc" },
    });
    const dossiers = dossiersRaw.filter(d => !d.parentDossier || d.parentDossier.status !== "CORBEILLE");

    const missionsRaw = await prisma.mission.findMany({
      where: { status: "CORBEILLE" },
      include: { dossier: { select: { name: true, status: true } } },
      orderBy: { updatedAt: "desc" },
    });
    const missions = missionsRaw.filter(m => !m.dossier || m.dossier.status !== "CORBEILLE");

    const tachesRaw = await prisma.tache.findMany({
      where: { status: "CORBEILLE" },
      include: { mission: { select: { status: true, dossier: { select: { name: true } } } }, dossierTache: { select: { name: true, status: true } } },
      orderBy: { updatedAt: "desc" },
    });
    const taches = tachesRaw.filter(t => {
      if (t.mission && t.mission.status === "CORBEILLE") return false;
      if (t.dossierTache && t.dossierTache.status === "CORBEILLE") return false;
      return true;
    });

    const trashItems = [
      ...docs.map(d => ({ ...d, type: "document", itemType: "Document" })),
      ...dossiers.map(d => ({ ...d, type: "dossier", itemType: "Dossier", createdAt: d.updatedAt })),
      ...missions.map(m => ({ ...m, type: "mission", itemType: "Mission", name: m.subject || m.description || "Mission sans nom", dossier: { name: m.dossier?.name }, createdAt: m.updatedAt })),
      ...taches.map(t => ({ ...t, type: "tache", itemType: "Tâche", name: t.description || t.reference || "Tâche sans nom", dossier: { name: t.dossierTache?.name || t.mission?.dossier?.name }, createdAt: t.updatedAt }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(trashItems);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la corbeille." });
  }
});

router.get("/documents/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    const entityFilter =
      type === "dossier" ? { dossierId: id } : { missionId: id };
    const docs = await prisma.document.findMany({
      where: { ...entityFilter, isDeleted: false },
      include: { uploadedBy: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(docs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des documents." });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: req.params.id },
    });
    if (!doc) return res.status(404).json({ error: "Document introuvable." });
    if (doc.isDeleted)
      return res.status(409).json({ error: "Ce document est déjà supprimé." });

    // Soft delete : marque comme supprimé en BDD (récupérable)
    // La suppression physique dans OVH est gérée par le cron de nettoyage (P4)
    await prisma.document.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    await logAudit(
      req.user?.id,
      "SUPPRESSION_DOCUMENT",
      doc.id,
      "DOCUMENT",
      `Document supprimé (soft): ${doc.name}`,
      doc.dossierId || null,
    );

    res.json({
      success: true,
      message: "Document supprimé. Il pourra être purgé ultérieurement.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du document." });
  }
});

// ─── P2 : CORBEILLE ─────────────────────────────────────────────────────────

// Restaurer un document depuis la corbeille
router.post("/documents/:id/restore", async (req, res) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: req.params.id },
    });
    if (!doc) return res.status(404).json({ error: "Document introuvable." });
    if (!doc.isDeleted)
      return res
        .status(409)
        .json({ error: "Ce document n'est pas en corbeille." });

    const restored = await prisma.document.update({
      where: { id: req.params.id },
      data: { isDeleted: false },
    });

    await logAudit(
      req.user?.id,
      "RESTAURATION_DOCUMENT",
      doc.id,
      "DOCUMENT",
      `Document restauré: ${doc.name}`,
      doc.dossierId || null,
    );

    res.json({ success: true, document: restored });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la restauration du document." });
  }
});

// Purge définitive d'un document (hard delete BDD + suppression OVH)
router.delete("/documents/:id/purge", async (req, res) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: req.params.id },
    });
    if (!doc) return res.status(404).json({ error: "Document introuvable." });

    // Suppression physique en BDD
    await prisma.document.delete({ where: { id: req.params.id } });

    // Suppression dans OVH S3
    try {
      const { deleteFromS3 } = require("../services/s3Service");
      await deleteFromS3(doc.url);
    } catch (s3Err) {
      console.error({
        event: "purge_s3_delete_failed",
        key: doc.url,
        error: s3Err.message,
      });
      // Non bloquant — la suppression BDD est déjà faite
    }

    await logAudit(
      req.user?.id,
      "PURGE_DOCUMENT",
      doc.id,
      "DOCUMENT",
      `Document purgé définitivement: ${doc.name} (S3: ${doc.url})`,
      doc.dossierId || null,
    );

    res.json({ success: true, message: "Document supprimé définitivement." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la purge du document." });
  }
});

// ─── P3 : REMPLACEMENT DE DOCUMENT ─────────────────────────────────────────
// Le remplacement est géré côté /api/files/replace/:id (voir files.js)
// Route de mise à jour du nom uniquement (sans nouveau fichier)
router.patch("/documents/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const doc = await prisma.document.findUnique({
      where: { id: req.params.id },
    });
    if (!doc) return res.status(404).json({ error: "Document introuvable." });
    if (doc.isDeleted)
      return res
        .status(409)
        .json({ error: "Document supprimé, veuillez le restaurer d'abord." });

    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { ...(name && { name }) },
    });

    await logAudit(
      req.user?.id,
      "RENOMMAGE_DOCUMENT",
      doc.id,
      "DOCUMENT",
      `Document renommé: ${doc.name} → ${name}`,
      doc.dossierId || null,
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du document." });
  }
});

// ─── UNIFIED TRASH RESTORE / PURGE ──────────────────────────────────────────

router.post("/trash/restore/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === "document") {
      await prisma.document.update({ where: { id }, data: { isDeleted: false } });
    } else if (type === "dossier") {
      const restoreHierarchy = async (dossierId) => {
        await prisma.dossier.update({ where: { id: dossierId }, data: { status: "NOUVEAU" } });
        await prisma.mission.updateMany({ where: { dossierId, status: "CORBEILLE" }, data: { status: "NOUVEAU" } });
        await prisma.tache.updateMany({ where: { OR: [{ dossierTacheId: dossierId }, { mission: { dossierId } }], status: "CORBEILLE" }, data: { status: "NOUVEAU" } });
        
        const children = await prisma.dossier.findMany({ where: { parentDossierId: dossierId, status: "CORBEILLE" }, select: { id: true } });
        for (const child of children) {
          await restoreHierarchy(child.id);
        }
      };
      await restoreHierarchy(id);
    } else if (type === "mission") {
      await prisma.mission.update({ where: { id }, data: { status: "NOUVEAU" } });
      await prisma.tache.updateMany({ where: { missionId: id, status: "CORBEILLE" }, data: { status: "NOUVEAU" } });
    } else if (type === "tache") {
      await prisma.tache.update({ where: { id }, data: { status: "NOUVEAU" } });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la restauration." });
  }
});

router.delete("/trash/purge/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === "document") {
      await prisma.document.delete({ where: { id } });
    } else if (type === "dossier") {
      await prisma.dossier.delete({ where: { id } }); // Prisma cascade handles the rest
    } else if (type === "mission") {
      await prisma.mission.delete({ where: { id } });
    } else if (type === "tache") {
      await prisma.tache.delete({ where: { id } });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la purge." });
  }
});

module.exports = router;
