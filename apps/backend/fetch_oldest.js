const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imapConfig = {
  imap: {
    user: 'contact@menuaconsulting.com',
    password: 'Menua2026?consulting',
    host: 'ssl0.ovh.net',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function main() {
  console.log("Connexion au serveur IMAP...");
  let connection;
  try {
    connection = await imaps.connect(imapConfig);
  } catch (e) {
    console.error("Erreur connexion IMAP:", e);
    return;
  }
  
  await connection.openBox('INBOX');
  const searchCriteria = ['ALL'];
  const fetchOptions = { bodies: [''], struct: true };
  const messages = await connection.search(searchCriteria, fetchOptions);
  
  // Les 5 plus anciens
  const oldest = messages.slice(0, 5);
  console.log(`Récupération des ${oldest.length} plus anciens messages...`);
  
  for (const item of oldest) {
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
    
    if (parsed.replyTo && parsed.replyTo.value && parsed.replyTo.value.length > 0) {
      email = parsed.replyTo.value[0].address;
    }
    
    const bodyText = parsed.text || "Aucun contenu";
    const date = parsed.date || new Date();
    
    const existing = await prisma.messagePersonnel.findUnique({ where: { messageId } });
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

main().catch(console.error).finally(() => prisma.$disconnect());
