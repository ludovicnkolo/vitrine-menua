import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye, Globe, ArrowRight, Image as ImageIcon, ChevronUp, ChevronDown, X } from 'lucide-react';
import { getSafeApiUrl, apiFetch, formatDate } from '../utils/helpers';

const EMPTY_SECTION = () => ({ subtitle: '', text: '', imageKey: '', imagePreview: '', uploading: false });

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
  const [sections, setSections] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (type === 'success') {
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 18000);
    }
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
      setPreviewImage(pub.coverImageUrl || pub.coverImage || '');
      // Parse sections from JSON string if stored as string
      let parsedSections = [];
      if (pub.sections) {
        try {
          const raw = typeof pub.sections === 'string' ? JSON.parse(pub.sections) : pub.sections;
          parsedSections = Array.isArray(raw) ? raw.map(s => ({
            subtitle: s.subtitle || '',
            text: s.text || '',
            imageKey: s.imageKey || '',
            imagePreview: s.imageUrl || s.imageKey || '',
            uploading: false
          })) : [];
        } catch (_) {}
      }
      setSections(parsedSections);
    } else {
      setEditingPub(null);
      setTitle('');
      setContentHtml('');
      setCoverImage('');
      setPreviewImage('');
      setStatus('BROUILLON');
      setCategory('FINANCE ET COMPTABILITÉ');
      setSections([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPub(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title) { showToast('Le titre est requis', 'error'); return; }

    const data = {
      title,
      type: 'ACTUALITE',
      category,
      contentHtml,
      coverImage,
      status,
      sections: sections.map(s => ({ subtitle: s.subtitle, text: s.text, imageKey: s.imageKey }))
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
      if (res.ok) { showToast('Publication supprimée.'); fetchPublications(); }
      else showToast('Erreur lors de la suppression.', 'error');
    } catch (err) { console.error(err); }
  };

  // Upload cover image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
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
      if (data.success) { setCoverImage(data.url); showToast('Image uploadée avec succès'); }
      else showToast("Erreur lors de l'upload.", 'error');
    } catch (err) { console.error(err); showToast("Erreur réseau.", 'error'); }
    finally { setUploadingImg(false); }
  };

  // ── Sections helpers ──────────────────────────────────────────────────────────
  const addSection = () => setSections(prev => [...prev, EMPTY_SECTION()]);

  const removeSection = (idx) => setSections(prev => prev.filter((_, i) => i !== idx));

  const moveSection = (idx, dir) => {
    setSections(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const updateSection = (idx, field, value) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSectionImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    updateSection(idx, 'imagePreview', localUrl);
    updateSection(idx, 'uploading', true);
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
        updateSection(idx, 'imageKey', data.url);
        showToast('Image de section uploadée');
      } else {
        showToast("Erreur upload image de section.", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", 'error');
    } finally {
      updateSection(idx, 'uploading', false);
    }
  };

  const removeSectionImage = (idx) => {
    updateSection(idx, 'imageKey', '');
    updateSection(idx, 'imagePreview', '');
  };

  const filteredPubs = publications.filter(p => p.type === 'ACTUALITE');

  return (
    <div style={{padding: '0 1rem'}}>
      {toast.show && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: toast.type === 'success' ? '#10B981' : '#EF4444',
          color: '#FFF', padding: '1rem 1.5rem', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 9999, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '420px'
        }}>
          <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
          <button type="button" onClick={() => setToast({ show: false, message: '', type: 'success' })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#FFF', fontWeight: 'bold', fontSize: '1.1rem', padding: '0 4px' }}
            title="Fermer">✕</button>
        </div>
      )}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <Globe size={28} style={{color: 'var(--primary)'}} />
          Module CMS (Site Web)
        </h1>
        <button onClick={() => openModal()} className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Plus size={18} /> Nouvelle Actualité
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
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '2rem 1rem'}}>
          <div style={{background: '#FFF', borderRadius: '12px', width: '100%', maxWidth: '1100px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', minHeight: '600px'}}>

            {/* ── FORMULAIRE ── */}
            <div style={{flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '90vh'}}>
              <h2 style={{marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem'}}>
                {editingPub ? 'Modifier la publication' : 'Créer une publication'}
              </h2>
              <form onSubmit={handleSave}>
                {/* Titre */}
                <div style={{marginBottom: '1rem'}}>
                  <label style={labelStyle}>Titre *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                </div>

                {/* Image + Statut */}
                <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Image de couverture</label>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} id="cms-image-upload" style={{display: 'none'}} />
                      <label htmlFor="cms-image-upload" className="btn btn-outline" style={{cursor: 'pointer', flexShrink: 0}}>
                        {uploadingImg ? 'Upload en cours...' : 'Parcourir...'}
                      </label>
                    </div>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem'}}>Formats acceptés : JPG, PNG, WEBP.</span>
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}>Statut</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                      <option value="BROUILLON">Brouillon</option>
                      <option value="PUBLIE">Publié</option>
                    </select>
                  </div>
                </div>

                {/* Catégorie */}
                <div style={{marginBottom: '1rem'}}>
                  <label style={labelStyle}>Catégorie *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} required style={inputStyle}>
                    <option value="">Sélectionner</option>
                    <option value="FINANCE ET COMPTABILITÉ">FINANCE ET COMPTABILITÉ</option>
                    <option value="BACK ET MIDDLE OFFICE">BACK ET MIDDLE OFFICE</option>
                    <option value="DATA ET REPORTING">DATA ET REPORTING</option>
                    <option value="RISQUES, CONFORMITÉ ET KYC">RISQUES, CONFORMITÉ ET KYC</option>
                    <option value="GESTION DE PATRIMOINE">GESTION DE PATRIMOINE</option>
                    <option value="ORGANISATION ET EXTERNALISATION">ORGANISATION ET EXTERNALISATION</option>
                  </select>
                </div>

                {/* Contenu principal */}
                <div style={{marginBottom: '1.5rem'}}>
                  <label style={labelStyle}>Contenu principal (Texte / HTML)</label>
                  <textarea
                    value={contentHtml}
                    onChange={e => setContentHtml(e.target.value)}
                    rows={8}
                    style={{...inputStyle, resize: 'vertical', fontFamily: 'monospace'}}
                  />
                  <small style={{color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem'}}>Vous pouvez utiliser des balises HTML pour enrichir le texte.</small>
                </div>

                {/* ── SECTIONS ── */}
                <div style={{marginBottom: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <label style={{...labelStyle, margin: 0, fontSize: '0.95rem', fontWeight: 600}}>
                      Sections <span style={{fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem'}}>(sous-titres + contenu + image optionnelle)</span>
                    </label>
                    <button type="button" onClick={addSection} className="btn btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}>
                      <Plus size={14} /> Ajouter une section
                    </button>
                  </div>

                  {sections.length === 0 && (
                    <div style={{border: '1px dashed var(--border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                      Aucune section ajoutée. Cliquez sur "Ajouter une section" pour enrichir l'article.
                    </div>
                  )}

                  {sections.map((sec, idx) => (
                    <div key={idx} style={{border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem', background: '#FAFBFC', position: 'relative'}}>
                      {/* En-tête section */}
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <span style={{fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem'}}>Section {idx + 1}</span>
                        <div style={{display: 'flex', gap: '0.25rem'}}>
                          <button type="button" onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                            style={{...iconBtnStyle, opacity: idx === 0 ? 0.3 : 1}} title="Monter">
                            <ChevronUp size={14} />
                          </button>
                          <button type="button" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}
                            style={{...iconBtnStyle, opacity: idx === sections.length - 1 ? 0.3 : 1}} title="Descendre">
                            <ChevronDown size={14} />
                          </button>
                          <button type="button" onClick={() => removeSection(idx)}
                            style={{...iconBtnStyle, color: 'var(--danger)', borderColor: 'var(--danger)'}} title="Supprimer">
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Sous-titre */}
                      <div style={{marginBottom: '0.75rem'}}>
                        <label style={{...labelStyle, fontSize: '0.8rem'}}>Sous-titre</label>
                        <input type="text" value={sec.subtitle} placeholder="Sous-titre de la section..."
                          onChange={e => updateSection(idx, 'subtitle', e.target.value)}
                          style={{...inputStyle, fontSize: '0.875rem'}} />
                      </div>

                      {/* Texte */}
                      <div style={{marginBottom: '0.75rem'}}>
                        <label style={{...labelStyle, fontSize: '0.8rem'}}>Texte</label>
                        <textarea value={sec.text} placeholder="Contenu de la section..."
                          onChange={e => updateSection(idx, 'text', e.target.value)}
                          rows={4}
                          style={{...inputStyle, resize: 'vertical', fontSize: '0.875rem'}} />
                      </div>

                      {/* Image optionnelle */}
                      <div>
                        <label style={{...labelStyle, fontSize: '0.8rem'}}>Image (optionnelle)</label>
                        {sec.imagePreview ? (
                          <div style={{position: 'relative', display: 'inline-block'}}>
                            <img src={sec.imagePreview} alt="section" style={{height: '100px', borderRadius: '6px', objectFit: 'cover', display: 'block', border: '1px solid var(--border)'}} />
                            <button type="button" onClick={() => removeSectionImage(idx)}
                              style={{position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'}}>
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input type="file" accept="image/*" id={`section-img-${idx}`}
                              onChange={e => handleSectionImageUpload(e, idx)} style={{display: 'none'}} />
                            <label htmlFor={`section-img-${idx}`} className="btn btn-outline"
                              style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.75rem'}}>
                              <ImageIcon size={14} /> {sec.uploading ? 'Upload...' : 'Choisir une image'}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boutons */}
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
                  <button type="button" onClick={closeModal} className="btn btn-outline" style={{fontWeight: 600}}>Annuler</button>
                  <button type="submit" className="btn btn-primary" style={{fontWeight: 600}}>
                    {editingPub ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>

            {/* ── APERÇU ── */}
            <div style={{width: '360px', flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '2rem', background: '#F8FAFC', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Eye size={18} /> Aperçu (Carte)
              </h3>

              <div style={{display: 'flex', flexDirection: 'column', background: '#FFF', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem'}}>
                <div style={{height: '150px', overflow: 'hidden', background: '#1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                  {previewImage
                    ? <img src={previewImage} alt="Cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    : <span style={{color: 'rgba(232,225,215,0.2)', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.9rem'}}>MENUA CONSULTING</span>
                  }
                  {category && <div style={{position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#e8e1d7', color: '#141824', padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{category}</div>}
                </div>
                <div style={{padding: '1.25rem'}}>
                  <p style={{color: '#6e7891', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase', margin: '0 0 0.4rem'}}>
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 style={{color: '#141824', fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, margin: '0 0 0.6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                    {title || 'Titre de la publication...'}
                  </h3>
                  <p style={{color: '#a0aec0', fontSize: '0.75rem', fontWeight: 300, lineHeight: 1.5, margin: '0 0 0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                    {(() => {
                      const plain = (contentHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                      const words = plain.split(' ').filter(Boolean);
                      return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : (plain || 'Extrait du contenu...');
                    })()}
                  </p>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#141824', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem'}}>
                    Lire l'article <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              {/* Aperçu sections */}
              {sections.length > 0 && (
                <div>
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem'}}>
                    {sections.length} section{sections.length > 1 ? 's' : ''} ajoutée{sections.length > 1 ? 's' : ''}
                  </p>
                  {sections.map((s, i) => (
                    <div key={i} style={{borderLeft: '3px solid #e8e1d7', paddingLeft: '0.75rem', marginBottom: '0.75rem'}}>
                      {s.subtitle && <p style={{fontWeight: 600, fontSize: '0.8rem', color: '#141824', margin: '0 0 0.2rem'}}>{s.subtitle}</p>}
                      {s.imagePreview && <img src={s.imagePreview} alt="" style={{height: '50px', borderRadius: '4px', objectFit: 'cover', marginBottom: '0.2rem', display: 'block'}} />}
                      {s.text && <p style={{fontSize: '0.75rem', color: '#6e7891', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{s.text.substring(0, 60)}{s.text.length > 60 ? '...' : ''}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// Shared styles
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' };
const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
const iconBtnStyle = { background: 'none', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.35rem', display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)' };

export default CMSPage;
