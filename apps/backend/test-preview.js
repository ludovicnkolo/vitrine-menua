const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/api/files/view/dossiers/0b3183d0-2f34-4e85-b34e-de2f17c08e4d%2F382bc010-3c00-410e-9eec-f4d9ac853b5c-CRM_cahier_de_charge.pdf',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
