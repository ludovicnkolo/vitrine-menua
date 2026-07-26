const fs = require('fs');
const path = require('path');

const files = [
  'apps/admin/src/pages/AuditPage.jsx',
  'apps/admin/src/pages/SetupPasswordPage.jsx',
  'apps/admin/src/pages/LoginPage.jsx',
  'apps/admin/src/pages/RolesPage.jsx',
  'apps/admin/src/pages/UsersPage.jsx',
  'apps/admin/src/pages/InboxPage.jsx',
  'apps/admin/src/components/SmsModal.jsx',
  'apps/admin/src/components/GenericTaskPage.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove unused apiUrl variable
  content = content.replace(/const apiUrl = import\.meta\.env\.VITE_API_URL\s*;/g, '');
  
  // Check if getSafeApiUrl is imported
  if (!content.includes('getSafeApiUrl') || content.includes('import { getSafeApiUrl }')) {
    if (!content.includes('import { getSafeApiUrl }') && content.includes('getSafeApiUrl(')) {
       // Need to add import
       const importStatement = `import { getSafeApiUrl } from '../utils/helpers';\n`;
       content = importStatement + content;
    }
  } else {
    const importStatement = `import { getSafeApiUrl } from '../utils/helpers';\n`;
    content = importStatement + content;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Fixed imports in ' + files.length + ' files');
