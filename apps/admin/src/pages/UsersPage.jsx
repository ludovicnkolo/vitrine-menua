import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const UsersPage = () => {
  const [tab, setTab] = useState('interne');
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
  const [errorMsg, setErrorMsg] = useState(null);
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
      const res = await fetch('http://localhost:4000/api/files/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        return `http://localhost:4000/api/files/view/${data.fileData.path}`;
      }
    } catch(e) { console.error('Upload error', e); }
    return null;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const [rUsers, rClients, rRoles] = await Promise.all([
        fetch('http://localhost:4000/api/crm/users', { headers }).then(r=>r.json()).catch(()=>[]),
        fetch('http://localhost:4000/api/crm/clients', { headers }).then(r=>r.json()).catch(()=>[]),
        fetch('http://localhost:4000/api/crm/roles', { headers }).then(r=>r.json()).catch(()=>[])
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
      const res = await fetch('http://localhost:4000/api/crm/users', {
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
      const res = await fetch('http://localhost:4000/api/crm/clients', {
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
      const res = await fetch(`http://localhost:4000/api/crm/users/${id}`, {
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
      const res = await fetch(`http://localhost:4000/api/crm/clients/${id}`, {
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
      const res = await fetch(`http://localhost:4000/api/crm/users/${editUser.id}`, {
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
      const res = await fetch(`http://localhost:4000/api/crm/clients/${editExternal.id}`, {
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
    if (openMenuId !== id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setConsultExternal(userObj);
            else setConsultUser(userObj);
          }
        }}>
          <Eye size={14} /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { 
          setOpenMenuId(null); 
          if (userObj) {
            if (isExternal) setEditExternal(userObj);
            else setEditUser(userObj);
          }
        }}>
          <Pencil size={14} /> Modifier
        </button>
        <button className="dropdown-item danger" onClick={() => { setOpenMenuId(null); if(userObj){ if(isExternal) handleDeleteClient(userObj.id); else handleDeleteUser(userObj.id); } }}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
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
              <button onClick={() => setShowExternalModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '8px', width: 'fit-content'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
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
                      <input type="text" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email professionnel</label>
                      <input type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                      <input type="tel" value={newClient.telephone} onChange={e=>setNewClient({...newClient, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Contact secondaire</label>
                      <input type="text" value={newClient.contactSecondaire} onChange={e=>setNewClient({...newClient, contactSecondaire: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" value={newClient.secteurActivite} onChange={e=>setNewClient({...newClient, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea rows="3" value={newClient.description} onChange={e=>setNewClient({...newClient, description: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de la société / Raison Sociale</label>
                      <input type="text" value={newClient.raisonSociale} onChange={e=>setNewClient({...newClient, raisonSociale: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>SIRET</label>
                      <input type="text" value={newClient.siret} onChange={e=>setNewClient({...newClient, siret: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'entreprise</label>
                      <input type="email" value={newClient.emailEntreprise} onChange={e=>setNewClient({...newClient, emailEntreprise: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de l'entreprise</label>
                      <input type="tel" value={newClient.telephoneEntreprise} onChange={e=>setNewClient({...newClient, telephoneEntreprise: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom du contact</label>
                      <input type="text" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email du contact</label>
                      <input type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro du contact</label>
                      <input type="tel" value={newClient.telephone} onChange={e=>setNewClient({...newClient, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Contact secondaire</label>
                      <input type="text" value={newClient.contactSecondaire} onChange={e=>setNewClient({...newClient, contactSecondaire: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" value={newClient.secteurActivite} onChange={e=>setNewClient({...newClient, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description client</label>
                    <textarea rows="3" value={newClient.description} onChange={e=>setNewClient({...newClient, description: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
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
              <button onClick={() => setEditExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <form onSubmit={handleUpdateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" value={editExternal.name} onChange={e=>setEditExternal({...editExternal, name: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email <span style={{color: 'red'}}>*</span></label>
                  <input type="email" value={editExternal.email} onChange={e=>setEditExternal({...editExternal, email: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                  <input type="text" value={editExternal.secteurActivite || ''} onChange={e=>setEditExternal({...editExternal, secteurActivite: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                  <input type="tel" value={editExternal.telephone || ''} onChange={e=>setEditExternal({...editExternal, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Type de client</label>
                  <select value={editExternal.type || 'Particulier'} onChange={e=>setEditExternal({...editExternal, type: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
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
              <button onClick={() => setConsultExternal(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {consultExternal.type === 'Particulier' || consultExternal.type === 'PARTICULIER' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
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
                <button onClick={() => setConsultExternal(null)} className="btn btn-outline">Fermer</button>
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
              <button onClick={() => setShowModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            <form onSubmit={handleCreateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email <span style={{color: 'red'}}>*</span></label>
                  <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" value={newUser.telephone} onChange={e => setNewUser({...newUser, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select value={newUser.roleId} onChange={e => setNewUser({...newUser, roleId: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="">Sélectionner un rôle...</option>
                    {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Lieu de résidence</label>
                  <input type="text" value={newUser.lieuResidence} onChange={e => setNewUser({...newUser, lieuResidence: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Expérience clé</label>
                  <input type="text" value={newUser.experienceCle} onChange={e => setNewUser({...newUser, experienceCle: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Langues</label>
                  <input type="text" value={newUser.langues} onChange={e => setNewUser({...newUser, langues: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} placeholder="Ex: Français, Anglais" />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select value={newUser.status} onChange={e => setNewUser({...newUser, status: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description profil</label>
                <textarea rows="3" value={newUser.profile} onChange={e => setNewUser({...newUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload)</label>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
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
              <button onClick={() => setEditUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            <form onSubmit={handleUpdateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" value={editUser.name} onChange={e=>setEditUser({...editUser, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" value={editUser.email} onChange={e=>setEditUser({...editUser, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" value={editUser.telephone || ''} onChange={e=>setEditUser({...editUser, telephone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select value={editUser.roleId || ''} onChange={e=>setEditUser({...editUser, roleId: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="">Sélectionner un rôle...</option>
                    {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Lieu de résidence</label>
                  <input type="text" value={editUser.lieuResidence || ''} onChange={e=>setEditUser({...editUser, lieuResidence: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Expérience clé</label>
                  <input type="text" value={editUser.experienceCle || ''} onChange={e=>setEditUser({...editUser, experienceCle: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Langues</label>
                  <input type="text" value={editUser.langues || ''} onChange={e=>setEditUser({...editUser, langues: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select value={editUser.isBlocked ? 'Inactif' : 'Actif'} onChange={e=>setEditUser({...editUser, isBlocked: e.target.value === 'Inactif'})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description profil</label>
                <textarea rows="3" value={editUser.profile || ''} onChange={e=>setEditUser({...editUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload nouvelle pièce)</label>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
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
              <button onClick={() => setConsultUser(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
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
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
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

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Pays de résidence</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Ville</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Formation</label>
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Non renseigné</div>
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
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '76px'}}>Non renseigné</div>
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
                <button onClick={() => setConsultUser(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isAnyModalOpen && (
      <>
        <div style={{marginBottom: '1.5rem'}}>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Membres</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion des équipes internes et des clients</p>
        </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div style={{display: 'flex', gap: '0.5rem'}}>
        <button 
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
        <button 
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
        <button 
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

      <div className="table-wrapper">
        {tab === 'interne' ? (
          <table>
            <thead>
              <tr>
                <th>Nom / Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong style={{display: 'block'}}>{u.name}</strong>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{u.email}</span>
                  </td>
                  <td>{getRoleBadge(u.role?.name || 'Non défini')}</td>
                  <td>
                    <span style={{color: !u.isBlocked ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                      {!u.isBlocked ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-muted)'}}>{u.createdAt ? new Date(u.createdAt).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Jamais connecté'}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button onClick={(e) => toggleMenu(e, u.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
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
                <th>Nom / Mail</th>
                <th>Statut</th>
                <th>Activité</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong style={{display: 'block'}}>{c.name}</strong>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{c.email}</span>
                  </td>
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
                        <button onClick={(e) => toggleMenu(e, c.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
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
            <button onClick={() => setViewImage(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
              <X size={24} />
            </button>
            <object data={viewImage} type="application/pdf" style={{width: '100%', height: '100%', border: 'none', backgroundColor: 'white', borderRadius: '8px'}}>
              <p>Votre navigateur ne supporte pas l'affichage direct de PDF. <a href={viewImage} target="_blank" rel="noreferrer">Télécharger le fichier</a></p>
            </object>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage;