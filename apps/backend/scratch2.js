const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.document.findMany();
  console.log("Total docs in DB:", docs.length);
  docs.slice(-5).forEach(d => console.log(d.id, d.name, d.createdAt));
}
main().finally(() => prisma.$disconnect());
