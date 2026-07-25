require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST || 'ssl0.ovh.net',
    port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function main() {
  console.log("Connexion au serveur IMAP...");
  let connection;
  try {
    connection = await imaps.connect(config);
  } catch (e) {
    console.error("Erreur connexion IMAP:", e);
    return;
  }
  
  await connection.openBox('INBOX');
  
  const searchCriteria = ['ALL'];
  const fetchOptions = { bodies: [''], struct: true };
  
  const messages = await connection.search(searchCriteria, fetchOptions);
  
  const messagesToProcess = messages;
  console.log(`Traitement de ${messagesToProcess.length} messages...`);
  
  for (const item of messagesToProcess) {
    const all = item.parts.find(p => p.which === '');
    const uid = item.attributes.uid;
    
    const parsed = await simpleParser(all.body);
    
    const messageId = parsed.messageId || `uid-${uid}-${Date.now()}`;
    const subject = parsed.subject || "Sans objet";
    let nomPrenom = "Inconnu";
    let email = "inconnu@inconnu.com";
    
    if (parsed.from && parsed.from.value && parsed.from.value.length > 0) {
      nomPrenom = parsed.from.value[0].name || parsed.from.value[0].address || "Inconnu";
      email = parsed.from.value[0].address || "inconnu@inconnu.com";
    }
    
    // Si c'est un mail envoyé par le site "MENUA CONSULTING <contact@menuaconsulting.com>", on peut extraire le vrai reply-to si dispo
    if (parsed.replyTo && parsed.replyTo.value && parsed.replyTo.value.length > 0) {
      email = parsed.replyTo.value[0].address;
    }
    
    const bodyText = parsed.text || "Aucun contenu";
    const date = parsed.date || new Date();
    
    // -- EXTRACTION DES PIECES JOINTES --
    let savedAttachmentName = null;
    if (parsed.attachments && parsed.attachments.length > 0) {
      const att = parsed.attachments[0]; // On prend la 1ère pièce jointe
      const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
      let destPath = path.join(rootPath, 'formulaires');
      
      try {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        const safeName = (att.filename || 'piece_jointe.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
        savedAttachmentName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + safeName;
        
        fs.writeFileSync(path.join(destPath, savedAttachmentName), att.content);
        console.log(`[+] Pièce jointe sauvegardée : ${savedAttachmentName}`);
      } catch (err) {
        console.error("[-] Erreur lors de la sauvegarde de la pièce jointe :", err);
      }
    }

    const existing = await prisma.messagePersonnel.findUnique({
      where: { messageId }
    });
    
    if (!existing) {
      await prisma.messagePersonnel.create({
        data: {
          messageId,
          type: 'PERSONNEL',
          status: 'NOUVEAU',
          nomPrenom,
          email,
          objet: subject,
          bodyText,
          attachment: savedAttachmentName,
          createdAt: date,
          receivedAt: date
        }
      });
      console.log(`[+] Enregistré en base : ${subject}`);
    } else {
      console.log(`[-] Déjà existant (ignoré) : ${subject}`);
    }
  }
  
  connection.end();
  console.log("--- Opération terminée ---");
}

main().catch(console.error);
