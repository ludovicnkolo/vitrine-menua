const fs = require('fs');
const glob = require('glob');
const path = require('path');

const separator = `
      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if we already added separators everywhere (very basic check)
  // Actually, let's just do a string replacement for `</section>\n\n      {/* ──`
  // But we want to be robust. We can replace `</section>` with `</section>\n${separator}`
  // EXCEPT when it's already followed by the separator.
  
  // First, remove existing separators we might have added manually so we don't duplicate
  content = content.replace(/\{\/\* ── SEPARATOR ── \*\/\}\n\s*<div className="w-full h-8 md:h-16 bg-white"><\/div>\n+/g, '');
  
  // Now add separator after every </section>
  // Be careful: if a </section> is the last thing before </main>, add it there too.
  content = content.replace(/<\/section>\s*(?={?\/\* ──|<section|<\/main>)/g, (match, offset, str) => {
      // Find what's next
      const nextStr = str.substring(offset + 10).trim();
      if (nextStr.startsWith('</main>')) {
          return `</section>\n${separator}\n`;
      }
      return `</section>\n${separator}\n      `;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

const appDir = path.join(__dirname, 'src', 'app');
const files = [
    'page.tsx',
    'pourquoi-menua/page.tsx',
    'vos-besoins/page.tsx',
    'actualites/page.tsx',
    'nos-solutions/page.tsx',
    'nous-contacter/page.tsx',
    'nous-connaitre/page.tsx',
    'nous-rejoindre/page.tsx'
];

files.forEach(f => {
    processFile(path.join(appDir, f));
});
