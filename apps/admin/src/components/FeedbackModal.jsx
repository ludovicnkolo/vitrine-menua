import React, { useState } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';

/**
 * FeedbackModal — Modale de saisie des corrections / instructions
 *
 * Props:
 *  - isOpen: boolean
 *  - mode: 'admin' | 'manager'
 *  - referenceFeedback: string|null  (le feedback admin à inclure éventuellement pour le manager)
 *  - onClose: () => void
 *  - onSubmit: (feedbackText: string) => Promise<void>
 *  - isSubmitting: boolean
 */
const FeedbackModal = ({ isOpen, mode = 'admin', referenceFeedback = null, onClose, onSubmit, isSubmitting }) => {
  const [text, setText] = useState('');
  const [includeRef, setIncludeRef] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isAdmin = mode === 'admin';
  const title = isAdmin ? 'Instructions d\'amélioration' : 'Corrections à apporter';
  const placeholder = isAdmin
    ? 'Décrivez précisément les points à améliorer par le contrôleur...'
    : 'Décrivez les corrections à apporter au collaborateur...';
  const btnLabel = isAdmin ? 'Soumettre à amélioration' : 'Envoyer en révision';

  const handleSubmit = async () => {
    setError('');
    let finalText = text.trim();

    if (!finalText) {
      setError('Veuillez saisir au moins une instruction.');
      return;
    }

    // If manager chose to include admin feedback, prepend it clearly
    if (!isAdmin && includeRef && referenceFeedback) {
      finalText = `[Instructions Admin]\n${referenceFeedback}\n\n[Corrections du Contrôleur]\n${finalText}`;
    }

    await onSubmit(finalText);
    setText('');
    setIncludeRef(false);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 2000
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          if (e.target === e.currentTarget) onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Fermer la modale"
    >
      <div style={{
        background: '#FFF', borderRadius: '12px', width: '90%', maxWidth: '560px',
        padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: isAdmin ? '#FEE2E2' : '#EDE9FE',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MessageSquare size={18} color={isAdmin ? '#B91C1C' : '#6D28D9'} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{title}</h3>
        </div>

        {/* If manager mode and admin feedback exists: show option to include it */}
        {!isAdmin && referenceFeedback && (
          <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '0.75rem 1rem', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="include-admin-feedback"
                checked={includeRef}
                onChange={(e) => setIncludeRef(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer', flexShrink: 0 }}
              />
              <div>
                <label htmlFor="include-admin-feedback" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '0.25rem', color: '#92400E' }}>
                  Inclure les instructions de l'Admin
                </label>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350F', lineHeight: 1.5 }}>
                  {referenceFeedback.length > 120 ? referenceFeedback.slice(0, 120) + '…' : referenceFeedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div>
          <label htmlFor="feedback-text" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>
            {isAdmin ? 'Vos instructions' : 'Vos corrections'}
            <span style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>
          </label>
          <textarea
            id="feedback-text"
            value={text}
            onChange={(e) => { setText(e.target.value); setError(''); }}
            placeholder={placeholder}
            style={{
              width: '100%', minHeight: '140px', padding: '0.75rem',
              borderRadius: '8px', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical',
              lineHeight: 1.6, color: 'var(--text-main)', outline: 'none'
            }}
          />
          {error && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--danger)' }}>{error}</p>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="btn btn-outline">
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="btn btn-primary"
            style={{
              background: isAdmin ? '#B91C1C' : '#6D28D9',
              borderColor: isAdmin ? '#B91C1C' : '#6D28D9',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <CheckCircle size={16} />
            {isSubmitting ? 'Envoi...' : btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
