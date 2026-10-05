/**
 * scripts/purge_and_seed_crm.js
 * 
 * Script de réinitialisation sélective du CRM MENUA :
 * 1. Conserve le Super-Administrateur et réinitialise son mot de passe à "123456@w".
 * 2. Conserve 100% des publications du CMS (offres d'emploi, articles de blog, etc.).
 * 3. Supprime tous les autres éléments (Dossiers, Missions, Tâches, Documents, Clients, Formulaires, Messages, Logs, Liens Magiques, Notifications).
 * 4. Crée exactement 2 membres internes par rôle opérationnel (2 Collaborateurs, 2 Relecteurs, 2 Techniciens, 2 Responsables Opérationnels)
 *    avec le numéro APRÈS leur nom (ex: "Collaborateur 1", "Collaborateur 2"), tous les champs requis remplis, et le mot de passe "123456@w".
 * 
 * Usage local  : node scripts/purge_and_seed_crm.js  (ou: npm run purge-crm)
 * Usage Docker : docker exec -it menua_backend node scripts/purge_and_seed_crm.js
 */

require('dotenv').config();
require('dotenv').config({ path: require('node:path').resolve(__dirname, '../.env') });
require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../../.env') });

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

// Configuration des 2 membres par rôle opérationnel avec numéro APRÈS le nom
const MEMBERS_TO_SEED = [
  // ─── 2 RESPONSABLES OPÉRATIONNELS ───
  {
    roleName: 'Responsable opérationnel',
    name: 'Responsable Opérationnel 1',
    email: 'resp.op1@menua.local',
    telephone: '+237 690 00 00 01',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '8 ans en direction de projets financiers, cadrage stratégique et audit organisationnel',
    langues: 'Français, Anglais',
    formations: 'Master 2 Audit & Contrôle de Gestion (ESSEC / HEC)',
    profile: 'Supervision des missions, cadrage des dossiers clients et pilotage opérationnel.'
  },
  {
    roleName: 'Responsable opérationnel',
    name: 'Responsable Opérationnel 2',
    email: 'resp.op2@menua.local',
    telephone: '+237 690 00 00 02',
    lieuResidence: 'Yaoundé, Cameroun',
    experienceCle: '6 ans en coordination opérationnelle, affectation des tâches et gestion de portefeuille',
    langues: 'Français, Anglais',
    formations: 'Master en Management de Projets & Stratégie Financière',
    profile: 'Planification des affectations, validation des jalons et suivi des livrables.'
  },

  // ─── 2 RELECTEURS ───
  {
    roleName: 'Relecteur',
    name: 'Relecteur 1',
    email: 'relecteur1@menua.local',
    telephone: '+237 690 00 00 03',
    lieuResidence: 'Yaoundé, Cameroun',
    experienceCle: '7 ans en audit de conformité réglementaire, droit des affaires et contrôle qualité',
    langues: 'Français, Anglais',
    formations: 'Master 2 Droit des Affaires & Fiscalité Internationale',
    profile: 'Contrôle qualité approfondi, vérification de conformité et validation finale des tâches.'
  },
  {
    roleName: 'Relecteur',
    name: 'Relecteur 2',
    email: 'relecteur2@menua.local',
    telephone: '+237 690 00 00 04',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '5 ans en expertise comptable révisée et relecture critique de rapports financiers',
    langues: 'Français, Anglais',
    formations: 'Diplôme Supérieur de Comptabilité et Gestion (DSCG)',
    profile: 'Relecture critique, certification des analyses et validation des fiches de synthèse.'
  },

  // ─── 2 COLLABORATEURS ───
  {
    roleName: 'Collaborateur',
    name: 'Collaborateur 1',
    email: 'collaborateur1@menua.local',
    telephone: '+237 690 00 00 05',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '4 ans en comptabilité générale, révision des comptes et tenue des livres',
    langues: 'Français, Anglais',
    formations: 'Licence Pro Comptabilité & Finance d\'Entreprise',
    profile: 'Exécution rigoureuse des tâches assignées, collecte et traitement des pièces comptables.'
  },
  {
    roleName: 'Collaborateur',
    name: 'Collaborateur 2',
    email: 'collaborateur2@menua.local',
    telephone: '+237 690 00 00 06',
    lieuResidence: 'Bafoussam, Cameroun',
    experienceCle: '3 ans en gestion administrative, assistance opérationnelle et reporting client',
    langues: 'Français, Anglais',
    formations: 'Licence en Sciences de Gestion & Économie',
    profile: 'Traitement des dossiers opérationnels, saisie de données et reporting terrain régulier.'
  },

  // ─── 2 TECHNICIENS (ADMINISTRATEURS TECHNIQUES) ───
  {
    roleName: 'Administrateur technique',
    name: 'Administrateur Technique 1',
    email: 'admin.tech1@menua.local',
    telephone: '+237 690 00 00 07',
    lieuResidence: 'Paris, France',
    experienceCle: '6 ans en administration systèmes d\'information, sécurité réseau et infrastructure cloud',
    langues: 'Français, Anglais',
    formations: 'Ingénieur en Systèmes d\'Information & Cybersécurité',
    profile: 'Gestion des accès informatiques, attribution des rôles et sécurité de la plateforme.'
  },
  {
    roleName: 'Administrateur technique',
    name: 'Administrateur Technique 2',
    email: 'admin.tech2@menua.local',
    telephone: '+237 690 00 00 08',
    lieuResidence: 'Douala, Cameroun',
    experienceCle: '4 ans en maintenance informatique, support technique et intégration d\'outils CRM',
    langues: 'Français, Anglais',
    formations: 'Licence Pro Réseaux Télécoms & Administration Systèmes',
    profile: 'Support technique utilisateurs, paramétrage des comptes et monitoring de conformité.'
  }
];

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🚀 DÉMARRAGE DE LA PURGE SÉLECTIVE & CRÉATION DES 8 MEMBRES DU CRM');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // 1. Initialiser / Vérifier les rôles par défaut
  console.log('1️⃣  Vérification des rôles système...');
  const roleMap = {};
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
    roleMap[role.name] = role;
  }

  const superAdminRole = roleMap['Super-administrateur'];

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
        telephone: '+237690000000',
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

  // 6. Création des 8 utilisateurs internes (2 par rôle avec numéro après leur nom)
  console.log('\n6️⃣  Création des 8 utilisateurs internes avec numéro après leur nom...');
  
  const createdUsers = [];

  for (const member of MEMBERS_TO_SEED) {
    const role = roleMap[member.roleName];
    if (!role) {
      console.error(`   ❌ Rôle introuvable : ${member.roleName}`);
      continue;
    }

    const newUser = await prisma.utilisateur.create({
      data: {
        name: member.name,
        email: member.email.toLowerCase().trim(),
        password: hashedUniversalPassword,
        roleId: role.id,
        telephone: member.telephone.replace(/\s/g, ''),
        lieuResidence: member.lieuResidence,
        experienceCle: member.experienceCle,
        langues: member.langues,
        formations: member.formations,
        profile: member.profile,
        status: 'Actif',
        isBlocked: false
      }
    });

    createdUsers.push({
      role: member.roleName,
      name: newUser.name,
      email: newUser.email,
      telephone: member.telephone
    });

    console.log(`   + [${member.roleName}] ${newUser.name} (${newUser.email}) - Tél: ${member.telephone}`);
  }

  // 7. Vérification de l'intégrité des publications
  const pubCountAfter = await prisma.publication.count();

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 OPÉRATION TERMINÉE AVEC SUCCÈS !');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Publications CMS conservées : ${pubCountAfter} (intactes)`);
  console.log(`🔑 Mot de passe universel : ${UNIVERSAL_PASSWORD}\n`);

  console.log('📋 COMPTES CRÉÉS DANS LE CRM :');
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
