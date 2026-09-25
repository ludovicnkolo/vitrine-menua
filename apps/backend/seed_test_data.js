require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const defaultPassword = await bcrypt.hash("1234567t", 10);
    const roles = await prisma.role.findMany();

    console.log("Generating 2 test users per role...");
    
    for (const role of roles) {
        // Règle stricte: Il ne peut y avoir qu'un seul Super-administrateur (celui créé par seed_admin.js)
        if (role.name === 'Super-administrateur') {
            console.log("Skipping Super-administrateur (Only one allowed).");
            continue;
        }

        // Role name normalized for email
        const roleKey = role.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        for (let i = 1; i <= 2; i++) {
            const email = `test_${roleKey}_${i}@test.com`;
            const user = await prisma.utilisateur.findUnique({ where: { email } });
            
            if (!user) {
                await prisma.utilisateur.create({
                    data: {
                        name: `Test ${role.name} ${i}`,
                        email,
                        password: defaultPassword,
                        roleId: role.id
                    }
                });
                console.log(`Created user: ${email}`);
            } else {
                console.log(`User already exists: ${email}`);
            }
        }
    }

    console.log("Generating 3 test clients...");
    for (let i = 1; i <= 3; i++) {
        const clientEmail = `client_${i}@test.com`;
        const client = await prisma.client.findUnique({ where: { email: clientEmail } });
        
        if (!client) {
            await prisma.client.create({
                data: {
                    type: i % 2 === 0 ? "PARTICULIER" : "ENTREPRISE",
                    name: `Client Test ${i}`,
                    email: clientEmail,
                    telephone: `+3360000000${i}`
                }
            });
            console.log(`Created client: ${clientEmail}`);
        } else {
            console.log(`Client already exists: ${clientEmail}`);
        }
    }
    
    console.log("Test data generation completed.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
