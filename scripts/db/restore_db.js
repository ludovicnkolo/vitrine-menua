const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase() {
  try {
    const backupDir = path.join(__dirname, 'backups');
    const filePath = path.join(backupDir, 'db_export.json');

    if (!fs.existsSync(filePath)) {
      console.error(`Fichier de sauvegarde introuvable: ${filePath}`);
      process.exit(1);
    }

    console.log(`Lecture de la sauvegarde depuis : ${filePath}...`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('\n🗑️ Suppression des données actuelles pour restauration...');
    // Ordre de suppression (inverse des dépendances)
    await prisma.document.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.tache.deleteMany();
    await prisma.messagePersonnel.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.formulaireRecrutement.deleteMany();
    await prisma.formulaireContact.deleteMany();
    await prisma.formulaire.deleteMany();
    await prisma.dossier.deleteMany();
    await prisma.clientEntreprise.deleteMany();
    await prisma.client.deleteMany();
    await prisma.utilisateur.deleteMany();
    await prisma.role.deleteMany();
    console.log('✓ Données actuelles effacées.');

    console.log('\n📥 Importation des données de sauvegarde...');

    // Ordre d'insertion (respect des clés étrangères)
    if (data.roles) await prisma.role.createMany({ data: data.roles });
    console.log('  ✓ Rôles restaurés.');

    if (data.utilisateurs) await prisma.utilisateur.createMany({ data: data.utilisateurs });
    console.log('  ✓ Utilisateurs restaurés.');

    if (data.clients) await prisma.client.createMany({ data: data.clients });
    console.log('  ✓ Clients restaurés.');

    if (data.clientEntreprises) await prisma.clientEntreprise.createMany({ data: data.clientEntreprises });
    console.log('  ✓ Clients Entreprises restaurés.');

    if (data.formulaires) await prisma.formulaire.createMany({ data: data.formulaires });
    console.log('  ✓ Formulaires restaurés.');

    if (data.formulaireRecrutements) await prisma.formulaireRecrutement.createMany({ data: data.formulaireRecrutements });
    console.log('  ✓ Formulaires de recrutement restaurés.');

    if (data.formulaireContacts) await prisma.formulaireContact.createMany({ data: data.formulaireContacts });
    console.log('  ✓ Formulaires de contact restaurés.');

    if (data.dossiers) await prisma.dossier.createMany({ data: data.dossiers });
    console.log('  ✓ Dossiers restaurés.');

    if (data.missions) await prisma.mission.createMany({ data: data.missions });
    console.log('  ✓ Missions restaurées.');

    if (data.taches) await prisma.tache.createMany({ data: data.taches });
    console.log('  ✓ Tâches restaurées.');

    if (data.documents) await prisma.document.createMany({ data: data.documents });
    console.log('  ✓ Documents restaurés.');

    if (data.auditLogs) await prisma.auditLog.createMany({ data: data.auditLogs });
    console.log('  ✓ Audit Logs restaurés.');

    if (data.messagePersonnels) await prisma.messagePersonnel.createMany({ data: data.messagePersonnels });
    console.log('  ✓ Messages Personnels restaurés.');

    console.log('\n✅ Restauration de la base de données terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la restauration :', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDatabase();
