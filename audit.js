const fs = require('fs');
const path = require('path');

const dirsToScan = ['apps/admin/src', 'apps/vitrine/src'];
const report = {
  inlineStyles: [],
  jsxFiles: [],
  largeFiles: [],
  anyUsage: [],
  hardcodedRoles: [],
  potentialMemoryLeaks: []
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      results.push(filePath);
    }
  });
  return results;
}

dirsToScan.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (fs.existsSync(fullPath)) {
    const files = walkDir(fullPath);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      // Check file length
      if (lines.length > 150) {
        report.largeFiles.push({ file, lines: lines.length });
      }

      // Check for .jsx extension
      if (file.endsWith('.jsx')) {
        report.jsxFiles.push(file);
      }

      let inUseEffect = false;
      let hasSetTimeout = false;
      let hasCleanup = false;

      lines.forEach((line, i) => {
        const lineNum = i + 1;
        
        // Check inline styles
        if (line.includes('style={{')) {
          report.inlineStyles.push(`${file}:${lineNum}`);
        }

        // Check any usage in TS/TSX
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          if (line.match(/\bany\b/) && !line.includes('eslint-disable')) {
            report.anyUsage.push(`${file}:${lineNum}`);
          }
        }

        // Check hardcoded roles
        if (line.match(/role\s*===?\s*['"](Admin|Super Admin|Manager)['"]/i) || line.match(/\.includes\(['"](admin|super)['"]\)/i)) {
          report.hardcodedRoles.push(`${file}:${lineNum} - ${line.trim()}`);
        }

        // Basic heuristic for useEffect memory leaks
        if (line.includes('useEffect(')) {
          inUseEffect = true;
          hasSetTimeout = false;
          hasCleanup = false;
        }
        if (inUseEffect) {
          if (line.includes('setTimeout(') || line.includes('setInterval(') || line.includes('addEventListener(')) {
            hasSetTimeout = true;
          }
          if (line.includes('return () =>') || line.includes('return function')) {
            hasCleanup = true;
          }
          // if we reach the end of the effect without cleanup but with a timeout
          // This is a naive regex-based heuristic, very basic
          if (line.match(/^\s*\}\s*,\s*\[/)) { 
             inUseEffect = false;
             if (hasSetTimeout && !hasCleanup) {
               report.potentialMemoryLeaks.push(`${file}:${lineNum}`);
             }
          }
        }
      });
    });
  }
});

fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2));
console.log('Audit completed. Data saved to audit_report.json');
