/**
 * seed_test_users.js
 * Crée 3 utilisateurs de test par rôle (sauf Super-administrateur).
 * Mot de passe par défaut : TestMenua2026!
 *
 * Usage : node seed_test_users.js
 */

require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PASSWORD = process.env.MASTER_ADMIN_PASSWORD || 'TestMenua2026!';

// Rôles à peupler (Super-administrateur exclu)
const ROLES_TO_SEED = [
  'Responsable opérationnel',
  'Relecteur',
  'Collaborateur',
  'Administrateur technique',
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
  for (const roleName of ROLES_TO_SEED) {
    if (!roleMap[roleName]) {
      console.error(`❌ Rôle introuvable en base : "${roleName}". Lance d'abord node seed_admin.js`);
      process.exit(1);
    }
  }

  // Génère les utilisateurs : 3 par rôle
  const usersToCreate = [];
  for (const roleName of ROLES_TO_SEED) {
    const slug = roleName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[éèê]/g, 'e')
      .replace(/[^a-z0-9-]/g, '');

    for (let i = 1; i <= 3; i++) {
      usersToCreate.push({
        email: `${slug}-${i}@menua.local`,
        name: `${roleName} ${i}`,
        roleId: roleMap[roleName],
        roleName,
      });
    }
  }

  // Upsert de chaque utilisateur
  for (const u of usersToCreate) {
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

  console.log(`\n=== ${usersToCreate.length} utilisateurs créés / mis à jour ===`);
  console.log('\nRécapitulatif des comptes :');
  console.log('─────────────────────────────────────────────────────────');
  for (const u of usersToCreate) {
    console.log(`  ${u.email.padEnd(42)} → ${u.roleName}`);
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
