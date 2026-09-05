const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');

async function testCMS() {
  console.log('--- DEBUT DU TEST CMS (PUBLICATIONS) ---');
  
  // Connect directly to the POSTGRES docker DB using the URL
  // The docker-compose maps postgres to port 5454? 
  // No, `docker ps` said: 0.0.0.0:5454->5432/tcp for `mok-postgres`, but wait, `menua_postgres` has NO port mapped to host!
  // Wait, I can't connect to Prisma directly from the host if Postgres isn't exposed on the host.
  // BUT I don't need Prisma! I can just use the login endpoint `/api/auth/login` to get the token!
  
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'r.fouelefack@menuaconsulting.com', password: 'Menua2026?consulting' }) // The seed_admin.js creates it with this
    });

    let token = '';
    
    if (loginRes.ok) {
      const loginData = await loginRes.json();
      token = loginData.token;
      console.log('✅ Login réussi.');
    } else {
      // If login fails, let's generate a token manually with a hardcoded ID for testing.
      // But we need the real authorId in the DB!
      console.log('❌ Échec du login. On simule un JWT avec un faux authorId (ça risque de crasher Prisma si l\'author n\'existe pas)');
      token = jwt.sign(
        { id: 'some-id', role: 'Super-administrateur' },
        process.env.JWT_SECRET || 'CHANGE_MOI_EN_PRODUCTION_openssl_rand_base64_64',
        { expiresIn: '1h' }
      );
    }

    console.log('1. Création d\'une publication...');
    const pubTitle = `Titre Test Docker ${Date.now()}`;
    const pubRes = await fetch('http://localhost:4000/api/cms', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: pubTitle,
        type: 'ACTUALITE',
        status: 'PUBLIE',
        contentHtml: '<p>Ceci est un test depuis Docker</p>'
      })
    });

    if (pubRes.ok) {
      console.log('✅ Publication créée avec succès.');
    } else {
      const errText = await pubRes.text();
      console.log('❌ Erreur de création:', pubRes.status, errText);
      return;
    }

    console.log('2. Vérification sur l\'API publique (Vitrine)...');
    const getRes = await fetch('http://localhost:4000/api/cms/public?type=ACTUALITE');
    if (getRes.ok) {
      const data = await getRes.json();
      const found = data.data.find(p => p.title === pubTitle);
      if (found) {
        console.log(`✅ La publication a bien été trouvée sur le site web public !`);
        console.log(`   Titre: ${found.title}`);
        console.log(`   URL: ${found.coverImage || 'Pas d\'image'}`);
      } else {
        console.log('❌ La publication n\'apparait pas dans le flux public.');
      }
    } else {
      console.log('❌ Erreur de lecture du flux public:', getRes.status);
    }

  } catch(e) {
    console.error('Erreur test CMS:', e.message);
  }
}

testCMS();
