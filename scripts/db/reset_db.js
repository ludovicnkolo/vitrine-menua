/**
 * reset_db.js — Vide la base de données et recrée le Super Admin + les rôles par défaut.
 * Usage : node reset_db.js
 * 
 * ATTENTION : Ce script supprime TOUTES les données existantes.
 */

require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const ROLES_DEFAULT = [
  {
    name: 'Super-administrateur',
    description: 'Contrôle total du système. Gère les collaborateurs, les rôles, les dossiers et les paramètres globaux sans restriction.',
    permissions: [
      'MESSAGES_VIEW', 'MESSAGES_PROCESS', 'DOSSIERS_MANAGE', 'TACHES_MANAGE',
      'TACHES_VIEW_ALL', 'TACHES_VALIDATE', 'TACHES_VIEW_ASSIGNED', 'TACHES_EDIT_ASSIGNED',
      'CLIENTS_MANAGE', 'USERS_MANAGE', 'ROLES_MANAGE'
    ]
  },
  {
    name: 'Responsable opérationnel',
    description: "Pilote le flux métier quotidien. Peut gérer les clients, créer et assigner des missions, suivre l'évolution, mais n'a pas accès aux paramètres du système.",
    permissions: [
      'MESSAGES_VIEW', 'MESSAGES_PROCESS', 'DOSSIERS_MANAGE', 'TACHES_MANAGE',
      'TACHES_VIEW_ALL', 'CLIENTS_MANAGE'
    ]
  },
  {
    name: 'Relecteur',
    description: "Vérifie la qualité et la conformité. Ne peut que consulter l'ensemble des tâches finalisées pour les valider ou les rejeter.",
    permissions: ['TACHES_VIEW_ALL', 'TACHES_VALIDATE']
  },
  {
    name: 'Collaborateur',
    description: 'Expert terrain cloisonné. Ne peut voir et modifier que les tâches spécifiques qui lui ont été affectées.',
    permissions: ['TACHES_VIEW_ASSIGNED', 'TACHES_EDIT_ASSIGNED']
  },
  {
    name: 'Administrateur technique',
    description: 'Gestion informatique. Gère uniquement la création des utilisateurs et des rôles, sans accès au contenu métier.',
    permissions: ['USERS_MANAGE', 'ROLES_MANAGE']
  }
];

async function reset() {
  console.log('\n🗑️  Suppression de toutes les données...\n');

  // Ordre impératif : d'abord les feuilles, puis les racines
  if (prisma.document) await prisma.document.deleteMany({});
  console.log('  ✓ Documents supprimés');

  if (prisma.auditLog) await prisma.auditLog.deleteMany({});
  console.log('  ✓ AuditLogs supprimés');

  if (prisma.tache) await prisma.tache.deleteMany({});
  console.log('  ✓ Tâches supprimées');

  if (prisma.messagePersonnel) await prisma.messagePersonnel.deleteMany({});
  console.log('  ✓ MessagePersonnels supprimés');

  if (prisma.notification) await prisma.notification.deleteMany({}).catch(() => {});
  console.log('  ✓ Notifications supprimées');

  if (prisma.lienMagique) await prisma.lienMagique.deleteMany({}).catch(() => {});
  console.log('  ✓ Liens magiques supprimés');

  if (prisma.publication) await prisma.publication.deleteMany({}).catch(() => {});
  console.log('  ✓ Publications CMS supprimées');

  if (prisma.mission) await prisma.mission.deleteMany({});
  console.log('  ✓ Missions supprimées');

  if (prisma.formulaireRecrutement) await prisma.formulaireRecrutement.deleteMany({});
  if (prisma.formulaireContact) await prisma.formulaireContact.deleteMany({});
  if (prisma.formulaire) await prisma.formulaire.deleteMany({});
  console.log('  ✓ Formulaires supprimés');

  if (prisma.dossier) await prisma.dossier.deleteMany({});
  console.log('  ✓ Dossiers supprimés');

  if (prisma.clientEntreprise) await prisma.clientEntreprise.deleteMany({});
  if (prisma.client) await prisma.client.deleteMany({});
  console.log('  ✓ Clients supprimés');

  if (prisma.poleActivite) await prisma.poleActivite.deleteMany({}).catch(() => {});
  console.log('  ✓ Pôles d\'activité supprimés');

  if (prisma.utilisateur) await prisma.utilisateur.deleteMany({});
  console.log('  ✓ Utilisateurs supprimés');

  if (prisma.role) await prisma.role.deleteMany({});
  console.log('  ✓ Rôles supprimés');

  console.log('\n✅ Base de données vidée.\n');
}

