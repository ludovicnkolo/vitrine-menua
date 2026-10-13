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
const {
  requireSuperAdminToDeleteDossier,
} = require("../../middlewares/rbac");
const {
  buildDossierAccessFilter,
} = require("../../services/dossierFilterService");
const { transporter } = require("../../utils/mailer");
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
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

router.get("/dossiers", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search, status, role, origin } = req.query;

    const userRole = req.user.role;
    const userId = req.user.id;
    const canSeeBlocked = isSuperAdmin(userRole);
    const isAdminUser = isAdmin(userRole);

    let inMemoryFilter = false;
    const where = { AND: [] };

    // ── Filtrage pyramidal et absorption des droits ──────────────────────────
    const accessFilter = buildDossierAccessFilter(req.user);
    if (accessFilter && Object.keys(accessFilter).length > 0) {
      where.AND.push(accessFilter);
    }
    // Super-Admin, Admin Tech, Administrateur : pas de filtre sur le propriétaire

    // ── Filtre BLOQUÉ ─────────────────────────────────────────────────────────
    if (status && status !== "all") {
      where.AND.push({ status: status });
    } else {
      // Si "all" ou pas de statut, on exclut au moins la CORBEILLE
      where.AND.push({ status: { not: "CORBEILLE" } });
    }

    if (!canSeeBlocked) {
      if (status === "BLOQUE") {
        where.AND.push({ id: "unauthorized_so_return_empty" });
      } else if (!status || status === "all") {
        where.AND.push({ status: { notIn: ["BLOQUE", "CORBEILLE"] } });
      }
    }

    if (origin && origin !== "all") {
      if (origin === "EQUIPE" || origin === "COLLABORATEUR") {
        where.AND.push({ origin: { in: ["COLLABORATEUR", "EQUIPE"] } });
      } else {
        where.AND.push({ origin: origin });
      }
    }
    if (role && role !== "all") {
      where.AND.push({ createdBy: { role: { name: role } } });
    }

    if (search) {
      const s = search.toLowerCase();
      where.AND.push({
        OR: [
          { id: { contains: s } },
          { reference: { contains: s } },
          { name: { contains: s } },
          { createdBy: { name: { contains: s } } },
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    let missionsWhere = undefined;
    let tachesWhere = undefined;

    if (!isSuperAdmin(userRole)) {
      if (userRole === "Responsable opérationnel" || userRole === "Collaborateur") {
        missionsWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { dossier: { traitantId: userId } },
            { taches: { some: { assignedToId: userId } } }
          ]
        };
        tachesWhere = {
          OR: [
            { assignedToId: userId },
            { createdById: userId },
            { mission: { assignedToId: userId } },
            { mission: { dossier: { traitantId: userId } } },
            { dossierTache: { traitantId: userId } }
          ]
        };
      } else if (userRole === "Relecteur") {
        missionsWhere = {
          OR: [
            { relecteurId: userId },
            { taches: { some: { relecteurId: userId } } }
          ]
        };
        tachesWhere = { relecteurId: userId };
      }
    }

    let total = await prisma.dossier.count({ where });
    let dossiers = await prisma.dossier.findMany({
      where,
      skip: inMemoryFilter ? undefined : skip,
      take: inMemoryFilter ? undefined : limit,
      orderBy: { createdAt: "desc" },

      include: {
        traitant: { include: { role: true } },
        missions: {
          where: missionsWhere,
          include: { assignedTo: { include: { role: true } }, taches: { where: tachesWhere } },
        },
        authorizedForMissions: {
          where: missionsWhere,
          include: { assignedTo: true, taches: { where: tachesWhere } },
        },
        missionsLinked: {
          where: missionsWhere,
          include: { assignedTo: true, taches: { where: tachesWhere } },
        },
        tachesLinked: {
          where: tachesWhere,
          include: { assignedTo: true },
        },
        authorizedForTaches: {
          where: tachesWhere,
          include: { assignedTo: true },
        },
        client: true,
        createdBy: { include: { role: true } },
        documents: {
          where: { isDeleted: false },
          include: { uploadedBy: true },
          orderBy: { createdAt: "desc" },
        },
        subDossiers: { include: { subDossiers: true } },
        parentDossier: true,
      },
    });

    if (inMemoryFilter) {
      let accessibleSet = new Set();
      const dossiersMap = new Map();
      dossiers.forEach((d) => dossiersMap.set(d.id, d));

      const getDescendants = (folderId) => {
        let desc = [];
        dossiers.forEach((d) => {
          if (d.parentDossierId === folderId) {
            desc.push(d.id);
            desc = desc.concat(getDescendants(d.id));
          }
        });
        return desc;
      };

      const getAncestors = (folderId) => {
        let anc = [];
        let current = dossiersMap.get(folderId);
        while (current && current.parentDossierId) {
          anc.push(current.parentDossierId);
          current = dossiersMap.get(current.parentDossierId);
        }
        return anc;
      };

      // writeSet: dossiers where user can create sub-folders and upload files
      const writeSet = new Set();

      dossiers.forEach((d) => {
        // --- Traitant: sees + writes all descendants of this dossier ---
        if (d.traitantId === req.user.id) {
          accessibleSet.add(d.id);
          writeSet.add(d.id);
          getDescendants(d.id).forEach((id) => {
            accessibleSet.add(id);
            writeSet.add(id);
          });
          getAncestors(d.id).forEach((id) => accessibleSet.add(id)); // ancestors: nav only
          return;
        }

        // --- Mission/Tache assigned: authorized dossiers visible + dossier mission writable ---
        let isAuthorized = false;
        if (
          d.authorizedForMissions &&
          d.authorizedForMissions.some((m) => m.assignedToId === req.user.id)
        )
          isAuthorized = true;
        if (
          d.missionsLinked &&
          d.missionsLinked.some((m) => m.assignedToId === req.user.id)
        )
          isAuthorized = true;
        if (
          d.authorizedForTaches &&
          d.authorizedForTaches.some((t) => t.assignedToId === req.user.id)
        )
          isAuthorized = true;
        if (
          d.tachesLinked &&
          d.tachesLinked.some((t) => t.assignedToId === req.user.id)
        )
          isAuthorized = true;

        if (
          req.user.role === "Relecteur" ||
          req.user.role === "Collaborateur"
        ) {
          if (
            d.authorizedForMissions &&
            d.authorizedForMissions.some((m) =>
              m.taches.some((t) => t.assignedToId === req.user.id),
            )
          )
            isAuthorized = true;
          if (
            d.missionsLinked &&
            d.missionsLinked.some((m) =>
              m.taches.some((t) => t.assignedToId === req.user.id),
            )
          )
            isAuthorized = true;
        }

        if (isAuthorized) {
          accessibleSet.add(d.id);
          getDescendants(d.id).forEach((id) => accessibleSet.add(id));
          getAncestors(d.id).forEach((id) => accessibleSet.add(id)); // nav only, read-only

          // Write access only on the explicit dossierMission / dossierTache
          if (
            d.missionsLinked &&
            d.missionsLinked.some((m) => m.assignedToId === req.user.id)
          ) {
            writeSet.add(d.id);
            getDescendants(d.id).forEach((id) => writeSet.add(id));
          }
          if (
            d.tachesLinked &&
            d.tachesLinked.some((t) => t.assignedToId === req.user.id)
          ) {
            writeSet.add(d.id);
            getDescendants(d.id).forEach((id) => writeSet.add(id));
          }
        } else {
          // Dossier that directly holds a mission assigned to user (root-level mission, no sub-dossier)
          const hasMissionOnRoot =
            (d.missions &&
              d.missions.some((m) => m.assignedToId === req.user.id)) ||
            ((req.user.role === "Relecteur" ||
              req.user.role === "Collaborateur") &&
              d.missions &&
              d.missions.some((m) =>
                m.taches.some((t) => t.assignedToId === req.user.id),
              ));

          if (hasMissionOnRoot) {
            accessibleSet.add(d.id);
          }
        }
      });

      dossiers = dossiers.filter((d) => accessibleSet.has(d.id));

      // Use the writeSet computed during access resolution
      const isSuperAdm =
        req.user.role === "Super-administrateur" ||
        req.user.role === "Administrateur";
      dossiers = dossiers.map((d) => ({
        ...d,
        canWrite: isSuperAdm || writeSet.has(d.id),
      }));

      total = dossiers.length;
      if (limit) dossiers = dossiers.slice(skip, skip + limit);
    }

    sendPaginatedResponse(res, dossiers, total, page, limit);
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Force nodemon restart to load new Prisma Client
router.post("/dossiers", async (req, res) => {
  try {
    const userRole = req.user.role;
    // Super-Admin, Admin Tech, Administrateur, Responsable Op. peuvent créer un dossier
    if (!isManager(userRole)) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé. Vous n'avez pas les droits pour créer un dossier.",
        });
    }

    const { name, description, priority, origin, categorie } = req.body;
    const creatorId = await resolveCreatorId(req);
    const isSubFolder = req.body.parentDossierId ? true : false;
    const reference = isSubFolder
      ? await generateSubDossierReference(req.body.parentDossierId)
      : await generateReference("dossier", "DOS");

    let traitantId = req.body.traitantId || null;
    if (traitantId === "MASTER-ADMIN") traitantId = creatorId;

    let targetUserId = req.body.targetUserId || null;
    if (targetUserId === "MASTER-ADMIN") targetUserId = creatorId;

    // Le Responsable Op. ne peut créer que dans ses propres dossiers (vérification si sous-dossier)
    if (userRole === "Responsable opérationnel" && req.body.parentDossierId) {
      const parentDossier = await prisma.dossier.findUnique({
        where: { id: req.body.parentDossierId },
        select: { traitantId: true },
      });
      if (!parentDossier || parentDossier.traitantId !== req.user.id) {
        return res
          .status(403)
          .json({
            error:
              "Accès refusé. Vous n'êtes pas le responsable de ce dossier parent.",
          });
      }
    }

    // ── Vérification d'unicité du nom supprimée à la demande ─────────────────────
    const parentId = req.body.parentDossierId || null;

    // Ne plus créer de sous-dossiers par défaut
    const defaultSubFolders = [];

    // Use a transaction to atomically create the main dossier + all GED sub-folders
    const dossier = await prisma.$transaction(async (tx) => {
      const created = await tx.dossier.create({
        data: {
          reference,
          name: `${reference}_${name}`.toLowerCase(),
          description,
          priority: priority || "NORMAL",
          status: "NOUVEAU",
          origin: origin || "INTERNE",
          createdById: creatorId,
          traitantId: traitantId,
          clientId: req.body.clientId || null,
          targetUserId: targetUserId,
          parentDossierId: req.body.parentDossierId || null,
          categorie: categorie || null,
        },
      });

      // (La boucle de sous-dossiers par défaut a été supprimée à la demande de l'utilisateur)
      return created;
    });

    await prisma.auditLog.create({
      data: {
        userId: creatorId,
        action: "CREATION_DOSSIER",
        targetId: dossier.id,
        targetType: "DOSSIER",
        details: `Dossier créé: ${dossier.name}`,
        dossierId: dossier.id,
      },
    });

    emitEntityUpdate(req, 'DOSSIER', dossier.id, 'CREATED');
    res.status(201).json(dossier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du dossier." });
  }
});

// --- AUDIT LOGS ---
router.patch("/dossiers/:id", async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    // Prévention des actions concurrentes sur le statut
    const currentDossier = await prisma.dossier.findUnique({
      where: { id: req.params.id },
    });
    if (!currentDossier)
      return res.status(404).json({ error: "Dossier introuvable." });
    if (req.body.status && currentDossier.status === req.body.status) {
      return res
        .status(400)
        .json({
          error:
            "Action impossible : le dossier est déjà dans ce statut (peut-être modifié par un autre utilisateur).",
        });
    }

    if (["BLOQUE", "EN_ATTENTE"].includes(currentDossier.status)) {
      const keys = Object.keys(req.body).filter(k => req.body[k] !== undefined);
      if (keys.some(k => k !== "status")) {
        return res.status(403).json({ error: "Action impossible : le dossier est bloqué ou en attente. Vous devez d'abord le débloquer avant de modifier son contenu." });
      }
    }

    // ── Matrice institutionnelle des transitions de statut ─────────────────────
    if (req.body.status) {
      const from = currentDossier.status;
      const to = req.body.status;
      const isSA = isSuperAdmin(userRole); console.log("DELETE DOSSIER ROLE IS:", userRole);
      const isRO = userRole === "Responsable opérationnel";
      const isRespOrAdmin = isSA || isRO;

      const isAssigned = currentDossier.traitantId === userId;
      let allowed = false;

      // Auto states that cannot be manually set
      if ((to === "NOUVEAU" || to === "EN_COURS" || to === "TERMINE") && from !== "BLOQUE" && from !== "EN_ATTENTE") {
         return res.status(403).json({ error: `Le statut '${to}' est automatique et ne peut pas être forcé manuellement.` });
      }

      if (from === "ARCHIVE") {
         return res.status(403).json({ error: "Un dossier archivé ne peut plus être modifié." });
      }

      if (from === "BLOQUE") {
        if (!isSA) {
          return res.status(403).json({ error: "Seul un Super-Administrateur peut débloquer." });
        }
        if (to !== currentDossier.previousStatus) {
          return res.status(403).json({ error: `Un dossier bloqué ne peut retourner qu'à son statut précédent (${currentDossier.previousStatus}).` });
        }
        allowed = true;
      } else if (from === "CLOTURE") {
        if (!isSA && !isAssigned) {
          return res.status(403).json({ error: "Accès refusé. Seul l'assigné ou le Super-Admin peut retirer la clôture." });
        }
        if (to === currentDossier.previousStatus) {
          allowed = true;
        } else if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Seul un Super-Admin peut bloquer." });
          allowed = true;
        } else if (to === "EN_ATTENTE") {
          allowed = true;
        } else {
          return res.status(403).json({ error: `Un dossier clôturé ne peut retourner qu'à son statut précédent (${currentDossier.previousStatus}).` });
        }
      } else if (from === "EN_ATTENTE") {
        if (!isSA && !isAssigned) {
          return res.status(403).json({ error: "Accès refusé. Seul l'assigné ou le Super-Admin peut lever l'attente." });
        }
        if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Seul un Super-Admin peut bloquer." });
          allowed = true;
        } else if (to === currentDossier.previousStatus) {
          allowed = true;
        } else if (to === "CLOTURE") {
          allowed = true;
        } else {
          return res.status(403).json({ error: `Un dossier en attente ne peut retourner qu'à son statut précédent (${currentDossier.previousStatus}) ou être bloqué/clôturé.` });
        }
      } else {
        // Target is BLOQUE
        if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Seul un Super-Admin peut bloquer." });
          allowed = true;
        } 
        // Target is EN_ATTENTE
        else if (to === "EN_ATTENTE") {
          if (!isSA && !isAssigned) {
             return res.status(403).json({ error: "Accès refusé pour mettre en attente." });
          }
          allowed = true;
        }
        // Target is CLOTURE
        else if (to === "CLOTURE") {
          if (!isSA && !isAssigned) {
             return res.status(403).json({ error: "Accès refusé pour clôturer." });
          }
          allowed = true;
        }
        // Target is ARCHIVE
        else if (to === "ARCHIVE") {
          if (from !== "TERMINE") {
             return res.status(403).json({ error: "Un dossier ne peut être archivé que s'il est au statut TERMINE." });
          }
          if (!isSA) {
             return res.status(403).json({ error: "Seul un Super-Admin peut archiver." });
          }
          allowed = true;
        }
      }

      if (!allowed) {
        return res.status(403).json({
          error: `Transition invalide ou non autorisée : de '${from}' à '${to}'.`,
        });
      }

      // Contrainte métier : impossible de terminer/clôturer avec des missions/tâches incomplètes
      if (["TERMINE", "CLOTURE", "ARCHIVE"].includes(to)) {
        const incompleteMissions = await prisma.mission.count({
          where: {
            dossierId: req.params.id,
            status: { notIn: ["TERMINE", "TERMINE", "ANNULEE", "ANNULEE"] },
          },
        });
        const incompleteTaches = await prisma.tache.count({
          where: {
            OR: [
              { mission: { dossierId: req.params.id } },
              { dossierTacheId: req.params.id },
            ],
            status: { notIn: ["TERMINE", "TERMINE", "ANNULEE", "ANNULEE"] },
          },
        });
        if (incompleteMissions > 0 || incompleteTaches > 0) {
          return res
            .status(400)
            .json({
              error:
                "Impossible de terminer ou clôturer le dossier : des missions ou tâches sont encore en cours.",
            });
        }
      }
    }

    // Vérification générale d'accès à la modification (champs hors statut)
    if (!isAdmin(userRole)) {
      if (userRole === "Responsable opérationnel") {
        const dossier = await prisma.dossier.findUnique({
          where: { id: req.params.id },
          select: { traitantId: true },
        });
        if (!dossier || dossier.traitantId !== userId) {
          return res
            .status(403)
            .json({
              error:
                "Accès refusé. Vous n'êtes pas le responsable de ce dossier.",
            });
        }
      } else {
        return res
          .status(403)
          .json({ error: "Accès refusé. Privilèges insuffisants." });
      }
    }

    const { status, name, description, traitantId } = req.body;
    const updateData = {};
    if (status !== undefined && status !== currentDossier.status) {
      updateData.status = status;
      updateData.previousStatus = currentDossier.status;
    }
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (traitantId !== undefined) {
      updateData.traitantId =
        traitantId === "MASTER-ADMIN"
          ? await resolveCreatorId(req)
          : traitantId;
    }

    const dossier = await prisma.dossier.update({
      where: { id: req.params.id },
      data: updateData,
    });

    if (updateData.status === "EN_ATTENTE") {
      const { cascadePauseDossier } = require("../../utils/statusCascade");
      await cascadePauseDossier(dossier.id);
    }

    await logAudit(
      req.user?.id,
      "MODIFICATION_DOSSIER",
      dossier.id,
      "DOSSIER",
      `Dossier modifié: ${name || dossier.name}`,
      dossier.id,
    );

    emitEntityUpdate(req, 'DOSSIER', dossier.id, 'UPDATED', dossier);
    res.json(dossier);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du dossier." });
  }
});

