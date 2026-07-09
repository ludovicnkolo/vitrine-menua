const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

// Couleurs déduites des screenshots de Laplace :
// Vert Sapin Foncé (Primary) : #223930
// Beige / Sable (Secondary / Dropdowns) : #E0D6C8
// Light Beige (Alternating sections) : #F5F2EB
// Texte principal : #223930 (Sur fond clair) ou Blanc (Sur fond foncé)

const replacements = [
  // Remplacer le Bleu Nuit (#0B1B3D) par le Vert Laplace (#223930)
  { regex: /#0B1B3D/gi, replacement: '#223930' },
  { regex: /#08142D/gi, replacement: '#192C24' }, // Navy night -> Darker Green
  { regex: /#142E64/gi, replacement: '#2C493D' }, // Navy light -> Lighter Green
  
  // Remplacer l'Or (#C89B5E) par le Beige Laplace (#E0D6C8)
  { regex: /#C89B5E/gi, replacement: '#E0D6C8' },
  { regex: /#D4AF37/gi, replacement: '#E0D6C8' },
  { regex: /#F9F4EB/gi, replacement: '#F5F2EB' },

  // Remplacer les fonds gris/perle par le beige très clair
  { regex: /#F4F5F7/gi, replacement: '#F5F2EB' },
  { regex: /#E5E7EB/gi, replacement: '#E0D6C8' }, // Borders

  // Remplacer le texte Dark Charcoal (#1E2A3A) par le Vert Laplace Foncé pour harmonie
  { regex: /#1E2A3A/gi, replacement: '#223930' },
  { regex: /#3D4F64/gi, replacement: '#3A5448' }, // Muted text -> Muted green
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
        console.log(`Updated colors for Laplace Green/Beige in: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Laplace Green/Beige theme applied successfully.");
