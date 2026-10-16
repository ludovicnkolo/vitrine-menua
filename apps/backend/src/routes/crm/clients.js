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
const { getAdminUrl } = require("../../utils/urlHelper");
const { ensureClientSharingFolders } = require("../../services/sharingFolderService");
const bcrypt = require("bcryptjs");

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

const clientInclude = {
  entreprise: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      isBlocked: true,
      lastLogin: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
    },
  },
  dossiers: {
    where: { status: { notIn: ["CORBEILLE"] } },
    include: {
      documents: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      },
      liensMagiques: {
        where: {
          type: "ACQUISITION",
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  },
};

router.get("/clients", async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: clientInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour récupérer le profil et les dossiers du client connecté
router.get("/clients/me", async (req, res) => {
  try {
    let client = null;
    if (req.user?.clientId) {
      client = await prisma.client.findUnique({
        where: { id: req.user.clientId },
        include: clientInclude,
      });
    } else if (req.user?.id) {
      client = await prisma.client.findFirst({
        where: { userId: req.user.id },
        include: clientInclude,
      });
    }

    if (!client && req.user?.email) {
      client = await prisma.client.findFirst({
        where: { email: req.user.email },
        include: clientInclude,
      });
    }

    if (!client) {
      return res.status(404).json({ error: "Compte client introuvable." });
    }

    // S'assurer que le dossier principal possède bien Partage documents > Sortant & Entrant
    if (client.dossiers && client.dossiers.length > 0) {
      const rootDossier = client.dossiers.find((d) => !d.parentDossierId) || client.dossiers[0];
      await ensureClientSharingFolders(rootDossier.id);

      // Recharger pour inclure l'arborescence et tous les documents
      client = await prisma.client.findUnique({
        where: { id: client.id },
        include: clientInclude,
      });
    }

    res.json(client);
  } catch (error) {
    console.error("Erreur GET /clients/me:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/clients/:id", async (req, res) => {
  try {
    let client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: clientInclude,
    });
    if (!client) {
      return res.status(404).json({ error: "Client introuvable." });
    }

    // S'assurer que le dossier principal possède bien Partage documents > Sortant & Entrant
    if (client.dossiers && client.dossiers.length > 0) {
      const rootDossier = client.dossiers.find((d) => !d.parentDossierId) || client.dossiers[0];
      await ensureClientSharingFolders(rootDossier.id);

      // Recharger pour inclure l'arborescence et tous les documents
      client = await prisma.client.findUnique({
        where: { id: req.params.id },
        include: clientInclude,
      });
    }

    res.json(client);
  } catch (error) {
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

    const resolvedTypeStr = type !== undefined ? String(type).trim().toUpperCase() : "PARTICULIER";
    const isSociete = resolvedTypeStr === "SOCIETE" || resolvedTypeStr.includes("SOCI");
    const clientType = isSociete ? "SOCIETE" : "PARTICULIER";

    // — Vérification doublon email client (avant insertion) —
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";
    if (cleanEmail) {
      const existingByEmail = await prisma.client.findFirst({
        where: { email: cleanEmail },
        select: { id: true, name: true, email: true },
      });
      if (existingByEmail) {
        return res.status(409).json({
          error: `⚠️ L'adresse email « ${cleanEmail} » est déjà utilisée par le client « ${existingByEmail.name} ». Veuillez utiliser une adresse email différente.`,
        });
      }

      // Vérifier aussi si cet email est celui d'un membre interne
      const existingUser = await prisma.utilisateur.findFirst({
        where: { email: cleanEmail },
        select: { id: true, name: true, email: true },
      });
      if (existingUser) {
        return res.status(409).json({
          error: `⚠️ L'adresse email « ${cleanEmail} » appartient déjà à un membre interne de l'équipe (${existingUser.name}). Impossible de l'utiliser pour un client.`,
        });
      }
    }

    const client = await prisma.client.create({
      data: {
        name: name ? String(name).trim() : "",
        email: cleanEmail || "",
        telephone: telephone ? String(telephone).trim() : null,
        contactSecondaire: contactSecondaire ? String(contactSecondaire).trim() : null,
        secteurActivite: secteurActivite ? String(secteurActivite).trim() : null,
        description: description ? String(description).trim() : null,
        type: clientType,
        status: "ACTIF",
        ...(isSociete && {
          entreprise: {
            create: {
              siret: siret ? String(siret).trim() : null,
              raisonSociale: (raisonSociale && String(raisonSociale).trim()) || (name && String(name).trim()) || null,
              emailEntreprise: emailEntreprise ? String(emailEntreprise).trim() : null,
              telephoneEntreprise: telephoneEntreprise ? String(telephoneEntreprise).trim() : null,
            },
          },
        }),
      },
      include: clientInclude,
    });



    await logAudit(
      req.user?.id,
      "CREATION_CLIENT",
      client.id,
      "CLIENT",
      `Client créé : ${client.name} (${client.type})`,
    );

    const freshClient = await prisma.client.findUnique({
      where: { id: client.id },
      include: clientInclude,
    });

    res.status(201).json(freshClient || client);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      const targets = Array.isArray(error.meta?.target) ? error.meta.target : ["email"];
      const fieldLabel = targets.includes("email") ? "adresse email" : targets.join(", ");
      return res.status(409).json({
        error: `⚠️ Un client avec cette ${fieldLabel} existe déjà dans le système. Veuillez vérifier les données saisies.`,
      });
    }
    res.status(500).json({
      error: "Impossible de créer le client. Vérifiez les données saisies et réessayez.",
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

    const resolvedTypeStr = type !== undefined 
      ? String(type).trim().toUpperCase() 
      : (existingClient.type || "PARTICULIER").toUpperCase();
    const isSociete = resolvedTypeStr === "SOCIETE" || resolvedTypeStr.includes("SOCI");
    const finalType = isSociete ? "SOCIETE" : "PARTICULIER";

    let entrepriseUpdate = undefined;
    if (isSociete) {
      entrepriseUpdate = {
        upsert: {
          create: {
            siret: siret ? String(siret).trim() : null,
            raisonSociale: (raisonSociale && String(raisonSociale).trim()) || (name && String(name).trim()) || existingClient.name || null,
            emailEntreprise: emailEntreprise ? String(emailEntreprise).trim() : null,
            telephoneEntreprise: telephoneEntreprise ? String(telephoneEntreprise).trim() : null,
          },
          update: {
            ...(siret !== undefined && { siret: siret ? String(siret).trim() : null }),
            ...(raisonSociale !== undefined && { raisonSociale: (raisonSociale && String(raisonSociale).trim()) || (name && String(name).trim()) || null }),
            ...(emailEntreprise !== undefined && { emailEntreprise: emailEntreprise ? String(emailEntreprise).trim() : null }),
            ...(telephoneEntreprise !== undefined && { telephoneEntreprise: telephoneEntreprise ? String(telephoneEntreprise).trim() : null }),
          },
        },
      };
    } else {
      // Si le client est passé en PARTICULIER, supprimer les données d'entreprise
      if (existingClient.entreprise) {
        await prisma.clientEntreprise.deleteMany({
          where: { clientId: req.params.id },
        });
      }
    }

    const prevStatusUpper = String(existingClient.status || "ACTIF").toUpperCase();
    const newStatusUpper = status !== undefined ? String(status).trim().toUpperCase() : prevStatusUpper;

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(email !== undefined && { email: String(email).trim() }),
        ...(telephone !== undefined && { telephone: telephone ? String(telephone).trim() : null }),
        ...(contactSecondaire !== undefined && { contactSecondaire: contactSecondaire ? String(contactSecondaire).trim() : null }),
        ...(secteurActivite !== undefined && { secteurActivite: secteurActivite ? String(secteurActivite).trim() : null }),
        ...(description !== undefined && { description: description ? String(description).trim() : null }),
        type: finalType,
        ...(status !== undefined && { status: newStatusUpper }),
        ...(entrepriseUpdate && { entreprise: entrepriseUpdate }),
      },
      include: clientInclude,
    });

    // Si le statut a changé vers INACTIF ou retour à ACTIF, répercuter en cascade sur les dossiers/missions/tâches
    if (newStatusUpper !== prevStatusUpper) {
      const { cascadeBlockClient, cascadeUnblockClient } = require("../../utils/statusCascade");
      if (newStatusUpper === "INACTIF" || newStatusUpper === "BLOQUE") {
        await cascadeBlockClient(client.id);
      } else if (newStatusUpper === "ACTIF" && (prevStatusUpper === "INACTIF" || prevStatusUpper === "BLOQUE")) {
        await cascadeUnblockClient(client.id);
      }
    }

    const clientAuditAction =
      newStatusUpper === "INACTIF" || newStatusUpper === "BLOQUE" ? "BLOCAGE_CLIENT" : "MODIFICATION_CLIENT";
    await logAudit(
      req.user?.id,
      clientAuditAction,
      client.id,
      "CLIENT",
      `Client ${newStatusUpper === "INACTIF" ? "désactivé" : "modifié"} : ${client.name}`,
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

// ─── GESTION DES COMPTES CLIENTS PORTAIL ──────────────────────────────────────

// 1. Convertir un client en compte utilisateur portail
router.post(
  "/clients/:id/convert-to-account",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id },
        include: { entreprise: true, user: true },
      });

      if (!client) {
        return res.status(404).json({ error: "Client introuvable." });
      }

      if (client.user) {
        return res.status(400).json({
          error: "Ce client dispose déjà d'un compte utilisateur portail actif.",
          user: client.user,
        });
      }

      const isSociete = client.type === "SOCIETE" || client.type === "Société";
      const targetEmail = (
        req.body.email ||
        client.email ||
        client.entreprise?.emailEntreprise ||
        ""
      ).trim().toLowerCase();

      const targetName = (
        req.body.name ||
        (isSociete ? (client.entreprise?.raisonSociale || client.name) : client.name) ||
        ""
      ).trim();

      if (!targetEmail) {
        return res.status(400).json({
          error: "Une adresse email valide est requise pour initialiser le compte client.",
        });
      }

      // Vérifier si un utilisateur existe déjà avec cet email
      const existingUser = await prisma.utilisateur.findUnique({
        where: { email: targetEmail },
      });

      if (existingUser) {
        if (existingUser.clientId && existingUser.clientId !== client.id) {
          return res.status(400).json({
            error: "Cette adresse email est déjà liée à un autre compte client.",
          });
        }
        if (!existingUser.clientId) {
          const updatedUser = await prisma.utilisateur.update({
            where: { id: existingUser.id },
            data: { clientId: client.id },
            include: { role: true },
          });
          await logAudit(
            req.user?.id,
            "LIAISON_COMPTE_CLIENT",
            client.id,
            "CLIENT",
            `Compte existant (${targetEmail}) relié au client ${client.name}`,
          );
          return res.json({
            success: true,
            message: "Compte utilisateur existant rattaché avec succès au client.",
            user: updatedUser,
          });
        }
      }

      // S'assurer que le rôle 'Client' existe
      let clientRole = await prisma.role.findFirst({
        where: { name: "Client" },
      });
      if (!clientRole) {
        clientRole = await prisma.role.create({
          data: {
            name: "Client",
            description: "Accès portail client externe. Dépôt et consultation des documents.",
            status: "Actif",
            permissions: JSON.stringify(["PORTAIL_CLIENT_VIEW", "PORTAIL_CLIENT_UPLOAD"]),
          },
        });
      }

      // Générer le jeton d'invitation (48h)
      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 48 * 3600 * 1000);
      const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

      const newUser = await prisma.utilisateur.create({
        data: {
          email: targetEmail,
          name: targetName || client.name || "Client",
          password: tempPassword,
          roleId: clientRole.id,
          clientId: client.id,
          resetToken: token,
          resetTokenExpiry,
          status: "Invitation envoyée",
          isBlocked: false,
        },
        include: { role: true },
      });

      await logAudit(
        req.user?.id,
        "CREATION_COMPTE_CLIENT",
        client.id,
        "CLIENT",
        `Compte client portail créé pour ${client.name} (${targetEmail})`,
      );

      // Envoi de l'email d'invitation avec instructions et lien sécurisé
      let emailSent = false;
      let emailError = null;
      try {
        const adminFrontend = getAdminUrl(req);
        const activationLink = `${adminFrontend}/setup-password?token=${token}`;

        console.log(`[INVITATION CLIENT] Envoi email d'activation à : ${targetEmail}`);
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
          to: targetEmail,
          subject: "Activation de votre Espace Client Sécurisé — MENUA CONSULTING",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #141824; font-size: 22px; margin: 0; letter-spacing: 0.5px;">MENUA CONSULTING</h1>
                <p style="color: #c99c5c; font-size: 13px; font-weight: bold; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase;">Portail Client Sécurisé</p>
              </div>
              <p style="color: #334155; font-size: 15px;">Bonjour <strong>${targetName || client.name}</strong>,</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                Votre compte client a été créé sur la plateforme sécurisée de <strong>MENUA CONSULTING</strong>.
                Cet espace dédié vous permet d'accéder à vos documents, de déposer vos justificatifs en toute sécurité et de suivre la restitution de vos livrables.
              </p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                Pour activer votre compte et choisir votre mot de passe d'accès en toute autonomie, cliquez sur le bouton ci-dessous :
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${activationLink}" style="display:inline-block;padding:12px 30px;background:#141824;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  Activer mon compte client
                </a>
              </div>
              <div style="background-color: #f8fafc; border-left: 4px solid #c99c5c; padding: 12px 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <p style="color: #475569; font-size: 13px; margin: 0;">
                  <strong>Note de sécurité :</strong> Ce lien d'activation est strictement personnel et expire dans <strong>48 heures</strong>. L'équipe MENUA ne vous demandera jamais votre mot de passe.
                </p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; word-break: break-all;">
                Si le bouton ne s'affiche pas correctement, copiez ce lien dans votre navigateur :<br/>
                <a href="${activationLink}" style="color: #2563eb;">${activationLink}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
              <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
                MENUA CONSULTING &bull; Service Relations Clients &bull; Plateforme Sécurisée
              </p>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[INVITATION CLIENT] Email envoyé avec succès à : ${targetEmail}`);
      } catch (mailErr) {
        emailError = mailErr.message;
        console.error(`[INVITATION CLIENT] Erreur envoi email à ${targetEmail}:`, mailErr.message);
      }

      return res.status(201).json({
        success: true,
        message: emailSent
          ? `Compte client créé. L'invitation a été envoyée à ${targetEmail}.`
          : `Compte client créé mais l'email n'a pas pu être envoyé à ${targetEmail}. Utilisez "Renvoyer l'invitation" pour réessayer.`,
        emailSent,
        emailDestination: targetEmail,
        emailError: emailError || undefined,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          status: newUser.status,
          isBlocked: newUser.isBlocked,
          createdAt: newUser.createdAt,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error("Erreur convert-to-account:", err);
      return res.status(500).json({ error: "Erreur lors de la création du compte client." });
    }
  },
);

