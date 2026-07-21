const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const defaultUser = await prisma.user.findFirst();
    const dossier = await prisma.dossier.create({
      data: { name: 'Dossier Test UI', description: 'Test', priority: 'HAUTE', status: 'OUVERT' }
    });
    
    await prisma.task.create({
      data: {
        description: 'Test Tâche UI',
        dossierId: dossier.id,
        assignedToId: defaultUser ? defaultUser.id : null,
        createdById: defaultUser ? defaultUser.id : 'temp-id',
        status: 'NEW'
      }
    });
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
