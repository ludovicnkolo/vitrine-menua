const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const tasks = await prisma.task.findMany({
      include: { dossier: true, assignedTo: true, createdBy: true }
    });
    console.log("Tasks length:", tasks.length);
    console.log("Tasks sample:", JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
