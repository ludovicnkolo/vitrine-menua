const express = require("express");
const prisma = require("../../prisma");
const crypto = require("node:crypto");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const fs = require("node:fs");
const path = require("node:path");
const router = express.Router();
const { validateTacheStatus, normalizeStatus } = require('../../utils/statusRules');


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
          include: { dossier: { select: { name: true, reference: true, status: true, traitantId: true } } },
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
    // Relecteur et Collaborateur ne peuvent pas créer de tâches
    if (userRole === "Relecteur" || userRole === "Collaborateur") {
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
          targetMission.dossier.traitantId !== req.user.id)
      ) {
        return res
          .status(403)
          .json({
            error:
              "Accès refusé. Vous n'êtes pas le responsable du dossier de cette mission.",
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

    let parsedEcheance = null;
    if (echeance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      parsedEcheance = new Date(echeance);
      parsedEcheance.setHours(0, 0, 0, 0);

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

    const currentTache = await prisma.tache.findUnique({
      where: { id },
      include: {
        mission: {
          include: { dossier: { select: { traitantId: true, status: true } } },
        },
      },
    });
    if (!currentTache)
      return res.status(404).json({ error: "Tâche introuvable." });

    const isTacheLocked = ["BLOQUE", "EN_ATTENTE"].includes(currentTache.status);
    const isParentLocked = 
      ["BLOQUE", "EN_ATTENTE"].includes(currentTache.mission?.status) || 
      ["BLOQUE", "EN_ATTENTE"].includes(currentTache.mission?.dossier?.status);

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
      ["TERMINE", "ARCHIVE"].includes(currentTache.mission?.dossier?.status)
    ) {
      return res
        .status(403)
        .json({
          error:
            "Action impossible : le parent (mission ou dossier) est clôturé.",
        });
    }

    // Prévention des actions concurrentes (race conditions) sur le statut
    if (status && currentTache.status === status) {
      return res
        .status(400)
        .json({
          error:
            "Action impossible : la tâche est déjà dans ce statut (peut-être modifiée par un autre utilisateur).",
        });
    }

    const userRole = req.user?.role || "";
    const userId = req.user?.id;
    const isSA = isSuperAdmin(userRole);
    const dossierTraitantId = currentTache.mission?.dossier?.traitantId;

    // ── Vérification Zero-Trust (Accès en Modification) ──────────────────────
    const isAuthorized =
      isSuperAdmin(userRole) ||
      isAdmin(userRole) ||
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
      let allowed = false;

      const isAssigned = currentTache.assignedToId === userId;
      const isRelecteurAssigned = currentTache.relecteurId === userId;
      const isMissionResp = currentTache.mission?.assignedToId === userId;
      const isDossierResp = currentTache.mission?.dossier?.traitantId === userId || currentTache.dossierTache?.traitantId === userId;
      const canManageTaskAdmin = isSA || isRelecteurAssigned || isMissionResp || isDossierResp;

      if (from === "BLOQUE") {
        if (!isSA) {
          return res.status(403).json({ error: "Seul un Super-Administrateur peut débloquer une tâche." });
        }
        if (to !== currentTache.previousStatus) {
          return res.status(403).json({ error: `Une tâche bloquée ne peut retourner qu'à son statut précédent (${currentTache.previousStatus}).` });
        }
        allowed = true;
      } else if (from === "EN_ATTENTE") {
        if (!canManageTaskAdmin && !isAssigned) {
          return res.status(403).json({ error: "Accès refusé. Seul l'assigné, le relecteur, le responsable de mission/dossier ou le Super-Admin peut lever l'attente." });
        }
        if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Accès refusé. Seul un Super-Administrateur peut bloquer une tâche." });
          allowed = true;
        } else if (to === currentTache.previousStatus) {
          allowed = true;
        } else {
          return res.status(403).json({ error: `Une tâche en attente ne peut retourner qu'à son statut précédent (${currentTache.previousStatus}) ou être bloquée.` });
        }
      } else {
        if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Accès refusé. Seul un Super-Administrateur peut bloquer une tâche." });
          allowed = true;
        } else if (to === "EN_ATTENTE") {
          if (!canManageTaskAdmin) {
            return res.status(403).json({ error: "Accès refusé. Seul le relecteur, le responsable de mission/dossier ou le Super-Admin peut mettre en attente." });
          }
          allowed = true;
        } else {
          switch (from) {
            case "NOUVEAU":
            case "A_CORRIGER":
              if (to === "EN_COURS" && (isSA || isAssigned)) allowed = true;
              break;
            case "EN_COURS":
              if (to === "EN_RELECTURE" && (isSA || isAssigned)) allowed = true;
              break;
            case "EN_RELECTURE":
              if (to === "EN_APPROBATION" && (isSA || isRelecteurAssigned)) allowed = true;
              if (to === "A_CORRIGER" && (isSA || isRelecteurAssigned)) allowed = true;
              break;
            case "EN_APPROBATION":
              if (to === "APPROUVEE" && isSA) allowed = true;
              if (to === "A_CORRIGER" && (isSA || isRelecteurAssigned)) allowed = true;
              break;
            case "APPROUVEE":
              if (to === "TERMINE" && isSA) allowed = true;
              break;
            case "TERMINE":
              break;
          }
        }
      }

      if (!allowed) {
        return res.status(403).json({
          error: `Accès refusé. Vous ne pouvez pas passer cette tâche de '${from}' à '${to}'.`,
        });
      }
    }

    // Build the data payload
    const dataToUpdate = { ...rest };
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
        }
        dataToUpdate.echeance = parsedEcheance;
      } else {
        dataToUpdate.echeance = null;
      }
    }
    if (
      assignedToId !== undefined &&
      assignedToId !== currentTache.assignedToId
    ) {
      if (!isManager(userRole)) {
        return res
          .status(403)
          .json({
            error: "Accès refusé. Vous ne pouvez pas ré-attribuer une tâche.",
          });
      }
      dataToUpdate.assignedToId = assignedToId;
    }
    if (relecteurId !== undefined && relecteurId !== currentTache.relecteurId) {
      if (!isManager(userRole)) {
        return res
          .status(403)
          .json({
            error: "Accès refusé. Vous ne pouvez pas assigner un relecteur.",
          });
      }
      dataToUpdate.relecteurId = relecteurId;
    }

    if (status !== undefined && status !== currentTache.status) {
      if (status === "A_CORRIGER" || status === "REATTRIBUEE") {
        if (managerFeedback)
          dataToUpdate.managerFeedback = managerFeedback.trim();
      }
      if (status === "EN_VALIDATION_FINALE" || status === "A_CORRIGER") {
        if (adminFeedback) dataToUpdate.adminFeedback = adminFeedback.trim();
      }
      dataToUpdate.previousStatus = currentTache.status;
      dataToUpdate.status = status;
    } else if (status !== undefined) {
      if (adminFeedback !== undefined)
        dataToUpdate.adminFeedback = adminFeedback;
      if (managerFeedback !== undefined)
        dataToUpdate.managerFeedback = managerFeedback;
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
