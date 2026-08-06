import { getSafeApiUrl, apiFetch, uploadFile, formatDate, extractFieldFromHtml, extractBlockFromHtml } from '../utils/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, CheckCircle, AlertCircle, Mail, Pencil, Eye, Trash, Files, Paperclip, FileText
} from 'lucide-react';
import TabsNavigation from '../components/TabsNavigation';
import ActionDropdown from '../components/ActionDropdown';
import PaginationControls from '../components/PaginationControls';
import FilePreviewModal from '../components/FilePreviewModal';
import AttachmentSelect from '../components/AttachmentSelect';

const DetailField = ({ label, value, children }) => (
  <div>
    <span style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>{label}</span>
    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word'}}>
      {children || value}
    </div>
  </div>
);

const InlineDetailField = ({ label, value, children }) => (
  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
    <span style={{fontWeight: 500, color: 'var(--text-muted)'}}>{label} :</span>
    <div style={{color: 'var(--text-main)', display: 'flex', alignItems: 'center'}}>
      {children || value}
    </div>
  </div>
);

const getDisplayStatus = (status) => {
  if (!status) return 'EN ATTENTE';
  const s = status.toUpperCase();
  if (s === 'CLASSE' || s === 'CLASSÉ') return 'CLASSÉ';
  if (s === 'TRAITE' || s === 'TRAITÉ') return 'TRAITÉ';
  return 'EN ATTENTE';
};

const getStatusBadge = (status) => {
  const displayStatus = getDisplayStatus(status);
  if (displayStatus === 'EN ATTENTE') return { bg: '#FEE2E2', color: '#DC2626' }; // Red
  if (displayStatus === 'TRAITÉ') return { bg: '#DCFCE7', color: '#166534' }; // Green
  if (displayStatus === 'CLASSÉ') return { bg: '#E0E7FF', color: '#4F46E5' }; // Blue
  return { bg: '#F1F5F9', color: '#475569' };
};

