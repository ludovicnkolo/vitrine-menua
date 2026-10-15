const express = require("express");
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const { authenticateJWT } = require("../middlewares/auth");
const { transporter } = require("../utils/mailer");
const { getAdminUrl } = require("../utils/urlHelper");
const crypto = require("crypto");

// Route de connexion (Login)
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    email = email.trim();

    // Utilisateur maître (Bypass direct de secours)
    const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL;
    const MASTER_PASS = process.env.MASTER_ADMIN_PASSWORD;

    if (email === MASTER_EMAIL && password === MASTER_PASS) {
      let realUserId = "MASTER-ADMIN";
      const dbMaster = await prisma.utilisateur.findUnique({
        where: { email: MASTER_EMAIL },
      });
      if (dbMaster) {
        realUserId = dbMaster.id;
        await prisma.utilisateur.update({
          where: { id: realUserId },
          data: { lastLogin: new Date() },
        });
      }

      const token = jwt.sign(
        { id: realUserId, email: MASTER_EMAIL, role: "Super-administrateur" },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      await prisma.auditLog.create({
        data: {
          userId: realUserId !== "MASTER-ADMIN" ? realUserId : null,
          action: "CONNEXION_REUSSIE",
          targetId: realUserId,
          targetType: "USER",
          details: `Connexion Master-Admin réussie`,
        },
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        token,
        user: {
          id: realUserId,
          name: process.env.MASTER_ADMIN_NAME || "Super Administrateur",
          email: MASTER_EMAIL,
          role: "Super-administrateur",
          profile: process.env.MASTER_ADMIN_PROFILE || "Master",
        },
      });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: { role: true, client: true },
    });

    if (!user) {
      await prisma.auditLog.create({
        data: {
          action: "ECHEC_CONNEXION",
          targetType: "AUTH",
          details: `Tentative de connexion avec email inconnu : ${email}`,
        },
      });
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Si l'utilisateur est un client (ou rattaché à un client) : interdire la connexion si le client est inactif
    if (user.clientId || user.role?.name === "Client" || user.client) {
      let client = user.client;
      if (!client && user.clientId) {
        client = await prisma.client.findUnique({ where: { id: user.clientId } });
      }
      if (client) {
        const clientStatus = String(client.status || "").trim().toUpperCase();
        if (clientStatus === "INACTIF" || clientStatus === "BLOQUE") {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "ECHEC_CONNEXION_CLIENT_INACTIF",
              targetId: client.id,
              targetType: "CLIENT",
              details: `Tentative de connexion refusée : le client ${client.name} (${client.email}) est au statut inactif.`,
            },
          });
          return res.status(403).json({
            error: "Votre compte client est actuellement inactif. Veuillez contacter votre administrateur MENUA CONSULTING.",
          });
        }
      }
    }

    if (user.isBlocked) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ECHEC_CONNEXION",
          targetId: user.id,
          targetType: "USER",
          details: `Tentative de connexion sur un compte bloqué : ${user.email}`,
        },
      });
      return res.status(403).json({ error: "Ce compte a été bloqué." });
    }

    // Blocage si le mot de passe a été supprimé par l'administrateur
    if (user.password && user.password.startsWith("RESET_PENDING")) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ECHEC_CONNEXION_MDP_REINITIALISE",
          targetId: user.id,
          targetType: "USER",
          details: `Tentative de connexion refusée : mot de passe réinitialisé par un administrateur (${user.email})`,
        },
      });
      return res.status(403).json({
        error: "Votre mot de passe a été réinitialisé par un administrateur. Vous ne pouvez plus vous connecter avec votre ancien mot de passe. Veuillez consulter vos e-mails pour définir un nouveau mot de passe via le lien sécurisé reçu.",
      });
    }

    if (user.status === "Invitation envoyée") {
      return res.status(403).json({
        error: "Ce compte n'a pas encore été activé. Veuillez utiliser le lien d'invitation reçu par e-mail pour configurer votre mot de passe.",
      });
    }

    let isMatch = false;
    isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ECHEC_CONNEXION",
          targetId: user.id,
          targetType: "USER",
          details: `Mot de passe erroné pour ${user.email}`,
        },
      });
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Mettre à jour la date de dernière connexion
    const now = new Date();
    await prisma.utilisateur.update({
      where: { id: user.id },
      data: { lastLogin: now },
    });

    // Générer le token JWT valide pendant 7 jours
    const sessionSig = user.password ? user.password.substring(user.password.length - 10) : "";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role?.name || "SANS ROLE", clientId: user.clientId || null, sessionSig },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CONNEXION_REUSSIE",
        targetId: user.id,
        targetType: "USER",
        details: `Connexion au CRM`,
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name || "SANS ROLE",
        profile: user.profile,
        clientId: user.clientId || null,
        lastLogin: now,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Route de vérification de session (Ping sécurité — retourne le rôle réel depuis la BD)

