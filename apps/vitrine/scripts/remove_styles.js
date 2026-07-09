const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace big style objects that override typography
  // It handles styles like style={{ fontFamily: ..., fontSize: ..., fontWeight: ..., lineHeight: ... }}
  const newContent = content.replace(/style=\{\{\s*fontFamily:\s*["']var\(--font-(?:serif|sans).*?\s*\}\}/gs, '');
  
  // Also clean up any empty style={{}} that might be left
  const cleanedContent = newContent.replace(/style=\{\{\s*\}\}/g, '');
  
  if (content !== cleanedContent) {
    fs.writeFileSync(filePath, cleanedContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Done.');
