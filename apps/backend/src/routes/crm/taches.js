const express = require("express");
const prisma = require("../../prisma");
const crypto = require("node:crypto");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const fs = require("node:fs");
const path = require("node:path");
const router = express.Router();
const { canTransitionTache, normalizeStatus } = require('../../utils/statusRules');


const {
  authenticateJWT,
  requireRoles,
  isSuperAdmin,
  isAdmin,
  isManager,
} = require("../../middlewares/auth");
const {
  canDeleteTache,
} = require("../../middlewares/rbac");
const {
  buildTacheAccessFilter,
} = require("../../services/dossierFilterService");
const { notify } = require("../../utils/notify");
const { transporter } = require("../../utils/mailer");
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
    if (payload.missionId) io.to(payload.missionId).emit('entity_updated', { entityType: 'MISSION', entityId: payload.missionId, action: 'CHILD_UPDATED' });
    if (payload.dossierTacheId) io.to(payload.dossierTacheId).emit('entity_updated', { entityType: 'DOSSIER', entityId: payload.dossierTacheId, action: 'CHILD_UPDATED' });
  }
};

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
  const records = await prisma[model].findMany({
    where: { reference: { startsWith: `${prefix}-` } },
    select: { reference: true },
  });

  let maxNum = 0;
  const regex = new RegExp(`^${prefix}-(\\d+)$`);
  for (const r of records) {
    if (!r.reference) continue;
    const match = r.reference.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(2, "0")}`;
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
    newStatus = "EN_COURS";
  } else if (
    mission.status === "TERMINE" &&
    allTaches.some((t) => t.status !== "TERMINE")
  ) {
    newStatus = "EN_COURS";
  }

  if (newStatus !== mission.status) {
    await prisma.mission.update({
      where: { id: mission.id },
      data: { status: newStatus, previousStatus: mission.status },
    });
    if (newStatus === "TERMINE" && mission.dossier) {
      checkAndUpdateDossierStatus(mission.dossier, prisma);
    } else if (
      newStatus === "EN_COURS" &&
      mission.dossier &&
      (mission.dossier.status === "NOUVEAU" || mission.dossier.status === "NOUVEAU")
    ) {
      await prisma.dossier.update({
        where: { id: mission.dossier.id },
        data: { status: "EN_COURS" },
      });
    }
  }
}

async function checkAndUpdateDossierStatus(dossier, prisma) {
  const freshDossier = await prisma.dossier.findUnique({
    where: { id: dossier.id },
    include: { missions: true, taches: true },
  });
  if (!freshDossier) return;
  const allMissions = freshDossier.missions || [];
  const allTaches = freshDossier.taches || [];
  const allItems = [...allMissions, ...allTaches];

  const isAllDone = allItems.every(
    (item) => item.status === "TERMINE" || item.status === "TERMINE" || item.status === "ANNULEE" || item.status === "ANNULEE"
  );

  if (allItems.length > 0 && isAllDone) {
    if (
      freshDossier.status !== "TERMINE" &&
      freshDossier.status !== "ARCHIVE" &&
      freshDossier.status !== "CLOTURE" &&
      freshDossier.status !== "BLOQUE"
    ) {
      await prisma.dossier.update({
        where: { id: freshDossier.id },
        data: { status: "TERMINE", previousStatus: freshDossier.status },
      });
    }
  } else if (
    freshDossier.status === "TERMINE" &&
    !isAllDone
  ) {
    await prisma.dossier.update({
      where: { id: freshDossier.id },
      data: { status: "EN_COURS", previousStatus: freshDossier.status },
    });
  }
}

const { syncMessages } = require("../../controllers/imapController");

router.get("/taches", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status } = req.query;

    const where = { AND: [] };
    // ── Filtrage pyramidal et absorption des droits ──────────────────────────
    const accessFilter = buildTacheAccessFilter(req.user);
    if (accessFilter && Object.keys(accessFilter).length > 0) {
      where.AND.push(accessFilter);
    }

    const isSuperAdm = req.user.role === "Super-administrateur";

    if (status && status !== "all") {
      where.AND.push({ status: status });
    } else {
      where.AND.push({ status: { not: "CORBEILLE" } });
    }

    // Filtrage BLOQUE
    if (!isSuperAdm) {
      if (status === "BLOQUE") {
        where.AND.push({ id: "unauthorized_so_return_empty" });
      } else if (!status || status === "all") {
        where.AND.push({ status: { notIn: ["BLOQUE", "CORBEILLE"] } });
      }
      
      // La mission et le dossier parents ne doivent pas être bloqués
      where.AND.push({
        mission: {
          status: { not: "BLOQUE" },
          dossier: { status: { not: "BLOQUE" } }
        }
      });
    }

    if (search) {
      const s = search.toLowerCase();
      where.AND.push({
        OR: [
          { reference: { contains: s } },
          { mission: { reference: { contains: s } } },
          { missionId: { contains: s } },
          { createdBy: { name: { contains: s } } },
          { assignedTo: { name: { contains: s } } },
        ]
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const total = await prisma.tache.count({ where });
    const taches = await prisma.tache.findMany({
      where,
      skip,
      take: limit,
      include: {
        mission: {
          include: { dossier: { select: { id: true, name: true, reference: true, status: true, traitantId: true } } },
        },
        dossierTache: { include: { subDossiers: true } },
        authorizedDossiers: { include: { subDossiers: true } },
        assignedTo: {
          select: { id: true, name: true, role: { select: { name: true } } },
        },
        relecteur: {
          select: { id: true, name: true, role: { select: { name: true } } },
        },
        createdBy: {
          select: { id: true, name: true, role: { select: { name: true } } },
        },
      },
      orderBy: { reference: "desc" },
    });
    sendPaginatedResponse(res, taches, total, page, limit);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tâches." });
  }
});

router.post("/taches", async (req, res) => {
  try {
    const userRole = req.user.role;
    // Relecteur, Collaborateur et Administrateur technique ne peuvent pas créer de tâches
    if (userRole === "Relecteur" || userRole === "Collaborateur" || userRole === "Administrateur technique") {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé. Vous n'avez pas les droits pour créer une tâche.",
        });
    }

    if (req.body.missionId) {
      const targetMission = await prisma.mission.findUnique({
        where: { id: req.body.missionId },
        include: { dossier: { select: { traitantId: true, status: true } } },
      });
      if (!targetMission)
        return res.status(404).json({ error: "Mission introuvable." });
      if (
        ["TERMINE", "ARCHIVE"].includes(targetMission.status) ||
        ["TERMINE", "ARCHIVE"].includes(targetMission.dossier?.status)
      ) {
        return res
          .status(403)
          .json({
            error:
              "Action impossible : le parent (mission ou dossier) est clôturé.",
          });
      }
      if (
        userRole === "Responsable opérationnel" &&
        (!targetMission.dossier ||
          targetMission.dossier.traitantId !== req.user.id) &&
        targetMission.assignedToId !== req.user.id
      ) {
        return res
          .status(403)
          .json({
            error:
              "Accès refusé. Vous n'êtes pas le responsable de cette mission ni de son dossier.",
          });
      }
    }

    const {
      missionId,
      description,
      assignedToId,
      relecteurId,
      echeance,
      attachment,
      dossierTacheId,
      authorizedDossierIds,
    } = req.body;
    const creatorId = await resolveCreatorId(req);
    const reference = await generateReference("tache", "TCH");

    // Validation des champs obligatoires
    if (!missionId) {
      return res.status(400).json({ error: "La mission associée à la tâche est obligatoire." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: "La description / consignes de la tâche est obligatoire." });
    }
    if (!assignedToId) {
      return res.status(400).json({ error: "Le collaborateur assigné à la tâche est obligatoire." });
    }
    if (!echeance) {
      return res.status(400).json({ error: "La date d'échéance de la tâche est obligatoire." });
    }

    let parsedEcheance = null;
    if (echeance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      parsedEcheance = new Date(echeance);
      parsedEcheance.setHours(0, 0, 0, 0);

      // Vérification : la date d'échéance ne peut pas être dans le passé
      if (parsedEcheance < today) {
        return res.status(400).json({ error: "La date d'échéance d'une tâche ne peut pas être antérieure à aujourd'hui." });
      }

      if (missionId) {
        const parentMission = await prisma.mission.findUnique({
          where: { id: missionId },
          select: { echeance: true }
        });
        if (parentMission && parentMission.echeance) {
          const parentEcheance = new Date(parentMission.echeance);
          parentEcheance.setHours(0, 0, 0, 0);
          if (parsedEcheance > parentEcheance) {
            return res.status(400).json({ error: "L'échéance de la tâche ne peut pas dépasser l'échéance de la mission parente." });
          }
        }
      }
    }

    const tacheData = {
      reference,
      description,
      missionId,
      assignedToId,
      relecteurId,
      createdById: creatorId,
      status: "NOUVEAU",
      echeance: parsedEcheance,
      attachment,
    };

    if (dossierTacheId) {
      tacheData.dossierTacheId = dossierTacheId;
    } else if (missionId) {
      const parentMission = await prisma.mission.findUnique({
        where: { id: missionId },
        select: { dossierId: true },
      });
      if (parentMission && parentMission.dossierId) {
        tacheData.dossierTacheId = parentMission.dossierId;
      }
    }

    if (authorizedDossierIds && authorizedDossierIds.length > 0) {
      tacheData.authorizedDossiers = {
        connect: authorizedDossierIds.map((id) => ({ id })),
      };
    }

    const tache = await prisma.tache.create({
      data: tacheData,
    });

    // Notification : tâche assignée au collaborateur
    if (tache.assignedToId) {
      await notify(tache.assignedToId, {
        type: "TACHE_ASSIGNEE",
        title: "Nouvelle tâche assignée",
        message: `Une nouvelle tâche (${tache.reference || tache.id.slice(0, 8).toUpperCase()}) vous a été assignée.`,
        targetId: tache.id,
        targetType: "TACHE",
      });
    }

    const missionToUpdate = await prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (missionToUpdate && missionToUpdate.status === "NOUVEAU") {
      await prisma.mission.update({
        where: { id: missionId },
        data: { status: "NOUVEAU" },
      });
      // Verbose audit log removed
    }

    await logAudit(
      req.user?.id,
      "CREATION_TACHE",
      tache.id,
      "TACHE",
      `Tâche créée: ${tache.description || tache.reference}`,
      tache.dossierTacheId || null,
    );

    emitEntityUpdate(req, 'TACHE', tache.id, 'UPDATED', tache);
    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la tâche." });
  }
});

router.patch("/taches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let {
      status,
      adminFeedback,
      managerFeedback,
      echeance,
      assignedToId,
      relecteurId,
      ...rest
    } = req.body;

    if (status !== undefined) {
      status = normalizeStatus(status);
    }

    const userRole = req.user?.role || "";
    const userId = req.user?.id;
    if (userRole === "Administrateur technique") {
      return res.status(403).json({
        error: "Accès refusé. L'administrateur technique n'a pas accès à la gestion des tâches.",
      });
    }

    const currentTache = await prisma.tache.findUnique({
      where: { id },
      include: {
        mission: {
          include: { dossier: { select: { traitantId: true, status: true } } },
        },
        dossierTache: { select: { traitantId: true, status: true } },
      },
    });
    if (!currentTache)
      return res.status(404).json({ error: "Tâche introuvable." });

    const isTacheLocked = ["BLOQUE", "EN_ATTENTE"].includes(currentTache.status);
    const isParentLocked = 
      ["BLOQUE", "EN_ATTENTE"].includes(currentTache.mission?.status) || 
      ["BLOQUE", "EN_ATTENTE"].includes(currentTache.mission?.dossier?.status) ||
      ["BLOQUE", "EN_ATTENTE"].includes(currentTache.dossierTache?.status);

    if (isParentLocked) {
      return res.status(403).json({ error: "Action impossible : le parent (mission ou dossier) est bloqué ou en attente. Veuillez le débloquer d'abord." });
    }

    if (isTacheLocked) {
      const keys = Object.keys(req.body).filter(k => req.body[k] !== undefined);
      if (keys.some(k => k !== "status")) {
        return res.status(403).json({ error: "Action impossible : la tâche est bloquée ou en attente. Vous devez d'abord la débloquer avant de modifier son contenu." });
      }
    }

    if (
      ["TERMINE", "ARCHIVE"].includes(currentTache.mission?.status) ||
      ["TERMINE", "ARCHIVE"].includes(currentTache.mission?.dossier?.status) ||
      ["TERMINE", "ARCHIVE"].includes(currentTache.dossierTache?.status)
    ) {
      return res
        .status(403)
        .json({
          error:
            "Action impossible : le parent (mission ou dossier) est clôturé.",
        });
    }

    // Prévention des actions concurrentes (race conditions) sur le statut
    // Si le statut envoyé est identique au statut actuel, ce n'est pas un changement de statut : on l'ignore
    if (status && currentTache.status === status) {
      status = undefined;
    }

    const isSA = isSuperAdmin(userRole);
    const dossierTraitantId = currentTache.mission?.dossier?.traitantId || currentTache.dossierTache?.traitantId;

    // ── Vérification Zero-Trust (Accès en Modification) ──────────────────────
    const isAuthorized =
      isSA ||
      isAdmin(userRole) ||
      isManager(userRole) ||
      currentTache.assignedToId === userId ||
      currentTache.createdById === userId ||
      currentTache.relecteurId === userId ||
      currentTache.mission?.assignedToId === userId ||
      dossierTraitantId === userId;

    if (!isAuthorized) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé. Vous n'avez pas l'autorisation de modifier cette tâche.",
        });
    }

    if (status !== undefined && status !== currentTache.status) {
      const from = currentTache.status;
      const to = status;

      const isRO = isManager(userRole);
      // ── Contexte déterministe — délégation totale à statusRules.js ──────────
      const context = {
        role: userRole,
        isSA,
        isAssigned: currentTache.assignedToId === userId,
        isRelecteurAssigned: currentTache.relecteurId === userId,
        isMissionManager: isSA || isRO || currentTache.mission?.assignedToId === userId || dossierTraitantId === userId,
      };

      if (!canTransitionTache(from, to, currentTache.previousStatus, context)) {
        return res.status(403).json({
          error: `Accès refusé. Vous ne pouvez pas passer cette tâche de '${from}' à '${to}'.`,
        });
      }
    }

    // Build the data payload - seuls les champs modifiés sont enregistrés
    const dataToUpdate = {};
    if (rest.description !== undefined) {
      const trimmed = rest.description ? rest.description.trim() : "";
      const curr = currentTache.description ? currentTache.description.trim() : "";
      if (trimmed !== curr) {
        dataToUpdate.description = rest.description;
      }
    }
    if (rest.attachment !== undefined && (rest.attachment || null) !== (currentTache.attachment || null)) {
      dataToUpdate.attachment = rest.attachment || null;
    }
    if (rest.title !== undefined && rest.title !== currentTache.title) {
      dataToUpdate.title = rest.title;
    }
    if (rest.priority !== undefined && rest.priority !== currentTache.priority) {
      dataToUpdate.priority = rest.priority;
    }

    if (echeance !== undefined) {
      if (echeance) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const parsedEcheance = new Date(echeance);
        parsedEcheance.setHours(0, 0, 0, 0);

        const currentEcheance = currentTache.echeance ? new Date(currentTache.echeance) : null;
        if (currentEcheance) currentEcheance.setHours(0, 0, 0, 0);

        if (!currentEcheance || parsedEcheance.getTime() !== currentEcheance.getTime()) {
          if (currentTache.missionId) {
            const parentMission = await prisma.mission.findUnique({
              where: { id: currentTache.missionId },
              select: { echeance: true }
            });
            if (parentMission && parentMission.echeance) {
              const parentEcheance = new Date(parentMission.echeance);
              parentEcheance.setHours(0, 0, 0, 0);
              if (parsedEcheance > parentEcheance) {
                return res.status(400).json({ error: "L'échéance de la tâche ne peut pas dépasser l'échéance de la mission parente." });
              }
            }
          }
          dataToUpdate.echeance = parsedEcheance;
        }
      } else if (currentTache.echeance) {
        dataToUpdate.echeance = null;
      }
    }
    if (
      assignedToId !== undefined &&
      (assignedToId || null) !== (currentTache.assignedToId || null)
    ) {
      if (!isManager(userRole)) {
        return res
          .status(403)
          .json({
            error: "Accès refusé. Vous ne pouvez pas ré-attribuer une tâche.",
          });
      }
      dataToUpdate.assignedToId = assignedToId || null;
    }
    if (
      relecteurId !== undefined &&
      (relecteurId || null) !== (currentTache.relecteurId || null)
    ) {
      if (!isManager(userRole)) {
        return res
          .status(403)
          .json({
            error: "Accès refusé. Vous ne pouvez pas assigner un relecteur.",
          });
      }
      dataToUpdate.relecteurId = relecteurId || null;
    }

    if (status !== undefined && status !== currentTache.status) {
      if (status === "A_CORRIGER" || status === "REATTRIBUEE") {
        if (managerFeedback)
          dataToUpdate.managerFeedback = managerFeedback.trim();
      }
      if (status === "EN_VALIDATION_FINALE" || status === "A_CORRIGER") {
        if (adminFeedback) dataToUpdate.adminFeedback = adminFeedback.trim();
      }
      if (currentTache.status === "EN_ATTENTE") {
        dataToUpdate.previousStatus = null;
      } else {
        dataToUpdate.previousStatus = currentTache.status;
      }
      dataToUpdate.status = status;
    } else {
      if (adminFeedback !== undefined && (adminFeedback || null) !== (currentTache.adminFeedback || null))
        dataToUpdate.adminFeedback = adminFeedback ? adminFeedback.trim() : null;
      if (managerFeedback !== undefined && (managerFeedback || null) !== (currentTache.managerFeedback || null))
        dataToUpdate.managerFeedback = managerFeedback ? managerFeedback.trim() : null;
    }

    // Si aucun champ n'a été modifié, retourner directement la tâche
    if (Object.keys(dataToUpdate).length === 0) {
      return res.json(currentTache);
    }

    const tache = await prisma.tache.update({
      where: { id },
      data: dataToUpdate,
    });

    if (
      status !== undefined &&
      status !== currentTache.status &&
      tache.missionId
    ) {
      await checkAndUpdateMissionStatus(tache.missionId, prisma);
    }

    // ── Notifications Zero-Trust ────────────────────────────────────────────
    if (status !== undefined && status !== currentTache.status) {
      const tacheRef = tache.reference || tache.id.slice(0, 8).toUpperCase();
      // Récupérer le responsable du dossier pour notifier
      const missionWithDossier = await prisma.mission.findUnique({
        where: { id: tache.missionId },
        include: { dossier: { select: { traitantId: true } } },
      });
      const traitantId = missionWithDossier?.dossier?.traitantId;

      if (status === "EN_ATTENTE" && tache.assignedToId) {
        await notify(tache.assignedToId, {
          type: "TACHE_EN_ATTENTE",
          title: "Tâche mise en attente",
          message: `Votre tâche ${tacheRef} a été mise en attente.`,
          targetId: tache.id,
          targetType: "TACHE",
        });
      }
      if (currentTache.status === "EN_ATTENTE" && tache.assignedToId) {
        await notify(tache.assignedToId, {
          type: "TACHE_REPRISE",
          title: "Tâche réactivée",
          message: `L'attente sur votre tâche ${tacheRef} a été levée. Reprise au statut : ${tache.status}.`,
          targetId: tache.id,
          targetType: "TACHE",
        });
      }

      if (status === "A_VERIFIER" && tache.assignedToId) {
        // Notifier le relecteur/responsable : tâche soumise pour relecture
        const targets = [traitantId].filter(Boolean);
        if (targets.length)
          await notify(targets, {
            type: "TACHE_A_VERIFIER",
            title: "Tâche soumise pour relecture",
            message: `La tâche ${tacheRef} a été soumise pour vérification.`,
            targetId: tache.id,
            targetType: "TACHE",
          });
      }
      if (status === "FINALISER") {
        // Notifier le Super-Admin : tâche en validation finale
        const superAdmins = await prisma.utilisateur.findMany({
          where: { role: { name: "Super-administrateur" } },
          select: { id: true },
        });
        if (superAdmins.length)
          await notify(
            superAdmins.map((u) => u.id),
            {
              type: "TACHE_FINALISER",
              title: "Tâche à valider et clôturer",
              message: `La tâche ${tacheRef} est approuvée et attend votre clôture finale.`,
              targetId: tache.id,
              targetType: "TACHE",
            },
          );
      }
      if (status === "A_CORRIGER" && tache.assignedToId) {
        // Notifier le collaborateur : tâche renvoyée en correction
        await notify(tache.assignedToId, {
          type: "TACHE_A_CORRIGER",
          title: "Tâche renvoyée en correction",
          message: `Votre tâche ${tacheRef} a été renvoyée en correction. Veuillez la revoir.`,
          targetId: tache.id,
          targetType: "TACHE",
        });
      }
      if (status === "TERMINE" && tache.assignedToId) {
        // Notifier le collaborateur : tâche validée et clôturée
        await notify(tache.assignedToId, {
          type: "TACHE_CLOTUREE",
          title: "Tâche validée et clôturée ✓",
          message: `Votre tâche ${tacheRef} a été validée et clôturée avec succès.`,
          targetId: tache.id,
          targetType: "TACHE",
        });
      }
    }
    // ── Fin Notifications ────────────────────────────────────────────────────

    await logAudit(
      req.user?.id,
      "MODIFICATION_TACHE",
      tache.id,
      "TACHE",
      `Tâche modifiée (Statut: ${tache.status})`,
      tache.dossierTacheId || null,
    );

    emitEntityUpdate(req, 'TACHE', tache.id, 'UPDATED', tache);
    res.json(tache);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur de mise à jour." });
  }
});

