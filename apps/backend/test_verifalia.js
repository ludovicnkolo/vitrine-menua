const verifalia = require('./src/services/verifalia');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  try {
    console.log('=== TEST 1 : Authentification Verifalia ===');
    const token = await verifalia.getToken();
    console.log('✅ Token obtenu (début):', token.substring(0, 20) + '...');

    console.log('\n=== TEST 2 : Soumission d\'une vérification ===');
    const emailToTest = 'rosettef@hotmail.fr';
    const job = await verifalia.submitVerification(emailToTest);
    console.log('✅ Job créé. ID:', job.id, '| Status initial:', job.status);

    console.log('\n=== TEST 3 : Attente et récupération du résultat ===');
    let fetchedJob = job;
    let attempts = 0;
    while (fetchedJob.status !== 'Completed' && attempts < 10) {
      console.log(`   Tentative ${attempts + 1}/10 — status: ${fetchedJob.status}. Attente 3s...`);
      await sleep(3000);
      fetchedJob = await verifalia.getJob(job.id);
      attempts++;
    }

    if (fetchedJob.status === 'Completed') {
      console.log('✅ Job terminé!');
      const entriesData = await verifalia.getJobEntries(job.id);
      const result = entriesData.data[0];
      console.log('\n=== RÉSULTAT FINAL ===');
      console.log('  Email testé      :', emailToTest);
      console.log('  Classification   :', result.classification);
      console.log('  Status           :', result.status);
      console.log('  ASCII Email OK   :', result.asciiEmailAddressDomainPart);
    } else {
      console.log('⚠️  Job non terminé après 10 tentatives. Status final:', fetchedJob.status);
    }

  } catch (error) {
    console.error('\n❌ Test échoué:', error.message || error);
    if (error.code) {
      console.error('   Code erreur:', error.code);
    }
  }
}

test();

