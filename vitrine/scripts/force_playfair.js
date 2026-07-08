const fs = require('fs');
const path = require('path');

// 1. globals.css
const globalsPath = path.join(__dirname, 'src', 'app', 'globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');

// Replace all DM Sans and Inter with Playfair Display in globals.css
globalsContent = globalsContent.replace(/font-family: var\(--font-inter\), "DM Sans", sans-serif;/g, 'font-family: var(--font-playfair), "Playfair Display", serif;');
globalsContent = globalsContent.replace(/font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'font-family: var(--font-playfair), "Playfair Display", serif;');

fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
console.log('Updated globals.css to Playfair exclusively');

// 2. home.css
const homeCssPath = path.join(__dirname, 'src', 'app', 'home.css');
let homeCssContent = fs.readFileSync(homeCssPath, 'utf-8');

homeCssContent = homeCssContent.replace(/font-family: var\(--font-inter\), "Inter", sans-serif;/g, 'font-family: var(--font-playfair), "Playfair Display", serif;');
homeCssContent = homeCssContent.replace(/font-family: var\(--font-inter\), "DM Sans", sans-serif;/g, 'font-family: var(--font-playfair), "Playfair Display", serif;');

fs.writeFileSync(homeCssPath, homeCssContent, 'utf-8');
console.log('Updated home.css to Playfair exclusively');

// 3. layout.tsx
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');

// Remove DM Sans imports and definition
layoutContent = layoutContent.replace(/import { DM_Sans, Playfair_Display } from "next\/font\/google";/g, 'import { Playfair_Display } from "next/font/google";');
layoutContent = layoutContent.replace(/\/\* ── DM Sans = police corps — g simple boucle nativement ── \*\/\nconst dmSans = DM_Sans\({[\s\S]*?}\);\n\n/g, '');

// Update body class
layoutContent = layoutContent.replace(/className={`\$\{dmSans\.variable\} \$\{playfair\.variable\} /g, 'className={`\\${playfair.variable} ');

fs.writeFileSync(layoutPath, layoutContent, 'utf-8');
console.log('Updated layout.tsx to remove DM Sans');

