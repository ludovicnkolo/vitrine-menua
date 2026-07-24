require('dotenv').config({ path: '/home/kratos-financials-inc/Documents/kratos/site_web/.env' });
const imaps = require('imap-simple');

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER || 'contact@menuaconsulting.com',
    password: process.env.IMAP_PASSWORD || '',
    host: process.env.IMAP_HOST || 'ssl0.ovh.net',
    port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT) : 993,
    tls: true,
    authTimeout: 5000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

(async () => {
  let connection;
  try {
    console.log("Connecting with user:", imapConfig.imap.user);
    connection = await imaps.connect(imapConfig);
    console.log("Connected. Opening INBOX...");
    await connection.openBox('INBOX');
    console.log("INBOX opened. Searching ALL...");
    const searchCriteria = ['ALL'];
    const fetchOptions = { bodies: [''], struct: true };
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log("Found", messages.length, "messages.");
    connection.end();
  } catch (error) {
    console.error("Erreur IMAP Sync:", error);
    if (connection) connection.end();
  }
})();
