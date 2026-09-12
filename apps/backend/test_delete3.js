const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = '28a2ea76-486f-400e-9fcf-a2bff290f626'; // DOSSIER TEST01
  try {
    await prisma.dossier.deleteMany({
      where: { parentDossierId: id }
    });
    const dossier = await prisma.dossier.delete({
      where: { id: id }
    });
    console.log("Deleted:", dossier.name);
  } catch (e) {
    console.error('Error deleting:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
