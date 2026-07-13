const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/app');
const files = [
  'nos-solutions/page.tsx',
  'vos-besoins/page.tsx',
  'pourquoi-menua/page.tsx',
  'nous-contacter/page.tsx',
  'actualites/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  let newContent = content.replace(/\{t\(\s*["'][\s\S]*?["']\s*,\s*["'][\s\S]*?["']\s*\)\}/g, (match) => {
    // Exclude if it's a heading
    if (match.includes('MENUA CONSULTING') && !match.includes('formatBrand')) {
      // Very basic heading exclude: we won't replace anything that doesn't look like a paragraph.
      // But regex replace doesn't know context. Let's just do it and manually fix the headings.
      return `{formatBrand(${match.slice(1, -1)})}`;
    }
    return match;
  });

  if (newContent !== content) {
    if (!content.includes('import { formatBrand }')) {
      newContent = newContent.replace('import { useLanguage } from "@/components/LanguageProvider";', 'import { useLanguage } from "@/components/LanguageProvider";\nimport { formatBrand } from "@/utils/formatBrand";');
    }
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
