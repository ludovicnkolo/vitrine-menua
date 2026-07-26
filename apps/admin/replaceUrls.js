const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      content = content.replace(/\|\|\s*\('http:\/\/localhost:4000'\)/g, '');
      content = content.replace(/\|\|\s*'http:\/\/localhost:4000'/g, '');
      
      // Cleanup `(import.meta.env.VITE_API_URL)` into `import.meta.env.VITE_API_URL` if they were wrapped
      content = content.replace(/\(import\.meta\.env\.VITE_API_URL\)/g, 'import.meta.env.VITE_API_URL');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
