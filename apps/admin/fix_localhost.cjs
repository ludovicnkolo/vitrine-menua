const fs = require('fs');
const path = require('path');

const directory = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/admin/src/pages';
const filesToFix = ['LoginPage.jsx', 'UsersPage.jsx', 'RolesPage.jsx', 'InboxPage.jsx', 'AuditPage.jsx'];

filesToFix.forEach(file => {
  const filePath = path.join(directory, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded localhost
    content = content.replace(/'http:\/\/localhost:4000\/api/g, "(import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api");
    content = content.replace(/`http:\/\/localhost:4000\/api/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
});
