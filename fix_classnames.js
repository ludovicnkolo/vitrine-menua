const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace duplicate `className="A" className="B"` -> `className="A B"`
  // Sometimes it's `className="" className="w-full"`
  let modified = true;
  while (modified) {
    modified = false;
    content = content.replace(/className="([^"]*)"\s+className="([^"]*)"/g, (match, p1, p2) => {
      modified = true;
      const combined = `${p1} ${p2}`.trim();
      return `className="${combined}"`;
    });
  }

  // Also replace cases where one of them is dynamic like className={"..."} className="..."
  modified = true;
  while (modified) {
    modified = false;
    content = content.replace(/className=\{([^}]+)\}\s+className="([^"]*)"/g, (match, p1, p2) => {
      modified = true;
      return `className={\`${p2} \${${p1}}\`}`;
    });
    content = content.replace(/className="([^"]*)"\s+className=\{([^}]+)\}/g, (match, p1, p2) => {
      modified = true;
      return `className={\`${p1} \${${p2}}\`}`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.match(/\.(jsx|tsx)$/)) {
      processFile(filePath);
    }
  });
}

walkDir(path.resolve('apps/admin/src'));
