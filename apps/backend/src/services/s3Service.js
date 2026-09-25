const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
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
 * Deletes a file from the S3 bucket.
 * @param {string} fileKey - The key of the file to delete.
 */
async function deleteFromS3(fileKey) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

module.exports = {
  s3Client,
  uploadToS3,
  getPresignedUrl,
  fileExistsInS3,
  deleteFromS3,
};
