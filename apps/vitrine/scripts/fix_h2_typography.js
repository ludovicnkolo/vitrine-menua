const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'src', 'app'), function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // Replace Laplace eyebrow styles on h2/h3 tags with Menua Serif titles
        // Matches standard section titles in Laplace design system
        
        // 1. Replace the exact class combinations found in grep
        content = content.replace(/className="text-white text-\[0\.85rem\] font-bold uppercase tracking-\[0\.2em\]([^"]*)"/g, 
                                  'className="font-serif text-3xl md:text-4xl font-bold$1"');
        content = content.replace(/className="text-\[#272A2C\] text-\[0\.85rem\] font-bold uppercase tracking-\[0\.2em\]([^"]*)"/g, 
                                  'className="font-serif text-3xl md:text-4xl font-bold$1"');
        
        // Some are <p> or <h3> with similar styles, let's fix the ones from vos-besoins and nos-solutions
        content = content.replace(/className="text-\[#D9B151\] text-\[0\.75rem\] font-bold uppercase tracking-\[0\.2em\]([^"]*)"/g, 
                                  'className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151]$1"');
        content = content.replace(/className="text-\[#8B6240\] text-\[0\.75rem\] font-bold uppercase tracking-\[0\.2em\]([^"]*)"/g, 
                                  'className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240]$1"');
        
        // For actual titles that were uppercase in Nous Connaitre
        content = content.replace(/className="text-\[#122017\] text-\[1\.1rem\] font-bold uppercase tracking-wide"/g, 
                                  'className="font-serif text-2xl font-bold text-[#122017]"');
        
        // Small fixes for why menua
        content = content.replace(/className="text-white text-\[0\.95rem\] font-bold uppercase tracking-wide leading-\[1\.4\]"/g,
                                  'className="font-serif text-2xl font-bold text-white leading-tight"');
        content = content.replace(/className="text-\[#122017\] text-\[1\.05rem\] font-bold uppercase tracking-wide leading-tight"/g,
                                  'className="font-serif text-2xl font-bold text-[#122017] leading-tight"');
        content = content.replace(/className="text-white text-\[1\.1rem\] md:text-\[1\.2rem\] font-bold uppercase tracking-wide leading-tight/g,
                                  'className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight');
        
        // Nous Rejoindre
        content = content.replace(/className="text-\[#223930\] text-\[1\.1rem\] font-bold uppercase tracking-wider"/g,
                                  'className="font-serif text-2xl font-bold text-[#223930]"');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Updated titles in:', filePath);
        }
    }
});
