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
        idCardUrl: true,
        isBlocked: true,
        lastLogin: true,
        createdAt: true,
        telephone: true,
        lieuResidence: true,
        experienceCle: true,
        langues: true,
        missionsAssigned: { select: { status: true } },
      },
    });

    const mappedUsers = users.map(u => {
      const missionsAssigned = u.missionsAssigned || [];
      const missionsTerminees = missionsAssigned.filter(m => m.status === "TERMINE").length;
      const missionsEnCours = missionsAssigned.filter(m => m.status !== "TERMINE" && m.status !== "ANNULEE" && m.status !== "CORBEILLE").length;
      delete u.missionsAssigned;
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
        idCardUrl,
        telephone,
        lieuResidence,
        experienceCle,
        langues,
      } = req.body;
      const bcrypt = require("bcryptjs");
      const crypto = require("node:crypto");

      if (!name || !email) {
        return res
          .status(400)
          .json({ error: "Le nom et l'email sont obligatoires." });
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

      // Statut par défaut : Inactif (isBlocked=true) sauf si l'admin choisit explicitement Actif au moment de la création
      const isBlockedDefault = status === "Actif" ? false : true;

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
          profile: profile || "",
          idCardUrl: idCardUrl || null,
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
        const adminFrontend =
          process.env.ADMIN_FRONTEND_URL || "http://localhost:5173";
        const setupUrl = `${adminFrontend}/setup-password?token=${token}`;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
          to: email,
          subject: "Création de votre compte Menua Consulting",
          html: `
          <h3>Bienvenue ${name},</h3>
          <p>Un compte collaborateur a été créé pour vous sur l'espace Menua Consulting.</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour configurer votre mot de passe :</p>
          <a href="${setupUrl}" style="display:inline-block;padding:10px 20px;background:#141824;color:#fff;text-decoration:none;border-radius:4px;">Créer mon mot de passe</a>
          <p>Ce lien est valable 24 heures.</p>
          <p style="color:#666;font-size:0.85em;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : ${setupUrl}</p>
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
        idCardUrl,
        telephone,
        lieuResidence,
        experienceCle,
        langues,
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
          ...(idCardUrl !== undefined && { idCardUrl }),
          ...(status && { isBlocked: status === "Inactif" }),
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
      });
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

// --- CLIENTS (Externes) ---

module.exports = router;
