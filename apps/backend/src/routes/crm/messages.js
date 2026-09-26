const express = require("express");
const prisma = require("../../prisma");
const crypto = require("node:crypto");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const fs = require("node:fs");
const path = require("node:path");
const router = express.Router();
const { validateMessageStatus } = require('../../utils/statusRules');


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

router.post("/messages/interne", authenticateJWT, async (req, res) => {
  try {
    const {
      subType,
      objet,
      bodyText,
      attachment,
      dossierId,
      missionId,
      tacheId,
      assignedToId,
    } = req.body;
    // [SECURITY] req.body intentionally not logged — contains PII (names, message content)

    // Récupérer les infos complètes de l'expéditeur
    let senderName =
      req.user?.id === "MASTER-ADMIN"
        ? process.env.MASTER_ADMIN_NAME || "Super Administrateur"
        : "Administrateur";
    let senderEmail = req.user?.email || "admin@menua";
    let senderRole = req.user?.role || "Admin";

    if (req.user?.id && req.user.id !== "MASTER-ADMIN") {
      const dbUser = await prisma.utilisateur.findUnique({
        where: { id: req.user.id },
        include: { role: true },
      });
      if (dbUser) {
        senderName = dbUser.name;
        senderEmail = dbUser.email;
        senderRole = dbUser.role?.name || "Sans rôle";
      }
    }

    const message = await prisma.messagePersonnel.create({
      data: {
        messageId: crypto.randomUUID(),
        type: "INTERNE",
        subType: subType || "SMS Collaborateur",
        nomPrenom: senderName,
        email: senderEmail,
        objet: objet,
        bodyText: bodyText,
        attachment: attachment,
        status: "NOUVEAU",
        dossierId: dossierId || null,
        missionId: missionId || null,
        tacheId: tacheId || null,
        assignedToId: assignedToId || null,
      },
    });
    res.json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Erreur lors de la création du message interne.",
        details: error.message,
      });
  }
});
// --- INTERNE CONVERSATIONS ---
router.get(
  "/messages/interne/conversations",
  authenticateJWT,
  async (req, res) => {
    try {
      const currentUserEmail = req.user.email;
      const currentUserId = req.user.id === "MASTER-ADMIN" ? null : req.user.id;

      const whereOr = [{ email: currentUserEmail }];
      if (currentUserId) whereOr.push({ assignedToId: currentUserId });

      const messages = await prisma.messagePersonnel.findMany({
        where: {
          type: "INTERNE",
          isDeleted: false,
          OR: whereOr,
        },
        orderBy: { createdAt: "desc" },
      });

      const allUsers = await prisma.utilisateur.findMany({
        select: { id: true, name: true, email: true, profile: true },
      });

      // Group by contact
      const conversationsMap = {};
      for (const m of messages) {
        let otherUserEmail = m.email === currentUserEmail ? null : m.email;
        let otherUserId =
          m.assignedToId === currentUserId ? null : m.assignedToId;

        if (!otherUserEmail && otherUserId) {
          const u = allUsers.find((user) => user.id === otherUserId);
          if (u) otherUserEmail = u.email;
        }

        if (!otherUserEmail) continue;

        if (!conversationsMap[otherUserEmail]) {
          const u = allUsers.find((user) => user.email === otherUserEmail);
          conversationsMap[otherUserEmail] = {
            contact: {
              id: u ? u.id : otherUserEmail,
              name: u ? u.name : m.nomPrenom,
              email: otherUserEmail,
              profile: u ? u.profile : null,
            },
            lastMessage: m,
            unreadCount:
              m.email === otherUserEmail &&
              m.status !== "Lu" &&
              m.status !== "TERMINE"
                ? 1
                : 0,
          };
        } else {
          if (
            m.email === otherUserEmail &&
            m.status !== "Lu" &&
            m.status !== "TERMINE"
          ) {
            conversationsMap[otherUserEmail].unreadCount += 1;
          }
        }
      }

      res.json({
        success: true,
        conversations: Object.values(conversationsMap).sort(
          (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt,
        ),
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des conversations." });
    }
  },
);

router.get(
  "/messages/interne/conversations/:contactEmail",
  authenticateJWT,
  async (req, res) => {
    try {
      const { contactEmail } = req.params;
      const currentUserEmail = req.user.email;
      const currentUserId = req.user.id === "MASTER-ADMIN" ? null : req.user.id;

      // Find contact ID if possible
      const contactUser = await prisma.utilisateur.findUnique({
        where: { email: contactEmail },
      });
      const contactId = contactUser?.id;

      const messages = await prisma.messagePersonnel.findMany({
        where: {
          type: "INTERNE",
          isDeleted: false,
          OR: [
            { email: currentUserEmail, assignedToId: contactId },
            { email: contactEmail, assignedToId: currentUserId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });

      res.json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération de la conversation." });
    }
  },
);

router.get("/messages", async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const tabType = (req.query.type || "CONTACT").toUpperCase();
    const statusFilter = req.query.status || "all";
    const search = req.query.search || "";
    const dateFilter = req.query.date || "";

    let messages = [];
    let total = 0;

    if (tabType === "CONTACT" || tabType === "RECRUTEMENT") {
      if (req.user.role === "Collaborateur" || req.user.role === "Relecteur") {
        return res
          .status(403)
          .json({ error: "Accès interdit aux formulaires externes." });
      }

      let where = { type: tabType };
      const andConditions = [];

      if (req.user.role === "Responsable opérationnel") {
        andConditions.push({
          OR: [{ assignedToId: req.user.id }, { assignedToId: null }],
        });
      }
      if (statusFilter === "traite") {
        where.status = { in: ["TERMINE", "ARCHIVE"] };
      } else if (statusFilter === "nontraite") {
        where.status = { notIn: ["TERMINE", "ARCHIVE"] };
      } else if (statusFilter !== "all") {
        where.status = statusFilter;
      }

      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(filterDate);
        nextDate.setDate(nextDate.getDate() + 1);
        andConditions.push({
          createdAt: {
            gte: filterDate,
            lt: nextDate,
          },
        });
      }

      if (search) {
        andConditions.push({
          OR: [
            { nomPrenom: { contains: search } },
            { email: { contains: search } },
          ],
        });
      }
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      total = await prisma.formulaire.count({ where });
      const records = await prisma.formulaire.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { contact: true, recrutement: true },
      });

      messages = records.map((f) => ({
        id: f.id,
        type: f.type,
        status: f.status,
        statusSubmitter: f.statusSubmitter,
        nomPrenom: f.nomPrenom,
        email: f.email,
        telephone: f.telephone,
        raisonSocial: f.raisonSocial,
        description: f.description,
        objet:
          f.objet ||
          (f.type === "CONTACT" ? "Demande de contact" : "Candidature"),
        bodyHtml: f.bodyHtml,
        createdAt: f.createdAt,
        contact: f.contact,
        recrutement: f.recrutement,
        verifaliaStatus: f.verifaliaStatus,
        priorite: f.priority,
        dateRappel: f.dateRappel,
        noteRappel: f.noteRappel,
        dateEntretien: f.dateEntretien,
        lienVisio: f.lienVisio,
      }));
    } else {
      let where = { type: tabType, isDeleted: false };

      if (req.user.role === "Collaborateur" || req.user.role === "Relecteur") {
        where.OR = [
          { subType: { contains: req.user.name } },
          { email: req.user.email },
          { assignedToId: req.user.id },
          { Tache: { assignedToId: req.user.id } },
          { mission: { assignedToId: req.user.id } },
        ];
      } else if (req.user.role === "Responsable opérationnel") {
        where.assignedToId = req.user.id;
      }

      if (statusFilter === "traite") {
        where.status = { in: ["TERMINE", "ARCHIVE"] };
      } else if (statusFilter === "nontraite") {
        where.status = { notIn: ["TERMINE", "ARCHIVE"] };
      } else if (statusFilter !== "all") {
        where.status = statusFilter;
      }

      const andConditions = [];
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(filterDate);
        nextDate.setDate(nextDate.getDate() + 1);
        andConditions.push({
          createdAt: {
            gte: filterDate,
            lt: nextDate,
          },
        });
      }

      if (search) {
        const searchFilter = {
          OR: [
            { nomPrenom: { contains: search } },
            { email: { contains: search } },
          ],
        };
        andConditions.push(searchFilter);
      }

      if (andConditions.length > 0) {
        if (where.OR) {
          where.AND = [{ OR: where.OR }, ...andConditions];
          delete where.OR;
        } else {
          where.AND = andConditions;
        }
      }

      total = await prisma.messagePersonnel.count({ where });
      const records = await prisma.messagePersonnel.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { dossier: true, mission: true, Tache: true },
      });

      messages = records.map((e) => ({
        id: e.id,
        type: e.type,
        status: e.status,
        nomPrenom: e.nomPrenom,
        email: e.email,
        objet: e.objet,
        bodyHtml: e.bodyText || e.bodyHtml,
        subType: e.subType || "Indéfini",
        attachment: e.attachment,
        etiquette: e.etiquette,
        priorite: e.priorite,
        createdAt: e.createdAt,
        dossierId: e.dossierId,
        missionId: e.missionId,
        tacheId: e.tacheId,
        assignedToId: e.assignedToId,
        dateRappel: e.dateRappel,
        noteRappel: e.noteRappel,
        dateEntretien: e.dateEntretien,
        lienVisio: e.lienVisio,
        sourceType: e.Tache
          ? "Tâche"
          : e.mission
            ? "Mission"
            : e.dossier
              ? "Dossier"
              : null,
        sourceRef:
          e.Tache?.reference ||
          e.mission?.reference ||
          e.dossier?.reference ||
          e.id,
      }));
    }

    sendPaginatedResponse(res, messages, total, page, limit);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des messages." });
  }
});

