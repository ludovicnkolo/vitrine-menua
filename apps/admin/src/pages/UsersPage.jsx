import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, Search, Mail, MessageSquare, Pencil, Eye, Trash, Shield
} from 'lucide-react';
import ActionDropdown from '../components/ActionDropdown';
import { getStatusBadge } from '../utils/helpers';

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
  const [newUser, setNewUser] = useState({ name: '', email: '', telephone: '', roleId: '', lieuResidence: '', experienceCle: '', status: 'Actif', langues: '', profile: '' });
  const [newClient, setNewClient] = useState({ name: '', email: '', telephone: '', contactSecondaire: '', secteurActivite: '', description: '', siret: '', raisonSociale: '', emailEntreprise: '', telephoneEntreprise: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [rolesList, setRolesList] = useState([]);

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('bucket', 'users_id_cards'); // MUST BE BEFORE FILE
    formData.append('file', file);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/files/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/files/view/${data.fileData.path}`;
      }
    } catch(e) { console.error('Upload error', e); }
    return null;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const [rUsers, rClients, rRoles] = await Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/users', { headers }).then(r=>r.json()).catch(()=>[]),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/clients', { headers }).then(r=>r.json()).catch(()=>[]),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/roles', { headers }).then(r=>r.json()).catch(()=>[])
      ]);
      setUsers(Array.isArray(rUsers) ? rUsers : []);
      setClients(Array.isArray(rClients) ? rClients : []);
      setRolesList(Array.isArray(rRoles) ? rRoles : []);
    } catch(e) {}
  };

  useEffect(() => { fetchData(); }, []);
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setErrorMsg('Veuillez remplir le nom et l\'email au minimum.');
      return;
    }
    setLoading(true); setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile);
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({ ...newUser, lastLogin: 'Jamais connecté', idCardUrl: uploadedUrl })
      });
      if (res.ok) { setShowModal(false); setNewUser({ name: '', email: '', telephone: '', roleId: '', lieuResidence: '', experienceCle: '', status: 'Actif', langues: '', profile: '' }); setSelectedFile(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la création'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) {
      setErrorMsg('Veuillez remplir le nom et l\'email au minimum.');
      return;
    }
    setLoading(true); setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile);
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({ ...newClient, type: externalType, status: newClient.status || 'Actif', idCardUrl: uploadedUrl })
      });
      if (res.ok) { setShowExternalModal(false); setNewClient({ name: '', email: '', telephone: '', contactSecondaire: '', secteurActivite: '', description: '', siret: '', raisonSociale: '', emailEntreprise: '', telephoneEntreprise: '' }); setSelectedFile(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la création'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };
  
  
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce membre interne ?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
      });
      if (res.ok) fetchData();
    } catch(e) { console.error(e); }
    setOpenMenuId(null);
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce membre externe ?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
      });
      if (res.ok) fetchData();
    } catch(e) { console.error(e); }
    setOpenMenuId(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          roleId: editUser.roleId,
          profile: editUser.profile,
          status: editUser.isBlocked ? 'Inactif' : 'Actif',
          telephone: editUser.telephone,
          lieuResidence: editUser.lieuResidence,
          experienceCle: editUser.experienceCle,
          langues: editUser.langues,
          ...(uploadedUrl && { idCardUrl: uploadedUrl })
        })
      });
      if (res.ok) { setEditUser(null); setSelectedFile(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la modification'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/clients/${editExternal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({
          name: editExternal.name,
          email: editExternal.email,
          telephone: editExternal.telephone,
          contactSecondaire: editExternal.contactSecondaire,
          secteurActivite: editExternal.secteurActivite,
          description: editExternal.description,
          type: editExternal.type,
          siret: editExternal.siret,
          raisonSociale: editExternal.raisonSociale,
          emailEntreprise: editExternal.emailEntreprise,
          telephoneEntreprise: editExternal.telephoneEntreprise,
          status: editExternal.status,
          ...(uploadedUrl && { idCardUrl: uploadedUrl })
        })
      });
      if (res.ok) { setEditExternal(null); setSelectedFile(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la modification'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Ajouter un Membre Externe</h2>
              <button type="button" onClick={() => setShowExternalModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', width: 'fit-content'}}>
              <label htmlFor="auto-field-1785016991511-1" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="ext_type" checked={externalType === 'Particulier'} onChange={() => setExternalType('Particulier')} />
                <span style={{fontWeight: 500}}>Particulier</span>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                <input type="radio" name="ext_type" checked={externalType === 'Société'} onChange={() => setExternalType('Société')} />
                <span style={{fontWeight: 500}}>Société</span>
              </label>
            </div>

            <form onSubmit={handleCreateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              {externalType === 'Particulier' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                      <input id="auto-field-1785016991511-1" type="text" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-2" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email professionnel</label>
                      <input id="auto-field-1785016991511-2" type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-3" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                      <input id="auto-field-1785016991511-3" type="tel" value={newClient.telephone} onChange={e=>setNewClient({...newClient, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-4" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Contact secondaire</label>
                      <input id="auto-field-1785016991511-4" type="text" value={newClient.contactSecondaire} onChange={e=>setNewClient({...newClient, contactSecondaire: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-5" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input id="auto-field-1785016991511-5" type="text" value={newClient.secteurActivite} onChange={e=>setNewClient({...newClient, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="auto-field-1785016991511-6" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea id="auto-field-1785016991511-6" rows="3" value={newClient.description} onChange={e=>setNewClient({...newClient, description: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-7" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de la société / Raison Sociale</label>
                      <input id="auto-field-1785016991511-7" type="text" value={newClient.raisonSociale} onChange={e=>setNewClient({...newClient, raisonSociale: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-8" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>SIRET</label>
                      <input id="auto-field-1785016991511-8" type="text" value={newClient.siret} onChange={e=>setNewClient({...newClient, siret: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-9" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'entreprise</label>
                      <input id="auto-field-1785016991511-9" type="email" value={newClient.emailEntreprise} onChange={e=>setNewClient({...newClient, emailEntreprise: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-10" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de l'entreprise</label>
                      <input id="auto-field-1785016991511-10" type="tel" value={newClient.telephoneEntreprise} onChange={e=>setNewClient({...newClient, telephoneEntreprise: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-11" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom du contact</label>
                      <input id="auto-field-1785016991511-11" type="text" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-12" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email du contact</label>
                      <input id="auto-field-1785016991511-12" type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-13" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro du contact</label>
                      <input id="auto-field-1785016991511-13" type="tel" value={newClient.telephone} onChange={e=>setNewClient({...newClient, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label htmlFor="auto-field-1785016991511-14" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Contact secondaire</label>
                      <input id="auto-field-1785016991511-14" type="text" value={newClient.contactSecondaire} onChange={e=>setNewClient({...newClient, contactSecondaire: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-15" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input id="auto-field-1785016991511-15" type="text" value={newClient.secteurActivite} onChange={e=>setNewClient({...newClient, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="auto-field-1785016991511-16" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea id="auto-field-1785016991511-16" rows="3" value={newClient.description} onChange={e=>setNewClient({...newClient, description: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              )}
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier un Membre Externe</h2>
              <button type="button" onClick={() => setEditExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <form onSubmit={handleUpdateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-17" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input id="auto-field-1785016991511-17" type="text" value={editExternal.name} onChange={e=>setEditExternal({...editExternal, name: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-18" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email <span style={{color: 'red'}}>*</span></label>
                  <input id="auto-field-1785016991511-18" type="email" value={editExternal.email} onChange={e=>setEditExternal({...editExternal, email: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-19" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                  <input id="auto-field-1785016991511-19" type="text" value={editExternal.secteurActivite || ''} onChange={e=>setEditExternal({...editExternal, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-20" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                  <input id="auto-field-1785016991511-20" type="tel" value={editExternal.telephone || ''} onChange={e=>setEditExternal({...editExternal, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-21" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Type de client</label>
                  <select id="auto-field-1785016991511-21" value={editExternal.type || 'Particulier'} onChange={e=>setEditExternal({...editExternal, type: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Particulier">Particulier</option>
                    <option value="Société">Société</option>
                  </select>
                </div>
              </div>
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter un Membre Externe</h2>
              <button type="button" onClick={() => setConsultExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {consultExternal.type === 'Particulier' || consultExternal.type === 'PARTICULIER' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label htmlFor="auto-field-1785016991511-22" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.secteurActivite}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email professionnel</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Contact secondaire</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.contactSecondaire}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Numéro de téléphone</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.telephone}</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description client</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.description}</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de la société</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.entreprise?.raisonSociale || consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>SIRET</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.entreprise?.siret}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.entreprise?.emailEntreprise || consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.entreprise?.telephoneEntreprise || consultExternal.telephone}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.secteurActivite}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Contact secondaire</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.contactSecondaire}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.description}</div>
                  </div>
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Ajouter un Membre Interne</h2>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            <form onSubmit={handleCreateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input id="auto-field-1785016991511-22" type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-23" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email <span style={{color: 'red'}}>*</span></label>
                  <input id="auto-field-1785016991511-23" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-24" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input id="auto-field-1785016991511-24" type="tel" value={newUser.telephone} onChange={e => setNewUser({...newUser, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-25" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select id="auto-field-1785016991511-25" value={newUser.roleId} onChange={e => setNewUser({...newUser, roleId: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="">Sélectionner un rôle...</option>
                    {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-26" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Lieu de résidence</label>
                  <input id="auto-field-1785016991511-26" type="text" value={newUser.lieuResidence} onChange={e => setNewUser({...newUser, lieuResidence: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-27" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Expérience clé</label>
                  <input id="auto-field-1785016991511-27" type="text" value={newUser.experienceCle} onChange={e => setNewUser({...newUser, experienceCle: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-28" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Langues</label>
                  <input id="auto-field-1785016991511-28" type="text" value={newUser.langues} onChange={e => setNewUser({...newUser, langues: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} placeholder="Ex: Français, Anglais" />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-29" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select id="auto-field-1785016991511-29" value={newUser.status} onChange={e => setNewUser({...newUser, status: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="auto-field-1785016991511-30" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description profil</label>
                <textarea id="auto-field-1785016991511-30" rows="3" value={newUser.profile} onChange={e => setNewUser({...newUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label htmlFor="auto-field-1785016991511-31" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload)</label>
                <input id="auto-field-1785016991511-31" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
              </div>

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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier un Membre Interne</h2>
              <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            <form onSubmit={handleUpdateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-32" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input id="auto-field-1785016991511-32" type="text" value={editUser.name} onChange={e=>setEditUser({...editUser, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-33" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input id="auto-field-1785016991511-33" type="email" value={editUser.email} onChange={e=>setEditUser({...editUser, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-34" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input id="auto-field-1785016991511-34" type="tel" value={editUser.telephone || ''} onChange={e=>setEditUser({...editUser, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-35" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select id="auto-field-1785016991511-35" value={editUser.roleId || ''} onChange={e=>setEditUser({...editUser, roleId: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="">Sélectionner un rôle...</option>
                    {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-36" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Lieu de résidence</label>
                  <input id="auto-field-1785016991511-36" type="text" value={editUser.lieuResidence || ''} onChange={e=>setEditUser({...editUser, lieuResidence: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-37" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Expérience clé</label>
                  <input id="auto-field-1785016991511-37" type="text" value={editUser.experienceCle || ''} onChange={e=>setEditUser({...editUser, experienceCle: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="auto-field-1785016991511-38" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Langues</label>
                  <input id="auto-field-1785016991511-38" type="text" value={editUser.langues || ''} onChange={e=>setEditUser({...editUser, langues: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label htmlFor="auto-field-1785016991511-39" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select id="auto-field-1785016991511-39" value={editUser.isBlocked ? 'Inactif' : 'Actif'} onChange={e=>setEditUser({...editUser, isBlocked: e.target.value === 'Inactif'})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="auto-field-1785016991511-40" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description profil</label>
                <textarea id="auto-field-1785016991511-40" rows="3" value={editUser.profile || ''} onChange={e=>setEditUser({...editUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label htmlFor="auto-field-1785016991511-41" style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload nouvelle pièce)</label>
                <input id="auto-field-1785016991511-41" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>Fichier actuel : document_identite.pdf</div>
              </div>

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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter : {consultUser.name}</h2>
              <button type="button" onClick={() => setConsultUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
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
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description du profil</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '76px'}}>{consultUser.profile || 'Non renseigné'}</div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Pièce d'identité</label>
                {consultUser.idCardUrl ? (
                  <div 
                    onClick={() => {
                      const token = localStorage.getItem('adminToken');
                      const viewUrl = consultUser.idCardUrl.includes('?') 
                        ? `${consultUser.idCardUrl}&token=${token}` 
                        : `${consultUser.idCardUrl}?token=${token}`;
                      setViewImage(viewUrl);
                    }} 
                    style={{width: '100%', padding: '0.5rem', background: '#EFF6FF', borderRadius: '4px', border: '1px dashed #3B82F6', minHeight: '38px', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500}}>
                    <Eye size={16} /> Voir le document
                  </div>
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
                  <td style={{color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap'}}>{u.createdAt ? new Date(u.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Jamais connecté'}</td>
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
                <th>Statut</th>
                <th>Activité</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td><strong className="truncate-name" style={{}}>{c.name}</strong></td>
                  <td><span className="truncate-text" style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>{c.email}</span></td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: c.status === 'Société' ? '#EFF6FF' : '#F3E8FF',
                      color: c.status === 'Société' ? '#1D4ED8' : '#7E22CE'
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.entreprise?.raisonSociale || c.secteurActivite || 'N/A'}</span></td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.createdAt ? new Date(c.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A'}</span></td>
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