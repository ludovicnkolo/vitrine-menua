const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the wrapper style. Make it absolute and use var(--bg-color)
content = content.replace(/position:\s*'fixed',\s*top:\s*0,\s*left:\s*0,\s*right:\s*0,\s*bottom:\s*0,\s*background:\s*'rgba\(0,0,0,0\.[56]\)',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*justifyContent:\s*'center',\s*zIndex:\s*(?:100|300)/g,
  "position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-color)', display: 'block', padding: '2rem', zIndex: 50, overflowY: 'auto'");

// 2. Fix cases where it already ran with var(--bg)
content = content.replace(/background:\s*'var\(--bg\)'/g, "background: 'var(--bg-color)'");

// 3. Replace the card style 
content = content.replace(/className="card"\s*style={{width:\s*'600px',\s*(?:padding:\s*'2rem',\s*)?maxHeight:\s*'90vh',\s*overflowY:\s*'auto'(?:,\s*position:\s*'relative')?}}/g,
  'className="card page-modal-content" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}');

// 4. Force replace the X button
// We can find <button onClick={...} ...><X size={20}/></button> and replace it.
content = content.replace(/<button onClick={([^}]+)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}>\s*<X size={20}\/>\s*<\/button>/g,
  '<button onClick={$1} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>');

// 5. In TasksPage, there is an X button without background: none sometimes?
content = content.replace(/<button onClick={([^}]+)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}><X size={20}\/><\/button>/g,
  '<button onClick={$1} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>');

// Let's just use a simpler regex for the button
content = content.replace(/<button onClick={([^}]+)}\s*style={{[^}]*}}>\s*<X size={20}\/>\s*<\/button>/g,
  '<button onClick={$1} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>');


fs.writeFileSync(file, content);
console.log('Script ran.');
