import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  Users,
  Settings,
  Inbox,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { getSafeApiUrl } from "./utils/helpers";
import { useTranslation } from "react-i18next";

import DashboardPage from "./pages/DashboardPage";
import DossiersPage from "./pages/DossiersPage";
import InboxPage from "./pages/InboxPage";
import TasksPage from "./pages/TasksPage";
import TachesPage from "./pages/TachesPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import AuditPage from "./pages/AuditPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SetupPasswordPage from "./pages/SetupPasswordPage";
import WorkspacePage from "./pages/WorkspacePage";
import UsersSpacePage from "./pages/UsersSpacePage";
import SystemSpacePage from "./pages/SystemSpacePage";
import CMSPage from "./pages/CMSPage";
import MagicLinkDropPage from "./pages/MagicLinkDropPage";
import GlobalAlerts from "./components/GlobalAlerts";
import NotificationBell from "./components/NotificationBell";
import "./utils/AlertService"; // initialize overrides

// 2. Intercepteur global de fetch pour injecter les credentials (cookies) et attraper les 401 / 403
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    let [url, options] = args;
    options = options || {};
    options.credentials = "include"; // Forcer l'envoi du cookie HttpOnly
    
    // Nettoyer les anciens headers Authorization qui pourraient valoir Bearer null
    if (options.headers) {
      const headersObj = new Headers(options.headers);
      if (headersObj.has("Authorization")) {
        headersObj.delete("Authorization");
      }
      // Reconstruire l'objet simple pour éviter les soucis avec certains codes
      const cleanHeaders = {};
      headersObj.forEach((value, key) => { cleanHeaders[key] = value; });
      options.headers = cleanHeaders;
    }

    const response = await originalFetch(url, options);
    // Si l'utilisateur a été rendu inactif ou son token est expiré, le backend renverra 401.
    if (response.status === 401) {
      const clone = response.clone();
      try {
        const data = await clone.json();
        if (data?.action === "FORCE_LOGOUT" || response.status === 401) {
          console.error(
            "Accès révoqué ou session expirée. Déconnexion forcée.",
          );
          // Redirection vers login
          sessionStorage.removeItem("adminUser");
          window.location.href = "/?logout=expired";
        }
      } catch (e) {
        sessionStorage.removeItem("adminUser");
        window.location.href = "/?logout=expired";
      }
    }
    return response;
  } catch (err) {
    throw err;
  }
};

const MOCK_USER = {
  id: "U-001",
  name: "Marie Claire",
  role: "ADMIN",
  email: "m.claire@menua.fr",
  status: "Actif",
  lastLogin: "Il y a 2h",
};

