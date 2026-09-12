import React, { useEffect, useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { getSafeApiUrl } from '../utils/helpers';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FilePreviewModal = ({ previewFile, onClose }) => {
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!previewFile) {
      setPreviewBlobUrl(null);
      setError(false);
      setNumPages(null);
      setPageNumber(1);
      setScale(1.0);
      return;
    }
    setError(false);
    
    try {
      const token = sessionStorage.getItem('adminToken');
      const parts = previewFile.split('/');
      let bucket = 'formulaires';
      let filename = previewFile;
      if (parts.length > 1) {
        bucket = parts.shift();
        filename = parts.join('/');
      }
      // Utilise le proxy backend avec stream=true pour contourner le blocage CORS de S3 OVH
      // (S3 OVH ne retourne pas Access-Control-Allow-Origin sur les URLs présignées)
      const urlObj = new URL(getSafeApiUrl(`/api/files/view/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`));
      if (token) urlObj.searchParams.set('token', token);
      urlObj.searchParams.set('stream', 'true');
      
      setPreviewBlobUrl(urlObj.toString());
    } catch (err) {
      console.error("Error setting preview URL:", err);
      setError(true);
    }
  }, [previewFile]);

  if (!previewFile) return null;

  const isImage = previewFile.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  const isPdf = previewFile.match(/\.pdf$/i);
  const isUnsupported = !isImage && !isPdf;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div style={{width: '80%', height: '80%', background: '#FFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        
        {/* En-tête */}
        <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
          <h3 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          </h3>
          
          {/* Barre de contrôle pour le PDF */}
          {!isImage && !error && previewBlobUrl && (
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFF', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border)'}}>
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><ZoomOut size={16}/></button>
                <span style={{fontSize: '0.875rem', minWidth: '40px', textAlign: 'center'}}>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => s + 0.2)} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><ZoomIn size={16}/></button>
              </div>
            </div>
          )}

          <button type="button" onClick={onClose} className="btn btn-outline" style={{padding: '0.25rem 0.5rem', height: 'auto'}}>Fermer</button>
        </div>

        {/* Zone d'affichage */}
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', padding: '2rem', overflow: 'hidden'}}>
          <div style={{width: '100%', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'auto', display: 'flex', justifyContent: 'center'}}>
            {(() => {
              if (error) {
                return (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '2rem', textAlign: 'center'}}>
                    <div style={{color: 'var(--danger)', fontWeight: 500}}>Ce fichier est introuvable ou inaccessible.</div>
                    <a href={previewBlobUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{textDecoration: 'none'}}>
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                );
              }
              if (!previewBlobUrl) {
                return (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    Chargement du document...
                  </div>
                );
              }
              if (isImage) {
                return (
                  <img 
                    src={previewBlobUrl} 
                    alt={previewFile}
                    style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
                  />
                );
              }
              if (isUnsupported) {
                return (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '2rem', textAlign: 'center'}}>
                    <div style={{fontSize: '3rem', color: 'var(--text-muted)'}}>📄</div>
                    <div style={{color: 'var(--text-main)', fontWeight: 500}}>Ce type de fichier ne peut pas être prévisualisé directement.</div>
                    <a href={previewBlobUrl} download={previewFile.split('/').pop()} target="_blank" rel="noreferrer" className="btn btn-primary" style={{textDecoration: 'none'}}>
                      Télécharger le fichier
                    </a>
                  </div>
                );
              }
              return (
                <div style={{ padding: '1rem' }}>
                  <Document
                    file={previewBlobUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={(err) => {
                      console.error("React-pdf error:", err);
                      setError(true);
                    }}
                    loading={<div style={{padding: '2rem'}}>Chargement du PDF...</div>}
                    error={<div style={{padding: '2rem', color: 'var(--danger)'}}>Impossible de charger le PDF.</div>}
                  >
                    {Array.from(new Array(numPages || 0), (el, index) => (
                      <div key={`page_${index + 1}`} style={{ marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <Page 
                          pageNumber={index + 1} 
                          scale={scale} 
                          renderTextLayer={true} 
                          renderAnnotationLayer={true}
                        />
                      </div>
                    ))}
                  </Document>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
