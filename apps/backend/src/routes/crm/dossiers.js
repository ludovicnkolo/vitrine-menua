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
const { normalizeStatus } = require("../../utils/statusRules");
const { ensureClientSharingFolders } = require("../../services/sharingFolderService");
const emitEntityUpdate = (req, entityType, entityId, action, payload = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.to(entityId).emit('entity_updated', { entityType, entityId, action, ...payload });
    io.emit('entity_updated_global', { entityType, entityId, action, ...payload });
  }
};

const { logAudit } = require("../../utils/audit");
const { notify } = require("../../utils/notify");
const { getAdminUrl } = require("../../utils/urlHelper");
const {
  resolveCreatorId,
  generateReference,
  generateSubDossierReference,
  checkAndUpdateMissionStatus,
  checkAndUpdateDossierStatus,
} = require("../../services/dossierServiceHelpers");
const {
  handleDeleteDossier,
  handleRestoreDossier,
} = require("../../services/dossierLifecycleService");
const {
  handleRequestClientDocuments,
} = require("../../services/dossierShareService");


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

router.use(authenticateJWT);

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

    if (req.query.rootOnly === "true") {
      where.AND.push({ parentDossierId: null });
    }

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
      missionsWhere = {
        OR: [
          { assignedToId: userId },
          { relecteurId: userId },
          { createdById: userId },
          { dossier: { traitantId: userId } },
          { taches: { some: { OR: [{ assignedToId: userId }, { relecteurId: userId }, { createdById: userId }] } } },
        ],
      };
      tachesWhere = {
        OR: [
          { assignedToId: userId },
          { relecteurId: userId },
          { createdById: userId },
          { mission: { assignedToId: userId } },
          { mission: { relecteurId: userId } },
          { mission: { dossier: { traitantId: userId } } },
          { dossierTache: { traitantId: userId } },
        ],
      };
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
        client: { include: { user: true } },
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

    const isSuperAdm =
      req.user.role === "Super-administrateur" ||
      req.user.role === "Administrateur";
    dossiers = dossiers.map((d) => {
      const isAssignedDirect =
        d.traitantId === userId || d.createdById === userId || d.targetUserId === userId;
      const isAssignedMission =
        d.missions &&
        d.missions.some(
          (m) =>
            m.assignedToId === userId ||
            m.relecteurId === userId ||
            m.createdById === userId ||
            (m.taches &&
              m.taches.some(
                (t) => t.assignedToId === userId || t.relecteurId === userId || t.createdById === userId
              ))
        );
      const isAssignedTache =
        d.tachesLinked &&
        d.tachesLinked.some(
          (t) => t.assignedToId === userId || t.relecteurId === userId || t.createdById === userId
        );
      return {
        ...d,
        canWrite: isSuperAdm || isAssignedDirect || isAssignedMission || isAssignedTache,
      };
    });

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
    // Super-Admin, Administrateur, Responsable Op. peuvent créer un dossier (Administrateur technique exclu)
    if (userRole === "Administrateur technique" || !isManager(userRole)) {
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

    // Validation des champs obligatoires
    if (!origin || !["CLIENT", "COLLABORATEUR", "GENERAL", "INTERNE"].includes(origin)) {
      return res.status(400).json({ error: "L'origine du dossier est obligatoire (CLIENT, COLLABORATEUR ou GENERAL)." });
    }
    if (origin === "CLIENT" && !req.body.clientId) {
      return res.status(400).json({ error: "Le client associé au dossier est obligatoire." });
    }
    if (origin === "COLLABORATEUR" && !req.body.targetUserId) {
      return res.status(400).json({ error: "Le collaborateur associé au dossier est obligatoire." });
    }
    if (origin === "GENERAL" && (!name || !name.trim())) {
      return res.status(400).json({ error: "L'intitulé du dossier général est obligatoire." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: "La description du dossier est obligatoire." });
    }
    if (!req.body.traitantId) {
      return res.status(400).json({ error: "Le responsable du dossier (traitant) est obligatoire." });
    }

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

    // Vérification : impossible de créer un dossier pour un client inactif
    if (req.body.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: req.body.clientId },
        select: { id: true, name: true, status: true },
      });
      if (!client) {
        return res.status(404).json({ error: "Client introuvable." });
      }
      const clientStatus = String(client.status || "").trim().toUpperCase();
      if (clientStatus === "INACTIF" || clientStatus === "BLOQUE") {
        return res.status(400).json({
          error: `Impossible de créer un dossier : le client « ${client.name} » est actuellement au statut inactif.`,
        });
      }
    }

    // Si c'est un sous-dossier, vérifier si le dossier parent est rattaché à un client inactif
    if (req.body.parentDossierId) {
      const parentDossier = await prisma.dossier.findUnique({
        where: { id: req.body.parentDossierId },
        include: { client: true },
      });
      if (parentDossier?.client) {
        const clientStatus = String(parentDossier.client.status || "").trim().toUpperCase();
        if (clientStatus === "INACTIF" || clientStatus === "BLOQUE") {
          return res.status(400).json({
            error: `Impossible de créer un sous-dossier : le client « ${parentDossier.client.name} » est inactif.`,
          });
        }
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

      // Si le dossier est rattaché à un client, créer automatiquement l'arborescence :
      // Partage documents > Sortant & Entrant
      if (req.body.clientId && !isSubFolder) {
        await ensureClientSharingFolders(created.id, tx);
      }

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
    console.error("Erreur POST /dossiers:", error);
    res.status(500).json({ error: error.message || "Erreur lors de la création du dossier." });
  }
});

