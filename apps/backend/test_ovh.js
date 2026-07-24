const imaps = require('imap-simple');
const imapConfig = {
  imap: {
    user: 'contact@menuaconsulting.com',
    password: 'Menua2026?consulting',
    host: 'ssl0.ovh.net',
    port: 993,
    tls: true,
    authTimeout: 5000,
    tlsOptions: { rejectUnauthorized: false }
  }
};
(async () => {
  try {
    const connection = await imaps.connect(imapConfig);
    console.log("Connecté OVH avec succès !");
    connection.end();
  } catch (err) {
    console.error("Erreur OVH :", err);
  }
})();
