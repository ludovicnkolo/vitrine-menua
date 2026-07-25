const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

async function test() {
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('bucket', 'users_id_cards');
  
  // Utilisation sécurisée du répertoire temporaire du système
  const testFilePath = path.join(os.tmpdir(), 'test.txt');
  if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, 'Contenu de test pour upload');
  }
  
  formData.append('file', fs.createReadStream(testFilePath));
  
  const res = await fetch('http://localhost:4000/api/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TEST_ADMIN_TOKEN}`
    },
    body: formData
  });
  console.log(await res.json());
}
test();
