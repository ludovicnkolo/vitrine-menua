const fs = require('fs');
const path = require('path');

const files = [
    'src/app/page.tsx',
    'src/app/nous-connaitre/page.tsx',
    'src/app/vos-besoins/page.tsx',
    'src/app/nos-solutions/page.tsx',
    'src/app/pourquoi-menua/page.tsx',
    'src/app/nous-rejoindre/page.tsx',
    'src/app/nous-contacter/page.tsx',
    'src/app/actualites/page.tsx',
];

const colorMap = {
    '#797e6f': '#436850', // Hero
    '#9d8772': '#E3C29E',
    '#b4b3a1': '#C2D5C4',
    '#e6e0d9': '#FDFBF7',
    '#bcbbb8': '#E2E4E1',
};

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        for (const [oldColor, newColor] of Object.entries(colorMap)) {
            // Replace both exact case and lowercase just in case
            const regex = new RegExp(oldColor, 'gi');
            content = content.replace(regex, newColor);
        }

        fs.writeFileSync(file, content);
    }
});
console.log('Colors updated to brighter versions!');
