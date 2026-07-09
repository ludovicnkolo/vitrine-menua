const fs = require('fs');

const files = [
    'src/app/nous-connaitre/page.tsx',
    'src/app/vos-besoins/page.tsx',
    'src/app/nos-solutions/page.tsx',
    'src/app/pourquoi-menua/page.tsx',
    'src/app/actualites/page.tsx',
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove mb-6 from Hero sections (those with min-h-[90vh])
    content = content.replace(
        /(<section className="relative w-full )mb-6 (min-h-\[90vh\])/g,
        '$1$2'
    );

    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
});
console.log('Done!');
