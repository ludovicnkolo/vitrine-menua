const fs = require('fs');
const path = require('path');

const crmContent = fs.readFileSync(path.join(__dirname, 'src/routes/crm.js'), 'utf8');

const lines = crmContent.split('\n');
const headerLines = [];
let i = 0;

// Read until the first route
while (i < lines.length && !lines[i].match(/^router\.(get|post|patch|delete)\(['"]\/([^/']+)/)) {
  headerLines.push(lines[i]);
  i++;
}

// Map prefixes to filenames
const routeGroups = {
  'roles': 'users.js',
  'users': 'users.js',
  'clients': 'clients.js',
  'dossiers': 'dossiers.js',
  'audit': 'audit.js',
  'tasks': 'missions.js',
  'taches': 'taches.js',
  'documents': 'documents.js',
  'messages': 'messages.js',
  'dashboard-stats': 'dashboard.js'
};

const outputBlocks = {};
for (const key of new Set(Object.values(routeGroups))) {
    outputBlocks[key] = [];
}

let currentGroup = null;
let currentBlock = [];
let braceCount = 0;

for (; i < lines.length; i++) {
  const line = lines[i];
  
  if (line === 'module.exports = router;') break;
  
  const match = line.match(/^router\.(get|post|patch|delete)\(['"]\/([^/']+)/);
  if (match && braceCount === 0) {
    const routeName = match[2];
    currentGroup = routeGroups[routeName] || 'misc.js';
    if (!outputBlocks[currentGroup]) outputBlocks[currentGroup] = [];
  }
  
  if (currentGroup) {
      currentBlock.push(line);
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      if (braceCount === 0 && currentBlock.length > 0) {
          // capture any dangling comments before the next route
          let j = i + 1;
          while (j < lines.length && !lines[j].match(/^router\./) && lines[j] !== 'module.exports = router;' && !lines[j].match(/^async function /) && !lines[j].match(/^const { syncMessages /)) {
              currentBlock.push(lines[j]);
              i = j;
              j++;
          }
          outputBlocks[currentGroup].push(currentBlock.join('\n'));
          currentBlock = [];
          currentGroup = null;
      }
  } else {
      // It's a helper function or import defined between routes!
      // Add it to headerLines so all modules get it
      headerLines.push(line);
  }
}

const headerStr = headerLines.join('\n');

for (const [filename, blocks] of Object.entries(outputBlocks)) {
    if (blocks.length === 0) continue;
    let content = headerStr + '\n\n';
    content += blocks.join('\n') + '\n\nmodule.exports = router;\n';
    fs.writeFileSync(path.join(__dirname, 'src/routes/crm', filename), content);
    console.log(`Created src/routes/crm/${filename} (${blocks.length} routes)`);
}

