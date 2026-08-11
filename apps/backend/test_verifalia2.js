require('dotenv').config({path: '../../.env'});
const verifalia = require('./src/services/verifalia');

async function test(email) {
  try {
    const res = await verifalia.verifyEmailImmediate(email);
    console.log(`Email: ${email} -> Result:`, res);
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await test('rosettef@hotmail.fr');
  await test('temofauiy8@mailinator.com');
  await test('fakejdfhkjdsfh@fakedns.com');
  await test('test@mailinator.com');
}
run();
