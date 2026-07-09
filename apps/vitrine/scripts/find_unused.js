const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== UNUSED IMAGES IN public/img ===");
const imgDir = 'public/img';
if (fs.existsSync(imgDir)) {
  const images = fs.readdirSync(imgDir).filter(f => fs.statSync(path.join(imgDir, f)).isFile());
  for (const img of images) {
    try {
      execSync(`grep -r "${img}" src/`, { stdio: 'ignore' });
    } catch (e) {
      console.log(img);
    }
  }
}

console.log("\n=== POTENTIALLY UNUSED COMPONENTS ===");
const compDir = 'src/components';
if (fs.existsSync(compDir)) {
  // Find all .tsx files
  const getFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(getFiles(file));
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        results.push(file);
      }
    });
    return results;
  };
  
  const components = getFiles(compDir);
  for (const comp of components) {
    const compName = path.basename(comp, path.extname(comp));
    if (compName === 'index' || compName === 'layout' || compName === 'page') continue;
    try {
      // Search for imports of this component name.
      execSync(`grep -rw "${compName}" src/ | grep -v "${comp}"`, { stdio: 'ignore' });
    } catch (e) {
      console.log(`${comp} (No exact word match found for ${compName} outside itself)`);
    }
  }
}
