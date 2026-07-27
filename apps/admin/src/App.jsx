import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Files, Users, Settings, Inbox, LogOut } from 'lucide-react';
import { getSafeApiUrl } from './utils/helpers';

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
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || null);
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (localStorage.getItem('adminTheme') === 'dark') {
      document.body.classList.add('dark');
    }
    // Nettoyage de sécurité : Supprimer les anciens tokens persistants
    if (localStorage.getItem('adminToken') || localStorage.getItem('adminUser')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
    window.location.href = '/'; // Force reload to clear all states and redirect to login
  };

  // --- HAUTE SÉCURITÉ : Intercepteur global & Déconnexion pour inactivité ---
  useEffect(() => {
    if (!token) return;

    // 1. Déconnexion automatique après 1h (3600000 ms) d'inactivité
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.warn("Déconnexion automatique pour inactivité (1h).");
        handleLogout();
      }, 3600000); // 1 hour
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, true));
    resetTimer(); // Init

    // 1.b Ping continu pour détecter la révocation instantanée du compte ET les changements de rôle
    const pingInterval = setInterval(async () => {
      try {
        const res = await window.fetch(getSafeApiUrl('/api/auth/verify'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Si le rôle a changé en BD → déconnexion forcée pour re-login avec le bon rôle
          if (data.roleChanged === true) {
            console.warn("Rôle modifié par l'administrateur. Reconnexion requise.");
            handleLogout();
          }
        }
        // Les erreurs 401/403 sont déjà gérées par l'intercepteur ci-dessous
      } catch (e) {
        // Ignorer les erreurs réseau pures (ex: serveur en cours de redémarrage)
      }
    }, 15000); // Toutes les 15 secondes

    // 2. Intercepteur global de fetch pour attraper les 401 / 403 instantanément
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        // Si l'utilisateur a été rendu inactif, le backend renverra 401 ou 403.
        if (response.status === 401 || response.status === 403) {
          const clone = response.clone();
          try {
            const data = await clone.json();
            if (data?.action === 'FORCE_LOGOUT' || response.status === 401 || response.status === 403) {
              console.error("Accès révoqué ou session expirée. Déconnexion forcée.");
              handleLogout();
            }
          } catch (e) {
            handleLogout();
          }
        }
        return response;
      } catch (err) {
        throw err;
      }
    };

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
      clearTimeout(inactivityTimer);
      clearInterval(pingInterval);
      window.fetch = originalFetch;
    };
  }, [token]);

  const handleLogin = (newToken, userData) => {
    // Validation stricte du jeton JWT (Format : 3 parties séparées par un point, base64url)
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    if (!newToken || typeof newToken !== 'string' || !jwtRegex.test(newToken)) {
      console.error('Format de jeton invalide.');
      return;
    }

    // Validation stricte par liste blanche et regex pour contrer l'empoisonnement du stockage (S8475)
    const ALLOWED_ROLES = ['Super-administrateur', 'Responsable opérationnel', 'Relecteur', 'Collaborateur', 'Administrateur technique', 'ADMIN', 'SUPERVISOR', 'USER', 'SANS ROLE'];
    
    const role = String(userData?.role || 'SANS ROLE').trim();
    if (!ALLOWED_ROLES.includes(role)) {
      console.error('Rôle utilisateur non autorisé.');
      return;
    }

    const email = String(userData?.email || '').trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.error('Email invalide.');
      return;
    }

    const id = String(userData?.id || '').replace(/[^a-zA-Z0-9-]/g, '');
    if (!id || id.length > 50) {
      console.error('ID invalide.');
      return;
    }

    const name = String(userData?.name || '').trim().replace(/[<>]/g, "");

    const cleanUserData = { id, email, name, role };

    sessionStorage.setItem('adminToken', newToken);
    sessionStorage.setItem('adminUser', JSON.stringify(cleanUserData)); // NOSONAR
    setToken(newToken);
    setUser(cleanUserData);
  };

  // handleLogout is defined above the useEffects

  if (location.pathname === '/setup-password') {
    return (
      <Routes>
        <Route path="/setup-password" element={<SetupPasswordPage />} />
      </Routes>
    );
  }

  if (!token || !user) {
    if (location.pathname !== '/') {
      window.location.replace('/');
      return null;
    }
    return <LoginPage onLogin={handleLogin} />;
  }

  // ─── RBAC — Définition des droits par rôle ──────────────────────────────────
  const role = user.role;
  const isSuperAdmin   = role === 'Super-administrateur' || role === 'ADMIN';
  const isRespOp       = role === 'Responsable opérationnel';
  const isRelecteur    = role === 'Relecteur';
  const isCollaborateur= role === 'Collaborateur';
  const isAdminTech    = role === 'Administrateur technique';

  // Visibilité des onglets sidebar
  const canSeeGlobal     = isSuperAdmin || isRespOp;
  const canSeeMessage    = isSuperAdmin || isRespOp || isRelecteur || isCollaborateur;
  const canSeeWorkspace  = isSuperAdmin || isRespOp || isRelecteur || isCollaborateur;
  const canSeeUsers      = isSuperAdmin;
  const canSeeSystem     = isSuperAdmin || isAdminTech || isRespOp || isRelecteur || isCollaborateur;

  // Passer le rôle en prop pour filtrer le contenu à l'intérieur des pages
  const userRoleForPages = role;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside style={{
          width: 250,
          backgroundColor: 'var(--primary)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          flexShrink: 0
        }}>
        <div className="sidebar-header">
          <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold'}}>M</div>
          <span style={{fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.5px'}}>MENUA CRM</span>
        </div>
        {/* Nav compacte — hauteur naturelle, ne grandit pas */}
        <nav style={{padding: '1rem 0', flex: '0 0 auto'}}>
          {canSeeGlobal && (
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              Espace global
            </Link>
          )}

          {canSeeMessage && (
            <Link to="/inbox" className={`nav-item ${location.pathname.includes('/inbox') ? 'active' : ''}`}>
              <Inbox size={20} />
              Espace message
            </Link>
          )}

          {canSeeWorkspace && (
            <Link to="/workspace" className={`nav-item ${location.pathname.includes('/workspace') ? 'active' : ''}`}>
              <Files size={20} />
              Espace travail
            </Link>
          )}

          {canSeeUsers && (
            <Link to="/users-space" className={`nav-item ${location.pathname.includes('/users-space') ? 'active' : ''}`}>
              <Users size={20} />
              Espace utilisateur
            </Link>
          )}

          {canSeeSystem && (
            <Link to="/system-space" className={`nav-item ${location.pathname.includes('/system-space') ? 'active' : ''}`}>
              <Settings size={20} />
              Espace système
            </Link>
          )}
        </nav>
        {/* Profil juste après les onglets — pas de grand vide révélateur */}
        <div style={{padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1.5rem'}}>
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
            {/* Routes conditionnelles selon rôle */}
            {canSeeGlobal && <Route path="/" element={<DashboardPage />} />}
            {/* AdminTech → Espace système | Autres rôles sans global → Espace travail */}
            {!canSeeGlobal && isAdminTech && <Route path="/" element={<SystemSpacePage userRole={userRoleForPages} />} />}
            {!canSeeGlobal && !isAdminTech && <Route path="/" element={<WorkspacePage userRole={userRoleForPages} />} />}

            {canSeeMessage && <Route path="/inbox" element={<InboxPage userRole={userRoleForPages} />} />}
            {canSeeWorkspace && <Route path="/workspace" element={<WorkspacePage userRole={userRoleForPages} />} />}
            {canSeeUsers && <Route path="/users-space" element={<UsersSpacePage />} />}
            {canSeeSystem && <Route path="/system-space" element={<SystemSpacePage userRole={userRoleForPages} />} />}

            {/* Legacy routes */}
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

