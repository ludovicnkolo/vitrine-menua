const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const master = await prisma.utilisateur.findFirst();
  const dossier = await prisma.dossier.create({
    data: {
      name: "TEST_DELETE_DOSSIER_" + Date.now(),
      createdBy: { connect: { id: master.id } }
    }
  });

  const mission = await prisma.mission.create({
    data: {
      dossierId: dossier.id,
      createdById: master.id,
      reference: "M-" + Date.now(),
      description: "Test desc"
    }
  });

  const tache = await prisma.tache.create({
    data: {
      missionId: mission.id,
      createdById: master.id,
      reference: "T-" + Date.now(),
      description: "Test desc"
    }
  });

  // Now delete logic:
  try {
    await prisma.dossier.deleteMany({
      where: { parentDossierId: dossier.id }
    });
    const d = await prisma.dossier.delete({
      where: { id: dossier.id }
    });
    console.log("Delete success!");
  } catch(e) {
    console.error("Delete failed!", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
