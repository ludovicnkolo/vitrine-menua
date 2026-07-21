import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';
import { mockDossiers, mockTasks, mockInbox, mockContactInbox, mockRecrutementInbox, mockClients, mockRoles } from '../utils/mockData';

const DossiersPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultDossier, setConsultDossier] = useState(null);
  const [editDossier, setEditDossier] = useState(null);
  const [localConsultTask, setLocalConsultTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProfil, setFilterProfil] = useState('all');
  const [filterOrigine, setFilterOrigine] = useState('all');
  const menuRef = useRef(null);

  // States for real API data
  const [dbDossiers, setDbDossiers] = useState([]);
  const [dbTasks, setDbTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
    Promise.all([
      fetch(`${apiUrl}/api/crm/dossiers`, { headers }).then(res => res.json()).catch(() => []),
      fetch(`${apiUrl}/api/crm/tasks`, { headers }).then(res => res.json()).catch(() => [])
    ]).then(([dossiers, tasks]) => {
      if (Array.isArray(dossiers) && dossiers.length > 0) setDbDossiers(dossiers);
      if (Array.isArray(tasks) && tasks.length > 0) setDbTasks(tasks);
      setIsLoading(false);
    });
  }, []);

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
        position: 'absolute', right: '0', top: '100%', marginTop: '0.5rem',
        background: '#FFF', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--border)', minWidth: '160px', zIndex: 10, padding: '0.5rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setConsultDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }} style={{width: '100%', textAlign: 'left', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.875rem'}}>
          <Eye size={16} color="var(--primary)" /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { setEditDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }} style={{width: '100%', textAlign: 'left', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.875rem'}}>
          <Pencil size={16} color="#D97706" /> Modifier
        </button>
        <button className="dropdown-item" onClick={() => setOpenMenuId(null)} style={{width: '100%', textAlign: 'left', padding: '0.5rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.875rem'}}>
          <Trash size={16} /> Supprimer
        </button>
      </div>
    );
  };

  if (consultDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === consultDossier.id);
    
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button onClick={() => setConsultDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux dossiers</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter le Dossier: {consultDossier.id}</h2>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier</label>
            <input type="text" defaultValue={consultDossier.name} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Origine</label>
            <input type="text" defaultValue={consultDossier.origine} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
            <input type="text" defaultValue={consultDossier.createdBy} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Profil</label>
            <input type="text" defaultValue={consultDossier.profil} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
            <input type="text" defaultValue={consultDossier.date} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
               {getStatusBadge(consultDossier.status)}
            </div>
          </div>
        </div>

        <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Tâches associées</h4>
          {associatedTasks.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {associatedTasks.map(task => (
                <div key={task.id} onClick={() => setLocalConsultTask(task)} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}>
                  <div>
                    <strong style={{display: 'block', fontSize: '0.875rem'}}>{task.subject || `Tâche ${task.id}`}</strong>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Assigné à: {task.assignedTo} • Créé le {task.createdAt}</span>
                  </div>
                  <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(task.status)}</span>
                </div>
              ))}
            </div>
          ) : (
             <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
               Aucune tâche associée pour le moment.
             </div>
          )}
        </div>

        {localConsultTask && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="fade-in" style={{background: '#FFF', width: '90%', maxWidth: '800px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
                <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Tâche: {localConsultTask.id}</h2>
                <button onClick={() => setLocalConsultTask(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
                  <input type="text" defaultValue={localConsultTask.subject || `Tâche ${localConsultTask.id}`} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
                    <input type="text" defaultValue={localConsultTask.createdBy || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
                    <input type="text" defaultValue={localConsultTask.assignedTo} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
                  <textarea defaultValue={localConsultTask.message || 'Aucun message.'} readOnly style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: 'var(--text-main)'}}></textarea>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut de la tâche</label>
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
          <button onClick={() => setEditDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux dossiers</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier le Dossier: {editDossier.id}</h2>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier</label>
            <input type="text" defaultValue={editDossier.name} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: '#FFF', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Origine</label>
            <input type="text" defaultValue={editDossier.origine} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
            <input type="text" defaultValue={editDossier.createdBy} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Profil</label>
            <input type="text" defaultValue={editDossier.profil} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Date de création</label>
            <input type="date" defaultValue={editDossier.date} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: '#FFF', color: 'var(--text-main)'}} />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</label>
            <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
               {getStatusBadge(editDossier.status)}
            </div>
          </div>
        </div>

        <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Gérer les tâches associées</h4>
          {associatedTasks.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {associatedTasks.map(task => (
                <div key={task.id} onClick={() => setLocalConsultTask(task)} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}>
                  <div>
                    <strong style={{display: 'block', fontSize: '0.875rem'}}>{task.subject || `Tâche ${task.id}`}</strong>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Assigné à: {task.assignedTo} • Créé le {task.createdAt}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    {getStatusBadge(task.status)}
                    <button onClick={(e) => { e.stopPropagation(); alert(`Tâche ${task.id} supprimée avec succès !`); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)'}} title="Supprimer la tâche">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
               Aucune tâche associée pour le moment.
             </div>
          )}
        </div>

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button onClick={() => setEditDossier(null)} className="btn btn-outline">Annuler</button>
          <button onClick={() => { setEditDossier(null); alert('Dossier modifié avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>

        {localConsultTask && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="fade-in" style={{background: '#FFF', width: '90%', maxWidth: '800px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
                <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Tâche: {localConsultTask.id}</h2>
                <button onClick={() => setLocalConsultTask(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem', marginLeft: 'auto'}}>Fermer</button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
                  <input type="text" defaultValue={localConsultTask.subject || `Tâche ${localConsultTask.id}`} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
                    <input type="text" defaultValue={localConsultTask.createdBy || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
                    <input type="text" defaultValue={localConsultTask.assignedTo} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
                  <textarea defaultValue={localConsultTask.message || 'Aucun message.'} readOnly style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: 'var(--text-main)'}}></textarea>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut de la tâche</label>
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
          value={filterProfil}
          onChange={(e) => setFilterProfil(e.target.value)}
          style={{padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', minWidth: '150px'}}
        >
          <option value="all">Profil: Tous</option>
          <option value="Entreprise">Entreprise</option>
          <option value="Particulier">Particulier</option>
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
              <th>Profil</th>
              <th>Date de création</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dbDossiers.filter(d => {
              let matchStatus = filterStatus === 'all' || d.status === filterStatus;
              let matchProfil = filterProfil === 'all' || d.profil === filterProfil;
              let matchOrigine = filterOrigine === 'all' || d.origine === filterOrigine;
              let matchSearch = true;
              if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const creatorName = d.createdBy?.name || '';
                matchSearch = (d.id || '').toLowerCase().includes(q) || 
                              (d.name || '').toLowerCase().includes(q) || 
                              creatorName.toLowerCase().includes(q);
              }
              
              const dOrigin = d.origin || 'INTERNE';
              const dCreatorName = d.createdBy?.name || 'Inconnu';
              const dCreatorRole = d.createdBy?.role || '-';
              
              return matchStatus && matchProfil && matchOrigine && matchSearch;
            }).map(d => {
              const dOrigin = d.origin || 'INTERNE';
              const dCreatorName = d.createdBy?.name || 'Inconnu';
              const dCreatorRole = d.createdBy?.role || '-';
              return (
              <tr key={d.id}>
                <td style={{fontWeight: 500}}>{d.id}</td>
                <td><strong style={{display: 'block', color: 'var(--text-main)'}}>{d.name}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize'}}>{dOrigin}</span></td>
                <td>{dCreatorName}</td>
                <td>{getStatusBadge(d.status)}</td>
                <td>
                  <span style={{padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, background: dCreatorRole === 'ADMIN' ? '#EFF6FF' : '#F5F3FF', color: dCreatorRole === 'ADMIN' ? '#2563EB' : '#7C3AED'}}>
                    {dCreatorRole}
                  </span>
                </td>
                <td style={{color: 'var(--text-muted)'}}>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td style={{textAlign: 'right'}}>
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                      <button onClick={(e) => toggleMenu(e, d.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}} title="Options">
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
    </div>
  )
}

export default DossiersPage;