router.delete("/dossiers/:id", requireSuperAdminToDeleteDossier, async (req, res) => {
  try {

    const dossier = await prisma.dossier.findUnique({
      where: { id: req.params.id },
    });
    if (!dossier)
      return res.status(404).json({ error: "Dossier introuvable." });

    // Dossiers système (générés auto pour les missions) : protection absolue
    if (dossier.isSystem) {
      return res
        .status(403)
        .json({
          error:
            "Ce dossier est géré automatiquement par le système. Pour le supprimer, supprimez la mission ou le dossier parent associé.",
        });
    }

    // Soft-delete : passer en corbeille (ne pas supprimer physiquement)
    await prisma.dossier.update({
      where: { id: req.params.id },
      data: { status: "CORBEILLE" },
    });

    // Mettre en corbeille les sous-dossiers récursivement, et leurs missions/tâches
    const markHierarchyAsDeleted = async (parentId) => {
      // 1. Mettre en corbeille les missions du dossier
      await prisma.mission.updateMany({
        where: { dossierId: parentId, status: { not: "CORBEILLE" } },
        data: { status: "CORBEILLE" },
      });

      // 2. Mettre en corbeille les tâches rattachées au dossier ou à ses missions
      await prisma.tache.updateMany({
        where: {
          OR: [
            { dossierTacheId: parentId },
            { mission: { dossierId: parentId } }
          ],
          status: { not: "CORBEILLE" }
        },
        data: { status: "CORBEILLE" },
      });

      // 3. Récursion sur les sous-dossiers
      const children = await prisma.dossier.findMany({
        where: { parentDossierId: parentId },
        select: { id: true },
      });
      for (const child of children) {
        await prisma.dossier.update({
          where: { id: child.id },
          data: { status: "CORBEILLE" },
        });
        await markHierarchyAsDeleted(child.id);
      }
    };
    await markHierarchyAsDeleted(req.params.id);

    await logAudit(
      req.user?.id,
      "SUPPRESSION_DOSSIER",
      req.params.id,
      "DOSSIER",
      `Dossier mis en corbeille: ${dossier.name}`,
      null,
    );

    res.json({
      success: true,
      message:
        "Dossier mis en corbeille (soft-delete). Restaurable depuis la corbeille.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression: " + error.message });
  }
});

