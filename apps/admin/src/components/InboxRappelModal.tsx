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
  const [dateError, setDateError] = useState<string>('');

  const getLocalMinDateTime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const validateDate = (val: string): string => {
    if (!val) return '';
    const selected = new Date(val);
    if (isNaN(selected.getTime())) {
      return 'Format de date invalide.';
    }
    const now = new Date();
    // Tolérance d'1 minute pour la saisie de l'heure courante
    if (selected.getTime() < now.getTime() - 60000) {
      return rappelModal?.type === 'ENTRETIEN'
        ? "La date de l'entretien ne peut pas être antérieure à aujourd'hui."
        : "La date de rappel ne peut pas être antérieure à aujourd'hui.";
    }
    return '';
  };

  useEffect(() => {
    if (rappelModal) {
      setRappelDate('');
      setRappelNote('');
      setEntretienLien('');
      setDateError('');
    }
  }, [rappelModal]);

  if (!rappelModal) return null;

  const handleDateChange = (val: string) => {
    setRappelDate(val);
    setDateError(validateDate(val));
  };

  const handleConfirm = async () => {
    const err = validateDate(rappelDate);
    if (err) {
      setDateError(err);
      return; // Bloque la confirmation et maintient la modale ouverte
    }

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
  };

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
              min={getLocalMinDateTime()}
              value={rappelDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border outline-none bg-white text-[0.875rem] box-border transition-all ${
                dateError
                  ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                  : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]'
              }`}
            />
            {dateError && (
              <div className="flex items-center gap-1.5 mt-2 text-red-600 text-[0.8rem] font-medium animate-fadeIn">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{dateError}</span>
              </div>
            )}
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
            onClick={handleConfirm}
            disabled={!!dateError}
            className={`btn btn-primary ${dateError ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxRappelModal;
