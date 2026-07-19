const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace:
// <div style={{
//   position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-color)', display: 'block', padding: '2rem', zIndex: 50, overflowY: 'auto'
// }}>
// With:
// <div className="fade-in">

const regex = /<div style={{\s*position:\s*'absolute',\s*top:\s*0,\s*left:\s*0,\s*right:\s*0,\s*bottom:\s*0,\s*background:\s*'var\(--bg-color\)',\s*display:\s*'block',\s*padding:\s*'2rem',\s*zIndex:\s*50,\s*overflowY:\s*'auto'\s*}}>/g;

content = content.replace(regex, '<div className="fade-in" style={{padding: "1rem"}}>');

// Also remove `className="card page-modal-content" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}`
// since `page-modal-content` is not needed anymore if it's naturally flowed, but keeping `card` and `maxWidth` is good.
content = content.replace(/className="card page-modal-content" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}/g,
  'className="card" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}');

// And remove the `X` buttons with `Retour` since we did that but some missed? Let's just fix the `X` to `Retour` everywhere inside a header.
// <button onClick={([^}]+)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}><X size={20}\/><\/button>
content = content.replace(/<button onClick={([^}]+)}\s*style={{background:\s*'none',\s*border:\s*'none',\s*cursor:\s*'pointer',\s*color:\s*'var\(--text-muted\)'}}><X size={20}\/><\/button>/g,
  '<button onClick={$1} className="btn btn-outline" style={{padding: "0.5rem 1rem"}}>← Retour</button>');

fs.writeFileSync(file, content);
console.log('Final cleanup script ran');
