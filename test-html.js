const html = `
  <div style="margin-bottom: 20px;">
    
  <div style="margin-bottom: 8px; font-size: 14px; color: #4a5568; line-height: 1.5;">
    <strong style="color: #141824; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Type de client</strong> : 
    <span style="margin-left: 4px;">Entreprise / Organisation</span>
  </div>

    
  <div style="margin-bottom: 8px; font-size: 14px; color: #4a5568; line-height: 1.5;">
    <strong style="color: #141824; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Société</strong> : 
    <span style="margin-left: 4px;">Ma Super Entreprise</span>
  </div>

    
  <div style="margin-bottom: 8px; font-size: 14px; color: #4a5568; line-height: 1.5;">
    <strong style="color: #141824; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Téléphone</strong> : 
    <span style="margin-left: 4px;">0612345678</span>
  </div>

  </div>
`;
const extractFieldFromHtml = (html, fieldName) => {
  if (!html) return null;
  const regex = new RegExp(`>\\s*${fieldName}\\s*<\\/strong>\\s*:\\s*<span[^>]*>([\\s\\S]*?)<\\/span>`, 'i');
  const match = html.match(regex);
  if (match && match[1]) {
    return match[1].replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
};
console.log('Société:', extractFieldFromHtml(html, 'Société'));
console.log('Téléphone:', extractFieldFromHtml(html, 'Téléphone'));
console.log('Type de client:', extractFieldFromHtml(html, 'Type de client'));
