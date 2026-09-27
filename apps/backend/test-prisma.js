const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const allMissions = await prisma.mission.findMany({
    where: {
      status: { notIn: ['TERMINE', 'ANNULEE'] },
      echeance: { lte: twentyFourHoursFromNow }
    },
    select: { id: true, echeance: true, createdAt: true, status: true }
  });
  console.log("All critical missions:", allMissions);
}
main().catch(console.error).finally(() => prisma.$disconnect());
