import React, { useState, useEffect } from 'react';
import { getSafeApiUrl } from '../utils/helpers';
import { Folder, FileText, ChevronRight, Home, Search, X, Plus, Upload, Trash, File, Edit, FileImage, FileArchive, FileVideo, FileAudio, FileSpreadsheet, FileCode } from 'lucide-react';
import FilePreviewModal from '../components/FilePreviewModal';

const getFileIconAndColor = (filename) => {
  if (!filename) return { Icon: FileText, color: 'var(--primary)' };
  const ext = filename.split('.').pop().toLowerCase();
  
  switch(ext) {
    case 'pdf':
      return { Icon: FileText, color: '#EF4444' }; // Rouge
    case 'doc':
    case 'docx':
      return { Icon: FileText, color: '#3B82F6' }; // Bleu
    case 'xls':
    case 'xlsx':
    case 'csv':
      return { Icon: FileSpreadsheet, color: '#10B981' }; // Vert
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return { Icon: FileImage, color: '#8B5CF6' }; // Violet
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z':
      return { Icon: FileArchive, color: '#F59E0B' }; // Orange
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
      return { Icon: FileVideo, color: '#EC4899' }; // Rose
    case 'mp3':
    case 'wav':
    case 'ogg':
      return { Icon: FileAudio, color: '#14B8A6' }; // Bleu canard
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'json':
    case 'html':
    case 'css':
      return { Icon: FileCode, color: '#64748B' }; // Gris
    default:
      return { Icon: FileText, color: 'var(--primary)' }; // Par défaut
  }
};

