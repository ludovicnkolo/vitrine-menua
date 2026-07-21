import re

with open('/home/kratos-financials-inc/Documents/kratos/site_web/apps/admin/src/pages/UsersPage.jsx', 'r') as f:
    content = f.read()

# 1. Inject API Handlers
handlers = """
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
      const res = await fetch(`http://localhost:4000/api/crm/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
          profile: editUser.profile,
          status: editUser.isBlocked ? 'Inactif' : 'Actif'
        })
      });
      if (res.ok) { setEditUser(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la modification'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const res = await fetch(`http://localhost:4000/api/crm/clients/${editExternal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        body: JSON.stringify({
          name: editExternal.name,
          email: editExternal.email,
          company: editExternal.company || editExternal.activite,
          phone: editExternal.phone,
          status: editExternal.status
        })
      });
      if (res.ok) { setEditExternal(null); fetchData(); }
      else { setErrorMsg('Erreur lors de la modification'); }
    } catch(e) { setErrorMsg('Erreur réseau'); }
    setLoading(false);
  };

  const isAnyModalOpen =
"""
content = re.sub(r'const isAnyModalOpen =', handlers, content)

# 2. Fix Dropdown Actions
content = re.sub(
    r'<button className="dropdown-item danger" onClick={\(\) => setOpenMenuId\(null\)}>',
    r'<button className="dropdown-item danger" onClick={() => { setOpenMenuId(null); if(userObj){ if(isExternal) handleDeleteClient(userObj.id); else handleDeleteUser(userObj.id); } }}>',
    content
)

# 3. Fix editUser Modal Form
edit_user_form = """<form onSubmit={handleUpdateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Rôle</label>
                  <select value={editUser.role} onChange={e=>setEditUser({...editUser, role: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="ADMIN">Administrateur</option>
                    <option value="SUPERVISOR">Superviseur</option>
                    <option value="ASSOCIÉ">Associé</option>
                  </select>
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
                <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Formation / Profil</label>
                <input type="text" value={editUser.profile || ''} onChange={e=>setEditUser({...editUser, profile: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditUser(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              </div>
            </form>"""
content = re.sub(
    r'<form style=\{\{display: \'flex\', flexDirection: \'column\', gap: \'1rem\'\}\}>.*?(?=\s*<\/div>\s*<\/div>\s*\{\/\* Modal Consulter Interne \*\/)',
    edit_user_form,
    content,
    flags=re.DOTALL
)

# 4. Fix editExternal Modal Form
edit_external_form = """<form onSubmit={handleUpdateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {errorMsg && <div style={{color: 'red', fontSize: '0.875rem'}}>{errorMsg}</div>}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Nom complet</label>
                  <input type="text" value={editExternal.name} onChange={e=>setEditExternal({...editExternal, name: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Email</label>
                  <input type="email" value={editExternal.email} onChange={e=>setEditExternal({...editExternal, email: e.target.value})} required style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Secteur d'activité / Entreprise</label>
                  <input type="text" value={editExternal.company || editExternal.activite || ''} onChange={e=>setEditExternal({...editExternal, company: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}} />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500}}>Statut</label>
                  <select value={editExternal.status} onChange={e=>setEditExternal({...editExternal, status: e.target.value})} style={{width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'white'}}>
                    <option value="Particulier">Particulier</option>
                    <option value="Société">Société</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
                <button type="button" onClick={() => setEditExternal(null)} className="btn btn-outline">Annuler</button>
                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              </div>
            </form>"""
content = re.sub(
    r'<form onSubmit=\{handleCreateUser\} style=\{\{display: \'flex\', flexDirection: \'column\', gap: \'1rem\'\}\}>.*?(?=\s*<\/div>\s*<\/div>\s*\{\/\* Modal Consulter Externe \*\/)',
    edit_external_form,
    content,
    flags=re.DOTALL
)

with open('/home/kratos-financials-inc/Documents/kratos/site_web/apps/admin/src/pages/UsersPage.jsx', 'w') as f:
    f.write(content)