// --- AUDIT LOGS ---
router.patch("/dossiers/:id", async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === "Administrateur technique") {
      return res.status(403).json({
        error: "Accès refusé. L'administrateur technique n'a pas accès à la gestion des dossiers.",
      });
    }

    // Prévention des actions concurrentes sur le statut
    const currentDossier = await prisma.dossier.findUnique({
      where: { id: req.params.id },
    });
    if (!currentDossier)
      return res.status(404).json({ error: "Dossier introuvable." });
    if (req.body.status) {
      req.body.status = normalizeStatus(req.body.status);
    }
    // Si le statut envoyé est identique au statut actuel, ce n'est pas un changement de statut : on ignore la transition
    if (req.body.status && currentDossier.status === req.body.status) {
      delete req.body.status;
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
      const isSA = isSuperAdmin(userRole);
      const isRO = userRole === "Responsable opérationnel" || isManager(userRole);
      const isRespOrAdmin = isSA || isRO;

      const isAssigned = currentDossier.traitantId === userId;
      const canManageDossier = isSA || isRO || isAssigned;
      let allowed = false;

      if (from === "ARCHIVE") {
         return res.status(403).json({ error: "Un dossier archivé ne peut plus être modifié." });
      }

      if (from === "BLOQUE") {
        if (!isSA) {
          return res.status(403).json({ error: "Seul un Super-Administrateur peut débloquer." });
        }
        if (to !== currentDossier.previousStatus && to !== "EN_COURS") {
          return res.status(403).json({ error: `Un dossier bloqué ne peut retourner qu'à son statut précédent (${currentDossier.previousStatus}).` });
        }
        allowed = true;
      } else if (from === "CLOTURE") {
        if (!canManageDossier) {
          return res.status(403).json({ error: "Accès refusé. Seul l'assigné, le Responsable opérationnel ou le Super-Admin peut retirer la clôture." });
        }
        if (to === currentDossier.previousStatus || to === "EN_COURS") {
          allowed = true;
        } else if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Seul un Super-Admin peut bloquer." });
          allowed = true;
        } else if (to === "EN_ATTENTE") {
          allowed = true;
        } else {
          return res.status(403).json({ error: `Un dossier clôturé ne peut retourner qu'à son statut précédent (${currentDossier.previousStatus}) ou en cours/attente.` });
        }
      } else if (from === "EN_ATTENTE") {
        if (!canManageDossier) {
          return res.status(403).json({ error: "Accès refusé. Seul l'assigné, le Responsable opérationnel ou le Super-Admin peut lever l'attente." });
        }
        if (to === "BLOQUE") {
          if (!isSA) return res.status(403).json({ error: "Seul un Super-Admin peut bloquer." });
          allowed = true;
        } else if (to === currentDossier.previousStatus || to === "EN_COURS") {
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
          if (!canManageDossier) {
             return res.status(403).json({ error: "Accès refusé pour mettre en attente." });
          }
          allowed = true;
        }
        // Target is CLOTURE
        else if (to === "CLOTURE") {
          if (!canManageDossier) {
             return res.status(403).json({ error: "Accès refusé pour clôturer." });
          }
          allowed = true;
        }
        // Target is EN_COURS
        else if (to === "EN_COURS") {
          if (!canManageDossier) {
             return res.status(403).json({ error: "Accès refusé pour passer en cours." });
          }
          allowed = true;
        }
        // Target is TERMINE
        else if (to === "TERMINE") {
          if (!canManageDossier) {
             return res.status(403).json({ error: "Accès refusé pour terminer le dossier." });
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

    const { status, name, description, traitantId, priority, categorie } = req.body;
    const updateData = {};

    if (status !== undefined && status !== currentDossier.status) {
      updateData.status = status;
      if (currentDossier.status === "EN_ATTENTE") {
        updateData.previousStatus = null;
      } else {
        updateData.previousStatus = currentDossier.status;
      }
    }

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName && trimmedName !== currentDossier.name) {
        updateData.name = trimmedName;
      }
    }

    if (description !== undefined) {
      const trimmedDesc = description ? description.trim() : null;
      const currDesc = currentDossier.description ? currentDossier.description.trim() : null;
      if (trimmedDesc !== currDesc) {
        updateData.description = trimmedDesc;
      }
    }

    if (traitantId !== undefined) {
      const resolvedTraitantId =
        traitantId === "MASTER-ADMIN"
          ? await resolveCreatorId(req)
          : (traitantId || null);
      if (resolvedTraitantId !== currentDossier.traitantId) {
        updateData.traitantId = resolvedTraitantId;
      }
    }

    if (priority !== undefined && priority !== currentDossier.priority) {
      updateData.priority = priority;
    }

    if (categorie !== undefined && (categorie || null) !== (currentDossier.categorie || null)) {
      updateData.categorie = categorie || null;
    }

    // Si aucun champ n'a été modifié, retourner directement le dossier sans écriture inutile
    if (Object.keys(updateData).length === 0) {
      return res.json(currentDossier);
    }

    const dossier = await prisma.dossier.update({
      where: { id: req.params.id },
      data: updateData,
    });

    if (updateData.status === "EN_ATTENTE") {
      const { cascadePauseDossier } = require("../../utils/statusCascade");
      await cascadePauseDossier(dossier.id);
    } else if (currentDossier.status === "EN_ATTENTE") {
      const { cascadeResumeDossier } = require("../../utils/statusCascade");
      await cascadeResumeDossier(dossier.id);
    } else if (updateData.status === "BLOQUE") {
      const { cascadeBlockDossier } = require("../../utils/statusCascade");
      await cascadeBlockDossier(dossier.id);
    } else if (currentDossier.status === "BLOQUE") {
      const { cascadeUnblockDossier } = require("../../utils/statusCascade");
      await cascadeUnblockDossier(dossier.id);
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

router.delete("/dossiers/:id", requireSuperAdminToDeleteDossier, handleDeleteDossier);

// ── Restauration d'un dossier depuis la corbeille ───────────────────────────
router.patch("/dossiers/:id/restore", handleRestoreDossier);

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

// ─── DEMANDE DE DOCUMENTS AU CLIENT (ESPACE CLIENT DIRECT) ───────────────────
router.post(
  "/dossiers/:id/request-client-documents",
  authenticateJWT,
  handleRequestClientDocuments
);

module.exports = router;
