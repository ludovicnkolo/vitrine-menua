import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const InboxPage = () => {
  const [tab, setTab] = useState('contact');
  const [filterTraite, setFilterTraite] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processMsg, setProcessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [isNewDossier, setIsNewDossier] = useState(true);

  // Form states
  const [taskSubject, setTaskSubject] = useState('');
  const [taskAssignedToId, setTaskAssignedToId] = useState('');
  const [taskNewDossierName, setTaskNewDossierName] = useState('');
  const [taskDossierId, setTaskDossierId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const menuRef = useRef(null);
  const isAnyModalOpen = processMsg || createTaskModal;

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
        
        const [resMsgs, resUsers, resDossiers] = await Promise.all([
          fetch(`${apiUrl}/api/crm/messages`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/crm/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/crm/dossiers`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (resMsgs.ok) {
          setMessages(await resMsgs.json());
        } else if (resMsgs.status === 401 || resMsgs.status === 403) {
          alert('Votre session a expiré. Veuillez vous reconnecter.');
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
        }
        
        if (resUsers.ok) setUsers(await resUsers.json());
        if (resDossiers.ok) setDossiers(await resDossiers.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

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

  const handleCreateTask = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
      
      let finalDossierId = null;
      if (tab !== 'interne') {
        if (isNewDossier) {
          if (!taskNewDossierName.trim()) {
            alert("Veuillez saisir le nom du nouveau dossier.");
            setIsSubmitting(false);
            return;
          }
          const dossRes = await fetch(`${apiUrl}/api/crm/dossiers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: taskNewDossierName, description: 'Créé depuis la messagerie', origin: tab.toUpperCase() })
          });
          if (!dossRes.ok) {
            alert("Erreur lors de la création du dossier.");
            setIsSubmitting(false);
            return;
          }
          const dossData = await dossRes.json();
          finalDossierId = dossData.id;
        } else {
          if (!taskDossierId) {
            alert("Veuillez sélectionner un dossier existant.");
            setIsSubmitting(false);
            return;
          }
          finalDossierId = taskDossierId;
        }
      }

      if (tab !== 'interne') {
        const taskRes = await fetch(`${apiUrl}/api/crm/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            description: `${taskSubject}\n\n${taskDescription}`,
            assignedToId: taskAssignedToId || null,
            dossierId: finalDossierId
          })
        });

        if (!taskRes.ok) {
          alert("Erreur lors de la création de la tâche.");
          setIsSubmitting(false);
          return;
        }
      }

      alert(tab === 'interne' ? 'Réponse envoyée avec succès !' : 'Tâche créée et assignée avec succès !');
      setCreateTaskModal(false);
      setProcessMsg(null);
      setNewTaskFile(null);
      setTaskSubject('');
      setTaskDescription('');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
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
        <button className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
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
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            {tab === 'contact' ? (
              <tr>
                <th>Statut</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Type</th>
                <th>Besoins</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            ) : tab === 'recrutement' ? (
              <tr>
                <th>Statut</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Type</th>
                <th>Compétences</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            ) : (
              <tr>
                <th>Statut</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Sujet</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Chargement des messages...</td></tr>
            ) : tab === 'contact' ? messages.filter(m => m.type === 'CONTACT').filter(filterFn).map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <strong style={{display: 'block', fontSize: '0.875rem'}}>{m.nomPrenom}</strong>
                </td>
                <td>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.email}</span>
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
                <td><span style={{fontSize: '0.875rem'}}>{m.contact?.typeBesoin || m.objet}</span></td>
                <td style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{new Date(m.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
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
            )) : tab === 'recrutement' ? messages.filter(m => m.type === 'RECRUTEMENT').filter(filterFn).map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td><strong style={{display: 'block', fontSize: '0.875rem'}}>{m.nomPrenom}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.email}</span></td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: '#FEF3C7',
                    color: '#D97706'
                  }}>
                    {m.statusSubmitter === 'SOCIETE' ? 'Entreprise' : 'Particulier'}
                  </span>
                </td>
                <td><span style={{fontSize: '0.875rem'}}>{m.recrutement?.competenceCle || m.objet}</span></td>
                <td style={{color: 'var(--text-muted)'}}>{new Date(m.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
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
            )) : messages.filter(m => m.type === tab.toUpperCase()).filter(filterFn).map(m => (
              <tr key={m.id}>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: m.status === 'NOUVEAU' ? '#FEE2E2' : '#F1F5F9', color: m.status === 'NOUVEAU' ? '#DC2626' : '#475569'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <strong style={{display: 'block', fontSize: '0.875rem'}}>{m.nomPrenom}</strong>
                </td>
                <td>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.email}</span>
                </td>
                <td style={{fontWeight: m.status === 'NOUVEAU' ? 600 : 400, fontSize: '0.875rem'}}>{m.objet}</td>
                <td style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{new Date(m.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
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
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
              
              {tab !== 'personnel' && tab !== 'interne' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.telephone || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Date de soumission</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{new Date(processMsg.createdAt).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              )}

              {(tab === 'contact' || tab === 'recrutement') && processMsg.statusSubmitter === 'SOCIETE' && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de la société</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.raisonSocial || 'Non renseigné'}</div>
                </div>
              )}

              {tab !== 'contact' && tab !== 'recrutement' && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Objet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.objet || 'Aucun objet'}</div>
                </div>
              )}

              {tab === 'contact' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.status}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Besoin</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.contact?.typeBesoin || processMsg.objet || 'Non renseigné'}</div>
                  </div>
                </div>
              )}

              {tab === 'recrutement' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Compétences clés</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.competenceCle || processMsg.objet || 'Non renseigné'}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Années d'expérience</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.anneeExperience || 'Non renseigné'}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Langues</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.langue || 'Non renseigné'}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Lieu de résidence</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{processMsg.recrutement?.lieuResidence || 'Non renseigné'}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Profil LinkedIn / Portfolio</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>
                      {processMsg.recrutement?.lienLinkedin ? (
                        <a href={processMsg.recrutement.lienLinkedin} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>
                          {processMsg.recrutement.lienLinkedin}
                        </a>
                      ) : 'Non renseigné'}
                    </div>
                  </div>
                </div>
              )}

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

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>{tab === 'contact' || tab === 'recrutement' ? 'Description / Contenu' : tab === 'personnel' || tab === 'interne' ? 'Contenu du message' : 'Message / Lettre de motivation'}</label>
                <div style={{width: '100%', padding: '0.75rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '100px', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                  {processMsg.description || processMsg.bodyText}
                  {!processMsg.description && !processMsg.bodyText && processMsg.bodyHtml && (
                     <div dangerouslySetInnerHTML={{ __html: processMsg.bodyHtml }} />
                  )}
                  {!processMsg.description && !processMsg.bodyText && !processMsg.bodyHtml && 'Aucun contenu.'}
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
              <button onClick={() => setProcessMsg(null)} className="btn btn-outline">Fermer</button>
              {tab === 'interne' ? (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Répondre</button>
              ) : (
                <button onClick={() => setCreateTaskModal(true)} className="btn btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Créer une tâche</button>
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
              <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 600}}>{tab === 'interne' ? 'Répondre au message' : 'Nouvelle Tâche'}</h3>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Objet de la réponse' : 'Objet'}</label>
                <input type="text" value={taskSubject} onChange={(e) => setTaskSubject(e.target.value)} placeholder={tab === 'interne' ? "Sujet..." : "Sujet de la tâche..."} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>{tab === 'interne' ? 'Destinataire' : 'Assigner à'}</label>
                <select value={taskAssignedToId} onChange={(e) => setTaskAssignedToId(e.target.value)} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#FFF'}}>
                  <option value="">Sélectionner un collaborateur...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
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
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder={tab === 'interne' ? "Votre réponse..." : "Détails de la tâche à effectuer..."} style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem'}}>
              <button onClick={() => { setCreateTaskModal(false); setNewTaskFile(null); }} className="btn btn-outline" disabled={isSubmitting}>Annuler</button>
              <button onClick={handleCreateTask} disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Traitement...' : (tab === 'interne' ? 'Envoyer' : 'Créer la tâche')}</button>
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
              {/* Fake Document Content */}
              <div style={{width: '100%', maxWidth: '800px', height: '100%', background: '#FFF', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '3rem', overflowY: 'auto'}}>
                <div style={{width: '30%', height: '20px', background: '#CBD5E1', marginBottom: '2rem', borderRadius: '4px'}}></div>
                <div style={{width: '100%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '90%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '95%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '85%', height: '12px', background: '#F1F5F9', marginBottom: '2rem', borderRadius: '2px'}}></div>
                <div style={{width: '40%', height: '16px', background: '#CBD5E1', marginBottom: '1.5rem', borderRadius: '4px'}}></div>
                <div style={{width: '100%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{width: '92%', height: '12px', background: '#F1F5F9', marginBottom: '0.75rem', borderRadius: '2px'}}></div>
                <div style={{display: 'flex', justifyContent: 'center', margin: '3rem 0'}}>
                  <div style={{padding: '1rem 2rem', border: '2px dashed #CBD5E1', color: '#94A3B8', fontWeight: 500, borderRadius: '8px'}}>
                    Document scanné / PDF original affiché ici ({previewFile})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default InboxPage;