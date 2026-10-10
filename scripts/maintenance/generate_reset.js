const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  const email = "r.fouelefack@menuaconsulting.com";
  const user = await prisma.utilisateur.findUnique({ where: { email } });
  if (!user) {
    console.log("User not found!");
    return;
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000);
  await prisma.utilisateur.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry }
  });
  console.log("Link generated:");
  console.log(`http://localhost:5173/setup-password?token=${resetToken}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
