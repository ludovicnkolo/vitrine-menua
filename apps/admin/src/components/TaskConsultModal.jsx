import React, { useState } from 'react';
import ReadOnlyField from './ReadOnlyField';
import { getStatusBadge, getSafeApiUrl } from '../utils/helpers';   
import { Paperclip, FileText, Eye, Download } from 'lucide-react';       
import FilePreviewModal from './FilePreviewModal';       
import FeedbackThread from './FeedbackThread';    

const TaskConsultModal = ({ task, onClose, titlePrefix = "Consulter la Tâche:" }) => {
  const [previewFile, setPreviewFile] = useState(null);
  
  if (!task) return null;                                                           

  const documents = task.documents || [];

  const renderDocuments = () => {
    if (documents.length === 0) {
      return (
        <div style={{padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
          Aucun document attaché.
        </div>
      );
    }
    return (
      <select 
        onChange={(e) => {
          if(e.target.value) {
            setPreviewFile(e.target.value);
            e.target.selectedIndex = 0;
          }
        }}
        className="input-field"
        style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit'}}
      >
        <option value="">-- Sélectionner un document pour le consulter --</option>
        {documents.map(doc => (
          <option key={doc.id} value={doc.url}>{doc.name}</option>
        ))}
      </select>
    );
  };

  return (
    <>
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="fade-in" style={{background: '#FFF', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour</button>
            <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{titlePrefix} {task.reference || task.id}</h2>
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

            {/* Documents section */}
            <div style={{borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem'}}>
              <h4 style={{margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Paperclip size={15} /> Documents attachés
              </h4>
              {renderDocuments()}
            </div>

            {/* Fil de corrections — visible si des feedbacks existent */}
            <FeedbackThread
              adminFeedback={task.adminFeedback || null}
              managerFeedback={task.managerFeedback || null}
              currentStatus={task.status}
            />
          </div>
        </div>
      </div>
      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />
    </>
  );
};

export default TaskConsultModal;
