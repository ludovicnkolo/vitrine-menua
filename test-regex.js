const html = `
      <div style="margin-bottom: 20px;">
        
  <div style="margin-bottom: 8px; font-size: 14px; color: #4a5568; line-height: 1.5;">
    <strong style="color: #141824; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Disponibilité</strong> : 
    <span style="margin-left: 4px;">Immédiate</span>
  </div>

  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
    <strong style="color: #141824; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 12px;">Message / Motivations</strong>
    <div style="color: #4a5568; font-size: 14px; line-height: 1.6; background-color: #fcfcfc; padding: 15px; border-radius: 4px;">Bonjour je suis motive</div>
  </div>
`;
const extractField = (html, fieldName) => {
  if (!html) return null;
  const regex = new RegExp(`>\\s*${fieldName}\\s*<\\/strong>\\s*:\\s*<span[^>]*>([\\s\\S]*?)<\\/span>`, 'i');
  const match = html.match(regex);
  if (match && match[1]) {
    return match[1].replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
};
const extractBlock = (html, blockName) => {
  if (!html) return null;
  const regex = new RegExp(`>\\s*${blockName}\\s*<\\/strong>\\s*<div[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
  const match = html.match(regex);
  if (match && match[1]) {
    return match[1].replace(/<br\\s*\\/?>/gi, '\n').replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
}
console.log('Dispo:', extractField(html, 'Disponibilité'));
console.log('Message:', extractBlock(html, 'Message / Motivations'));
