const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const dossiers = await prisma.dossier.findMany({ take: 1, orderBy: { createdAt: 'desc' } });
    if (dossiers.length === 0) return console.log('No dossiers');
    
    const id = dossiers[0].id;
    console.log('Trying to delete', id);
    
    await prisma.dossier.delete({ where: { id } });
    console.log('Success');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
