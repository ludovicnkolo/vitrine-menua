const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app', '[lang]');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix generateMetadata
      content = content.replace(
        /export async function generateMetadata\(\{ params: \{ lang \} \}: \{ params: \{ lang: string \} \}\): Promise<Metadata> \{/,
        "export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {\n  const { lang } = await params;"
      );
      
      // Fix page component
      content = content.replace(
        /export default function ([A-Za-z0-9_]+)\(\{ params: \{ lang \} \}: \{ params: \{ lang: string \} \}\) \{/g,
        "export default async function $1({ params }: { params: Promise<{ lang: string }> }) {\n  const { lang } = await params;"
      );
      
      // Fix async page component (just in case)
      content = content.replace(
        /export default async function ([A-Za-z0-9_]+)\(\{ params: \{ lang \} \}: \{ params: \{ lang: string \} \}\) \{/g,
        "export default async function $1({ params }: { params: Promise<{ lang: string }> }) {\n  const { lang } = await params;"
      );

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDirectory(dir);
console.log('Fixed params in all pages.');
