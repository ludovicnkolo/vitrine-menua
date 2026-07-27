require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log("Création des utilisateurs de test...");
    const hashedPassword = await bcrypt.hash('password123', 10);

    const roles = await prisma.role.findMany();
    const roleMap = {};
    roles.forEach(r => roleMap[r.name] = r.id);

    const users = [
        { email: 'resp@menua.local', name: 'Responsable Test', roleId: roleMap['Responsable opérationnel'] },
        { email: 'relecteur@menua.local', name: 'Relecteur Test', roleId: roleMap['Relecteur'] },
        { email: 'collab@menua.local', name: 'Collaborateur Test', roleId: roleMap['Collaborateur'] }
    ];

    for (const u of users) {
        await prisma.utilisateur.upsert({
            where: { email: u.email },
            update: { password: hashedPassword, roleId: u.roleId },
            create: { email: u.email, name: u.name, password: hashedPassword, roleId: u.roleId, telephone: '0000', lieuResidence: 'Paris', experienceCle: 'Dev' }
        });
        console.log(`Utilisateur créé : ${u.email} avec mot de passe 'password123'`);
    }

    // Création d'un dossier, d'une mission et d'une tâche de test
    const superAdmin = await prisma.utilisateur.findUnique({ where: { email: 'r.fouelefack@menuaconsulting.com' } });
    const collab = await prisma.utilisateur.findUnique({ where: { email: 'collab@menua.local' } });

    const dossier = await prisma.dossier.create({
        data: {
            reference: 'DOS-TEST-001',
            name: 'Dossier de Test Complet',
            description: 'Dossier pour tester le workflow de correction.',
            status: 'OUVERT',
            createdById: superAdmin.id
        }
    });

    const mission = await prisma.mission.create({
        data: {
            reference: 'MISS-TEST-001',
            description: 'Mission de test du flux de validation.',
            dossierId: dossier.id,
            status: 'EN_COURS',
            createdById: superAdmin.id
        }
    });

    const tache = await prisma.tache.create({
        data: {
            reference: 'TCH-TEST-001',
            description: 'Tâche de validation et correction.\nObjet: Validation finale.',
            missionId: mission.id,
            status: 'EN_FINALISATION',
            createdById: superAdmin.id,
            assignedToId: collab.id
        }
    });

    console.log(`Données de test créées : Dossier (${dossier.reference}), Mission (${mission.reference}), Tâche (${tache.reference} en statut EN_FINALISATION).`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
