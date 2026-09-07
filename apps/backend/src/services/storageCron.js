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

async function processStorageCleanup() {
  console.log('[Storage Cron] Démarrage du nettoyage des fichiers orphelins (GED & CMS)...');
  try {
    if (!BUCKET_NAME) {
      console.error('[Storage Cron] S3_BUCKET non défini.');
      return;
    }

    // ─── 1. LISTER LES FICHIERS S3 ───
    const listS3Files = async (prefix) => {
      let isTruncated = true;
      let continuationToken = undefined;
      const keys = [];
      while (isTruncated) {
        const command = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        });
        const response = await s3Client.send(command);
        if (response.Contents) {
          // Filtrer les objets pour ignorer ceux modifiés il y a moins de 24h (délai de grâce)
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          response.Contents.forEach(item => {
            if (now - item.LastModified.getTime() > oneDay) {
              keys.push(item.Key);
            }
          });
        }
        isTruncated = response.IsTruncated;
        continuationToken = response.NextContinuationToken;
      }
      return keys;
    };

    const gedKeys = await listS3Files('ged/');
    const cmsKeys = await listS3Files('cms/images/');
    
    console.log(`[Storage Cron] Trouvés dans S3 (> 24h) : ${gedKeys.length} GED, ${cmsKeys.length} CMS.`);

    // ─── 2. RÉCUPÉRER LES RÉFÉRENCES BDD ───
    
    // A. Documents (GED)
    const documents = await prisma.document.findMany({ select: { url: true } });
    const dbGedUrls = new Set(documents.map(doc => doc.url).filter(Boolean));

    // B. Publications (CMS)
    const publications = await prisma.publication.findMany({ select: { coverImage: true, sections: true } });
    const dbCmsUrls = new Set();
    publications.forEach(pub => {
      if (pub.coverImage) dbCmsUrls.add(pub.coverImage);
      if (pub.sections) {
        try {
          const secs = typeof pub.sections === 'string' ? JSON.parse(pub.sections) : pub.sections;
          if (Array.isArray(secs)) {
            secs.forEach(s => { if (s.imageKey) dbCmsUrls.add(s.imageKey); });
          }
        } catch(e) {}
      }
    });

    // ─── 3. IDENTIFIER LES ORPHELINS ───
    const gedOrphans = gedKeys.filter(key => !dbGedUrls.has(key));
    const cmsOrphans = cmsKeys.filter(key => !dbCmsUrls.has(key));
    const allOrphans = [...gedOrphans, ...cmsOrphans];

    console.log(`[Storage Cron] Orphelins identifiés : ${gedOrphans.length} GED, ${cmsOrphans.length} CMS.`);

    if (allOrphans.length === 0) return;

    // ─── 4. SUPPRIMER LES ORPHELINS ───
    let deletedCount = 0;
    for (const orphanKey of allOrphans) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: orphanKey
        }));
        deletedCount++;
        console.log(`[Storage Cron] Supprimé: ${orphanKey}`);
      } catch (err) {
        console.error(`[Storage Cron] Erreur lors de la suppression de ${orphanKey}:`, err.message);
      }
    }

    console.log(`[Storage Cron] Nettoyage terminé. ${deletedCount} fichiers supprimés.`);
  } catch (error) {
    console.error('[Storage Cron] Erreur générale lors du nettoyage:', error);
  }
}

function startStorageCron() {
  // Exécuter une fois par jour (24 heures)
  const INTERVAL_24H = 24 * 60 * 60 * 1000;
  setInterval(processStorageCleanup, INTERVAL_24H);
  
  // Exécuter au démarrage (après un petit délai pour ne pas ralentir le startup)
  setTimeout(processStorageCleanup, 15000);
}

module.exports = { startStorageCron };
