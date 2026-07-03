const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(dirPath, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // Replace Layout imports
        if (filePath.endsWith('layout.tsx')) {
            content = content.replace(/import { Nunito_Sans, Cormorant_Garamond } from "next\/font\/google";/g, 
                                      'import { Inter, Playfair_Display } from "next/font/google";');
            
            content = content.replace(/const fontNunito = Nunito_Sans\(\{[^}]+\}\);/s,
                                      'const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });');
            
            content = content.replace(/const fontCormorant = Cormorant_Garamond\(\{[^}]+\}\);/s,
                                      'const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });');
            
            content = content.replace(/\$\{fontNunito\.variable\} \$\{fontCormorant\.variable\}/g, 
                                      '${inter.variable} ${playfair.variable} font-sans');
        }

        // CSS and inline replacements
        content = content.replace(/--font-nunito/g, '--font-inter');
        content = content.replace(/--font-display/g, '--font-playfair');
        content = content.replace(/Nunito Sans/g, 'Inter');
        content = content.replace(/Cormorant Garamond/g, 'Playfair Display');
        content = content.replace(/Nunito_Sans/g, 'Inter');
        content = content.replace(/Cormorant_Garamond/g, 'Playfair_Display');
        content = content.replace(/fontNunito/g, 'inter');
        content = content.replace(/fontCormorant/g, 'playfair');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Updated:', filePath);
        }
    }
});
