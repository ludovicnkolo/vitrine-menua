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

router.get("/roles", async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/roles",
  requireRoles("Super-administrateur", "Administrateur technique"),
  async (req, res) => {
    try {
      const { name, permissions, description, status } = req.body;
      
      if (name === "Super-administrateur" || name.toLowerCase() === "super-administrateur") {
        return res.status(403).json({ error: "Le rôle Super-administrateur est unique et ne peut pas être dupliqué." });
      }

      const role = await prisma.role.create({
        data: { name, permissions, description, status: status || "Actif" },
      });
      await logAudit(
        req.user?.id,
        "CREATION_ROLE",
        role.id,
        "ROLE",
        `Rôle créé : ${role.name}`,
      );
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.patch(
  "/roles/:id",
  requireRoles("Super-administrateur", "Administrateur technique"),
  async (req, res) => {
    try {
      const { name, permissions, description, status } = req.body;
      const role = await prisma.role.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(permissions !== undefined && { permissions }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
        },
      });
      await logAudit(
        req.user?.id,
        "MODIFICATION_ROLE",
        role.id,
        "ROLE",
        `Rôle modifié : ${role.name}`,
      );
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.delete(
  "/roles/:id",
  requireRoles("Super-administrateur", "Administrateur technique"),
  async (req, res) => {
    try {
      const existing = await prisma.role.findUnique({
        where: { id: req.params.id },
      });
      await prisma.role.delete({ where: { id: req.params.id } });
      await logAudit(
        req.user?.id,
        "SUPPRESSION_ROLE",
        req.params.id,
        "ROLE",
        `Rôle supprimé : ${existing?.name || req.params.id}`,
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// --- DASHBOARD STATS (TOUR DE CONTROLE) ---
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: true,
        profile: true,
        isBlocked: true,
        lastLogin: true,
        createdAt: true,
        telephone: true,
        lieuResidence: true,
        experienceCle: true,
        langues: true,
        formations: true,
        assignedMissions: { select: { status: true } },
      },
    });

    const mappedUsers = users.map(u => {
      const assignedMissions = u.assignedMissions || [];
      const missionsTerminees = assignedMissions.filter(m => m.status === "TERMINE").length;
      const missionsEnCours = assignedMissions.filter(m => m.status !== "TERMINE" && m.status !== "ANNULEE" && m.status !== "CORBEILLE").length;
      delete u.assignedMissions;
      return { ...u, missionsTerminees, missionsEnCours };
    });

    res.json(mappedUsers);
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/users",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        roleId,
        phone,
        country,
        city,
        education,
        status,
        profile,
        telephone,
        lieuResidence,
        experienceCle,
        langues,
        formations,
      } = req.body;
      const bcrypt = require("bcryptjs");
      const crypto = require("node:crypto");

      if (!name || !email || !telephone || !roleId || !lieuResidence || !experienceCle || !langues) {
        return res
          .status(400)
          .json({ error: "Les champs Nom, Email, Téléphone, Rôle, Lieu de résidence, Expérience clé et Langues sont obligatoires." });
      }

      if (roleId) {
        const roleCheck = await prisma.role.findUnique({
          where: { id: roleId },
        });
        if (roleCheck && roleCheck.name === "Super-administrateur") {
          return res
            .status(403)
            .json({
              error:
                "Action non autorisée : Impossible de créer un autre Super-administrateur.",
            });
        }
      }

      // --- Validation unicité email et téléphone ---
      const existingEmail = await prisma.utilisateur.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res
          .status(409)
          .json({
            error: `Un collaborateur avec l'email "${email}" existe déjà.`,
          });
      }

      const tel = telephone || phone || null;
      if (tel) {
        const normalizedTel = tel.replace(/\s/g, "");
        const existingTel = await prisma.utilisateur.findFirst({
          where: { telephone: { equals: normalizedTel } },
        });
        if (existingTel) {
          return res
            .status(409)
            .json({
              error: `Un collaborateur avec le numéro "${tel}" existe déjà.`,
            });
        }
      }

      // Generate token for password setup
      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      // Default fallback password in case they don't use the link
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(8).toString("hex"),
        10,
      );

      const initialStatus = status || "Invitation envoyée";
      const isBlockedDefault = initialStatus === "Suspendu / Inactif";

      const user = await prisma.utilisateur.create({
        data: {
          name,
          email,
          password: hashedPassword,
          resetToken: token,
          resetTokenExpiry,
          roleId: roleId || null,
          telephone: tel,
          lieuResidence: lieuResidence || null,
          experienceCle: experienceCle || null,
          langues: langues || null,
          formations: formations || null,
          profile: profile || "",
          status: initialStatus,
          isBlocked: isBlockedDefault,
        },
      });

      await logAudit(
        req.user?.id,
        "CREATION_UTILISATEUR",
        user.id,
        "USER",
        `Utilisateur créé : ${user.name} (${user.email})`,
      );

      // Send email — Use ADMIN_FRONTEND_URL env var (the CRM admin frontend, NOT the backend)
      try {
        const adminFrontend = process.env.ADMIN_FRONTEND_URL || "http://localhost:5173";

        await transporter.sendMail({
          from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
          to: email,
          subject: "Création de votre compte Menua Consulting",
          html: `
          <h3>Bienvenue ${name},</h3>
          <p>Un compte collaborateur a été créé pour vous sur l'espace Menua Consulting.</p>
          <p>Veuillez vous rendre sur la page de connexion de l'espace administrateur et utiliser la fonction <strong>"Mot de passe oublié ?"</strong> pour configurer votre mot de passe et activer votre compte :</p>
          <a href="${adminFrontend}" style="display:inline-block;padding:10px 20px;background:#141824;color:#fff;text-decoration:none;border-radius:4px;">Accéder au CRM</a>
          <p style="color:#666;font-size:0.85em;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : ${adminFrontend}</p>
        `,
        });
      } catch (emailErr) {
        console.error(
          "Erreur lors de l'envoi de l'email de configuration:",
          emailErr,
        );
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur." });
    }
  },
);