function App() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(
    i18n.language?.startsWith("en") ? "en" : "fr",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("adminUser"),
  );
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("adminUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem("adminTheme") === "dark") {
      document.body.classList.add("dark");
    }
    // Nettoyage de sécurité : Supprimer les anciens tokens persistants
    if (
      localStorage.getItem("adminToken") ||
      localStorage.getItem("adminUser")
    ) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
  }, []);

  const handleLogout = async (reason = "") => {
    try {
      await fetch(getSafeApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignorer l'erreur réseau — on se déconnecte quand même
    }
    sessionStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = reason ? `/?logout=${reason}` : "/"; // Force reload to clear all states and redirect to login
  };

  // --- HAUTE SÉCURITÉ : Intercepteur global & Déconnexion pour inactivité ---
  useEffect(() => {
    if (!user) return;

    // 1. Déconnexion automatique après 1h (3600000 ms) d'inactivité
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.warn("Déconnexion automatique pour inactivité (1h).");
        handleLogout();
      }, 3600000); // 1 hour
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) =>
      document.addEventListener(event, resetTimer, true),
    );
    resetTimer(); // Init

    // 1.b Ping continu pour détecter la révocation instantanée du compte ET les changements de rôle
    const pingInterval = setInterval(async () => {
      try {
        const res = await window.fetch(getSafeApiUrl("/api/auth/verify"), {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          // Si le rôle a changé en BD → déconnexion forcée pour re-login avec le bon rôle
          if (data.roleChanged === true) {
            console.warn(
              "Rôle modifié par l'administrateur. Reconnexion requise.",
            );
            handleLogout();
          }
        }
        // Les erreurs 401/403 sont déjà gérées par l'intercepteur ci-dessous
      } catch (e) {
        // Ignorer les erreurs réseau pures (ex: serveur en cours de redémarrage)
      }
    }, 15000); // Toutes les 15 secondes



    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer, true),
      );
      clearTimeout(inactivityTimer);
      clearInterval(pingInterval);
    };
  }, [user]);

  const handleLogin = (userData) => {

    // Validation stricte par liste blanche et regex pour contrer l'empoisonnement du stockage (S8475)
    const ALLOWED_ROLES = [
      "Super-administrateur",
      "Responsable opérationnel",
      "Relecteur",
      "Collaborateur",
      "Administrateur technique",
      "ADMIN",
      "SUPERVISOR",
      "USER",
      "SANS ROLE",
    ];

    const role = String(userData?.role || "SANS ROLE").trim();
    if (!ALLOWED_ROLES.includes(role)) {
      console.error("Rôle utilisateur non autorisé.");
      return;
    }

    const email = String(userData?.email || "").trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.error("Email invalide.");
      return;
    }

    const id = String(userData?.id || "").replace(/[^a-zA-Z0-9-]/g, "");
    if (!id || id.length > 50) {
      console.error("ID invalide.");
      return;
    }

    const name = String(userData?.name || "")
      .trim()
      .replace(/[<>]/g, "");

    const cleanUserData = { id, email, name, role };

    sessionStorage.setItem("adminUser", JSON.stringify(cleanUserData)); // NOSONAR
    setIsAuthenticated(true);
    setUser(cleanUserData);
  };

  // handleLogout is defined above the useEffects

  // handleLogout is defined above the useEffects

  if (location.pathname.startsWith("/magic-drop/")) {
    return (
      <Routes>
        <Route path="/magic-drop/:token" element={<MagicLinkDropPage />} />
      </Routes>
    );
  }

  if (!isAuthenticated || !user) {
    if (location.pathname === "/forgot-password") {
      return (
        <Routes>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      );
    }
    if (location.pathname.startsWith("/setup-password")) {
      return (
        <Routes>
          <Route path="/setup-password" element={<SetupPasswordPage />} />
        </Routes>
      );
    }
    if (
      location.pathname !== "/" &&
      !location.pathname.startsWith("/magic-drop/") &&
      !location.pathname.startsWith("/setup-password")
    ) {
      window.location.replace("/");
      return null;
    }
    return <LoginPage onLogin={handleLogin} />;
  }

  // ─── RBAC — Définition des droits par rôle ──────────────────────────────────
  const role = user.role;
  const isSuperAdmin = role === "Super-administrateur" || role === "ADMIN";
  const isRespOp = role === "Responsable opérationnel";
  const isRelecteur = role === "Relecteur";
  const isCollaborateur = role === "Collaborateur";
  const isAdminTech = role === "Administrateur technique";

  // Visibilité des onglets sidebar
  const canSeeGlobal = isSuperAdmin || isRespOp;
  const canSeeMessage =
    isSuperAdmin || isRespOp || isRelecteur || isCollaborateur;
  const canSeeWorkspace =
    isSuperAdmin || isRespOp || isRelecteur || isCollaborateur;
  const canSeeUsers = isSuperAdmin;
  const canSeeSystem =
    isSuperAdmin || isAdminTech || isRespOp || isRelecteur || isCollaborateur;
  const canSeeCMS = isSuperAdmin; // Espace site web: Super-Admin uniquement

  // Passer le rôle en prop pour filtrer le contenu à l'intérieur des pages
  const userRoleForPages = role;

  return (
    <div className="app-layout">
      <GlobalAlerts />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                fontWeight: "bold",
              }}
            >
              M
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "-0.5px",
              }}
            >
              MENUA CRM
            </span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>
        {/* Nav compacte — hauteur naturelle, ne grandit pas */}
        <nav style={{ padding: "1rem 0", flex: "0 0 auto" }}>
          {canSeeGlobal && (
            <Link
              to="/"
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              <LayoutDashboard size={20} />
              {t("nav.global")}
            </Link>
          )}

          {canSeeMessage && (
            <Link
              to="/inbox"
              className={`nav-item ${location.pathname.includes("/inbox") ? "active" : ""}`}
            >
              <Inbox size={20} />
              {t("nav.message")}
            </Link>
          )}

          {canSeeWorkspace && (
            <Link
              to="/workspace"
              className={`nav-item ${location.pathname.includes("/workspace") ? "active" : ""}`}
            >
              <Files size={20} />
              {t("nav.workspace")}
            </Link>
          )}

          {canSeeUsers && (
            <Link
              to="/users-space"
              className={`nav-item ${location.pathname.includes("/users-space") ? "active" : ""}`}
            >
              <Users size={20} />
              {t("nav.userSpace")}
            </Link>
          )}

          {canSeeSystem && (
            <Link
              to="/system-space"
              className={`nav-item ${location.pathname.includes("/system-space") ? "active" : ""}`}
            >
              <Settings size={20} />
              {t("nav.systemSpace")}
            </Link>
          )}

          {canSeeCMS && (
            <Link
              to="/cms"
              className={`nav-item ${location.pathname.includes("/cms") ? "active" : ""}`}
            >
              <Globe size={20} />
              {t("nav.websiteSpace")}
            </Link>
          )}
        </nav>
        {/* Profil juste après les onglets — pas de grand vide révélateur */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {user.name}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}
              >
                {user.role}
              </div>
            </div>
          </div>
          {/* Sélecteur de langue déplacé vers Espace système -> Configuration */}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline"
            style={{
              width: "100%",
              borderColor: "rgba(255,255,255,0.2)",
              color: "white",
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LogOut size={16} /> {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar with notification bell */}
        <div
          className="topbar-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1.5rem 0",
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "var(--bg-main, #f8fafc)",
            borderBottom: "1px solid transparent",
          }}
        >
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div style={{ marginLeft: "auto" }}>
            <NotificationBell />
          </div>
        </div>
        <div className="page-content">
          <Routes>
            {/* Routes conditionnelles selon rôle */}
            {canSeeGlobal && <Route path="/" element={<DashboardPage />} />}
            {/* AdminTech → Espace système | Autres rôles sans global → Espace travail */}
            {!canSeeGlobal && isAdminTech && (
              <Route
                path="/"
                element={<SystemSpacePage userRole={userRoleForPages} />}
              />
            )}
            {!canSeeGlobal && !isAdminTech && (
              <Route
                path="/"
                element={<WorkspacePage userRole={userRoleForPages} />}
              />
            )}

            {canSeeMessage && (
              <Route
                path="/inbox"
                element={<InboxPage userRole={userRoleForPages} />}
              />
            )}
            {canSeeWorkspace && (
              <Route
                path="/workspace"
                element={<WorkspacePage userRole={userRoleForPages} />}
              />
            )}
            {canSeeUsers && (
              <Route path="/users-space" element={<UsersSpacePage />} />
            )}
            {canSeeSystem && (
              <Route
                path="/system-space"
                element={<SystemSpacePage userRole={userRoleForPages} />}
              />
            )}
            {canSeeCMS && <Route path="/cms" element={<CMSPage />} />}

            {/* Redirections sécurisées pour anciennes routes (bloque l'accès non autorisé par URL directe) */}
            <Route
              path="/dossiers"
              element={
                canSeeWorkspace ? (
                  <Navigate to="/workspace" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/taches"
              element={
                canSeeWorkspace ? (
                  <Navigate to="/workspace" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/tasks"
              element={
                canSeeWorkspace ? (
                  <Navigate to="/workspace" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/users"
              element={
                canSeeUsers ? (
                  <Navigate to="/users-space" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/roles"
              element={
                canSeeSystem ? (
                  <Navigate to="/system-space" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/audit"
              element={
                canSeeSystem ? (
                  <Navigate to="/system-space" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/settings" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
