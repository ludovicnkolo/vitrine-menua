const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tasks = await prisma.task.findMany({ include: { dossier: true } });
  console.log("Tasks length:", tasks.length);
  console.log(JSON.stringify(tasks, null, 2));
}
check();
