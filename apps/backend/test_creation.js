const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function test() {
  try {
    const hashedPassword = await bcrypt.hash('Menua@2026', 10);
    const user = await prisma.utilisateur.create({
      data: {
        name: "Test User",
        email: "test_user_x@example.com",
        password: hashedPassword,
        roleId: null,
        telephone: "123",
        lieuResidence: "Paris",
        experienceCle: "None",
        langues: "FR",
        profile: "",
        idCardUrl: null,
        isBlocked: false
      }
    });
    console.log("USER OK:", user.id);
  } catch(e) {
    console.error("USER ERROR:", e.message);
  }

  try {
    const client = await prisma.client.create({
      data: {
        name: "Test Client",
        email: "test_client_x@example.com",
        telephone: null,
        contactSecondaire: null,
        secteurActivite: null,
        description: null,
        type: 'PARTICULIER',
        status: 'ACTIF'
      }
    });
    console.log("CLIENT OK:", client.id);
  } catch(e) {
    console.error("CLIENT ERROR:", e.message);
  }
}
test();
