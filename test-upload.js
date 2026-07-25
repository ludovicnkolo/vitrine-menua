const fs = require('fs');
async function test() {
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('bucket', 'users_id_cards');
  formData.append('file', fs.createReadStream('/tmp/test.txt'));
  
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
