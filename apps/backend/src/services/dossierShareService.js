const prisma = require("../prisma");
const { transporter } = require("../utils/mailer");
const { logAudit } = require("../utils/audit");
const { notify } = require("../utils/notify");
const { getAdminUrl } = require("../utils/urlHelper");
const { ensureClientSharingFolders } = require("./sharingFolderService");

const handleRequestClientDocuments = async (req, res) => {
    try {
      const { id } = req.params;
      const { documentTitle, instructions, deadlineDays = 7 } = req.body;

      if (!documentTitle || !documentTitle.trim()) {
        return res
          .status(400)
          .json({ error: "L'intitulé des documents sollicités est requis." });
      }

      const dossier = await prisma.dossier.findUnique({
        where: { id },
        include: {
          client: {
            include: { user: true },
          },
        },
      });

      if (!dossier) {
        return res.status(404).json({ error: "Dossier introuvable." });
      }

      const clientUser = dossier.client?.user;
      const clientEmail = dossier.client?.email || clientUser?.email;

      // S'assurer de l'existence de l'arborescence Partage documents > Sortant & Entrant
      const folders = await ensureClientSharingFolders(dossier.id);

      // Enregistrer la demande persistante dans le dossier (visible dans Action Requise côté client)
      await prisma.document.create({
        data: {
          name: documentTitle.trim(),
          url: "demande://action-requise",
          uploadedById: req.user.id,
          status: "ACTION_REQUISE",
          category: "DEMANDE",
          note: instructions?.trim() || null,
          dossierId: folders?.entrantFolder?.id || dossier.id,
          fileSize: "En attente",
        },
      });

      // 1. Notification in-app si compte utilisateur client existant
      let targetUser = clientUser;
      if (!targetUser && dossier.clientId) {
        targetUser = await prisma.utilisateur.findFirst({
          where: { clientId: dossier.clientId },
        });
      }
      if (!targetUser && clientEmail) {
        targetUser = await prisma.utilisateur.findFirst({
          where: { email: clientEmail },
        });
      }

      if (targetUser) {
        await notify(targetUser.id, {
          type: "DEMANDE_DOCUMENT",
          title: `Demande de document : ${documentTitle.trim()}`,
          message:
            instructions?.trim() ||
            `Votre conseiller MENUA CONSULTING a sollicité des pièces justificatives sur votre dossier ${dossier.reference || dossier.name}.`,
          targetId: dossier.id,
          targetType: "DOSSIER",
        });

        const io = req.app?.get("io");
        if (io) {
          io.emit("entity_updated_global", {
            entity: "DOCUMENT_DEMAND",
            action: "CREATED",
            userId: targetUser.id,
            dossierId: dossier.id,
          });
        }
      }

      // 2. Notification par email
      if (clientEmail) {
        try {
          const clientName = dossier.client?.name || "Client";
          const portalUrl = getAdminUrl(req);
          await transporter.sendMail({
            from: process.env.SMTP_FROM || "contact@menuaconsulting.com",
            to: clientEmail,
            subject: `Demande de pièces justificatives — Dossier ${dossier.reference || dossier.name} — MENUA CONSULTING`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                <h2 style="color: #141824; margin-top: 0;">MENUA CONSULTING</h2>
                <p style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Espace Client Sécurisé</p>
                <p>Bonjour <strong>${clientName}</strong>,</p>
                <p>Votre conseiller a formulé une demande de pièces justificatives pour le dossier <strong>${dossier.reference || dossier.name}</strong> :</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-weight: bold; color: #1e293b;">${documentTitle.trim()}</p>
                  ${instructions?.trim() ? `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px; font-style: italic;">« ${instructions.trim()} »</p>` : ""}
                  <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px;">Délai souhaité : sous ${deadlineDays} jours</p>
                </div>
                <p>Vous pouvez téléverser ces pièces directement dans le volet <strong>« Transmettre un document à MENUA »</strong> de votre portail sécurisé :</p>
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${portalUrl}/client/login" style="display:inline-block;padding:12px 28px;background:#c99c5c;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">
                    Accéder à mon Espace Client
                  </a>
                </div>
                <p style="color: #64748b; font-size: 12px;">Tous vos envois et réceptions sont tracés et chiffrés.</p>
              </div>
            `,
          });
        } catch (mailErr) {
          console.error("Erreur envoi email demande document client:", mailErr);
        }
      }

      await logAudit(
        req.user?.id,
        "DEMANDE_DOCUMENT_CLIENT",
        dossier.id,
        "DOSSIER",
        `Demande de documents (« ${documentTitle.trim()} ») transmise au client ${dossier.client?.name || "Client"}`,
        dossier.id,
      );

      res.json({
        success: true,
        message: "Demande de documents transmise avec succès au client.",
      });
    } catch (err) {
      console.error("Erreur demande documents client:", err);
      res
        .status(500)
        .json({ error: "Erreur lors de la transmission de la demande." });
    }
};


module.exports = {
  handleRequestClientDocuments,
};
