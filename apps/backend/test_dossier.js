const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const creatorId = "MASTER-ADMIN";
    const masterUser = await prisma.utilisateur.findFirst();

    const count = await prisma.dossier.count();
    const reference = `DOS-${String(count + 1).padStart(2, '0')}`;
    const dossier = await prisma.dossier.create({
      data: {
        reference,
        name: "Test From Inbox",
        description: "Test Msg",
        priority: 'NORMAL',
        status: 'OUVERT',
        origin: "CONTACT",
        createdById: masterUser.id
      }
    });
    console.log("Success", dossier);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    prisma.$disconnect();
  }
}
test();
