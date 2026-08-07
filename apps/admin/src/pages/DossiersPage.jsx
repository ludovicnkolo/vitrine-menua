import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Pencil, Eye, Trash, MessageSquare, Paperclip, FileText, Download, Plus, X, Folder, ChevronRight, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { getSafeApiUrl, uploadFile, formatDate } from '../utils/helpers';
import ActionDropdown from '../components/ActionDropdown';
import { getStatusBadge } from '../utils/helpers';
import SmsModal from '../components/SmsModal';
import PaginationControls from '../components/PaginationControls';
import ReadOnlyField from '../components/ReadOnlyField';
import TaskConsultModal from '../components/TaskConsultModal';
import FilePreviewModal from '../components/FilePreviewModal';
import GedExplorer, { flattenFolderIds } from '../components/GedExplorer';

const DossiersPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultDossier, setConsultDossier] = useState(null);
  const [editDossier, setEditDossier] = useState(null);
  const [localConsultTask, setLocalConsultTask] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterOrigine, setFilterOrigine] = useState('all');
  const [showSmsModal, setShowSmsModal] = useState(false);
  
  // Mission Creation State
  const [createMissionModal, setCreateMissionModal] = useState(false);
  const [missionSubject, setMissionSubject] = useState('');
  const [missionAssignedTo, setMissionAssignedTo] = useState('');
  const [missionEcheance, setMissionEcheance] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [missionFile, setMissionFile] = useState(null);
  const [selectedDossierDocs, setSelectedDossierDocs] = useState([]);
  const [missionDossierId, setMissionDossierId] = useState('');
  const [authorizedDossierIds, setAuthorizedDossierIds] = useState([]);
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);
  const [operationalTree, setOperationalTree] = useState(null);

  useEffect(() => {
    if (createMissionModal && consultDossier) {
      const fetchTree = async () => {
        try {
          const token = sessionStorage.getItem('adminToken');
          const operationalDossier = consultDossier.subDossiers?.find(d => d.name === 'OPÉRATIONS & RÉALISATIONS');
          if (operationalDossier) {
            const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${operationalDossier.id}/tree`), {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setOperationalTree(data);
            }
          }
        } catch (e) { console.error(e); }
      };
      fetchTree();
    } else {
      setOperationalTree(null);
    }
  }, [createMissionModal, consultDossier]);
  
  // Dossier Creation State
  const [showCreateDossierModal, setShowCreateDossierModal] = useState(false);
  const [newDossierData, setNewDossierData] = useState({
    name: '',
    description: '',
    priority: 'NORMAL',
    origin: '',
    parentDossierId: '',
    targetId: '',
    categorie: ''
  });
  const [isSubmittingDossier, setIsSubmittingDossier] = useState(false);
  
  const menuRef = useRef(null);

  // States for real API data
  const [dbDossiers, setDbDossiers] = useState([]);
  const [dbTasks, setDbTasks] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [dbClients, setDbClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDossiers = () => {
    setIsLoading(true);
    const token = sessionStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    const urlDossiers = new URL(getSafeApiUrl('/api/crm/dossiers'));
    urlDossiers.searchParams.set('page', page);
    urlDossiers.searchParams.set('limit', 15);
    urlDossiers.searchParams.set('rootOnly', 'true');
    if (searchQuery) urlDossiers.searchParams.set('search', searchQuery);
    if (filterStatus) urlDossiers.searchParams.set('status', filterStatus);
    if (filterRole) urlDossiers.searchParams.set('role', filterRole);
    if (filterOrigine) urlDossiers.searchParams.set('origin', filterOrigine);

    const urlTasks = new URL(getSafeApiUrl('/api/crm/tasks'));
    urlTasks.searchParams.set('page', 1);
    urlTasks.searchParams.set('limit', 1000);

    Promise.all([
      fetch(urlDossiers.toString(), { headers }).then(res => res.json()).catch(() => ({ data: [], totalPages: 1 })),
      fetch(urlTasks.toString(), { headers }).then(res => res.json()).catch(() => ({ data: [] })),
      fetch(getSafeApiUrl('/api/crm/users'), { headers }).then(res => res.json()).catch(() => ([])),
      fetch(getSafeApiUrl('/api/crm/clients'), { headers }).then(res => res.json()).catch(() => ([]))
    ]).then(([dossiersRes, tasksRes, usersRes, clientsRes]) => {
      setDbDossiers(dossiersRes?.data || (Array.isArray(dossiersRes) ? dossiersRes : []));
      setTotalPages(dossiersRes?.totalPages || 1);
      setDbTasks(tasksRes?.data || (Array.isArray(tasksRes) ? tasksRes : []));
      setDbUsers(Array.isArray(usersRes) ? usersRes : []);
      setDbClients(Array.isArray(clientsRes) ? clientsRes : []);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus, filterRole, filterOrigine]);

  useEffect(() => {
    setPage(1);
    fetchDossiers();
  }, [filterStatus, filterRole, filterOrigine, searchQuery]);

  const handleCreateMission = async () => {
    if (!missionSubject || !missionAssignedTo || !missionEcheance) {
      window.customAlert("Veuillez remplir l'objet, le destinataire et l'échéance.");
      return;
    }
    
    setIsSubmittingMission(true);
    const token = sessionStorage.getItem('adminToken');
    
    try {
      // 1. Upload file if any
      let attachmentFilename = null;
      if (missionFile) {
        attachmentFilename = await uploadFile(missionFile, 'missions');
      }

      const res = await fetch(getSafeApiUrl('/api/crm/tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: `${missionSubject}\n\n${missionDescription}`,
          assignedToId: missionAssignedTo,
          dossierId: consultDossier.id,
          echeance: missionEcheance,
          attachment: attachmentFilename,
          dossierMissionId: missionDossierId || null,
          authorizedDossierIds: authorizedDossierIds
        })
      });
      
      if (res.ok) {
        const missionData = await res.json();
        // 2. If file was uploaded, register it as a Document linked to this mission
        if (attachmentFilename) {
          await fetch(getSafeApiUrl('/api/crm/documents'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              name: missionFile.name,
              filename: attachmentFilename,
              bucket: 'missions',
              missionId: missionData.id
            })
          });
        }

        // 3. Link selected dossier documents
        if (selectedDossierDocs.length > 0 && consultDossier.documents) {
          for (const docId of selectedDossierDocs) {
            const d = consultDossier.documents.find(x => x.id === docId);
            if (d && d.url) {
              const parts = d.url.split('/');
              if (parts.length >= 2) {
                const b = parts.shift();
                const fn = parts.join('/');
                await fetch(getSafeApiUrl('/api/crm/documents'), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({
                    name: d.name,
                    filename: fn,
                    bucket: b,
                    missionId: missionData.id
                  })
                });
              }
            }
          }
        }

        window.customAlert("Mission créée avec succès !");
        setCreateMissionModal(false);
        setMissionSubject('');
        setMissionDescription('');
        setMissionAssignedTo('');
        setMissionEcheance('');
        setMissionFile(null);
        setSelectedDossierDocs([]);
        setMissionDossierId('');
        setAuthorizedDossierIds([]);
        fetchDossiers();
      } else {
        window.customAlert("Erreur lors de la création de la mission.");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmittingMission(false);
    }
  };

  const handleCreateDossier = async (e) => {
    e.preventDefault();
    if (!newDossierData.name) {
      window.customAlert("Le nom du dossier est requis.");
      return;
    }
    if (!newDossierData.origin) {
      window.customAlert("Veuillez sélectionner une Origine (Client ou Collaborateur).");
      return;
    }
    if (!newDossierData.targetId) {
      window.customAlert(`Veuillez sélectionner la Cible (${newDossierData.origin === 'CLIENT' ? 'Client' : 'Collaborateur'}).`);
      return;
    }
    if (!newDossierData.categorie) {
      window.customAlert("Veuillez sélectionner une catégorie.");
      return;
    }

    setIsSubmittingDossier(true);
    const token = sessionStorage.getItem('adminToken');

    try {
      const payload = {
        name: newDossierData.name,
        description: newDossierData.description,
        priority: newDossierData.priority,
        origin: newDossierData.origin,
        parentDossierId: newDossierData.parentDossierId || null,
        categorie: newDossierData.categorie
      };
      
      if (newDossierData.origin === 'CLIENT' && newDossierData.targetId) {
        payload.clientId = newDossierData.targetId;
      } else if (newDossierData.origin === 'COLLABORATEUR' && newDossierData.targetId) {
        payload.targetUserId = newDossierData.targetId;
      }

      const res = await fetch(getSafeApiUrl('/api/crm/dossiers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        window.customAlert("Dossier créé avec succès !");
        setShowCreateDossierModal(false);
        setNewDossierData({ name: '', description: '', priority: 'NORMAL', origin: '', parentDossierId: '', targetId: '', categorie: '' });
        fetchDossiers();
      } else {
        const errData = await res.json();
        window.customAlert("Erreur: " + (errData.error || "Création impossible"));
      }
    } catch (err) {
      console.error(err);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmittingDossier(false);
    }
  };

  const handleUpdateDossier = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const payload = {
        name: editDossier.name,
        description: editDossier.description,
        status: editDossier.status
      };
      const res = await fetch(getSafeApiUrl(`/api/crm/dossiers/${editDossier.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        window.customAlert('Dossier modifié avec succès !');
        setEditDossier(null);
        fetchDossiers();
      } else {
        const errData = await res.json();
        window.customAlert("Erreur lors de la modification: " + (errData.error || "Impossible de sauvegarder"));
      }
    } catch (err) {
      console.error(err);
      window.customAlert('Erreur réseau lors de la modification.');
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
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const renderDropdown = (id) => {
    return (
      <ActionDropdown isOpen={openMenuId === id} menuRef={menuRef} width="150px">
        <button type="button" className="dropdown-item" onClick={() => { setConsultDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }}>
          <Eye size={14} color="var(--primary)" /> Consulter
        </button>
        <button type="button" className="dropdown-item" onClick={() => { setEditDossier(dbDossiers.find(d => d.id === id)); setOpenMenuId(null); }}>
          <Pencil size={14} color="#D97706" /> Modifier
        </button>
        <button type="button" className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  };



  const renderDossierFields = (dossier, isEdit) => (
    <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap'}}>Nom du dossier</strong>
        {isEdit ? (
          <input type="text" value={dossier.name || ''} onChange={(e) => setEditDossier({...editDossier, name: e.target.value})} className="input-field" style={{padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--primary)', background: '#FFF', flex: 1}} />
        ) : (
          <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{dossier.name || '-'}</span>
        )}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Origine :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{dossier.origin || 'INTERNE'}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Catégorie :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{dossier.categorie || '-'}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Propriétaire du dossier :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>
          {dossier.origin === 'CLIENT' 
            ? (dossier.client?.name || dossier.client?.companyName || dbClients.find(c => c.id === dossier.clientId)?.name || dbClients.find(c => c.id === dossier.clientId)?.companyName || 'Client inconnu') 
            : dossier.origin === 'COLLABORATEUR'
            ? (dossier.targetUser?.name || dbUsers.find(u => u.id === dossier.targetUserId)?.name || 'Collaborateur inconnu')
            : 'MENUA CONSULTING (Interne)'
          }
        </span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Créé par :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{dossier.createdBy?.name || 'Inconnu'}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Statut :</strong>
        {isEdit && (currentUser?.role?.name === 'Super-administrateur' || currentUser?.role === 'Super-administrateur' || currentUser?.role?.name === 'Administrateur' || currentUser?.role === 'Administrateur') ? (
          <select value={editDossier?.status || dossier.status || 'NOUVEAU'} onChange={(e) => setEditDossier({...editDossier, status: e.target.value})} className="input-field" style={{padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--primary)', background: '#FFF'}}>
            <option value="NOUVEAU">Nouveau</option>
            <option value="OUVERT">Ouvert</option>
            <option value="BLOQUE">Bloqué</option>
            <option value="CLOTURE">Clôturé</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
        ) : (
          <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{getStatusBadge(dossier.status)}</span>
        )}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Date de création :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{new Date(dossier.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
        <strong style={{color: 'var(--text-muted)', fontWeight: 600}}>Rôle :</strong>
        <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{dossier.createdBy?.role?.name || '-'}</span>
      </div>
    </div>
  );

  const renderAssociatedTasks = (tasks, isEdit) => (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>
        {isEdit ? 'Gérer les missions associées' : 'Vues des missions associées'}
      </h4>
      {tasks.length > 0 ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {tasks.map(task => (
            <button type="button" key={task.id} onClick={() => setLocalConsultTask(task)} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s', width: '100%', textAlign: 'left', fontFamily: 'inherit'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{task.subject || `Mission ${task.reference || task.id}`}</strong>
                <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(task.status)}</span>
              </div>
              {isEdit && (
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); window.customAlert(`Mission ${task.id} supprimée avec succès !`); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)'}} title="Supprimer la mission">
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
         <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
           Aucune mission associée pour le moment.
         </div>
      )}
    </div>
  );

  const renderDocuments = (documents, label = 'Documents attachés') => (
    <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
      <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <Paperclip size={16} /> {label}
      </h4>
      {(documents && documents.length > 0) ? (
        <select 
          onChange={(e) => {
            if(e.target.value) {
              setPreviewFile(e.target.value);
              e.target.selectedIndex = 0;
            }
          }}
          className="input-field"
          style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', background: '#FFF', cursor: 'pointer', fontFamily: 'inherit'}}
        >
          <option value="">-- Sélectionner un document pour le consulter --</option>
          {documents.map(doc => (
            <option key={doc.id} value={doc.url}>{doc.name}</option>
          ))}
        </select>
      ) : (
        <div style={{padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>
          Aucun document attaché.
        </div>
      )}
    </div>
  );


  if (consultDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === consultDossier.id);
    
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => setConsultDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>consultation du dossier : {consultDossier.reference || consultDossier.id}</h2>
        </div>

        {renderDossierFields(consultDossier, false)}
        <div style={{display: 'flex', gap: '2rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', alignItems: 'flex-start'}}>
          <div style={{flex: '0 0 70%'}}>
            <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Description du dossier</h4>
            <div style={{padding: '1.5rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: 'var(--text-main)', minHeight: '120px'}}>
              {consultDossier.description || <span style={{color: 'var(--text-muted)'}}>Aucune description fournie.</span>}
            </div>
          </div>
          <div style={{flex: '1 1 auto', minWidth: 0}}>
            {renderAssociatedTasks(associatedTasks, false)}
          </div>
        </div>

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="button" onClick={() => setCreateMissionModal(true)} className="btn btn-primary" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              Créer une mission
            </button>
            <button type="button" onClick={() => setShowSmsModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <MessageSquare size={16} /> Envoyer SMS
            </button>
          </div>
          <button type="button" onClick={() => setConsultDossier(null)} className="btn btn-outline">Fermer</button>
        </div>

        {/* Modal SMS */}
        {showSmsModal && (
          <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div className="card" style={{width: '90%', maxWidth: '500px', padding: '2rem'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem'}}>Envoyer un SMS (Dossier: {consultDossier.reference || consultDossier.id})</h3>
              
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Numéro de téléphone</label>
                <input 
                  type="text" 
                  value={smsPhone} 
                  onChange={(e) => setSmsPhone(e.target.value)} 
                  placeholder="+33600000000"
                  className="input-field" 
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} 
                />
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message</label>
                <textarea 
                  value={smsMessage} 
                  onChange={(e) => setSmsMessage(e.target.value)} 
                  placeholder="Votre message SMS..."
                  className="input-field" 
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'}}
                />
                <div style={{textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>
                  {smsMessage.length} / 160 caractères
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" onClick={() => { setShowSmsModal(false); setSmsPhone(''); setSmsMessage(''); }} className="btn btn-outline" disabled={isSubmittingSms}>Annuler</button>
                <button type="button" onClick={handleSendSms} disabled={isSubmittingSms} className="btn btn-primary">{isSubmittingSms ? 'Envoi...' : 'Envoyer SMS'}</button>
              </div>
            </div>
          </div>
        )}


        {createMissionModal && (() => {
          const operationalDossier = consultDossier?.subDossiers?.find(d => d.name === 'OPÉRATIONS & RÉALISATIONS');
          const operationalSubFolders = operationalDossier ? [operationalDossier, ...(operationalDossier.subDossiers || [])] : [];
          return (
          <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600}}>Nouvelle Mission</h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la mission</label>
                  <input type="text" value={missionSubject} onChange={(e) => setMissionSubject(e.target.value)} placeholder="Sujet..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                </div>

                {operationalTree && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                      <div>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>Dossier mission (Sélection unique)</label>
                        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                          <GedExplorer 
                            tree={operationalTree} 
                            multiSelect={false}
                            selectedId={missionDossierId} 
                            onSelectId={setMissionDossierId} 
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>Dossiers autorisés (Sélection multiple avec sous-dossiers)</label>
                        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                          <GedExplorer 
                            tree={operationalTree} 
                            multiSelect={true}
                            selectedIds={authorizedDossierIds} 
                            onToggleChildren={(child) => {
                              const ids = flattenFolderIds(child);
                              if (authorizedDossierIds.includes(child.id)) {
                                setAuthorizedDossierIds(prev => prev.filter(id => !ids.includes(id)));
                              } else {
                                setAuthorizedDossierIds(prev => Array.from(new Set([...prev, ...ids])));
                              }
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                    {authorizedDossierIds.length > 0 && (() => {
                      const getNames = (folder, ids) => {
                        let names = [];
                        if (ids.includes(folder.id)) names.push(folder.name);
                        if (folder.subDossiers) {
                          folder.subDossiers.forEach(sub => names = [...names, ...getNames(sub, ids)]);
                        }
                        return names;
                      };
                      const selectedNames = getNames(operationalTree, authorizedDossierIds);
                      return (
                        <div style={{padding: '0.75rem', background: '#e0f2fe', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid #bae6fd'}}>
                          <strong style={{display: 'block', marginBottom: '0.25rem', color: '#0369a1'}}>Panier des dossiers autorisés :</strong>
                          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                            {selectedNames.map((name, i) => (
                              <span key={i} style={{background: '#FFF', color: '#0369a1', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #7dd3fc'}}>{name}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Assigner à</label>
                    <select value={missionAssignedTo} onChange={(e) => setMissionAssignedTo(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                      <option value="">Sélectionner...</option>
                      {dbUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Échéance</label>
                    <input type="date" value={missionEcheance} onChange={(e) => setMissionEcheance(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}} />
                  </div>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message / Consignes</label>
                  <textarea value={missionDescription} onChange={(e) => setMissionDescription(e.target.value)} placeholder="Détails de la mission..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>
                    <Paperclip size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} />Pièce jointe (optionnel)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => setMissionFile(e.target.files?.[0] || null)}
                    style={{width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.875rem'}}
                  />
                  {missionFile && <p style={{fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem'}}>✔ {missionFile.name}</p>}
                </div>

                {consultDossier?.documents?.length > 0 && (
                  <div style={{marginTop: '0.5rem', padding: '0.75rem', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD'}}>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                      Inclure des documents du dossier (optionnel) :
                    </label>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      {consultDossier.documents.map(doc => (
                        <div key={doc.id} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', margin: 0}}>
                            <input 
                              type="checkbox" 
                              checked={selectedDossierDocs.includes(doc.id)} 
                              onChange={(e) => {
                                if (e.target.checked) setSelectedDossierDocs([...selectedDossierDocs, doc.id]);
                                else setSelectedDossierDocs(selectedDossierDocs.filter(id => id !== doc.id));
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
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" onClick={() => { setCreateMissionModal(false); setSelectedDossierDocs([]); setMissionDossierId(''); setAuthorizedDossierIds([]); }} className="btn btn-outline" disabled={isSubmittingMission}>Annuler</button>
                <button type="button" onClick={handleCreateMission} disabled={isSubmittingMission} className="btn btn-primary">{isSubmittingMission ? 'Création...' : 'Créer la mission'}</button>
              </div>
            </div>
          </div>
          );
        })()}

        <SmsModal 
          isOpen={showSmsModal} 
          onClose={() => setShowSmsModal(false)} 
          contextData={{ dossierId: consultDossier.id }} 
        />

        <TaskConsultModal task={localConsultTask} onClose={() => setLocalConsultTask(null)} titlePrefix="Consulter la Mission:" />
      </div>
    );
  }

  if (editDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === editDossier.id);
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier le Dossier: {editDossier.reference || editDossier.id}</h2>
        </div>

        {renderDossierFields(editDossier, true)}
        <div style={{display: 'flex', gap: '2rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', alignItems: 'flex-start'}}>
          <div style={{flex: '0 0 70%'}}>
            <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Description du dossier</h4>
            <textarea
              value={editDossier.description || ''}
              onChange={(e) => setEditDossier({...editDossier, description: e.target.value})}
              className="input-field"
              style={{width: '100%', padding: '1.5rem', background: '#FFF', borderRadius: '8px', border: '1px solid var(--primary)', fontSize: '0.875rem', color: 'var(--text-main)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}
              placeholder="Description du dossier..."
            />
          </div>
          <div style={{flex: '1 1 auto', minWidth: 0}}>
            {renderAssociatedTasks(associatedTasks, true)}
          </div>
        </div>

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={handleUpdateDossier} className="btn btn-primary">Enregistrer</button>
        </div>

        <TaskConsultModal task={localConsultTask} onClose={() => setLocalConsultTask(null)} titlePrefix="Consulter la Mission:" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tous les Dossiers</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion complète et cycle de vie</p>
        </div>
        <button 
          onClick={() => { setNewDossierData({ name: '', description: '', priority: 'NORMAL', origin: '', parentDossierId: '', targetId: '', categorie: '' }); setShowCreateDossierModal(true); }} 
          className="btn btn-primary" 
          style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
        >
          <Plus size={18} /> Nouveau Dossier
        </button>
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
          <option value="NOUVEAU">Nouveau</option>
          <option value="OUVERT">Ouvert</option>
          <option value="BLOQUE">Bloqué</option>
          <option value="CLOTURE">Clôturé</option>
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
              <th style={{ width: '10%' }}>ID</th>
              <th style={{ width: '22%' }}>Nom du dossier</th>
              <th style={{ width: '15%' }}>Origine</th>
              <th style={{ width: '20%' }}>Propriétaire</th>
              <th style={{ width: '10%' }}>Statut</th>
              <th style={{ width: '13%' }}>Date de création</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Chargement des dossiers...</td></tr>
            ) : dbDossiers.filter(d => !d.parentDossierId).length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Aucun dossier principal trouvé.</td></tr>
            ) : dbDossiers.filter(d => !d.parentDossierId).map(d => {
              const dOrigin = d.origin || 'INTERNE';
              const dOwner = d.origin === 'CLIENT' 
                ? (d.client?.name || d.client?.companyName || dbClients.find(c => c.id === d.clientId)?.name || dbClients.find(c => c.id === d.clientId)?.companyName || 'Client inconnu') 
                : d.origin === 'COLLABORATEUR'
                ? (d.targetUser?.name || dbUsers.find(u => u.id === d.targetUserId)?.name || 'Collaborateur inconnu')
                : 'MENUA CONSULTING (Interne)';
              const dCreatorRole = d.createdBy?.role?.name || '-';
              return (
              <tr key={d.id}>
                <td><div style={{whiteSpace: 'nowrap', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px'}} title={d.reference || d.id}>{d.reference || d.id}</div></td>
                <td><strong className="truncate-name" style={{color: 'var(--text-main)'}}>{d.name}</strong></td>
                <td><div style={{color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px'}} title={dOrigin}>{dOrigin}</div></td>
                <td><div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px'}} title={dOwner}>{dOwner}</div></td>
                <td><div className="truncate-text">{getStatusBadge(d.status)}</div></td>

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

      <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />

      {/* Modal Création Dossier */}
      {showCreateDossierModal && (
        <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>Nouveau Dossier</h3>
              <button onClick={() => setShowCreateDossierModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreateDossier}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier *</label>
                  <input required type="text" value={newDossierData.name} onChange={(e) => setNewDossierData({...newDossierData, name: e.target.value})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Description *</label>
                  <textarea required value={newDossierData.description} onChange={(e) => setNewDossierData({...newDossierData, description: e.target.value})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Catégorie *</label>
                  <select required value={newDossierData.categorie} onChange={(e) => setNewDossierData({...newDossierData, categorie: e.target.value})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                    <option value="">-- Sélectionner une catégorie --</option>
                    <option value="Dossiers prospects">Dossiers prospects</option>
                    <option value="Dossiers clients">Dossiers clients</option>
                    <option value="Dossiers référentiels">Dossiers référentiels</option>
                  </select>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Origine *</label>
                    <select required value={newDossierData.origin} onChange={(e) => setNewDossierData({...newDossierData, origin: e.target.value, targetId: ''})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                      <option value="">-- Sélectionner l'origine --</option>
                      <option value="CLIENT">Client</option>
                      <option value="COLLABORATEUR">Collaborateur</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Cible {newDossierData.origin ? `(${newDossierData.origin === 'CLIENT' ? 'Client' : 'Collaborateur'}) *` : '*'}</label>
                    <select required value={newDossierData.targetId} onChange={(e) => setNewDossierData({...newDossierData, targetId: e.target.value})} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}} disabled={!newDossierData.origin}>
                      <option value="">-- Sélectionner --</option>
                      {newDossierData.origin === 'CLIENT' && dbClients.map(c => (
                        <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                      ))}
                      {newDossierData.origin === 'COLLABORATEUR' && dbUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" onClick={() => setShowCreateDossierModal(false)} className="btn btn-outline" disabled={isSubmittingDossier}>Annuler</button>
                <button type="submit" disabled={isSubmittingDossier || !newDossierData.name.trim() || !newDossierData.description.trim() || !newDossierData.origin || !newDossierData.targetId || !newDossierData.categorie} className="btn btn-primary" style={{ opacity: (!newDossierData.name.trim() || !newDossierData.description.trim() || !newDossierData.origin || !newDossierData.targetId || !newDossierData.categorie) ? 0.5 : 1 }}>{isSubmittingDossier ? 'Création...' : 'Créer le dossier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DossiersPage;