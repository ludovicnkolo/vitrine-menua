const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const defaultUser = await prisma.utilisateur.findFirst();
    
    if (!defaultUser) {
      console.log("Aucun utilisateur trouvé. Exécutez seed_admin.js d'abord.");
      return;
    }

    const dossier = await prisma.dossier.create({
      data: { 
        name: 'Dossier Test UI', 
        description: 'Test', 
        priority: 'HAUTE', 
        status: 'OUVERT' 
      }
    });

    const mission = await prisma.mission.create({
      data: {
        description: 'Mission de Test UI',
        dossierId: dossier.id,
        createdById: defaultUser.id,
        status: 'A_ASSIGNER'
      }
    });
    
    await prisma.tache.create({
      data: {
        description: 'Test Tâche UI',
        missionId: mission.id,
        assignedToId: defaultUser.id,
        createdById: defaultUser.id,
        status: 'TO_ASSIGN'
      }
    });
    console.log("Seeded tasks successfully");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
