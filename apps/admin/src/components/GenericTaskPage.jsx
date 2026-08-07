import { getSafeApiUrl, uploadFile, formatDate, getStatusBadge, getPriorityBadge } from '../utils/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Pencil, Eye, Trash, Mail, MessageSquare, Search, Files, FileText } from 'lucide-react';
import ActionDropdown from '../components/ActionDropdown';
import FilePreviewModal from '../components/FilePreviewModal';
import SmsModal from '../components/SmsModal';
import TaskConsultModal from '../components/TaskConsultModal';
import AttachmentChips from '../components/AttachmentChips';
import AttachmentSelect from '../components/AttachmentSelect';
import FeedbackThread from '../components/FeedbackThread';
import FeedbackModal from '../components/FeedbackModal';
import GedExplorer from '../components/GedExplorer';

const getSubjectFromTask = (desc) => {
  if (!desc) return 'Sans objet';
  const match = desc.match(/Objet: (.*)/);
  return match ? match[1] : desc.split('\n')[0];
};

const getMessageFromTask = (desc) => {
  if (!desc) return 'Aucun message';
  const match = desc.match(/Consignes:\s*([\s\S]*)/);
  if (match) return match[1];
  const lines = desc.split('\n');
  return lines.length > 1 ? lines.slice(1).join('\n').trim() : desc;
};


