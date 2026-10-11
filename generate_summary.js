const fs = require('fs');

const report = JSON.parse(fs.readFileSync('audit_report.json', 'utf8'));

let md = `# Rapport d'Audit Qualité Frontend - Menua Consulting\n\n`;
md += `Ce rapport détaille l'état actuel de votre base de code par rapport aux nouvelles **Directives de Développement Frontend Strictes** (TypeScript, Tailwind, etc.).\n\n`;

md += `## 1. Fichiers Javascript à convertir en TypeScript (.tsx)\n`;
md += `*L'utilisation de \`.jsx\` est désormais proscrite au profit de \`.tsx\` avec typage strict.*\n\n`;
md += `**Total : ${report.jsxFiles.length} fichiers restants**\n`;
if(report.jsxFiles.length > 0) {
  md += "```\n" + report.jsxFiles.map(f => "- " + f).join('\n') + "\n```\n";
}

md += `\n## 2. Utilisation de CSS Inline (style={{...}})\n`;
md += `*Interdiction formelle du CSS inline. Utiliser exclusivement Tailwind CSS.*\n\n`;
md += `**Total : ${report.inlineStyles.length} occurrences de \`style={{\` trouvées**\n`;
md += `*Action requise : Remplacer toutes ces occurrences par des classes Tailwind.*\n`;

md += `\n## 3. Composants Monolithiques (> 150 lignes)\n`;
md += `*Séparation UI et Logique : Les composants de plus de 150 lignes doivent être découpés.*\n\n`;
md += `**Total : ${report.largeFiles.length} fichiers dépassant la limite**\n`;
if(report.largeFiles.length > 0) {
    report.largeFiles.sort((a,b) => b.lines - a.lines);
    md += "```\n" + report.largeFiles.map(f => `- ${f.file} (${f.lines} lignes)`).join('\n') + "\n```\n";
}

md += `\n## 4. Logique métier en dur (Rôles)\n`;
md += `*Aucune règle métier codée en dur dans le JSX (ex: vérification de texte "Admin").*\n\n`;
md += `**Total : ${report.hardcodedRoles.length} occurrences potentielles**\n`;
if(report.hardcodedRoles.length > 0) {
    md += "```\n" + report.hardcodedRoles.join('\n') + "\n```\n";
}

md += `\n## 5. Fuites mémoires potentielles (useEffect)\n`;
md += `*Tout \`setTimeout\` ou interval dans un \`useEffect\` doit avoir une fonction de nettoyage.*\n\n`;
md += `**Total : ${report.potentialMemoryLeaks.length} blocs \`useEffect\` suspects détectés**\n`;
if(report.potentialMemoryLeaks.length > 0) {
    md += "```\n" + report.potentialMemoryLeaks.join('\n') + "\n```\n";
}

md += `\n## 6. Utilisation du type \`any\` dans TypeScript\n`;
md += `*Interdiction formelle d'utiliser \`any\`. Privilégier \`unknown\` ou des interfaces strictes.*\n\n`;
md += `**Total : ${report.anyUsage.length} occurrences de \`any\` trouvées dans les fichiers .ts/.tsx**\n`;

fs.writeFileSync('audit_frontend.md', md);
