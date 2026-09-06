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
<< /Length 180 >>
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
00000000115 00000 n 
00000000236 00000 n 
00000000408 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
485
%%EOF`;
  return Buffer.from(content, 'utf-8');
}

async function main() {
  console.log('=== DEBUT SEED JEU DE RECETTE MENUA CONSULTING ===');

  // 0. PURGE DES DONNEES OBSOLETES / DUMMY TEXT
  try {
    const allForms = await prisma.formulaire.findMany();
    for (const df of allForms) {
      const isDummy = (df.description && df.description.toLowerCase().includes('voluptatem')) ||
                      (df.bodyHtml && df.bodyHtml.toLowerCase().includes('voluptatem')) ||
                      df.raisonSocial === 'nvjdvdh';
      if (isDummy) {
        await prisma.formulaire.delete({ where: { id: df.id } });
        console.log(`- Formulaire résiduel purgé : ${df.id} (${df.nomPrenom})`);
      }
    }
  } catch (err) {
    console.warn('Avertissement purge dummy:', err.message);
  }

  // 1. ROLES SYSTEME
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

  // 2. COMPTES UTILISATEURS DE RECETTE (MDP : RecetteMenua2026!)
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
      console.log(`+ Compte créé : ${u.email} (${u.role})`);
    } else {
      user = await prisma.utilisateur.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          roleId: roleMap[u.role],
          isBlocked: false
        }
      });
      console.log(`~ Compte mis à jour : ${u.email} (${u.role})`);
    }
    userMap[u.role] = user;
  }

  const responsableUser = userMap['Responsable opérationnel'];
  const collabUser = userMap['Collaborateur'];
  const relecteurUser = userMap['Relecteur'];

  // 3. CLIENTS DE RECETTE STRICTS
  // 3.1 CLIENT TEST ALPHA (Société)
  let clientAlpha = await prisma.client.findFirst({
    where: { OR: [{ name: 'CLIENT TEST ALPHA' }, { email: 'alpha@client-test.fr' }] },
    include: { entreprise: true }
  });
  if (!clientAlpha) {
    clientAlpha = await prisma.client.create({
      data: {
        name: 'CLIENT TEST ALPHA',
        email: 'alpha@client-test.fr',
        telephone: '0140000001',
        type: 'Société',
        status: 'ACTIF',
        secteurActivite: 'Banque et Finance',
        description: 'Client de recette - Société financière de premier plan',
        entreprise: {
          create: {
            siret: '12345678900012',
            raisonSociale: 'CLIENT TEST ALPHA SAS',
            emailEntreprise: 'contact@client-test-alpha.fr',
            telephoneEntreprise: '0140000001'
          }
        }
      },
      include: { entreprise: true }
    });
    console.log(`+ Client créé : CLIENT TEST ALPHA (Société)`);
  } else {
    clientAlpha = await prisma.client.update({
      where: { id: clientAlpha.id },
      data: { name: 'CLIENT TEST ALPHA', type: 'Société' },
      include: { entreprise: true }
    });
    console.log(`~ Client actualisé : CLIENT TEST ALPHA`);
  }

  // 3.2 CLIENT TEST BETA (Société)
  let clientBeta = await prisma.client.findFirst({
    where: { OR: [{ name: 'CLIENT TEST BETA' }, { email: 'beta@client-test.fr' }] },
    include: { entreprise: true }
  });
  if (!clientBeta) {
    clientBeta = await prisma.client.create({
      data: {
        name: 'CLIENT TEST BETA',
        email: 'beta@client-test.fr',
        telephone: '0140000002',
        type: 'Société',
        status: 'ACTIF',
        secteurActivite: 'Gestion de Patrimoine',
        description: 'Client de recette - Cabinet de gestion de patrimoine',
        entreprise: {
          create: {
            siret: '98765432100034',
            raisonSociale: 'CLIENT TEST BETA SARL',
            emailEntreprise: 'contact@client-test-beta.fr',
            telephoneEntreprise: '0140000002'
          }
        }
      },
      include: { entreprise: true }
    });
    console.log(`+ Client créé : CLIENT TEST BETA (Société)`);
  } else {
    clientBeta = await prisma.client.update({
      where: { id: clientBeta.id },
      data: { name: 'CLIENT TEST BETA', type: 'Société' },
      include: { entreprise: true }
    });
    console.log(`~ Client actualisé : CLIENT TEST BETA`);
  }

  // 3.3 CLIENT TEST PARTICULIER (Particulier)
  let clientParticulier = await prisma.client.findFirst({
    where: { OR: [{ name: 'CLIENT TEST PARTICULIER' }, { email: 'j.dupont@test.fr' }] }
  });
  if (!clientParticulier) {
    clientParticulier = await prisma.client.create({
      data: {
        name: 'CLIENT TEST PARTICULIER',
        email: 'j.dupont@test.fr',
        telephone: '0612345678',
        type: 'Particulier',
        status: 'ACTIF',
        secteurActivite: 'Gestion privée',
        description: 'Client de recette - Particulier investisseur'
      }
    });
    console.log(`+ Client créé : CLIENT TEST PARTICULIER (Particulier)`);
  } else {
    clientParticulier = await prisma.client.update({
      where: { id: clientParticulier.id },
      data: { name: 'CLIENT TEST PARTICULIER', type: 'Particulier' }
    });
    console.log(`~ Client actualisé : CLIENT TEST PARTICULIER`);
  }

  // 4. DOSSIER TEST01 & SOUS-DOSSIERS
  let rootDossier = await prisma.dossier.findFirst({
    where: { OR: [{ name: 'DOSSIER TEST01' }, { reference: 'DOS-TEST01' }] }
  });

  if (!rootDossier) {
    rootDossier = await prisma.dossier.create({
      data: {
        name: 'DOSSIER TEST01',
        reference: 'DOS-TEST01',
        description: 'Dossier principal de test - Délégation de gestion opérationnelle 2026',
        status: 'OUVERT',
        origin: 'CLIENT',
        clientId: clientAlpha.id,
        createdById: responsableUser.id,
        traitantId: responsableUser.id
      }
    });
    console.log(`+ Dossier créé : ${rootDossier.name} (${rootDossier.reference})`);
  } else {
    rootDossier = await prisma.dossier.update({
      where: { id: rootDossier.id },
      data: { name: 'DOSSIER TEST01', reference: 'DOS-TEST01', clientId: clientAlpha.id }
    });
    console.log(`~ Dossier actualisé : ${rootDossier.name}`);
  }

  // Sous-dossiers
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
          status: 'OUVERT',
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

  // Dossiers complémentaires couvrant les différents statuts de recette
  const additionalDossiers = [
    { name: 'DOSSIER TEST02 - NOUVEAU', ref: 'DOS-TEST02', status: 'NOUVEAU', client: clientBeta.id },
    { name: 'DOSSIER TEST03 - EN COURS', ref: 'DOS-TEST03', status: 'OUVERT', client: clientBeta.id },
    { name: 'DOSSIER TEST04 - EN ATTENTE DOCS', ref: 'DOS-TEST04', status: 'EN_ATTENTE_CLIENT', client: clientParticulier.id },
    { name: 'DOSSIER TEST05 - CLOTURE', ref: 'DOS-TEST05', status: 'CLOTURE', client: clientAlpha.id }
  ];

  for (const ad of additionalDossiers) {
    let existing = await prisma.dossier.findFirst({ where: { reference: ad.ref } });
    if (!existing) {
      await prisma.dossier.create({
        data: {
          name: ad.name,
          reference: ad.ref,
          status: ad.status,
          description: `Dossier de test pour statut ${ad.status}`,
          clientId: ad.client,
          createdById: responsableUser.id,
          traitantId: collabUser.id
        }
      });
      console.log(`+ Dossier créé [${ad.status}] : ${ad.name}`);
    }
  }

  // 5. MISSION TEST01 & TACHES ASSOCIEES
  let mission = await prisma.mission.findFirst({
    where: { OR: [{ description: { startsWith: 'MISSION TEST01' } }, { reference: 'MSN-TEST01' }] }
  });

  if (!mission) {
    mission = await prisma.mission.create({
      data: {
        reference: 'MSN-TEST01',
        description: 'MISSION TEST01 - Traitement des souscriptions et conformité KYC Q3',
        status: 'EN_COURS',
        dossierId: rootDossier.id,
        createdById: responsableUser.id,
        assignedToId: responsableUser.id
      }
    });
    console.log(`+ Mission créée : ${mission.description}`);
  } else {
    mission = await prisma.mission.update({
      where: { id: mission.id },
      data: { reference: 'MSN-TEST01', description: 'MISSION TEST01 - Traitement des souscriptions et conformité KYC Q3', dossierId: rootDossier.id }
    });
  }

  // Tâches avec statuts distincts
  const tasksData = [
    {
      description: "01 - Collecte et contrôle de complétude des justificatifs clients",
      status: 'NOUVEAU',
      assignedToId: collabUser.id
    },
    {
      description: '02 - Préparation administrative et filtrage LCB-FT',
      status: 'EN_COURS',
      assignedToId: collabUser.id
    },
    {
      description: '03 - Contrôle qualité et validation conformité',
      status: 'A_CORRIGER',
      managerFeedback: 'Pièce justificative illisible - demande de renouvellement adressée au client',
      assignedToId: collabUser.id
    },
    {
      description: '04 - Revue contradictoire et visa final',
      status: 'EN_VALIDATION_FINALE',
      adminFeedback: 'Dossier prêt pour visa final relecteur',
      assignedToId: relecteurUser.id
    },
    {
      description: "05 - Rapport d'exécution et archivage opérationnel",
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
          dossierTacheId: rootDossier.id,
          createdById: responsableUser.id,
          assignedToId: t.assignedToId
        }
      });
      console.log(`  + Tâche créée [${t.status}] : ${t.description}`);
    }
  }

  // 6. DOCUMENTS SPECIFIQUES ATTENDUS DANS LA GED (4 PDFS EXACTS)
  const expectedPdfs = [
    {
      name: '01_Fiche_mission_TEST.pdf',
      subfolder: 'OPÉRATIONS & RÉALISATIONS',
      title: 'FICHE MISSION TEST01 - MENUA CONSULTING',
      text: 'Cadrage operationnel, calendrier d intervention, livrables attendus et circuits de validation.'
    },
    {
      name: '02_Piece_client_TEST.pdf',
      subfolder: 'ADMINISTRATION & FINANCES',
      title: 'PIECE CLIENT TEST - JUSTIFICATIF KYC',
      text: 'Piece d identite et extrait d immatriculation certifies dans le cadre de la procedure LCB-FT.'
    },
    {
      name: '03_Livrable_TEST.pdf',
      subfolder: 'OPÉRATIONS & RÉALISATIONS',
      title: 'LIVRABLE TEST01 - RAPPORT D EXECUTION',
      text: 'Rapport operationnel recapitulatif des operations effectuees et indicateurs de qualite.'
    },
    {
      name: '04_Justificatif_TEST.pdf',
      subfolder: 'ADMINISTRATION & FINANCES',
      title: 'JUSTIFICATIF TEST - AUDIT TRAIL',
      text: 'Releve d execution et attestation de conformite documentaire pour la mission de recette.'
    }
  ];

  for (const docInfo of expectedPdfs) {
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
    } else {
      console.log(`  = Document GED déjà présent : ${docInfo.name}`);
    }
  }

  // 7. FORMULAIRES DE RECETTE PROPRES (avec statut Verifalia valide)
  let testFormContact = await prisma.formulaire.findFirst({
    where: { email: 'contact.recette@martin-associes.fr' }
  });
  if (!testFormContact) {
    await prisma.formulaire.create({
      data: {
        formulaireId: crypto.randomUUID(),
        type: 'CONTACT',
        statusSubmitter: 'SOCIETE',
        nomPrenom: 'Sophie Martin',
        email: 'contact.recette@martin-associes.fr',
        telephone: '0142334455',
        priority: 'NORMAL',
        description: 'Demande de prestations de renfort back-office pour opérations de souscription et KYC.',
        raisonSocial: 'Cabinet Martin & Associés',
        objet: 'Demande d accompagnement opérationnel',
        bodyHtml: '<div>Société : Cabinet Martin & Associés<br/>Contact : Sophie Martin<br/>Email : contact.recette@martin-associes.fr<br/>Besoin : Renfort back-office</div>',
        status: 'NOUVEAU',
        verifaliaStatus: 'COMPLETED_VALID',
        contact: {
          create: {
            typeBesoin: 'Support opérationnel back office'
          }
        }
      }
    });
    console.log(`+ Formulaire Contact créé avec Verifalia COMPLETED_VALID : contact.recette@martin-associes.fr`);
  }

  let testFormRecrutement = await prisma.formulaire.findFirst({
    where: { email: 'alexandre.recette@email.fr' }
  });
  if (!testFormRecrutement) {
    await prisma.formulaire.create({
      data: {
        formulaireId: crypto.randomUUID(),
        type: 'RECRUTEMENT',
        statusSubmitter: 'PARTICULIER',
        nomPrenom: 'Alexandre Leroy',
        email: 'alexandre.recette@email.fr',
        telephone: '0688990011',
        priority: 'NORMAL',
        description: 'Candidature profil opérationnel senior en gestion des opérations et middle-office financier.',
        objet: 'Candidature Opérationnel Senior',
        bodyHtml: '<div>Candidat : Alexandre Leroy<br/>Email : alexandre.recette@email.fr<br/>Expérience : 8 ans</div>',
        status: 'NOUVEAU',
        verifaliaStatus: 'COMPLETED_VALID',
        recrutement: {
          create: {
            competenceCle: 'Back et middle office, Reporting et Data',
            anneeExperience: '5 à 10 ans',
            lieuResidence: 'Paris / Île-de-France',
            langue: 'Français (bilingue), Anglais (professionnel)',
            lienLinkedin: 'https://linkedin.com/in/alexandre-leroy-recette'
          }
        }
      }
    });
    console.log(`+ Formulaire Recrutement créé avec Verifalia COMPLETED_VALID : alexandre.recette@email.fr`);
  }

  // 8. AUDIT LOG D'INITIALISATION
  await prisma.auditLog.create({
    data: {
      userId: responsableUser.id,
      action: 'RECETTE_INITIALISATION',
      targetType: 'SYSTEME',
      details: 'Initialisation complète du jeu de données de recette MENUA CONSULTING (comptes, CLIENT TEST ALPHA/BETA/PARTICULIER, DOSSIER TEST01, MISSION TEST01, 4 PDF GED, formulaires qualifiés)',
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
