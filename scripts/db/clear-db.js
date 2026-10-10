const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données (conservation Utilisateurs, Roles et Clients)...");
  
  await prisma.auditLog.deleteMany({});
  await prisma.document.deleteMany({});
  
  await prisma.formulaireRecrutement.deleteMany({});
  await prisma.formulaireContact.deleteMany({});
  await prisma.formulaire.deleteMany({});
  
  await prisma.messagePersonnel.deleteMany({});
  await prisma.lienMagique.deleteMany({});
  
  await prisma.tache.deleteMany({});
  await prisma.mission.deleteMany({});
  await prisma.dossier.deleteMany({});
  
  await prisma.publication.deleteMany({});
  
  console.log("Nettoyage terminé avec succès !");
}
main().catch(console.error).finally(() => prisma.$disconnect());