const InboxPage = ({ userRole }) => {
  const [tab, setTab] = useState((userRole === 'Collaborateur' || userRole === 'Relecteur') ? 'interne' : 'contact');
  const [filterTraite, setFilterTraite] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [isNewDossier, setIsNewDossier] = useState(true);
  const [dossierFile, setDossierFile] = useState(null);
  const [selectedMsgDocs, setSelectedMsgDocs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [assignMsg, setAssignMsg] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [showActionChoiceModal, setShowActionChoiceModal] = useState(false);

  // Form states
  const [taskSubject, setTaskSubject] = useState('');
  const [taskAssignedToId, setTaskAssignedToId] = useState('');
  const [taskNewDossierName, setTaskNewDossierName] = useState('');
  const [taskDossierSection, setTaskDossierSection] = useState('');
  const [taskDossierCible, setTaskDossierCible] = useState('');
  const [taskDossierId, setTaskDossierId] = useState('');
  
  const [showTraitePopup, setShowTraitePopup] = useState(false);
  const [lieuTraitement, setLieuTraitement] = useState('');
  const [numeroReference, setNumeroReference] = useState('');

  const [taskDescription, setTaskDescription] = useState('');
  const [taskEcheance, setTaskEcheance] = useState('');
  const menuRef = useRef(null);
  const isAnyModalOpen = processMsg || createTaskModal || showActionChoiceModal || showTraitePopup;

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');
      if (!token) return;
      
      
      const urlMessages = new URL(getSafeApiUrl(`/api/crm/messages`));
      urlMessages.searchParams.append('type', tab);
      urlMessages.searchParams.append('page', page);
      urlMessages.searchParams.append('limit', '6');
      urlMessages.searchParams.append('status', filterTraite);
      urlMessages.searchParams.append('search', searchQuery);

      const [resMsgs, resUsers, resDossiers, resClients] = await Promise.all([
        fetch(urlMessages.toString(), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(new URL(getSafeApiUrl(`/api/crm/users`)).toString(), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(new URL(getSafeApiUrl(`/api/crm/dossiers?limit=1000`)).toString(), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(new URL(getSafeApiUrl(`/api/crm/clients?limit=1000`)).toString(), { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (resMsgs.ok) {
        const result = await resMsgs.json();
        if (result.data) {
           setMessages(result.data);
           setTotalPages(result.totalPages || 1);
        } else {
           setMessages(result);
           setTotalPages(1);
        }
      }
      else if (resMsgs.status === 401) {
        showToast('Votre session a expiré. Veuillez vous reconnecter.', 'error');
        sessionStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
      
      if (resUsers.ok) setUsers(await resUsers.json());
      if (resDossiers.ok) {
        const doss = await resDossiers.json();
        setDossiers(doss.data || doss);
      }
      if (resClients.ok) {
        const cl = await resClients.json();
        setClients(cl.data || cl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [tab, filterTraite, searchQuery]);

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem('adminUser');
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } catch(e) {}
  }, []);

  useEffect(() => {
    fetchMessages();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [page, tab, filterTraite, searchQuery]);


  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }


  const handleCreateTask = async () => {
    try {
      setIsSubmitting(true);
      const token = sessionStorage.getItem('adminToken');
      
      
      let finalDossierId = null;
      if (tab !== 'interne') {
        if (isNewDossier) {
          if (!taskNewDossierName.trim()) {
            showToast("Veuillez saisir le nom du nouveau dossier.", "error");
            setIsSubmitting(false);
            return;
          }
          if (!taskDossierSection || !taskDossierCible) {
            showToast("Veuillez sélectionner la section et la cible pour le nouveau dossier.", "error");
            setIsSubmitting(false);
            return;
          }
          
          const newDossierPayload = { 
            name: taskNewDossierName, 
            description: `Créé depuis la messagerie : ${processMsg.nomPrenom || 'Contact'}`, 
            origin: tab.toUpperCase() 
          };
          if (taskDossierSection === 'client') {
            newDossierPayload.clientId = taskDossierCible || null;
          } else if (taskDossierSection === 'equipe') {
            newDossierPayload.targetUserId = taskDossierCible || null;
          }
          
          // Upload dossier file if any
          let dossierFilename = null;
          if (dossierFile) {
            dossierFilename = await uploadFile(dossierFile, 'dossiers');
          }

          const dossRes = await apiFetch(`/api/crm/dossiers`, 'POST', newDossierPayload);
          if (!dossRes.ok) {
            const errData = await dossRes.json().catch(() => ({}));
            showToast(`Erreur lors de la création du dossier: ${errData.error || ''}`, "error");
            setIsSubmitting(false);
            return;
          }
          const dossData = await dossRes.json();
          finalDossierId = dossData.id;

          // Register uploaded file as Document linked to the dossier
          if (dossierFilename) {
            await apiFetch('/api/crm/documents', 'POST', {
              name: dossierFile.name,
              filename: dossierFilename,
              bucket: 'dossiers',
              dossierId: finalDossierId
            });
          }

          // Link message attachment if requested
          if (selectedMsgDocs.length > 0 && processMsg?.attachment) {
            for (const att of selectedMsgDocs) {
              const parts = att.split('/');
              if (parts.length >= 2) {
                const b = parts.shift();
                const fn = parts.join('/');
                await apiFetch('/api/crm/documents', 'POST', {
                  name: fn.split('/').pop() || fn,
                  filename: fn,
                  bucket: b,
                  dossierId: finalDossierId
                });
              }
            }
          }
        } else {
          if (!taskDossierId) {
            showToast("Veuillez sélectionner un dossier existant.", "error");
            setIsSubmitting(false);
            return;
          }
          finalDossierId = taskDossierId;
        }

        // Lier le message au dossier et marquer comme traité
        const statusRes = await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { dossierId: finalDossierId, status: 'TRAITE' });
        if (!statusRes.ok) {
          showToast("Erreur lors de la mise à jour du statut du message.", "error");
          setIsSubmitting(false);
          return;
        }


      } else {
        // Interne reply
        let attachmentsArray = [];
        if (newTaskFile) {
          const uploadedName = await uploadFile(newTaskFile);
          if (uploadedName) attachmentsArray.push(uploadedName);
        }
        const finalAttachment = attachmentsArray.filter(Boolean).join(',') || null;

        let replyAssignedToId = processMsg.assignedToId || null;
        if (currentUser && processMsg.email && processMsg.email !== currentUser.email) {
            const senderUser = users.find(u => u.email === processMsg.email);
            if (senderUser) {
                replyAssignedToId = senderUser.id;
            }
        }

        const replyRes = await apiFetch(`/api/crm/messages/interne`, 'POST', {
            subType: `Réponse à ${processMsg.nomPrenom}`,
            objet: taskSubject,
            bodyText: taskDescription,
            attachment: finalAttachment,
            dossierId: processMsg.dossierId || null,
            missionId: processMsg.missionId || null,
            tacheId: processMsg.tacheId || null,
            assignedToId: replyAssignedToId
        });

        if (!replyRes.ok) {
          const errData = await replyRes.json().catch(() => null);
          showToast(`Erreur lors de l'envoi de la réponse: ${errData?.error || 'Erreur serveur'}`, "error");
          setIsSubmitting(false);
          return;
        }

        // Mark the original message as TRAITE
        const statusRes = await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { status: 'TRAITE' });
        if (!statusRes.ok) {
          showToast("Erreur lors de la mise à jour du statut du message.", "error");
          setIsSubmitting(false);
          return;
        }
      }

      fetchMessages();
      showToast(tab === 'interne' ? 'Réponse envoyée avec succès !' : 'Dossier créé et message traité avec succès !', 'success');
      setCreateTaskModal(false);
      setTaskNewDossierName('');
      setTaskDossierSection('');
      setTaskDossierCible('');
      setIncludeAttachedFile(false);
      setProcessMsg(null);
      setNewTaskFile(null);
      setDossierFile(null);
      setSelectedMsgDocs([]);
      setTaskSubject('');
      setTaskDescription('');
      setTaskEcheance('');
    } catch (error) {
      console.error(error);
      showToast('Une erreur est survenue.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedAssignee) {
      window.customAlert("Veuillez sélectionner un collaborateur.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(getSafeApiUrl(`/api/crm/messages/${assignMsg.id}/assign`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ assignedToId: selectedAssignee })
      });
      if (res.ok) {
        showToast("Message assigné avec succès");
        setAssignMsg(null);
        setSelectedAssignee('');
        fetchMessages();
      } else {
        window.customAlert("Erreur lors de l'assignation");
      }
    } catch (e) {
      console.error(e);
      window.customAlert("Erreur réseau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsProcessed = async () => {
    if (!processMsg) return;
    try {
      const res = await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { status: 'TRAITE' });
      if (res.ok) {
        showToast("Message marqué comme traité !", "success");
        setProcessMsg(null);
        fetchMessages();
      } else {
        showToast("Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    }
  };

  const handleUpdateStatus = async (statusToSet) => {
    if (!processMsg) return;
    try {
      const res = await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { status: statusToSet });
      if (res.ok) {
        showToast(`Message marqué comme ${statusToSet} !`, "success");
        setProcessMsg(null);
        setShowActionChoiceModal(false);
        fetchMessages();
      } else {
        showToast("Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    }
  };

  const handleTraiteSubmit = async () => {
    if (!lieuTraitement || !numeroReference.trim()) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { 
        status: 'TRAITE',
        lieuTraitement,
        numeroReference: numeroReference.trim()
      });
      if (res.ok) {
        showToast("Message marqué comme TRAITÉ et lié avec succès !", "success");
        setProcessMsg(null);
        setShowTraitePopup(false);
        setLieuTraitement('');
        setNumeroReference('');
        fetchMessages();
      } else {
        const errorData = await res.json().catch(() => null);
        showToast(errorData?.error || "Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncEmails = async () => {
    try {
      setIsSyncing(true);
      const res = await apiFetch(`/api/crm/messages/sync-imap`, 'POST');
      
      if (!res.ok) throw new Error("Erreur serveur");
      
      const data = await res.json();
      if (data.success) {
        showToast(data.addedCount > 0 ? `${data.addedCount} nouveaux emails récupérés !` : 'Aucun nouvel email à récupérer.', 'success');
        fetchMessages();
      } else {
        throw new Error(data.error || "Erreur de synchronisation");
      }
    } catch (err) {
      console.error(err);
      showToast("Impossible de synchroniser avec le serveur IMAP.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteMsg) return;
    try {
      const res = await apiFetch(`/api/crm/messages/${encodeURIComponent(deleteMsg.id)}`, 'DELETE');
      
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      
      showToast("Message supprimé avec succès.", "success");
      setDeleteMsg(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
      showToast("Impossible de supprimer le message.", "error");
    }
  };

  const renderDropdown = (m) => {
    return (
      <ActionDropdown isOpen={openMenuId === m.id} menuRef={menuRef} width="150px">
        <button type="button" className="dropdown-item" onClick={() => { setOpenMenuId(null); setProcessMsg(m); }}>
          <Eye size={14} /> Consulter
        </button>
        {(userRole === 'Administrateur' || userRole === 'Super administrateur') && (
          <button type="button" className="dropdown-item" onClick={() => { setOpenMenuId(null); setAssignMsg(m); }}>
            <Files size={14} /> Assigner à...
          </button>
        )}
        <button type="button" className="dropdown-item danger" onClick={() => { setOpenMenuId(null); setDeleteMsg(m); }}>
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  }
  
  const conversationMessages = tab === 'interne' && (processMsg?.tacheId || processMsg?.missionId || processMsg?.dossierId)
    ? messages.filter(m => 
        (m.tacheId && processMsg.tacheId && m.tacheId === processMsg.tacheId) ||
        (!m.tacheId && !processMsg.tacheId && m.missionId && processMsg.missionId && m.missionId === processMsg.missionId) ||
        (!m.tacheId && !processMsg.tacheId && !m.missionId && !processMsg.missionId && m.dossierId && processMsg.dossierId && m.dossierId === processMsg.dossierId)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : (processMsg ? [processMsg] : []);

  return (
    <div style={{padding: '0 1rem'}}>
      {!isAnyModalOpen && (
      <>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
        <TabsNavigation 
          tabs={
            (userRole === 'Collaborateur' || userRole === 'Relecteur')
            ? [{ id: 'interne', label: 'Interne' }]
            : [
                { id: 'contact', label: 'Contact' },
                { id: 'recrutement', label: 'Recrutement' },
                { id: 'interne', label: 'Interne' },
                { id: 'personnel', label: 'Personnel' }
              ]
          } 
          activeTab={tab} 
          onTabChange={setTab} 
        />
        <div style={{display: 'flex', gap: '1rem', width: '100%', alignItems: 'center'}}>
          <div style={{flex: 1, position: 'relative'}}>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', outline: 'none', background: '#F8FAFC'}}
            />
          </div>
          <select 
            value={filterTraite}
            onChange={(e) => setFilterTraite(e.target.value)}
            style={{padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', fontSize: '0.875rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', minWidth: '150px'}}
          >
            <option value="all">Tous (Traitement)</option>
            <option value="non_traite">Non Traités</option>
            <option value="traite">Traités</option>
          </select>
          {tab === 'personnel' && (
            <button type="button"
              onClick={handleSyncEmails} 
              disabled={isSyncing}
              className="btn btn-primary" 
              style={{padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center'}}
            >
              <Mail size={16} />
              {isSyncing ? 'Synchronisation...' : 'Synchroniser Emails'}
            </button>
          )}
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>№</th>
              <th style={{ width: '12%', whiteSpace: 'nowrap' }}>Statut</th>
              <th style={{ width: tab === 'interne' ? '15%' : '18%' }}>{tab === 'interne' ? 'Emetteur' : 'Nom'}</th>
              <th style={{ width: '18%' }}>{tab === 'recrutement' ? 'E-mail' : 'Email'}</th>
              <th style={{ width: '10%' }}>{tab === 'interne' ? 'Source' : 'Type'}</th>
              <th style={{ width: tab === 'interne' ? '15%' : '17%' }}>
                {tab === 'contact' ? 'Besoins' : tab === 'recrutement' ? 'Compétences' : tab === 'interne' ? 'ID' : 'Sujet'}
              </th>
              <th style={{ width: '12%' }}>Date</th>
              <th style={{ width: '8%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (loading) {
                return <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Chargement des messages...</td></tr>;
              }

              const renderMessageRow = (m, index, col2, col3, typeBadgeText, typeBadgeBg, typeBadgeColor, col5, col5Style) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{index + 1}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: getStatusBadge(m.status).bg, color: getStatusBadge(m.status).color,
                      whiteSpace: 'nowrap'
                    }}>{getDisplayStatus(m.status)}</span>
                  </td>
                  <td><strong className="truncate-name" style={{fontSize: "0.875rem"}}>{col2}</strong></td>
                  <td><span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{col3}</span></td>
                  <td>
                    <span style={{padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: typeBadgeBg, color: typeBadgeColor}}>
                      {typeBadgeText}
                    </span>
                  </td>
                  <td><div className="truncate-text" style={col5Style || {fontSize: "0.875rem"}}>{col5}</div></td>
                  <td style={{color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap"}}>{formatDate(m.createdAt)}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button type="button" onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(m)}
                      </div>
                    </div>
                  </td>
                </tr>
              );
              
              if (tab === 'contact') {
                return messages.map((m, i) => renderMessageRow(
                  m, i, m.nomPrenom, m.email,
                  m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier', '#E0E7FF', '#4F46E5',
                  m.contact?.typeBesoin || m.objet
                ));
              }

              if (tab === 'recrutement') {
                return messages.map((m, i) => renderMessageRow(
                  m, i, m.nomPrenom, m.email,
                  m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier', '#FEF3C7', '#D97706',
                  m.recrutement?.competenceCle || m.objet
                ));
              }

              if (tab === 'interne') {
                return messages.map((m, i) => renderMessageRow(
                  m, i, m.nomPrenom || 'Système', m.email || '-',
                  m.sourceType || m.subType || 'Interne', '#F1F5F9', '#64748B',
                  <span title={m.sourceRef || m.formulaireId || m.id}>{m.sourceRef || (m.formulaireId ? m.formulaireId.split('-')[0] : m.id)}</span>,
                  {color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "monospace"}
                ));
              }

              // Fallback
              return messages.map((m, i) => renderMessageRow(
                m, i, m.nomPrenom, m.email,
                m.sourceType || m.subType || 'Indéfini', '#F1F5F9', '#64748B',
                m.objet,
                {fontWeight: m.status === "NOUVEAU" ? 600 : 400, fontSize: "0.875rem"}
              ));
            })()}
          </tbody>
        </table>
      </div>

      <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />
      </>
      )}

      {/* Modal Traiter Demande */}
      {processMsg && !createTaskModal && !showActionChoiceModal && !showTraitePopup && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', position: 'relative'}}>
              <button type="button" onClick={() => setProcessMsg(null)} className="btn btn-outline-primary" style={{padding: "0.5rem 1rem", position: 'absolute', left: 0}}>RETOUR</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600, width: '100%', textAlign: 'center'}}>
                {(() => {
                  if (tab === 'contact') return 'CONSULTATION DU MESSAGE : FORMULAIRE DE CONTACT';
                  if (tab === 'recrutement') return 'CONSULTATION DU MESSAGE : CANDIDATURE';
                  if (tab === 'interne') return 'CONSULTATION DU MESSAGE : INTERNE';
                  if (tab === 'personnel') return 'CONSULTATION DU MESSAGE : PERSONNEL';
                  return 'CONSULTATION DU MESSAGE';
                })()}
              </h2>
            </div>
            
            {/* Fields for Contact */}
            {tab === 'contact' && (
              <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <InlineDetailField label="Type de contact" value={(extractFieldFromHtml(processMsg.bodyHtml, 'Type de client') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier')).replace(' / Organisation', '').replace(' (B2B)', '')} />
                <InlineDetailField label={processMsg.statusSubmitter === 'SOCIETE' ? "Nom du contact de l'entreprise" : "Nom complet"} value={processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'} />
                {processMsg.statusSubmitter === 'SOCIETE' && (
                  <InlineDetailField label="Société" value={processMsg.raisonSocial || extractFieldFromHtml(processMsg.bodyHtml, 'Société') || 'Non renseigné'} />
                )}
                <InlineDetailField label="Téléphone" value={processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'} />
                <InlineDetailField label="Email" value={processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'} />
                <InlineDetailField label="Fichiers joints">
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <AttachmentSelect files={[processMsg.cv, processMsg.attachment, processMsg.contact?.pieceJointe]} onPreview={setPreviewFile} />
                  </div>
                </InlineDetailField>
              </div>
            )}


            {/* Fields for Recrutement */}
            {tab === 'recrutement' && (
              <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <InlineDetailField label="Type de contact" value={extractFieldFromHtml(processMsg.bodyHtml, 'Type de profil') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise (B2B)' : 'Particulier')} />
                <InlineDetailField label="Nom complet" value={processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'} />
                <InlineDetailField label="Email" value={processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'} />
                <InlineDetailField label="Téléphone" value={processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'} />
                <InlineDetailField label="Années d'expérience" value={processMsg.recrutement?.anneeExperience || 'Non renseigné'} />
                <InlineDetailField label="Langues" value={processMsg.recrutement?.langue || extractFieldFromHtml(processMsg.bodyHtml, 'Langues') || 'Non renseigné'} />
                <InlineDetailField label="Lieu de résidence" value={processMsg.recrutement?.lieuResidence || extractFieldFromHtml(processMsg.bodyHtml, 'Localisation') || 'Non renseigné'} />
                <InlineDetailField label="Disponibilité" value={extractFieldFromHtml(processMsg.bodyHtml, 'Disponibilité') || 'Non renseigné'} />
                <InlineDetailField label="Profil LinkedIn">
                  {processMsg.recrutement?.lienLinkedin ? (
                    <a href={processMsg.recrutement.lienLinkedin} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                      {processMsg.recrutement.lienLinkedin}
                    </a>
                  ) : extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio') ? (
                    <a href={extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                      {extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')}
                    </a>
                  ) : 'Non renseigné'}
                </InlineDetailField>
                <InlineDetailField label="Fichiers joints">
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <AttachmentSelect files={[processMsg.cv, processMsg.attachment, processMsg.contact?.pieceJointe]} onPreview={setPreviewFile} />
                  </div>
                </InlineDetailField>
              </div>
            )}

            {/* Fields for Personnel and Interne */}
            {(tab === 'personnel' || tab === 'interne') && (
              <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <InlineDetailField label="Nom" value={processMsg.nomPrenom || 'Non renseigné'} />
                <InlineDetailField label="Email" value={processMsg.email || 'Non renseigné'} />
                <InlineDetailField label="Objet" value={processMsg.objet || 'Aucun objet'} />
                <InlineDetailField label="Fichiers joints">
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <AttachmentSelect files={[processMsg.cv, processMsg.attachment, processMsg.contact?.pieceJointe]} onPreview={setPreviewFile} />
                  </div>
                </InlineDetailField>
              </div>
            )}

            {/* Pièces jointes & Contenu */}
            <div style={{display: 'grid', gridTemplateColumns: (tab === 'contact' || tab === 'recrutement') ? '1fr 4fr' : '1fr', gap: '1.5rem', marginBottom: '1.5rem', minHeight: '300px'}}>
              {/* Left column: Actions / Pièces jointes */}
              {(tab === 'contact' || tab === 'recrutement') && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {tab === 'contact' && (
                  <div className="card" style={{padding: '1.25rem'}}>
                    <span style={{display: 'block', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Besoins</span>
                    <ul style={{margin: 0, paddingLeft: '1.5rem', color: 'var(--text-main)', fontSize: '0.875rem'}}>
                      {(processMsg.contact?.typeBesoin || processMsg.objet || 'Non renseigné')
                        .split(',')
                        .map((b, idx) => (
                          <li key={idx} style={{marginBottom: '0.5rem', lineHeight: '1.5'}}>{b.trim()}</li>
                        ))}
                    </ul>
                  </div>
                  )}
                  {tab === 'recrutement' && (
                  <div className="card" style={{padding: '1.25rem'}}>
                    <span style={{display: 'block', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Compétences clés</span>
                    <ul style={{margin: 0, paddingLeft: '1.5rem', color: 'var(--text-main)', fontSize: '0.875rem'}}>
                      {(processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné')
                        .split(',')
                        .map((c, idx) => (
                          <li key={idx} style={{marginBottom: '0.5rem', lineHeight: '1.5'}}>{c.trim()}</li>
                        ))}
                    </ul>
                  </div>
                  )}
              </div>
              )}

              <div className="card" style={{padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <span style={{display: 'block', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>
                  {(() => {
                    if (tab === 'contact' || tab === 'recrutement') return 'Description / Contenu';
                    if (tab === 'personnel' || tab === 'interne') return 'Fil de conversation';
                    return 'Message / Lettre de motivation';
                  })()}
                </span>
                <div style={{background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px', flex: 1, minHeight: '120px', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden'}}>
                  {tab === 'interne' ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      {conversationMessages.map(m => {
                        const isMe = m.email === currentUser?.email || m.nomPrenom === currentUser?.name;
                        return (
                          <div key={m.id} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            background: isMe ? 'var(--primary)' : '#FFF',
                            color: isMe ? '#FFF' : 'var(--text-main)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: isMe ? 'none' : '1px solid var(--border)',
                            maxWidth: '80%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: isMe ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', gap: '1rem'}}>
                              <strong>{m.nomPrenom}</strong>
                              <span>{formatDate(m.createdAt)}</span>
                            </div>
                            <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', lineHeight: '1.5'}}>
                              {m.bodyText || (m.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: m.bodyHtml }} /> : 'Aucun contenu.')}
                            </div>
                            {m.attachment && (
                              <div style={{marginTop: '0.5rem'}}>
                                <AttachmentSelect files={[m.attachment]} onPreview={setPreviewFile} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5'}}>
                      {processMsg.description || processMsg.bodyText || (() => {
                        if (tab === 'recrutement') return extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations');
                        if (tab === 'contact') return extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin');
                        return null;
                      })()}
                      
                      {!processMsg.description && !processMsg.bodyText && tab !== 'recrutement' && tab !== 'contact' && processMsg.bodyHtml && (
                         <div dangerouslySetInnerHTML={{ __html: processMsg.bodyHtml }} />
                      )}
                      {!processMsg.description && !processMsg.bodyText && !extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations') && !extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin') && (!processMsg.bodyHtml || tab === 'contact' || tab === 'recrutement') && 'Aucun contenu.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 4fr', gap: '1.5rem', marginTop: '2rem'}}>
              <div></div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                {tab === 'interne' ? (
                  getDisplayStatus(processMsg.status) !== 'TRAITÉ' && <button type="button" onClick={() => setCreateTaskModal(true)} className="btn btn-outline-primary">RÉPONDRE</button>
                ) : (
                  getDisplayStatus(processMsg.status) !== 'TRAITÉ' && <button type="button" onClick={() => setShowActionChoiceModal(true)} className="btn btn-outline-primary">DÉMARRER LE TRAITEMENT</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Choice Modal */}
      {showActionChoiceModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem', textAlign: 'center'}}>Option de traitement</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.5}}>
              Veuillez choisir l'action à effectuer pour ce message :
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <button 
                type="button" 
                className="btn btn-outline-primary" 
                style={{padding: '1rem', fontWeight: 600, fontSize: '1rem', width: '100%'}}
                onClick={() => handleUpdateStatus('CLASSE')}
              >
                LU & CLASSÉ
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{padding: '1rem', fontWeight: 600, fontSize: '1rem', width: '100%'}}
                onClick={() => { setShowActionChoiceModal(false); setShowTraitePopup(true); }}
              >
                LU & TRAITÉ
              </button>
            </div>
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <button type="button" className="btn btn-outline" style={{border: 'none'}} onClick={() => setShowActionChoiceModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Traite Popup */}
      {showTraitePopup && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <h3 style={{marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem', textAlign: 'center'}}>Traitement du Message</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.5}}>
              Veuillez renseigner le lieu du traitement et la référence de l'entité créée :
            </p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Lieu du traitement</label>
                <select 
                  value={lieuTraitement} 
                  onChange={(e) => setLieuTraitement(e.target.value)}
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}
                >
                  <option value="">-- Choisir --</option>
                  <option value="Dossier">Dossier</option>
                  <option value="Mission">Mission</option>
                  <option value="Tâche">Tâche</option>
                </select>
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Numéro / Référence de l'entité</label>
                <input 
                  type="text" 
                  value={numeroReference} 
                  onChange={(e) => setNumeroReference(e.target.value)}
                  placeholder="Ex: MSN-04"
                  style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem'}}>
              <button type="button" className="btn btn-outline" disabled={isSubmitting} onClick={() => { setShowTraitePopup(false); setLieuTraitement(''); setNumeroReference(''); }}>Annuler</button>
              <button type="button" className="btn btn-primary" disabled={isSubmitting} onClick={handleTraiteSubmit}>
                {isSubmitting ? 'Traitement...' : 'Terminer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createTaskModal && (
        <div className="fade-in" style={{width: '100%', padding: '0'}}>
          <div className="" style={{width: '100%', padding: '0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); setIncludeAttachedFile(false); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h3 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouveau Dossier'}</h3>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {tab === 'interne' && (
                <>
                  <div>
                    <label htmlFor="task-subject" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la réponse</label>
                    <input id="task-subject" type="text" value={taskSubject} onChange={(e) => setTaskSubject(e.target.value)} placeholder="Sujet..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                  </div>
                  <div>
                    <label htmlFor="task-message" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Message</label>
                    <textarea id="task-message" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Votre réponse..." style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              )}

              {tab !== 'interne' && (
                <div>
                  <label htmlFor="task-dossier" style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr 2fr', gap: '1rem', alignItems: 'start'}}>
                    <select value={taskDossierSection} onChange={(e) => { setTaskDossierSection(e.target.value); setTaskDossierCible(''); }} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                      <option value="">-- Section --</option>
                      <option value="equipe">Équipe</option>
                      <option value="client">Client</option>
                    </select>
                    
                    <select value={taskDossierCible} onChange={(e) => setTaskDossierCible(e.target.value)} disabled={!taskDossierSection} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF', opacity: !taskDossierSection ? 0.5 : 1}}>
                      <option value="">-- Sélectionner --</option>
                      {taskDossierSection === 'equipe' && users.map(u => (
                        <option key={u.id} value={u.id}>{`${u.name} (${u.role?.name || 'Sans rôle'})`}</option>
                      ))}
                      {taskDossierSection === 'client' && clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name || `${c.firstName} ${c.lastName}` || c.email}</option>
                      ))}
                    </select>
                    
                    <input type="text" value={taskNewDossierName} onChange={(e) => setTaskNewDossierName(e.target.value)} placeholder="Nom du nouveau dossier..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                  </div>

                  {/* File upload for dossier */}
                  <div style={{marginTop: '0.75rem'}}>
                    <label style={{display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.875rem'}}>
                      <Paperclip size={13} style={{marginRight: '4px', verticalAlign: 'middle'}} />Pièce jointe (optionnel)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={(e) => setDossierFile(e.target.files?.[0] || null)}
                      style={{width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', fontSize: '0.875rem'}}
                    />
                    {dossierFile && <p style={{fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem', margin: '0.25rem 0 0'}}>&#10004; {dossierFile.name}</p>}
                  </div>

                  {processMsg?.attachment && (
                    <div style={{marginTop: '1rem', padding: '0.75rem', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--primary-dark)'}}>
                        Inclure les pièces jointes du message :
                      </label>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        {processMsg.attachment.split(',').map(att => {
                          const fileName = att.split('/').pop();
                          return (
                            <div key={att} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)'}}>
                                <input 
                                  type="checkbox" 
                                  checked={selectedMsgDocs.includes(att)} 
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedMsgDocs([...selectedMsgDocs, att]);
                                    else setSelectedMsgDocs(selectedMsgDocs.filter(a => a !== att));
                                  }} 
                                  style={{cursor: 'pointer'}} 
                                />
                                <Paperclip size={14} style={{color: 'var(--primary)'}} /> {fileName}
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
                </div>
              )}

              {tab === 'interne' && (
                <div>
                  <span style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</span>
                  <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginBottom: 0}}>
                      <Files size={16} />
                      <span style={{fontSize: '0.875rem', fontWeight: 500}}>
                        {newTaskFile ? newTaskFile.name : 'Joindre un fichier...'}
                      </span>
                      <input 
                        type="file" 
                        style={{display: 'none'}} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setNewTaskFile(e.target.files[0]);
                          }
                        }} 
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); setDossierFile(null); setSelectedMsgDocs([]); setIncludeAttachedFile(false); }} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
              <button type="button" onClick={handleCreateTask} disabled={isSubmitting} className="btn btn-primary">
                {(() => {
                  if (isSubmitting) return 'Traitement...';
                  if (tab === 'interne') return 'Envoyer';
                  return 'Créer le Dossier';
                })()}
              </button>
            </div>
          </div>
        </div>
      )}

      <FilePreviewModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />

      {/* Delete Confirmation Modal */}
      {deleteMsg && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.25rem'}}>Confirmer la suppression</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5}}>
              Êtes-vous sûr de vouloir supprimer le message de <strong>{deleteMsg.nomPrenom}</strong> ?<br/><br/>
              Cette action est irréversible.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button type="button" className="btn btn-outline" onClick={() => setDeleteMsg(null)}>Annuler</button>
              <button type="button" className="btn btn-primary" style={{backgroundColor: '#DC2626', borderColor: '#DC2626'}} onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Confirmation Modal */}
      {assignMsg && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginTop: 0, marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.25rem'}}>Assigner le message</h3>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Sélectionner le destinataire :</label>
              <select 
                value={selectedAssignee} 
                onChange={(e) => setSelectedAssignee(e.target.value)}
                style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}
              >
                <option value="">-- Choisir un utilisateur --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role?.name || 'Sans rôle'})</option>
                ))}
              </select>
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button type="button" className="btn btn-outline" onClick={() => { setAssignMsg(null); setSelectedAssignee(''); }}>Annuler</button>
              <button type="button" className="btn btn-primary" disabled={isSubmitting} onClick={handleAssignSubmit}>
                {isSubmitting ? 'En cours...' : 'Assigner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', 
          background: toast.type === 'error' ? '#FEE2E2' : '#DCFCE7',
          color: toast.type === 'error' ? '#991B1B' : '#166534',
          padding: '1rem 1.5rem', borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default InboxPage;