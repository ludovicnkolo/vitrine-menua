const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function seedMessages() {
  await prisma.message.deleteMany({}); // clear previous

  const msgs = [
    // CONTACT
    { type: 'CONTACT', subject: 'Besoin accompagnement fiscal', fromEmail: 'j.dupont@entreprise.com', fromName: 'Jean Dupont', bodyText: 'Bonjour, j\'ai besoin d\'un accompagnement fiscal. Urgence: Chaud. Besoin: Accompagnement fiscal.', status: 'NOUVEAU', messageId: crypto.randomUUID() },
    { type: 'CONTACT', subject: 'Demande de création d\'entreprise', fromEmail: 'marie.m@startup.io', fromName: 'Marie Martin', bodyText: 'Bonjour, je souhaite créer mon entreprise. Urgence: Tiède. Besoin: Création.', status: 'TERMINE', messageId: crypto.randomUUID() },
    { type: 'CONTACT', subject: 'Consultation juridique', fromEmail: 'paul.r@business.fr', fromName: 'Paul Renard', bodyText: 'Bonjour, besoin d\'une consultation. Urgence: Froid.', status: 'NOUVEAU', messageId: crypto.randomUUID() },

    // RECRUTEMENT
    { type: 'RECRUTEMENT', subject: 'Candidature spontanée', fromEmail: 'lucie.b@gmail.com', fromName: 'Lucie Bernard', bodyText: 'Candidature. Compétences: Comptabilité générale, Paie. Langues: Français, Anglais.', status: 'NOUVEAU', messageId: crypto.randomUUID() },
    { type: 'RECRUTEMENT', subject: 'Suite entretien', fromEmail: 't.dubois@hotmail.fr', fromName: 'Thomas Dubois', bodyText: 'Entretien. Compétences: Droit des affaires. Langues: Français.', status: 'TERMINE', messageId: crypto.randomUUID() },
    { type: 'RECRUTEMENT', subject: 'Candidature Stage', fromEmail: 'sophie.l@etudiant.fr', fromName: 'Sophie Leroy', bodyText: 'Recherche stage. Compétences: Excel, Word.', status: 'NOUVEAU', messageId: crypto.randomUUID() },

    // INTERNE
    { type: 'INTERNE', subject: 'Mise à jour système', fromEmail: 'support@menua.fr', fromName: 'Support IT', bodyText: 'Une mise à jour aura lieu ce soir.', status: 'NOUVEAU', messageId: crypto.randomUUID() },
    { type: 'INTERNE', subject: 'Réunion d\'équipe', fromEmail: 'direction@menua.fr', fromName: 'Direction', bodyText: 'Réunion demain matin à 9h.', status: 'TERMINE', messageId: crypto.randomUUID() },
    { type: 'INTERNE', subject: 'Nouveau process validation', fromEmail: 'rh@menua.fr', fromName: 'Ressources Humaines', bodyText: 'Merci de prendre connaissance du nouveau process.', status: 'NOUVEAU', messageId: crypto.randomUUID() },

    // PERSONNEL
    { type: 'PERSONNEL', subject: 'Demande de congés', fromEmail: 'a.martin@menua.fr', fromName: 'Alice Martin', bodyText: 'Je souhaite poser des congés du 12 au 15.', status: 'NOUVEAU', messageId: crypto.randomUUID() },
    { type: 'PERSONNEL', subject: 'Fiche de paie Novembre', fromEmail: 'rh@menua.fr', fromName: 'Ressources Humaines', bodyText: 'Voici votre fiche de paie.', status: 'TERMINE', messageId: crypto.randomUUID() },
    { type: 'PERSONNEL', subject: 'Changement de RIB', fromEmail: 'j.dupont@menua.fr', fromName: 'Jean Dupont', bodyText: 'Veuillez trouver mon nouveau RIB.', status: 'NOUVEAU', messageId: crypto.randomUUID() },
  ];

  for (const m of msgs) {
    await prisma.message.create({ data: m });
  }

  console.log('3 messages per type have been created in the database.');
}

seedMessages().catch(console.error).finally(() => prisma.$disconnect());
