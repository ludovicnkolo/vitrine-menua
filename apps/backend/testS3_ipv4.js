require('dotenv').config({ path: '../../.env' });
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { uploadToS3 } = require('./src/services/s3Service');
async function test() {
  try {
    const buf = Buffer.from('test');
    await uploadToS3(buf, 'test-cms-upload.jpg', 'image/jpeg');
    console.log('Upload successful');
  } catch (err) {
    console.error('Upload failed:', err);
  }
}
test();
