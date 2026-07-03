const fs = require('fs');
const path = require('path');

// 1. globals.css
const globalsPath = path.join(__dirname, 'src', 'app', 'globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');

// Replace all Inter with Playfair Display in globals.css
globalsContent = globalsContent.replace(/var\(--font-inter\), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif/g, 'var(--font-playfair), "Playfair Display", serif');
globalsContent = globalsContent.replace(/var\(--font-inter\), "Inter", sans-serif/g, 'var(--font-playfair), "Playfair Display", serif');
globalsContent = globalsContent.replace(/--font-sans: var\(--font-inter\), "Inter", sans-serif;/g, '--font-sans: var(--font-playfair), "Playfair Display", serif;');

fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
console.log('Updated globals.css');

// 2. home.css
const homeCssPath = path.join(__dirname, 'src', 'app', 'home.css');
let homeCssContent = fs.readFileSync(homeCssPath, 'utf-8');

homeCssContent = homeCssContent.replace(/var\(--font-inter\), "Inter", sans-serif/g, 'var(--font-playfair), "Playfair Display", serif');

fs.writeFileSync(homeCssPath, homeCssContent, 'utf-8');
console.log('Updated home.css');

// 3. layout.tsx
// We can actually just let layout.tsx import Inter since it doesn't hurt, 
// but let's change the body class to only use font-serif.
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
layoutContent = layoutContent.replace(/\$\{inter\.variable\} \$\{playfair\.variable\} font-sans/, '${inter.variable} ${playfair.variable} font-serif');
fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
console.log('Updated layout.tsx');

