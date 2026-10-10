const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('apps/vitrine/src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.match(/<div|<span|<li/) && line.includes('onClick=')) {
       // check if this line or next few lines have onKeyDown
       let hasKey = false;
       for (let i = index; i < Math.min(index + 10, lines.length); i++) {
         if (lines[i].includes('onKeyDown=')) {
           hasKey = true;
           break;
         }
       }
       if (!hasKey) {
         console.log(`${file}:${index + 1}: ${line.trim()}`);
       }
    }
  });
});
