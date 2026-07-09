const fs = require('fs');
const path = require('path');

const globalsPath = path.join(__dirname, 'src', 'app', 'globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');

if (!globalsContent.includes('@theme')) {
  const themeConfig = `
@theme {
  --font-sans: var(--font-inter), "Inter", sans-serif;
  --font-serif: var(--font-playfair), "Playfair Display", serif;
}
`;
  globalsContent = globalsContent.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + themeConfig);
  fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
  console.log('Added @theme config to globals.css');
}
