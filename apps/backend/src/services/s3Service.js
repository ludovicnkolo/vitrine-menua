const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  HeadObjectCommand,
  CopyObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config({ path: "../../.env" }); // Adjust according to execution context

// Initialize the S3 Client with OVH parameters
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // often required for non-AWS S3-compatible APIs
});

const BUCKET_NAME = process.env.S3_BUCKET || "menua-ged-prod";

/**
 * Uploads a file buffer to OVH S3.
 * @param {Buffer} fileBuffer - The file content in memory.
 * @param {string} fileName - The destination path/name in the bucket.
 * @param {string} mimeType - The file's MIME type.
 * @returns {Promise<string>} The key of the uploaded file.
 */
async function uploadToS3(fileBuffer, fileName, mimeType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    // Note: To enable SSE, S3-compatible storage must support it. Usually, OVH supports it out of the box or you specify ServerSideEncryption: "AES256"
    ServerSideEncryption: "AES256",
  });

  await s3Client.send(command);
  return fileName;
}

/**
 * Generates a presigned URL to view or download a file securely.
 * @param {string} fileKey - The key of the file in the bucket.
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour).
 * @param {boolean} inline - If true, displays in browser. If false, forces download.
 * @returns {Promise<string>} The presigned URL.
 */
async function getPresignedUrl(fileKey, expiresIn = 3600, inline = true) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: inline
      ? "inline"
      : `attachment; filename="${fileKey.split("/").pop()}"`,
  });

  // Create the presigned URL
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Checks if a file exists in the bucket.
 * @param {string} fileKey - The key of the file.
 * @returns {Promise<boolean>} True if it exists, false otherwise.
 */
async function fileExistsInS3(fileKey) {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Deletes a file from the S3 bucket (writes a delete marker if versioned).
 * @param {string} fileKey - The key of the file to delete.
 */
async function deleteFromS3(fileKey) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Permanently purges a file and all its historical versions and delete markers from S3.
 * Essential for versioned buckets (OVH Object Storage with S3 versioning enabled).
 * @param {string} fileKey - The key of the file to permanently purge.
 */
async function purgeFromS3(fileKey) {
  if (!fileKey) return;
  try {
    const listVersionsCmd = new ListObjectVersionsCommand({
      Bucket: BUCKET_NAME,
      Prefix: fileKey,
    });
    const versionData = await s3Client.send(listVersionsCmd);

    const objectsToDelete = [];

    if (versionData.Versions && versionData.Versions.length > 0) {
      for (const v of versionData.Versions) {
        if (v.Key === fileKey) {
          objectsToDelete.push({ Key: v.Key, VersionId: v.VersionId });
        }
      }
    }

    if (versionData.DeleteMarkers && versionData.DeleteMarkers.length > 0) {
      for (const dm of versionData.DeleteMarkers) {
        if (dm.Key === fileKey) {
          objectsToDelete.push({ Key: dm.Key, VersionId: dm.VersionId });
        }
      }
    }

    if (objectsToDelete.length > 0) {
      const deleteCmd = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: objectsToDelete,
          Quiet: true,
        },
      });
      await s3Client.send(deleteCmd);
      console.log(`[S3 PURGE] Purged ${objectsToDelete.length} versions/markers for ${fileKey}`);
    } else {
      // Fallback: standard delete if no version records returned
      await deleteFromS3(fileKey);
    }
  } catch (error) {
    console.error(`[S3 PURGE ERROR] Failed to purge versions for ${fileKey}:`, error);
    try {
      await deleteFromS3(fileKey);
    } catch (fallbackErr) {
      // ignore fallback error
    }
  }
}

/**
 * Vérifie l'intégrité d'un fichier juste après son upload en S3.
 * Lance une erreur si la clé n'existe pas, pour prévenir tout NoSuchKey ultérieur.
 * @param {string} fileKey - La clé S3 à vérifier.
 * @throws {Error} Si le fichier n'est pas trouvé après upload.
 */
async function verifyUploadIntegrity(fileKey) {
  const exists = await fileExistsInS3(fileKey);
  if (!exists) {
    throw new Error(
      `[S3 INTEGRITY] Fichier introuvable après upload : ${fileKey}. Possible erreur OVH ou désynchronisation.`
    );
  }
}

/**
 * Renomme un objet S3 : copie vers la nouvelle clé puis suppression de l'ancienne.
 * S3 ne supporte pas le renommage natif — cette opération est atomique côté applicatif.
 * @param {string} oldKey - La clé S3 actuelle.
 * @param {string} newKey - La nouvelle clé S3 cible.
 * @returns {Promise<string>} La nouvelle clé S3.
 */
async function renameInS3(oldKey, newKey) {
  // Étape 1 : Copier l'objet vers la nouvelle clé
  const copyCmd = new CopyObjectCommand({
    Bucket: BUCKET_NAME,
    CopySource: `/${BUCKET_NAME}/${oldKey}`,
    Key: newKey,
    ServerSideEncryption: "AES256",
  });
  await s3Client.send(copyCmd);

  // Étape 2 : Vérifier que la copie est bien arrivée
  const copied = await fileExistsInS3(newKey);
  if (!copied) {
    throw new Error(`[S3 RENAME] Copie échouée : ${newKey} introuvable après CopyObject.`);
  }

  // Étape 3 : Supprimer l'ancienne clé (delete marker si bucket versionné)
  await deleteFromS3(oldKey);
  console.log(`[S3 RENAME] ${oldKey} → ${newKey}`);
  return newKey;
}

module.exports = {
  s3Client,
  uploadToS3,
  getPresignedUrl,
  fileExistsInS3,
  verifyUploadIntegrity,
  deleteFromS3,
  purgeFromS3,
  renameInS3,
};
