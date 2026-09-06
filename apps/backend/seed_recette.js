const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const prisma = require('./src/prisma');
const { uploadToS3 } = require('./src/services/s3Service');

// Minimal valid PDF generator helper
function createMinimalPdfBuffer(title, text) {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 120 >>
stream
BT
/F1 18 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(${text}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000236 00000 n 
0000000408 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
485
%%EOF`;
  return Buffer.from(content, 'utf-8');
}

async function main() {
  console.log('=== DEBUT SEED JEU DE RECETTE MENUA CONSULTING ===');

  // 1. ROLES
  const roleNames = [
    'Super-administrateur',
    'Responsable opérationnel',
    'Relecteur',
    'Collaborateur',
    'Administrateur technique'
  ];

  const roleMap = {};
  for (const name of roleNames) {
    let role = await prisma.role.findUnique({ where: { name } });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name,
          description: `Rôle standard ${name}`,
          status: 'Actif'
        }
      });
      console.log(`+ Rôle créé : ${name}`);
    }
    roleMap[name] = role.id;
  }

  // 2. COMPTES DE TEST (Mot de passe : RecetteMenua2026!)
  const testPasswordPlain = 'RecetteMenua2026!';
  const hashedPassword = await bcrypt.hash(testPasswordPlain, 10);

  const testUsersData = [
    {
      name: 'Collaborateur Test',
      email: 'collab-test@menuaconsulting.com',
      role: 'Collaborateur',
      telephone: '0601020304',
      profile: 'Opérations Back & Middle Office'
    },
    {
      name: 'Relecteur Test',
      email: 'relecteur-test@menuaconsulting.com',
      role: 'Relecteur',
      telephone: '0602030405',
      profile: 'Contrôle Qualité & Conformité'
    },
    {
      name: 'Responsable Test',
      email: 'responsable-test@menuaconsulting.com',
      role: 'Responsable opérationnel',
      telephone: '0603040506',
      profile: 'Management Opérationnel'
    },
    {
      name: 'AdminTech Test',
      email: 'admintech-test@menuaconsulting.com',
      role: 'Administrateur technique',
      telephone: '0604050607',
      profile: 'Administration Système & Sécurité'
    }
  ];

  const userMap = {};
  for (const u of testUsersData) {
    let user = await prisma.utilisateur.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.utilisateur.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          roleId: roleMap[u.role],
          telephone: u.telephone,
          profile: u.profile,
          isBlocked: false,
          lastLogin: new Date()
        }
      });
      console.log(`+ Compte utilisateur créé : ${u.email} (${u.role})`);
    } else {
      user = await prisma.utilisateur.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          roleId: roleMap[u.role],
          isBlocked: false
        }
      });
      console.log(`~ Compte utilisateur mis à jour : ${u.email} (${u.role})`);
    }
    userMap[u.role] = user;
  }

  // 3. CLIENTS DE TEST
  // 3.1 Client Alpha (Société)
  let clientAlpha = await prisma.client.findFirst({ where: { email: 'alpha@client-test.fr' }, include: { entreprise: true } });
  if (!clientAlpha) {
    clientAlpha = await prisma.client.create({
      data: {
        name: 'Marc Delattre',
        email: 'alpha@client-test.fr',
        telephone: '0140000001',
        type: 'Société',
        status: 'ACTIF',
        secteurActivite: 'Banque et Finance',
        description: 'Client de recette - Société financière de premier plan',
        entreprise: {
          create: {
            siret: '12345678900012',
            raisonSociale: 'Alpha Finance SAS',
            emailEntreprise: 'contact@alpha-finance.fr',
            telephoneEntreprise: '0140000001'
          }
        }
      },
      include: { entreprise: true }
    });
    console.log(`+ Client créé : Alpha Finance SAS (Société)`);
  }

  // 3.2 Client Beta (Société)
  let clientBeta = await prisma.client.findFirst({ where: { email: 'beta@client-test.fr' }, include: { entreprise: true } });
  if (!clientBeta) {
    clientBeta = await prisma.client.create({
      data: {
        name: 'Sophie Bernard',
        email: 'beta@client-test.fr',
        telephone: '0140000002',
        type: 'Société',
        status: 'ACTIF',
        secteurActivite: 'Gestion de Patrimoine',
        description: 'Client de recette - Cabinet de gestion de patrimoine',
        entreprise: {
          create: {
            siret: '98765432100034',
            raisonSociale: 'Beta Gestion SARL',
            emailEntreprise: 'contact@beta-gestion.fr',
            telephoneEntreprise: '0140000002'
          }
        }
      },
      include: { entreprise: true }
    });
    console.log(`+ Client créé : Beta Gestion SARL (Société)`);
  }

  // 3.3 Client Particulier
  let clientParticulier = await prisma.client.findFirst({ where: { email: 'j.dupont@test.fr' } });
  if (!clientParticulier) {
    clientParticulier = await prisma.client.create({
      data: {
        name: 'Jean Dupont',
        email: 'j.dupont@test.fr',
        telephone: '0612345678',
        type: 'Particulier',
        status: 'ACTIF',
        secteurActivite: 'Gestion privée',
        description: 'Client de recette - Particulier investisseur'
      }
    });
    console.log(`+ Client créé : Jean Dupont (Particulier)`);
  }

  // 4. DOSSIER PRINCIPAL DE TEST
  let rootDossier = await prisma.dossier.findFirst({
    where: { name: 'DOSSIER ALPHA - GESTION DELEGUEE 2026', parentDossierId: null }
  });

  const responsableUser = userMap['Responsable opérationnel'];
  const collabUser = userMap['Collaborateur'];
  const relecteurUser = userMap['Relecteur'];

  if (!rootDossier) {
    rootDossier = await prisma.dossier.create({
      data: {
        name: 'DOSSIER ALPHA - GESTION DELEGUEE 2026',
        description: 'Dossier complet de test pour la recette opérationnelle',
        status: 'ACTIF',
        origin: 'CLIENT',
        clientId: clientAlpha.id,
        createdById: responsableUser.id,
        traitantId: responsableUser.id
      }
    });
    console.log(`+ Dossier principal créé : ${rootDossier.name}`);
  }

  // 4.1 Sous-dossiers par défaut
  const subFolderNames = [
    'ADMINISTRATION & FINANCES',
    'OPÉRATIONS & RÉALISATIONS',
    'RELATIONS & DÉVELOPPEMENT'
  ];

  const subFolders = {};
  for (const sfName of subFolderNames) {
    let sf = await prisma.dossier.findFirst({
      where: { name: sfName, parentDossierId: rootDossier.id }
    });
    if (!sf) {
      sf = await prisma.dossier.create({
        data: {
          name: sfName,
          description: `Sous-dossier standard ${sfName}`,
          status: 'ACTIF',
          origin: 'CLIENT',
          parentDossierId: rootDossier.id,
          clientId: clientAlpha.id,
          createdById: responsableUser.id
        }
      });
      console.log(`  + Sous-dossier créé : ${sfName}`);
    }
    subFolders[sfName] = sf;
  }

  // 5. MISSION DE RECETTE & TÂCHES COUVRANT TOUS LES STATUTS
  let mission = await prisma.mission.findFirst({
    where: { dossierId: rootDossier.id }
  });

  if (!mission) {
    mission = await prisma.mission.create({
      data: {
        description: 'MISSION REVUE KYC & REPORTING Q3 - Contrôle documentaire et conformité LCB-FT',
        status: 'EN_COURS',
        dossierId: rootDossier.id,
        createdById: responsableUser.id,
        assignedToId: responsableUser.id
      }
    });
    console.log(`+ Mission créée : ${mission.description}`);
  }

  // Tâches avec statuts distincts
  const tasksData = [
    {
      description: "Collecte des justificatifs d'identité et Kbis",
      status: 'NOUVEAU',
      assignedToId: collabUser.id
    },
    {
      description: 'Contrôle de conformité et filtrage LCB-FT',
      status: 'EN_COURS',
      assignedToId: collabUser.id
    },
    {
      description: 'Rapprochement bancaire et validation comptable',
      status: 'A_CORRIGER',
      managerFeedback: 'Attente de document client (Relevé de compte certifié)',
      assignedToId: collabUser.id
    },
    {
      description: 'Revue contradictoire et audit qualité',
      status: 'EN_VALIDATION_FINALE',
      adminFeedback: 'En attente de relecture contradictoire',
      assignedToId: relecteurUser.id
    },
    {
      description: "Rapport d'exécution et clôture mensuelle",
      status: 'TERMINEE',
      assignedToId: responsableUser.id
    }
  ];

  for (const t of tasksData) {
    let existingTask = await prisma.tache.findFirst({
      where: { description: t.description, missionId: mission.id }
    });
    if (!existingTask) {
      await prisma.tache.create({
        data: {
          description: t.description,
          status: t.status,
          managerFeedback: t.managerFeedback || null,
          adminFeedback: t.adminFeedback || null,
          missionId: mission.id,
          createdById: responsableUser.id,
          assignedToId: t.assignedToId
        }
      });
      console.log(`  + Tâche créée [${t.status}] : ${t.description}`);
    }
  }

  // 6. DOCUMENTS DE RECETTE DANS LA GED
  const testPdfs = [
    {
      name: 'KBIS_Alpha_Finance_SAS.pdf',
      subfolder: 'ADMINISTRATION & FINANCES',
      title: 'Extrait KBIS - Alpha Finance SAS',
      text: 'Extrait certifie conforme du registre du commerce et des societes. SIRET: 12345678900012'
    },
    {
      name: 'Convention_Delegation_Gestion.pdf',
      subfolder: 'ADMINISTRATION & FINANCES',
      title: 'Convention Cadre d Externalisation',
      text: 'Contrat de prestations de services back et middle office signe entre Alpha Finance SAS et MENUA CONSULTING.'
    },
    {
      name: 'Rapport_Controle_KYC_Q3.pdf',
      subfolder: 'OPÉRATIONS & RÉALISATIONS',
      title: 'Rapport d Audit Conformite KYC Q3',
      text: 'Compte-rendu d execution des diligences de vigilance et analyse du risque de blanchiment.'
    },
    {
      name: 'Attestation_Conformite_2026.pdf',
      subfolder: 'RELATIONS & DÉVELOPPEMENT',
      title: 'Attestation Annuelle de Conformite',
      text: 'Attestation de conformite operationnelle delivree dans le cadre du suivi contractuel 2026.'
    }
  ];

  for (const docInfo of testPdfs) {
    const targetFolder = subFolders[docInfo.subfolder] || rootDossier;
    let existingDoc = await prisma.document.findFirst({
      where: { name: docInfo.name, dossierId: targetFolder.id }
    });

    if (!existingDoc) {
      const pdfBuffer = createMinimalPdfBuffer(docInfo.title, docInfo.text);
      const s3Key = `ged/recette/${crypto.randomUUID()}-${docInfo.name}`;
      
      try {
        await uploadToS3(pdfBuffer, s3Key, 'application/pdf');
        console.log(`  ✓ Fichier S3 uploadé : ${docInfo.name} -> ${s3Key}`);
      } catch (s3Err) {
        console.warn(`  ! Avertissement upload S3 (${s3Err.message}), enregistrement local en base.`);
      }

      await prisma.document.create({
        data: {
          name: docInfo.name,
          url: s3Key,
          uploadedById: responsableUser.id,
          dossierId: targetFolder.id
        }
      });
      console.log(`  + Document GED enregistré : ${docInfo.name} (Dossier: ${docInfo.subfolder})`);
    }
  }

  // 7. AUDIT TRAIL RECORD
  await prisma.auditLog.create({
    data: {
      userId: responsableUser.id,
      action: 'RECETTE_INITIALISATION',
      targetType: 'SYSTEME',
      details: 'Initialisation complète du jeu de données de recette MENUA CONSULTING (comptes, clients, dossiers, tâches, GED)',
      dossierId: rootDossier.id
    }
  });

  console.log('=== JEU DE RECETTE INITIALISE AVEC SUCCES ===');
}

main()
  .catch((err) => {
    console.error('Erreur initialisation jeu de recette:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
