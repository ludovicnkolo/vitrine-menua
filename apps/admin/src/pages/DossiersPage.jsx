import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Pencil, Eye, Trash, MessageSquare } from 'lucide-react';
import { getSafeApiUrl } from '../utils/helpers';
import ActionDropdown from '../components/ActionDropdown';
import { getStatusBadge } from '../utils/helpers';
import SmsModal from '../components/SmsModal';
import PaginationControls from '../components/PaginationControls';
import ReadOnlyField from '../components/ReadOnlyField';
import TaskConsultModal from '../components/TaskConsultModal';


const DossiersPage = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [consultDossier, setConsultDossier] = useState(null);
  const [editDossier, setEditDossier] = useState(null);
  const [localConsultTask, setLocalConsultTask] = useState(null);
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
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);
  
  const menuRef = useRef(null);

  // States for real API data
  const [dbDossiers, setDbDossiers] = useState([]);
  const [dbTasks, setDbTasks] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDossiers = () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    
    const urlDossiers = new URL(getSafeApiUrl('/api/crm/dossiers'));
    urlDossiers.searchParams.set('page', page);
    urlDossiers.searchParams.set('limit', 4);
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
      fetch(getSafeApiUrl('/api/crm/users'), { headers }).then(res => res.json()).catch(() => ([]))
    ]).then(([dossiersRes, tasksRes, usersRes]) => {
      setDbDossiers(dossiersRes?.data || (Array.isArray(dossiersRes) ? dossiersRes : []));
      setTotalPages(dossiersRes?.totalPages || 1);
      setDbTasks(tasksRes?.data || (Array.isArray(tasksRes) ? tasksRes : []));
      setDbUsers(Array.isArray(usersRes) ? usersRes : []);
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
      alert("Veuillez remplir l'objet, le destinataire et l'échéance.");
      return;
    }
    
    setIsSubmittingMission(true);
    const token = localStorage.getItem('adminToken');
    
    try {
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
        })
      });
      
      if (res.ok) {
        alert("Mission créée avec succès !");
        setCreateMissionModal(false);
        setMissionSubject('');
        setMissionDescription('');
        setMissionAssignedTo('');
        setMissionEcheance('');
        fetchDossiers();
      } else {
        alert("Erreur lors de la création de la mission.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau");
    } finally {
      setIsSubmittingMission(false);
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
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
      <div>
        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Nom du dossier</label>
        {isEdit ? (
          <input type="text" defaultValue={dossier.name} className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--primary)', background: '#FFF', color: 'var(--text-main)'}} />
        ) : (
          <input type="text" value={dossier.name || ''} readOnly className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', color: 'var(--text-main)'}} />
        )}
      </div>
      <ReadOnlyField label="Origine" value={dossier.origin || 'INTERNE'} />
      <ReadOnlyField label="Créé par" value={dossier.createdBy?.name || 'Inconnu'} />
      <ReadOnlyField label="Rôle du créateur" value={dossier.createdBy?.role?.name || '-'} />
      <ReadOnlyField label="Date de création" value={new Date(dossier.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})} />
      <div>
        <span style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Statut</span>
        <div style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#F8FAFC', display: 'flex', alignItems: 'center', height: '44px'}}>
           {getStatusBadge(dossier.status)}
        </div>
      </div>
    </div>
  );

  const renderAssociatedTasks = (tasks, isEdit) => (
    <div style={{marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
      <h4 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>
        {isEdit ? 'Gérer les missions associées' : 'Missions associées'}
      </h4>
      {tasks.length > 0 ? (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {tasks.map(task => (
            <button type="button" key={task.id} onClick={() => setLocalConsultTask(task)} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s', width: '100%', textAlign: 'left', fontFamily: 'inherit'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                <strong className="truncate-text" style={{fontSize: '0.875rem'}}>{task.subject || `Mission ${task.reference || task.id}`}</strong>
                <span style={{display: 'flex', alignItems: 'center'}}>{getStatusBadge(task.status)}</span>
              </div>
              {isEdit && (
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); alert(`Mission ${task.id} supprimée avec succès !`); }} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)'}} title="Supprimer la mission">
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



  if (consultDossier) {
    const associatedTasks = dbTasks.filter(t => t.dossierId === consultDossier.id);
    
    return (
      <div className="fade-in" style={{width: "100%", padding: "0"}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter le Dossier: {consultDossier.reference || consultDossier.id}</h2>
        </div>

        {renderDossierFields(consultDossier, false)}
        {renderAssociatedTasks(associatedTasks, false)}

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '1rem'}}>
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


        {createMissionModal && (
          <div className="fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div style={{background: '#FFF', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600}}>Nouvelle Mission</h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem'}}>Objet de la mission</label>
                  <input type="text" value={missionSubject} onChange={(e) => setMissionSubject(e.target.value)} placeholder="Sujet..." className="input-field" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)'}} />
                </div>
                
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
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
                <button type="button" onClick={() => setCreateMissionModal(false)} className="btn btn-outline" disabled={isSubmittingMission}>Annuler</button>
                <button type="button" onClick={handleCreateMission} disabled={isSubmittingMission} className="btn btn-primary">{isSubmittingMission ? 'Création...' : 'Créer la mission'}</button>
              </div>
            </div>
          </div>
        )}

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
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>← Retour aux dossiers</button>
          <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier le Dossier: {editDossier.reference || editDossier.id}</h2>
        </div>

        {renderDossierFields(editDossier, true)}
        {renderAssociatedTasks(associatedTasks, true)}

        <div style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button type="button" onClick={() => setEditDossier(null)} className="btn btn-outline">Annuler</button>
          <button type="button" onClick={() => { setEditDossier(null); alert('Dossier modifié avec succès !'); }} className="btn btn-primary">Enregistrer</button>
        </div>

        <TaskConsultModal task={localConsultTask} onClose={() => setLocalConsultTask(null)} titlePrefix="Consulter la Mission:" />
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
              <th>ID</th>
              <th>Nom du dossier</th>
              <th>Origine</th>
              <th>Créé par</th>
              <th>Statut</th>
              <th>Rôle</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Chargement des dossiers...</td></tr>
            ) : dbDossiers.map(d => {
              const dOrigin = d.origin || 'INTERNE';
              const dCreatorName = d.createdBy?.name || 'Inconnu';
              const dCreatorRole = d.createdBy?.role?.name || '-';
              return (
              <tr key={d.id}>
                <td><div className="truncate-text" style={{fontWeight: 500}}>{d.reference || d.id}</div></td>
                <td><strong className="truncate-name" style={{color: 'var(--text-main)'}}>{d.name}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'capitalize'}}>{dOrigin}</span></td>
                <td><div className="truncate-text">{dCreatorName}</div></td>
                <td><div className="truncate-text">{getStatusBadge(d.status)}</div></td>
                <td>
                  <span style={{padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, background: dCreatorRole === 'ADMIN' ? '#EFF6FF' : '#F5F3FF', color: dCreatorRole === 'ADMIN' ? '#2563EB' : '#7C3AED'}}>
                    {dCreatorRole}
                  </span>
                </td>
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
    </div>
  )
}

export default DossiersPage;