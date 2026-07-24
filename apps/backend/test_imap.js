const imaps = require('imap-simple');

const imapConfig = {
  imap: {
    user: 'ludovicnkolo01@gmail.com',
    password: 'zcom xrcq yqum kngx',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 5000,
    tlsOptions: { rejectUnauthorized: false }
  }
};

(async () => {
  try {
    const connection = await imaps.connect(imapConfig);
    console.log("Connecté avec succès !");
    connection.end();
  } catch (err) {
    console.error("Erreur :", err);
  }
})();
