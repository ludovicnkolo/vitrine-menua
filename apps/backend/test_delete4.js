const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dossiers = await prisma.dossier.findMany();
  for (const dossier of dossiers) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.dossier.deleteMany({
          where: { parentDossierId: dossier.id }
        });
        await tx.dossier.delete({
          where: { id: dossier.id }
        });
        throw new Error("ROLLBACK");
      });
    } catch (e) {
      if (e.message !== "ROLLBACK") {
        console.log(`Failed to delete dossier ${dossier.id} (${dossier.name}):`, e.message);
      }
    }
  }
  console.log("Done checking all dossiers.");
}
main().finally(() => prisma.$disconnect());
