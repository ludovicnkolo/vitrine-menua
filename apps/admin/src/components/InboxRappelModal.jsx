import React, { useState } from 'react';

const InboxRappelModal = ({ rappelModal, setRappelModal, handleUpdateMultiple }) => {
  const [rappelDate, setRappelDate] = useState('');
  const [rappelNote, setRappelNote] = useState('');
  const [entretienLien, setEntretienLien] = useState('');

  if (!rappelModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: '#FFF',
          borderRadius: '16px',
          padding: '2rem',
          width: '90%',
          maxWidth: '440px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              {rappelModal.type === 'ENTRETIEN' ? 'Planifier un entretien' : 'Planifier un rappel'}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              {rappelModal.type === 'ENTRETIEN' ? 'Date, heure et lien de la visio' : 'Date, heure et note courte'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {rappelModal.type === 'ENTRETIEN' ? "Date et heure de l'entretien (optionnel)" : 'Date et heure du rappel (optionnel)'}
            </label>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              value={rappelDate}
              onChange={(e) => setRappelDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                outline: 'none',
                background: '#FFF',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {rappelModal.type === 'ENTRETIEN' ? 'Lien visio (optionnel)' : 'Note courte (optionnelle)'}
            </label>
            {rappelModal.type === 'ENTRETIEN' ? (
              <input
                type="url"
                value={entretienLien}
                onChange={(e) => setEntretienLien(e.target.value)}
                placeholder="https://teams.microsoft.com/..."
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  background: '#FFF',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <input
                type="text"
                value={rappelNote}
                onChange={(e) => setRappelNote(e.target.value)}
                placeholder="Ex : En attente de validation interne..."
                maxLength={120}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  background: '#FFF',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1.75rem',
            justifyContent: 'flex-end',
          }}
        >
          <button type="button" onClick={() => setRappelModal(null)} className="btn btn-outline">
            Annuler
          </button>
          <button
            type="button"
            onClick={async () => {
              const fields = { status: rappelModal.status };
              if (rappelModal.type === 'RAPPEL') {
                if (rappelDate) fields.dateRappel = rappelDate;
                if (rappelNote) fields.noteRappel = rappelNote;
              } else {
                if (rappelDate) fields.dateEntretien = rappelDate;
                if (entretienLien) fields.lienVisio = entretienLien;
              }
              await handleUpdateMultiple(fields);
              setRappelModal(null);
            }}
            className="btn btn-primary"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxRappelModal;
