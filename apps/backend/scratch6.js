const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const dossier = await prisma.dossier.findFirst({ where: { name: 'ludovicDoc' }, include: { documents: true } });
  console.log(dossier.documents);
}
run().finally(() => process.exit(0));
