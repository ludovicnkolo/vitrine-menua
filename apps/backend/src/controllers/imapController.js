const { PrismaClient } = require("@prisma/client");
const crypto = require("node:crypto");
const imaps = require("imap-simple");
const simpleParser = require("mailparser").simpleParser;
const { uploadToS3 } = require("../services/s3Service");
const prisma = new PrismaClient();

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER || "menua@vitrine-menua.fr",
    password: process.env.IMAP_PASSWORD || "", // Ne jamais mettre de mot de passe en dur dans le code (CWE-259)
    host: process.env.IMAP_HOST || "mail.vitrine-menua.fr",
    port: Number.parseInt(process.env.IMAP_PORT || "993", 10),
    tls: process.env.IMAP_TLS === "true" || true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

const extractEmailData = (parsed) => {
  const subject = parsed.subject || "Sans objet";
  let nomPrenom = "Inconnu";
  let email = "inconnu@inconnu.com";

  if (parsed.from?.value?.length > 0) {
    nomPrenom =
      parsed.from.value[0].name || parsed.from.value[0].address || "Inconnu";
    email = parsed.from.value[0].address || "inconnu@inconnu.com";
  }

  if (parsed.replyTo?.value?.length > 0) {
    email = parsed.replyTo.value[0].address;
  }

  return {
    subject,
    nomPrenom,
    email,
    bodyText: parsed.text || "Aucun contenu",
    date: parsed.date || new Date(),
  };
};

/**
 * Upload les pièces jointes sur S3 et retourne leurs clés S3 (bucket/filename).
 */
const saveAttachments = async (attachments) => {
  const s3Keys = [];
  if (!attachments || attachments.length === 0) return s3Keys;

  for (const att of attachments) {
    try {
      const randomHex = crypto.randomBytes(8).toString("hex");
      const uniqueSuffix = `${Date.now()}-${randomHex}`;
      const safeName = att.filename
        ? att.filename.replace(/[^a-zA-Z0-9.-]/g, "_")
        : "piece_jointe";
      const filename = `${uniqueSuffix}-${safeName}`;
      const s3Key = `formulaires/${filename}`;
      await uploadToS3(
        att.content,
        s3Key,
        att.contentType || "application/octet-stream",
      );
      s3Keys.push(s3Key);
      console.log(`[+] Pièce jointe email uploadée sur S3 : ${s3Key}`);
    } catch (err) {
      console.error("[-] Erreur upload pièce jointe S3 :", err);
    }
  }
  return s3Keys;
};

const syncMessages = async (req, res) => {
  let connection;
  try {
    connection = await imaps.connect(imapConfig);
    await connection.openBox("INBOX");

    const lastMsg = await prisma.messagePersonnel.findFirst({
      orderBy: { receivedAt: "desc" },
    });

    let searchCriteria = ["ALL"];
    if (lastMsg?.receivedAt) {
      searchCriteria = [["SINCE", lastMsg.receivedAt]];
    }

    const fetchOptions = { bodies: [""], struct: true };
    const messages = await connection.search(searchCriteria, fetchOptions);

    let addedCount = 0;

    for (const item of messages) {
      const all = item.parts.find((p) => p.which === "");
      const uid = item.attributes.uid;
      const parsed = await simpleParser(all.body);

      const messageId = parsed.messageId || `uid-${uid}-${Date.now()}`;

      const existing = await prisma.messagePersonnel.findUnique({
        where: { messageId },
      });
      if (!existing) {
        const { subject, nomPrenom, email, bodyText, date } =
          extractEmailData(parsed);
        // Upload asynchrone sur S3
        const attachmentKeys = await saveAttachments(parsed.attachments);

        await prisma.messagePersonnel.create({
          data: {
            messageId,
            type: "PERSONNEL",
            subType: "Indéfini",
            status: "EN_ATTENTE",
            nomPrenom,
            email,
            objet: subject,
            bodyText,
            attachment:
              attachmentKeys.length > 0 ? attachmentKeys.join(",") : null,
            createdAt: date,
            receivedAt: date,
          },
        });
        addedCount++;
      }
    }

    connection.end();
    res.json({ success: true, addedCount });
  } catch (error) {
    console.error("Erreur IMAP Sync:", error);
    if (connection) connection.end();
    res.status(500).json({ error: "Erreur de synchronisation IMAP" });
  }
};

module.exports = { syncMessages, extractEmailData, saveAttachments };
