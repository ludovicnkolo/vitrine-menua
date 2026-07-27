import React from 'react';

const AttachmentSelect = ({ files, onPreview }) => {
  if (!files || files.length === 0) {
    return <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Aucun fichier</span>;
  }

  const validFiles = files.filter(Boolean).reduce((acc, f) => {
    if (typeof f === 'string') {
      const parts = f.split(',').map(p => p.trim()).filter(p => p);
      acc.push(...parts);
    }
    return acc;
  }, []);

  if (validFiles.length === 0) {
    return <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Aucun fichier</span>;
  }

  return (
    <select 
      onChange={(e) => {
        if(e.target.value && onPreview) {
          onPreview(e.target.value);
          e.target.selectedIndex = 0;
        }
      }}
      className="input-field"
      style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', width: '100%', background: '#FFF', cursor: 'pointer'}}
    >
      <option value="">-- Sélectionner un fichier pour l'ouvrir --</option>
      {validFiles.map((file, idx) => (
        <option key={`${file}-${idx}`} value={file}>{file}</option>
      ))}
    </select>
  );
};

export default AttachmentSelect;
