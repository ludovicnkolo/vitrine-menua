const fs = require('fs');
async function test() {
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('bucket', 'users_id_cards');
  formData.append('file', fs.createReadStream('/tmp/test.txt'));
  
  const res = await fetch('http://localhost:4000/api/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik1BU1RFUi1BRE1JTiIsImVtYWlsIjoibWVudWFjb25zdWx0aW5nQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4NDU1NTk3MSwiZXhwIjoxNzg0NTk5MTcxfQ.GUXIMU_mi30qNXdcJQxra7nOnR-quAZoGW_WbtjrA4A'
    },
    body: formData
  });
  console.log(await res.json());
}
test();