export default function DocumentsPage() {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState([]); // [{id, name}]
  const [searchQuery, setSearchQuery] = useState('');
  
  const [contextMenu, setContextMenu] = useState(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [renameName, setRenameName] = useState('');

  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      // Fetching all dossiers with pagination disabled or limit very high
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers?limit=1000&t=${Date.now()}`), {
        headers: { 'Authorization': `Bearer ${token}`, 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setDossiers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
  
  // Find current folder's children (Dossiers where parentDossierId === currentFolderId)
  const childFolders = dossiers.filter(d => d.parentDossierId === currentFolderId);
  
  // Find current folder's documents (Documents attached to the current dossier)
  const currentFolder = dossiers.find(d => d.id === currentFolderId);
  const documents = currentFolder ? currentFolder.documents || [] : [];

  const navigateTo = (folder) => {
    setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
  };

  const navigateUp = (index) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const navigateToFromSearch = (folderId, isFolder) => {
    // Reconstruct the path from the root to this folder
    const path = [];
    let currId = folderId;
    while (currId) {
      const f = dossiers.find(d => d.id === currId);
      if (!f) break;
      path.unshift({ id: f.id, name: f.name });
      currId = f.parentDossierId;
    }
    
    // Si c'est un dossier, on veut naviguer vers son PARENT pour pouvoir le voir sous forme d'icône.
    if (isFolder && path.length > 0) {
      path.pop(); // Retire le dossier lui-même du chemin pour rester dans son parent
    }
    
    setCurrentPath(path);
    setSearchQuery('');
  };

  // Search Logic
  const isSearching = searchQuery.trim() !== '';
  let searchFolders = [];
  let searchFiles = [];

  if (isSearching) {
    const q = searchQuery.toLowerCase();
    searchFolders = dossiers.filter(d => d.name && d.name.toLowerCase().includes(q));
    
    dossiers.forEach(d => {
      if (d.documents) {
        d.documents.forEach(doc => {
          if (doc.name && doc.name.toLowerCase().includes(q)) {
            searchFiles.push({ ...doc, dossierName: d.name });
          }
        });
      }
    });
  }

  // Context Menu Handlers
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      item,
      type // 'folder', 'file', 'empty'
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener('click', closeContextMenu);
    return () => document.removeEventListener('click', closeContextMenu);
  }, []);

  const handleDeleteDossier = async (folder) => {
    if (!folder.parentDossierId) {
      window.customAlert("Les dossiers principaux ne peuvent être supprimés que via l'interface principale 'Dossiers'.");
      return;
    }
    const protectedNames = ['ADMINISTRATION & FINANCES', 'OPÉRATIONS & RÉALISATIONS', 'RELATIONS & DÉVELOPPEMENT'];
    if (protectedNames.includes(folder.name)) {
      window.customAlert("Ce sous-dossier par défaut ne peut pas être supprimé de la GED.");
      return;
    }

    if (!(await window.customConfirm("Voulez-vous vraiment supprimer ce dossier ? Cette action est irréversible.", "Suppression de dossier"))) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${folder.id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDossiers(prev => prev.filter(d => d.id !== folder.id && d.parentDossierId !== folder.id));
        fetchDossiers();
      } else window.customAlert("Erreur lors de la suppression");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!(await window.customConfirm("Voulez-vous vraiment supprimer ce document ? Cette action est irréversible.", "Suppression de document"))) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(getSafeApiUrl(`/api/crm/documents/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDossiers(prev => prev.map(d => ({
          ...d,
          documents: d.documents ? d.documents.filter(doc => doc.id !== id) : []
        })));
        fetchDossiers();
      } else {
        const errData = await res.json().catch(() => ({}));
        window.customAlert("Erreur lors de la suppression : " + (errData.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur de connexion");
    }
  };

  const handleRenameFolder = async (e) => {
    e.preventDefault();
    if (!renameItem || !renameName.trim()) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${renameItem.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: renameName.trim() })
      });
      if (res.ok) {
        setShowRenameModal(false);
        setRenameItem(null);
        setRenameName('');
        fetchDossiers();
      } else window.customAlert("Erreur lors du renommage");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      
      // Inherit origin from current folder, or default
      const parentDossier = currentFolderId ? dossiers.find(d => d.id === currentFolderId) : null;
      
      const res = await fetch(getSafeApiUrl('/api/crm/dossiers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: newFolderName,
          description: `Sous-dossier GED`,
          origin: parentDossier ? parentDossier.origin : 'INTERNE',
          parentDossierId: currentFolderId || null
        })
      });
      if (res.ok) {
        setShowNewFolderModal(false);
        setNewFolderName('');
        fetchDossiers();
      } else window.customAlert("Erreur de création");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!uploadFile || !currentFolderId) return;
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('bucket', 'ged'); // MUST be before file for multer
      formData.append('file', uploadFile);

      const uploadRes = await fetch(getSafeApiUrl('/api/files/upload'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        
        const docRes = await fetch(getSafeApiUrl('/api/crm/documents'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            name: uploadFile.name,
            filename: uploadData.fileData.filename,
            bucket: 'ged',
            dossierId: currentFolderId
          })
        });

        if (docRes.ok) {
          setShowUploadModal(false);
          setUploadFile(null);
          fetchDossiers();
        } else window.customAlert("Erreur de liaison document");
      } else window.customAlert("Erreur d'upload");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-main)' }}>Chargement de la GED...</div>;

  return (
    <div style={{ padding: '2rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Explorateur de Fichiers (GED)</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Rechercher dossiers, fichiers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 2rem 0.6rem 2.2rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: '#F8FAFC' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Breadcrumb Navigation (Hide when searching) */}
      {!isSearching && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => navigateUp(-1)}
            style={{ background: 'none', border: 'none', color: currentFolderId === null ? 'var(--text-main)' : 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: currentFolderId === null ? 600 : 400 }}
          >
            <Home size={18} /> Racine
          </button>
          
          {currentPath.map((path, index) => (
            <React.Fragment key={path.id}>
              <ChevronRight size={16} color="var(--text-muted)" />
              <button 
                onClick={() => navigateUp(index)}
                style={{ background: 'none', border: 'none', color: index === currentPath.length - 1 ? 'var(--text-main)' : 'var(--primary)', cursor: 'pointer', fontSize: '1rem', fontWeight: index === currentPath.length - 1 ? 600 : 400 }}
              >
                {path.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Explorer Content */}
      <div 
        style={{ background: '#FFF', border: '1px solid var(--border)', borderRadius: '0.5rem', flex: 1, padding: '1.5rem', overflowY: 'auto' }}
        onContextMenu={(e) => handleContextMenu(e, null, 'empty')}
      >
        
        {!isSearching && childFolders.length === 0 && documents.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            Ce dossier est vide.
          </div>
        )}

        {isSearching && searchFolders.length === 0 && searchFiles.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            Aucun résultat pour "{searchQuery}".
          </div>
        )}

        {/* --- SEARCH RESULTS --- */}
        {isSearching && (
          <div>
            {searchFolders.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Dossiers trouvés</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {searchFolders.map(folder => (
                    <div 
                      key={folder.id} 
                      onDoubleClick={() => navigateToFromSearch(folder.id, true)}
                      onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, folder, 'folder'); }}
                      style={{ width: '150px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '1rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s, border-color 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <Folder size={40} color="#eab308" fill="#eab308" />
                      <div style={{ textAlign: 'center', wordBreak: 'normal', overflowWrap: 'anywhere', fontWeight: '500', color: 'var(--text-main)', fontSize: '0.75rem', width: '100%' }}>{folder.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchFiles.length > 0 && (
              <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Fichiers trouvés</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {searchFiles.map(doc => {
                    const { Icon, color } = getFileIconAndColor(doc.name);
                    return (
                    <div 
                      key={doc.id}
                      onDoubleClick={() => setPreviewFile(doc.url)}
                      onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, doc, 'file'); }}
                      style={{ width: '150px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '1rem 0.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                      <Icon size={40} color={color} />
                      <div style={{ textAlign: 'center', wordBreak: 'normal', overflowWrap: 'anywhere', fontSize: '0.75rem', color: 'var(--text-main)', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.name}>{doc.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dans: {doc.dossierName}</div>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- NORMAL FOLDER VIEW --- */}
        {!isSearching && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {/* Render Subfolders */}
            {childFolders.map(folder => (
              <div 
                key={folder.id} 
                onDoubleClick={() => navigateTo(folder)}
                onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, folder, 'folder'); }}
                style={{ width: '150px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '1rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Folder size={40} color="#eab308" fill="#eab308" />
                <div style={{ textAlign: 'center', wordBreak: 'normal', overflowWrap: 'anywhere', fontWeight: '500', color: 'var(--text-main)', fontSize: '0.75rem', width: '100%' }}>{folder.name}</div>
              </div>
            ))}

            {/* Render Documents */}
            {documents.map(doc => {
              const { Icon, color } = getFileIconAndColor(doc.name);
              return (
              <div 
                key={doc.id}
                onDoubleClick={() => setPreviewFile(doc.url)}
                onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, doc, 'file'); }}
                style={{ width: '150px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '1rem 0.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <Icon size={40} color={color} />
                <div style={{ textAlign: 'center', wordBreak: 'normal', overflowWrap: 'anywhere', fontSize: '0.75rem', color: 'var(--text-main)', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.name}>{doc.name}</div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          style={{
            position: 'fixed', top: contextMenu.mouseY, left: contextMenu.mouseX, 
            background: '#FFF', border: '1px solid var(--border)', borderRadius: '6px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', 
            zIndex: 9999, minWidth: '180px', padding: '0.5rem 0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'empty' && (
            <>
              <button 
                onClick={() => { closeContextMenu(); setShowNewFolderModal(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Folder size={16} /> Nouveau sous-dossier
              </button>
              {currentFolderId && (
                <button 
                  onClick={() => { closeContextMenu(); setShowUploadModal(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <File size={16} /> Ajouter un fichier
                </button>
              )}
            </>
          )}

          {contextMenu.type === 'folder' && (
            <>
              <button 
                onClick={() => { closeContextMenu(); navigateTo(contextMenu.item); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Folder size={16} /> Ouvrir
              </button>
              <button 
                onClick={() => { closeContextMenu(); setRenameItem(contextMenu.item); setRenameName(contextMenu.item.name); setShowRenameModal(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Edit size={16} /> Renommer
              </button>
              <button 
                onClick={() => { closeContextMenu(); handleDeleteDossier(contextMenu.item); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--danger)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Trash size={16} /> Supprimer
              </button>
            </>
          )}

          {contextMenu.type === 'file' && (
            <>
              <button 
                onClick={() => { closeContextMenu(); setPreviewFile(contextMenu.item.url); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FileText size={16} /> Ouvrir le fichier
              </button>
              <button 
                onClick={() => { closeContextMenu(); handleDeleteDocument(contextMenu.item.id); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--danger)' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Trash size={16} /> Supprimer
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal Nouveau Dossier */}
      {showNewFolderModal && (
        <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Nouveau dossier</h3>
              <button onClick={() => setShowNewFolderModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier *</label>
                <input autoFocus required type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" onClick={() => setShowNewFolderModal(false)} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
                <button type="submit" disabled={isSubmitting || !newFolderName.trim()} className="btn btn-primary">{isSubmitting ? 'Création...' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Fichier */}
      {showUploadModal && (
        <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Ajouter un fichier</h3>
              <button onClick={() => { setShowUploadModal(false); setUploadFile(null); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleUploadFile}>
              <div style={{marginBottom: '1.5rem'}}>
                <input required type="file" onChange={(e) => setUploadFile(e.target.files[0])} className="input-field" style={{width: '100%', padding: '0.75rem'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" onClick={() => { setShowUploadModal(false); setUploadFile(null); }} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
                <button type="submit" disabled={isSubmitting || !uploadFile} className="btn btn-primary">{isSubmitting ? 'Envoi...' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Renommer Dossier */}
      {showRenameModal && (
        <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Renommer le dossier</h3>
              <button onClick={() => setShowRenameModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleRenameFolder}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nouveau nom *</label>
                <input autoFocus required type="text" value={renameName} onChange={(e) => setRenameName(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button type="button" onClick={() => setShowRenameModal(false)} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
                <button type="submit" disabled={isSubmitting || !renameName.trim()} className="btn btn-primary">{isSubmitting ? 'Sauvegarde...' : 'Renommer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FilePreviewModal 
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};
