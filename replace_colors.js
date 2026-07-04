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

const heroColor = '#797e6f';
const sectionColors = ['#9d8772', '#b4b3a1', '#e6e0d9', '#bcbbb8'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace Hero gradients
    content = content.replace(/from-\[#(122017|223930)\]/g, `from-[${heroColor}]`);
    content = content.replace(/via-\[#(122017|223930)\]/g, `via-[${heroColor}]`);
    content = content.replace(/to-\[#(122017|223930)\]/g, `to-[${heroColor}]`);
    
    // 2. Process sections to apply the 4 alternating colors
    const sectionRegex = /<section[^>]+>/g;
    let match;
    let matches = [];
    while ((match = sectionRegex.exec(content)) !== null) {
        matches.push({
            fullMatch: match[0],
            index: match.index,
            length: match[0].length
        });
    }

    if (matches.length > 1) {
        let colorIdx = 0;
        let newContent = content.substring(0, matches[1].index);
        
        for (let i = 1; i < matches.length; i++) {
            let sectionStr = matches[i].fullMatch;
            
            // Remove existing background colors from section
            sectionStr = sectionStr.replace(/bg-(white|\[#F9F7F1\]|\[#F6F3F0\]|\[#FDFDFD\]|\[#F5F2EB\]|\[#122017\]|\[#223930\]|\[#e6e0d9\]|\[#bcbbb8\]|\[#b4b3a1\]|\[#9d8772\])/g, '');
            
            // Inject the new color
            const color = sectionColors[colorIdx % sectionColors.length];
            colorIdx++;
            
            if (sectionStr.includes('className="')) {
                sectionStr = sectionStr.replace('className="', `className="bg-[${color}] `);
            } else if (sectionStr.includes("className={'")) {
                sectionStr = sectionStr.replace("className={'", `className={'bg-[${color}] `);
            }
            
            // Cleanup double spaces
            sectionStr = sectionStr.replace(/\s+/g, ' ');

            const nextIndex = i + 1 < matches.length ? matches[i+1].index : content.length;
            let betweenSections = content.substring(matches[i].index + matches[i].length, nextIndex);
            
            // We should also remove inner background colors from typical wrappers like max-w-[1100px] bg-[#F9F7F1]
            // so they don't hide the section color.
            betweenSections = betweenSections.replace(/bg-(white|\[#F9F7F1\]|\[#F6F3F0\]|\[#FDFDFD\]|\[#F5F2EB\])/g, 'bg-transparent');

            newContent += sectionStr + betweenSections;
        }
        content = newContent;
    }
    
    // Also, main tag background
    content = content.replace(/<main[^>]+>/g, (match) => {
        return match.replace(/bg-\[#FDFDFD\]/, 'bg-transparent');
    });

    fs.writeFileSync(file, content);
});
console.log('Colors replaced successfully!');
