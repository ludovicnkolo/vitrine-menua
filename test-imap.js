require('dotenv').config();
const imaps = require('imap-simple');

const config = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST,
        port: parseInt(process.env.IMAP_PORT || '993'),
        tls: true,
        authTimeout: 15000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

console.log(`Test de connexion IMAP avec l'utilisateur: ${config.imap.user} sur ${config.imap.host}:${config.imap.port}`);

imaps.connect(config)
    .then(connection => {
        console.log("SUCCÈS : Connexion IMAP réussie ! Les identifiants sont valides.");
        connection.end();
    })
    .catch(err => {
        console.error("ÉCHEC : La connexion a échoué.");
        console.error("Détail de l'erreur :", err.message || err);
    });
