const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allDossiers = await prisma.dossier.findMany({
    select: { id: true, name: true, parentDossierId: true, reference: true }
  });
  
  const buildTree = (parentId) => {
    return allDossiers
      .filter(d => d.parentDossierId === parentId)
      .map(d => ({
        ...d,
        subDossiers: buildTree(d.id)
      }));
  };
  
  const parentId = "a01a5cfe-2d6a-4332-b4d4-78b4ce1ac11a"; // ID from db_export.json
  const rootDossier = allDossiers.find(d => d.id === parentId);
  rootDossier.subDossiers = buildTree(rootDossier.id);
  console.log(JSON.stringify(rootDossier, null, 2));
}
main();
