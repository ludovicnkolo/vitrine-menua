import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const TachesPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultTask, setConsultTask] = useState(null);
  const [taskFile, setTaskFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const menuRef = useRef(null);

  // Real API states
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setRawErrorMsg] = useState(null);
  const setErrorMsg = (msg) => {
    setRawErrorMsg(msg);
    if (msg) setTimeout(() => setRawErrorMsg(null), 3000);
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form states for creating a task
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskMessage, setNewTaskMessage] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskEcheance, setNewTaskEcheance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      const [resTasks, resUsers] = await Promise.all([
        fetch(`${apiUrl}/api/crm/taches?page=${page}&limit=6&status=${filterStatus}&search=${encodeURIComponent(searchQuery)}`, { headers }),
        fetch(`${apiUrl}/api/crm/users`, { headers })
      ]);
      
      const dataTasks = await resTasks.json();
      const dataUsers = await resUsers.json();
      
      if (dataTasks && dataTasks.data) {
        setTasks(dataTasks.data);
        setTotalPages(dataTasks.totalPages || 1);
      } else {
        setTasks(Array.isArray(dataTasks) ? dataTasks : []);
        setTotalPages(1);
      }

      setUsers(Array.isArray(dataUsers) ? dataUsers : []);
    } catch(e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  useEffect(() => { fetchData(); }, [page, searchQuery, filterStatus]);

  useEffect(() => {
    if (!previewFile) {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
      return;
    }
    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/files/view/formulaires/${previewFile}?token=${token}`;
        const res = await fetch(url);
        if (res.ok) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          setPreviewBlobUrl(objUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPdf();
  }, [previewFile]);

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('bucket', 'formulaires');
    formData.append('file', file);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/files/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        return data.fileData.filename;
      }
    } catch(e) { console.error('Upload error', e); }
    return null;
  };

  const handleCreateSubTask = async () => {
    if (!newTaskMessage || !newTaskAssignedTo || !newTaskEcheance) {
      alert("Veuillez remplir le message, le destinataire et l'échéance.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      let attachmentName = consultTask.attachment || null;
      if (newTaskFile) {
        const uploadedName = await uploadFile(newTaskFile);
        if (uploadedName) {
          attachmentName = attachmentName ? `${attachmentName},${uploadedName}` : uploadedName;
        }
      }

      const res = await fetch(`${apiUrl}/api/crm/taches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          description: `Objet: ${newTaskSubject}\n\nConsignes: ${newTaskMessage}`,
          assignedToId: newTaskAssignedTo,
          missionId: consultTask.id,
          echeance: newTaskEcheance,
          attachment: attachmentName
        })
      });
      
      if (res.ok) {
        alert('Tâche créée avec succès !');
        setCreateTaskModal(false);
        setNewTaskFile(null);
        setConsultTask(null);
        setNewTaskSubject('');
        setNewTaskMessage('');
        setNewTaskEcheance('');
        fetchData();
      } else {
        alert("Erreur lors de la création de la tâche.");
      }
    } catch (e) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };


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
              <input type="text" value={newTaskSubject} onChange={(e) => setNewTaskSubject(e.target.value)} placeholder="Sujet de la tâche..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigner à</label>
                <select className="input-field" value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                  <option value="">-- Sélectionner un membre --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                <input type="date" value={newTaskEcheance} onChange={(e) => setNewTaskEcheance(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>
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
              <textarea value={newTaskMessage} onChange={(e) => setNewTaskMessage(e.target.value)} placeholder="Détails de la tâche à effectuer..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
            <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline">Annuler</button>
            <button onClick={handleCreateSubTask} disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Création...' : 'Créer la tâche'}</button>
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
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consultation tâche : {consultTask.reference || consultTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
              <input type="text" defaultValue={consultTask.createdBy?.name || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
              <input type="text" defaultValue={consultTask.assignedTo?.name || 'Non assigné'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
            <input type="text" defaultValue={consultTask.description ? (consultTask.description.match(/Objet: (.*)/) ? consultTask.description.match(/Objet: (.*)/)[1] : consultTask.description.split('\n')[0]) : 'Sans objet'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Mission Liée</label>
            <input type="text" defaultValue={consultTask.mission?.reference || consultTask.missionId} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
            <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
              {consultTask.attachment ? (
                <select className="input-field" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} onChange={(e) => {
                  if (e.target.value) {
                    setPreviewFile(e.target.value);
                    e.target.selectedIndex = 0;
                  }
                }}>
                  <option value="">-- Sélectionner un fichier pour l'ouvrir --</option>
                  {consultTask.attachment.split(',').map((att, idx) => (
                    <option key={idx} value={att.trim()}>{att.trim()}</option>
                  ))}
                </select>
              ) : (
                <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Aucune pièce jointe lors de la création.</span>
              )}
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
            <textarea defaultValue={consultTask.description ? (consultTask.description.match(/Consignes: ([\s\S]*)/) ? consultTask.description.match(/Consignes: ([\s\S]*)/)[1] : consultTask.description) : 'Aucun message'} readOnly style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: 'var(--text-main)'}}></textarea>
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

        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline">Annuler</button>
          <button onClick={() => { setConsultTask(null); setTaskFile(null); alert('Tâche mise à jour avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>

        {previewFile && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200
          }}>
            <div style={{width: '80%', height: '80%', background: '#FFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
              <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
                <h3 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <Eye size={16} /> Prévisualisation du document : {previewFile}
                </h3>
                <button onClick={() => setPreviewFile(null)} className="btn btn-outline" style={{padding: '0.25rem 0.5rem', height: 'auto'}}>Fermer</button>
              </div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', padding: '2rem'}}>
                <div style={{width: '100%', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden'}}>
                  {previewBlobUrl ? (
                    previewFile.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                      <img 
                        src={previewBlobUrl} 
                        alt={previewFile}
                        style={{width: '100%', height: '100%', objectFit: 'contain'}} 
                      />
                    ) : (
                      <object 
                        data={previewBlobUrl}
                        type="application/pdf"
                        style={{width: '100%', height: '100%', border: 'none'}}
                      >
                        <p>Impossible d'afficher ce fichier directement. <a href={previewBlobUrl} target="_blank" rel="noopener noreferrer">Téléchargez-le ici</a>.</p>
                      </object>
                    )
                  ) : (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                      Chargement du document...
                    </div>
                  )}
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
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tâches</h1>
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
              <th style={{ width: '10%', textAlign: 'left' }}>ID</th>
              <th style={{ width: '15%', textAlign: 'left' }}>Mission ID</th>
              <th style={{ width: '15%', textAlign: 'left' }}>Objet</th>
              <th style={{ width: '15%', textAlign: 'left' }}>Récepteur</th>
              <th style={{ width: '10%', textAlign: 'right', paddingRight: '0.5rem' }}>Échéance</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Statut</th>
              <th style={{ width: '10%', textAlign: 'left' }}>Date</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td style={{ textAlign: 'left' }}>
                  <strong className="truncate-text" style={{fontSize: "0.875rem", color: 'var(--text-main)', margin: 0}}>
                    {t.reference || t.id.slice(0,8)}
                  </strong>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <span className="truncate-text" style={{color: 'var(--primary)', fontWeight: 500, fontSize: "0.875rem", margin: 0}}>
                    {t.mission?.reference || t.missionId}
                  </span>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <span className="truncate-text" style={{fontSize: "0.875rem", margin: 0}} title={t.description}>
                    {t.description ? t.description.split('\n')[0].replace('Objet:', '').trim() : 'Sans objet'}
                  </span>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <span className="truncate-name" style={{fontSize: "0.875rem", margin: 0}}>
                    {t.assignedTo?.name || 'Non assigné'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '0.5rem' }}>
                  <span style={{color: t.echeance ? 'var(--text-main)' : 'var(--danger)', fontWeight: 500, fontSize: "0.875rem", margin: 0}}>
                    {t.echeance ? new Date(t.echeance).toLocaleDateString() : 'Aucune'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                  {getStatusBadge(t.status)}
                </td>
                <td style={{ textAlign: 'left', color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                  {new Date(t.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, t.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
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

      {totalPages >= 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1rem', alignItems: 'center' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: '#FFF', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Précédent
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Page {page} sur {totalPages}</span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: '#FFF', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
          >
            Suivant
          </button>
        </div>
      )}

      {previewFile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{width: '80%', height: '80%', background: '#FFF', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <div style={{padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC'}}>
              <h3 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Eye size={16} /> Prévisualisation du document : {previewFile}
              </h3>
              <button onClick={() => setPreviewFile(null)} className="btn btn-outline" style={{padding: '0.25rem 0.5rem', height: 'auto'}}>Fermer</button>
            </div>
            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', padding: '2rem'}}>
              <div style={{width: '100%', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden'}}>
                {previewBlobUrl ? (
                  previewFile.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                    <img 
                      src={previewBlobUrl} 
                      alt={previewFile}
                      style={{width: '100%', height: '100%', objectFit: 'contain'}} 
                    />
                  ) : (
                    <object 
                      data={previewBlobUrl}
                      type="application/pdf"
                      style={{width: '100%', height: '100%', border: 'none'}}
                    >
                      <p>Impossible d'afficher ce fichier directement. <a href={previewBlobUrl} target="_blank" rel="noopener noreferrer">Téléchargez-le ici</a>.</p>
                    </object>
                  )
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    Chargement du document...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TachesPage;