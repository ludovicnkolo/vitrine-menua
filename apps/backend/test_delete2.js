const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const dossiers = await prisma.dossier.findMany({ 
      where: { parentDossierId: null },
      include: {
        subDossiers: true,
        missions: true,
        documents: true
      },
      take: 5
    });
    console.log("Found dossiers:");
    for (const d of dossiers) {
        console.log(`ID: ${d.id}, Name: ${d.name}, subDossiers: ${d.subDossiers.length}, missions: ${d.missions.length}, documents: ${d.documents.length}`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
