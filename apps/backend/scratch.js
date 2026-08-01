const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.document.findMany({ take: 1 });
  if (docs.length > 0) {
    console.log("Found doc:", docs[0].id);
    try {
      await prisma.document.delete({ where: { id: docs[0].id } });
      console.log("Deleted successfully");
    } catch (e) {
      console.log("Error:", e.message);
    }
  } else {
    console.log("No docs found");
  }
}
main().finally(() => prisma.$disconnect());
