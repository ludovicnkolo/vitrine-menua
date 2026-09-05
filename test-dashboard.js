const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'apps/backend/.env' });
const token = jwt.sign({ id: 'someId', role: 'Administrateur' }, process.env.JWT_SECRET || 'fallback', { expiresIn: '1h' });
const fetch = require('axios');

async function run() {
  try {
    const res = await fetch.get('http://localhost:4000/api/crm/dashboard-stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
run();
