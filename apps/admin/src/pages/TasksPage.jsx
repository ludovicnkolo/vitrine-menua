import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const TasksPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultTask, setConsultTask] = useState(null);
  const [taskFile, setTaskFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const menuRef = useRef(null);

  // Real API states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      const res = await fetch(`${apiUrl}/api/crm/tasks`, { headers });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  useEffect(() => { fetchData(); }, []);


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
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const renderDropdown = (taskId) => {
    if (openMenuId !== taskId) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '130px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setOpenMenuId(null); setConsultTask(tasks.find(t => t.id === taskId)); }}>
          <Eye size={14} /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { setOpenMenuId(null); alert('Supprimer la tâche'); }} style={{color: 'var(--danger)'}}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  if (createTaskModal) {
    return (
      <div className="fade-in" style={{width: '100%', padding: '0'}}>
        <div className="" style={{width: '100%', padding: '0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Nouvelle Tâche (Liée à {consultTask?.dossierId})</h3>
            <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la tâche</label>
              <input type="text" placeholder="Sujet de la tâche..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigner à</label>
              <select className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                <option>Alice Martin (Expert Comptable)</option>
                <option>Jean Dupont (Juriste)</option>
                <option>Support Menua</option>
              </select>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
              <input type="text" value={consultTask?.dossierId || ''} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-muted)'}} />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
              <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginBottom: 0}}>
                  <Files size={16} />
                  <span style={{fontSize: '0.875rem', fontWeight: 500}}>
                    {newTaskFile ? newTaskFile.name : 'Joindre un fichier...'}
                  </span>
                  <input type="file" style={{display: 'none'}} onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNewTaskFile(e.target.files[0]); }} />
                </label>
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
              <textarea placeholder="Détails de la tâche à effectuer..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
            <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline">Annuler</button>
            <button onClick={() => { setCreateTaskModal(false); setConsultTask(null); alert('Nouvelle tâche créée avec succès !'); }} className="btn btn-primary">Créer la tâche</button>
          </div>
        </div>
      </div>
    );
  }

  if (consultTask) {
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux tâches</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter la Tâche: {consultTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
            <input type="text" defaultValue={consultTask.subject} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
              <input type="text" defaultValue={consultTask.createdBy || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
              <input type="text" defaultValue={consultTask.assignedTo} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
            <input type="text" defaultValue={consultTask.dossierId} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
            <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
              {consultTask.attachments && consultTask.attachments.length > 0 ? consultTask.attachments.map((att, idx) => (
                <label key={idx} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'default', marginBottom: '0.5rem'}}>
                  <input type="checkbox" checked={true} readOnly />
                  <span style={{fontSize: '0.875rem', color: 'var(--text-main)'}}>Inclure le fichier lié ({att})</span>
                </label>
              )) : (
                <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Aucune pièce jointe lors de la création.</span>
              )}
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
            <textarea defaultValue={consultTask.message} readOnly style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: 'var(--text-main)'}}></textarea>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut de la tâche</label>
            <select className="input-field" defaultValue={consultTask.status} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
              <option value="NEW">Nouveau</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="IN_REVIEW">En révision</option>
              <option value="VALIDATED">Validé</option>
              <option value="TO_ASSIGN">À assigner</option>
            </select>
          </div>

          <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
            <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Tâches liées (Sous-tâches)</h4>
            {consultTask.id === 'TSK-101' ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <div 
                  onClick={() => setConsultTask({ id: 'TSK-105', dossierId: 'DOS-24-002', createdBy: 'Jean Dupont', assignedTo: 'Jean Dupont', status: 'IN_PROGRESS', subject: 'Demande de documents complémentaires', message: 'Veuillez demander les Kbis manquants au client.', attachments: ['kbis_manquant.pdf'] })}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}
                >
                  <div>
                    <strong style={{display: 'block', fontSize: '0.875rem'}}>Demande de documents complémentaires</strong>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Créé par: Jean Dupont • Assigné à: Jean Dupont</span>
                  </div>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#D97706', background: '#FEF3C7', padding: '0.25rem 0.5rem', borderRadius: '4px', height: 'fit-content'}}>En cours</span>
                </div>
                <div 
                  onClick={() => setConsultTask({ id: 'TSK-106', dossierId: 'DOS-24-002', createdBy: 'Alice Martin', assignedTo: 'Alice Martin', status: 'VALIDATED', subject: 'Vérification des bilans N-1', message: 'Les bilans N-1 ont été revérifiés et tout est en ordre.', attachments: ['bilan_2025_verifie.pdf', 'rapport_audit.pdf'] })}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s'}}
                >
                  <div>
                    <strong style={{display: 'block', fontSize: '0.875rem'}}>Vérification des bilans N-1</strong>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Créé par: Alice Martin • Assigné à: Alice Martin</span>
                  </div>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#48BB78', background: '#F0FFF4', padding: '0.25rem 0.5rem', borderRadius: '4px', height: 'fit-content'}}>Terminé</span>
                </div>
              </div>
            ) : (
               <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                 Aucune tâche liée pour le moment.
               </div>
            )}
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline">Annuler</button>
          <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer une tâche liée</button>
          <button onClick={() => { setConsultTask(null); setTaskFile(null); alert('Tâche mise à jour avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Missions & Tâches</h1>
          <p style={{color: 'var(--text-muted)'}}>Attributions internes et ordres de mission</p>
        </div>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
        <div style={{flex: 1, position: 'relative'}}>
          <Search size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}} />
          <input 
            type="text" 
            placeholder="Rechercher par dossier, émetteur ou responsable..." 
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
          style={{padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', minWidth: '200px'}}
        >
          <option value="all">Tous les statuts</option>
          <option value="NEW">Nouveau</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="IN_REVIEW">En contrôle</option>
          <option value="VALIDATED">Validé</option>
          <option value="TO_ASSIGN">À attribuer</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Dossier Associé</th>
              <th>Émetteur</th>
              <th>Responsable</th>
              <th>Création</th>
              <th>Statut</th>
              <th>Échéance</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(t => {
              let matchStatus = true;
              if (filterStatus !== 'all') {
                matchStatus = t.status === filterStatus;
              }
              let matchSearch = true;
              if (searchQuery) {
                const lowerQ = searchQuery.toLowerCase();
                const dossName = t.dossier?.name || t.dossierId || '';
                const createdName = t.createdBy?.name || '';
                const assignedName = t.assignedTo?.name || '';
                matchSearch = dossName.toLowerCase().includes(lowerQ) ||
                              createdName.toLowerCase().includes(lowerQ) ||
                              assignedName.toLowerCase().includes(lowerQ);
              }
              return matchStatus && matchSearch;
            }).map(t => (
              <tr key={t.id}>
                <td style={{color: 'var(--primary)', fontWeight: 500}}>{t.dossier?.name || t.dossierId}</td>
                <td><span style={{fontWeight: 500, color: 'var(--text-main)'}}>{t.createdBy?.name || 'Inconnu'}</span></td>
                <td>{t.assignedTo?.name || 'Non assigné'}</td>
                <td><span style={{color: 'var(--text-muted)'}}>{new Date(t.createdAt).toLocaleDateString()}</span></td>
                <td>{getStatusBadge(t.status)}</td>
                <td style={{color: 'var(--danger)', fontWeight: 500}}>{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'Aucune'}</td>
                <td style={{textAlign: 'right'}}>
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                      <button onClick={(e) => toggleMenu(e, t.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}} title="Options">
                        <MoreVertical size={18} />
                      </button>
                      {renderDropdown(t.id)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default TasksPage;