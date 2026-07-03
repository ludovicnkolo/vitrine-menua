const fs = require('fs');
const path = require('path');

// 1. Fix globals.css
const globalsPath = path.join(__dirname, 'src', 'app', 'globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');

// Replace H1-H6 font-families from Inter to Playfair Display
globalsContent = globalsContent.replace(/h1, \.h1-like \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h1, .h1-like {\n    font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/h2, \.h2-like \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h2, .h2-like {\n    font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/h3 \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h3 {\n    font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/h4 \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h4 {\n    font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/h5 \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h5 {\n    font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/h6 \{\s+font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'h6 {\n    font-family: var(--font-playfair), "Playfair Display", serif;');

fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
console.log('Updated globals.css headings');

// 2. Fix home.css
const homeCssPath = path.join(__dirname, 'src', 'app', 'home.css');
let homeCssContent = fs.readFileSync(homeCssPath, 'utf-8');

homeCssContent = homeCssContent.replace(
  /\.home-hero-title \{\s+@apply text-white mb-2 text-\[2\.2rem\] md:text-\[3\.2rem\] lg:text-\[3\.6rem\] leading-\[1\.1\] font-bold uppercase max-w-4xl tracking-tight;\s+\}/,
  `.home-hero-title {
    @apply text-white mb-2 text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] max-w-4xl;
    font-family: var(--font-playfair), "Playfair Display", serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-hero-subtitle \{\s+@apply text-white text-\[1\.4rem\] md:text-\[1\.8rem\] lg:text-\[2rem\] leading-\[1\.2\] font-bold mb-8 uppercase tracking-wide;\s+\}/,
  `.home-hero-subtitle {
    @apply text-[#D9B151] italic font-normal text-4xl md:text-5xl lg:text-6xl mt-4 mb-8 leading-[1.1];
    font-family: var(--font-playfair), "Playfair Display", serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-hero-desc \{\s+@apply text-white text-\[1\.05rem\] md:text-\[1\.15rem\] leading-\[1\.6\] max-w-2xl font-normal space-y-4 mb-8;\s+\}/,
  `.home-hero-desc {
    @apply text-white/90 text-base lg:text-lg leading-relaxed max-w-2xl font-light space-y-4 mb-8;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-hero-btn \{\s+@apply inline-flex items-center justify-center gap-3 bg-\[#E0D6C8\] text-\[#122017\] border border-\[#E0D6C8\] px-8 py-3\.5 text-\[0\.75rem\] font-bold tracking-\[0\.1em\] uppercase transition-all hover:bg-transparent hover:text-\[#E0D6C8\] w-fit;\s+\}/,
  `.home-hero-btn {
    @apply inline-flex items-center justify-center gap-3 bg-[#E0D6C8] text-[#122017] border border-[#E0D6C8] px-8 py-3.5 text-xs font-bold tracking-wider uppercase transition-all hover:bg-transparent hover:text-[#E0D6C8] w-fit;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

homeCssContent = homeCssContent.replace(
  /\.home-wave-text \{\s+@apply text-\[#272A2C\] text-\[0\.85rem\] md:text-\[1\.05rem\] font-medium leading-relaxed tracking-wide text-center;\s+\}/,
  `.home-wave-text {
    @apply text-gray-700 text-lg leading-relaxed font-light text-center;
    font-family: var(--font-inter), "Inter", sans-serif;
  }`
);

fs.writeFileSync(homeCssPath, homeCssContent, 'utf-8');
console.log('Updated home.css typography');
