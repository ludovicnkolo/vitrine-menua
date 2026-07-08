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

    // 1. Replace mb-10 lg:mb-16 with mb-6
    content = content.replace(/mb-10 lg:mb-16/g, 'mb-6');
    
    // 2. Replace my-10 lg:my-16 with mt-12 mb-6
    content = content.replace(/my-10 lg:my-16/g, 'mt-12 mb-6');
    
    // 3. Replace py-16 lg:py-24 with py-12 (normalize padding too)
    content = content.replace(/py-16 lg:py-24/g, 'py-12');
    
    // 4. Replace py-12 lg:py-16 with py-12
    content = content.replace(/py-12 lg:py-16/g, 'py-12');

    // 5. Add mb-6 to sections that have no mb at all (consecutive sections)
    // For sections that have w-full but no mb-6
    content = content.replace(/(<section[^>]*?)(w-full)([^>]*?)((?!mb-))(>)/g, (match, p1, p2, p3, p4, p5) => {
        if (!match.includes('mb-')) {
            return match.replace('w-full', 'w-full mb-6');
        }
        return match;
    });

    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
});
console.log('Done!');
