import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Files, Users, Settings, Inbox, LogOut } from 'lucide-react';

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
import WorkspacePage from './pages/WorkspacePage';
import UsersSpacePage from './pages/UsersSpacePage';
import SystemSpacePage from './pages/SystemSpacePage';

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

  useEffect(() => {
    if (localStorage.getItem('adminTheme') === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  const handleLogin = (newToken, userData) => {
    // Validation stricte du jeton JWT (Format : 3 parties séparées par un point, base64url)
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    if (!newToken || typeof newToken !== 'string' || !jwtRegex.test(newToken)) {
      console.error('Format de jeton invalide.');
      return;
    }
    
    // Nettoyage et validation stricte des données utilisateur
    const cleanUserData = {
      id: String(userData?.id || '').replace(/[^a-zA-Z0-9-]/g, ''),
      email: String(userData?.email || '').trim(),
      name: String(userData?.name || '').trim().replace(/</g, "&lt;"),
      role: String(userData?.role || 'SANS ROLE').trim().replace(/</g, "&lt;")
    };

    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(cleanUserData));
    setToken(newToken);
    setUser(cleanUserData);
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
            Espace global
          </Link>
          
          <Link to="/inbox" className={`nav-item ${location.pathname.includes('/inbox') ? 'active' : ''}`}>
            <Inbox size={20} />
            Espace message
          </Link>
          
          {['Super-administrateur', 'Responsable opérationnel', 'ADMIN', 'SUPERVISOR'].includes(user.role) && (
            <Link to="/workspace" className={`nav-item ${location.pathname.includes('/workspace') ? 'active' : ''}`}>
              <Files size={20} />
              Espace travail
            </Link>
          )}
          
          {['Super-administrateur', 'Administrateur technique', 'ADMIN'].includes(user.role) && (
            <Link to="/users-space" className={`nav-item ${location.pathname.includes('/users-space') ? 'active' : ''}`}>
              <Users size={20} />
              Espace utilisateur
            </Link>
          )}
          
          {['Super-administrateur', 'Administrateur technique', 'ADMIN'].includes(user.role) && (
            <Link to="/system-space" className={`nav-item ${location.pathname.includes('/system-space') ? 'active' : ''}`}>
              <Settings size={20} />
              Espace système
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
          <button type="button" onClick={handleLogout} className="btn btn-outline" style={{width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/users-space" element={<UsersSpacePage />} />
            <Route path="/system-space" element={<SystemSpacePage />} />
            
            {/* Legacy routes kept for safety in case of internal links */}
            <Route path="/dossiers" element={<DossiersPage />} />
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
