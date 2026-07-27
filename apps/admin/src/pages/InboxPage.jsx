import { getSafeApiUrl, apiFetch, uploadFile, formatDate, extractFieldFromHtml, extractBlockFromHtml } from '../utils/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, CheckCircle, AlertCircle, Mail, Pencil, Eye, Trash, Files
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

const InboxPage = () => {
  const [tab, setTab] = useState('contact');
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [isNewDossier, setIsNewDossier] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form states
  const [taskSubject, setTaskSubject] = useState('');
  const [taskAssignedToId, setTaskAssignedToId] = useState('');
  const [taskNewDossierName, setTaskNewDossierName] = useState('');
  const [taskDossierSection, setTaskDossierSection] = useState('');
  const [taskDossierCible, setTaskDossierCible] = useState('');
  const [taskDossierId, setTaskDossierId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskEcheance, setTaskEcheance] = useState('');
  const menuRef = useRef(null);
  const isAnyModalOpen = processMsg || createTaskModal;

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
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
      else if (resMsgs.status === 401 || resMsgs.status === 403) {
        showToast('Votre session a expiré. Veuillez vous reconnecter.', 'error');
        localStorage.removeItem('adminToken');
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
      const token = localStorage.getItem('adminToken');
      
      
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
            newDossierPayload.clientId = taskDossierCible;
          } else if (taskDossierSection === 'equipe') {
            newDossierPayload.targetUserId = taskDossierCible;
          }
          
          const dossRes = await apiFetch(`/api/crm/dossiers`, 'POST', newDossierPayload);
          if (!dossRes.ok) {
            showToast("Erreur lors de la création du dossier.", "error");
            setIsSubmitting(false);
            return;
          }
          const dossData = await dossRes.json();
          finalDossierId = dossData.id;
        } else {
          if (!taskDossierId) {
            showToast("Veuillez sélectionner un dossier existant.", "error");
            setIsSubmitting(false);
            return;
          }
          finalDossierId = taskDossierId;
        }

        // Lier le message au dossier et marquer comme traité
        await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { dossierId: finalDossierId, status: 'TRAITE' });

      } else {
        // Interne reply
        let attachmentsArray = [];
        if (newTaskFile) {
          const uploadedName = await uploadFile(newTaskFile);
          if (uploadedName) attachmentsArray.push(uploadedName);
        }
        const finalAttachment = attachmentsArray.filter(Boolean).join(',') || null;

        const replyRes = await apiFetch(`/api/crm/messages/interne`, 'POST', {
            subType: `Réponse à ${processMsg.nomPrenom}`,
            objet: taskSubject,
            bodyText: taskDescription,
            attachment: finalAttachment,
            dossierId: processMsg.dossierId || null,
            missionId: processMsg.missionId || null
        });

        if (!replyRes.ok) {
          showToast("Erreur lors de l'envoi de la réponse.", "error");
          setIsSubmitting(false);
          return;
        }

        // Mark the original message as TRAITE
        await apiFetch(`/api/crm/messages/${encodeURIComponent(processMsg.id)}/status`, 'PATCH', { status: 'TRAITE' });
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
          <Pencil size={14} /> Traiter
        </button>
        <button type="button" className="dropdown-item danger" onClick={() => { setOpenMenuId(null); setDeleteMsg(m); }}>
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      {!isAnyModalOpen && (
      <>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
        <TabsNavigation 
          tabs={[
            { id: 'contact', label: 'Contact' },
            { id: 'recrutement', label: 'Recrutement' },
            { id: 'interne', label: 'Interne' },
            { id: 'personnel', label: 'Personnel' }
          ]} 
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
              <th style={{ width: '10%' }}>Statut</th>
              <th style={{ width: tab === 'interne' ? '15%' : '20%' }}>{tab === 'interne' ? 'Emetteur' : 'Nom'}</th>
              <th style={{ width: '20%' }}>{tab === 'recrutement' ? 'E-mail' : 'Email'}</th>
              <th style={{ width: '10%' }}>{tab === 'interne' ? 'Source' : 'Type'}</th>
              <th style={{ width: tab === 'interne' ? '15%' : '20%' }}>
                {tab === 'contact' ? 'Besoins' : tab === 'recrutement' ? 'Compétences' : tab === 'interne' ? 'ID' : 'Sujet'}
              </th>
              <th style={{ width: tab === 'interne' ? '15%' : '10%' }}>Date</th>
              <th style={{ width: tab === 'interne' ? '15%' : '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (loading) {
                return <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Chargement des messages...</td></tr>;
              }

              const renderMessageRow = (m, col2, col3, typeBadgeText, typeBadgeBg, typeBadgeColor, col5, col5Style) => (
                <tr key={m.id}>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                    }}>{m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase().replaceAll('_', " ")}</span>
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
                return messages.map(m => renderMessageRow(
                  m, m.nomPrenom, m.email,
                  m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier', '#E0E7FF', '#4F46E5',
                  m.contact?.typeBesoin || m.objet
                ));
              }

              if (tab === 'recrutement') {
                return messages.map(m => renderMessageRow(
                  m, m.nomPrenom, m.email,
                  m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier', '#FEF3C7', '#D97706',
                  m.recrutement?.competenceCle || m.objet
                ));
              }

              if (tab === 'interne') {
                return messages.map(m => renderMessageRow(
                  m, m.nomPrenom || 'Système', m.email || '-',
                  m.sourceType || m.subType || 'Interne', '#F1F5F9', '#64748B',
                  <span title={m.sourceRef || m.formulaireId || m.id}>{m.sourceRef || (m.formulaireId ? m.formulaireId.split('-')[0] : m.id)}</span>,
                  {color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "monospace"}
                ));
              }

              // Fallback
              return messages.map(m => renderMessageRow(
                m, m.nomPrenom, m.email,
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
      {processMsg && !createTaskModal && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setProcessMsg(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>
                {(() => {
                  if (tab === 'contact') return 'Détails du Contact';
                  if (tab === 'recrutement') return 'Détails de la Candidature';
                  return 'Détails du Message';
                })()}
              </h2>
            </div>
            
            {/* Fields for Contact */}
            {tab === 'contact' && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <DetailField label="Type de profil" value={extractFieldFromHtml(processMsg.bodyHtml, 'Type de client') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise (B2B)' : 'Particulier')} />
                <DetailField label="Nom complet" value={processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'} />
                <DetailField label="Email" value={processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'} />
                <DetailField label="Téléphone" value={processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'} />
                {processMsg.statusSubmitter === 'SOCIETE' && (
                  <DetailField label="Société" value={processMsg.raisonSocial || extractFieldFromHtml(processMsg.bodyHtml, 'Société') || 'Non renseigné'} />
                )}
                <div style={{gridColumn: processMsg.statusSubmitter === 'SOCIETE' ? 'span 1' : 'span 2'}}>
                  <DetailField label="Besoin" value={processMsg.contact?.typeBesoin || processMsg.objet || 'Non renseigné'} />
                </div>
              </div>
            )}


            {/* Fields for Recrutement */}
            {tab === 'recrutement' && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <DetailField label="Type de profil" value={extractFieldFromHtml(processMsg.bodyHtml, 'Type de profil') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise (B2B)' : 'Particulier')} />
                <DetailField label="Nom complet" value={processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'} />
                <DetailField label="Email" value={processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'} />
                <DetailField label="Téléphone" value={processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'} />
                <DetailField label="Compétences clés">
                  <div title={processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné'}>{processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné'}</div>
                </DetailField>
                <DetailField label="Années d'expérience" value={processMsg.recrutement?.anneeExperience || 'Non renseigné'} />
                <DetailField label="Langues" value={processMsg.recrutement?.langue || extractFieldFromHtml(processMsg.bodyHtml, 'Langues') || 'Non renseigné'} />
                <DetailField label="Lieu de résidence" value={processMsg.recrutement?.lieuResidence || extractFieldFromHtml(processMsg.bodyHtml, 'Localisation') || 'Non renseigné'} />
                <DetailField label="Disponibilité" value={extractFieldFromHtml(processMsg.bodyHtml, 'Disponibilité') || 'Non renseigné'} />
                <DetailField label="Profil LinkedIn">
                  {processMsg.recrutement?.lienLinkedin ? (
                    <a href={processMsg.recrutement.lienLinkedin} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                      {processMsg.recrutement.lienLinkedin}
                    </a>
                  ) : extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio') ? (
                    <a href={extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                      {extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')}
                    </a>
                  ) : 'Non renseigné'}
                </DetailField>
              </div>
            )}

            {/* Fields for Personnel and Interne */}
            {(tab === 'personnel' || tab === 'interne') && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <DetailField label="Nom" value={processMsg.nomPrenom || 'Non renseigné'} />
                  <DetailField label="Email" value={processMsg.email || 'Non renseigné'} />
                </div>
                <DetailField label="Objet" value={processMsg.objet || 'Aucun objet'} />
              </div>
            )}

            {/* Pièces jointes & Contenu */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem', minHeight: '300px'}}>
              {/* Left column: Actions / Pièces jointes */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="card" style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <span style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Date de réception</span>
                  <div style={{fontWeight: 600, fontSize: '1.1rem'}}>{formatDate(processMsg.createdAt || processMsg.date)} à {new Date(processMsg.createdAt || processMsg.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</div>
                </div>
                
                {tab !== 'recrutement' && (
                  <div className="card" style={{padding: '1.25rem', flex: 1}}>
                    <span style={{display: 'block', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Fichiers joints</span>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <AttachmentSelect 
                        files={[processMsg.cv, processMsg.attachment, processMsg.contact?.pieceJointe]} 
                        onPreview={setPreviewFile} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="card" style={{padding: '1.25rem', height: '100%'}}>
                <span style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>
                  {(() => {
                    if (tab === 'contact' || tab === 'recrutement') return 'Description / Contenu';
                    if (tab === 'personnel' || tab === 'interne') return 'Contenu du message';
                    return 'Message / Lettre de motivation';
                  })()}
                </span>
                <div style={{background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px', minHeight: '120px', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-main)', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: '1.5'}}>
                  {processMsg.description || processMsg.bodyText || (() => {
                    if (tab === 'recrutement') return extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations');
                    if (tab === 'contact') return extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin');
                    return null;
                  })()}
                  
                  {/* Ne rendre le HTML complet que pour les messages personnels ou internes, ou si on a absolument rien pu extraire pour contact/recrutement */}
                  {!processMsg.description && !processMsg.bodyText && tab !== 'recrutement' && tab !== 'contact' && processMsg.bodyHtml && (
                     <div dangerouslySetInnerHTML={{ __html: processMsg.bodyHtml }} />
                  )}
                  {!processMsg.description && !processMsg.bodyText && !extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations') && !extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin') && (!processMsg.bodyHtml || tab === 'contact' || tab === 'recrutement') && 'Aucun contenu.'}
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
              <button type="button" onClick={() => setProcessMsg(null)} className="btn btn-outline">Fermer</button>
              {tab === 'interne' ? (
                <button type="button" onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Répondre</button>
              ) : (
                <button type="button" onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer un Dossier</button>
              )}
              <button type="button" onClick={handleMarkAsProcessed} className="btn btn-primary">Marquer comme traité</button>
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
              <h3 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouvelle Mission'}</h3>
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
                  <div style={{display: 'flex', gap: '1.5rem', marginBottom: '0.75rem'}}>
                    <label htmlFor="dossierTypeNew" style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" id="dossierTypeNew" name="dossierType" value="new" checked={isNewDossier} onChange={() => setIsNewDossier(true)} />
                      {' '}Nouveau dossier
                    </label>
                    <label htmlFor="dossierTypeExisting" style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" id="dossierTypeExisting" name="dossierType" value="existing" checked={!isNewDossier} onChange={() => setIsNewDossier(false)} />
                      {' '}Dossier existant
                    </label>
                  </div>
                  {isNewDossier ? (
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
                  ) : (
                    <select value={taskDossierId} onChange={(e) => setTaskDossierId(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                      <option value="">Sélectionner un dossier...</option>
                      {dossiers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.client?.name || 'Sans client'})</option>
                      ))}
                    </select>
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
              <button type="button" onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); setIncludeAttachedFile(false); }} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
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