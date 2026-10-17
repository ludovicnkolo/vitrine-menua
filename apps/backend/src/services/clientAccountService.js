const prisma = require("../prisma");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const { transporter } = require("../utils/mailer");
const { logAudit } = require("../utils/audit");
const { getAdminUrl } = require("../utils/urlHelper");
const { ensureClientSharingFolders } = require("./sharingFolderService");

// 1. Convertir un client en compte utilisateur portail
const handleConvertToAccount = async (req, res) => {
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
};


// 2. Renvoyer l'invitation d'accès avec nouveau mot de passe / token
const handleResendInvitation = async (req, res) => {
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
};


// 3. Réinitialiser et générer un nouveau mot de passe temporaire
const handleResetAccountPassword = async (req, res) => {
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
};

// 4. Activer / Désactiver le compte client (suspension immédiate)
const handleToggleAccountStatus = async (req, res) => {
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

      const { cascadeBlockClient, cascadeUnblockClient } = require("../utils/statusCascade");
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
};

module.exports = {


  handleConvertToAccount,
  handleResendInvitation,
  handleResetAccountPassword,
  handleToggleAccountStatus,
};
