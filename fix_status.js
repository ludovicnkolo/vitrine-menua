const fs = require('fs');
const file = 'apps/admin/src/pages/InboxPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/>\s*\{m\.status\}\s*<\/span>/g, '>{m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase().replace(/_/g, " ")}</span>');

fs.writeFileSync(file, content);
console.log("Fixed status cases");
