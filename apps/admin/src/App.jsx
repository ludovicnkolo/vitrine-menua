import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Files, 
  Users, 
  Settings,
  Bell,
  Search,
  LogOut,
  Briefcase,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare
} from 'lucide-react'

// --- MOCK DATA (Données fictives) ---
const MOCK_USER = {
  id: 'U-001',
  name: 'Marie Claire',
  role: 'ADMIN', // ADMIN, SUPERVISOR, COLLABORATOR, PRESTATAIRE, READ_ONLY
  email: 'm.claire@menua.fr'
}

const mockUsers = [
  { id: 'U-001', name: 'Marie Claire', role: 'ADMIN', email: 'm.claire@menua.fr', status: 'Actif', lastLogin: 'Il y a 2 min' },
  { id: 'U-002', name: 'Jean Dupont', role: 'SUPERVISOR', email: 'j.dupont@menua.fr', status: 'Actif', lastLogin: 'Il y a 1 heure' },
  { id: 'U-003', name: 'Alice Martin', role: 'COLLABORATOR', email: 'a.martin@menua.fr', status: 'Actif', lastLogin: 'Il y a 3 heures' },
  { id: 'U-004', name: 'Cabinet Légal Pro', role: 'PRESTATAIRE', email: 'contact@legalpro.fr', status: 'Actif', lastLogin: 'Hier' },
  { id: 'U-005', name: 'Sophie Bernard', role: 'COLLABORATOR', email: 's.bernard@menua.fr', status: 'Bloqué', lastLogin: 'Il y a 10 jours' },
]

const mockDossiers = [
  { id: 'DOS-24-001', client: 'Société Générale', contact: 'Marc Tremblay', type: 'Conformité KYC', status: 'NEW', priority: 'URGENT', date: '2026-07-10', documents: 2 },
  { id: 'DOS-24-002', client: 'LVMH Group', contact: 'Sarah Connors', type: 'Audit Financier', status: 'IN_PROGRESS', priority: 'NORMAL', date: '2026-07-09', documents: 5 },
  { id: 'DOS-24-003', client: 'Airbus SE', contact: 'Jean-Luc Picard', type: 'Conseil Stratégique', status: 'WAITING_DOCS', priority: 'LOW', date: '2026-07-08', documents: 1 },
  { id: 'DOS-24-004', client: 'Danone', contact: 'Élodie Roy', type: 'Restructuration', status: 'TO_ASSIGN', priority: 'URGENT', date: '2026-07-07', documents: 8 },
  { id: 'DOS-24-005', client: 'TotalEnergies', contact: 'Paul Dubois', type: 'Analyse des risques', status: 'VALIDATED', priority: 'NORMAL', date: '2026-07-05', documents: 12 },
  { id: 'DOS-24-006', client: 'L\'Oréal', contact: 'Claire Fontaine', type: 'Due Diligence', status: 'IN_REVIEW', priority: 'NORMAL', date: '2026-07-01', documents: 3 },
]

const mockTasks = [
  { id: 'TSK-101', dossierId: 'DOS-24-002', name: 'Analyse des bilans 2025', assignedTo: 'Alice Martin', status: 'IN_PROGRESS', deadline: '2026-07-15', type: 'INTERNAL' },
  { id: 'TSK-102', dossierId: 'DOS-24-004', name: 'Revue contractuelle', assignedTo: 'Cabinet Légal Pro', status: 'TO_ASSIGN', deadline: '2026-07-12', type: 'MISSION' },
  { id: 'TSK-103', dossierId: 'DOS-24-006', name: 'Vérification des bénéficiaires', assignedTo: 'Alice Martin', status: 'IN_REVIEW', deadline: '2026-07-11', type: 'INTERNAL' },
  { id: 'TSK-104', dossierId: 'DOS-24-001', name: 'Urgence KYC Profil A', assignedTo: 'Jean Dupont', status: 'IN_PROGRESS', deadline: '2026-07-10', type: 'INTERNAL' },
]

const mockInbox = [
  { id: 'MSG-001', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Nouveau besoin de conseil', date: 'Aujourd\'hui 10:30', status: 'NOUVEAU', isAnonyme: false, client: 'ACME Corp' },
  { id: 'MSG-002', from: 'unknown@gmail.com', name: 'Paul Inconnu', subject: 'Candidature Spontanée', date: 'Hier 15:45', status: 'ATTRIBUE', isAnonyme: true, assignedTo: 'Alice Martin' },
  { id: 'MSG-003', from: 'rh@totalenergies.fr', name: 'TotalEnergies RH', subject: 'Modification audit', date: 'Hier 09:12', status: 'INITIE', isAnonyme: false, client: 'TotalEnergies', dossierId: 'DOS-24-005' },
  { id: 'MSG-004', from: 'contact@acme.com', name: 'ACME Corp', subject: 'Bilan comptable', date: 'Il y a 2 jours', status: 'CONTROLE', isAnonyme: false, client: 'ACME Corp' },
  { id: 'MSG-005', from: 'legal@acme.com', name: 'ACME Corp', subject: 'Contrat', date: 'Il y a 3 jours', status: 'A_CORRIGER', isAnonyme: false, client: 'ACME Corp' },
]

