const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, 'src/app/en');
const dirs = fs.readdirSync(enDir).filter(f => fs.statSync(path.join(enDir, f)).isDirectory());

dirs.forEach(dir => {
  const pagePath = path.join(enDir, dir, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;

  let content = fs.readFileSync(pagePath, 'utf8');

  // Fix relative imports
  content = content.replace(/import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, "import $1 from '@/app/$2'");

  // Add SITE_URL
  if (!content.includes('process.env.NEXT_PUBLIC_SITE_URL')) {
    content = content.replace(/(import [^\n]+\n)+/, "$&\nconst SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuaconsulting.com';\n");
  }

  // Replace canonical and alternates
  content = content.replace(/'https:\/\/menuaconsulting\.com([^']+)'/g, "`${SITE_URL}$1`");

  // Fix opengraph/twitter images
  const defaultImage = "`${SITE_URL}/img/accueil-actus.webp`"; // default fallback
  
  if (content.includes('openGraph: {') && !content.includes('images: [')) {
    content = content.replace(/openGraph: \{([^}]+)\},/, (match, inner) => {
      return `openGraph: {${inner.trimEnd()},\n    images: [{ url: ${defaultImage}, width: 1200, height: 630, alt: "Menua Consulting" }],\n  },`;
    });
  }

  if (content.includes('twitter: {') && !content.includes('images: [')) {
    content = content.replace(/twitter: \{([^}]+)\},/, (match, inner) => {
      return `twitter: {${inner.trimEnd()},\n    images: [${defaultImage}],\n  },`;
    });
  }

  fs.writeFileSync(pagePath, content);
  console.log(`Updated ${pagePath}`);
});
