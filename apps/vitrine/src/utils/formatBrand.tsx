import React from 'react';

export function formatBrand(text: string) {
  const parts = text.split(/MENUA CONSULTING/g);
  if (parts.length === 1) return text;
  
  return (
    <React.Fragment>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <span className="brand-text">Menua Consulting</span>}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