const mockClients = [
  { id: 'CLI-001', name: 'ACME Corp', email: 'contact@acme.com', dossiers: 2 },
  { id: 'CLI-002', name: 'TotalEnergies', email: 'rh@totalenergies.fr', dossiers: 1 },
]

// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    'NOUVEAU': { text: 'Nouveau', class: 'badge-new' },
    'TO_ASSIGN': { text: 'À attribuer', class: 'badge-warning' },
    'IN_PROGRESS': { text: 'En cours', class: 'badge-progress' },
    'WAITING_DOCS': { text: 'Attente Docs', class: 'badge-warning' },
    'IN_REVIEW': { text: 'En contrôle', class: 'badge-new' },
    'VALIDATED': { text: 'Validé', class: 'badge-success' }
  }
  const s = map[status] || { text: status, class: 'badge-new' }
  return <span className={`badge ${s.class}`}>{s.text}</span>
}

function getPriorityBadge(priority) {
  const map = {
    'URGENT': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--danger)', fontWeight: 600}}><AlertCircle size={14} /> Urgent</span>,
    'NORMAL': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 600}}><CheckCircle size={14} /> Normal</span>,
    'LOW': <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: 600}}><Clock size={14} /> Faible</span>
  }
  return map[priority] || priority
}

function getRoleBadge(role) {
  const map = {
    'ADMIN': { text: 'Administrateur', bg: '#4C1D95', color: '#FFF' },
    'ASSOCIÉ': { text: 'Associé (Équipe)', bg: '#319795', color: '#FFF' }
  }
  const s = map[role] || { text: role, bg: '#718096', color: '#FFF' }
  return <span className="badge" style={{backgroundColor: s.bg, color: s.color}}>{s.text}</span>
}

function getMessageStatusBadge(status) {
  const map = {
    'NOUVEAU': { text: 'Nouveau', bg: '#E53E3E', color: '#FFF' },
    'ATTRIBUE': { text: 'Attribué', bg: '#DD6B20', color: '#FFF' },
    'INITIE': { text: 'Initié', bg: '#3182CE', color: '#FFF' },
    'CONTROLE': { text: 'Contrôlé', bg: '#805AD5', color: '#FFF' },
    'A_CORRIGER': { text: 'À corriger', bg: '#E53E3E', color: '#FFF' },
    'REATTRIBUE': { text: 'Réattribué', bg: '#DD6B20', color: '#FFF' },
    'TERMINE': { text: 'Terminé', bg: '#38A169', color: '#FFF' },
    'ARCHIVE': { text: 'Archivé', bg: '#718096', color: '#FFF' }
  }
  const s = map[status] || { text: status, bg: '#718096', color: '#FFF' }
  return <span className="badge" style={{backgroundColor: s.bg, color: s.color}}>{s.text}</span>
}

// --- VIEWS ---

const DashboardPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tableau de bord</h1>
          <p style={{color: 'var(--text-muted)'}}>Vue d'ensemble de vos dossiers et tâches</p>
        </div>
        <button className="btn btn-primary">Nouveau Dossier</button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Dossiers à qualifier</h3>
          <p style={{fontSize: '2rem', fontWeight: 700}}>12</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Dossiers en cours</h3>
          <p style={{fontSize: '2rem', fontWeight: 700}}>34</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Urgences (Retards potentiels)</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--danger)'}}>5</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Validés cette semaine</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, color: 'var(--success)'}}>18</p>
        </div>
      </div>

      <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>Dossiers Récents</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Type de besoin</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDossiers.slice(0, 4).map(d => (
              <tr key={d.id}>
                <td style={{fontWeight: 500}}>{d.id}</td>
                <td>{d.client}</td>
                <td>{d.type}</td>
                <td>{getStatusBadge(d.status)}</td>
                <td>{getPriorityBadge(d.priority)}</td>
                <td style={{color: 'var(--text-muted)'}}>{d.date}</td>
                <td>
                  <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Consulter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const InboxPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Boîte de Réception Centrale</h1>
          <p style={{color: 'var(--text-muted)'}}>Emails synchronisés depuis contact@menua.com (Visibilité Admin)</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Expéditeur</th>
              <th>Sujet</th>
              <th>Statut CRM</th>
              <th>Liaison</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockInbox.map(m => (
              <tr key={m.id}>
                <td>
                  <strong style={{display: 'block'}}>{m.name}</strong>
                  <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{m.from}</span>
                </td>
                <td style={{fontWeight: m.status === 'NOUVEAU' ? 600 : 400}}>{m.subject}</td>
                <td>{getMessageStatusBadge(m.status)}</td>
                <td>
                  {m.isAnonyme ? (
                    <span style={{color: 'var(--warning)', fontSize: '0.875rem'}}>Anonyme (À qualifier)</span>
                  ) : (
                    <span style={{color: 'var(--success)', fontWeight: 500, fontSize: '0.875rem'}}>Client: {m.client}</span>
                  )}
                </td>
                <td style={{color: 'var(--text-muted)'}}>{m.date}</td>
                <td>
                  <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Traiter</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const DossiersPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Tous les Dossiers</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion complète et cycle de vie</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Docs</th>
              <th>Date Réception</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDossiers.map(d => (
              <tr key={d.id}>
                <td style={{fontWeight: 500}}>{d.id}</td>
                <td><strong style={{display: 'block'}}>{d.client}</strong></td>
                <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{d.contact}</span></td>
                <td>{getStatusBadge(d.status)}</td>
                <td>{getPriorityBadge(d.priority)}</td>
                <td>{d.documents} fichiers</td>
                <td style={{color: 'var(--text-muted)'}}>{d.date}</td>
                <td>
                  <button style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TasksPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Missions & Tâches</h1>
          <p style={{color: 'var(--text-muted)'}}>Attributions internes et ordres de mission</p>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID Tâche</th>
              <th>Dossier Lié</th>
              <th>Description</th>
              <th>Assigné à</th>
              <th>Statut</th>
              <th>Type</th>
              <th>Échéance</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map(t => (
              <tr key={t.id}>
                <td style={{fontWeight: 500}}>{t.id}</td>
                <td style={{color: 'var(--primary)', fontWeight: 500}}>{t.dossierId}</td>
                <td>{t.name}</td>
                <td>{t.assignedTo}</td>
                <td>{getStatusBadge(t.status)}</td>
                <td><span className="badge" style={{background: '#E2E8F0', color: '#4A5568'}}>{t.type}</span></td>
                <td style={{color: 'var(--danger)', fontWeight: 500}}>{t.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const UsersPage = () => {
  const [tab, setTab] = useState('associes');

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Annuaire CRM</h1>
          <p style={{color: 'var(--text-muted)'}}>Gestion des équipes internes et des clients</p>
        </div>
        <button className="btn btn-primary">{tab === 'associes' ? 'Ajouter un Associé' : 'Ajouter un Client'}</button>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem'}}>
        <button onClick={() => setTab('associes')} style={{background: 'none', border: 'none', fontSize: '1rem', fontWeight: tab === 'associes' ? 600 : 400, color: tab === 'associes' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: tab === 'associes' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.5rem'}}>Équipe (Associés)</button>
        <button onClick={() => setTab('clients')} style={{background: 'none', border: 'none', fontSize: '1rem', fontWeight: tab === 'clients' ? 600 : 400, color: tab === 'clients' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: tab === 'clients' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.5rem'}}>Clients</button>
      </div>

      <div className="table-wrapper">
        {tab === 'associes' ? (
          <table>
            <thead>
              <tr>
                <th>Nom / Email</th>
                <th>Rôle / Profil</th>
                <th>Statut</th>
                <th>Dernière Connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
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
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Éditer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Entreprise / Nom</th>
                <th>Email Contact</th>
                <th>Dossiers Actifs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map(c => (
                <tr key={c.id}>
                  <td><strong style={{display: 'block'}}>{c.name}</strong></td>
                  <td><span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{c.email}</span></td>
                  <td><span className="badge badge-new">{c.dossiers}</span></td>
                  <td><button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Voir Profil</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function App() {
  const location = useLocation();
  const [user] = useState(MOCK_USER);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold'}}>M</div>
          <span style={{fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.5px'}}>MENUA CRM</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link to="/dossiers" className={`nav-item ${location.pathname.includes('/dossiers') ? 'active' : ''}`}>
            <Files size={20} />
            Dossiers
          </Link>
          <Link to="/inbox" className={`nav-item ${location.pathname.includes('/inbox') ? 'active' : ''}`}>
            <Mail size={20} />
            Boîte de Réception
          </Link>
          {/* SÉPARATION DES ACCÈS (Muraille de Chine visuelle) */}
          {['ADMIN', 'SUPERVISOR'].includes(user.role) && (
            <Link to="/tasks" className={`nav-item ${location.pathname.includes('/tasks') ? 'active' : ''}`}>
              <Briefcase size={20} />
              Missions & Tâches
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/users" className={`nav-item ${location.pathname.includes('/users') ? 'active' : ''}`}>
              <Users size={20} />
              Annuaire CRM
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
              <Settings size={20} />
              Configuration
            </Link>
          )}
        </nav>
        <div style={{padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
            <div style={{width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{fontSize: '0.875rem', fontWeight: 500}}>{user.name}</div>
              <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)'}}>{user.role}</div>
            </div>
          </div>
          <button className="btn btn-outline" style={{width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Rechercher un dossier, client, SIRET..." 
              style={{border: 'none', background: 'transparent', outline: 'none', width: '350px', fontSize: '0.875rem'}}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            <div style={{fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
               <span style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block'}}></span>
               Serveur Connecté
            </div>
            <button style={{background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center'}}>
              <Bell size={20} color="var(--text-main)" />
              <span style={{position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%'}}></span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dossiers" element={<DossiersPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem'}}>Configuration</h1>
                <div className="card">
                  <p>Réglages de la plateforme (En construction)</p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
