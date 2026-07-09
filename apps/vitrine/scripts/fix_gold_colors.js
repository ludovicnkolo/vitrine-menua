const fs = require('fs');
const path = require('path');

const directory = './src';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Hero semi-frames (always white text)
  content = content.replace(/bg-\[#D9B151\]/g, (match, offset, str) => {
    // If it's a hero frame, or list bullet, check surrounding text
    let context = str.substring(Math.max(0, offset - 300), Math.min(str.length, offset + 300));
    if (context.includes('h-[1.5px]') || context.includes('w-[1.5px]')) {
      return 'bg-white';
    }
    if (context.includes('text-white') || context.includes('text-[#D8DCE8]')) {
      return match.replace('bg-[#D9B151]', 'bg-white');
    }
    if (context.includes('text-[#122017]') || context.includes('text-[#1A0E08]')) {
      return match.replace('bg-[#D9B151]', 'bg-[#1A0E08]');
    }
    return match;
  });

  content = content.replace(/bg-\[#E0D6C8\]/g, (match, offset, str) => {
    let context = str.substring(Math.max(0, offset - 300), Math.min(str.length, offset + 300));
    if (context.includes('h-[1.5px]') || context.includes('w-[1.5px]')) {
      return 'bg-white';
    }
    if (context.includes('text-white')) {
      return match.replace('bg-[#E0D6C8]', 'bg-white');
    }
    if (context.includes('text-[#122017]') || context.includes('text-[#1A0E08]')) {
      return match.replace('bg-[#E0D6C8]', 'bg-[#1A0E08]');
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(directory);
