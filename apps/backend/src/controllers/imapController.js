const { PrismaClient } = require('@prisma/client');
const crypto = require('node:crypto');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const fs = require('node:fs');
const path = require('node:path');
const prisma = new PrismaClient();

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER || 'menua@vitrine-menua.fr',
    password: process.env.IMAP_PASSWORD || 'MotDePasseSécurisé',
    host: process.env.IMAP_HOST || 'mail.vitrine-menua.fr',
    port: Number.parseInt(process.env.IMAP_PORT || '993', 10),
    tls: process.env.IMAP_TLS === 'true' || true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

const extractEmailData = (parsed) => {
  const subject = parsed.subject || "Sans objet";
  let nomPrenom = "Inconnu";
  let email = "inconnu@inconnu.com";
  
  if (parsed.from?.value?.length > 0) {
    nomPrenom = parsed.from.value[0].name || parsed.from.value[0].address || "Inconnu";
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
    date: parsed.date || new Date() 
  };
};

const saveAttachments = (attachments) => {
  let attachmentNames = [];
  if (!attachments || attachments.length === 0) return attachmentNames;

  let destPath;
  const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
  try {
    destPath = path.join(rootPath, 'formulaires');
    fs.mkdirSync(destPath, { recursive: true });
  } catch (dirErr) {
    destPath = path.join(__dirname, '../../../../storage/formulaires');
    fs.mkdirSync(destPath, { recursive: true });
  }
  for (const att of attachments) {
    const randomHex = crypto.randomBytes(8).toString('hex');
    const uniqueSuffix = Date.now() + '-' + randomHex;
    const safeName = att.filename ? att.filename.replace(/[^a-zA-Z0-9.-]/g, '_') : 'piece_jointe';
    const savedFilename = uniqueSuffix + '-' + safeName;
    try {
      fs.writeFileSync(path.join(destPath, savedFilename), att.content);
      attachmentNames.push(savedFilename);
    } catch (fsErr) {
      console.error("Erreur de sauvegarde de la pièce jointe IMAP:", fsErr);
    }
  }
  return attachmentNames;
};

const syncMessages = async (req, res) => {
  let connection;
  try {
    connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX');
    
    const lastMsg = await prisma.messagePersonnel.findFirst({
      orderBy: { receivedAt: 'desc' }
    });
    
    let searchCriteria = ['ALL'];
    if (lastMsg && lastMsg.receivedAt) {
      searchCriteria = [['SINCE', lastMsg.receivedAt]];
    }

    const fetchOptions = { bodies: [''], struct: true };
    const messages = await connection.search(searchCriteria, fetchOptions);
    
    let addedCount = 0;
    
    for (const item of messages) {
      const all = item.parts.find(p => p.which === '');
      const uid = item.attributes.uid;
      const parsed = await simpleParser(all.body);
      
      const messageId = parsed.messageId || `uid-${uid}-${Date.now()}`;
      
      const existing = await prisma.messagePersonnel.findUnique({ where: { messageId } });
      if (!existing) {
        const { subject, nomPrenom, email, bodyText, date } = extractEmailData(parsed);
        const attachmentNames = saveAttachments(parsed.attachments);

        await prisma.messagePersonnel.create({
          data: {
            messageId,
            type: 'PERSONNEL',
            subType: 'Indéfini',
            status: 'NOUVEAU',
            nomPrenom,
            email,
            objet: subject,
            bodyText,
            attachment: attachmentNames.length > 0 ? attachmentNames.join(',') : null,
            createdAt: date,
            receivedAt: date
          }
        });
        addedCount++;
      }
    }
    
    connection.end();
    res.json({ success: true, addedCount });
  } catch (error) {
    console.error("Erreur IMAP Sync:", error);
    if (connection) connection.end();
    res.status(500).json({ error: 'Erreur de synchronisation IMAP' });
  }
};

module.exports = { syncMessages, extractEmailData, saveAttachments };
