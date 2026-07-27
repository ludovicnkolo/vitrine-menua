import React from 'react';
import { Trash } from 'lucide-react';

const AttachmentChips = ({ attachment, onRemove }) => {
  if (!attachment || !attachment.trim()) return null;

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
      {attachment.split(',').map((att) => att.trim() && (
        <div key={att.trim()} style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FFF', padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)', maxWidth: '300px'}}>
          <span style={{fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{att.trim()}</span>
          {onRemove && (
            <button type="button" onClick={() => onRemove(att.trim())} style={{background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem', display: 'flex'}} title="Supprimer la pièce jointe">
              <Trash size={16}/>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentChips;
