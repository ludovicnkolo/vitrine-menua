const fs = require('fs');
const path = require('path');

const directory = './src';

// Colors to look for
const goldColors = ['#D9B151', '#E0D6C8', '#C49A6C', '#8B6240'];
const properties = ['bg', 'text', 'border', '!text', '!bg', '!border'];

function replaceColorInMatch(match, context) {
  // Determine if context is dark or light
  // A dark context usually has text-white, or bg-[#1A0E08], bg-[#122017]
  const isDarkContext = context.includes('text-white') || context.includes('text-[#D8DCE8]');
  
  // A light context has text-[#122017], text-[#1A0E08], text-[#4A4E5A]
  const isLightContext = context.includes('text-[#122017]') || context.includes('text-[#1A0E08]') || context.includes('text-[#4A4E5A]');

  // Default to white if it's a hero absolute frame (we know these are dark)
  if (context.includes('h-[1.5px]') || context.includes('w-[1.5px]')) {
    return match.replace(/\[#([A-Fa-f0-9]{6})\]/g, 'white');
  }

  // Determine replacement color based on property type
  const isBg = match.startsWith('bg-') || match.startsWith('!bg-');
  const isText = match.startsWith('text-') || match.startsWith('!text-');
  const isBorder = match.startsWith('border-') || match.startsWith('!border-');

  let replacementColor = 'white';
  if (isLightContext && !isDarkContext) {
    replacementColor = '[#1A0E08]';
  } else if (!isLightContext && !isDarkContext) {
    // If we can't determine, look for background colors
    if (context.includes('bg-white') || context.includes('bg-[#F5F2EB]')) {
      replacementColor = '[#1A0E08]';
    }
  }

  if (isBg) {
    return match.replace(/\[#([A-Fa-f0-9]{6})\]/g, replacementColor);
  }
  if (isText) {
    return match.replace(/\[#([A-Fa-f0-9]{6})\]/g, replacementColor);
  }
  if (isBorder) {
    return match.replace(/\[#([A-Fa-f0-9]{6})\]/g, replacementColor);
  }

  return match;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const color of goldColors) {
    for (const prop of properties) {
      // Regex to match exact tailwind class, e.g. text-[#D9B151], bg-[#E0D6C8]/30
      const regex = new RegExp(`${prop}-\\[${color}\\](?:\\/\\d+)?`, 'g');
      content = content.replace(regex, (match, offset, str) => {
        let context = str.substring(Math.max(0, offset - 300), Math.min(str.length, offset + 300));
        return replaceColorInMatch(match, context);
      });
    }
  }

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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(directory);
