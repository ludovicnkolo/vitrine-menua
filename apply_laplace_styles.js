const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // 1. Typographie (Les polices ont déjà été changées dans layout.tsx via next/font, 
  // on s'assure que font-serif et font-sans sont utilisés correctement).
  // Laplace: H1, H2 en Playfair (serif), H3 en Inter (sans)
  { regex: /font-serif text-xl/g, replacement: 'font-sans text-xl' }, // H3 devient sans-serif
  { regex: /font-serif text-2xl/g, replacement: 'font-sans text-2xl' }, // H3 devient sans-serif
  { regex: /text-\[1\.3rem\] font-bold/g, replacement: 'text-[1.25rem] font-semibold font-sans' }, // H3
  { regex: /text-3xl md:text-4xl/g, replacement: 'text-[40px] leading-[1.2] tracking-[-0.01em]' }, // H2

  // 2. Layout & Spacing
  // Laplace utilise max-width: 1280px
  { regex: /max-w-7xl/g, replacement: 'max-w-[1280px]' },
  { regex: /max-w-6xl/g, replacement: 'max-w-[1280px]' },
  
  // Sections: py-24
  { regex: /py-20/g, replacement: 'py-24' },
  { regex: /py-16/g, replacement: 'py-24' },

  // 3. Cartes (Cards)
  // Padding 32px (p-8), Arrondi 8px (rounded-lg), Ombre diffuse
  { regex: /rounded-2xl/g, replacement: 'rounded-lg' },
  { regex: /rounded-xl/g, replacement: 'rounded-lg' },
  { regex: /shadow-lg/g, replacement: 'shadow-[0_10px_30px_rgba(0,0,0,0.05)]' },
  { regex: /shadow-sm/g, replacement: 'shadow-[0_10px_30px_rgba(0,0,0,0.05)]' },
  { regex: /shadow-md/g, replacement: 'shadow-[0_10px_30px_rgba(0,0,0,0.05)]' },
  
  // 4. Boutons & Liens (CTA)
  // uppercase, tracking léger (0.05em), semi-bold
  { regex: /tracking-wider uppercase/g, replacement: 'tracking-[0.05em] uppercase font-semibold text-[14px]' },
  { regex: /tracking-widest uppercase/g, replacement: 'tracking-[0.05em] uppercase font-semibold text-[14px]' },
  // Animation flèche
  { regex: /<ArrowRight size=\{16\} \/>/g, replacement: '<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />' },
  { regex: /<ArrowRight size=\{14\} \/>/g, replacement: '<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />' },
  
  // Assurer que le bouton a 'group' pour l'animation
  { regex: /inline-flex items-center gap-3/g, replacement: 'inline-flex items-center gap-3 group' },
  { regex: /inline-flex items-center gap-2/g, replacement: 'inline-flex items-center gap-2 group' },

  // 5. Couleurs
  // Le script précédent a mis #0B1B3D et #C89B5E, mais vérifions les fonds
  { regex: /bg-\[#F8F9FA\]/g, replacement: 'bg-[#F4F5F7]' },
  { regex: /bg-\[#EDEFF2\]/g, replacement: 'bg-[#FFFFFF]' },
  { regex: /border-gray-100/g, replacement: 'border-[#E5E7EB]' },
  { regex: /border-gray-200/g, replacement: 'border-[#E5E7EB]' },
  { regex: /text-\[#1E2A3A\]/g, replacement: 'text-[#1E2A3A]' },
  { regex: /text-\[#3D4F64\]/g, replacement: 'text-[#1E2A3A]/80' },

  // 6. Header
  { regex: /backdrop-filter: blur\(8px\)/g, replacement: 'backdrop-blur-md bg-white/90' },
  
  // Lignes de démarcation Or
  { regex: /border-\[#D8DCE8\]/g, replacement: 'border-[#C89B5E]/30' },
  { regex: /border-gray-300/g, replacement: 'border-[#C89B5E]/30' },
  
  // Nettoyage de old classes
  { regex: /font-serif text-3xl font-bold/g, replacement: 'font-serif text-[40px] font-semibold leading-[1.2] tracking-[-0.01em]' },
  { regex: /font-serif text-4xl md:text-5xl font-bold/g, replacement: 'font-serif text-[32px] md:text-[56px] font-bold leading-[1.15] tracking-[-0.02em]' },
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
        console.log(`Updated classes in: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Laplace styles applied successfully.");
