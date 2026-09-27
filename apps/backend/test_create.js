const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const count = await prisma.dossier.count();
    const reference = `DOS-${String(count + 1).padStart(2, '0')}`;
    console.log("Count is", count, "Reference is", reference);
    const dossier = await prisma.dossier.create({
      data: {
        reference,
        name: "Test Dossier",
        description: "Test",
        priority: "NORMAL",
        status: "NOUVEAU",
        origin: "INTERNE",
      }
    });
    console.log("Success", dossier);
  } catch (error) {
    console.error("Failed:", error.message);
  } finally {
    prisma.$disconnect();
  }
}
test();
