const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/UsersPage.jsx');
let content = fs.readFileSync(file, 'utf-8');

// Replace imports
content = content.replace(
  "import { mockDossiers, mockTasks, mockInbox, mockContactInbox, mockRecrutementInbox, mockClients, mockRoles, mockUsers } from '../utils/mockData';",
  "import { getStatusBadge, getPriorityBadge, getRoleBadge, getMessageStatusBadge } from '../utils/helpers';\nimport { mockRoles } from '../utils/mockData';"
);

// Inject real states and API logic
const stateInjection = `  const [editExternal, setEditExternal] = useState(null);
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
  
  const isAnyModalOpen`;
content = content.replace("  const [editExternal, setEditExternal] = useState(null);\n  const menuRef = useRef(null);\n  const isAnyModalOpen", stateInjection);

// Replace external form (Client)
content = content.replace(/<form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>[\s\S]*?(?=<\/form>)/, 
`<form onSubmit={handleCreateClient} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
`);

// Replace internal form (User)
content = content.replace(/<form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>[\s\S]*?(?=<\/form>)/, 
`<form onSubmit={handleCreateUser} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
`);

// Map over users
content = content.replace(/mockUsers\.map\(u/g, "users.map(u");

// Map over clients
content = content.replace(/mockClients\.map\(c/g, "clients.map(c");

// Remove the weird duplicate form match if it happened, no wait, the regex uses positive lookahead, it should work nicely.
fs.writeFileSync(file, content);
console.log("UsersPage updated successfully");
