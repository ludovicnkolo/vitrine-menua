const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDatabase() {
  try {
    console.log('Début de l\'exportation de la base de données...');

    // Récupérer toutes les données de tous les modèles
    const data = {
      roles: await prisma.role.findMany(),
      utilisateurs: await prisma.utilisateur.findMany(),
      clients: await prisma.client.findMany(),
      clientEntreprises: await prisma.clientEntreprise.findMany(),
      formulaires: await prisma.formulaire.findMany(),
      formulaireRecrutements: await prisma.formulaireRecrutement.findMany(),
      formulaireContacts: await prisma.formulaireContact.findMany(),
      dossiers: await prisma.dossier.findMany(),
      missions: await prisma.mission.findMany(),
      taches: await prisma.tache.findMany(),
      documents: await prisma.document.findMany(),
      auditLogs: await prisma.auditLog.findMany(),
      messagePersonnels: await prisma.messagePersonnel.findMany(),
    };

    const filePath = path.join(__dirname, 'db_export.json');

    // Écrire les données dans le fichier JSON (cela écrase automatiquement l'ancien fichier s'il existe)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`L'état de la base de données a été sauvegardé avec succès dans : ${filePath}`);
  } catch (error) {
    console.error('Erreur lors de l\'exportation de la base de données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = exportDatabase;
