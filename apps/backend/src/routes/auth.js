const express = require("express");
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const { authenticateJWT } = require("../middlewares/auth");
const { transporter } = require("../utils/mailer");
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
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Ce compte a été bloqué." });
    }

    let isMatch = false;
    isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Mettre à jour la date de dernière connexion
    const now = new Date();
    await prisma.utilisateur.update({
      where: { id: user.id },
      data: { lastLogin: now },
    });

    // Générer le token JWT valide pendant 12 heures
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role?.name || "SANS ROLE" },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CONNEXION_REUSSIE",
        targetId: user.id,
        targetType: "USER",
        details: "Connexion au CRM",
      },
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
          details: "Déconnexion manuelle du CRM",
        },
      });
    }
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
      where: { name: "ADMIN" },
    });
    if (!adminRole) {
      await prisma.role.create({ data: { name: "ADMIN" } });
    }

    const adminCount = await prisma.utilisateur.count({
      where: { role: { name: "ADMIN" } },
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
      where: { name: "ADMIN" },
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

    res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur reset-password-otp:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la réinitialisation du mot de passe." });
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
    });

    if (!user) {
      return res.status(404).json({ error: "Aucun compte n'est associé à cette adresse email." });
    }

    if (user.isBlocked) {
       return res.status(403).json({ error: "Ce compte a été bloqué." });
    }

    // Générer un OTP de 4 chiffres
    const resetOtp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`\n==============================================`);
    console.log(`[DEV MODE] CODE OTP POUR ${user.email} : ${resetOtp}`);
    console.log(`==============================================\n`);
    // Expiration dans 5 minutes
    const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.utilisateur.update({
      where: { id: user.id },
      data: {
        resetToken: resetOtp,
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
        details: "Demande de réinitialisation de mot de passe par OTP",
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
      to: user.email,
      subject: "Votre code OTP - CRM Menua",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #c99c5c;">Code de vérification (OTP)</h2>
          <p>Bonjour ${user.name},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe pour accéder au CRM Menua.</p>
          <p>Voici votre code de vérification à 4 chiffres :</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="background-color: #f4f4f4; border: 1px dashed #c99c5c; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${resetOtp}</span>
          </div>
          <p><strong>Ce code est valide pendant 5 minutes.</strong></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
          <p>Cordialement,<br>L'équipe Menua Consulting</p>
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
