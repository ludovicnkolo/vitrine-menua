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
    newStatus = "OUVERT";
  } else if (
    mission.status === "TERMINE" &&
    allTaches.some((t) => t.status !== "TERMINE")
  ) {
    newStatus = "OUVERT";
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({
      where: { id: mission.id },
      data: { status: newStatus, previousStatus: mission.status },
    });
    if (newStatus === "TERMINE" && mission.dossier) {
      checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (
      newStatus === "OUVERT" &&
      mission.dossier &&
      mission.dossier.status === "NOUVEAU"
    ) {
      await prisma.dossier.update({
        where: { id: mission.dossier.id },
        data: { status: "OUVERT" },
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
      data: { status: "OUVERT", previousStatus: freshDossier.status },
    });
  }
}

const { syncMessages } = require("../../controllers/imapController");

router.get("/clients", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { entreprise: true },
    });
    res.json(clients);
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/clients", async (req, res) => {
  try {
    const {
      name,
      email,
      telephone,
      contactSecondaire,
      secteurActivite,
      description,
      type,
      siret,
      raisonSociale,
      emailEntreprise,
      telephoneEntreprise,
    } = req.body;
    const client = await prisma.client.create({
      data: {
        name,
        email,
        telephone: telephone || null,
        contactSecondaire: contactSecondaire || null,
        secteurActivite: secteurActivite || null,
        description: description || null,
        type: type || "PARTICULIER",
        status: "ACTIF",
        ...(type === "Société" && {
          entreprise: {
            create: {
              siret: siret || null,
              raisonSociale: raisonSociale || null,
              emailEntreprise: emailEntreprise || null,
              telephoneEntreprise: telephoneEntreprise || null,
            },
          },
        }),
      },
    });
    await logAudit(
      req.user?.id,
      "CREATION_CLIENT",
      client.id,
      "CLIENT",
      `Client créé : ${client.name} (${client.type})`,
    );
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      const duplicateField = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : "email";
      return res
        .status(409)
        .json({
          error: `Un client existe déjà avec cette donnée (${duplicateField}).`,
        });
    }
    res
      .status(500)
      .json({
        error:
          "Impossible de créer le client. Vérifiez les données saisies et réessayez.",
      });
  }
});

router.patch("/clients/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      telephone,
      contactSecondaire,
      secteurActivite,
      description,
      type,
      siret,
      raisonSociale,
      emailEntreprise,
      telephoneEntreprise,
      status,
    } = req.body;

    // Si c'est une société, on met à jour ou crée les données de l'entreprise
    let entrepriseUpdate = undefined;
    if (type === "Société") {
      entrepriseUpdate = {
        upsert: {
          create: {
            siret,
            raisonSociale,
            emailEntreprise,
            telephoneEntreprise,
          },
          update: {
            siret,
            raisonSociale,
            emailEntreprise,
            telephoneEntreprise,
          },
        },
      };
    }

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
        ...(contactSecondaire !== undefined && { contactSecondaire }),
        ...(secteurActivite !== undefined && { secteurActivite }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(status && { status }),
        ...(entrepriseUpdate && { entreprise: entrepriseUpdate }),
      },
    });
    const clientAuditAction =
      status === "BLOQUE" ? "BLOCAGE_CLIENT" : "MODIFICATION_CLIENT";
    await logAudit(
      req.user?.id,
      clientAuditAction,
      client.id,
      "CLIENT",
      `Client ${status === "BLOQUE" ? "bloqué" : "modifié"} : ${client.name}`,
    );
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

router.delete(
  "/clients/:id",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const existing = await prisma.client.findUnique({
        where: { id: req.params.id },
      });
      await prisma.client.delete({ where: { id: req.params.id } });
      await logAudit(
        req.user?.id,
        "SUPPRESSION_CLIENT",
        req.params.id,
        "CLIENT",
        `Client supprimé : ${existing?.name || req.params.id}`,
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  },
);

// --- DOSSIERS ---

module.exports = router;
