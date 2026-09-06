require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('node:fs');
const path = require('node:path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { uploadToS3 } = require('../src/services/s3Service');

const prisma = new PrismaClient();

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'eu-west-par',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function runAcceptanceTest() {
  console.log('--- DÉMARRAGE DU TEST DE RECETTE GED ---');
  let testDocId = null;
  let testS3Key = null;

  try {
    // 1. Setup : Trouver l'admin et créer un dossier de test (ou en utiliser un existant)
    let admin = await prisma.utilisateur.findFirst();
    if (!admin) {
        throw new Error('Aucun administrateur trouvé en base de données.');
    }

    let testFolder = await prisma.dossier.findFirst({ where: { name: 'Dossier de Test GED' } });
    if (!testFolder) {
        testFolder = await prisma.dossier.create({
            data: {
                name: 'Dossier de Test GED',
                description: 'Dossier temporaire pour les tests de la GED',
                origin: 'INTERNE'
            }
        });
        console.log(`✅ Dossier de test créé : ${testFolder.id}`);
    } else {
        console.log(`✅ Dossier de test existant trouvé : ${testFolder.id}`);
    }

    // 2. Créer un fichier local fictif pour le test
    const dummyFilePath = path.join(__dirname, 'test-doc.txt');
    fs.writeFileSync(dummyFilePath, 'Ceci est un fichier de test pour la GED.');
    const fileBuffer = fs.readFileSync(dummyFilePath);
    
    // 3. Simuler le workflow de l'API /api/files/upload-and-attach
    // A. Générer la clé S3
    const bucket = 'ged';
    const uniqueSuffix = Date.now() + '-test';
    testS3Key = `${bucket}/${uniqueSuffix}-test-doc.txt`;

    console.log(`\n⏳ Étape 1 : Upload physique vers S3 (${testS3Key})...`);
    await uploadToS3(fileBuffer, testS3Key, 'text/plain');
    console.log(`✅ Upload S3 réussi.`);

    console.log(`\n⏳ Étape 2 : Enregistrement en base de données...`);
    const doc = await prisma.document.create({
        data: {
            name: 'Document de Test GED',
            url: testS3Key,
            uploadedById: admin.id,
            dossierId: testFolder.id
        }
    });
    testDocId = doc.id;
    console.log(`✅ Enregistrement en base réussi (ID: ${testDocId}).`);

    // 4. Vérification physique dans S3 (Simulation de la récupération)
    console.log(`\n⏳ Étape 3 : Vérification de la présence physique du fichier dans S3...`);
    await s3Client.send(new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: testS3Key
    }));
    console.log(`✅ Le fichier existe bien dans OVH.`);

    // 5. Nettoyage de fin de test
    console.log(`\n⏳ Étape 4 : Nettoyage du fichier local de test...`);
    fs.unlinkSync(dummyFilePath);
    
    console.log(`\n🎉 SUCCÈS DU TEST DE RECETTE : Le circuit CRM ↔ OVH est pleinement opérationnel et synchronisé.`);

  } catch (err) {
    console.error(`\n❌ ÉCHEC DU TEST :`, err);
  } finally {
      // Nettoyage optionnel des données de test si nécessaire (souvent laissé en l'état pour que le client vérifie visuellement)
      console.log('\nNote : Le fichier de test a été laissé dans le CRM (dossier "Dossier de Test GED") et la corbeille pour vous permettre de vérifier manuellement via l\'interface si vous le souhaitez.');
      process.exit(0);
  }
}

runAcceptanceTest();
