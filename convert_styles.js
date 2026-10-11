const fs = require('fs');
const path = require('path');

const tailwindMap = {
  display: {
    'flex': 'flex',
    'inline-flex': 'inline-flex',
    'block': 'block',
    'inline-block': 'inline-block',
    'grid': 'grid',
    'none': 'hidden'
  },
  alignItems: {
    'center': 'items-center',
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    'stretch': 'items-stretch'
  },
  justifyContent: {
    'center': 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'flex-start': 'justify-start',
    'flex-end': 'justify-end'
  },
  flexDirection: {
    'column': 'flex-col',
    'row': 'flex-row'
  },
  flexWrap: {
    'wrap': 'flex-wrap',
    'nowrap': 'flex-nowrap'
  },
  position: {
    'absolute': 'absolute',
    'relative': 'relative',
    'fixed': 'fixed',
    'sticky': 'sticky'
  },
  fontWeight: {
    'bold': 'font-bold',
    '600': 'font-semibold',
    '700': 'font-bold',
    '500': 'font-medium',
    '400': 'font-normal'
  },
  textAlign: {
    'center': 'text-center',
    'left': 'text-left',
    'right': 'text-right'
  },
  cursor: {
    'pointer': 'cursor-pointer',
    'not-allowed': 'cursor-not-allowed'
  }
};

function cssToTailwind(cssObj) {
  let classes = [];
  let remainingCss = {};
  
  for (const [key, value] of Object.entries(cssObj)) {
    if (!value) continue;
    let strVal = String(value).replace(/px$/, '').trim();
    
    if (tailwindMap[key] && tailwindMap[key][strVal]) {
      classes.push(tailwindMap[key][strVal]);
    } else if (key === 'margin') {
      if (strVal === '0 auto') classes.push('mx-auto');
      else remainingCss[key] = value;
    } else if (key === 'marginBottom') {
      if (strVal === '1rem') classes.push('mb-4');
      else if (strVal === '1.5rem') classes.push('mb-6');
      else if (strVal === '2rem') classes.push('mb-8');
      else if (strVal === '0.5rem') classes.push('mb-2');
      else remainingCss[key] = value;
    } else if (key === 'marginTop') {
      if (strVal === '1rem') classes.push('mt-4');
      else if (strVal === '1.5rem') classes.push('mt-6');
      else if (strVal === '2rem') classes.push('mt-8');
      else if (strVal === '0.5rem') classes.push('mt-2');
      else remainingCss[key] = value;
    } else if (key === 'padding') {
      if (strVal === '1rem') classes.push('p-4');
      else if (strVal === '1.5rem') classes.push('p-6');
      else if (strVal === '2rem') classes.push('p-8');
      else if (strVal === '0.5rem') classes.push('p-2');
      else remainingCss[key] = value;
    } else if (key === 'width') {
      if (strVal === '100%') classes.push('w-full');
      else if (strVal === 'fit-content') classes.push('w-fit');
      else remainingCss[key] = value;
    } else if (key === 'height') {
      if (strVal === '100%') classes.push('h-full');
      else remainingCss[key] = value;
    } else if (key === 'gap') {
      if (strVal === '1rem') classes.push('gap-4');
      else if (strVal === '0.5rem') classes.push('gap-2');
      else if (strVal === '1.5rem') classes.push('gap-6');
      else remainingCss[key] = value;
    } else if (key === 'color') {
      if (strVal === 'var(--text-main)') classes.push('text-[var(--text-main)]');
      else if (strVal === 'var(--text-secondary)') classes.push('text-[var(--text-secondary)]');
      else if (strVal === '#FFF' || strVal === 'white') classes.push('text-white');
      else remainingCss[key] = value;
    } else if (key === 'background' || key === 'backgroundColor') {
      if (strVal === 'var(--surface)') classes.push('bg-[var(--surface)]');
      else if (strVal === 'var(--primary)') classes.push('bg-[var(--primary)]');
      else if (strVal === 'var(--background)') classes.push('bg-[var(--background)]');
      else remainingCss[key] = value;
    } else {
      remainingCss[key] = value;
    }
  }
  return { classes: classes.join(' '), remainingCss };
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const styleRegex = /style=\{\{([^}]+)\}\}/g;
  
  let modified = false;
  content = content.replace(styleRegex, (match, innerProps) => {
    try {
      // Very naive object parsing (only works for simple string/number values)
      const propsStr = '{' + innerProps + '}';
      // eval is risky but we are running locally on known code
      let cssObj;
      try {
        cssObj = new Function('return ' + propsStr)();
      } catch (e) {
        return match; // skip if we can't parse
      }
      
      const { classes, remainingCss } = cssToTailwind(cssObj);
      
      if (classes.length > 0) {
        modified = true;
        if (Object.keys(remainingCss).length === 0) {
          // completely replaced
          return `className="${classes}"`;
        } else {
          // partially replaced
          const remainingStr = JSON.stringify(remainingCss).replace(/"([^"]+)":/g, '$1:');
          return `className="${classes}" style={${remainingStr}}`;
        }
      }
      return match;
    } catch (e) {
      return match;
    }
  });

  // Handle merging className="..." and className="..."
  const classRegex = /className="([^"]+)"\s+className="([^"]+)"/g;
  content = content.replace(classRegex, 'className="$1 $2"');
  
  // also the other way around if it got injected before an existing className
  content = content.replace(/className=\{([^}]+)\}\s+className="([^"]+)"/g, 'className={`$2 ${$1}`}');
  content = content.replace(/className="([^"]+)"\s+className=\{([^}]+)\}/g, 'className={`$1 ${$2}`}');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('Processed', filePath);
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
