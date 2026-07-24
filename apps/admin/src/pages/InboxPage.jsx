import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

  const extractFieldFromHtml = (html, fieldName) => {
    if (!html) return null;
    // Tente l'ancien format : <strong>Champ</strong> : <span>Valeur</span>
    let regex = new RegExp(`>\\s*${fieldName}\\s*<\\/strong>\\s*:\\s*<span[^>]*>([\\s\\S]*?)<\\/span>`, 'i');
    let match = html.match(regex);
    if (!match) {
      // Tente le nouveau format : <strong>Champ</strong> <div...>Valeur</div>
      regex = new RegExp(`>\\s*${fieldName}\\s*<\\/strong>\\s*<div[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
      match = html.match(regex);
    }
    if (match && match[1]) {
      return match[1].replace(/<[^>]*>?/gm, '').trim();
    }
    return null;
  };

const extractBlockFromHtml = (html, blockName) => {
  if (!html) return null;
  const regex = new RegExp(`>\\s*${blockName}\\s*<\\/strong>\\s*<div[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
  const match = html.match(regex);
  if (match && match[1]) {
    return match[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
};

const InboxPage = () => {
  const [tab, setTab] = useState('contact');
  const [filterTraite, setFilterTraite] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [dossiers, setDossiers] = useState([]);
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

  const filterFn = (m) => {
    const isProcessed = m.status === 'TERMINE' || m.status === 'ARCHIVE';
    const statusMatch = filterTraite === 'all' ? true : filterTraite === 'traite' ? isProcessed === true : isProcessed !== true;
    if (!statusMatch) return false;
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const nameMatch = (m.nomPrenom || '').toLowerCase().includes(term);
    const emailMatch = (m.email || '').toLowerCase().includes(term);
    return nameMatch || emailMatch;
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      const [resMsgs, resUsers, resDossiers] = await Promise.all([
        fetch(`${apiUrl}/api/crm/messages?type=${tab}&page=${page}&limit=6&status=${filterTraite}&search=${encodeURIComponent(searchQuery)}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/crm/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/crm/dossiers?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } })
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

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const handleCreateTask = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      let finalDossierId = null;
      if (tab !== 'interne') {
        if (isNewDossier) {
          if (!taskNewDossierName.trim()) {
            showToast("Veuillez saisir le nom du nouveau dossier.", "error");
            setIsSubmitting(false);
            return;
          }
          const dossRes = await fetch(`${apiUrl}/api/crm/dossiers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: taskNewDossierName, description: 'Créé depuis la messagerie', origin: tab.toUpperCase() })
          });
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
      }

      if (tab !== 'interne') {
        if (!taskEcheance) {
          showToast("Veuillez définir une échéance pour la mission.", "error");
          setIsSubmitting(false);
          return;
        }

        const taskRes = await fetch(`${apiUrl}/api/crm/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            description: `${taskSubject}\n\n${taskDescription}`,
            assignedToId: taskAssignedToId || null,
            dossierId: finalDossierId,
            echeance: taskEcheance
          })
        });

        if (!taskRes.ok) {
          showToast("Erreur lors de la création de la mission.", "error");
          setIsSubmitting(false);
          return;
        }
      }

      showToast(tab === 'interne' ? 'Réponse envoyée avec succès !' : 'Mission créée et assignée avec succès !', 'success');
      setCreateTaskModal(false);
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

  const handleSyncEmails = async () => {
    try {
      setIsSyncing(true);
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      const res = await fetch(`${apiUrl}/api/crm/messages/sync-imap`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      const res = await fetch(`${apiUrl}/api/crm/messages/${deleteMsg.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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
    if (openMenuId !== m.id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setOpenMenuId(null); setProcessMsg(m); }}>
          <Pencil size={14} /> Traiter
        </button>
        <button className="dropdown-item danger" onClick={() => { setOpenMenuId(null); setDeleteMsg(m); }}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      {!isAnyModalOpen && (
      <>
      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem', width: '100%'}}>
          {['contact', 'recrutement', 'interne', 'personnel'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)} 
              style={{
                flex: 1,
                background: tab === t ? 'var(--primary)' : 'transparent', 
                color: tab === t ? '#FFF' : 'var(--text-muted)', 
                border: tab === t ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', fontSize: '1.05rem', textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
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
            <button 
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
            {tab === 'contact' ? (
              <tr>
                <th style={{ width: '10%' }}>Statut</th>
                <th style={{ width: '20%' }}>Nom</th>
                <th style={{ width: '20%' }}>Email</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '20%' }}>Besoins</th>
                <th style={{ width: '10%' }}>Date</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            ) : tab === 'recrutement' ? (
              <tr>
                <th style={{ width: '10%' }}>Statut</th>
                <th style={{ width: '20%' }}>Nom</th>
                <th style={{ width: '20%' }}>E-mail</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '20%' }}>Compétences</th>
                <th style={{ width: '10%' }}>Date</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            ) : (
              <tr>
                <th style={{ width: '10%' }}>Statut</th>
                <th style={{ width: '20%' }}>Nom</th>
                <th style={{ width: '20%' }}>E-mail</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '20%' }}>Sujet</th>
                <th style={{ width: '10%' }}>Date</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Chargement des messages...</td></tr>
            ) : tab === 'contact' ? messages.map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>{m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase().replace(/_/g, " ")}</span>
                </td>
                <td>
                  <strong className="truncate-name" style={{fontSize: "0.875rem"}}>{m.nomPrenom}</strong>
                </td>
                <td>
                  <span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{m.email}</span>
                </td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#E0E7FF',
                    color: '#4F46E5'
                  }}>
                    {m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier'}
                  </span>
                </td>
                <td><span className="truncate-text" style={{fontSize: "0.875rem"}}>{m.contact?.typeBesoin || m.objet}</span></td>
                <td style={{color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            )) : tab === 'recrutement' ? messages.map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>{m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase().replace(/_/g, " ")}</span>
                </td>
                <td><strong className="truncate-name" style={{fontSize: "0.875rem"}}>{m.nomPrenom}</strong></td>
                <td><span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{m.email}</span></td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#FEF3C7',
                    color: '#D97706'
                  }}>
                    {m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier'}
                  </span>
                </td>
                <td><span className="truncate-text" style={{fontSize: "0.875rem"}}>{m.recrutement?.competenceCle || m.objet}</span></td>
                <td style={{color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "0.875rem"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            )) : messages.map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>{m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase().replace(/_/g, " ")}</span>
                </td>
                <td>
                  <strong className="truncate-name" style={{fontSize: "0.875rem"}}>{m.nomPrenom}</strong>
                </td>
                <td>
                  <span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{m.email}</span>
                </td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#F1F5F9',
                    color: '#64748B'
                  }}>
                    {m.subType || 'Indéfini'}
                  </span>
                </td>
                <td><div className="truncate-text" style={{fontWeight: m.status === "NOUVEAU" ? 600 : 400, fontSize: "0.875rem"}}>{m.objet}</div></td>
                <td style={{color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap"}}>{new Date(m.createdAt).toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                    <div style={{position: 'relative'}}>
                      <button onClick={(e) => toggleMenu(e, m.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                        <MoreVertical size={16} />
                      </button>
                      {renderDropdown(m)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
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
      </>
      )}

      {/* Modal Traiter Demande */}
      {processMsg && !createTaskModal && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>
                {tab === 'contact' ? 'Détails du Contact' : tab === 'recrutement' ? 'Détails de la Candidature' : 'Détails du Message'}
              </h2>
              <button onClick={() => setProcessMsg(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            {/* Fields for Contact */}
            {tab === 'contact' && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Type de profil</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{extractFieldFromHtml(processMsg.bodyHtml, 'Type de client') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise (B2B)' : 'Particulier')}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'}</div>
                </div>
                {processMsg.statusSubmitter === 'SOCIETE' && (
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Société</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.raisonSocial || extractFieldFromHtml(processMsg.bodyHtml, 'Société') || 'Non renseigné'}</div>
                  </div>
                )}
                <div style={{gridColumn: processMsg.statusSubmitter === 'SOCIETE' ? 'span 1' : 'span 2'}}>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Besoin</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.contact?.typeBesoin || processMsg.objet || 'Non renseigné'}</div>
                </div>
              </div>
            )}

            {/* Fields for Recrutement */}
            {tab === 'recrutement' && (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Type de profil</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{extractFieldFromHtml(processMsg.bodyHtml, 'Type de profil') || (processMsg.statusSubmitter === 'SOCIETE' ? 'Entreprise (B2B)' : 'Particulier')}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.nomPrenom || extractFieldFromHtml(processMsg.bodyHtml, 'Nom complet') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.email || extractFieldFromHtml(processMsg.bodyHtml, 'Email') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.telephone || extractFieldFromHtml(processMsg.bodyHtml, 'Téléphone') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Compétences clés</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné'}>{processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Années d'expérience</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.anneeExperience || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Langues</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.langue || extractFieldFromHtml(processMsg.bodyHtml, 'Langues') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Lieu de résidence</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.lieuResidence || extractFieldFromHtml(processMsg.bodyHtml, 'Localisation') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Disponibilité</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{extractFieldFromHtml(processMsg.bodyHtml, 'Disponibilité') || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Profil LinkedIn</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {processMsg.recrutement?.lienLinkedin ? (
                      <a href={processMsg.recrutement.lienLinkedin} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                        {processMsg.recrutement.lienLinkedin}
                      </a>
                    ) : extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio') ? (
                      <a href={extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                        {extractFieldFromHtml(processMsg.bodyHtml, 'LinkedIn / Portfolio')}
                      </a>
                    ) : 'Non renseigné'}
                  </div>
                </div>
              </div>
            )}

            {/* Fields for Personnel and Interne */}
            {(tab === 'personnel' || tab === 'interne') && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.nomPrenom || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.email || 'Non renseigné'}</div>
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Objet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.objet || 'Aucun objet'}</div>
                </div>
              </div>
            )}

            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {tab !== 'recrutement' && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Fichiers joints</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    {(processMsg.cv || processMsg.attachment || processMsg.contact?.pieceJointe) ? (
                      <select 
                        onChange={(e) => { if(e.target.value) setPreviewFile(e.target.value); e.target.selectedIndex = 0; }}
                        style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', width: '100%', background: '#FFF', cursor: 'pointer'}}
                      >
                        <option value="">-- Sélectionner un fichier pour l'ouvrir --</option>
                        {processMsg.cv && <option value={processMsg.cv}>{processMsg.cv}</option>}
                        {processMsg.contact?.pieceJointe && <option value={processMsg.contact.pieceJointe}>{processMsg.contact.pieceJointe}</option>}
                        {processMsg.attachment && String(processMsg.attachment).split(',').map(f => f.trim()).filter(f => f).map(f => (
                           <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>Aucun fichier</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>{tab === 'contact' || tab === 'recrutement' ? 'Description / Contenu' : tab === 'personnel' || tab === 'interne' ? 'Contenu du message' : 'Message / Lettre de motivation'}</label>
                <div style={{width: '100%', padding: '0.75rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '100px', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                  {processMsg.description || processMsg.bodyText || (tab === 'recrutement' ? extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations') : (tab === 'contact' ? extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin') : null))}
                  
                  {/* Ne rendre le HTML complet que pour les messages personnels ou internes, ou si on a absolument rien pu extraire pour contact/recrutement */}
                  {!processMsg.description && !processMsg.bodyText && tab !== 'recrutement' && tab !== 'contact' && processMsg.bodyHtml && (
                     <div dangerouslySetInnerHTML={{ __html: processMsg.bodyHtml }} />
                  )}
                  {!processMsg.description && !processMsg.bodyText && !extractBlockFromHtml(processMsg.bodyHtml, 'Message / Motivations') && !extractBlockFromHtml(processMsg.bodyHtml, 'Description du besoin') && (!processMsg.bodyHtml || tab === 'contact' || tab === 'recrutement') && 'Aucun contenu.'}
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
              <button onClick={() => setProcessMsg(null)} className="btn btn-outline">Fermer</button>
              {tab === 'interne' ? (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Répondre</button>
              ) : (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer une mission</button>
              )}
              <button onClick={() => setProcessMsg(null)} className="btn btn-primary">Marquer comme traité</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createTaskModal && (
        <div className="fade-in" style={{width: '100%', padding: '0'}}>
          <div className="" style={{width: '100%', padding: '0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouvelle Mission'}</h3>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Objet de la réponse' : 'Objet'}</label>
                <input type="text" value={taskSubject} onChange={(e) => setTaskSubject(e.target.value)} placeholder={tab === 'interne' ? "Sujet..." : "Sujet de la mission..."} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Destinataire' : 'Assigner à'}</label>
                <div style={{display: 'grid', gridTemplateColumns: tab === 'interne' ? '1fr' : '1fr 1fr', gap: '1rem'}}>
                  <select value={taskAssignedToId} onChange={(e) => setTaskAssignedToId(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                    <option value="">Sélectionner un collaborateur...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role?.name || u.role || 'SANS ROLE'})</option>
                    ))}
                  </select>
                  {tab !== 'interne' && (
                    <div>
                      <input 
                        type="date" 
                        value={taskEcheance} 
                        onChange={(e) => setTaskEcheance(e.target.value)} 
                        className="input-field" 
                        style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}} 
                        title="Échéance de la mission"
                      />
                    </div>
                  )}
                </div>
              </div>

              {tab !== 'interne' && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Dossier associé</label>
                  <div style={{display: 'flex', gap: '1.5rem', marginBottom: '0.75rem'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" name="dossierType" value="new" checked={isNewDossier} onChange={() => setIsNewDossier(true)} />
                      Nouveau dossier
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer'}}>
                      <input type="radio" name="dossierType" value="existing" checked={!isNewDossier} onChange={() => setIsNewDossier(false)} />
                      Dossier existant
                    </label>
                  </div>
                  {isNewDossier ? (
                    <input type="text" value={taskNewDossierName} onChange={(e) => setTaskNewDossierName(e.target.value)} placeholder="Nom du nouveau dossier..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
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

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Pièces jointes</label>
                <div style={{background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                  {(processMsg?.cv || processMsg?.attachment) && (
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem'}}>
                      <input type="checkbox" defaultChecked />
                      <span style={{fontSize: '0.875rem', color: 'var(--text-main)'}}>Inclure le fichier lié ({processMsg.cv || processMsg.attachment})</span>
                    </label>
                  )}
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginBottom: 0}}>
                    <Files size={16} />
                    <span style={{fontSize: '0.875rem', fontWeight: 500}}>
                      {newTaskFile ? newTaskFile.name : 'Joindre un autre fichier...'}
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

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Message' : 'Message / Consignes'}</label>
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder={tab === 'interne' ? "Votre réponse..." : "Détails de la mission à effectuer..."} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
              <button onClick={handleCreateTask} disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Traitement...' : (tab === 'interne' ? 'Envoyer' : 'Créer la mission')}</button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
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
                  <object 
                    data={previewBlobUrl}
                    type="application/pdf"
                    style={{width: '100%', height: '100%', border: 'none'}}
                  >
                    <p>Votre navigateur ne supporte pas l'affichage direct des PDF. <a href={previewBlobUrl} target="_blank" rel="noopener noreferrer">Téléchargez-le ici</a>.</p>
                  </object>
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
              <button className="btn btn-outline" onClick={() => setDeleteMsg(null)}>Annuler</button>
              <button className="btn btn-primary" style={{backgroundColor: '#DC2626', borderColor: '#DC2626'}} onClick={confirmDelete}>Supprimer</button>
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