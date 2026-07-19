const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// The button string looks like this:
// <button onClick={() => setProcessMsg(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>

const buttonRegex = /<button onClick={([\s\S]*?)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}><X size={20}\/><\/button>/g;

content = content.replace(buttonRegex, (match, onClickContent) => {
  return `<button onClick={${onClickContent}} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>`;
});

fs.writeFileSync(file, content);
console.log('Buttons replaced successfully');
