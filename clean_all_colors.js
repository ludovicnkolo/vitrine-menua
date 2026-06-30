const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // 1. Eradicate all non-Laplace Light Backgrounds (to Laplace Light Pearl: #F4F5F7 or White: #FFFFFF)
  { regex: /bg-\[#FAFBFC\]/gi, replacement: 'bg-[#F4F5F7]' },
  { regex: /bg-\[#F5F0EA\]/gi, replacement: 'bg-[#FFFFFF]' },
  { regex: /bg-\[#DAF0F7\]/gi, replacement: 'bg-[#F4F5F7]' },
  { regex: /bg-\[#D8DCE8\]/gi, replacement: 'bg-[#E5E7EB]' },
  { regex: /bg-\[#F2F0ED\]/gi, replacement: 'bg-[#F4F5F7]' },
  { regex: /bg-\[#F8F9FA\]/gi, replacement: 'bg-[#F4F5F7]' },
  { regex: /bg-\[#EDEFF2\]/gi, replacement: 'bg-[#FFFFFF]' },
  { regex: /bg-\[#F2F8FA\]/gi, replacement: 'bg-[#F4F5F7]' },

  // 2. Eradicate all non-Laplace Borders
  { regex: /border-\[#D8DCE8\]/gi, replacement: 'border-[#E5E7EB]' },
  { regex: /border-\[#DAF0F7\]/gi, replacement: 'border-[#E5E7EB]' },
  
  // 3. Text colors
  { regex: /text-\[#1C40C2\]/gi, replacement: 'text-[#C89B5E]' }, // Cobalt to Gold
  { regex: /text-\[#122560\]/gi, replacement: 'text-[#0B1B3D]' }, // Dark Navy
  { regex: /text-\[#6B7794\]/gi, replacement: 'text-[#3D4F64]' }, // Muted Text

  // 4. Background variations
  { regex: /bg-\[#1C40C2\]/gi, replacement: 'bg-[#C89B5E]' }, // Cobalt backgrounds to Gold
  { regex: /bg-\[#122560\]/gi, replacement: 'bg-[#0B1B3D]' }, // Dark Navy to Laplace Navy
  { regex: /bg-\[#1A2D4A\]/gi, replacement: 'bg-[#0B1B3D]' }, // Another navy
  
  // 5. Some gradients using old colors
  { regex: /from-\[#1B3680\]/gi, replacement: 'from-[#0B1B3D]' },
  { regex: /via-\[#1B3680\]/gi, replacement: 'via-[#0B1B3D]' },
  { regex: /to-\[#1B3680\]/gi, replacement: 'to-[#0B1B3D]' },
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
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
        console.log(`Deep cleaned colors in: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Laplace deep color cleaning applied successfully.");
