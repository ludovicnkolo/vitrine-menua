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

    // Parse all <section ...> tags and rewrite their spacing
    content = content.replace(/<section\b([^>]*)>/g, (fullMatch, attrs) => {
        // Skip the Hero section (has min-h or relative overflow-hidden)
        if (attrs.includes('min-h-[90vh]') || (attrs.includes('relative') && attrs.includes('overflow-hidden'))) {
            return fullMatch;
        }

        // Remove all existing mt-X and mb-X spacing classes (including responsive)
        let newAttrs = attrs
            .replace(/\bmt-\d+(\s+lg:mt-\d+)?\b/g, '')
            .replace(/\bmb-\d+(\s+lg:mb-\d+)?\b/g, '')
            .replace(/\bmy-\d+(\s+lg:my-\d+)?\b/g, '');

        // Clean up multiple spaces
        newAttrs = newAttrs.replace(/\s+/g, ' ').trim();

        // Add mt-12 to className
        newAttrs = newAttrs.replace(/className="/, 'className="mt-12 ');
        newAttrs = newAttrs.replace(/className='/, "className='mt-12 ");

        return `<section${newAttrs}>`;
    });

    // Clean up any "mt-12 mt-12" duplicates
    content = content.replace(/mt-12\s+mt-12/g, 'mt-12');

    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
});
console.log('Done!');
