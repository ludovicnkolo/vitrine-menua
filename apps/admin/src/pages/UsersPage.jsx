import { getSafeApiUrl, uploadFile, formatDate } from '../utils/helpers';
import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, Search, Mail, MessageSquare, Pencil, Eye, Trash, Shield, Download, File, Loader
} from 'lucide-react';
import ActionDropdown from '../components/ActionDropdown';
import UserFormFields from '../components/UserFormFields';
import ClientFormFields from '../components/ClientFormFields';
import { getStatusBadge, getRoleBadge } from '../utils/helpers';

const UsersPage = ({ forceTab }) => {
  const [tab, setTab] = useState(forceTab || 'interne');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [consultUser, setConsultUser] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalType, setExternalType] = useState('Particulier');
  const [consultExternal, setConsultExternal] = useState(null);
  const [editExternal, setEditExternal] = useState(null);
  const menuRef = useRef(null);

  const renderReadOnlyField = (label, value) => (
    <div>
      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>{label}</label>
      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{value || ''}</div>
    </div>
  );
  
  // Real API states
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setRawErrorMsg] = useState(null);
  const setErrorMsg = (msg) => {
    setRawErrorMsg(msg);
    if (msg) setTimeout(() => setRawErrorMsg(null), 3000);
  };
  const [newUser, setNewUser] = useState({ name: '', email: '', telephone: '', roleId: '', lieuResidence: '', experienceCle: '', status: 'Inactif', langues: '', profile: '' });
  const [newClient, setNewClient] = useState({ name: '', email: '', telephone: '', contactSecondaire: '', secteurActivite: '', description: '', siret: '', raisonSociale: '', emailEntreprise: '', telephoneEntreprise: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [rolesList, setRolesList] = useState([]);


  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const [rUsers, rClients, rRoles] = await Promise.all([
        fetch(getSafeApiUrl('/api/crm/users'), { headers }).then(r=>r.json()).catch(()=>[]),
        fetch(getSafeApiUrl('/api/crm/clients'), { headers }).then(r=>r.json()).catch(()=>[]),
        fetch(getSafeApiUrl('/api/crm/roles'), { headers }).then(r=>r.json()).catch(()=>[])
      ]);
      setUsers(Array.isArray(rUsers) ? rUsers : []);
      setClients(Array.isArray(rClients) ? rClients : []);
      setRolesList(Array.isArray(rRoles) ? rRoles : []);
    } catch(e) {}
  };

  useEffect(() => { fetchData(); }, []);
  const submitApiRequest = async (url, method, payload, onSuccess, errorText) => {
    setLoading(true); setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile, 'users_id_cards');
      const res = await fetch(getSafeApiUrl(url), {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sessionStorage.getItem('adminToken') },
        body: JSON.stringify(uploadedUrl ? { ...payload, idCardUrl: uploadedUrl } : payload)
      });
      if (res.ok) { onSuccess(); setSelectedFile(null); fetchData(); }
      else {
        // Read the actual API error message
        try {
          const errData = await res.json();
          setErrorMsg(errData.error || errorText);
        } catch(e) {
          setErrorMsg(errorText);
        }
      }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return setErrorMsg('Veuillez remplir le nom et l\'email au minimum.');
    await submitApiRequest('/api/crm/users', 'POST', { ...newUser, lastLogin: 'Jamais connecté' }, () => {
      setShowModal(false); setNewUser({ name: '', email: '', telephone: '', roleId: '', lieuResidence: '', experienceCle: '', status: 'Inactif', langues: '', profile: '' });
    }, 'Erreur lors de la création');
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return setErrorMsg('Veuillez remplir le nom et l\'email au minimum.');
    await submitApiRequest('/api/crm/clients', 'POST', { ...newClient, type: externalType, status: newClient.status || 'Actif' }, () => {
      setShowExternalModal(false); setNewClient({ name: '', email: '', telephone: '', contactSecondaire: '', secteurActivite: '', description: '', siret: '', raisonSociale: '', emailEntreprise: '', telephoneEntreprise: '' });
    }, 'Erreur lors de la création');
  };
  
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce membre interne ?')) return;
    try {
      const res = await fetch(getSafeApiUrl(`/api/crm/users/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('adminToken') }
      });
      if (res.ok) fetchData();
    } catch(e) { console.error(e); }
    setOpenMenuId(null);
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce membre externe ?')) return;
    try {
      const res = await fetch(getSafeApiUrl(`/api/crm/clients/${encodeURIComponent(id)}`), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('adminToken') }
      });
      if (res.ok) fetchData();
    } catch(e) { console.error(e); }
    setOpenMenuId(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await submitApiRequest(`/api/crm/users/${encodeURIComponent(editUser.id)}`, 'PATCH', {
      name: editUser.name, email: editUser.email, roleId: editUser.roleId, profile: editUser.profile,
      status: editUser.isBlocked ? 'Inactif' : 'Actif', telephone: editUser.telephone, lieuResidence: editUser.lieuResidence,
      experienceCle: editUser.experienceCle, langues: editUser.langues
    }, () => setEditUser(null), 'Erreur lors de la modification');
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    await submitApiRequest(`/api/crm/clients/${encodeURIComponent(editExternal.id)}`, 'PATCH', {
      name: editExternal.name, email: editExternal.email, telephone: editExternal.telephone, contactSecondaire: editExternal.contactSecondaire,
      secteurActivite: editExternal.secteurActivite, description: editExternal.description, type: editExternal.type, siret: editExternal.siret,
      raisonSociale: editExternal.raisonSociale, emailEntreprise: editExternal.emailEntreprise, telephoneEntreprise: editExternal.telephoneEntreprise,
      status: editExternal.status
    }, () => setEditExternal(null), 'Erreur lors de la modification');
  };

  const isAnyModalOpen =
 showModal || showExternalModal || editUser || editExternal || consultUser || consultExternal;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  }

  const renderDropdown = (id, userObj = null, isExternal = false) => {
    return (
      <ActionDropdown isOpen={openMenuId === id} menuRef={menuRef} width="150px">
        <button type="button" className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setConsultExternal(userObj);
            else setConsultUser(userObj);
          }
        }}>
          <Eye size={14} /> Consulter
        </button>
        <button type="button" className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setEditExternal(userObj);
            else setEditUser(userObj);
          }
        }}>
          <Pencil size={14} /> Modifier
        </button>
        <button type="button" className="dropdown-item danger" onClick={() => { setOpenMenuId(null); if(userObj){ if(isExternal) handleDeleteClient(userObj.id); else handleDeleteUser(userObj.id); } }}>
          <Trash size={14} /> Supprimer
        </button>
      </ActionDropdown>
    );
  }

  return (
    <div>
      {/* Modal Ajouter Externe */}
      {showExternalModal && tab === 'externe' && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setShowExternalModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Ajouter un Membre Externe</h2>
            </div>
            
            <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', width: 'fit-content'}}>
              <label htmlFor="ext-type-particulier" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input id="ext-type-particulier" type="radio" name="ext_type" checked={externalType === 'Particulier'} onChange={() => setExternalType('Particulier')} />
                <span style={{fontWeight: 500}}>Particulier</span>
              </label>
              <label htmlFor="ext-type-societe" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input id="ext-type-societe" type="radio" name="ext_type" checked={externalType === 'Société'} onChange={() => setExternalType('Société')} />
                <span style={{fontWeight: 500}}>Société</span>
              </label>
            </div>

            <form onSubmit={handleCreateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <ClientFormFields client={newClient} setClient={setNewClient} type={externalType} isEdit={false} />
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowExternalModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Création...' : 'Créer le membre'}</button>
              </div>
</form>
          </div>
        </div>
      )}

      {/* Modal Modifier Externe */}
      {editExternal && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setEditExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier un Membre Externe</h2>
            </div>
            
            <form onSubmit={handleUpdateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <ClientFormFields client={editExternal} setClient={setEditExternal} type={editExternal.type} isEdit={true} />
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditExternal(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter Externe */}
      {consultExternal && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setConsultExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter un Membre Externe</h2>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {consultExternal.type === 'Particulier' || consultExternal.type === 'PARTICULIER' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {renderReadOnlyField("Nom complet", consultExternal.name)}
                    {renderReadOnlyField("Secteur d'activité", consultExternal.secteurActivite)}
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {renderReadOnlyField("Email professionnel", consultExternal.email)}
                    {renderReadOnlyField("Contact secondaire", consultExternal.contactSecondaire)}
                  </div>
                  {renderReadOnlyField("Numéro de téléphone", consultExternal.telephone)}
                  {renderReadOnlyField("Description client", consultExternal.description)}
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {renderReadOnlyField("Nom de la société", consultExternal.entreprise?.raisonSociale || consultExternal.name)}
                    {renderReadOnlyField("SIRET", consultExternal.entreprise?.siret)}
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {renderReadOnlyField("Email de l'entreprise", consultExternal.entreprise?.emailEntreprise || consultExternal.email)}
                    {renderReadOnlyField("Téléphone de l'entreprise", consultExternal.entreprise?.telephoneEntreprise || consultExternal.telephone)}
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    {renderReadOnlyField("Secteur d'activité", consultExternal.secteurActivite)}
                    {renderReadOnlyField("Contact secondaire", consultExternal.contactSecondaire)}
                  </div>
                  {renderReadOnlyField("Description", consultExternal.description)}
                </>
              )}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button type="button" onClick={() => setConsultExternal(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Interne */}
      {showModal && tab === 'interne' && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Ajouter un Membre Interne</h2>
            </div>
            <form onSubmit={handleCreateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <UserFormFields
                user={newUser}
                setUser={setNewUser}
                rolesList={rolesList}
                isEdit={false}
                setSelectedFile={setSelectedFile}
              />

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Création...' : 'Créer le membre'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Interne */}
      {editUser && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Modifier un Membre Interne</h2>
            </div>
            <form onSubmit={handleUpdateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <UserFormFields
                user={editUser}
                setUser={setEditUser}
                rolesList={rolesList}
                isEdit={true}
                setSelectedFile={setSelectedFile}
              />

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter Interne */}
      {consultUser && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", padding: "0"}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'}}>
              <button type="button" onClick={() => setConsultUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
              <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>Consulter : {consultUser.name}</h2>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.name}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.email}</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Numéro de téléphone</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.telephone || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Rôle</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.role?.name || consultUser.role || 'SANS ROLE'}</div>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions (Héritées du rôle)</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontSize: '0.875rem', color: 'var(--text-main)'}}>
                  {consultUser.role?.permissions || 'Aucune permission'}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Lieu de résidence</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.lieuResidence || 'Non renseigné'}</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Formation</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.experienceCle || 'Non renseigné'}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.status || 'Actif'}</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Missions terminées</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontWeight: 600, color: '#48BB78'}}>{consultUser.missionsTerminees || 12}</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Missions en cours</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontWeight: 600, color: '#D97706'}}>{consultUser.missionsEnCours || 3}</div>
                </div>
              </div>

              <div>
                <span style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description du profil</span>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '76px'}}>{consultUser.profile || 'Non renseigné'}</div>
              </div>

              <div>
                <span style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Pièce d'identité</span>
                {consultUser.idCardUrl ? (
                  <button 
                    type="button"
                    onClick={() => {
                      const token = sessionStorage.getItem('adminToken');
                      const viewUrl = consultUser.idCardUrl.includes('?') 
                        ? `${consultUser.idCardUrl}&token=${token}` 
                        : `${consultUser.idCardUrl}?token=${token}`;
                      setViewImage(viewUrl);
                    }} 
                    style={{width: '100%', padding: '0.5rem', background: '#EFF6FF', borderRadius: '4px', border: '1px dashed #3B82F6', minHeight: '38px', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500}}>
                    <Eye size={16} /> Voir le document
                  </button>
                ) : (
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Aucun document
                  </div>
                )}
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button type="button" onClick={() => setConsultUser(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen && (
      <>
      {!forceTab && (
        <div style={{marginBottom: '1.5rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Membres</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion des équipes internes et des clients</p>
        </div>
      )}

      {!forceTab && (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button type="button" 
              onClick={() => setTab('interne')} 
              style={{
                background: tab === 'interne' ? 'var(--primary)' : 'transparent', 
                color: tab === 'interne' ? '#FFF' : 'var(--text-muted)', 
                border: tab === 'interne' ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                borderRadius: '6px', 
                padding: '0 0.75rem', 
                height: '28px',
                lineHeight: 1,
                width: 'fit-content',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem', 
                fontWeight: 500, 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Interne
            </button>
            <button type="button" 
              onClick={() => setTab('externe')} 
              style={{
                background: tab === 'externe' ? 'var(--primary)' : 'transparent', 
                color: tab === 'externe' ? '#FFF' : 'var(--text-muted)', 
                border: tab === 'externe' ? '1px solid var(--primary)' : '1px solid #E2E8F0', 
                borderRadius: '6px', 
                padding: '0 0.75rem', 
                height: '28px',
                lineHeight: 1,
                width: 'fit-content',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem', 
                fontWeight: 500, 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Externe
            </button>
          </div>
          <button type="button" 
            className="btn btn-primary" 
            onClick={() => {
              if (tab === 'interne') setShowModal(true);
              else setShowExternalModal(true);
            }}
            style={{ width: 'fit-content', whiteSpace: 'nowrap', padding: '0 0.75rem', fontSize: '0.875rem', height: '28px', lineHeight: 1 }}
          >
            {tab === 'interne' ? 'Ajouter en Interne' : 'Ajouter en Externe'}
          </button>
        </div>
      )}

      {forceTab && (
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem'}}>
          <button type="button" 
            className="btn btn-primary" 
            onClick={() => {
              if (tab === 'interne') setShowModal(true);
              else setShowExternalModal(true);
            }}
            style={{ width: 'fit-content', whiteSpace: 'nowrap', padding: '0 0.75rem', fontSize: '0.875rem', height: '28px', lineHeight: 1 }}
          >
            {tab === 'interne' ? 'Ajouter un Membre' : 'Ajouter un Client'}
          </button>
        </div>
      )}

      <div className="table-wrapper">
        {tab === 'interne' ? (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong className="truncate-name" style={{}}>{u.name}</strong></td>
                  <td><span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{u.email}</span></td>
                  <td><div className="truncate-text">{getRoleBadge(u.role?.name || 'Non défini')}</div></td>
                  <td>
                    <span style={{color: !u.isBlocked ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                      {!u.isBlocked ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap'}}>{u.createdAt ? formatDate(u.createdAt) : 'Jamais connecté'}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button type="button" onClick={(e) => toggleMenu(e, u.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(u.id, u)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Type</th>
                <th>État</th>
                <th>Activité</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td><strong className="truncate-name">{c.name}</strong></td>
                  <td><span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{c.email}</span></td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: (c.type === 'Société' || c.type === 'SOCIETE') ? '#EFF6FF' : (c.type === 'Anonyme' || c.type === 'ANONYME') ? '#F1F5F9' : '#F3E8FF',
                      color: (c.type === 'Société' || c.type === 'SOCIETE') ? '#1D4ED8' : (c.type === 'Anonyme' || c.type === 'ANONYME') ? '#64748B' : '#7E22CE'
                    }}>
                      {c.type === 'SOCIETE' ? 'Entreprise' : c.type === 'PARTICULIER' ? 'Particulier' : c.type === 'ANONYME' ? 'Anonyme' : (c.type || 'Particulier')}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: !c.isBlocked ? '#DCFCE7' : '#FEE2E2',
                      color: !c.isBlocked ? '#166534' : '#B91C1C'
                    }}>
                      {!c.isBlocked ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.entreprise?.raisonSociale || c.secteurActivite || 'N/A'}</span></td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.createdAt ? formatDate(c.createdAt) : 'N/A'}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button type="button" onClick={(e) => toggleMenu(e, c.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(c.id, c, true)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </>
      )}

      {/* Image/PDF Viewer Modal using <object> for better PDF support */}
      {viewImage && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: '90vw', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <button type="button" onClick={() => setViewImage(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
              <X size={24} />
            </button>
            {viewImage.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/) ? (
              <img src={viewImage} alt="Document" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', backgroundColor: 'white', borderRadius: '8px'}} />
            ) : (
              <object data={viewImage} type="application/pdf" style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white', borderRadius: '8px'}}>
                <p>Impossible d'afficher ce fichier directement. <a href={viewImage} target="_blank" rel="noreferrer">Télécharger le fichier</a></p>
              </object>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage;