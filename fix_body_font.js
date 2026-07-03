const fs = require('fs');
const path = require('path');

// 1. globals.css
const globalsPath = path.join(__dirname, 'src', 'app', 'globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');

// Restore body and paragraphs to Inter
globalsContent = globalsContent.replace(
  /body \{\s+font-family: var\(--font-playfair\), "Playfair Display", serif;/g,
  'body {\n    font-family: var(--font-inter), "Inter", sans-serif;'
);
globalsContent = globalsContent.replace(
  /p, li, \.text-body \{\s+font-family: var\(--font-playfair\), "Playfair Display", serif;/g,
  'p, li, .text-body {\n    font-family: var(--font-inter), "Inter", sans-serif;'
);
globalsContent = globalsContent.replace(
  /html \{\s+\/\* Inter — police principale Laplace Groupe \*\/\s+font-family: var\(--font-playfair\), "Playfair Display", serif;/g,
  'html {\n    font-family: var(--font-inter), "Inter", sans-serif;'
);
globalsContent = globalsContent.replace(
  /--font-body: var\(--font-inter\), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;/g,
  '--font-body: var(--font-inter), "Inter", sans-serif;'
);

// We keep H1-H6 as Playfair

fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
console.log('Restored Inter for body in globals.css');

// 2. home.css
const homeCssPath = path.join(__dirname, 'src', 'app', 'home.css');
let homeCssContent = fs.readFileSync(homeCssPath, 'utf-8');

// Restore specific classes that should be Inter (descriptions, buttons)
homeCssContent = homeCssContent.replace(
  /\.home-hero-desc \{\s+@apply text-white\/90 text-base lg:text-lg leading-relaxed max-w-2xl font-light space-y-4 mb-8;\s+font-family: var\(--font-playfair\), "Playfair Display", serif;\s+\}/g,
  `.home-hero-desc {
    @apply text-white/90 text-base lg:text-lg leading-relaxed max-w-2xl font-light space-y-4 mb-8;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-hero-btn \{\s+@apply inline-flex items-center justify-center gap-3 bg-\[#E0D6C8\] text-\[#122017\] border border-\[#E0D6C8\] px-8 py-3\.5 text-xs font-bold tracking-wider uppercase transition-all hover:bg-transparent hover:text-\[#E0D6C8\] w-fit;\s+font-family: var\(--font-playfair\), "Playfair Display", serif;\s+\}/g,
  `.home-hero-btn {
    @apply inline-flex items-center justify-center gap-3 bg-[#E0D6C8] text-[#122017] border border-[#E0D6C8] px-8 py-3.5 text-xs font-bold tracking-wider uppercase transition-all hover:bg-transparent hover:text-[#E0D6C8] w-fit;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-wave-text \{\s+@apply text-gray-700 text-lg leading-relaxed font-light text-center;\s+font-family: var\(--font-playfair\), "Playfair Display", serif;\s+\}/g,
  `.home-wave-text {
    @apply text-gray-700 text-lg leading-relaxed font-light text-center;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

fs.writeFileSync(homeCssPath, homeCssContent, 'utf-8');
console.log('Restored Inter for body in home.css');

// 3. layout.tsx
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');
layoutContent = layoutContent.replace(/\$\{inter\.variable\} \$\{playfair\.variable\} font-serif/, '${inter.variable} ${playfair.variable} font-sans');
fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
console.log('Updated layout.tsx to font-sans');

