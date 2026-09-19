const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { uploadToS3 } = require('./s3Service');

const prisma = new PrismaClient();

async function syncLocalUploadsToS3() {
  console.log('[S3 Sync] Démarrage de la synchronisation des uploads locaux vers S3...');
  try {
    const publications = await prisma.publication.findMany({
      where: {
        OR: [
          { coverImage: { contains: '/uploads/cms/images/' } },
          { sections: { contains: '/uploads/cms/images/' } }
        ]
      }
    });

    if (publications.length === 0) {
      console.log('[S3 Sync] Aucune image locale en attente de synchronisation.');
      return;
    }

    let syncCount = 0;

    for (const pub of publications) {
      let dataToUpdate = {};
      let needsUpdate = false;
      let filesToDelete = [];

      // 1. Process Cover Image
      if (pub.coverImage && pub.coverImage.includes('/uploads/cms/images/')) {
        const fileName = pub.coverImage.split('/').pop();
        const s3Key = await processFileToS3(fileName);
        if (s3Key) {
          dataToUpdate.coverImage = s3Key;
          needsUpdate = true;
          filesToDelete.push(fileName);
        }
      }

      // 2. Process Sections Images
      if (pub.sections && pub.sections.includes('/uploads/cms/images/')) {
        try {
          const sections = JSON.parse(pub.sections);
          let sectionsModified = false;
          
          for (const s of sections) {
            if (s.imageKey && s.imageKey.includes('/uploads/cms/images/')) {
              const fileName = s.imageKey.split('/').pop();
              const s3Key = await processFileToS3(fileName);
              if (s3Key) {
                s.imageKey = s3Key;
                sectionsModified = true;
                filesToDelete.push(fileName);
              }
            }
          }
          
          if (sectionsModified) {
            dataToUpdate.sections = JSON.stringify(sections);
            needsUpdate = true;
          }
        } catch (e) {
          console.error(`[S3 Sync] Erreur lors du parsing des sections (Pub ID: ${pub.id}):`, e.message);
        }
      }

      // 3. Update DB & Delete Files
      if (needsUpdate) {
        await prisma.publication.update({
          where: { id: pub.id },
          data: dataToUpdate
        });
        
        console.log(`[S3 Sync] Base de données mise à jour pour la publication ${pub.id}`);
        
        for (const fileName of filesToDelete) {
          deleteLocalFiles(fileName);
        }
        syncCount++;
      }
    }

    console.log(`[S3 Sync] Synchronisation terminée. ${syncCount} publication(s) mise(s) à jour.`);
  } catch (error) {
    console.error('[S3 Sync] Erreur générale lors de la synchronisation:', error);
  }
}

async function processFileToS3(fileName) {
  const adminPath = path.join(__dirname, '../../../admin/public/uploads/cms/images', fileName);
  const vitrinePath = path.join(__dirname, '../../../vitrine/public/uploads/cms/images', fileName);
  
  // Choose whichever exists
  let targetPath = null;
  if (fs.existsSync(adminPath)) targetPath = adminPath;
  else if (fs.existsSync(vitrinePath)) targetPath = vitrinePath;
  
  if (!targetPath) {
    console.warn(`[S3 Sync] Fichier local introuvable pour synchronisation : ${fileName}`);
    return null; // Can't upload if it doesn't exist
  }

  try {
    const buffer = fs.readFileSync(targetPath);
    // Determine mime type based on extension
    const ext = path.extname(fileName).toLowerCase();
    let mimetype = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') mimetype = 'image/jpeg';
    else if (ext === '.png') mimetype = 'image/png';
    else if (ext === '.gif') mimetype = 'image/gif';
    else if (ext === '.webp') mimetype = 'image/webp';
    else if (ext === '.svg') mimetype = 'image/svg+xml';

    const s3Key = `cms/images/${fileName}`;
    await uploadToS3(buffer, s3Key, mimetype);
    console.log(`[S3 Sync] Succès de l'upload vers S3 : ${s3Key}`);
    return s3Key;
  } catch (err) {
    console.error(`[S3 Sync] Échec de l'upload pour ${fileName}:`, err.message);
    return null;
  }
}

function deleteLocalFiles(fileName) {
  const adminPath = path.join(__dirname, '../../../admin/public/uploads/cms/images', fileName);
  const vitrinePath = path.join(__dirname, '../../../vitrine/public/uploads/cms/images', fileName);
  
  try {
    if (fs.existsSync(adminPath)) {
      fs.unlinkSync(adminPath);
      console.log(`[S3 Sync] Fichier supprimé (Admin) : ${fileName}`);
    }
    if (fs.existsSync(vitrinePath)) {
      fs.unlinkSync(vitrinePath);
      console.log(`[S3 Sync] Fichier supprimé (Vitrine) : ${fileName}`);
    }
  } catch (err) {
    console.error(`[S3 Sync] Erreur lors de la suppression locale de ${fileName}:`, err.message);
  }
}

function startLocalUploadSyncCron() {
  // Exécuter toutes les 24 heures
  const INTERVAL_24H = 24 * 60 * 60 * 1000;
  setInterval(syncLocalUploadsToS3, INTERVAL_24H);
  
  // Exécuter une fois au démarrage après 30 secondes
  setTimeout(syncLocalUploadsToS3, 30000);
}

module.exports = { startLocalUploadSyncCron, syncLocalUploadsToS3 };
