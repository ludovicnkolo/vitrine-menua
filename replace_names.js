const fs = require('fs');
const path = require('path');

const dir = 'apps/admin/src/pages/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace className="truncate-text" with className="truncate-name" ONLY for name columns
  // In InboxPage (m.nomPrenom)
  content = content.replace(/<strong className="truncate-text"(.*?)>(\{m\.nomPrenom\})<\/strong>/g, '<strong className="truncate-name"$1>$2</strong>');
  
  // In UsersPage (u.name, c.name)
  content = content.replace(/<strong className="truncate-text"(.*?)>(\{u\.name\})<\/strong>/g, '<strong className="truncate-name"$1>$2</strong>');
  content = content.replace(/<strong className="truncate-text"(.*?)>(\{c\.name\})<\/strong>/g, '<strong className="truncate-name"$1>$2</strong>');
  
  // In DossiersPage (d.name)
  content = content.replace(/<strong className="truncate-text"(.*?)>(\{d\.name\})<\/strong>/g, '<strong className="truncate-name"$1>$2</strong>');

  // In RolesPage (r.name)
  content = content.replace(/<strong className="truncate-text"(.*?)>(\{r\.name\})<\/strong>/g, '<strong className="truncate-name"$1>$2</strong>');

  // In TasksPage (t.assignedTo?.name)
  content = content.replace(/<div className="truncate-text"(.*?)>(\{t\.assignedTo\?\.name || 'Non assigné'\})<\/div>/g, '<div className="truncate-name"$1>$2</div>');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
