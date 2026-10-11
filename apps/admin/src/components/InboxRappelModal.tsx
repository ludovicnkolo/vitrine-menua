import React, { useState, useEffect } from 'react';

export interface RappelModalData {
  type: 'ENTRETIEN' | 'RAPPEL';
  status: string;
}

export interface InboxRappelModalProps {
  rappelModal: RappelModalData | null;
  setRappelModal: (value: RappelModalData | null) => void;
  handleUpdateMultiple: (fields: Record<string, string>) => Promise<void>;
}

const InboxRappelModal: React.FC<InboxRappelModalProps> = ({ 
  rappelModal, 
  setRappelModal, 
  handleUpdateMultiple 
}) => {
  const [rappelDate, setRappelDate] = useState<string>('');
  const [rappelNote, setRappelNote] = useState<string>('');
  const [entretienLien, setEntretienLien] = useState<string>('');

  useEffect(() => {
    if (rappelModal) {
      setRappelDate('');
      setRappelNote('');
      setEntretienLien('');
    }
  }, [rappelModal]);

  if (!rappelModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[2000]">
      <div className="p-8 bg-white rounded-2xl w-[90%] max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div className="flex items-center mb-6 gap-3">
          <div>
            <h3 className="font-bold text-[var(--text-main)] text-[1.1rem]">
              {rappelModal.type === 'ENTRETIEN' ? 'Planifier un entretien' : 'Planifier un rappel'}
            </h3>
            <p className="m-0 text-[0.8rem] text-[var(--text-muted)]">
              {rappelModal.type === 'ENTRETIEN' ? 'Date, heure et lien de la visio' : 'Date, heure et note courte'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 font-semibold text-[0.875rem]">
              {rappelModal.type === 'ENTRETIEN' ? "Date et heure de l'entretien (optionnel)" : 'Date et heure du rappel (optionnel)'}
            </label>
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              value={rappelDate}
              onChange={(e) => setRappelDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] outline-none bg-white text-[0.875rem] box-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-[0.875rem]">
              {rappelModal.type === 'ENTRETIEN' ? 'Lien visio (optionnel)' : 'Note courte (optionnelle)'}
            </label>
            {rappelModal.type === 'ENTRETIEN' ? (
              <input
                type="url"
                value={entretienLien}
                onChange={(e) => setEntretienLien(e.target.value)}
                placeholder="https://teams.microsoft.com/..."
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] outline-none bg-white text-[0.875rem] box-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
            ) : (
              <input
                type="text"
                value={rappelNote}
                onChange={(e) => setRappelNote(e.target.value)}
                placeholder="Ex : En attente de validation interne..."
                maxLength={120}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] outline-none bg-white text-[0.875rem] box-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button 
            type="button" 
            onClick={() => setRappelModal(null)} 
            className="btn btn-outline"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={async () => {
              const fields: Record<string, string> = { status: rappelModal.status };
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
