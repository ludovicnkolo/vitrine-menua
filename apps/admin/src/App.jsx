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
  AlertCircle
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

// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    'NEW': { text: 'Nouveau', class: 'badge-new' },
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
    'SUPERVISOR': { text: 'Superviseur', bg: '#2B6CB0', color: '#FFF' },
    'COLLABORATOR': { text: 'Collaborateur', bg: '#319795', color: '#FFF' },
    'PRESTATAIRE': { text: 'Prestataire', bg: '#D69E2E', color: '#FFF' },
    'READ_ONLY': { text: 'Lecture Seule', bg: '#718096', color: '#FFF' }
  }
  const s = map[role] || map['READ_ONLY']
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
  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)'}}>Gestion des Utilisateurs</h1>
          <p style={{color: 'var(--text-muted)'}}>Administrateurs, Superviseurs, Collaborateurs et Prestataires</p>
        </div>
        <button className="btn btn-primary">Ajouter un acteur</button>
      </div>
      <div className="table-wrapper">
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
              Utilisateurs
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
