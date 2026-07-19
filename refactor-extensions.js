const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'vitrine', 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remplacer .jpg, .jpeg, .png par .webp
    content = content.replace(/\.(jpg|jpeg|png)/gi, '.webp');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Mis à jour : ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

console.log('Démarrage du remplacement des extensions...');
traverseDir(srcDir);
console.log('Remplacement terminé !');
