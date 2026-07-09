const fs = require('fs');
const path = require('path');

const directory = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/vitrine/src/app';

// Recursively read dir
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(directory, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('🔴')) {
      content = content.replace(/ 🔴/g, '');
      content = content.replace(/🔴/g, '');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Removed from', filePath);
    }
  }
});
console.log('Done');
