require('dotenv').config({ path: '../../.env' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  endpoint: 'https://s3.par.perf.cloud.ovh.net',
  region: 'par',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});
async function test() {
  try {
    const buf = Buffer.from('test');
    await s3Client.send(new PutObjectCommand({ Bucket: 'menua-ged-prod', Key: 'test.txt', Body: buf }));
    console.log('Upload successful to par.perf');
  } catch (err) {
    console.error('Upload failed:', err.message);
  }
}
test();
