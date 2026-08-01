import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Oui", cancelText = "Annuler", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ background: '#FFF', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onCancel} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>{cancelText}</button>
          <button 
            onClick={onConfirm} 
            className="btn btn-primary" 
            style={type === 'danger' ? { background: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem 1rem' } : { padding: '0.5rem 1rem' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
