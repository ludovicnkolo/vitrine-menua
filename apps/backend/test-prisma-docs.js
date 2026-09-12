const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.document.count();
  console.log("Total Documents in DB:", docs);
}
main().catch(console.error).finally(() => prisma.$disconnect());
