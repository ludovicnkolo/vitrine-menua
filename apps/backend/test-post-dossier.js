const http = require('node:http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'MASTER-ADMIN', email: 'master@admin.com', role: 'ADMIN' }, process.env.JWT_SECRET || 'CHANGE_MOI_EN_PRODUCTION_openssl_rand_base64_64');

const data = JSON.stringify({
  name: 'Sapiente iure labori',
  description: 'Créé depuis la messagerie'
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/crm/dossiers',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