// --- SYNC IMAP ---
router.post("/messages/sync-imap", authenticateJWT, syncMessages);

router.post("/messages/:id/assign", async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedToId } = req.body;

    // Check if it's a Formulaire
    let form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.update({
        where: { id },
        data: { assignedToId: assignedToId || null },
      });
      await logAudit(
        req.user?.id,
        "ASSIGNATION_FORMULAIRE",
        id,
        "FORMULAIRE",
        `Formulaire assigné à ${assignedToId || "non-assigné"}`,
        null,
        form.id,
      );
      return res.json({ success: true, message: "Formulaire assigné" });
    }

    // Otherwise check MessagePersonnel
    let msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.update({
        where: { id },
        data: { assignedToId: assignedToId || null },
      });
      await logAudit(
        req.user?.id,
        "ASSIGNATION_MESSAGE",
        id,
        "MESSAGE",
        `Message personnel assigné à ${assignedToId || "non-assigné"}`,
      );
      return res.json({ success: true, message: "Message assigné" });
    }

    res.status(404).json({ error: "Message non trouvé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'assignation" });
  }
});

router.patch("/messages/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      dossierId,
      lieuTraitement,
      numeroReference,
      etiquette,
      priorite,
      assignedToId,
      dateRappel,
      noteRappel,
      dateEntretien,
      lienVisio,
    } = req.body;

    const dataToUpdate = {};
    if (status !== undefined) {
      // ── Gouvernance RBAC & Matrice de Transition ──────────────────────────
      const userRole = req.user.role;
      const isSuperAdmin = userRole === "Super-administrateur";
      const isResp = userRole === "Responsable opérationnel";
      
      if (!isSuperAdmin && !isResp) {
        return res.status(403).json({
          error: "Accès refusé. Seuls le Super-Administrateur et le Responsable opérationnel peuvent modifier le statut d'un message.",
        });
      }

      // Check current message status
      const msg = await prisma.messagePersonnel.findUnique({ where: { id } }) || 
                  await prisma.formulaire.findUnique({ where: { id } });
                  
      if (msg && msg.status !== status) {
        const from = msg.status || "NOUVEAU";
        const currentEtiquette = etiquette !== undefined ? etiquette : msg.etiquette || "";
        let category = "none";
        if (msg.type === "contact" || currentEtiquette === "Contact") category = "contact";
        else if (msg.type === "recrutement" || currentEtiquette === "Recrutement") category = "recrutement";
        
        const VALID = {
          contact: {
            NOUVEAU: ["A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"],
            A_RAPPELER: ["DISCUSSION", "SANS_SUITE", "GAGNE"],
            DISCUSSION: ["A_RAPPELER", "SANS_SUITE", "GAGNE"],
            SANS_SUITE: ["DISCUSSION"],
            GAGNE: []
          },
          recrutement: {
            NOUVEAU: ["A_RAPPELER", "ENTRETIEN", "REFUSE"],
            A_RAPPELER: ["ENTRETIEN", "REFUSE"],
            ENTRETIEN: ["A_RAPPELER", "RETENU", "REFUSE"],
            RETENU: [],
            REFUSE: []
          }
        };

        const allowedTransitions = VALID[category]?.[from] || [];
        if (!allowedTransitions.includes(status)) {
          return res.status(400).json({
            error: `Transition impossible : un message en statut "${from}" ne peut pas passer à "${status}".`,
          });
        }
      }
      
      dataToUpdate.status = status;
      if (priorite === undefined) {
        dataToUpdate.priorite = "Normal"; // Règle: Dès qu'un statut change, la priorité redevient Normal par défaut
      }
    }
    if (etiquette !== undefined) dataToUpdate.etiquette = etiquette;
    if (priorite !== undefined) dataToUpdate.priorite = priorite;
    // Mise en copie d'un RO — Super-Admin uniquement (vérifié ici côté serveur)
    if (assignedToId !== undefined) {
      if (
        !["Super-administrateur", "Administrateur", "Admin Tech"].includes(
          req.user.role,
        )
      ) {
        return res
          .status(403)
          .json({
            error:
              "Accès refusé. Seul un Super-Administrateur peut assigner un Responsable Opérationnel.",
          });
      }
      dataToUpdate.assignedToId = assignedToId || null;
    }
    // Rappel / Entretien
    if (dateRappel !== undefined)
      dataToUpdate.dateRappel = dateRappel ? new Date(dateRappel) : null;
    if (noteRappel !== undefined) dataToUpdate.noteRappel = noteRappel;
    if (dateEntretien !== undefined)
      dataToUpdate.dateEntretien = dateEntretien
        ? new Date(dateEntretien)
        : null;
    if (lienVisio !== undefined) dataToUpdate.lienVisio = lienVisio;
    if (dossierId !== undefined) {
      dataToUpdate.dossierId = dossierId;
    }

    if (numeroReference && lieuTraitement) {
      if (lieuTraitement === "Dossier") {
        const entity = await prisma.dossier.findFirst({
          where: { reference: numeroReference },
        });
        if (!entity)
          return res
            .status(404)
            .json({
              error: `Le Dossier avec la référence "${numeroReference}" n'existe pas.`,
            });
        dataToUpdate.dossierId = entity.id;
      } else if (lieuTraitement === "Mission") {
        const entity = await prisma.mission.findFirst({
          where: { reference: numeroReference },
        });
        if (!entity)
          return res
            .status(404)
            .json({
              error: `La Mission avec la référence "${numeroReference}" n'existe pas.`,
            });
        dataToUpdate.missionId = entity.id;
      } else if (lieuTraitement === "Tâche") {
        const entity = await prisma.tache.findFirst({
          where: { reference: numeroReference },
        });
        if (!entity)
          return res
            .status(404)
            .json({
              error: `La Tâche avec la référence "${numeroReference}" n'existe pas.`,
            });
        dataToUpdate.tacheId = entity.id;
      }
    }

    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      const formUpdateData = { ...dataToUpdate };
      if (formUpdateData.priorite !== undefined) {
        formUpdateData.priority = formUpdateData.priorite;
        delete formUpdateData.priorite;
      }
      await prisma.formulaire.update({ where: { id }, data: formUpdateData });
      // Verbose audit log removed
      return res.json({ success: true, message: "Statut mis à jour" });
    }
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });
    if (msg) {
      await prisma.messagePersonnel.update({
        where: { id },
        data: dataToUpdate,
      });
      // Verbose audit log removed
      return res.json({ success: true, message: "Statut mis à jour" });
    }
    res.status(404).json({ error: "Message non trouvé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await prisma.messagePersonnel.findUnique({ where: { id } });

    if (msg) {
      await prisma.messagePersonnel.update({
        where: { id },
        data: { isDeleted: true },
      });
      await logAudit(
        req.user?.id,
        "SUPPRESSION_MESSAGE",
        id,
        "MESSAGE",
        `Message personnel marqué comme supprimé (sujet: ${msg.subject || "sans sujet"})`,
      );
      return res.json({
        success: true,
        message: "Message supprimé avec succès (Soft Delete).",
      });
    }

    const form = await prisma.formulaire.findUnique({ where: { id } });
    if (form) {
      await prisma.formulaire.delete({ where: { id } });
      await logAudit(
        req.user?.id,
        "SUPPRESSION_FORMULAIRE",
        id,
        "FORMULAIRE",
        `Formulaire supprimé (${form.email || form.id})`,
      );
      return res.json({
        success: true,
        message: "Formulaire supprimé avec succès.",
      });
    }

    res.status(404).json({ error: "Message/Formulaire introuvable." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;
