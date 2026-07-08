const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    fs.statSync(fullPath).isDirectory() ? walkDir(fullPath, callback) : callback(fullPath);
  });
}

const files = [];
walkDir(path.join(__dirname, 'src'), fp => {
  if (fp.endsWith('.tsx') && !fp.includes('layout.tsx')) files.push(fp);
});

let totalFixes = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // 1. font-sans sur les balises main (mentions-legales, politique-de-confidentialite)
  content = content.replace(/className="([^"]*)\bfont-sans\b([^"]*)"/g, (match, before, after) => {
    // Garder font-sans seulement si pas sur h1/h2/h3
    return match; // on ne touche pas encore, on fait d'abord le filtre ci-dessous
  });

  // 2. h2 className="font-sans ..." → remplacer par font-serif
  content = content.replace(/<h2 className="font-sans ([^"]+)"/g, (match, rest) => {
    return `<h2 className="font-serif ${rest}"`;
  });

  // 3. h1 className="font-sans ..." → remplacer par font-serif  
  content = content.replace(/<h1 className="font-sans ([^"]+)"/g, (match, rest) => {
    return `<h1 className="font-serif ${rest}"`;
  });

  // 4. h3 className="font-sans ..." → remplacer par font-serif
  content = content.replace(/<h3 className="font-sans ([^"]+)"/g, (match, rest) => {
    return `<h3 className="font-serif ${rest}"`;
  });

  // 5. main className="... font-sans ..." → supprimer font-sans (le body global s'en charge)
  content = content.replace(/<main className="([^"]*) font-sans ([^"]*)"/g, '<main className="$1 $2"');
  content = content.replace(/<main className="font-sans ([^"]*)"/g, '<main className="$1"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalFixes++;
    console.log(`✅ Corrigé : ${path.relative(__dirname, filePath)}`);
  }
});

console.log(`\n${totalFixes} fichier(s) corrigé(s).`);
