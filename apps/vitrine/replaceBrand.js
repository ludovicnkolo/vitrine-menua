const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/app');
const files = [
  'mentions-legales/page.tsx',
  'politique-de-confidentialite/page.tsx',
  'nous-connaitre/page.tsx',
  'nous-rejoindre/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace {t( ... MENUA CONSULTING ... )} with {formatBrand(t( ... MENUA CONSULTING ... ))}
  // We match {t( followed by anything that isn't )}, then )}. Wait, t() can contain nested parens? No, just strings.
  
  // A safe way: replace all `{t(` with `formatBrand(t(` if it contains MENUA CONSULTING and is not inside an h1/h2/h3.
  // Actually, let's just do a manual replace of the exact strings using regex!
  
  // In mentions-legales, there are some headings? No, the headings don't contain MENUA CONSULTING.
  // Let's check!
  const hasHeadingWithMenua = content.match(/<h[1-3][^>]*>[^<]*MENUA CONSULTING[^<]*<\/h[1-3]>/);
  if (hasHeadingWithMenua) {
    console.log(`WARNING: Heading with MENUA CONSULTING found in ${file}`);
  }

  // Find all {t( ... )} blocks
  let newContent = content.replace(/\{t\(\s*["'][\s\S]*?["']\s*,\s*["'][\s\S]*?["']\s*\)\}/g, (match) => {
    if (match.includes('MENUA CONSULTING') && !match.includes('formatBrand')) {
      return `{formatBrand(${match.slice(1, -1)})}`; // slice removes { and }
    }
    return match;
  });

  if (newContent !== content) {
    // Add import
    if (!newContent.includes('formatBrand')) { // wait, we just added it
    }
    if (!content.includes('import { formatBrand }')) {
      newContent = newContent.replace('import { useLanguage } from "@/components/LanguageProvider";', 'import { useLanguage } from "@/components/LanguageProvider";\nimport { formatBrand } from "@/utils/formatBrand";');
    }
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