const POLES_DEFAULT = [
  { name: 'Finance & Comptabilité', description: 'Gestion financière, trésorerie et comptabilité agile' },
  { name: 'Assurance & Prévoyance', description: 'Souscription, gestion des contrats et sinistres' },
  { name: 'Gestion de Patrimoine (CGP)', description: 'Conseil en investissement et ingénierie patrimoniale' },
  { name: 'Juridique & Conformité', description: 'Audit réglementaire, conformité ACPR/AMF et contrats' },
  { name: 'Direction Générale', description: 'Pilotage stratégique et gouvernance' }
];

async function seed() {
  console.log('🌱 Création des rôles par défaut...\n');

  let adminRole = null;
  for (const r of ROLES_DEFAULT) {
    const role = await prisma.role.create({
      data: {
        name: r.name,
        description: r.description,
        permissions: JSON.stringify(r.permissions)
      }
    });
    console.log(`  ✓ Rôle créé : ${role.name}`);
    if (r.name === 'Super-administrateur') {
      adminRole = role;
    }
  }

  console.log('\n🌱 Création des pôles d\'activité par défaut...\n');
  for (const p of POLES_DEFAULT) {
    try {
      await prisma.poleActivite.create({ data: p });
      console.log(`  ✓ Pôle créé : ${p.name}`);
    } catch (err) {
      console.log(`  - Pôle déjà présent : ${p.name}`);
    }
  }

  console.log('\n👤 Création du Super Administrateur...\n');

  const adminEmail    = process.env.MASTER_ADMIN_EMAIL    || 'r.fouelefack@menuaconsulting.com';
  const adminPass     = process.env.MASTER_ADMIN_PASSWORD || 'Menua2026?consulting';
  const adminName     = process.env.MASTER_ADMIN_NAME     || 'Rosette Fouelefack';
  const adminPhone    = process.env.MASTER_ADMIN_PHONE    || '+33659207511';
  const adminResidence= process.env.MASTER_ADMIN_RESIDENCE|| 'Paris, France';
  const adminExp      = process.env.MASTER_ADMIN_EXPERIENCE|| 'Back & Middle Office Agile, Conformité et gestion des risques patrimoniaux';
  const adminProfile  = process.env.MASTER_ADMIN_PROFILE  || 'Directrice de Menua Consulting, experte en finance, risques et conformité.';

  const hashedPassword = await bcrypt.hash(adminPass, 10);

  const admin = await prisma.utilisateur.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      telephone: adminPhone,
      lieuResidence: adminResidence,
      experienceCle: adminExp,
      profile: adminProfile,
      langues: 'Français',
      status: 'Actif',
      poleActivite: 'Direction Générale',
      fonction: 'Directrice Générale',
      roleId: adminRole.id
    }
  });

  console.log(`  ✓ Super Admin créé :`);
  console.log(`    - Email    : ${admin.email}`);
  console.log(`    - Nom      : ${admin.name}`);
  console.log(`    - Rôle     : ${adminRole.name}`);
  console.log(`    - Statut   : ${admin.status}`);
  console.log(`    - Mot de passe (clair) : ${adminPass}\n`);
  console.log('🎉 Initialisation terminée avec succès.\n');
}

async function main() {
  await reset();
  await seed();
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('\n❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