// Route de déconnexion (Logout)
router.post("/logout", authenticateJWT, async (req, res) => {
  try {
    if (req.user.id && req.user.id !== "MASTER-ADMIN") {
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: "DECONNEXION",
          targetId: req.user.id,
          targetType: "USER",
          details: `Déconnexion manuelle du CRM`,
        },
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    res.json({ success: true });
  } catch (e) {
    console.error("Erreur logout:", e);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/verify", authenticateJWT, async (req, res) => {
  try {
    // Master-Admin n'est pas en BD
    if (req.user.id === "MASTER-ADMIN") {
      return res.json({ success: true, user: req.user, roleChanged: false });
    }

    const dbUser = await prisma.utilisateur.findUnique({
      where: { id: req.user.id },
      include: { role: true },
    });

    if (!dbUser) {
      return res
        .status(401)
        .json({ error: "Utilisateur introuvable.", action: "FORCE_LOGOUT" });
    }
    if (dbUser.isBlocked) {
      return res
        .status(401)
        .json({ error: "Compte désactivé.", action: "FORCE_LOGOUT" });
    }

    if (dbUser.password && dbUser.password.startsWith("RESET_PENDING")) {
      return res
        .status(401)
        .json({ error: "Votre mot de passe a été réinitialisé par un administrateur.", action: "FORCE_LOGOUT" });
    }

    const currentRole = dbUser.role?.name || "SANS ROLE";
    const tokenRole = req.user.role;
    const roleChanged = currentRole !== tokenRole;

    res.json({
      success: true,
      user: req.user,
      currentRole,
      roleChanged,
    });
  } catch (e) {
    console.error("/verify error:", e);
    res.status(500).json({ error: "Erreur vérification." });
  }
});

// Route utilitaire pour créer le premier admin s'il n'y en a aucun (Très utile pour l'initialisation)
router.post("/setup", async (req, res) => {
  try {
    const adminRole = await prisma.role.findUnique({
      where: { name: "Super-administrateur" },
    });
    if (!adminRole) {
      await prisma.role.create({ data: { name: "Super-administrateur" } });
    }

    const adminCount = await prisma.utilisateur.count({
      where: { role: { name: "Super-administrateur" } },
    });
    if (adminCount > 0) {
      return res.status(403).json({ error: "Le système est déjà initialisé." });
    }

    if (!process.env.MASTER_ADMIN_PASSWORD) {
      return res
        .status(500)
        .json({
          error:
            "MASTER_ADMIN_PASSWORD doit être défini dans les variables d'environnement.",
        });
    }
    const defaultEmail = process.env.MASTER_ADMIN_EMAIL || "admin@menua.local";
    const defaultPass = process.env.MASTER_ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(defaultPass, 10);
    const roleRecord = await prisma.role.findUnique({
      where: { name: "Super-administrateur" },
    });
    const user = await prisma.utilisateur.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: "Super Administrateur",
        roleId: roleRecord.id,
      },
    });

    // [SECURITY] Never return passwords in API responses
    res.json({
      success: true,
      message:
        "Administrateur créé avec succès. Utilisez le mot de passe configuré dans MASTER_ADMIN_PASSWORD pour vous connecter.",
      email: user.email,
    });
  } catch (error) {
    console.error("Erreur lors du setup administrateur:", error);
    res.status(500).json({ error: "Erreur lors de l'initialisation." });
  }
});

router.post("/reset-password-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP et nouveau mot de passe requis." });
    }

    const user = await prisma.utilisateur.findFirst({
      where: {
        email: email.trim(),
        resetToken: otp,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "L'OTP est invalide ou a expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        status: user.status === "Invitation envoyée" || user.status === "Activation en attente" ? "Actif" : user.status,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REINITIALISATION_MDP_SUCCES",
        targetId: user.id,
        targetType: "USER",
        details: `Mot de passe réinitialisé via code OTP pour ${user.email}`,
      },
    });

    res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur reset-password-otp:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la réinitialisation du mot de passe." });
  }
});

// Route "Vérification du contexte du token (activation initiale vs réinitialisation)"
router.get("/verify-token", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ valid: false, error: "Token manquant." });
  }
  try {
    const user = await prisma.utilisateur.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        clientId: true,
        role: { select: { name: true } },
      },
    });

    if (!user) {
      return res.status(200).json({
        valid: false,
        expired: true,
        error: "Ce lien est invalide ou a expiré.",
      });
    }

    // Vérifier si le client rattaché est inactif
    if (user.clientId) {
      const client = await prisma.client.findUnique({ where: { id: user.clientId } });
      if (client && String(client.status || "").trim().toUpperCase() === "INACTIF") {
        return res.status(200).json({
          valid: false,
          error: "Ce compte client est actuellement inactif. Veuillez contacter un administrateur.",
        });
      }
    }

    // Détecter le contexte : activation initiale vs réinitialisation
    const isClient = !!user.clientId;
    const isFirstActivation = user.status === "Invitation envoyée";

    return res.json({
      valid: true,
      context: isFirstActivation ? "activation" : "reset",
      isClient,
      userName: user.name,
      userEmail: user.email,
      roleName: user.role?.name || null,
    });
  } catch (err) {
    console.error("Erreur verify-token:", err);
    return res.status(500).json({ valid: false, error: "Erreur serveur." });
  }
});

