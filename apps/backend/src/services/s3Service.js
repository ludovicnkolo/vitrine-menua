const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { NodeHttpHandler } = require("@smithy/node-http-handler");
const https = require("https");
require("dotenv").config({ path: "../../.env" }); // Adjust according to execution context

const ipv4RequestHandler = new NodeHttpHandler({
  httpsAgent: new https.Agent({ family: 4, keepAlive: true }),
});

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // often required for non-AWS S3-compatible APIs
  requestHandler: ipv4RequestHandler,
});

const BUCKET_NAME = process.env.S3_BUCKET || "menua-ged-prod";

// Initialize the S3 Client for the Public Website Assets
const s3PublicClient = new S3Client({
  endpoint: process.env.S3_ENDPOINT, // Réutilisé
  region: process.env.S3_REGION,     // Réutilisé
  credentials: {
    accessKeyId: process.env.S3_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.S3_PUBLIC_SECRET_KEY,
  },
  forcePathStyle: true,
  requestHandler: ipv4RequestHandler,
});

const PUBLIC_BUCKET_NAME = process.env.S3_PUBLIC_BUCKET || "menua-site-public-assets";

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
 * Uploads a file buffer to the Public OVH S3 bucket (site web assets).
 * Applique l'ACL public-read par défaut pour que l'image soit visible en ligne.
 * @param {Buffer} fileBuffer - The file content in memory.
 * @param {string} fileName - The destination path/name in the bucket.
 * @param {string} mimeType - The file's MIME type.
 * @returns {Promise<string>} The URL of the uploaded public file.
 */
async function uploadToPublicS3(fileBuffer, fileName, mimeType) {
  const command = new PutObjectCommand({
    Bucket: PUBLIC_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read", // Requis par OVH pour que l'image soit lisible par tous
  });

  await s3PublicClient.send(command);
  return `https://${PUBLIC_BUCKET_NAME}.s3.${process.env.S3_REGION}.io.cloud.ovh.net/${fileName}`;
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
      // V3 NOTE: Dans un bucket versionné OVH, si ListObjectVersions ne retourne aucune version
      // ni delete marker pour cette clé, deux cas possibles :
      // 1. Le fichier n'existe pas (déjà purgé ou jamais uploadé) → OK
      // 2. Le listing a retourné une liste incomplète (pagination non gérée) → investigation manuelle
      // On NE fait PAS de simple deleteFromS3 car cela créerait un delete marker (≠ purge physique).
      console.warn(`[S3 PURGE] Aucune version trouvée pour la clé "${fileKey}". Le fichier est peut-être déjà purgé ou absent du bucket "${BUCKET_NAME}". Vérification manuelle recommandée si inattendu.`);
    }
  } catch (error) {
    console.error(`[S3 PURGE ERROR] Failed to purge versions for ${fileKey}:`, error);
    // Fallback NON EXÉCUTÉ dans les erreurs : un simple delete sur bucket versionné
    // crée un delete marker, ce qui n'est pas une purge physique.
    // L'erreur doit être levée pour que l'appelant sache que la purge a échoué.
    throw error;
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

/**
 * Liste les objets du bucket S3 privé avec un préfixe donné (ex: backups/database/)
 */
async function listObjectsFromS3(prefix = "") {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });
  const res = await s3Client.send(command);
  return res.Contents || [];
}

/**
 * Télécharge un objet S3 sous forme de Buffer
 */
async function getObjectBufferFromS3(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const res = await s3Client.send(command);
  const chunks = [];
  for await (const chunk of res.Body) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = {
  s3Client,
  s3PublicClient,
  BUCKET_NAME,
  PUBLIC_BUCKET_NAME,
  uploadToS3,
  uploadToPublicS3,
  getPresignedUrl,
  fileExistsInS3,
  verifyUploadIntegrity,
  deleteFromS3,
  purgeFromS3,
  renameInS3,
  listObjectsFromS3,
  getObjectBufferFromS3,
};
