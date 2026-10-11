const fs = require('fs');
const files = [
  'apps/admin/src/pages/DossiersPage.jsx',
  'apps/admin/src/components/GenericTaskPage.jsx',
  'apps/admin/src/components/SmsModal.jsx'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace cases where className="input-field" is somewhere before another className="w-full"
    content = content.replace(/className="input-field"\s*([^>]*)className="([^"]*)"/g, (match, middle, c2) => {
      return `${middle}className="input-field ${c2}"`;
    });

    content = content.replace(/className="w-full"\s*([^>]*)className="([^"]*)"/g, (match, middle, c2) => {
      return `${middle}className="w-full ${c2}"`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
});
