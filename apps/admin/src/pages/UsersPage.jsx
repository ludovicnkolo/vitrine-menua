import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';
import { mockRoles } from '../utils/mockData';

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
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'ASSOCIÉ', status: 'Actif', profile: '', phone: '' });
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '', phone: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': 'Bearer ' + token };
      const [rUsers, rClients] = await Promise.all([
        fetch('http://localhost:4000/api/crm/users', { headers }).then(r=>r.json()).catch(()=>[]),
        fetch('http://localhost:4000/api/crm/clients', { headers }).then(r=>r.json()).catch(()=>[])
      ]);
      setUsers(Array.isArray(rUsers) ? rUsers : []);
      setClients(Array.isArray(rClients) ? rClients : []);
    } catch(e) {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const res = await fetch('http://localhost:4000/api/crm/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify(newUser)
      });
      if (res.ok) { setShowModal(false); setNewUser({ name: '', email: '', role: 'ASSOCIÉ', status: 'Actif', profile: '', phone: '' }); fetchData(); }
      else { setErrorMsg('Erreur lors de la création'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const res = await fetch('http://localhost:4000/api/crm/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({ ...newClient, status: externalType })
      });
      if (res.ok) { setShowExternalModal(false); setNewClient({ name: '', email: '', company: '', phone: '' }); fetchData(); }
      else { setErrorMsg('Erreur lors de la création'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };
  
  const isAnyModalOpen = showModal || showExternalModal || editUser || editExternal || consultUser || consultExternal;

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
        <button className="dropdown-item danger" onClick={() => setOpenMenuId(null)}>
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
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email professionnel</label>
                      <input type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                      <input type="tel" value={newClient.phone} onChange={e=>setNewClient({...newClient, phone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom de la société</label>
                      <input type="text" value={newClient.company} onChange={e=>setNewClient({...newClient, company: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>SIRET</label>
                      <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email de l'entreprise</label>
                      <input type="email" value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Téléphone</label>
                      <input type="tel" value={newClient.phone} onChange={e=>setNewClient({...newClient, phone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom du contact</label>
                    <input type="text" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
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
            
            <form onSubmit={handleCreateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" value={newUser.phone} onChange={e=>setNewUser({...newUser, phone: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="ADMIN">Administrateur</option>
                    <option value="SUPERVISOR">Superviseur</option>
                    <option value="ASSOCIÉ">Associé</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation / Profil</label>
                <input type="text" value={newUser.profile} onChange={e=>setNewUser({...newUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} placeholder="Ex: Master en Droit des Affaires" />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Création...' : 'Créer le membre'}</button>
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
              {consultExternal.status === 'Particulier' ? (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom complet</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.activite}</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email professionnel</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email personnel</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Numéro de téléphone</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>06 12 34 56 78</div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description client</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Client fidèle depuis 2026.</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de la société</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.name}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>SIRET</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>12345678900012</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone de l'entreprise</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>01 23 45 67 89</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Secteur d'activité</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.activite}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Nom de l'employé (contact)</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Directeur Commercial</div>
                    </div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Email de l'employé</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultExternal.email}</div>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Téléphone de l'employé</label>
                      <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>06 98 76 54 32</div>
                    </div>
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description de l'entreprise</label>
                    <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>Partenaire principal.</div>
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
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option>Administrateur</option>
                    <option>Superviseur</option>
                    <option>Collaborateur</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pays de résidence</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Ville</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation</label>
                  <input type="text" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} placeholder="Ex: Master en Droit des Affaires" />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du profil</label>
                <textarea rows="3" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload)</label>
                <input type="file" style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setShowModal(false); }}>Créer le membre</button>
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
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" defaultValue={editUser.name} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" defaultValue={editUser.email} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Numéro de téléphone</label>
                  <input type="tel" defaultValue="+33 6 12 34 56 78" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select defaultValue={editUser.role} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="ADMIN">Administrateur</option>
                    <option value="SUPERVISOR">Superviseur</option>
                    <option value="COLLABORATOR">Collaborateur</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions actuelles (Héritées du rôle)</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  {mockRoles.find(r => r.name === editUser.role)?.permissions || 'Aucune permission'}
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pays de résidence</label>
                  <input type="text" defaultValue="France" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Ville</label>
                  <input type="text" defaultValue="Paris" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation</label>
                  <input type="text" defaultValue="Master HEC Paris" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select defaultValue={editUser.status || "Actif"} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du profil</label>
                <textarea rows="3" defaultValue="Consultant Senior spécialisé en audit financier et accompagnement des directions générales." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Pièce d'identité (Upload nouvelle pièce)</label>
                <input type="file" style={{width: '100%', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px dashed var(--text-muted)'}} />
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>Fichier actuel : document_identite.pdf</div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setEditUser(null); }}>Sauvegarder les modifications</button>
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
                  <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultUser.role}</div>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions (Héritées du rôle)</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', fontSize: '0.875rem', color: 'var(--text-main)'}}>
                  {mockRoles.find(r => r.name === consultUser.role)?.permissions || 'Aucune permission'}
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
                <div onClick={() => setViewImage('https://images.unsplash.com/photo-1544813545-4827233fc515?q=80&w=1470&auto=format&fit=crop')} style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s'}}>
                  <Eye size={16} /> Voir
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
                <button onClick={() => setConsultUser(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Image Viewer */}
      {viewImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div style={{position: 'relative', maxWidth: '90vw', maxHeight: '90vh'}}>
            <button onClick={() => setViewImage(null)} style={{position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', zIndex: 210}}>
              <X size={32} />
            </button>
            <img src={viewImage} alt="Pièce d'identité" style={{maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}} />
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
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    <span style={{color: u.status === 'Actif' ? 'var(--success)' : 'var(--danger)', fontWeight: 500}}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-muted)'}}>{u.lastLogin}</td>
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
                  <td><span style={{color: 'var(--text-muted)'}}>{c.activite}</span></td>
                  <td><span style={{color: 'var(--text-muted)'}}>{c.creationDate}</span></td>
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
    </div>
  )
}

export default UsersPage;