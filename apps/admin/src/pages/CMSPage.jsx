import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye, Settings, FileText, Briefcase, Globe, ArrowRight } from 'lucide-react';
import { getSafeApiUrl, apiFetch, formatDate } from '../utils/helpers';
import TabsNavigation from '../components/TabsNavigation';

const CMSPage = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPub, setEditingPub] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('BROUILLON');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/cms');
      if (res.ok) {
        const data = await res.json();
        setPublications(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const openModal = (pub = null) => {
    if (pub) {
      setEditingPub(pub);
      setTitle(pub.title);
      setContentHtml(pub.contentHtml || '');
      setCoverImage(pub.coverImage || '');
      setStatus(pub.status || 'BROUILLON');
      setCategory(pub.category || '');
      setExcerpt(pub.excerpt || '');
      setPreviewImage(pub.coverImageUrl || pub.coverImage || '');
    } else {
      setEditingPub(null);
      setTitle('');
      setContentHtml('');
      setCoverImage('');
      setPreviewImage('');
      setStatus('BROUILLON');
      setCategory('FINANCE ET COMPTABILITÉ');
      setExcerpt('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPub(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) {
      showToast('Le titre est requis', 'error');
      return;
    }
    
    const data = {
      title,
      type: 'ACTUALITE',
      category,
      excerpt: '',
      contentHtml,
      coverImage,
      status
    };

    try {
      let res;
      if (editingPub) {
        res = await apiFetch(`/api/cms/${editingPub.id}`, 'PUT', data);
      } else {
        res = await apiFetch('/api/cms', 'POST', data);
      }
      
      if (res.ok) {
        showToast(`Publication ${editingPub ? 'modifiée' : 'créée'} avec succès.`);
        closeModal();
        fetchPublications();
      } else {
        showToast('Erreur lors de la sauvegarde.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) return;
    
    try {
      const res = await apiFetch(`/api/cms/${id}`, 'DELETE');
      if (res.ok) {
        showToast('Publication supprimée.');
        fetchPublications();
      } else {
        showToast('Erreur lors de la suppression.', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Affiche immédiatement un aperçu local
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    setUploadingImg(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(getSafeApiUrl('/api/cms/upload'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCoverImage(data.url);
        showToast('Image uploadée avec succès');
      } else {
        showToast("Erreur lors de l'upload.", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", 'error');
    } finally {
      setUploadingImg(false);
    }
  };

  const filteredPubs = publications.filter(p => p.type === 'ACTUALITE');

  return (
    <div style={{padding: '0 1rem'}}>
      {toast.show && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', 
          background: toast.type === 'success' ? '#10B981' : '#EF4444', 
          color: '#FFF', padding: '1rem 2rem', borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 9999, fontWeight: 500
        }}>
          {toast.message}
        </div>
      )}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <Globe size={28} style={{color: 'var(--primary)'}} />
          Module CMS (Site Web)
        </h1>
        <button onClick={() => openModal()} className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Plus size={18} />
          Nouvelle Actualité
        </button>
      </div>

      <div className="table-wrapper" style={{marginTop: '1.5rem'}}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Titre</th>
              <th style={{ width: '15%' }}>Auteur</th>
              <th style={{ width: '15%' }}>Statut</th>
              <th style={{ width: '15%' }}>Date</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Chargement...</td></tr>
            ) : filteredPubs.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>Aucune publication trouvée.</td></tr>
            ) : (
              filteredPubs.map(pub => (
                <tr key={pub.id}>
                  <td><strong>{pub.title}</strong></td>
                  <td>{pub.author?.name || 'Inconnu'}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: pub.status === 'PUBLIE' ? '#DCFCE7' : '#F1F5F9',
                      color: pub.status === 'PUBLIE' ? '#166534' : '#475569'
                    }}>
                      {pub.status === 'PUBLIE' ? 'PUBLIÉ' : 'BROUILLON'}
                    </span>
                  </td>
                  <td>{formatDate(pub.createdAt)}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <button onClick={() => openModal(pub)} className="btn btn-outline" style={{padding: '0.35rem 0.5rem'}} title="Modifier">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(pub.id)} className="btn btn-outline" style={{padding: '0.35rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)'}} title="Supprimer">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', borderRadius: '12px', width: '95%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex'}}>
            <div style={{flex: 1, padding: '2rem'}}>
              <h2 style={{marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem'}}>
                {editingPub ? 'Modifier la publication' : 'Créer une publication'}
              </h2>
            <form onSubmit={handleSave}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Titre *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none'}}
                />
              </div>

              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Image de couverture</label>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="cms-image-upload"
                      style={{display: 'none'}}
                    />
                    <label htmlFor="cms-image-upload" className="btn btn-outline" style={{cursor: 'pointer', flexShrink: 0}}>
                      {uploadingImg ? 'Upload en cours...' : 'Parcourir...'}
                    </label>
                  </div>
                  <div style={{marginTop: '0.5rem'}}>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Formats acceptés : JPG, PNG, WEBP.</span>
                  </div>
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Statut</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none'}}
                  >
                    <option value="BROUILLON">Brouillon</option>
                    <option value="PUBLIE">Publié</option>
                  </select>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Catégorie *</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    required
                    style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none'}}
                  >
                    <option value="">Sélectionner</option>
                    <option value="FINANCE ET COMPTABILITÉ">FINANCE ET COMPTABILITÉ</option>
                    <option value="BACK ET MIDDLE OFFICE">BACK ET MIDDLE OFFICE</option>
                    <option value="DATA ET REPORTING">DATA ET REPORTING</option>
                    <option value="RISQUES, CONFORMITÉ ET KYC">RISQUES, CONFORMITÉ ET KYC</option>
                    <option value="GESTION DE PATRIMOINE">GESTION DE PATRIMOINE</option>
                    <option value="ORGANISATION ET EXTERNALISATION">ORGANISATION ET EXTERNALISATION</option>
                  </select>
                </div>
              </div>



              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Contenu (Texte / HTML)</label>
                <textarea 
                  value={contentHtml} 
                  onChange={e => setContentHtml(e.target.value)} 
                  rows={10}
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace'}}
                />
                <small style={{color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem'}}>Vous pouvez utiliser des balises HTML pour enrichir le texte.</small>
              </div>

              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
                <button type="button" onClick={closeModal} className="btn btn-outline" style={{fontWeight: 600}}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" style={{fontWeight: 600}}>
                  {editingPub ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
            </div>
            
            {/* Panneau d'aperçu à droite */}
            <div style={{width: '380px', flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '2rem', background: '#F8FAFC', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', flexDirection: 'column'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Eye size={18} /> Aperçu (Site Web)
              </h3>
              
              <div style={{display: 'flex', flexDirection: 'column', background: '#FFF', border: '1px solid var(--border)', flex: 1, maxHeight: '420px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                <div style={{height: '180px', overflow: 'hidden', background: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                  {previewImage ? (
                    <img src={previewImage} alt="Cover Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <span style={{color: 'rgba(232,225,215,0.2)', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '1rem'}}>MENUA CONSULTING</span>
                  )}
                  {category && (
                    <div style={{position: 'absolute', top: '1rem', left: '1rem', background: '#e8e1d7', color: '#141824', padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                      {category}
                    </div>
                  )}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1.5rem'}}>
                  <p style={{color: '#6e7891', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase'}}>
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 style={{color: '#141824', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.3, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {title || 'Titre de la publication...'}
                  </h3>
                  <p style={{color: '#a0aec0', fontSize: '0.75rem', fontWeight: 300, lineHeight: 1.5, flexGrow: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {contentHtml ? contentHtml.replace(/<[^>]+>/g, '') : 'Extrait du contenu complet de l\'article...'}
                  </p>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#141824', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem'}}>
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSPage;
