const prisma = require('./src/prisma');
async function run() {
  const msgs = await prisma.messagePersonnel.findMany({ where: { bodyText: { contains: "test d'envoi de fichier" } }, select: { attachment: true } });
  console.log(msgs.map(m => m.attachment));
}
run();
