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
    if (filePath.endsWith('.tsx') && !filePath.includes('layout.tsx')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // --- H1 replacements (Hero Titles) ---
        // Match Laplace style H1s
        content = content.replace(
            /className="[^"]*text-\[2\.5rem\] md:text-\[3\.5rem\] lg:text-\[4rem\][^"]*font-bold uppercase[^"]*"/g,
            'className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] text-white mb-8"'
        );
        content = content.replace(
            /className="[^"]*text-\[2\.2rem\] md:text-\[3\.2rem\] lg:text-\[3\.6rem\][^"]*font-bold uppercase[^"]*"/g,
            'className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] text-white mb-8"'
        );
        content = content.replace(
            /className="[^"]*text-\[2\.4rem\] md:text-\[3\.4rem\] lg:text-\[3\.8rem\][^"]*font-bold uppercase[^"]*"/g,
            'className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] text-white mb-8"'
        );

        // --- H2 replacements (Section Titles) ---
        // 1. Large Laplace H2 (e.g. text-[2rem] md:text-[2.6rem] uppercase)
        content = content.replace(
            /className="text-white text-\[2rem\] md:text-\[2\.6rem\] font-bold uppercase[^"]*text-center[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-center text-white mb-10"'
        );
        content = content.replace(
            /className="text-white text-\[2rem\] md:text-\[2\.6rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-white mb-10"'
        );
        
        content = content.replace(
            /className="text-\[#122017\] text-\[2rem\] md:text-\[2\.6rem\] font-bold uppercase[^"]*text-center[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-center text-[#122017] mb-10"'
        );
        content = content.replace(
            /className="text-\[#122017\] text-\[2rem\] md:text-\[2\.6rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10"'
        );

        content = content.replace(
            /className="text-\[#223930\] text-\[2rem\] md:text-\[2\.6rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10"'
        );
        
        // Very large Laplace H2 in nous-connaitre
        content = content.replace(
            /className="text-\[#122017\] text-\[2\.2rem\] md:text-\[3rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10"'
        );
        content = content.replace(
            /className="text-white text-\[2\.2rem\] md:text-\[3rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-white mb-10"'
        );
        content = content.replace(
            /className="text-white text-\[1\.8rem\] md:text-\[2\.2rem\] font-bold uppercase[^"]*"/g,
            'className="font-serif text-3xl md:text-4xl font-bold text-white mb-10"'
        );

        // Small Eyebrow H2s (Nous contacter)
        content = content.replace(
            /className="text-\[#223930\] text-\[1\.1rem\] font-bold uppercase mb-4 tracking-wider"/g,
            'className="font-serif text-2xl font-bold text-[#223930] mb-4"'
        );
        content = content.replace(
            /className="text-\[#223930\] text-\[1\.3rem\] font-bold uppercase mb-4 text-center tracking-wider"/g,
            'className="font-serif text-2xl font-bold text-center text-[#223930] mb-4"'
        );
        content = content.replace(
            /className="text-\[#223930\] text-\[0\.95rem\] font-bold uppercase mb-4 tracking-wider"/g,
            'className="font-serif text-2xl font-bold text-[#223930] mb-4"'
        );

        // --- Remaining stray small uppercase H3 in page.tsx that should be normal case ---
        content = content.replace(
            /className="text-\[#111F18\] text-\[0\.9rem\] lg:text-\[0\.95rem\] font-bold mb-3 uppercase tracking-wide"/g,
            'className="font-semibold text-xs whitespace-pre-line leading-snug text-[#111F18] mb-3"'
        );
        content = content.replace(
            /className="text-white text-\[0\.8rem\] font-bold uppercase tracking-widest leading-\[1\.5\] mb-4"/g,
            'className="font-semibold text-xs leading-snug text-white mb-4"'
        );
        content = content.replace(
            /className="text-\[#272A2C\] text-\[0\.8rem\] font-bold uppercase tracking-\[0\.25em\] mb-3"/g,
            'className="font-serif text-2xl md:text-3xl font-bold text-[#272A2C] mb-3"'
        );
        content = content.replace(
            /className="text-\[#1A1A1A\] text-\[0\.75rem\] font-bold uppercase tracking-wide mb-2"/g,
            'className="font-semibold text-xs leading-snug text-[#1A1A1A] mb-2"'
        );
        content = content.replace(
            /className="text-white text-\[1rem\] font-bold uppercase tracking-wide mb-4 text-center"/g,
            'className="font-semibold text-xs leading-snug text-white text-center mb-4"'
        );
        
        // Large stray H3 in nous-connaitre
        content = content.replace(
            /className="text-white text-\[2\.5rem\] md:text-\[3\.5rem\] font-bold leading-tight mb-12"/g,
            'className="font-serif text-4xl md:text-5xl font-bold text-white mb-12 leading-tight"'
        );

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Cleaned heading classes in:', filePath);
        }
    }
});
