const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Update Database
async function updateDB() {
  const { PrismaClient } = require('./src/utils/statusRules.js') ? require('@prisma/client') : require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const models = [prisma.mission, prisma.tache, prisma.dossier];
    for (const model of models) {
      if (!model) continue;
      await model.updateMany({ where: { status: 'OUVERT' }, data: { status: 'NOUVEAU' } });
      await model.updateMany({ where: { status: 'EN_REVUE' }, data: { status: 'EN_COURS' } });
      await model.updateMany({ where: { status: 'TERMINE' }, data: { status: 'TERMINE' } });
      await model.updateMany({ where: { status: 'ANNULEE' }, data: { status: 'ANNULEE' } });
    }
    console.log("DB updated successfully.");
  } catch (e) {
    console.error("DB Update failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

// 2. Global search and replace in files
function replaceInFiles(dir) {
  const files = execSync(`find ${dir} -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.prisma"`).toString().split('\n').filter(Boolean);
  
  files.forEach(file => {
    if (file.includes('node_modules') || file.includes('.next') || file.includes('dist') || file.includes('.git') || file.includes('backups/')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace TERMINE with TERMINE
    content = content.replace(/TERMINE/g, 'TERMINE');
    
    // Replace ANNULEE with ANNULEE (careful not to make ANNULEEE)
    content = content.replace(/\bANNULE\b/g, 'ANNULEE');
    
    // Replace EN_REVUE with something? Actually we can just remove them from locales and badges.
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  });
}

async function run() {
  await updateDB();
  replaceInFiles('/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend');
  replaceInFiles('/home/kratos-financials-inc/Documents/kratos/site_web/apps/admin');
}

run();
