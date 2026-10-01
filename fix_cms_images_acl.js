/**
 * fix_cms_images_acl.js
 * Applique l'ACL public-read sur toutes les images CMS dans OVH S3.
 * Usage: node fix_cms_images_acl.js
 */
const { S3Client, ListObjectsV2Command, PutObjectAclCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "menua-ged-prod";

function buildPublicUrl(key) {
  const endpoint = (process.env.S3_ENDPOINT || "https://s3.eu-west-par.io.cloud.ovh.net/")
    .replace(/\/+$/, "").replace(/^https?:\/\//, "");
  return `https://${BUCKET}.${endpoint}/${key}`;
}

async function fixAllCmsImagesAcl() {
  console.log("🔍 Récupération des images CMS dans OVH S3...");
  let continuationToken = undefined;
  let totalFixed = 0;
  let totalErrors = 0;

  do {
    const response = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: "cms/images/", ContinuationToken: continuationToken,
    }));
    const objects = response.Contents || [];
    if (objects.length === 0 && !continuationToken) {
      console.log("ℹ️  Aucune image CMS trouvée."); break;
    }
    for (const obj of objects) {
      try {
        await s3.send(new PutObjectAclCommand({ Bucket: BUCKET, Key: obj.Key, ACL: "public-read" }));
        console.log(`  ✅ ${obj.Key}\n     → ${buildPublicUrl(obj.Key)}`);
        totalFixed++;
      } catch (err) {
        console.error(`  ❌ ${obj.Key}: ${err.message}`);
        totalErrors++;
      }
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log(`\n📊 ${totalFixed} image(s) corrigée(s), ${totalErrors} erreur(s).`);
}

fixAllCmsImagesAcl().catch(err => { console.error("Erreur fatale:", err); process.exit(1); });
