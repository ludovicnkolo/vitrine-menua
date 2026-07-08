const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(path.join(__dirname, '../src'));
const translationRegex = /t\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/g;
const noTransRegex = /t\(\s*["']([^"']+)["']\s*\)/g;

let count = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  let printedFile = false;
  
  while ((match = translationRegex.exec(content)) !== null) {
    if (!printedFile) {
      console.log(`\n=== ${file.replace(path.join(__dirname, '../src/'), '')} ===`);
      printedFile = true;
    }
    const fr = match[1];
    const en = match[2];
    // Very simple heuristic to detect bad translations (e.g., exact same string or very short, or missing EN)
    if (fr === en || en.toLowerCase().includes('lorem') || fr.includes('TODO')) {
      console.log(`[SUSPICIOUS] FR: "${fr}" | EN: "${en}"`);
    } else {
      console.log(`FR: "${fr}" | EN: "${en}"`);
    }
    count++;
  }
});
console.log(`\nTotal translations found: ${count}`);
