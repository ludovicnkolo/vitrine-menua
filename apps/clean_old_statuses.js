const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function replaceInFiles(dir) {
  const files = execSync(`find ${dir} -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json"`).toString().split('\n').filter(Boolean);
  
  files.forEach(file => {
    if (file.includes('node_modules') || file.includes('.next') || file.includes('dist') || file.includes('.git') || file.includes('backups/')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace "OUVERT" fallback to "NOUVEAU"
    content = content.replace(/\|\|\ "OUVERT"/g, '|| "NOUVEAU"');
    content = content.replace(/\|\|\ 'OUVERT'/g, "|| 'NOUVEAU'");
    content = content.replace(/status:\ "OUVERT"/g, 'status: "NOUVEAU"');
    content = content.replace(/newStatus\ =\ "OUVERT"/g, 'newStatus = "NOUVEAU"');
    content = content.replace(/newStatus\ ===\ "OUVERT"/g, 'newStatus === "NOUVEAU"');
    content = content.replace(/=== "OUVERT"/g, '=== "NOUVEAU"');
    content = content.replace(/!== "OUVERT"/g, '!== "NOUVEAU"');
    
    // For locales and badges
    content = content.replace(/"OUVERT": "Ouvert",/g, '');
    content = content.replace(/"OUVERT": "Open",/g, '');
    content = content.replace(/OUVERT: \{ text: "Ouvert", class: "badge-progress" \}, \/\/ Dossier \/ Mission/g, '');
    content = content.replace(/<option value="OUVERT">Ouvert<\/option>/g, '');
    
    // Same for EN_REVUE
    content = content.replace(/"EN_REVUE": "En revue",/g, '');
    content = content.replace(/"EN_REVUE": "In Review",/g, '');
    content = content.replace(/EN_REVUE: \{([\s\S]*?)badge-purple([\s\S]*?)\},/g, '');
    content = content.replace(/<option value="EN_REVUE">En revue<\/option>/g, '');
    content = content.replace(/EN_REVUE: "En revue",/g, '');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  });
}

replaceInFiles('/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend');
replaceInFiles('/home/kratos-financials-inc/Documents/kratos/site_web/apps/admin');