// ── Restauration d'un dossier depuis la corbeille ───────────────────────────
router.patch("/dossiers/:id/restore", async (req, res) => {
  try {
    if (!isSuperAdmin(req.user.role)) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé. Seul un Super-Administrateur peut restaurer un dossier.",
        });
    }
    const dossier = await prisma.dossier.findUnique({
      where: { id: req.params.id },
    });
    if (!dossier)
      return res.status(404).json({ error: "Dossier introuvable." });
    if (dossier.status !== "CORBEILLE")
      return res
        .status(400)
        .json({ error: "Ce dossier n'est pas en corbeille." });

    const previousStatus = dossier.previousStatus || "NOUVEAU";
    await prisma.dossier.update({
      where: { id: req.params.id },
      data: { status: previousStatus },
    });

    // Restaurer les sous-dossiers
    const restoreSubFolders = async (parentId) => {
      const children = await prisma.dossier.findMany({
        where: { parentDossierId: parentId, status: "CORBEILLE" },
        select: { id: true, previousStatus: true },
      });
      for (const child of children) {
        await prisma.dossier.update({
          where: { id: child.id },
          data: { status: child.previousStatus || "NOUVEAU" },
        });
        await restoreSubFolders(child.id);
      }
    };
    await restoreSubFolders(req.params.id);

    await logAudit(
      req.user?.id,
      "RESTAURATION_DOSSIER",
      req.params.id,
      "DOSSIER",
      `Dossier restauré: ${dossier.name}`,
      null,
    );
    res.json({ success: true, message: "Dossier restauré avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la restauration." });
  }
});

router.get("/dossiers/:id/tree", async (req, res) => {
  try {
    const isSuperAdm = req.user.role === "Super-administrateur";
    const where = {};
    if (!isSuperAdm) {
      where.status = { not: "BLOQUE" };
    }
    
    const allDossiers = await prisma.dossier.findMany({
      where,
      select: { id: true, name: true, parentDossierId: true, reference: true },
    });

    const buildTree = (parentId) => {
      return allDossiers
        .filter((d) => d.parentDossierId === parentId)
        .map((d) => ({
          ...d,
          subDossiers: buildTree(d.id),
        }));
    };

    const rootDossier = allDossiers.find((d) => d.id === req.params.id);
    if (!rootDossier) {
      return res.status(404).json({ error: "Dossier non trouvé" });
    }

    rootDossier.subDossiers = buildTree(rootDossier.id);
    res.json(rootDossier);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'arborescence." });
  }
});

// --- TÂCHES ---

module.exports = router;
