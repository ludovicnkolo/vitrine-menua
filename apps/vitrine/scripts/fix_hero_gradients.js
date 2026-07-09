const fs = require('fs');

const heroGradient = 'from-[#1A0E08] from-40% via-[#1A0E08]/75 via-65% to-transparent to-90%';

const heroFiles = [
    'src/app/nous-connaitre/page.tsx',
    'src/app/vos-besoins/page.tsx',
    'src/app/nos-solutions/page.tsx',
    'src/app/pourquoi-menua/page.tsx',
    'src/app/actualites/page.tsx',
    'src/app/nous-rejoindre/page.tsx',
    'src/app/nous-contacter/page.tsx',
];

heroFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace any hero gradient pattern (only the main hero, not inner section gradients)
    content = content.replace(
        /from-\[#(?:436850|797e6f|122017|223930)\] from-\d+% via-\[#(?:436850|797e6f|122017|223930)\]\/\d+ via-\d+% to-transparent to-\d+%/g,
        heroGradient
    );

    // Also replace gradients with slightly different syntax (nous-rejoindre / nous-contacter style)
    content = content.replace(
        /from-\[#(?:436850|797e6f|122017|223930)\] from-20% via-\[#(?:436850|797e6f|122017|223930)\]\/70 via-45% to-transparent to-65%/g,
        heroGradient
    );

    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
});

console.log('Done!');