// 2. Renvoyer l'invitation d'activation au client
router.post(
  "/clients/:id/resend-invitation",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!client || !client.user) {
        return res.status(404).json({ error: "Compte client introuvable." });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 48 * 3600 * 1000);

      const updatedUser = await prisma.utilisateur.update({
        where: { id: client.user.id },
        data: {
          resetToken: token,
          resetTokenExpiry,
          status: "Invitation envoyée",
        },
        include: { role: true },
      });

      await logAudit(
        req.user?.id,
        "RENVOI_INVITATION_CLIENT",
        client.id,
        "CLIENT",
        `Nouvelle invitation envoyée à ${client.user.email}`,
      );

      let emailSent = false;
      let emailError = null;
      try {
        const adminFrontend = getAdminUrl(req);
        const activationLink = `${adminFrontend}/setup-password?token=${token}`;

        console.log(`[RENVOI INVITATION] Envoi email à : ${client.user.email}`);
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
          to: client.user.email,
          subject: "Nouvelle invitation — Activation de votre Espace Client MENUA CONSULTING",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #141824; margin-top: 0;">MENUA CONSULTING</h2>
              <p>Bonjour <strong>${client.user.name}</strong>,</p>
              <p>Une nouvelle invitation d'activation de votre espace client vient de vous être adressée.</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${activationLink}" style="display:inline-block;padding:12px 28px;background:#141824;color:#ffffff;text-decoration:none;border-radius:4px;font-weight:bold;">
                  Activer mon compte client
                </a>
              </div>
              <p style="color: #64748b; font-size: 0.9em;">Ce lien est valable 48 heures.</p>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[RENVOI INVITATION] Email envoyé avec succès à : ${client.user.email}`);
      } catch (mailErr) {
        emailError = mailErr.message;
        console.error(`[RENVOI INVITATION] Erreur envoi email à ${client.user.email}:`, mailErr.message);
      }

      res.json({
        success: true,
        message: emailSent
          ? `Nouvelle invitation envoyée à ${client.user.email}.`
          : `Invitation régénérée mais l'email n'a pas pu être envoyé à ${client.user.email}. Vérifiez la configuration SMTP.`,
        emailSent,
        emailDestination: client.user.email,
        emailError: emailError || undefined,
        user: updatedUser,
      });
    } catch (err) {
      console.error("Erreur renvoi invitation:", err);
      res.status(500).json({ error: "Erreur lors du renvoi de l'invitation." });
    }
  },
);

// 3. Réinitialisation administrative du mot de passe (Mme Fouelefack : sans que l'admin ne lise le mot de passe)
router.post(
  "/clients/:id/reset-account-password",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!client || !client.user) {
        return res.status(404).json({ error: "Compte client introuvable." });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 3600 * 1000);
      const erasedPassword = "RESET_PENDING_" + crypto.randomBytes(32).toString("hex");

      await prisma.utilisateur.update({
        where: { id: client.user.id },
        data: {
          password: erasedPassword,
          resetToken: token,
          resetTokenExpiry,
        },
      });

      // Déconnexion immédiate du client concerné via WebSocket
      const io = req.app.get("io");
      if (io) {
        io.emit("force_logout", { userId: client.user.id });
      }

      await logAudit(
        req.user?.id,
        "REINITIALISATION_MDP_ADMIN",
        client.id,
        "CLIENT",
        `Réinitialisation administrative du mot de passe déclenchée pour ${client.user.email} (mot de passe supprimé, déconnexion forcée)`,
      );

      const adminFrontend = getAdminUrl(req);
      const resetLink = `${adminFrontend}/setup-password?token=${token}`;

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
          to: client.user.email,
          subject: "Réinitialisation de votre mot de passe — MENUA CONSULTING",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #141824; margin-top: 0;">MENUA CONSULTING</h2>
              <p>Bonjour <strong>${client.user.name}</strong>,</p>
              <p>Une demande de réinitialisation de votre mot de passe a été initiée par votre gestionnaire MENUA CONSULTING. Par mesure de sécurité, votre session en cours a été fermée et votre ancien mot de passe a été supprimé.</p>
              <p>Pour définir un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:#141824;color:#ffffff;text-decoration:none;border-radius:4px;font-weight:bold;">
                  Définir un nouveau mot de passe
                </a>
              </div>
              <p style="color: #64748b; font-size: 0.85em;">Ce lien est valable pendant 24 heures. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Erreur email reset:", mailErr);
      }

      res.json({
        success: true,
        message: "Compte client déconnecté, mot de passe supprimé et lien sécurisé de réinitialisation envoyé avec succès.",
      });
    } catch (err) {
      console.error("Erreur reset password:", err);
      res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe." });
    }
  },
);

// 4. Activer / Désactiver le compte client (suspension immédiate)
router.patch(
  "/clients/:id/toggle-account-status",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!client || !client.user) {
        return res.status(404).json({ error: "Compte client introuvable." });
      }

      const newIsBlocked = !client.user.isBlocked;
      const newStatus = newIsBlocked ? "Suspendu / Inactif" : (client.user.lastLogin ? "Actif" : "Invitation envoyée");
      const newClientStatus = newIsBlocked ? "INACTIF" : "ACTIF";

      const updatedUser = await prisma.utilisateur.update({
        where: { id: client.user.id },
        data: {
          isBlocked: newIsBlocked,
          status: newStatus,
        },
        include: { role: true },
      });

      // Synchroniser le statut du client et appliquer la cascade
      await prisma.client.update({
        where: { id: client.id },
        data: { status: newClientStatus },
      });

      const { cascadeBlockClient, cascadeUnblockClient } = require("../../utils/statusCascade");
      if (newIsBlocked) {
        await cascadeBlockClient(client.id);
      } else {
        await cascadeUnblockClient(client.id);
      }

      await logAudit(
        req.user?.id,
        newIsBlocked ? "DESACTIVATION_COMPTE_CLIENT" : "REACTIVATION_COMPTE_CLIENT",
        client.id,
        "CLIENT",
        `Compte client ${newIsBlocked ? "désactivé" : "réactivé"} : ${client.user.email}`,
      );

      res.json({
        success: true,
        message: newIsBlocked ? "Compte client désactivé. Dossiers bloqués en cascade." : "Compte client réactivé. Dossiers restaurés.",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Erreur toggle status:", err);
      res.status(500).json({ error: "Erreur lors du changement de statut." });
    }
  },
);

// Route directe pour basculer le statut Actif / Inactif du client avec cascade
router.post(
  "/clients/:id/toggle-status",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const client = await prisma.client.findUnique({
        where: { id },
        include: clientInclude,
      });

      if (!client) {
        return res.status(404).json({ error: "Client introuvable." });
      }

      const isCurrentlyActive = String(client.status || "ACTIF").toUpperCase() === "ACTIF";
      const newStatus = isCurrentlyActive ? "INACTIF" : "ACTIF";

      const updatedClient = await prisma.client.update({
        where: { id },
        data: { status: newStatus },
        include: clientInclude,
      });

      const { cascadeBlockClient, cascadeUnblockClient } = require("../../utils/statusCascade");
      if (newStatus === "INACTIF") {
        await cascadeBlockClient(id);
      } else {
        await cascadeUnblockClient(id);
      }

      await logAudit(
        req.user?.id,
        newStatus === "INACTIF" ? "DESACTIVATION_CLIENT" : "REACTIVATION_CLIENT",
        client.id,
        "CLIENT",
        `Statut du client ${client.name} passé à ${newStatus}`,
      );

      res.json({
        success: true,
        message: newStatus === "INACTIF"
          ? `Le client « ${client.name} » est maintenant inactif. Tous ses dossiers sont bloqués.`
          : `Le client « ${client.name} » a été réactivé. Ses dossiers ont été restaurés.`,
        client: updatedClient,
      });
    } catch (err) {
      console.error("Erreur toggle client status:", err);
      res.status(500).json({ error: "Erreur lors du changement de statut du client." });
    }
  },
);

router.patch(
  "/clients/:id/toggle-status",
  requireRoles("Super-administrateur", "Responsable opérationnel"),
  async (req, res, next) => {
    req.method = "POST";
    return router.handle(req, res, next);
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
