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

    const isSociete =
      (type && (type.toUpperCase() === "SOCIETE" || type.toLowerCase().includes("soci"))) ||
      !!(siret || raisonSociale || emailEntreprise || telephoneEntreprise);

    const clientType = isSociete
      ? "SOCIETE"
      : (type?.toUpperCase() === "PARTICULIER" || type?.toLowerCase().includes("particulier") ? "PARTICULIER" : (type || "PARTICULIER"));

    const client = await prisma.client.create({
      data: {
        name,
        email,
        telephone: telephone || null,
        contactSecondaire: contactSecondaire || null,
        secteurActivite: secteurActivite || null,
        description: description || null,
        type: clientType,
        status: "ACTIF",
        ...(isSociete && {
          entreprise: {
            create: {
              siret: siret || null,
              raisonSociale: raisonSociale || name || null,
              emailEntreprise: emailEntreprise || null,
              telephoneEntreprise: telephoneEntreprise || null,
            },
          },
        }),
      },
      include: {
        entreprise: true,
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

const handleClientUpdate = async (req, res) => {
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

    const existingClient = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: { entreprise: true },
    });
    if (!existingClient) return res.status(404).json({ error: "Client introuvable." });

    const isSociete =
      (type !== undefined
        ? (type.toUpperCase() === "SOCIETE" || type.toLowerCase().includes("soci"))
        : (existingClient.type?.toUpperCase() === "SOCIETE" || existingClient.type?.toLowerCase().includes("soci"))) ||
      (siret !== undefined || raisonSociale !== undefined || emailEntreprise !== undefined || telephoneEntreprise !== undefined);

    let entrepriseUpdate = undefined;
    if (isSociete) {
      entrepriseUpdate = {
        upsert: {
          create: {
            siret: siret || null,
            raisonSociale: raisonSociale || name || existingClient.name || null,
            emailEntreprise: emailEntreprise || null,
            telephoneEntreprise: telephoneEntreprise || null,
          },
          update: {
            ...(siret !== undefined && { siret: siret || null }),
            ...(raisonSociale !== undefined && { raisonSociale: raisonSociale || null }),
            ...(emailEntreprise !== undefined && { emailEntreprise: emailEntreprise || null }),
            ...(telephoneEntreprise !== undefined && { telephoneEntreprise: telephoneEntreprise || null }),
          },
        },
      };
    }

    const resolvedType = type !== undefined
      ? (isSociete ? "SOCIETE" : (type.toUpperCase() === "PARTICULIER" || type.toLowerCase().includes("particulier") ? "PARTICULIER" : type))
      : undefined;

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
        ...(contactSecondaire !== undefined && { contactSecondaire }),
        ...(secteurActivite !== undefined && { secteurActivite }),
        ...(description !== undefined && { description }),
        ...(resolvedType !== undefined && { type: resolvedType }),
        ...(status && { status }),
        ...(entrepriseUpdate && { entreprise: entrepriseUpdate }),
      },
      include: {
        entreprise: true,
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
};

router.patch("/clients/:id", handleClientUpdate);
router.put("/clients/:id", handleClientUpdate);

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

// --- SUIVI D'ACTIVITE CLIENT (Dossiers, Missions, Taches en cours et terminés) ---
router.get("/clients/:id/activity-stats", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const client = await prisma.client.findUnique({
      where: { id },
      include: { entreprise: true },
    });

    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    const dateFilter = {};
    if (startDate) {
      const parts = startDate.split("-").map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        dateFilter.gte = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
      }
    }
    if (endDate) {
      const parts = endDate.split("-").map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        dateFilter.lte = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
      }
    }
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    // 1. Dossiers créés pour ce client (exclusion des sous-dossiers et dossiers système)
    const dossierBaseWhere = {
      clientId: id,
      parentDossierId: null,
      isSystem: false,
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [dossiersTotal, dossiersTermines] = await Promise.all([
      prisma.dossier.count({ where: dossierBaseWhere }),
      prisma.dossier.count({
        where: {
          ...dossierBaseWhere,
          status: { in: ["TERMINE", "CLOTURE"] },
        },
      }),
    ]);
    const dossiersEnCours = Math.max(0, dossiersTotal - dossiersTermines);

    // 2. Missions liées à ce client (dossier avec clientId)
    const missionBaseWhere = {
      OR: [
        { dossier: { clientId: id } },
        { dossierMission: { clientId: id } },
      ],
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [missionsTotal, missionsTerminees] = await Promise.all([
      prisma.mission.count({ where: missionBaseWhere }),
      prisma.mission.count({
        where: {
          ...missionBaseWhere,
          status: "TERMINE",
        },
      }),
    ]);
    const missionsEnCours = Math.max(0, missionsTotal - missionsTerminees);

    // 3. Tâches liées à ce client
    const tacheBaseWhere = {
      OR: [
        { mission: { dossier: { clientId: id } } },
        { mission: { dossierMission: { clientId: id } } },
        { dossierTache: { clientId: id } },
      ],
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [tachesTotal, tachesTerminees] = await Promise.all([
      prisma.tache.count({ where: tacheBaseWhere }),
      prisma.tache.count({
        where: {
          ...tacheBaseWhere,
          status: "TERMINE",
        },
      }),
    ]);
    const tachesEnCours = Math.max(0, tachesTotal - tachesTerminees);

    res.json({
      client: {
        id: client.id,
        name: client.entreprise?.raisonSociale || client.name,
      },
      dossiers: {
        total: dossiersTotal,
        enCours: dossiersEnCours,
        termines: dossiersTermines,
      },
      missions: {
        total: missionsTotal,
        enCours: missionsEnCours,
        termines: missionsTerminees,
      },
      taches: {
        total: tachesTotal,
        enCours: tachesEnCours,
        termines: tachesTerminees,
      },
    });
  } catch (error) {
    console.error("Erreur client activity stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- DOSSIERS ---

module.exports = router;
