const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prisma = new PrismaClient();

const IMAP_CONFIG = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST || 'imap.ovh.net',
    port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

class ImapService {
  /**
   * Se connecte à la boîte mail publique et récupère les nouveaux messages.
   */
  static async fetchNewEmails() {
    let connection;
    try {
      console.log('🔄 Tentative de connexion au serveur IMAP (Boîte Publique)...');
      connection = await imaps.connect(IMAP_CONFIG);
      await connection.openBox('INBOX');

      // On cherche les emails non lus (UNSEEN)
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: true };
      
      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log(`📥 ${messages.length} nouvel(s) email(s) trouvé(s).`);

      for (const item of messages) {
        const allInfo = item.parts.find(part => part.which === '');
        const idHeader = item.parts.find(part => part.which === 'HEADER');
        
        // Parse du contenu du mail
        const parsedMail = await simpleParser(allInfo.body);
        
        const randomMsgHex = crypto.randomBytes(4).toString('hex');
        const messageId = parsedMail.messageId || `msg_${Date.now()}_${randomMsgHex}`;
        const fromEmail = parsedMail.from?.value[0]?.address || 'inconnu@domaine.com';
        const fromName = parsedMail.from?.value[0]?.name || fromEmail;
        const subject = parsedMail.subject || 'Sans objet';
        const bodyText = parsedMail.text || '';
        const bodyHtml = parsedMail.html || '';
        
        // -- EXTRACTION DES PIECES JOINTES --
        let savedAttachmentName = null;
        if (parsedMail.attachments && parsedMail.attachments.length > 0) {
          const att = parsedMail.attachments[0];
          const rootPath = process.env.DOCUMENTS_STORAGE_PATH || '/var/menua/documents';
          let destPath = path.join(rootPath, 'formulaires');
          try {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            const safeName = (att.filename || 'piece_jointe.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
            const randomAttHex = crypto.randomBytes(8).toString('hex');
            savedAttachmentName = Date.now() + '-' + randomAttHex + '-' + safeName;
            fs.writeFileSync(path.join(destPath, savedAttachmentName), att.content);
            console.log(`[+] Pièce jointe extraite : ${savedAttachmentName}`);
          } catch (err) {
            console.error("[-] Erreur extraction pièce jointe :", err);
          }
        }

        // 1. Déduplication : Est-ce qu'on l'a déjà stocké ?
        const existingMessage = await prisma.message.findUnique({
          where: { messageId }
        });

        if (existingMessage) {
          console.log(`⚠️ Email ignoré (Déjà stocké) : ${subject}`);
          continue;
        }

        // 2. Identification : L'expéditeur est-il un Client connu ?
        const existingClient = await prisma.client.findUnique({
          where: { email: fromEmail }
        });

        // 3. Sauvegarde en BDD
        const newMessage = await prisma.message.create({
          data: {
            messageId,
            subject,
            bodyText,
            bodyHtml,
            fromEmail,
            fromName,
            attachment: savedAttachmentName,
            isAnonyme: !existingClient,
            clientId: existingClient ? existingClient.id : null,
            status: 'NOUVEAU', // Statut initial demandé par l'admin
          }
        });

        console.log(`✅ Nouvel email enregistré : [${subject}] de ${fromEmail} ${existingClient ? '(Client Reconnu)' : '(Anonyme)'}`);
      }

      connection.end();
      console.log('🏁 Synchronisation IMAP terminée avec succès.');

    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation IMAP :', error);
      if (connection) connection.end();
    }
  }

  /**
   * Lance le "Cron Job" qui écoute la boîte mail toutes les 2 minutes
   */
  static startSyncJob() {
    console.log('⏰ Démarrage du Job de synchronisation Email (Toutes les 2 minutes)...');
    setInterval(async () => {
      await this.fetchNewEmails();
    }, 2 * 60 * 1000); // 2 minutes
  }
}

module.exports = ImapService;
