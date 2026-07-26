const fs = require('fs');
const path = require('path');

const files = [
  'apps/vitrine/src/app/nous-rejoindre/page.tsx',
  'apps/vitrine/src/app/vos-besoins/page.tsx',
  'apps/vitrine/src/app/actualites/page.tsx',
  'apps/vitrine/src/app/page.tsx',
  'apps/vitrine/src/components/layout/Header.tsx',
  'apps/vitrine/src/app/nous-contacter/page.tsx',
  'apps/vitrine/src/app/nous-connaitre/page.tsx'
];

files.forEach(file => {
  const filePath = path.join('/home/kratos-financials-inc/Documents/kratos/site_web', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace instances of " & "
  // Be careful with translations. For simplicity, we can do a global replace for " & " 
  // but if it's in an English string we probably want " and "
  
  content = content.replaceAll(/"Reporting & Data", "Reporting & Data"/g, '"Reporting et Data", "Reporting and Data"');
  content = content.replaceAll(/"Risques & Conformité", "Risk & Compliance"/g, '"Risques et Conformité", "Risk and Compliance"');
  content = content.replaceAll(/"ACTUALITÉS FINANCIÈRES & RÉGLEMENTAIRES", "FINANCIAL & REGULATORY NEWS"/g, '"ACTUALITÉS FINANCIÈRES ET RÉGLEMENTAIRES", "FINANCIAL AND REGULATORY NEWS"');
  content = content.replaceAll(/"Actualités financières, comptables, patrimoniales & réglementaires", "Financial, accounting, wealth & regulatory news"/g, '"Actualités financières, comptables, patrimoniales et réglementaires", "Financial, accounting, wealth and regulatory news"');
  content = content.replaceAll(/"FINANCE & REPORTING", "FINANCE & REPORTING"/g, '"FINANCE ET REPORTING", "FINANCE AND REPORTING"');
  content = content.replaceAll(/"RISQUES & CONFORMITÉ", "RISKS & COMPLIANCE"/g, '"RISQUES ET CONFORMITÉ", "RISKS AND COMPLIANCE"');
  content = content.replaceAll(/"SUPPORT COMPTABLE & DATA", "ACCOUNTING & DATA SUPPORT"/g, '"SUPPORT COMPTABLE ET DATA", "ACCOUNTING AND DATA SUPPORT"');
  content = content.replaceAll(/"GESTION DE PATRIMOINE & SUPPORT CGP", "WEALTH MANAGEMENT & CGP SUPPORT"/g, '"GESTION DE PATRIMOINE ET SUPPORT CGP", "WEALTH MANAGEMENT AND CGP SUPPORT"');
  content = content.replaceAll(/"Finance & Accounting"/g, '"Finance and Accounting"');
  content = content.replaceAll(/"Finance & reporting", "Finance & reporting"/g, '"Finance et reporting", "Finance and reporting"');
  content = content.replaceAll(/"Risques & conformité", "Risk & compliance"/g, '"Risques et conformité", "Risk and compliance"');
  content = content.replaceAll(/"Support comptable & data", "Accounting & data support"/g, '"Support comptable et data", "Accounting and data support"');
  content = content.replaceAll(/"Mise en œuvre & formation", "Implementation & training"/g, '"Mise en œuvre et formation", "Implementation and training"');
  content = content.replaceAll(/"ACCRÉDITATIONS, CERTIFICATIONS & CADRE D'INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS & INTERVENTION FRAMEWORK"/g, '"ACCRÉDITATIONS, CERTIFICATIONS ET CADRE D\'INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS AND INTERVENTION FRAMEWORK"');
  content = content.replaceAll(/back & middle office/g, 'back et middle office');

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Replacements done');