router.delete("/taches/:id", async (req, res) => {
  try {
    if (req.user?.role === "Administrateur technique") {
      return res.status(403).json({
        error: "Accès refusé. L'administrateur technique n'a pas accès à la suppression de tâches.",
      });
    }

    const existingTache = await prisma.tache.findUnique({
      where: { id: req.params.id },
      include: {
        mission: {
          include: { dossier: true },
        },
        dossierTache: true,
      },
    });

    if (!existingTache) {
      return res.status(404).json({ error: "Tâche introuvable." });
    }

    const isAuthorized =
      isSuperAdmin(req.user.role) ||
      isAdmin(req.user.role) ||
      canDeleteTache(
        req.user,
        existingTache,
        existingTache.mission,
        existingTache.mission?.dossier || existingTache.dossierTache
      );

    if (!isAuthorized) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé. Vous n'avez pas l'autorisation de supprimer cette tâche.",
        });
    }

    const tache = await prisma.tache.update({
      where: { id: req.params.id },
      data: { status: "CORBEILLE" },
    });

    await logAudit(
      req.user?.id,
      "SUPPRESSION_TACHE",
      req.params.id,
      "TACHE",
      `Tâche supprimée: ${tache.description || tache.reference || tache.id}`,
      tache.dossierTacheId || null,
    );

    emitEntityUpdate(req, 'TACHE', req.params.id, 'DELETED');
    res.json({ success: true, message: "Tâche supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// --- DOCUMENTS ---
// Attacher un fichier (déjà uploadé via /api/files/upload) à un dossier ou une mission

module.exports = router;
