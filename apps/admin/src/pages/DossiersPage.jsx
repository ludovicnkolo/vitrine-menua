import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Pencil, Eye, Trash } from 'lucide-react';
import { getStatusBadge } from '../utils/helpers';

const DossiersPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultDossier, setConsultDossier] = useState(null);
  const [editDossier, setEditDossier] = useState(null);
  const [localConsultTask, setLocalConsultTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterOrigine, setFilterOrigine] = useState('all');
  const menuRef = useRef(null);

  // States for real API data
  const [dbDossiers, setDbDossiers] = useState([]);
  const [dbTasks, setDbTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDossiers = () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
    
    Promise.all([
      fetch(`${apiUrl}/api/crm/dossiers?page=${page}&limit=4&search=${encodeURIComponent(searchQuery)}&status=${filterStatus}&role=${filterRole}&origin=${filterOrigine}`, { headers }).then(res => res.json()).catch(() => ({ data: [], totalPages: 1 })),
      fetch(`${apiUrl}/api/crm/tasks?page=1&limit=1000`, { headers }).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([dossiersRes, tasksRes]) => {
      if (dossiersRes?.data) {
        setDbDossiers(dossiersRes.data);
        setTotalPages(dossiersRes.totalPages || 1);
      } else if (Array.isArray(dossiersRes)) {
        setDbDossiers(dossiersRes);
        setTotalPages(1);
      }
      
      if (tasksRes?.data) {
        setDbTasks(tasksRes.data);
      } else if (Array.isArray(tasksRes)) {
        setDbTasks(tasksRes);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus, filterRole, filterOrigine]);

  useEffect(() => {
    fetchDossiers();
  }, [page, filterStatus, filterRole, filterOrigine, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const renderDropdown = (id) => {
    if (openMenuId !== id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button type="button" className="dropdown-item" onClick={() => { setConsultDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }}>
          <Eye size={14} color="var(--primary)" /> Consulter
        </button>
        <button type="button" className="dropdown-item" onClick={() => { setEditDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }}>
          <Pencil size={14} color="#D97706" /> Modifier
        </button>
        <button type="button" className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  };

  if (consultDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === consultDossier.id);
    
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => setConsultDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux dossiers</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter le Dossier: {consultDossier.reference || consultDossier.id}</h2>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier</label>
            <input type="text" value={consultDossier.name || ''} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Origine</label>
            <input type="text" value={consultDossier.origin || 'INTERNE'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
            <input type="text" value={consultDossier.createdBy?.name || 'Inconnu'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Rôle du créateur</label>
            <input type="text" value={consultDossier.createdBy?.role?.name || '-'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
            <input type="text" value={new Date(consultDossier.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
               {getStatusBadge(consultDossier.status)}
            </div>
          </div>
        </div>

        <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Missions associées</h4>
          {associatedTasks.length > 0 ? (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
              {associatedTasks.map(task => (
                <div key={task.id} role="button" tabIndex={0} onClick={() => setLocalConsultTask(task)} onKeyDown={(e) => { if (e.key === 'Enter') setLocalConsultTask(task); }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{task.subject || `Mission ${task.reference || task.id}`}</strong>
                    <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(task.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
               Aucune mission associée pour le moment.
             </div>
          )}
        </div>

        {localConsultTask && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="fade-in" style={{background: '#FFF', width: '90%', maxWidth: '800px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
                <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Mission: {localConsultTask.reference || localConsultTask.id}</h2>
                <button type="button" onClick={() => setLocalConsultTask(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
                  <input type="text" value={(() => {
                    if (!localConsultTask.description) return 'Sans objet';
                    const match = localConsultTask.description.match(/Objet: (.*)/);
                    if (match) return match[1];
                    return localConsultTask.description.split('\n')[0] || 'Sans objet';
                  })()} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
                    <input type="text" value={localConsultTask.createdBy?.name || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
                    <input type="text" value={localConsultTask.assignedTo?.name || 'Non défini'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
                    <input type="text" value={localConsultTask.createdAt ? new Date(localConsultTask.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Inconnue'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                    <input type="text" value={localConsultTask.echeance ? new Date(localConsultTask.echeance).toLocaleDateString('fr-FR') : 'Non définie'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
                  <div style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
                     {getStatusBadge(localConsultTask.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (editDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === editDossier.id);
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux dossiers</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier le Dossier: {editDossier.reference || editDossier.id}</h2>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier</label>
            <input type="text" defaultValue={editDossier.name} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: '#FFF', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Origine</label>
            <input type="text" value={editDossier.origin || 'INTERNE'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
            <input type="text" value={editDossier.createdBy?.name || 'Inconnu'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Rôle du créateur</label>
            <input type="text" value={editDossier.createdBy?.role?.name || '-'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
            <input type="text" value={new Date(editDossier.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
               {getStatusBadge(editDossier.status)}
            </div>
          </div>
        </div>

        <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Gérer les missions associées</h4>
          {associatedTasks.length > 0 ? (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
              {associatedTasks.map(task => (
                <div key={task.id} role="button" tabIndex={0} onClick={() => setLocalConsultTask(task)} onKeyDown={(e) => { if (e.key === 'Enter') setLocalConsultTask(task); }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{task.subject || `Mission ${task.reference || task.id}`}</strong>
                    <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(task.status)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <button type="button" onClick={(e) => { e.stopPropagation(); alert(`Mission ${task.id} supprimée avec succès !`); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)'}} title="Supprimer la mission">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
               Aucune mission associée pour le moment.
             </div>
          )}
        </div>

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={() => { setEditDossier(null); alert('Dossier modifié avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>

        {localConsultTask && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="fade-in" style={{background: '#FFF', width: '90%', maxWidth: '800px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
                <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Mission: {localConsultTask.reference || localConsultTask.id}</h2>
                <button type="button" onClick={() => setLocalConsultTask(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
                  <input type="text" value={(() => {
                    if (!localConsultTask.description) return 'Sans objet';
                    const match = localConsultTask.description.match(/Objet: (.*)/);
                    if (match) return match[1];
                    return localConsultTask.description.split('\n')[0] || 'Sans objet';
                  })()} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
                    <input type="text" value={localConsultTask.createdBy?.name || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
                    <input type="text" value={localConsultTask.assignedTo?.name || 'Non défini'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
                    <input type="text" value={localConsultTask.createdAt ? new Date(localConsultTask.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Inconnue'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                    <input type="text" value={localConsultTask.echeance ? new Date(localConsultTask.echeance).toLocaleDateString('fr-FR') : 'Non définie'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
                  <div style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
                     {getStatusBadge(localConsultTask.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tous les Dossiers</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion complète et cycle de vie</p>
        </div>
      </div>
      
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
        <div style={{flex: '1 1 250px', position: 'relative'}}>
          <Search size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}} />
          <input 
            type="text" 
            placeholder="Rechercher par ID, Nom ou Créateur..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field" 
            style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)'}} 
          />
        </div>
        <select 
          className="input-field" 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', minWidth: '150px'}}
        >
          <option value="all">Statut: Tous</option>
          <option value="OUVERT">Ouvert</option>
          <option value="FERME">Fermé</option>
          <option value="ARCHIVE">Archivé</option>
        </select>
        <select 
          className="input-field" 
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', minWidth: '150px'}}
        >
          <option value="all">Rôle: Tous</option>
          <option value="Super-administrateur">Super-administrateur</option>
          <option value="Responsable opérationnel">Responsable opérationnel</option>
        </select>
        <select 
          className="input-field" 
          value={filterOrigine}
          onChange={(e) => setFilterOrigine(e.target.value)}
          style={{padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', minWidth: '150px'}}
        >
          <option value="all">Origine: Toutes</option>
          <option value="Site Web">Site Web</option>
          <option value="Interne">Interne</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du dossier</th>
              <th>Origine</th>
              <th>Créé par</th>
              <th>Statut</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Chargement des dossiers...</td></tr>
            ) : dbDossiers.map(d => {
              const dOrigin = d.origin || 'INTERNE';
              const dCreatorName = d.createdBy?.name || 'Inconnu';
              const dCreatorRole = d.createdBy?.role?.name || '-';
              return (
              <tr key={d.id}>
                <td><div className="truncate-text" style={{fontWeight: 500}}>{d.reference || d.id}</div></td>
                <td><strong className="truncate-name" style={{color: 'var(--text-main)'}}>{d.name}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize'}}>{dOrigin}</span></td>
                <td><div className="truncate-text">{dCreatorName}</div></td>
                <td><div className="truncate-text">{getStatusBadge(d.status)}</div></td>
                <td>
                  <span style={{padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, background: dCreatorRole === 'ADMIN' ? '#EFF6FF' : '#F5F3FF', color: dCreatorRole === 'ADMIN' ? '#2563EB' : '#7C3AED'}}>
                    {dCreatorRole}
                  </span>
                </td>
                <td style={{color: 'var(--text-muted)', whiteSpace: "nowrap", fontSize: "0.875rem"}}>{new Date(d.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button type="button" onClick={(e) => toggleMenu(e, d.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}} title="Options">
                        <MoreVertical size={18} />
                      </button>
                      {renderDropdown(d.id)}
                    </div>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages >= 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1rem', alignItems: 'center' }}>
          <button type="button"
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: '#FFF', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Précédent
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Page {page} sur {totalPages}</span>
          <button type="button"
            disabled={page >= totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: '#FFF', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default DossiersPage;