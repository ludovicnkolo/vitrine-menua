require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
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

    const adminEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@menua.local';
    const adminPass = process.env.MASTER_ADMIN_PASSWORD || 'ChangeMe123!';
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    
    let u = await prisma.utilisateur.findUnique({ where: { email: adminEmail } });
    if (!u) {
        u = await prisma.utilisateur.create({
            data: { 
                email: adminEmail, 
                password: hashedPassword, 
                name: process.env.MASTER_ADMIN_NAME || 'Super Administrateur', 
                telephone: process.env.MASTER_ADMIN_PHONE || '',
                lieuResidence: process.env.MASTER_ADMIN_RESIDENCE || '',
                experienceCle: process.env.MASTER_ADMIN_EXPERIENCE || '',
                profile: process.env.MASTER_ADMIN_PROFILE || '',
                roleId: adminRole.id 
            }
        });
        console.log("Admin seeded:", u.email);
    } else {
        await prisma.utilisateur.update({
            where: { id: u.id },
            data: { 
                name: process.env.MASTER_ADMIN_NAME || 'Super Administrateur', 
                telephone: process.env.MASTER_ADMIN_PHONE || '',
                lieuResidence: process.env.MASTER_ADMIN_RESIDENCE || '',
                experienceCle: process.env.MASTER_ADMIN_EXPERIENCE || '',
                profile: process.env.MASTER_ADMIN_PROFILE || '',
                roleId: adminRole.id, 
                password: hashedPassword 
            }
        });
        console.log("Admin already exists, role updated:", u.email);
    }
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
