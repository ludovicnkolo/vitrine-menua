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

router.get("/dashboard-stats", async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    const startDateQuery = req.query.startDate;
    const endDateQuery = req.query.endDate;

    if (
      startDateQuery &&
      endDateQuery &&
      new Date(startDateQuery) >= new Date(endDateQuery)
    ) {
      return res
        .status(400)
        .json({
          error:
            "La date de début doit être strictement antérieure à la date de fin.",
        });
    }

    let startPeriod, endPeriod;

    if (startDateQuery) {
      startPeriod = new Date(startDateQuery);
      startPeriod.setHours(0, 0, 0, 0);
    } else {
      startPeriod = new Date(now);
      startPeriod.setDate(
        now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1),
      ); // Lundi
      startPeriod.setHours(0, 0, 0, 0);
    }

    if (endDateQuery) {
      endPeriod = new Date(endDateQuery);
      endPeriod.setHours(23, 59, 59, 999);
    } else {
      endPeriod = new Date(now);
    }

    const isFiltered = !!startDateQuery || !!endDateQuery;

    // 1. Radar des Urgences et Engagements (SLAs)
    const whereUrgentsForm = {
      status: { notIn: ["GAGNE", "SANS_SUITE", "RETENU", "REFUSE", "TERMINE", "ARCHIVE"] },
      priority: { in: ["URGENT", "Urgent"] },
    };
    if (isFiltered)
      whereUrgentsForm.createdAt = { gte: startPeriod, lte: endPeriod };
    const urgentsFormulaires = await prisma.formulaire.count({
      where: whereUrgentsForm,
    });

    const whereUrgentsMsg = {
      status: { notIn: ["TRAITE", "TERMINE", "ARCHIVE", "GAGNE"] },
      priorite: { in: ["URGENT", "Urgent"] },
      isDeleted: false,
    };
    if (isFiltered)
      whereUrgentsMsg.createdAt = { gte: startPeriod, lte: endPeriod };
    const urgentsMessages = await prisma.messagePersonnel.count({
      where: whereUrgentsMsg,
    });
    const alertesPrioritaires = urgentsFormulaires + urgentsMessages;

    const whereTachesCrit = { status: { notIn: ["TERMINE", "ARCHIVE", "CORBEILLE"] }, echeance: { not: null } };
    if (isFiltered) {
      whereTachesCrit.echeance = { gte: startPeriod, lte: endPeriod };
    } else {
      whereTachesCrit.echeance = { lte: twentyFourHoursFromNow };
    }
    const tachesCritiques = await prisma.tache.count({
      where: whereTachesCrit,
    });

    const whereMissionsCrit = { 
      status: { notIn: ["TERMINE", "ANNULEE", "CORBEILLE"] },
      echeance: { not: null },
      taches: { none: {} } // Seulement les missions sans tâches
    };
    if (isFiltered) {
      whereMissionsCrit.echeance = { gte: startPeriod, lte: endPeriod };
    } else {
      whereMissionsCrit.echeance = { lte: twentyFourHoursFromNow };
    }
    const missionsCritiques = await prisma.mission.count({
      where: whereMissionsCrit
    });

    const delaisCritiques = tachesCritiques + missionsCritiques;

    // 2. Santé des Opérations (Détection des goulots)
    const whereTachesAttente = { status: "EN_ATTENTE" };
    if (isFiltered)
      whereTachesAttente.createdAt = { gte: startPeriod, lte: endPeriod };
    const tachesEnAttente = await prisma.tache.count({
      where: whereTachesAttente,
    });
    const operationsBloquees = tachesEnAttente;

    // Volume Total (Dossiers + Missions + Tâches)
    const whereTotalDossiers = { status: { not: "CORBEILLE" }, parentDossierId: null };
    const whereTotalMissions = { status: { not: "CORBEILLE" } };
    const whereTotalTaches = { status: { not: "CORBEILLE" } };
    
    if (isFiltered) {
      const dateFilter = { gte: startPeriod, lte: endPeriod };
      whereTotalDossiers.createdAt = dateFilter;
      whereTotalMissions.createdAt = dateFilter;
      whereTotalTaches.createdAt = dateFilter;
    }
    
    const totalDossiers = await prisma.dossier.count({ where: whereTotalDossiers });
    const totalMissions = await prisma.mission.count({ where: whereTotalMissions });
    const totalTaches = await prisma.tache.count({ where: whereTotalTaches });
    const volumeTotal = totalDossiers + totalMissions + totalTaches;

    // 3. Flux d'Acquisition (Lien Magique)
    const whereDepots = { isDeleted: false };
    if (isFiltered) {
      whereDepots.createdAt = { gte: startPeriod, lte: endPeriod };
    } else {
      whereDepots.createdAt = {
        gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      };
    }
    const nouveauxDepots = await prisma.document.count({ where: whereDepots });

    // 4. Météo de Charge (Gestion RH & Capacité)
    // Exclure les rôles non-opérationnels (Super-Admin, Admin Tech) et Clients
    const rolesExclus = [
      "Client",
      "Super-administrateur",
      "Administrateur technique",
    ];
    const activeUsers = await prisma.utilisateur.findMany({
      where: { isBlocked: false, role: { name: { notIn: rolesExclus } } },
      select: { id: true, name: true, role: { select: { name: true } } },
    });
    const userTaches = await prisma.tache.findMany({
      where: {
        assignedToId: { in: activeUsers.map((u) => u.id) },
        status: { notIn: ["TERMINE", "ARCHIVE", "CORBEILLE", "CLOTURE", "APPROUVEE", "ANNULEE"] },
      },
      select: { assignedToId: true },
    });

    const meteoCharge = activeUsers.map((u) => {
      const count = userTaches.filter((t) => t.assignedToId === u.id).length;
      let etat = "VERT";
      if (count > 5) etat = "ROUGE";
      else if (count >= 3) etat = "ORANGE";
      return { name: u.name, role: u.role?.name, tachesEnCours: count, etat };
    });

    // 5. Entonnoir de Production (Période) : Demandes & formulaires qualifiés traités
    const formulairesTraitesPeriode = await prisma.formulaire.count({
      where: {
        status: { in: ["TERMINE", "ARCHIVE", "TRAITE"] },
        createdAt: { gte: startPeriod, lte: endPeriod },
      },
    });
    const emailsTraitesPeriode = await prisma.messagePersonnel.count({
      where: {
        type: "PERSONNEL",
        status: { in: ["TERMINE", "ARCHIVE", "TRAITE"] },
        isDeleted: false,
        createdAt: { gte: startPeriod, lte: endPeriod },
      },
    });
    const messagesTraitesPeriode = formulairesTraitesPeriode + emailsTraitesPeriode;

    const missionsDemarreesPeriode = await prisma.mission.count({
      where: { status: { not: "CORBEILLE" }, createdAt: { gte: startPeriod, lte: endPeriod } },
    });
    const tachesCompleteesPeriode = await prisma.tache.count({
      where: {
        status: "TERMINE",
        updatedAt: { gte: startPeriod, lte: endPeriod },
      },
    });
    const dossiersCloturesPeriode = await prisma.dossier.count({
      where: {
        status: "CLOTURE",
        parentDossierId: null,
        updatedAt: { gte: startPeriod, lte: endPeriod },
      },
    });

    res.json({
      alertesPrioritaires,
      delaisCritiques,
      operationsBloquees,
      volumeTotal,
      totalDossiers,
      totalMissions,
      totalTaches,
      nouveauxDepots,
      meteoCharge,
      entonnoirPeriode: [
        { name: "Messages Traités", value: messagesTraitesPeriode },
        { name: "Missions Démarrées", value: missionsDemarreesPeriode },
        { name: "Tâches Terminées", value: tachesCompleteesPeriode },
        { name: "Dossiers Clôturés", value: dossiersCloturesPeriode },
      ],
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        error: "Erreur de chargement des statistiques",
        details: e.message,
        stack: e.stack,
      });
  }
});

// --- UTILISATEURS ---

module.exports = router;
