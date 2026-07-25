import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, Pencil, Eye, Trash
} from 'lucide-react';
import ActionDropdown from '../components/ActionDropdown';
import { getStatusBadge, getPriorityBadge } from '../utils/helpers';
import FilePreviewModal from '../components/FilePreviewModal';
import SmsModal from '../components/SmsModal';

const getSubjectFromTask = (desc) => {
  if (!desc) return 'Sans objet';
  const match = desc.match(/Objet: (.*)/);
  return match ? match[1] : desc.split('\n')[0];
};

const getMessageFromTask = (desc) => {
  if (!desc) return 'Aucun message';
  const match = desc.match(/Consignes: ([\s\S]*)/);
  return match ? match[1] : desc;
};

const TachesPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultTask, setConsultTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editFormData, setEditFormData] = useState({ subject: '', message: '', status: '', attachment: '', assignedToId: '' });
  const [taskFile, setTaskFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const menuRef = useRef(null);

  // Real API states
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

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
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      const [resTasks, resUsers] = await Promise.all([
        fetch(`${apiUrl}/api/crm/taches?page=${page}&limit=6&status=${filterStatus}&search=${encodeURIComponent(searchQuery)}`, { headers }),
        fetch(`${apiUrl}/api/crm/users`, { headers })
      ]);
      
      const dataTasks = await resTasks.json();
      const dataUsers = await resUsers.json();
      
      if (dataTasks?.data) {
        setTasks(dataTasks.data);
        setTotalPages(dataTasks.totalPages || 1);
      } else {
        setTasks(Array.isArray(dataTasks) ? dataTasks : []);
        setTotalPages(1);
      }

      setUsers(Array.isArray(dataUsers) ? dataUsers : []);
    } catch(e) {
      console.error("Erreur fetchData:", e);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  useEffect(() => { fetchData(); }, [page, searchQuery, filterStatus]);



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
      console.error("Erreur de connexion au serveur:", e);
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editTask) return;
    try {
      let finalAttachment = editFormData.attachment;
      if (taskFile) {
        const uploadedName = await uploadFile(taskFile);
        if (uploadedName) {
          finalAttachment = finalAttachment ? `${finalAttachment},${uploadedName}` : uploadedName;
        }
      }
      
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      const description = `Objet: ${editFormData.subject}\nConsignes: ${editFormData.message}`;
      const res = await fetch(`${apiUrl}/api/crm/taches/${editTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editFormData.status,
          description,
          assignedToId: editFormData.assignedToId,
          attachment: finalAttachment
        })
      });
      if (res.ok) {
        setEditTask(null);
        setTaskFile(null);
        fetchData();
        alert('Tâche mise à jour avec succès !');
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error("Erreur mise à jour tâche:", err);
      alert("Erreur de connexion.");
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
    return (
      <ActionDropdown isOpen={openMenuId === taskId} menuRef={menuRef} width="130px">
        <button type="button" className="dropdown-item" onClick={() => { setOpenMenuId(null); setConsultTask(tasks.find(t => t.id === taskId)); }}>
          <Eye size={14} /> Consulter
        </button>
        <button type="button" className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          const task = tasks.find(t => t.id === taskId);
          setEditTask(task);
          const subj = getSubjectFromTask(task.description);
          const msg = getMessageFromTask(task.description);
          setEditFormData({ subject: subj, message: msg, status: task.status, attachment: task.attachment || '', assignedToId: task.assignedToId || '' });
        }}>
          <Pencil size={14} color="#D97706" /> Modifier
        </button>
        <button type="button" className="dropdown-item" onClick={async () => { 
          setOpenMenuId(null); 
          if(window.confirm("Supprimer cette tâche ?")) {
             try {
               const token = localStorage.getItem('adminToken');
               const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
               const res = await fetch(`${apiUrl}/api/crm/taches/${taskId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
               if(res.ok) fetchData();
             } catch(e) { console.error("Erreur suppression tâche:", e); }
          }
        }} style={{color: 'var(--danger)'}}>
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  }

  if (createTaskModal) {
    return (
      <div className="fade-in" style={{width: '100%', padding: '0'}}>
        <div className="" style={{width: '100%', padding: '0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Nouvelle Tâche (Liée à {consultTask?.dossierId})</h3>
            <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label htmlFor="auto-field-1785016991510-1" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la tâche</label>
              <input id="auto-field-1785016991510-1" type="text" value={newTaskSubject} onChange={(e) => setNewTaskSubject(e.target.value)} placeholder="Sujet de la tâche..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div>
                <label htmlFor="auto-field-1785016991510-2" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigner à</label>
                <select id="auto-field-1785016991510-2" className="input-field" value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                  <option value="">-- Sélectionner un membre --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="auto-field-1785016991510-3" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                <input id="auto-field-1785016991510-3" type="date" value={newTaskEcheance} onChange={(e) => setNewTaskEcheance(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>
            </div>

            <div>
              <label htmlFor="auto-field-1785016991510-4" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
              <input id="auto-field-1785016991510-4" type="text" value={consultTask?.dossierId || ''} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-muted)'}} />
            </div>

            <div>
              <label htmlFor="auto-field-1785016991510-5" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
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
              <textarea id="auto-field-1785016991510-5" value={newTaskMessage} onChange={(e) => setNewTaskMessage(e.target.value)} placeholder="Détails de la tâche à effectuer..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
            <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline">Annuler</button>
            <button type="button" onClick={handleCreateSubTask} disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Création...' : 'Créer la tâche'}</button>
          </div>
        </div>
      </div>
    );
  }

  if (editTask) {
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => { setEditTask(null); setTaskFile(null); }} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier tâche : {editTask.reference || editTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label htmlFor="auto-field-1785016991510-6" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
              <input id="auto-field-1785016991510-6" type="text" defaultValue={editTask.createdBy?.name || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
            <div>
              <label htmlFor="auto-field-1785016991510-7" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
              <select id="auto-field-1785016991510-7" className="input-field" value={editFormData.assignedToId} onChange={(e) => setEditFormData({...editFormData, assignedToId: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                <option value="">-- Non assigné --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-8" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
            <input id="auto-field-1785016991510-8" type="text" value={editFormData.subject} onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: '#FFF', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-9" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Mission Liée</label>
            <input id="auto-field-1785016991510-9" type="text" defaultValue={editTask.mission?.reference || editTask.missionId} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label htmlFor="task-attachment" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
            <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {editFormData.attachment && editFormData.attachment.trim() && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
                  {editFormData.attachment.split(',').map((att) => att.trim() && (
                    <div key={att.trim()} style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FFF', padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)', maxWidth: '300px'}}>
                      <span style={{fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{att.trim()}</span>
                      <button type="button" onClick={() => {
                        const newAtts = editFormData.attachment.split(',').map(a => a.trim()).filter(a => a !== att.trim()).join(',');
                        setEditFormData({...editFormData, attachment: newAtts});
                      }} style={{background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem', display: 'flex'}} title="Supprimer la pièce jointe"><Trash size={16}/></button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <input id="task-attachment" type="file" onChange={(e) => setTaskFile(e.target.files?.[0])} className="input-field" style={{flex: 1, padding: '0.5rem', fontSize: '0.875rem'}} />
                {taskFile && <span style={{fontSize: '0.875rem', color: 'var(--primary)'}}>Nouveau fichier à ajouter</span>}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="task-message" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
            <textarea id="task-message" value={editFormData.message} onChange={(e) => setEditFormData({...editFormData, message: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', background: '#FFF', color: 'var(--text-main)'}}></textarea>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '2rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', width: 'fit-content'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <label htmlFor="task-status" style={{fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>Statut de la tâche :</label>
              {getStatusBadge(editTask.status)}
            </div>
            <select id="task-status" className="input-field" value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} style={{width: '150px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', fontSize: '0.875rem'}}>
              <option value="REDEFINIR">Redéfinir...</option>
              <option value="NEW">Nouveau</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="IN_REVIEW">En révision</option>
              <option value="VALIDATED">Validé</option>
              <option value="TO_ASSIGN">À assigner</option>
            </select>
          </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => { setEditTask(null); setTaskFile(null); }} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={handleUpdateTask} className="btn btn-primary">Enregistrer</button>
        </div>
      </div>
    );
  }

  if (consultTask) {
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux tâches</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consultation tâche : {consultTask.reference || consultTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label htmlFor="auto-field-1785016991510-11" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Créé par</label>
              <input id="auto-field-1785016991510-11" type="text" defaultValue={consultTask.createdBy?.name || 'Système'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
            <div>
              <label htmlFor="auto-field-1785016991510-12" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigné à</label>
              <input id="auto-field-1785016991510-12" type="text" defaultValue={consultTask.assignedTo?.name || 'Non assigné'} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
            </div>
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-13" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet</label>
            <input id="auto-field-1785016991510-13" type="text" defaultValue={getSubjectFromTask(consultTask.description)} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-14" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Mission Liée</label>
            <input id="auto-field-1785016991510-14" type="text" defaultValue={consultTask.mission?.reference || consultTask.missionId} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-15" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
            <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
              {consultTask.attachment ? (
                <select className="input-field" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} onChange={(e) => {
                  if (e.target.value) {
                    setPreviewFile(e.target.value);
                    e.target.selectedIndex = 0;
                  }
                }}>
                  <option value="">-- Sélectionner un fichier pour l'ouvrir --</option>
                  {consultTask.attachment.split(',').map((att) => (
                    <option key={att.trim()} value={att.trim()}>{att.trim()}</option>
                  ))}
                </select>
              ) : (
                <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Aucune pièce jointe lors de la création.</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-15-msg" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
            <textarea id="auto-field-1785016991510-15-msg" defaultValue={getMessageFromTask(consultTask.description)} readOnly style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: 'var(--text-main)'}}></textarea>
          </div>

          <div>
            <label htmlFor="auto-field-1785016991510-16" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut de la tâche</label>
            <select id="auto-field-1785016991510-16" className="input-field" defaultValue={consultTask.status} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
              <option value="NEW">Nouveau</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="IN_REVIEW">En révision</option>
              <option value="VALIDATED">Validé</option>
              <option value="TO_ASSIGN">À assigner</option>
            </select>
          </div>

        </div>

        <div style={{marginTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center'}}>
          <button type="button" onClick={() => setShowSmsModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1.5rem'}}>
            <MessageSquare size={16} />
            SMS Collaborateur
          </button>
        </div>

        <SmsModal 
          isOpen={showSmsModal} 
          onClose={() => setShowSmsModal(false)} 
          contextData={{ missionId: consultTask.missionId }} 
        />

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={() => { setConsultTask(null); setTaskFile(null); alert('Tâche mise à jour avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>

        <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />

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
                      <button type="button" onClick={(e) => toggleMenu(e, t.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
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

      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  )
}

export default TachesPage;