require('dotenv').config({path: '../../.env'});
const verifaliaService = require('./src/services/verifalia');

async function testFull(email) {
  try {
    const job = await verifaliaService.submitVerification(email);
    let fetchedJob = job;
    while (fetchedJob.status !== 'Completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchedJob = await verifaliaService.getJob(job.id);
    }
    const entriesData = await verifaliaService.getJobEntries(job.id);
    console.log({
      message: 'Verification Completed',
      email: email,
      verification_result: entriesData.data[0]
    });
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await testFull('temofauiy8@mailinator.com');
}
run();
