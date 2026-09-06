const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'eu-west-par',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET;

async function processGedCleanup() {
  console.log('[GED Cron] Démarrage du nettoyage des fichiers orphelins...');
  try {
    if (!BUCKET_NAME) {
      console.error('[GED Cron] S3_BUCKET non défini.');
      return;
    }

    // 1. Lister tous les fichiers S3 dans le dossier ged/
    let isTruncated = true;
    let continuationToken = undefined;
    let s3Keys = [];

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: 'ged/', // On se limite au dossier ged/ (on pourrait ajouter temp/ plus tard)
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);
      if (response.Contents) {
        s3Keys.push(...response.Contents.map(item => item.Key));
      }
      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }

    console.log(`[GED Cron] ${s3Keys.length} fichiers trouvés dans OVH (ged/).`);

    if (s3Keys.length === 0) return;

    // 2. Récupérer toutes les URLs des documents en base (y compris soft deleted)
    const documents = await prisma.document.findMany({
      select: { url: true }
    });
    
    // Set pour recherche rapide
    const dbUrls = new Set(documents.map(doc => doc.url));

    // 3. Identifier les orphelins
    // On ajoute un délai de grâce (ex: ignorer les fichiers créés il y a moins d'une heure)
    // Mais via l'API ListObjects, on a LastModified. Pour simplifier, on filtre juste sur l'existence.
    // L'upload atomique réduit drastiquement les orphelins temporaires.
    const orphans = s3Keys.filter(key => !dbUrls.has(key));
    
    console.log(`[GED Cron] ${orphans.length} fichiers orphelins identifiés.`);

    // 4. Supprimer les orphelins
    let deletedCount = 0;
    for (const orphanKey of orphans) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: orphanKey
        }));
        deletedCount++;
        console.log(`[GED Cron] Supprimé: ${orphanKey}`);
      } catch (err) {
        console.error(`[GED Cron] Erreur lors de la suppression de ${orphanKey}:`, err.message);
      }
    }

    console.log(`[GED Cron] Nettoyage terminé. ${deletedCount} fichiers supprimés.`);
  } catch (error) {
    console.error('[GED Cron] Erreur générale lors du nettoyage:', error);
  }
}

function startGedCron() {
  // Exécuter une fois par jour (24 heures)
  const INTERVAL_24H = 24 * 60 * 60 * 1000;
  setInterval(processGedCleanup, INTERVAL_24H);
  
  // Exécuter au démarrage (après un petit délai pour ne pas ralentir le startup)
  setTimeout(processGedCleanup, 15000);
}

module.exports = { startGedCron };
