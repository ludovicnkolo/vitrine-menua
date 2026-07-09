const fs = require('fs');
const path = require('path');

const homeCssPath = path.join(__dirname, 'src', 'app', 'home.css');
let content = fs.readFileSync(homeCssPath, 'utf-8');

// Replace domain titles
content = content.replace(
  /\.home-domaines-title-sm \{\s+@apply [^;]+;\s+\}/,
  `.home-domaines-title-sm {
    @apply text-3xl md:text-4xl font-bold mb-16 text-center sm:text-left;
    font-family: var(--font-playfair), "Playfair Display", serif;
  }`
);

// home-domaines-title-lg is redundant if we make sm large, but let's just make it normal font just in case
content = content.replace(
  /\.home-domaines-title-lg \{\s+@apply [^;]+;\s+\}/,
  `.home-domaines-title-lg {
    @apply text-xl font-bold mb-8 text-center sm:text-left hidden;
  }`
);

// We need to fix the page.tsx where these are used as well because changing them from small uppercase to big serif will affect layout.
fs.writeFileSync(homeCssPath, content, 'utf-8');
console.log('Updated home.css section titles');
