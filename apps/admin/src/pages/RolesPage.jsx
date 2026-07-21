import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Files, Users, Settings, Bell, Search, LogOut, Briefcase,
  MoreVertical, CheckCircle, Clock, AlertCircle, Mail, MessageSquare,
  Pencil, Eye, Trash, X, Shield, Inbox, ChevronDown
} from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [consultRole, setConsultRole] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '', status: 'Actif', users: 0 });
  const isAnyModalOpen = showRoleModal || editRole || consultRole;

  const availablePermissions = [
    "Accès total (Administration)",
    "Création / Modification de dossiers",
    "Consultation de dossiers",
    "Gestion des utilisateurs",
    "Assignation de tâches",
    "Envoi de messages",
    "Configuration système"
  ];

  const togglePerm = (perm) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/crm/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          // Count users per role
          const roleCounts = data.reduce((acc, user) => {
            if (user.role) {
              acc[user.role] = (acc[user.role] || 0) + 1;
            }
            return acc;
          }, {});

          // Update roles state
          setRoles(prevRoles => prevRoles.map(r => ({
            ...r,
            users: roleCounts[r.name] || 0
          })));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
    };

    fetchUsers();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPermissionsOpen(false);
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

  const handleDeleteRole = (id) => {
    if(window.confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      setRoles(roles.filter(r => r.id !== id));
      if (editRole && editRole.id === id) {
        setEditRole(null);
      }
    }
    setOpenMenuId(null);
  };

  const renderDropdown = (role) => {
    if (openMenuId !== role.id) return null;
    return (
      <div ref={menuRef} style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '0.5rem',
        background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, width: '150px',
        display: 'flex', flexDirection: 'column', padding: '0.25rem 0'
      }}>
        <button className="dropdown-item" onClick={() => { setConsultRole(role); setOpenMenuId(null); }}>
          <Eye size={14} /> Consulter
        </button>
        <button className="dropdown-item" onClick={() => { setEditRole({...role}); setSelectedPermissions(role.permissions.split(', ')); setOpenMenuId(null); }}>
          <Pencil size={14} /> Modifier
        </button>
        <button className="dropdown-item danger" onClick={() => handleDeleteRole(role.id)}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      {!isAnyModalOpen && (
      <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Rôles et Permissions</h1>
        <button onClick={() => setShowRoleModal(true)} className="btn btn-primary" style={{display: 'flex', gap: '0.5rem', alignItems: 'center', height: '28px', padding: '0 0.75rem', fontSize: '0.875rem'}}>
          Créer un rôle
        </button>
      </div>

      <div className="card" style={{padding: 0, overflow: 'visible'}}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rôle</th>
                <th>Permissions clés</th>
                <th>Statut</th>
                <th>Utilisateurs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id}>
                  <td>
                    <strong style={{display: 'block'}}>{r.name}</strong>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>{r.permissions}</span></td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td><span className="badge badge-new" style={{background: '#EFF6FF', color: '#1D4ED8'}}>{r.users} membre{r.users !== 1 ? 's' : ''}</span></td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                      <div style={{position: 'relative'}}>
                        <button onClick={(e) => toggleMenu(e, r.id)} style={{background: 'transparent', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4A5568'}} title="Options">
                          <MoreVertical size={16} />
                        </button>
                        {renderDropdown(r)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Modal Créer un Rôle */}
      {showRoleModal && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", position: "relative"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Créer un Rôle</h2>
              <button onClick={() => setShowRoleModal(false)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Intitulé du rôle</label>
                <input type="text" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="Ex: GESTIONNAIRE" style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Permissions</label>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                  <div 
                    onClick={() => setPermissionsOpen(!permissionsOpen)}
                    style={{width: '100%', padding: '0.5rem', minHeight: '38px', borderRadius: '4px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                  >
                    <span style={{color: selectedPermissions.length > 0 ? 'var(--text-main)' : 'var(--text-muted)'}}>
                      {selectedPermissions.length > 0 ? selectedPermissions.join(', ') : 'Sélectionner des permissions...'}
                    </span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem'}}>▼</span>
                  </div>
                  {permissionsOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      background: 'white', border: '1px solid var(--border)', borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto',
                      padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                      {availablePermissions.map(p => (
                        <label key={p} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p)} onChange={() => togglePerm(p)} /> {p}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" placeholder="Description des responsabilités..." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                <select value={newRole.status} onChange={e => setNewRole({...newRole, status: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setShowRoleModal(false)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { 
                  e.preventDefault(); 
                  setRoles([...roles, { ...newRole, id: Date.now(), permissions: selectedPermissions.join(', ') }]);
                  setNewRole({ name: '', permissions: '', status: 'Actif', users: 0 });
                  setSelectedPermissions([]);
                  setShowRoleModal(false); 
                }}>Créer le rôle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier un Rôle */}
      {editRole && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", position: "relative"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Modifier le Rôle</h2>
              <button onClick={() => setEditRole(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Intitulé du rôle</label>
                <input type="text" value={editRole.name} onChange={e => setEditRole({...editRole, name: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Permissions</label>
                <div style={{position: 'relative'}} ref={dropdownRef}>
                  <div 
                    onClick={() => setPermissionsOpen(!permissionsOpen)}
                    style={{width: '100%', padding: '0.5rem', minHeight: '38px', borderRadius: '4px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                  >
                    <span style={{color: selectedPermissions.length > 0 ? 'var(--text-main)' : 'var(--text-muted)'}}>
                      {selectedPermissions.length > 0 ? selectedPermissions.join(', ') : 'Sélectionner des permissions...'}
                    </span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem'}}>▼</span>
                  </div>
                  {permissionsOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                      background: 'white', border: '1px solid var(--border)', borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto',
                      padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                    }}>
                      {availablePermissions.map(p => (
                        <label key={p} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p)} onChange={() => togglePerm(p)} /> {p}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" defaultValue={editRole.permissions} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                <select value={editRole.status} onChange={e => setEditRole({...editRole, status: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditRole(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" className="btn btn-primary" onClick={(e) => { 
                  e.preventDefault(); 
                  setRoles(roles.map(r => r.id === editRole.id ? { ...editRole, permissions: selectedPermissions.join(', ') } : r));
                  setEditRole(null); 
                }}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Consulter un Rôle */}
      {consultRole && (
        <div className="fade-in" style={{padding: "1rem"}}>
          <div className="" style={{width: "100%", position: "relative"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Consulter le Rôle</h2>
              <button onClick={() => setConsultRole(null)} className="btn btn-outline" style={{padding: "0.5rem 1rem", color: "var(--text-main)"}}>← Retour</button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Intitulé du rôle</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.name}</div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Permissions</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '80px'}}>{consultRole.permissions}</div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.status}</div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setConsultRole(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default RolesPage;