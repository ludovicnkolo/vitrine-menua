const fs = require('fs');

const files = [
    'src/app/page.tsx',
    'src/app/nous-connaitre/page.tsx',
    'src/app/vos-besoins/page.tsx',
    'src/app/nos-solutions/page.tsx',
    'src/app/pourquoi-menua/page.tsx',
    'src/app/actualites/page.tsx',
    'src/app/nous-rejoindre/page.tsx',
    'src/app/nous-contacter/page.tsx',
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Fix missing space between <section and className
    content = content.replace(/<sectionclassName=/g, '<section className=');
    content = content.replace(/<sectionid=/g, '<section id=');

    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
});
console.log('Done!');
