const fs = require('fs');
const file = 'apps/admin/src/pages/InboxPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement script previously changed Date td to:
// <td><div className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div></td>
// and
// <td><div className="truncate-text" style={{color: "var(--text-muted)"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div></td>

content = content.replace(
  /<td><div className="truncate-text" style=\{\{color: "var\(--text-muted\)", fontSize: "0\.875rem"\}\}>(\{new Date\(m\.createdAt\)\.toLocaleString\("fr-FR"[^}]+\}\})<\/div><\/td>/g,
  '<td style={{color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap"}}>$1</td>'
);

content = content.replace(
  /<td><div className="truncate-text" style=\{\{color: "var\(--text-muted\)"\}\}>(\{new Date\(m\.createdAt\)\.toLocaleString\("fr-FR"[^}]+\}\})<\/div><\/td>/g,
  '<td style={{color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap"}}>$1</td>'
);

fs.writeFileSync(file, content);
console.log("Fixed dates in InboxPage");
