const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });

async function resetDB() {
  const masterEmail = process.env.MASTER_ADMIN_EMAIL;
  console.log("Master email is:", masterEmail);

  // Delete all records in a logical order to respect foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.formulaireRecrutement.deleteMany();
  await prisma.formulaireContact.deleteMany();
  await prisma.formulaire.deleteMany();
  
  await prisma.tache.deleteMany();
  await prisma.document.deleteMany();
  await prisma.messagePersonnel.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.dossier.deleteMany();
  
  await prisma.clientEntreprise.deleteMany();
  await prisma.client.deleteMany();

  // Delete all users except master
  const deleteUsers = await prisma.utilisateur.deleteMany({
    where: {
      NOT: {
        email: masterEmail
      }
    }
  });
  console.log(`Deleted ${deleteUsers.count} users.`);

  // Do not delete Roles, they are needed by the system
  console.log("Database reset complete.");
}

resetDB().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