const TaskField = ({ label, value, readOnly = true, onChange = null, isTextarea = false }) => {
  const id = `field-${label.replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{label}</label>
      {isTextarea ? (
        <textarea 
          id={id}
          value={value || ''} 
          onChange={onChange} 
          readOnly={readOnly}
          style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: readOnly ? '1px solid var(--border)' : '1px solid var(--primary)', minHeight: '120px', resize: readOnly ? 'none' : 'vertical', fontFamily: 'inherit', background: readOnly ? '#F8FAFC' : '#FFF', color: 'var(--text-main)'}}
        />
      ) : (
        <input 
          id={id}
          type="text" 
          value={value || ''} 
          onChange={onChange} 
          readOnly={readOnly}
          className="input-field" 
          style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: readOnly ? '1px solid var(--border)' : '1px solid var(--primary)', background: readOnly ? '#F8FAFC' : '#FFF', color: 'var(--text-main)'}}
        />
      )}
    </div>
  );
};


const TaskDropdown = ({ taskId, openMenuId, setOpenMenuId, menuRef, tasks, setConsultTask, setEditTask, setEditFormData, fetchData, currentUser }) => {
  const task = tasks.find(t => t.id === taskId);
  const role = currentUser?.role?.name || currentUser?.role || '';
  const isSuperAdmin = role === 'Super-administrateur' || role === 'Administrateur';
  const isResp = role === 'Responsable opérationnel' || isSuperAdmin;
  const isController = role === 'Relecteur' || isResp;
  
  const isLockedForCollab = (task?.status === 'EN_FINALISATION' || task?.status === 'EN_CONTROLE' || task?.status === 'TERMINEE') && !isController;
  
  return (
    <ActionDropdown isOpen={openMenuId === taskId} menuRef={menuRef} width="130px">
      <button type="button" className="dropdown-item" onClick={() => { setOpenMenuId(null); setConsultTask(task); }}>
        <Eye size={14} /> Consulter
      </button>
      {!isLockedForCollab && (
        <button type="button" className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          setEditTask(task);
          const subj = getSubjectFromTask(task.description);
          const msg = getMessageFromTask(task.description);
          setEditFormData({ subject: subj, message: msg, status: task.status, attachment: task.attachment || '' });
        }}>
          <Pencil size={14} color="#D97706" /> Modifier
        </button>
      )}
      <button type="button" className="dropdown-item" onClick={async () => { 
        setOpenMenuId(null); 
        if(await window.customConfirm("Voulez-vous vraiment supprimer cette mission ?", "Supprimer la mission")) {
           try {
             const token = sessionStorage.getItem('adminToken');
             const res = await fetch(new URL(getSafeApiUrl(`/api/crm/tasks/${encodeURIComponent(taskId)}`)).toString(), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
             if (res.ok) fetchData();
           } catch(e) { console.error("Erreur suppr mission:", e); }
        }
      }} style={{color: 'var(--danger)'}}>
        <Trash size={14} /> Supprimer
      </button>
    </ActionDropdown>
  );
};
const GenericTaskPage = ({ mode = "MISSION" }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultTask, setConsultTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [localConsultSubTask, setLocalConsultSubTask] = useState(null);
  const [editFormData, setEditFormData] = useState({ subject: '', message: '', status: '', attachment: '' });
  const [taskFile, setTaskFile] = useState(null);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [selectedParentDocs, setSelectedParentDocs] = useState([]);
  const [selectedMissionDocs, setSelectedMissionDocs] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const menuRef = useRef(null);

  // Feedback workflow modals
  const [showAdminFeedbackModal, setShowAdminFeedbackModal] = useState(false);
  const [showManagerFeedbackModal, setShowManagerFeedbackModal] = useState(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem('adminUser');
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch(e) { console.error(e); }
  }, []);

  // Real API  states
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
  const [selectedDossierTacheId, setSelectedDossierTacheId] = useState('');
  const [selectedAuthorizedTacheIds, setSelectedAuthorizedTacheIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      
      const urlTasks = new URL(getSafeApiUrl(mode === "MISSION" ? `/api/crm/tasks` : `/api/crm/taches`));
      urlTasks.searchParams.append('page', page);
      urlTasks.searchParams.append('limit', '15');
      urlTasks.searchParams.append('status', filterStatus);
      urlTasks.searchParams.append('search', searchQuery);

      const [resTasks, resUsers] = await Promise.all([
        fetch(urlTasks.toString(), { headers }),
        fetch(new URL(getSafeApiUrl(`/api/crm/users`)).toString(), { headers })
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
    } catch(e) {
      console.error("Erreur de chargement:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  useEffect(() => { fetchData(); }, [page, searchQuery, filterStatus]);

  const handleUpdateMission = async () => {
    if (!editTask) return;
    try {
      let finalAttachment = editFormData.attachment;
      if (taskFile) {
        const uploadedName = await uploadFile(taskFile);
        if (uploadedName) {
          finalAttachment = finalAttachment ? `${finalAttachment},${uploadedName}` : uploadedName;
        }
      }
      
      const token = sessionStorage.getItem('adminToken');
      const description = `Objet: ${editFormData.subject}\nConsignes: ${editFormData.message}`;
      const res = await fetch(new URL(getSafeApiUrl(mode === "MISSION" ? `/api/crm/tasks/${encodeURIComponent(editTask.id)}` : `/api/crm/taches/${encodeURIComponent(editTask.id)}`)).toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editFormData.status,
          description,
          attachment: finalAttachment
        })
      });
      if (res.ok) {
        setEditTask(null);
        fetchData();
        setErrorMsg('Mission mise à jour avec succès !');
      } else {
        setErrorMsg("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error("Erreur mise à jour mission:", err);
      setErrorMsg("Erreur de connexion.");
    }
  };

  const handleWorkflowAction = async (taskId, newStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(new URL(getSafeApiUrl(mode === "MISSION" ? `/api/crm/tasks/${encodeURIComponent(taskId)}` : `/api/crm/taches/${encodeURIComponent(taskId)}`)).toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
        if (consultTask && consultTask.id === taskId) {
          setConsultTask({...consultTask, status: newStatus});
        }
        if (editTask && editTask.id === taskId) {
          setEditTask({...editTask, status: newStatus});
        }
        setErrorMsg(`Statut passé à ${newStatus}`);
      } else {
        setErrorMsg("Erreur lors de la mise à jour du statut.");
      }
    } catch (err) {
      console.error("Erreur action workflow:", err);
      setErrorMsg("Erreur de connexion.");
    }
  };

  /**
   * handleFeedbackSubmit
   * mode: 'admin' → status = A_AMELIORER, sends adminFeedback
   * mode: 'manager' → status = EN_REVISION, sends managerFeedback
   */
  const handleFeedbackSubmit = async (feedbackText, feedbackMode) => {
    if (!consultTask) return;
    setIsFeedbackSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const url = mode === 'MISSION'
        ? getSafeApiUrl(`/api/crm/tasks/${encodeURIComponent(consultTask.id)}`)
        : getSafeApiUrl(`/api/crm/taches/${encodeURIComponent(consultTask.id)}`);

      const newStatus = 'A_CORRIGER';
      const body = feedbackMode === 'admin'
        ? { status: newStatus, adminFeedback: feedbackText }
        : { status: newStatus, managerFeedback: feedbackText };

      const res = await fetch(new URL(url).toString(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const updated = await res.json();
        setConsultTask(prev => ({ ...prev, ...updated }));
        fetchData();
        setErrorMsg(feedbackMode === 'admin' ? 'Instructions envoyées. Tâche marquée "À améliorer".' : 'Corrections soumises. Tâche passée en révision.');
        if (feedbackMode === 'admin') setShowAdminFeedbackModal(false);
        else setShowManagerFeedbackModal(false);
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.error || 'Erreur lors de la soumission.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Erreur de connexion.');
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  const handleCreateSubTask = async () => {
    if (!newTaskMessage || !newTaskAssignedTo || !newTaskEcheance) {
      setErrorMsg("Veuillez remplir le message, le destinataire et l'échéance.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      
      let attachmentName = null;
      if (selectedMissionDocs.length > 0 && consultTask.documents) {
        attachmentName = consultTask.documents
          .filter(d => selectedMissionDocs.includes(d.id))
          .map(d => d.url)
          .join(',');
      }
      if (selectedParentDocs.length > 0) {
        attachmentName = attachmentName ? `${attachmentName},${selectedParentDocs.join(',')}` : selectedParentDocs.join(',');
      }
      if (newTaskFile) {
        const uploadedName = await uploadFile(newTaskFile);
        if (uploadedName) {
          attachmentName = attachmentName ? `${attachmentName},${uploadedName}` : uploadedName;
        }
      }

      const res = await fetch(new URL(getSafeApiUrl(`/api/crm/taches`)).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          missionId: consultTask.id,
          description: `Objet: ${newTaskSubject}\n\nConsignes: ${newTaskMessage}`,
          assignedToId: newTaskAssignedTo,
          echeance: newTaskEcheance,
          attachment: attachmentName,
          dossierTacheId: selectedDossierTacheId,
          authorizedDossierIds: selectedAuthorizedTacheIds
        })
      });
      
      if (res.ok) {
        setErrorMsg('Tâche créée avec succès !');
        setCreateTaskModal(false);
        setNewTaskFile(null);
        setSelectedMissionDocs([]);
        setConsultTask(null);
        setNewTaskSubject('');
        setNewTaskMessage('');
        setNewTaskEcheance('');
        setSelectedDossierTacheId('');
        setSelectedAuthorizedTacheIds([]);
        fetchData();
      } else {
        setErrorMsg("Erreur lors de la création de la tâche.");
      }
    } catch (e) {
      console.error("Erreur de connexion:", e);
      setErrorMsg("Erreur de connexion au serveur.");
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

  if (createTaskModal) {
    return (
      <div className="fade-in" style={{width: '100%', padding: '0'}}>
        <div className="" style={{width: '100%', padding: '0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
            <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); setSelectedParentDocs([]); setSelectedMissionDocs([]); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            <h3 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Nouvelle Tâche</h3>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label htmlFor="new-task-subject" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la tâche</label>
              <input id="new-task-subject" type="text" value={newTaskSubject} onChange={(e) => setNewTaskSubject(e.target.value)} placeholder="Sujet de la tâche..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div>
                <label htmlFor="new-task-assigned-to" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigner à</label>
                <select id="new-task-assigned-to" className="input-field" value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                  <option value="">-- Sélectionner un membre --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="new-task-echeance" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                <input id="new-task-echeance" type="date" value={newTaskEcheance} onChange={(e) => setNewTaskEcheance(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>
            </div>

            <div>
              <label htmlFor="new-task-mission-associee" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Mission associée</label>
              <input id="new-task-mission-associee" type="text" value={consultTask?.reference || consultTask?.id || ''} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-muted)'}} />
            </div>

            {/* Dossiers liés à la tâche (GED) */}
            {consultTask && (consultTask.dossierMission || consultTask.dossier) && (
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                    Dossier tâche (Opérationnel) *
                  </label>
                  <GedExplorer 
                    tree={{ 
                      name: 'Dossier de la mission', 
                      id: 'root',
                      subDossiers: [
                        consultTask.dossierMission || consultTask.dossier
                      ].filter(Boolean)
                    }}
                    hideBreadcrumb={false}
                    multiSelect={false}
                    selectedId={selectedDossierTacheId}
                    onSelectId={(id) => setSelectedDossierTacheId(id)}
                  />
                </div>

                <div style={{flex: 1}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                    Dossiers autorisés
                  </label>
                  <GedExplorer 
                    tree={{ 
                      name: 'Dossiers autorisés de la mission',
                      id: 'root',
                      subDossiers: (consultTask.authorizedDossiers || []).filter(Boolean)
                    }}
                    hideBreadcrumb={false}
                    multiSelect={true}
                    selectedIds={selectedAuthorizedTacheIds}
                    onSelectId={(id, multi) => {
                       if (selectedAuthorizedTacheIds.includes(id)) {
                          setSelectedAuthorizedTacheIds(selectedAuthorizedTacheIds.filter(x => x !== id));
                       } else {
                          setSelectedAuthorizedTacheIds([...selectedAuthorizedTacheIds, id]);
                       }
                    }}
                    onToggleChildren={(child) => {
                       if (selectedAuthorizedTacheIds.includes(child.id)) {
                          setSelectedAuthorizedTacheIds(selectedAuthorizedTacheIds.filter(x => x !== child.id));
                       } else {
                          setSelectedAuthorizedTacheIds([...selectedAuthorizedTacheIds, child.id]);
                       }
                    }}
                  />
                  {selectedAuthorizedTacheIds.length > 0 && (
                    <div style={{marginTop: '1rem', padding: '1rem', background: '#e0f2fe', borderRadius: '8px', border: '1px solid #bae6fd'}}>
                      <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0369a1'}}>Panier des dossiers autorisés ({selectedAuthorizedTacheIds.length})</h4>
                      <ul style={{margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#0c4a6e'}}>
                        {selectedAuthorizedTacheIds.map(id => {
                          const rootDoss = consultTask.dossierMission || consultTask.dossier;
                          const flatAuthorized = (consultTask.authorizedDossiers || []).flatMap(d => [d, ...(d.subDossiers || [])]);
                          const d = flatAuthorized.find(x => x.id === id) || (rootDoss?.id === id ? rootDoss : null) || rootDoss?.subDossiers?.find(x => x.id === id);
                          return <li key={id}>{d ? d.name : id}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="new-task-attachment" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
              <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                {consultTask?.attachment && (
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                      Inclure la pièce jointe (héritée) :
                    </label>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', background: '#FFF', borderRadius: '4px', border: '1px solid var(--border)'}}>
                      {consultTask.attachment.split(',').map(att => {
                        const fileName = att.split('/').pop();
                        return (
                          <div key={att} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', margin: 0, fontWeight: 500, color: 'var(--text-main)'}}>
                              <input 
                                type="checkbox" 
                                checked={selectedParentDocs.includes(att)} 
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedParentDocs([...selectedParentDocs, att]);
                                  else setSelectedParentDocs(selectedParentDocs.filter(a => a !== att));
                                }} 
                              />
                              <Files size={14} style={{color: 'var(--text-muted)'}}/> {fileName}
                            </label>
                            <button type="button" onClick={(e) => { e.preventDefault(); setPreviewFile(att); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center'}} title="Prévisualiser">
                              <Eye size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {consultTask?.documents?.length > 0 && (
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                      Inclure des documents de la mission :
                    </label>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', background: '#FFF', borderRadius: '4px', border: '1px solid var(--border)'}}>
                      {consultTask.documents.map(doc => (
                        <div key={doc.id} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', margin: 0}}>
                            <input 
                              type="checkbox" 
                              checked={selectedMissionDocs.includes(doc.id)} 
                              onChange={(e) => {
                                if (e.target.checked) setSelectedMissionDocs([...selectedMissionDocs, doc.id]);
                                else setSelectedMissionDocs(selectedMissionDocs.filter(id => id !== doc.id));
                              }} 
                            />
                            <FileText size={14} style={{color: 'var(--primary)'}}/> {doc.name}
                          </label>
                          <button type="button" onClick={(e) => { e.preventDefault(); setPreviewFile(doc.url); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center'}} title="Prévisualiser">
                            <Eye size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <label htmlFor="new-task-attachment" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginBottom: 0}}>
                  <Files size={16} />
                  <span style={{fontSize: '0.875rem', fontWeight: 500}}>
                    {newTaskFile ? newTaskFile.name : 'Joindre un autre fichier...'}
                  </span>
                  <input id="new-task-attachment" type="file" style={{display: 'none'}} onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNewTaskFile(e.target.files[0]); }} />
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="new-task-message" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
              <textarea id="new-task-message" value={newTaskMessage} onChange={(e) => setNewTaskMessage(e.target.value)} placeholder="Détails de la tâche à effectuer..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
            <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); setSelectedParentDocs([]); setSelectedMissionDocs([]); }} className="btn btn-outline">Annuler</button>
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
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{mode === 'MISSION' ? 'Modifier mission :' : 'Modifier tâche :'} {editTask.reference || editTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <TaskField label={"Créé par"} value={editTask.createdBy?.name || 'Système'} />
            <TaskField label={"Assigné à"} value={editTask.assignedTo?.name || 'Non assigné'} />
          </div>

          <TaskField label="Objet" value={editFormData.subject} readOnly={false} onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})} />
          
          <TaskField label={mode === 'MISSION' ? 'Dossier associé' : 'Mission Liée'} value={mode === 'MISSION' ? (editTask.dossier?.reference || editTask.dossier?.name || editTask.dossierId) : (editTask.mission?.reference || editTask.missionId)} />

          <div>
            <label htmlFor="task-attachment" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
            <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <AttachmentChips 
                attachment={editFormData.attachment} 
                onRemove={(attToRemove) => {
                  const newAtts = editFormData.attachment.split(',').map(a => a.trim()).filter(a => a !== attToRemove).join(',');
                  setEditFormData({...editFormData, attachment: newAtts});
                }} 
              />
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <input id="task-attachment" type="file" onChange={(e) => setTaskFile(e.target.files?.[0])} className="input-field" style={{flex: 1, padding: '0.5rem', fontSize: '0.875rem'}} />
                {taskFile && <span style={{fontSize: '0.875rem', color: 'var(--primary)'}}>Nouveau fichier à ajouter</span>}
              </div>
            </div>
          </div>

          <TaskField label="Message / Consignes" value={editFormData.message} readOnly={false} onChange={(e) => setEditFormData({...editFormData, message: e.target.value})} isTextarea={true} />

          <div style={{display: 'flex', alignItems: 'center', gap: '2rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', width: 'fit-content'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span style={{fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)'}}>{mode === 'MISSION' ? 'Statut de la mission :' : 'Statut de la tâche :'}</span>
              {getStatusBadge(editTask.status)}
            </div>
            {/* Le statut est désormais géré via les boutons d'action du workflow */}
          </div>

          <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
            {mode === 'MISSION' && <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Gérer les tâches liées</h4>}
            {mode === 'MISSION' && editTask.taches && editTask.taches.length > 0 ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                {editTask.taches.map((sub) => (
                  <button 
                    type="button"
                    key={sub.id}
                    onClick={() => setLocalConsultSubTask(sub)}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s', width: '100%', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit'}}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{sub.reference || 'Sans réf'}</strong>
                      <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(sub.status)}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setErrorMsg(`Tâche ${sub.id} supprimée avec succès !`); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)'}} title="Supprimer la tâche liée">
                        <Trash size={18} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
               <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                 Aucune tâche liée pour le moment.
               </div>
            )}
          </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => { setEditTask(null); setTaskFile(null); }} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={handleUpdateMission} className="btn btn-primary">Enregistrer</button>
        </div>
        <TaskConsultModal task={localConsultSubTask} onClose={() => setLocalConsultSubTask(null)} />
      </div>
    );
  }

  if (consultTask) {
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{mode === 'MISSION' ? 'Consultation mission :' : 'Consultation tâche :'} {consultTask.reference || consultTask.id}</h2>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Créé par :</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{consultTask.createdBy?.name || 'Système'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Rôle :</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{consultTask.createdBy?.role?.name || '-'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Date de création :</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{new Date(consultTask.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Assigné à :</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{consultTask.assignedTo?.name || 'Non assigné'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Rôle :</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{consultTask.assignedTo?.role?.name || '-'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
              <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>{mode === 'MISSION' ? 'Dossier associé :' : 'Mission Liée :'}</strong>
              <span style={{fontWeight: 500, color: 'var(--text-main)'}}>
                {mode === 'MISSION' 
                  ? ((consultTask.dossier?.name ? `${consultTask.dossier.name} (${consultTask.dossier.reference || 'DOS-' + consultTask.dossier.id})` : consultTask.dossierId)) 
                  : (consultTask.mission?.reference || consultTask.missionId)}
              </span>
            </div>
            {mode !== 'MISSION' && consultTask.dossierTache && (
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
                <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Dossier tâche :</strong>
                <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{consultTask.dossierTache.name}</span>
              </div>
            )}
            {mode !== 'MISSION' && consultTask.authorizedDossiers && consultTask.authorizedDossiers.length > 0 && (
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
                <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Dossiers autorisés :</strong>
                <span style={{fontWeight: 500, color: 'var(--text-main)'}}>
                  {consultTask.authorizedDossiers.map(d => d.name).join(', ')}
                </span>
              </div>
            )}
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <strong style={{color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem'}}>Pièces jointes :</strong>
            <div style={{flex: 1, maxWidth: '300px', background: '#F8FAFC', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)'}}>
              <AttachmentSelect files={[consultTask.attachment]} onPreview={setPreviewFile} />
            </div>
          </div>

          <TaskField label={"Objet"} value={getSubjectFromTask(consultTask.description)} />

        <div style={{display: 'flex', gap: '2rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', alignItems: 'flex-start'}}>
          <div style={{flex: '0 0 70%'}}>
            <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Consignes</h4>
            <div style={{padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: 'var(--text-main)', minHeight: '120px'}}>
              {getMessageFromTask(consultTask.description) || <span style={{color: 'var(--text-muted)'}}>Aucune consigne fournie.</span>}
            </div>
          </div>
          
          <div style={{flex: '1 1 auto', minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Tâches liées</h4>
            {consultTask.taches && consultTask.taches.length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1}}>
                {consultTask.taches.map((sub) => (
                  <button 
                    type="button"
                    key={sub.id}
                    onClick={() => setLocalConsultSubTask(sub)}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s', width: '100%', textAlign: 'left', fontFamily: 'inherit'}}
                  >
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                      <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{sub.reference || 'Sans réf'}</strong>
                      <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(sub.status)}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
               <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                 Aucune tâche liée pour le moment.
               </div>
            )}
          </div>
        </div>

          {/* Fil de corrections — visible selon le rôle et le statut */}
          <FeedbackThread
            adminFeedback={consultTask.adminFeedback}
            managerFeedback={consultTask.managerFeedback}
            currentStatus={consultTask.status}
          />
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1.5rem'}}>
          <button type="button" onClick={() => setShowSmsModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1.5rem'}}>
            <MessageSquare size={16} />
            SMS Collaborateur
          </button>

          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1}}>
            <button type="button" onClick={() => { setConsultTask(null); setTaskFile(null); }} className="btn btn-outline">Retour</button>
            
            {/* Nouvelles actions selon le workflow */}
            {mode === 'TACHE' && consultTask.status === 'NOUVEAU' && (
              <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'EN_COURS')} className="btn btn-primary" style={{background: 'var(--primary)'}}>Débuter</button>
            )}
            
            {mode === 'TACHE' && consultTask.status === 'EN_COURS' && (
              <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'A_VERIFIER')} className="btn btn-primary" style={{background: '#10B981', borderColor: '#10B981'}}>Finaliser</button>
            )}
            
            {mode === 'TACHE' && consultTask.status === 'A_VERIFIER' && isResp && (
               <>
                 <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'EN_CONTROLE')} className="btn btn-primary" style={{background: '#8B5CF6', borderColor: '#8B5CF6'}}>Valider (Au Contrôleur)</button>
                 <button type="button" onClick={() => setShowManagerFeedbackModal(true)} className="btn btn-outline" style={{borderColor: '#EF4444', color: '#EF4444'}}>Renvoyer pour correction</button>
                 <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'REATTRIBUEE')} className="btn btn-outline" style={{borderColor: '#F59E0B', color: '#F59E0B'}}>Détacher & Réattribuer</button>
               </>
            )}

            {mode === 'TACHE' && consultTask.status === 'EN_CONTROLE' && (isSuperAdmin || role === 'Relecteur') && (
               <>
                 <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'EN_VALIDATION_FINALE')} className="btn btn-primary" style={{background: '#6366F1', borderColor: '#6366F1'}}>Accord (Au Super Admin)</button>
                 <button type="button" onClick={() => setShowManagerFeedbackModal(true)} className="btn btn-outline" style={{borderColor: '#EF4444', color: '#EF4444'}}>Renvoyer pour correction</button>
               </>
            )}

            {mode === 'TACHE' && consultTask.status === 'EN_VALIDATION_FINALE' && isSuperAdmin && (
               <>
                 <button type="button" onClick={() => handleWorkflowAction(consultTask.id, 'TERMINEE')} className="btn btn-primary" style={{background: '#10B981', borderColor: '#10B981'}}>Validation Définitive</button>
                 <button type="button" onClick={() => setShowAdminFeedbackModal(true)} className="btn btn-outline" style={{borderColor: '#EF4444', color: '#EF4444'}}>Renvoyer pour correction</button>
               </>
            )}

            {mode === 'MISSION' && (
              <button type="button" onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer une tâche</button>
            )}
          </div>
        </div>

        <SmsModal 
          isOpen={showSmsModal} 
          onClose={() => setShowSmsModal(false)} 
          contextData={{ 
            missionId: mode === 'MISSION' ? consultTask.id : consultTask.missionId,
            dossierId: mode === 'MISSION' ? consultTask.dossierId : (consultTask.dossierTacheId || null),
            tacheId: mode === 'TACHE' ? consultTask.id : null,
            createdById: consultTask.createdById,
            assignedToId: consultTask.assignedToId,
            reference: consultTask.reference
          }} 
        />
        
        <TaskConsultModal task={localConsultSubTask} onClose={() => setLocalConsultSubTask(null)} />
        <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />

        {/* Admin Feedback Modal — Super Admin → À améliorer */}
        <FeedbackModal
          isOpen={showAdminFeedbackModal}
          mode="admin"
          onClose={() => setShowAdminFeedbackModal(false)}
          onSubmit={(text) => handleFeedbackSubmit(text, 'admin')}
          isSubmitting={isFeedbackSubmitting}
        />

        {/* Manager Feedback Modal — Contrôleur → En révision */}
        <FeedbackModal
          isOpen={showManagerFeedbackModal}
          mode="manager"
          referenceFeedback={consultTask.adminFeedback || null}
          onClose={() => setShowManagerFeedbackModal(false)}
          onSubmit={(text) => handleFeedbackSubmit(text, 'manager')}
          isSubmitting={isFeedbackSubmitting}
        />

      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>{mode === 'MISSION' ? 'Missions' : 'Tâches'}</h1>
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
          {mode === 'TACHE' ? (
            <>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="A_VERIFIER">À vérifier</option>
              <option value="A_CORRIGER">À corriger</option>
              <option value="REATTRIBUEE">Réattribuée</option>
              <option value="EN_CONTROLE">En contrôle</option>
              <option value="EN_VALIDATION_FINALE">En validation finale</option>
              <option value="TERMINEE">Terminée</option>
            </>
          ) : (
            <>
              <option value="NON_DEMARREE">Non démarrée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </>
          )}
        </select>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '10%', textAlign: 'left' }}>ID</th>
              <th style={{ width: '20%', textAlign: 'left' }}>{mode === 'MISSION' ? 'Nom dossier' : 'ID Mission'}</th>
              <th style={{ width: '20%', textAlign: 'left' }}>Affecté à</th>
              <th style={{ width: '10%', textAlign: 'right', paddingRight: '0.5rem' }}>Échéance</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Statut</th>
              <th style={{ width: '15%', textAlign: 'left' }}>Date</th>
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
                  <div style={{color: 'var(--primary)', fontWeight: 500, fontSize: "0.875rem", margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px'}} title={mode === 'MISSION' ? (t.dossier?.name || t.dossierId) : (t.mission?.reference || t.missionId)}>
                    {mode === 'MISSION' ? (t.dossier?.name || t.dossierId) : (t.mission?.reference || t.missionId)}
                  </div>
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
                  {formatDate(t.createdAt)}
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button type="button" onClick={(e) => toggleMenu(e, t.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      <TaskDropdown taskId={t.id} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} menuRef={menuRef} tasks={tasks} setConsultTask={setConsultTask} setEditTask={setEditTask} setEditFormData={setEditFormData} fetchData={fetchData} currentUser={currentUser} />
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

export default GenericTaskPage;