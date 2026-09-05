const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:4000/api';
let token = '';
let createdDossierId = '';
let createdTacheId = '';

async function runTests() {
  console.log('🔄 DEBUT DES TESTS SUR LE CONTENEUR DOCKER (localhost:4000)');

  // 1. LOGIN
  console.log('--- 1. AUTHENTIFICATION ---');
  let res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'r.fouelefack@menuaconsulting.com', password: 'Menua2026?consulting' })
  });
  if (res.ok) {
    const data = await res.json();
    token = data.token;
    console.log(`✅ Login réussi. Status: ${res.status}`);
  } else {
    console.error(`❌ Échec login. Status: ${res.status}`);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. DASHBOARD STATS
  console.log('--- 2. DASHBOARD STATS ---');
  res = await fetch(`${API_URL}/crm/dashboard-stats`, { headers });
  console.log(res.ok ? `✅ Stats récupérées. Status: ${res.status}` : `❌ Échec stats. Status: ${res.status}`);

  // 3. ROLES
  console.log('--- 3. RÔLES ---');
  res = await fetch(`${API_URL}/crm/roles`, { headers });
  console.log(res.ok ? `✅ Rôles récupérés. Status: ${res.status}` : `❌ Échec rôles. Status: ${res.status}`);

  // 4. USERS
  console.log('--- 4. UTILISATEURS ---');
  res = await fetch(`${API_URL}/crm/users`, { headers });
  console.log(res.ok ? `✅ Utilisateurs récupérés. Status: ${res.status}` : `❌ Échec utilisateurs. Status: ${res.status}`);

  // 5. DOSSIERS (GET & POST)
  console.log('--- 5. DOSSIERS ---');
  res = await fetch(`${API_URL}/crm/dossiers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: `Dossier Docker Test ${Date.now()}`,
      clientName: 'Client Docker',
      status: 'A_FAIRE',
      priority: 'HAUTE',
      categorie: 'Dossiers clients'
    })
  });
  if (res.ok) {
    const data = await res.json();
    createdDossierId = data.id;
    console.log(`✅ Création dossier réussie. ID: ${createdDossierId}. Status: ${res.status}`);
  } else {
    console.error(`❌ Échec création dossier. Status: ${res.status} - ${await res.text()}`);
  }

  res = await fetch(`${API_URL}/crm/dossiers`, { headers });
  console.log(res.ok ? `✅ Liste des dossiers récupérée. Status: ${res.status}` : `❌ Échec liste dossiers. Status: ${res.status}`);

  // 6. TASKS (MISSIONS) (GET & POST)
  console.log('--- 6. TÂCHES / MISSIONS ---');
  if (createdDossierId) {
    res = await fetch(`${API_URL}/crm/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        description: `Mission Docker Test ${Date.now()}`,
        status: 'NOUVEAU',
        dossierId: createdDossierId
      })
    });
    if (res.ok) {
      const data = await res.json();
      createdTacheId = data.id;
      console.log(`✅ Création tâche (mission) réussie. ID: ${createdTacheId}. Status: ${res.status}`);
    } else {
      console.error(`❌ Échec création tâche (mission). Status: ${res.status} - ${await res.text()}`);
    }
  }

  res = await fetch(`${API_URL}/crm/tasks`, { headers });
  console.log(res.ok ? `✅ Liste des tâches (missions) récupérée. Status: ${res.status}` : `❌ Échec liste tâches (missions). Status: ${res.status}`);

  // 7. CMS (PUBLICATIONS)
  console.log('--- 7. CMS ---');
  const pubTitle = `Pub Docker ${Date.now()}`;
  res = await fetch(`${API_URL}/cms`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: pubTitle,
      type: 'ACTUALITE',
      category: 'DATA ET REPORTING',
      status: 'PUBLIE'
    })
  });
  console.log(res.ok ? `✅ Création publication réussie. Status: ${res.status}` : `❌ Échec création publication. Status: ${res.status}`);

  res = await fetch(`${API_URL}/cms/public?type=ACTUALITE`);
  if (res.ok) {
    const data = await res.json();
    const found = data.data.find(p => p.title === pubTitle);
    console.log(found ? `✅ Publication trouvée dans le flux public. Status: ${res.status}` : `❌ Publication introuvable dans le flux public.`);
  } else {
    console.log(`❌ Échec liste publications publiques. Status: ${res.status}`);
  }



  // 9. CLEANUP (Suppression du dossier test)
  console.log('--- 9. NETTOYAGE ---');
  if (createdDossierId) {
    res = await fetch(`${API_URL}/crm/dossiers/${createdDossierId}`, { method: 'DELETE', headers });
    console.log(res.ok ? `✅ Nettoyage du dossier réussi. Status: ${res.status}` : `❌ Échec nettoyage dossier. Status: ${res.status}`);
  }

  console.log('🏁 FIN DES TESTS DOCKER');
}

runTests();
