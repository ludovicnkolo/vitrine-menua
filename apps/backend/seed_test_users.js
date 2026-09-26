/**
 * seed_test_users.js
 * Crée 2 utilisateurs de test par rôle (y compris Super-administrateur)
 * Crée 2 clients de test.
 * Mot de passe par défaut : TestMenua2026!
 *
 * Usage : node seed_test_users.js
 */

require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PASSWORD = '1234567t';

const USERS_TO_CREATE = [
  { roleName: 'Responsable opérationnel', prefix: 'resp.op.recette' },
  { roleName: 'Relecteur', prefix: 'relecteur.recette' },
  { roleName: 'Collaborateur', prefix: 'collaborateur.recette' },
  { roleName: 'Administrateur technique', prefix: 'admin.tech.recette' },
];

async function main() {
  console.log('=== SEED UTILISATEURS DE TEST ===');
  console.log(`Mot de passe commun : ${PASSWORD}\n`);

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // Récupère tous les rôles existants
  const roles = await prisma.role.findMany();
  const roleMap = {};
  roles.forEach(r => { roleMap[r.name] = r.id; });

  // Vérifie que tous les rôles nécessaires existent
  for (const group of USERS_TO_CREATE) {
    if (!roleMap[group.roleName] && group.roleName !== 'Super-administrateur') {
      console.error(`❌ Rôle introuvable en base : "${group.roleName}". Lance d'abord node seed_admin.js`);
      process.exit(1);
    }
  }

  // Génère les utilisateurs : 2 par rôle
  const usersToCreate = [];
  for (const group of USERS_TO_CREATE) {
    const roleId = roleMap[group.roleName];
    for (let i = 1; i <= 2; i++) {
      usersToCreate.push({
        email: `${group.prefix}${i}@menua.fr`,
        name: `${group.roleName} ${i}`,
        roleId: roleId,
        roleName: group.roleName,
      });
    }
  }

  // Upsert de chaque utilisateur
  for (const u of usersToCreate) {
    if (!u.roleId) continue; // Skip if role not found
    await prisma.utilisateur.upsert({
      where: { email: u.email },
      update: {
        password: hashedPassword,
        roleId: u.roleId,
        isBlocked: false,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        roleId: u.roleId,
        telephone: '',
        lieuResidence: '',
        experienceCle: '',
        profile: '',
        isBlocked: false,
      },
    });
    console.log(`✓ [${u.roleName}] ${u.email}`);
  }

  console.log('\n=== SEED CLIENTS DE TEST ===');
  const clientsToCreate = [
    { email: 'contact@client-test-alpha.fr', name: 'CLIENT TEST ALPHA', type: 'SOCIETE', telephone: '0102030405', raisonSociale: 'ALPHA CORP' },
    { email: 'contact@client-test-beta.fr', name: 'CLIENT TEST BETA', type: 'SOCIETE', telephone: '0607080910', raisonSociale: 'BETA INC' }
  ];

  for (const c of clientsToCreate) {
    const existingClient = await prisma.client.findUnique({ where: { email: c.email } });
    if (existingClient) {
      await prisma.client.update({
        where: { email: c.email },
        data: {
          name: c.name,
          type: c.type,
          telephone: c.telephone,
          entreprise: {
            upsert: {
              create: { raisonSociale: c.raisonSociale },
              update: { raisonSociale: c.raisonSociale },
            },
          },
        },
      });
    } else {
      await prisma.client.create({
        data: {
          email: c.email,
          name: c.name,
          type: c.type,
          telephone: c.telephone,
          entreprise: {
            create: { raisonSociale: c.raisonSociale },
          },
        },
      });
    }
    console.log(`✓ [Client] ${c.name} (${c.email})`);
  }

  console.log(`\n=== ${usersToCreate.length} utilisateurs créés / mis à jour ===`);
  console.log(`=== ${clientsToCreate.length} clients créés / mis à jour ===`);
  console.log('\nRécapitulatif des comptes :');
  console.log('─────────────────────────────────────────────────────────');
  for (const u of usersToCreate) {
    console.log(`  ${u.email.padEnd(35)} → ${u.roleName}`);
  }
  console.log('─────────────────────────────────────────────────────────');
  console.log(`  Mot de passe : ${PASSWORD}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
