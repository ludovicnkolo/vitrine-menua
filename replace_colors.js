const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // Navys
  { regex: /#1B3680/gi, replacement: '#0B1B3D' },
  { regex: /#122560/gi, replacement: '#0B1B3D' },
  { regex: /#0F2B45/gi, replacement: '#0B1B3D' }, // old primary
  // Golds
  { regex: /#B8922A/gi, replacement: '#C89B5E' },
  { regex: /#1C40C2/gi, replacement: '#C89B5E' }, // Cobalt to Gold for links/hover
  { regex: /#4A8C7A/gi, replacement: '#C89B5E' }, // Sage green to Gold
  { regex: /#2D7A5A/gi, replacement: '#D4AF37' }, // Dark Sage green to Light Gold
  // Texts
  { regex: /#222222/gi, replacement: '#1E2A3A' },
  { regex: /#3A4660/gi, replacement: '#3D4F64' },
  { regex: /#1E2A3A/gi, replacement: '#1E2A3A' }, // Already good but just in case
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Colors replaced successfully.");
