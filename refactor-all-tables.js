const fs = require('fs');
const path = require('path');

const dir = 'apps/admin/src/pages/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'InboxPage.jsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <strong style={{display: 'block'}}> with <strong className="truncate-text" ...>
  content = content.replace(/<strong\s+style=\{\{display:\s*'block'[^}]*\}\}\s*>/g, match => {
    return match.replace("display: 'block'", '').replace('<strong ', '<strong className="truncate-text" ');
  });

  // Specifically for UsersPage
  content = content.replace(/<span\s+style=\{\{color:\s*'var\(--text-muted\)',\s*fontSize:\s*'0.875rem'\}\}\s*>/g, '<span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>');
  
  // For standard td with text (like Date or basic strings)
  // This regex looks for <td>{...}</td> or <td>...</td> where ... doesn't contain tags
  content = content.replace(/<td>\s*([^<]*[^<\s])\s*<\/td>/g, '<td><div className="truncate-text">$1</div></td>');
  content = content.replace(/<td>\s*(\{[^}]*\})\s*<\/td>/g, '<td><div className="truncate-text">$1</div></td>');
  
  // Specific pattern for <td style="...">...</td>
  content = content.replace(/<td\s+style=\{\{([^}]+)\}\}>\s*([^<]*[^<\s])\s*<\/td>/g, '<td><div className="truncate-text" style={{$1}}>$2</div></td>');
  content = content.replace(/<td\s+style=\{\{([^}]+)\}\}>\s*(\{[^}]*\})\s*<\/td>/g, '<td><div className="truncate-text" style={{$1}}>$2</div></td>');

  fs.writeFileSync(filePath, content);
});

console.log('Refactored tables in all JSX files');
