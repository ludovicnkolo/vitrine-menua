const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const msgs = await prisma.messagePersonnel.findMany({});
  console.log("Messages in DB:", msgs);
  
  const forms = await prisma.formulaire.findMany({});
  console.log("Formulaires in DB:", forms);
}
main().catch(console.error).finally(() => prisma.$disconnect());
