/**
 * scripts/purge_and_seed_crm.js
 * 
 * Script de réinitialisation sélective du CRM MENUA :
 * 1. Conserve le Super-Administrateur et réinitialise son mot de passe à "123456@w".
 * 2. Conserve 100% des publications du CMS (offres d'emploi, articles de blog, etc.).
 * 3. Supprime tous les autres éléments (Dossiers, Missions, Tâches, Documents, Clients, Formulaires, Messages, Logs, Liens Magiques, Notifications).
 * 4. Crée automatiquement un membre interne complet pour CHAQUE rôle avec tous les champs requis et le mot de passe universel "123456@w".
 * 
 * Usage : node scripts/purge_and_seed_crm.js
 */

require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../../.env') });
require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const UNIVERSAL_PASSWORD = "123456@w";

const DEFAULT_ROLES = [
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

const ROLE_TEMPLATES = {
  'Responsable opérationnel': {
    name: 'Responsable Opérationnel',
    email: 'resp.op@menua.local',
    telephone: '+237 690 00 00 01',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '7 ans en gestion de projets financiers et audit organisationnel',
    langues: 'Français, Anglais',
    formations: 'Master Audit & Contrôle de Gestion (ESSEC / HEC)',
    profile: 'Pilotage opérationnel, cadrage de dossiers et supervision des équipes terrain.'
  },
  'Relecteur': {
    name: 'Relecteur Conformité',
    email: 'relecteur@menua.local',
    telephone: '+237 690 00 00 02',
    lieuResidence: 'Yaoundé, Cameroun',
    experienceCle: '6 ans en relecture critique, contrôle de conformité et droit des affaires',
    langues: 'Français, Anglais',
    formations: 'Master 2 Droit des Affaires & Fiscalité',
    profile: 'Revue juridique, contrôle de qualité des livrables et validation avant livraison client.'
  },
  'Collaborateur': {
    name: 'Collaborateur Opérationnel',
    email: 'collaborateur@menua.local',
    telephone: '+237 690 00 00 03',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '4 ans en comptabilité générale, tenue des livres et reporting KYC',
    langues: 'Français, Anglais',
    formations: 'Licence Pro Comptabilité & Gestion des Organisations',
    profile: 'Exécution rigoureuse des tâches, rédaction des rapports et collecte de pièces comptables.'
  },
  'Administrateur technique': {
    name: 'Administrateur Technique',
    email: 'admin.tech@menua.local',
    telephone: '+237 690 00 00 04',
    lieuResidence: 'Paris, France',
    experienceCle: '5 ans en administration système, sécurité des données et gestion cloud',
    langues: 'Français, Anglais',
    formations: 'Ingénieur en Systèmes d\'Information & Cybersécurité',
    profile: 'Maintenance de l\'infrastructure CRM, gestion des rôles et contrôle des accès techniques.'
  }
};

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🚀 DÉMARRAGE DE LA PURGE SÉLECTIVE & RE-GÉNÉRATION DU CRM MENUA');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // 1. Initialiser / Vérifier les rôles par défaut
  console.log('1️⃣  Vérification des rôles système...');
  let superAdminRole = null;
  for (const r of DEFAULT_ROLES) {
    let role = await prisma.role.findUnique({ where: { name: r.name } });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: r.name,
          description: r.description,
          permissions: JSON.stringify(r.permissions),
          status: 'Actif'
        }
      });
      console.log(`   + Rôle créé : ${role.name}`);
    }
    if (r.name === 'Super-administrateur') {
      superAdminRole = role;
    }
  }

  // 2. Trouver ou Créer le Super-Administrateur à préserver
  console.log('\n2️⃣  Localisation du Super-Administrateur...');
  let superAdmin = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { role: { name: 'Super-administrateur' } },
        { email: 'r.fouelefack@menuaconsulting.com' },
        { email: 'contact@menuaconsulting.com' },
        { email: process.env.MASTER_ADMIN_EMAIL || 'admin@menua.local' }
      ]
    },
    include: { role: true }
  });

  const hashedUniversalPassword = await bcrypt.hash(UNIVERSAL_PASSWORD, 10);

  if (!superAdmin) {
    console.log('   ⚠️  Aucun Super-Admin trouvé. Création du compte Super-Admin...');
    superAdmin = await prisma.utilisateur.create({
      data: {
        name: 'Rosette Fouelefack',
        email: 'r.fouelefack@menuaconsulting.com',
        password: hashedUniversalPassword,
        roleId: superAdminRole.id,
        telephone: '+237 690 00 00 00',
        lieuResidence: 'Douala, Cameroun',
        experienceCle: 'Direction Générale & Associée Principale - 15 ans d\'expérience',
        langues: 'Français, Anglais',
        formations: 'Expertise Comptable & Direction Financière',
        profile: 'Super-administrateur',
        status: 'Actif',
        isBlocked: false
      }
    });
    console.log(`   ✓ Super-Admin créé : ${superAdmin.name} (${superAdmin.email})`);
  } else {
    // S'assurer que son rôle est bien Super-administrateur et mot de passe à jour
    superAdmin = await prisma.utilisateur.update({
      where: { id: superAdmin.id },
      data: {
        roleId: superAdminRole.id,
        password: hashedUniversalPassword,
        status: 'Actif',
        isBlocked: false
      }
    });
    console.log(`   ✓ Super-Admin préservé : ${superAdmin.name} (${superAdmin.email})`);
    console.log(`     Mot de passe synchronisé à : ${UNIVERSAL_PASSWORD}`);
  }

  // 3. Protéger les Publications du CMS
  console.log('\n3️⃣  Sécurisation des Publications du CMS...');
  const pubCountBefore = await prisma.publication.count();
  // Rapprocher toutes les publications existantes du Super-Admin pour éviter les ruptures de clés étrangères
  await prisma.publication.updateMany({
    data: { authorId: superAdmin.id }
  });
  console.log(`   ✓ ${pubCountBefore} publication(s) CMS préservée(s) et liées au Super-Admin.`);

  // 4. Purge des données métier
  console.log('\n4️⃣  Purge des données opérationnelles (Dossiers, Missions, Tâches, Messages, etc.)...');
  
  const countLienMagique = await prisma.lienMagique.deleteMany({});
  console.log(`   ✓ Liens magiques supprimés : ${countLienMagique.count}`);

  const countNotifs = await prisma.notification.deleteMany({});
  console.log(`   ✓ Notifications supprimées : ${countNotifs.count}`);

  const countAudit = await prisma.auditLog.deleteMany({});
  console.log(`   ✓ Logs d'audit supprimés : ${countAudit.count}`);

  const countDocuments = await prisma.document.deleteMany({});
  console.log(`   ✓ Documents GED supprimés : ${countDocuments.count}`);

  const countTaches = await prisma.tache.deleteMany({});
  console.log(`   ✓ Tâches supprimées : ${countTaches.count}`);

  const countMessages = await prisma.messagePersonnel.deleteMany({});
  console.log(`   ✓ Messages personnels supprimés : ${countMessages.count}`);

  const countMissions = await prisma.mission.deleteMany({});
  console.log(`   ✓ Missions supprimées : ${countMissions.count}`);

  const countRecrutement = await prisma.formulaireRecrutement.deleteMany({});
  const countContact = await prisma.formulaireContact.deleteMany({});
  const countFormulaires = await prisma.formulaire.deleteMany({});
  console.log(`   ✓ Formulaires supprimés : ${countFormulaires.count} (Contact: ${countContact.count}, Recrutement: ${countRecrutement.count})`);

  const countDossiers = await prisma.dossier.deleteMany({});
  console.log(`   ✓ Dossiers supprimés : ${countDossiers.count}`);

  const countClientEntreprise = await prisma.clientEntreprise.deleteMany({});
  const countClients = await prisma.client.deleteMany({});
  console.log(`   ✓ Clients supprimés : ${countClients.count}`);

  // 5. Supprimer tous les utilisateurs internes SAUF le Super-Admin
  console.log('\n5️⃣  Nettoyage des anciens utilisateurs internes...');
  const countUsersDeleted = await prisma.utilisateur.deleteMany({
    where: {
      id: { not: superAdmin.id }
    }
  });
  console.log(`   ✓ Utilisateurs supprimés : ${countUsersDeleted.count}`);

  // 6. Création d'un utilisateur interne complet par rôle
  console.log('\n6️⃣  Création des utilisateurs internes avec tous les champs requis...');
  
  const allRoles = await prisma.role.findMany();
  const createdUsers = [];

  let phoneIndex = 1;
  for (const role of allRoles) {
    if (role.name === 'Super-administrateur') continue; // Déjà présent

    const template = ROLE_TEMPLATES[role.name] || {
      name: `Membre ${role.name}`,
      email: `${role.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@menua.local`,
      telephone: `+237 690 00 00 ${String(phoneIndex).padStart(2, '0')}`,
      lieuResidence: 'Douala, Cameroun',
      experienceCle: `4 ans d'expérience dans les fonctions de ${role.name}`,
      langues: 'Français, Anglais',
      formations: 'Diplôme d\'Enseignement Supérieur Spécialisé',
      profile: `Collaborateur qualifié au poste de ${role.name}`
    };

    phoneIndex++;

    const newUser = await prisma.utilisateur.create({
      data: {
        name: template.name,
        email: template.email.toLowerCase().trim(),
        password: hashedUniversalPassword,
        roleId: role.id,
        telephone: template.telephone.replace(/\s/g, ''),
        lieuResidence: template.lieuResidence,
        experienceCle: template.experienceCle,
        langues: template.langues,
        formations: template.formations,
        profile: template.profile,
        status: 'Actif',
        isBlocked: false
      }
    });

    createdUsers.push({
      role: role.name,
      name: newUser.name,
      email: newUser.email,
      telephone: template.telephone
    });

    console.log(`   + [${role.name}] ${newUser.name} (${newUser.email}) - Téléphone: ${template.telephone}`);
  }

  // 7. Vérification de l'intégrité des publications
  const pubCountAfter = await prisma.publication.count();

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 OPÉRATION TERMINÉE AVEC SUCCÈS !');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Publications CMS conservées : ${pubCountAfter} (inchangées)`);
  console.log(`🔑 Mot de passe universel défini pour tous les comptes : ${UNIVERSAL_PASSWORD}\n`);

  console.log('📋 COMPTES DISPONIBLES POUR LA CONNEXION :');
  console.log('───────────────────────────────────────────────────────────────────');
  console.log(`• Super-administrateur :`);
  console.log(`  - Nom   : ${superAdmin.name}`);
  console.log(`  - Email : ${superAdmin.email}`);
  console.log(`  - Pass  : ${UNIVERSAL_PASSWORD}`);
  console.log('───────────────────────────────────────────────────────────────────');
  for (const u of createdUsers) {
    console.log(`• ${u.role} :`);
    console.log(`  - Nom   : ${u.name}`);
    console.log(`  - Email : ${u.email}`);
    console.log(`  - Tél   : ${u.telephone}`);
    console.log(`  - Pass  : ${UNIVERSAL_PASSWORD}`);
    console.log('───────────────────────────────────────────────────────────────────');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('\n❌ Erreur pendant l\'exécution du script :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
