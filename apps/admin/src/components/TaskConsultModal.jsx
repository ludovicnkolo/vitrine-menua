import React from 'react';
import ReadOnlyField from './ReadOnlyField';
import { getStatusBadge } from '../utils/helpers';

const TaskConsultModal = ({ task, onClose, titlePrefix = "Consulter la Tâche:" }) => {
  if (!task) return null;
  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="fade-in" style={{background: '#FFF', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{titlePrefix} {task.reference || task.id}</h2>
          <button type="button" onClick={onClose} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          <ReadOnlyField label="Objet" value={(() => {
            if(!task.description) return 'Sans objet';
            const match = task.description.match(/Objet: (.*)/);
            return match ? match[1] : task.description.split('\n')[0] || 'Sans objet';
          })()} />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <ReadOnlyField label="Créé par" value={task.createdBy?.name || 'Inconnu'} />
            <ReadOnlyField label="Assigné à" value={task.assignedTo?.name || 'Non assigné'} />
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <ReadOnlyField label="Date de création" value={new Date(task.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} />
            <ReadOnlyField label="Échéance" value={task.echeance ? new Date(task.echeance).toLocaleDateString('fr-FR') : 'Non définie'} />
          </div>
          <div>
            <span style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</span>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
              {getStatusBadge(task.status)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskConsultModal;
