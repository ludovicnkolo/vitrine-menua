const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the wrapper style
content = content.replace(/position:\s*'fixed',\s*top:\s*0,\s*left:\s*0,\s*right:\s*0,\s*bottom:\s*0,\s*background:\s*'rgba\(0,0,0,0\.[56]\)',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*justifyContent:\s*'center',\s*zIndex:\s*(100|300)/g,
  "position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', display: 'block', padding: '2rem', zIndex: 50, overflowY: 'auto'");

// 2. Replace the card style 
content = content.replace(/className="card"\s*style={{width:\s*'600px',\s*(?:padding:\s*'2rem',\s*)?maxHeight:\s*'90vh',\s*overflowY:\s*'auto'(?:,\s*position:\s*'relative')?}}/g,
  'className="card page-modal-content" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}');

// 3. Replace the X button with a "Retour" button for a better page feel
// <button onClick={X} style={{...}}><X size={20}/></button>
content = content.replace(/<button onClick={([^}]+)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}><X size={20}\/><\/button>/g,
  '<button onClick={$1} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>');

// 4. Also fix the file preview modal which has rgba(0,0,0,0.8), we KEEP it as a popup but we might need to ensure it's not affected
// It is 0.8, so the regex [56] won't match it. Perfect!

fs.writeFileSync(file, content);
console.log('Safe refactoring completed.');
