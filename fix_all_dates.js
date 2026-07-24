const fs = require('fs');
const path = require('path');

const dir = 'apps/admin/src/pages/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Date columns that were wrapped in <div className="truncate-text"> back to normal td, 
  // but with whiteSpace: 'nowrap' and fontSize: '0.875rem' to keep them consistent on a single line.
  
  content = content.replace(
    /<td><div className="truncate-text"(.*?)>(\{new Date.*?\})<\/div><\/td>/g,
    (match, p1, p2) => {
      // Extract style if it exists
      let styleStr = 'style={{whiteSpace: "nowrap", fontSize: "0.875rem", color: "var(--text-muted)"}}';
      if (p1.includes('style={{')) {
         // modify the existing style string
         let innerStyle = p1.match(/style=\{\{(.*?)\}\}/)[1];
         // ensure whiteSpace and fontSize are added
         if (!innerStyle.includes('whiteSpace')) innerStyle += ', whiteSpace: "nowrap"';
         if (!innerStyle.includes('fontSize')) innerStyle += ', fontSize: "0.875rem"';
         styleStr = `style={{${innerStyle}}}`;
      }
      return `<td ${styleStr}>${p2}</td>`;
    }
  );

  fs.writeFileSync(filePath, content);
});
console.log("Fixed dates in all JSX files");
