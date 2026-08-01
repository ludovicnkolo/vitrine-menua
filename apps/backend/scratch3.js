const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dossier = await prisma.dossier.findFirst({
    where: { name: 'ludovicDoc' },
    include: { documents: true }
  });
  console.log("Dossier:", dossier);
}
main().finally(() => prisma.$disconnect());
