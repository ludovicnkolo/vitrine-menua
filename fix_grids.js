const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/app/[lang]', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1fr 2fr with gap 5rem items start -> grid-cols-1 md:grid-cols-[1fr_2fr]
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 2fr",\s*gap:\s*"5rem",\s*alignItems:\s*"start"\s*\}\}/g, 'className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start"');
    
    // 1fr 2fr without gap
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 2fr",\s*gap:\s*"4rem"\s*\}\}/g, 'className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16"');

    // 1fr 1fr with gap 1.25rem
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 1fr",\s*gap:\s*"1\.25rem"\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-5"');

    // 1fr 1fr with gap 5rem items start
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 1fr",\s*gap:\s*"5rem",\s*alignItems:\s*"start"\s*\}\}/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start"');

    // 1fr 1fr with gap 0.85rem 2.5rem
    content = content.replace(/style=\{\{\s*listStyle:\s*"none",\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 1fr",\s*gap:\s*"0\.85rem 2\.5rem"\s*\}\}/g, 'className="list-none grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10"');
    
    // 1fr 1fr with gap 0.6rem 1.5rem
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"1fr 1fr",\s*gap:\s*"0\.6rem 1\.5rem"\s*\}\}/g, 'className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6"');

    // auto 1fr with gap 4rem items start
    content = content.replace(/style=\{\{\s*display:\s*"grid",\s*gridTemplateColumns:\s*"auto 1fr",\s*gap:\s*"4rem",\s*alignItems:\s*"start"\s*\}\}/g, 'className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start"');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