// Route "Activation de compte / Configuration initiale du mot de passe via invitation"
router.post("/setup-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Jeton d'activation et mot de passe requis." });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit comporter au moins 8 caractères." });
    }

    const user = await prisma.utilisateur.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      await prisma.auditLog.create({
        data: {
          action: "ECHEC_ACTIVATION_COMPTE",
          targetType: "AUTH",
          details: `Tentative d'activation avec token invalide ou expiré`,
        },
      });
      return res.status(400).json({
        error: "Le lien d'activation est invalide ou a expiré (validité 24h). Veuillez contacter un administrateur pour recevoir une nouvelle invitation.",
      });
    }

    // Si client inactif, interdire la configuration du mot de passe
    if (user.clientId) {
      const client = await prisma.client.findUnique({ where: { id: user.clientId } });
      if (client && String(client.status || "").trim().toUpperCase() === "INACTIF") {
        return res.status(403).json({
          error: "Ce compte client est inactif. Impossible d'activer le mot de passe.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        status: "Actif",
        isBlocked: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ACTIVATION_COMPTE",
        targetId: user.id,
        targetType: "USER",
        details: `Compte activé et mot de passe initialisé pour ${user.email}`,
      },
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    const isClient = !!user.clientId;

    res.json({
      success: true,
      isClient,
      userEmail: user.email,
      message: "Votre mot de passe a été configuré avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur setup-password:", error);
    res.status(500).json({ error: "Erreur lors de la configuration du mot de passe." });
  }
});


// Route "Mot de passe oublié ?"
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "L'adresse email est requise." });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { email: email.trim() },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Aucun compte n'est associé à cette adresse email." });
    }

    if (user.isBlocked) {
       return res.status(403).json({ error: "Ce compte a été bloqué." });
    }

    // Le clic sur "mot de passe oublié" ne doit pas fonctionner si le mot de passe a été supprimé par l'admin
    if (user.password && user.password.startsWith("RESET_PENDING")) {
      return res.status(400).json({
        error: "Ce compte n'a pas de mot de passe actif. Une réinitialisation a déjà été initiée par votre administrateur : vous devez obligatoirement utiliser le lien sécurisé envoyé par e-mail pour définir votre mot de passe.",
      });
    }

    if (user.status === "Invitation envoyée") {
      return res.status(400).json({
        error: "Ce compte n'a pas encore de mot de passe configuré. Veuillez utiliser le lien d'invitation sécurisé reçu par e-mail pour activer votre compte.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry,
      },
    });

    // Journal d'audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "DEMANDE_REINITIALISATION_MDP",
        targetId: user.id,
        targetType: "USER",
        details: "Demande de réinitialisation de mot de passe par lien unique",
      },
    });

    const baseUrl = getAdminUrl(req);
    const resetLink = `${baseUrl}/setup-password?token=${resetToken}`;

    const isClient = !!user.clientId || user.role?.name === "Client";
    const portalName = isClient ? "votre Espace Client MENUA CONSULTING" : "le CRM MENUA CONSULTING";
    const mailSubject = isClient
      ? "Réinitialisation de votre mot de passe — Espace Client MENUA CONSULTING"
      : "Réinitialisation de votre mot de passe — MENUA CONSULTING";

    const mailOptions = {
      from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
      to: user.email,
      subject: mailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #141824; font-size: 20px; margin: 0;">MENUA CONSULTING</h1>
            <p style="color: ${isClient ? "#c99c5c" : "#2563eb"}; font-size: 12px; font-weight: bold; margin-top: 4px; text-transform: uppercase;">
              ${isClient ? "Portail Client Sécurisé" : "Portail CRM Collaborateur"}
            </p>
          </div>
          <h2 style="color: #141824; font-size: 16px;">Réinitialisation de votre mot de passe</h2>
          <p style="color: #334155; font-size: 14px;">Bonjour <strong>${user.name}</strong>,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Vous avez demandé à réinitialiser votre mot de passe pour accéder à <strong>${portalName}</strong>.
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Veuillez cliquer sur le lien sécurisé ci-dessous pour choisir votre nouveau mot de passe :
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" style="background-color: ${isClient ? "#c99c5c" : "#141824"}; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
              Définir mon nouveau mot de passe
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px;"><strong>Ce lien sécurisé est valable pendant 15 minutes.</strong></p>
          <p style="color: #64748b; font-size: 12px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">MENUA CONSULTING — Cabinet de conseil juridique et financier</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'e-mail OTP (SMTP incorrect) :", emailError.message);
      // On ne bloque pas le flux si l'e-mail échoue en local (le code est dans la console)
    }

    res.json({ success: true, message: "Si la messagerie est configurée, un code OTP de réinitialisation a été envoyé." });
  } catch (error) {
    console.error("Erreur forgot-password:", error);
    res.status(500).json({ error: "Erreur lors de la demande de réinitialisation : " + error.message });
  }
});

module.exports = router;
