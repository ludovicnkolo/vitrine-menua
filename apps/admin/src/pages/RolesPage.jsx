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
  const [newRole, setNewRole] = useState({ name: '', description: '', status: 'Actif' });
  const [deleteRole, setDeleteRole] = useState(null);
  const isTableViewHidden = showRoleModal || editRole || consultRole;

  const availablePermissions = [
    { value: "MESSAGES_VIEW", label: "Consulter les messages" },
    { value: "MESSAGES_PROCESS", label: "Traiter les messages" },
    { value: "DOSSIERS_MANAGE", label: "Gérer les dossiers" },
    { value: "TACHES_MANAGE", label: "Créer et gérer les tâches" },
    { value: "TACHES_VIEW_ALL", label: "Consulter toutes les tâches" },
    { value: "TACHES_VALIDATE", label: "Valider les tâches" },
    { value: "TACHES_VIEW_ASSIGNED", label: "Voir ses tâches assignées" },
    { value: "TACHES_EDIT_ASSIGNED", label: "Modifier ses tâches assignées" },
    { value: "CLIENTS_MANAGE", label: "Gérer les clients" },
    { value: "USERS_MANAGE", label: "Gérer les utilisateurs" },
    { value: "ROLES_MANAGE", label: "Gérer les rôles" }
  ];

  const getPermLabel = (val) => availablePermissions.find(p => p.value === val)?.label || val;

  const togglePerm = (perm) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      const [rUsers, rRoles] = await Promise.all([
        fetch(`${apiUrl}/api/crm/users`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r=>r.json()).catch(()=>[]),
        fetch(`${apiUrl}/api/crm/roles`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r=>r.json()).catch(()=>[])
      ]);

      const validRoles = Array.isArray(rRoles) ? rRoles : [];
      const validUsers = Array.isArray(rUsers) ? rUsers : [];

      const roleCounts = validUsers.reduce((acc, user) => {
        if (user.roleId) acc[user.roleId] = (acc[user.roleId] || 0) + 1;
        return acc;
      }, {});

      setRoles(validRoles.map(r => ({
        ...r,
        users: roleCounts[r.id] || 0
      })));
    } catch (error) {
      console.error("Erreur fetchData roles:", error);
    }
  };

  useEffect(() => {
    fetchData();

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

  const handleDeleteRole = async () => {
    if(!deleteRole) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/roles/${deleteRole.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
      });
      fetchData();
      if (editRole && editRole.id === deleteRole.id) setEditRole(null);
    } catch(e) {}
    setDeleteRole(null);
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
        <button className="dropdown-item" onClick={() => { 
          setEditRole({...role}); 
          try { setSelectedPermissions(JSON.parse(role.permissions || '[]')); } catch(e) { setSelectedPermissions([]); }
          setOpenMenuId(null); 
        }}>
          <Pencil size={14} /> Modifier
        </button>
        <button className="dropdown-item danger" onClick={() => { setDeleteRole(role); setOpenMenuId(null); }}>
          <Trash size={14} /> Supprimer
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '0 1rem'}}>
      {!isTableViewHidden && (
      <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Rôles</h1>
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
                <th>Permissions</th>
                <th>Statut</th>
                <th>Utilisateurs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.id}>
                  <td>
                    <strong className="truncate-name" style={{}}>{r.name}</strong>
                  </td>
                  <td><span style={{color: 'var(--text-muted)'}}>
                    {(() => {
                      try {
                        const arr = JSON.parse(r.permissions);
                        return arr.length + ' permission' + (arr.length > 1 ? 's' : '');
                      } catch {
                        return 'Aucune permission';
                      }
                    })()}
                  </span></td>
                  <td><div className="truncate-text">{getStatusBadge(r.status || 'Actif')}</div></td>
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
                      {selectedPermissions.length > 0 ? selectedPermissions.map(getPermLabel).join(', ') : 'Sélectionner des permissions...'}
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
                        <label key={p.value} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p.value)} onChange={() => togglePerm(p.value)} /> {p.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" value={newRole.description} onChange={e=>setNewRole({...newRole, description: e.target.value})} placeholder="Description des responsabilités..." style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
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
                <button type="submit" className="btn btn-primary" onClick={async (e) => { 
                  e.preventDefault(); 
                  try {
                    await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/crm/roles', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                      body: JSON.stringify({ name: newRole.name, description: newRole.description, status: newRole.status, permissions: JSON.stringify(selectedPermissions) })
                    });
                    setNewRole({ name: '', description: '', status: 'Actif' });
                    setSelectedPermissions([]);
                    setShowRoleModal(false); 
                    fetchData();
                  } catch(e) {}
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
                      {selectedPermissions.length > 0 ? selectedPermissions.map(getPermLabel).join(', ') : 'Sélectionner des permissions...'}
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
                        <label key={p.value} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}>
                          <input type="checkbox" checked={selectedPermissions.includes(p.value)} onChange={() => togglePerm(p.value)} /> {p.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Description du rôle</label>
                <textarea rows="3" value={editRole.description || ''} onChange={e=>setEditRole({...editRole, description: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', fontFamily: 'inherit'}}></textarea>
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
                <button type="submit" className="btn btn-primary" onClick={async (e) => { 
                  e.preventDefault(); 
                  try {
                    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/crm/roles/${editRole.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                      body: JSON.stringify({ name: editRole.name, description: editRole.description, status: editRole.status, permissions: JSON.stringify(selectedPermissions) })
                    });
                    setEditRole(null); 
                    fetchData();
                  } catch(e) {}
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
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '80px'}}>
                  {(() => {
                    try {
                      return JSON.parse(consultRole.permissions).map(getPermLabel).join(', ');
                    } catch { return ''; }
                  })()}
                </div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Description</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.description}</div>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)'}}>Statut</label>
                <div style={{width: '100%', padding: '0.5rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '38px'}}>{consultRole.status || 'Actif'}</div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setConsultRole(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supprimer un Rôle */}
      {deleteRole && (
        <div className="modal-backdrop" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card fade-in" style={{width: '100%', maxWidth: '400px', padding: '1.5rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem'}}>
              <div style={{width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Trash size={24} />
              </div>
              <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Supprimer le rôle</h2>
              <p style={{color: 'var(--text-muted)'}}>Êtes-vous sûr de vouloir supprimer le rôle <strong>{deleteRole.name}</strong> ? Cette action est irréversible et pourrait affecter les utilisateurs associés.</p>
              <div style={{display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem'}}>
                <button className="btn btn-outline" style={{flex: 1}} onClick={() => setDeleteRole(null)}>Annuler</button>
                <button className="btn btn-primary" style={{flex: 1, backgroundColor: '#DC2626', borderColor: '#DC2626'}} onClick={handleDeleteRole}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default RolesPage;