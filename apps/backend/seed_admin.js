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
    description: 'Pilote le flux métier quotidien. Peut gérer les clients, créer et assigner des missions, suivre l\'évolution, mais n\'a pas accès aux paramètres du système.',
    permissions: [
      'MESSAGES_VIEW', 'MESSAGES_PROCESS', 'DOSSIERS_MANAGE', 'TACHES_MANAGE', 
      'TACHES_VIEW_ALL', 'CLIENTS_MANAGE'
    ]
  },
  {
    name: 'Relecteur',
    description: 'Vérifie la qualité et la conformité. Ne peut que consulter l\'ensemble des tâches finalisées pour les valider ou les rejeter.',
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

async function main() {
    let adminRole = null;

    for (const r of ROLES_DEFAULT) {
        let role = await prisma.role.findUnique({ where: { name: r.name } });
        const permsStr = JSON.stringify(r.permissions);
        if (!role) {
            role = await prisma.role.create({ data: { name: r.name, description: r.description, permissions: permsStr } });
            console.log("Role created:", r.name);
        } else {
            role = await prisma.role.update({ where: { id: role.id }, data: { description: r.description, permissions: permsStr }});
        }
        if (r.name === 'Super-administrateur') {
            adminRole = role;
        }
    }

    const adminEmail = process.env.MASTER_ADMIN_EMAIL || 'r.fouelefack@menuaconsulting.com';
    const adminPass = process.env.MASTER_ADMIN_PASSWORD || 'Menua2026?consulting';
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    
    let u = await prisma.utilisateur.findUnique({ where: { email: adminEmail } });
    if (!u) {
        u = await prisma.utilisateur.create({
            data: { 
                email: adminEmail, 
                password: hashedPassword, 
                name: process.env.MASTER_ADMIN_NAME || 'Rosette Fouelefack', 
                telephone: process.env.MASTER_ADMIN_PHONE || '+33659207511',
                lieuResidence: process.env.MASTER_ADMIN_RESIDENCE || 'Paris, France',
                experienceCle: process.env.MASTER_ADMIN_EXPERIENCE || 'Back & Middle Office Agile, Conformité et gestion des risques patrimoniaux',
                profile: process.env.MASTER_ADMIN_PROFILE || 'Directrice de Menua Consulting, experte en finance, risques et conformité.',
                langues: 'Français',
                status: 'Actif',
                poleActivite: 'Direction Générale',
                fonction: 'Directrice Générale',
                roleId: adminRole.id 
            }
        });
        console.log("Admin seeded:", u.email);
    } else {
        await prisma.utilisateur.update({
            where: { id: u.id },
            data: { 
                name: process.env.MASTER_ADMIN_NAME || 'Rosette Fouelefack', 
                telephone: process.env.MASTER_ADMIN_PHONE || '+33659207511',
                lieuResidence: process.env.MASTER_ADMIN_RESIDENCE || 'Paris, France',
                experienceCle: process.env.MASTER_ADMIN_EXPERIENCE || 'Back & Middle Office Agile, Conformité et gestion des risques patrimoniaux',
                profile: process.env.MASTER_ADMIN_PROFILE || 'Directrice de Menua Consulting, experte en finance, risques et conformité.',
                langues: 'Français',
                status: 'Actif',
                roleId: adminRole.id, 
                password: hashedPassword 
            }
        });
        console.log("Admin already exists, role updated:", u.email);
    }

    // Pôles d'activité par défaut
    const POLES_DEFAULT = [
        { name: 'Finance & Comptabilité', description: 'Gestion financière, trésorerie et comptabilité agile' },
        { name: 'Assurance & Prévoyance', description: 'Souscription, gestion des contrats et sinistres' },
        { name: 'Gestion de Patrimoine (CGP)', description: 'Conseil en investissement et ingénierie patrimoniale' },
        { name: 'Juridique & Conformité', description: 'Audit réglementaire, conformité ACPR/AMF et contrats' },
        { name: 'Direction Générale', description: 'Pilotage stratégique et gouvernance' }
    ];

    for (const p of POLES_DEFAULT) {
        const existing = await prisma.poleActivite.findUnique({ where: { name: p.name } }).catch(() => null);
        if (!existing) {
            await prisma.poleActivite.create({ data: p }).catch(() => null);
            console.log("Pole created:", p.name);
        }
    }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
