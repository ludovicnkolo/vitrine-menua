const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dossier = await prisma.dossier.findFirst({
    where: { name: 'ludovicDoc' },
    include: { documents: true }
  });
  const doc = dossier.documents[0];
  if (!doc) return console.log("no doc");
  console.log("Attempting to delete doc:", doc.id);
  
  const jwt = require('jsonwebtoken');
  require('dotenv').config({ path: '../../../.env' });
  const token = jwt.sign({ id: 'MASTER-ADMIN', role: 'ADMIN' }, process.env.JWT_SECRET || 'CHANGE_MOI_EN_PRODUCTION_openssl_rand_base64_64');
  
  const res = await fetch(`http://localhost:4000/api/crm/documents/${doc.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const text = await res.text();
  console.log("Response:", res.status, text);
}
main().finally(() => prisma.$disconnect());
