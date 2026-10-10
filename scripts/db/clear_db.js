require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Démarrage du nettoyage complet de la base de données...");

    // On supprime les enregistrements dans le bon ordre pour respecter les clés étrangères
    const deleteMessagePersonnel = prisma.messagePersonnel.deleteMany();
    const deleteAudit = prisma.auditLog.deleteMany();
    const deleteDocument = prisma.document.deleteMany();
    const deleteTache = prisma.tache.deleteMany();
    const deleteMission = prisma.mission.deleteMany();
    const deleteDossier = prisma.dossier.deleteMany();
    const deleteFormulaireContact = prisma.formulaireContact.deleteMany();
    const deleteFormulaireRecrutement = prisma.formulaireRecrutement.deleteMany();
    const deleteFormulaire = prisma.formulaire.deleteMany();
    const deleteClientEntreprise = prisma.clientEntreprise.deleteMany();
    const deleteClient = prisma.client.deleteMany();
    const deleteUser = prisma.utilisateur.deleteMany();
    const deleteRole = prisma.role.deleteMany();

    // Transaction pour tout supprimer
    await prisma.$transaction([
        deleteMessagePersonnel,
        deleteAudit,
        deleteDocument,
        deleteTache,
        deleteMission,
        deleteDossier,
        deleteFormulaireContact,
        deleteFormulaireRecrutement,
        deleteFormulaire,
        deleteClientEntreprise,
        deleteClient,
        deleteUser,
        deleteRole
    ]);

    console.log("Base de données vidée avec succès.");
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
