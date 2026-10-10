const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const pubs = await prisma.publication.findMany({ select: { id: true, title: true }});
  console.log(pubs);
}
main().finally(() => prisma.$disconnect());
