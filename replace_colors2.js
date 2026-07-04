const fs = require('fs');

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
    
    // 2. Process sections
    const sectionRegex = /<section\b[^>]*>/g;
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
            
            // Apply new background color to the section tag
            const color = sectionColors[colorIdx % sectionColors.length];
            colorIdx++;
            
            // Remove existing bg colors from section tag
            sectionStr = sectionStr.replace(/bg-(white|\[#F9F7F1\]|\[#F6F3F0\]|\[#FDFDFD\]|\[#F5F2EB\]|\[#122017\]|\[#223930\])/g, '');
            
            if (sectionStr.includes('className="')) {
                sectionStr = sectionStr.replace('className="', `className="bg-[${color}] `);
            }
            sectionStr = sectionStr.replace(/\s+/g, ' ');

            // Find the immediate inner div with max-w-... and remove its background so section bg is visible
            let nextIndex = i + 1 < matches.length ? matches[i+1].index : content.length;
            let sectionBody = content.substring(matches[i].index + matches[i].length, nextIndex);
            
            // Only replace the FIRST occurrence of an inner wrapper background
            let wrapperMatch = sectionBody.match(/<div[^>]*max-w-\[\d+px\][^>]*>/);
            if (wrapperMatch) {
                let wrapperStr = wrapperMatch[0];
                wrapperStr = wrapperStr.replace(/bg-(white|\[#F9F7F1\]|\[#F6F3F0\]|\[#FDFDFD\]|\[#F5F2EB\])/g, 'bg-transparent');
                sectionBody = sectionBody.substring(0, wrapperMatch.index) + wrapperStr + sectionBody.substring(wrapperMatch.index + wrapperMatch[0].length);
            }

            newContent += sectionStr + sectionBody;
        }
        content = newContent;
    }
    
    // Also remove main tag background
    content = content.replace(/<main[^>]+>/g, (match) => {
        return match.replace(/bg-\[#FDFDFD\]/, 'bg-transparent');
    });

    fs.writeFileSync(file, content);
});
console.log('Done!');
