import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Files, Users, Settings, Inbox, ChevronDown, LogOut, Shield } from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import DossiersPage from './pages/DossiersPage';
import InboxPage from './pages/InboxPage';
import TasksPage from './pages/TasksPage';
import TachesPage from './pages/TachesPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import AuditPage from './pages/AuditPage';
import LoginPage from './pages/LoginPage';
import SetupPasswordPage from './pages/SetupPasswordPage';

const MOCK_USER = {
  id: 'U-001',
  name: 'Marie Claire',
  role: 'ADMIN',
  email: 'm.claire@menua.fr',
  status: 'Actif',
  lastLogin: 'Il y a 2h'
};

function App() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [isInboxExpanded, setIsInboxExpanded] = useState(true);
  const [isTeamExpanded, setIsTeamExpanded] = useState(true);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  };

  if (location.pathname === '/setup-password') {
    return (
      <Routes>
        <Route path="/setup-password" element={<SetupPasswordPage />} />
      </Routes>
    );
  }

  if (!token || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
          <div className="nav-group" style={{display: 'flex', flexDirection: 'column'}}>
            <button 
              onClick={() => setIsInboxExpanded(!isInboxExpanded)} 
              className={`nav-item ${location.pathname.includes('/inbox') || location.pathname.includes('/tasks') || location.pathname.includes('/taches') ? 'active' : ''}`}
              style={{justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <Inbox size={20} />
                Boîte de réception
              </div>
              <ChevronDown size={16} style={{transform: isInboxExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} />
            </button>
            {isInboxExpanded && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1.25rem', marginTop: '0.25rem'}}>
                <Link to="/inbox" className={`nav-item ${location.pathname.includes('/inbox') ? 'active' : ''}`} style={{padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto'}}>
                  Messages
                </Link>
                {['Super-administrateur', 'Responsable opérationnel', 'ADMIN', 'SUPERVISOR'].includes(user.role) && (
                  <>
                    <Link to="/tasks" className={`nav-item ${location.pathname.includes('/tasks') ? 'active' : ''}`} style={{padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto'}}>
                      Missions
                    </Link>
                    <Link to="/taches" className={`nav-item ${location.pathname.includes('/taches') ? 'active' : ''}`} style={{padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto'}}>
                      Tâches
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          {['Super-administrateur', 'Administrateur technique', 'ADMIN'].includes(user.role) && (
            <div className="nav-group" style={{display: 'flex', flexDirection: 'column'}}>
              <button 
                onClick={() => setIsTeamExpanded(!isTeamExpanded)} 
                className={`nav-item ${location.pathname.includes('/users') || location.pathname.includes('/roles') ? 'active' : ''}`}
                style={{justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <Users size={20} />
                  Gestion Équipe
                </div>
                <ChevronDown size={16} style={{transform: isTeamExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} />
              </button>
              {isTeamExpanded && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1.25rem', marginTop: '0.25rem'}}>
                  <Link to="/users" className={`nav-item ${location.pathname.includes('/users') ? 'active' : ''}`} style={{padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto'}}>
                    Membres
                  </Link>
                  <Link to="/roles" className={`nav-item ${location.pathname.includes('/roles') ? 'active' : ''}`} style={{padding: '0.5rem 1rem', fontSize: '0.9rem', minHeight: 'auto'}}>
                    Rôles
                  </Link>
                </div>
              )}
            </div>
          )}
          {['Super-administrateur', 'Administrateur technique', 'ADMIN'].includes(user.role) && (
            <div className="nav-group" style={{display: 'flex', flexDirection: 'column'}}>
              <Link to="/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
                <Settings size={20} />
                Configuration
              </Link>
              <Link to="/audit" className={`nav-item ${location.pathname.includes('/audit') ? 'active' : ''}`}>
                <Shield size={20} />
                Journal d'Audit
              </Link>
            </div>
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
          <button onClick={handleLogout} className="btn btn-outline" style={{width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dossiers" element={<DossiersPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/taches" element={<TachesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/audit" element={<AuditPage />} />
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
