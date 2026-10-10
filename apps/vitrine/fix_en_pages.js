const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, 'src/app/en');
const dirs = fs.readdirSync(enDir).filter(f => fs.statSync(path.join(enDir, f)).isDirectory());

dirs.forEach(dir => {
  const pagePath = path.join(enDir, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Fix syntax error introduced in twitter: ,,
  content = content.replace(/,,/g, ',');

  // Add missing images in openGraph if needed
  if (content.includes('openGraph: {') && !content.includes('images: [', content.indexOf('openGraph: {'))) {
    // Inject just before the closing brace of openGraph
    content = content.replace(/(openGraph:\s*\{[^}]*?)(?=\s*\})/, "$1,\n    images: [{ url: `${SITE_URL}/img/accueil-actus.webp`, width: 1200, height: 630, alt: \"Menua Consulting\" }]");
  }

  // Ensure no lingering syntax errors like trailing comma before closing brace that could cause issues (though JS allows trailing commas, ,, is bad)
  content = content.replace(/,\s*,/g, ',');
  
  fs.writeFileSync(pagePath, content);
  console.log(`Fixed ${pagePath}`);
});
