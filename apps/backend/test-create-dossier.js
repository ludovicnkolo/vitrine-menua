const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const req = { user: { id: "master-admin-id", role: "Super-administrateur" }, body: { name: "Test Dossier" } };
  try {
      // Simulate dossier creation
      const user = await prisma.utilisateur.findFirst();
      if (!user) throw new Error("No user found");
      const d = await prisma.dossier.create({
        data: {
          name: "Test",
          createdById: user.id
        }
      });
      console.log("Dossier created", d);
  } catch (err) {
      console.error(err);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