router.patch(
  "/users/:id",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        roleId,
        profile,
        status,
        telephone,
        lieuResidence,
        experienceCle,
        langues,
        formations,
      } = req.body;

      if (roleId !== undefined) {
        const roleCheck = await prisma.role.findUnique({
          where: { id: roleId },
        });
        if (roleCheck && roleCheck.name === "Super-administrateur") {
          const targetUser = await prisma.utilisateur.findUnique({
            where: { id: req.params.id },
            include: { role: true },
          });
          if (targetUser?.role?.name !== "Super-administrateur") {
            return res
              .status(403)
              .json({
                error:
                  "Action non autorisée : Impossible d'attribuer le rôle Super-administrateur.",
              });
          }
        }
      }

      const user = await prisma.utilisateur.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(roleId !== undefined && { roleId }),
          ...(profile !== undefined && { profile }),
          ...(telephone !== undefined && { telephone }),
          ...(lieuResidence !== undefined && { lieuResidence }),
          ...(experienceCle !== undefined && { experienceCle }),
          ...(langues !== undefined && { langues }),
          ...(formations !== undefined && { formations }),
          ...(status && { status, isBlocked: status === "Suspendu / Inactif" }),
        },
      });
      await logAudit(
        req.user?.id,
        "MODIFICATION_UTILISATEUR",
        user.id,
        "USER",
        `Utilisateur modifié : ${user.name}`,
      );
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
  },
);

router.delete(
  "/users/:id",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const existing = await prisma.utilisateur.findUnique({
        where: { id: req.params.id },
        include: { role: true },
      });

      if (existing?.role?.name === "Super-administrateur" || existing?.role === "Super-administrateur") {
        return res.status(403).json({ error: "Le compte Super-administrateur ne peut pas être supprimé." });
      }

      await prisma.utilisateur.delete({ where: { id: req.params.id } });
      await logAudit(
        req.user?.id,
        "SUPPRESSION_UTILISATEUR",
        req.params.id,
        "USER",
        `Utilisateur supprimé : ${existing?.name || req.params.id}`,
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  },
);

router.post(
  "/users/:id/trigger-password-reset",
  requireRoles("Super-administrateur", "Administrateur technique"),
  async (req, res) => {
    try {
      const user = await prisma.utilisateur.findUnique({
        where: { id: req.params.id },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
      }

      // Generate token
      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await prisma.utilisateur.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry,
        },
      });

      // Journal d'audit
      await logAudit(
        req.user?.id,
        "DECLENCHEMENT_REINITIALISATION_MDP",
        user.id,
        "USER",
        `Réinitialisation de mot de passe déclenchée pour : ${user.name}`
      );

      const adminFrontend = process.env.ADMIN_FRONTEND_URL || "http://localhost:5173";

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
        to: user.email,
        subject: "Réinitialisation de votre mot de passe CRM Menua",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #c99c5c;">Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.name},</p>
          <p>Un administrateur a déclenché une réinitialisation de votre mot de passe pour accéder au CRM Menua.</p>
          <p>Veuillez vous rendre sur la page de connexion et utiliser la fonction <strong>"Mot de passe oublié ?"</strong> pour créer un nouveau mot de passe de façon sécurisée via OTP.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${adminFrontend}" style="background-color: #c99c5c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder au CRM</a>
          </div>
          <p>Cordialement,<br>L'équipe Menua Consulting</p>
        </div>
        `,
      });

      res.json({ success: true, message: "Lien de réinitialisation envoyé avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors du déclenchement de la réinitialisation." });
    }
  }
);

// --- BILAN D'ACTIVITE INTERNE (Dossiers, Missions, Taches assignés et terminés) ---
router.get("/users/:id/activity-stats", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const user = await prisma.utilisateur.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
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

    // Dossiers assignés à cet interne (traitant ou targetUser)
    const dossierBaseWhere = {
      OR: [{ traitantId: id }, { targetUserId: id }],
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [dossiersAssignes, dossiersTermines] = await Promise.all([
      prisma.dossier.count({ where: dossierBaseWhere }),
      prisma.dossier.count({
        where: {
          ...dossierBaseWhere,
          status: "TERMINE",
        },
      }),
    ]);

    // Missions assignées à cet interne (assignedToId)
    const missionBaseWhere = {
      assignedToId: id,
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [missionsAssignees, missionsTerminees] = await Promise.all([
      prisma.mission.count({ where: missionBaseWhere }),
      prisma.mission.count({
        where: {
          ...missionBaseWhere,
          status: "TERMINE",
        },
      }),
    ]);

    // Tâches assignées à cet interne (assignedToId)
    const tacheBaseWhere = {
      assignedToId: id,
      status: { not: "CORBEILLE" },
      ...(hasDateFilter ? { createdAt: dateFilter } : {}),
    };

    const [tachesAssignees, tachesTerminees] = await Promise.all([
      prisma.tache.count({ where: tacheBaseWhere }),
      prisma.tache.count({
        where: {
          ...tacheBaseWhere,
          status: "TERMINE",
        },
      }),
    ]);

    res.json({
      user,
      dossiers: {
        assignes: dossiersAssignes,
        termines: dossiersTermines,
      },
      missions: {
        assignees: missionsAssignees,
        terminees: missionsTerminees,
      },
      taches: {
        assignees: tachesAssignees,
        terminees: tachesTerminees,
      },
    });
  } catch (error) {
    console.error("Erreur user activity stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- CLIENTS (Externes) ---

module.exports = router;
