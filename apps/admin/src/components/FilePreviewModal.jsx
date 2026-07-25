import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const FilePreviewModal = ({ previewFile, onClose }) => {
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);

  useEffect(() => {
    if (!previewFile) {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
      return;
    }
    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const urlObj = new URL(`/api/files/view/formulaires/${encodeURIComponent(previewFile)}`, baseUrl);
        if (token) urlObj.searchParams.set('token', token);
        const res = await fetch(urlObj.toString());
        if (res.ok) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          setPreviewBlobUrl(objUrl);
        }
      } catch (err) {
        console.error("Error fetching file for preview:", err);
      }
    };
    fetchPdf();
    
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewFile]);

  if (!previewFile) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div style={{width: '80%', height: '80%', background: '#FFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
          <h3 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Eye size={16} /> Prévisualisation du document : {previewFile}
          </h3>
          <button type="button" onClick={onClose} className="btn btn-outline" style={{padding: '0.25rem 0.5rem', height: 'auto'}}>Fermer</button>
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', padding: '2rem'}}>
          <div style={{width: '100%', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden'}}>
            {(() => {
              if (!previewBlobUrl) {
                return (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    Chargement du document...
                  </div>
                );
              }
              if (previewFile?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
                return (
                  <img 
                    src={previewBlobUrl} 
                    alt={previewFile}
                    style={{width: '100%', height: '100%', objectFit: 'contain'}} 
                  />
                );
              }
              return (
                <object 
                  data={previewBlobUrl}
                  type="application/pdf"
                  title="Prévisualisation PDF"
                  style={{width: '100%', height: '100%', border: 'none'}}
                >
                  <p>Impossible d'afficher ce fichier directement. <a href={previewBlobUrl} target="_blank" rel="noopener noreferrer">Téléchargez-le ici</a>.</p>
                </object>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
