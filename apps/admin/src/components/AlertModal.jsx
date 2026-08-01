import React from 'react';

const AlertModal = ({ isOpen, title = "Information", message, onClose, buttonText = "OK", type = "info" }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ background: '#FFF', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: type === 'error' ? 'var(--danger)' : 'var(--text-main)' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
