const fs = require('fs');
const file = 'apps/admin/src/pages/InboxPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Contact
content = content.replace(
  /<strong style=\{\{display: 'block', fontSize: '0.875rem'\}\}>\{m.nomPrenom\}<\/strong>/g,
  '<strong className="truncate-text" style={{fontSize: "0.875rem"}}>{m.nomPrenom}</strong>'
);
content = content.replace(
  /<span style=\{\{color: 'var\(--text-muted\)', fontSize: '0.875rem'\}\}>\{m.email\}<\/span>/g,
  '<span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{m.email}</span>'
);
content = content.replace(
  /<td><span style=\{\{fontSize: '0.875rem'\}\}>\{m.contact\?\.typeBesoin \|\| m.objet\}<\/span><\/td>/g,
  '<td><span className="truncate-text" style={{fontSize: "0.875rem"}}>{m.contact?.typeBesoin || m.objet}</span></td>'
);

// Recrutement
content = content.replace(
  /<td><span style=\{\{fontSize: '0.875rem'\}\}>\{m.recrutement\?\.competenceCle \|\| m.objet\}<\/span><\/td>/g,
  '<td><span className="truncate-text" style={{fontSize: "0.875rem"}}>{m.recrutement?.competenceCle || m.objet}</span></td>'
);

// Personnel (and Date)
content = content.replace(
  /<td style=\{\{fontWeight: m.status === 'NOUVEAU' \? 600 : 400, fontSize: '0.875rem'\}\}>\{m.objet\}<\/td>/g,
  '<td><div className="truncate-text" style={{fontWeight: m.status === "NOUVEAU" ? 600 : 400, fontSize: "0.875rem"}}>{m.objet}</div></td>'
);

// Dates
content = content.replace(
  /<td style=\{\{color: 'var\(--text-muted\)', fontSize: '0.875rem'\}\}>\{new Date\(m.createdAt\)\.toLocaleString\('fr-FR', \{ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' \}\)\}<\/td>/g,
  '<td><div className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div></td>'
);
content = content.replace(
  /<td style=\{\{color: 'var\(--text-muted\)'\}\}>\{new Date\(m.createdAt\)\.toLocaleString\('fr-FR', \{ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' \}\)\}<\/td>/g,
  '<td><div className="truncate-text" style={{color: "var(--text-muted)"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</div></td>'
);

fs.writeFileSync(file, content);
console.log("Done");
