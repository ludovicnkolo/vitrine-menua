const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
      const user = await prisma.utilisateur.findFirst();
      if (!user) throw new Error("No user found");
      
      const reference = "DOS-99";

      const created = await prisma.dossier.create({
        data: {
          reference,
          name: "Test Bug",
          description: "Desc",
          priority: 'NORMAL',
          status: 'NOUVEAU',
          origin: 'INTERNE',
          createdById: user.id,
          traitantId: user.id,
          clientId: null,
          targetUserId: null,
          parentDossierId: null,
          categorie: null
        }
      });
      console.log("Dossier created", created);
      
      await prisma.auditLog.create({ 
        data: { 
          userId: user.id, 
          action: 'CREATION_DOSSIER', 
          targetId: created.id, 
          targetType: 'DOSSIER', 
          details: `Dossier créé: ${created.name}`, 
          dossierId: created.id 
        }
      });
      console.log("Audit log created");
      
  } catch (err) {
      console.error("ERROR CAUGHT:");
      console.error(err);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
