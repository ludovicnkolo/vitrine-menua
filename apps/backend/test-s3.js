const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');


const API_URL = 'http://localhost:4000/api';

async function testS3() {
  console.log('--- TEST UPLOAD S3 DANS DOCKER ---');

  // 1. Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'r.fouelefack@menuaconsulting.com', password: 'Menua2026?consulting' })
  });

  if (!loginRes.ok) {
    console.error('❌ Échec login:', loginRes.status);
    return;
  }
  const token = (await loginRes.json()).token;
  console.log('✅ Connecté.');

  // 2. Prepare file
  const testFilePath = path.join(os.tmpdir(), 'test_s3_docker.txt');
  fs.writeFileSync(testFilePath, 'Ceci est un test depuis Docker vers S3 !');

  const fileBuffer = fs.readFileSync(testFilePath);
  const blob = new Blob([fileBuffer], { type: 'text/plain' });
  
  const formData = new FormData();
  formData.append('bucket', 'test_ged');
  formData.append('file', blob, 'test_s3_docker.txt');

  // 3. Upload
  console.log('📤 Envoi du fichier vers /api/files/upload...');
  const uploadRes = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (uploadRes.ok) {
    const data = await uploadRes.json();
    console.log('✅ Fichier sauvegardé sur S3 avec succès !');
    console.log('   Chemin (S3 Key) :', data.file?.path || data.url);
  } else {
    console.error('❌ Échec upload:', uploadRes.status, await uploadRes.text());
  }
}

testS3();
