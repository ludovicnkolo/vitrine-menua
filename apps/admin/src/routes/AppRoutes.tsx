import React from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasAccess } from "../constants/roles";

import DashboardPage from "../pages/DashboardPage";
import InboxPage from "../pages/InboxPage";
import UsersSpacePage from "../pages/UsersSpacePage";
import SystemSpacePage from "../pages/SystemSpacePage";
import WorkspacePage from "../pages/WorkspacePage";
import CMSPage from "../pages/CMSPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SetupPasswordPage from "../pages/SetupPasswordPage";
import MagicLinkDropPage from "../pages/MagicLinkDropPage";
import ClientPortalPage from "../pages/ClientPortalPage";

// Composant pont pour compatibilité /magic-drop/:token -> /depot/:token
function MagicDropRedirect() {
  const { token } = useParams();
  return <Navigate to={`/depot/${token}`} replace />;
}

export default function AppRoutes() {
  const { user, isAuthenticated, login } = useAuth();
  const location = useLocation();

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LIENS MAGIQUES SANS COMPTE (DÉPÔT / RESTITUTION DIRECT)
  // Nomination unique : /depot/:token (avec compatibilité /magic-drop/:token)
  // ═══════════════════════════════════════════════════════════════════════════
  if (location.pathname.startsWith("/depot/") || location.pathname.startsWith("/magic-drop/")) {
    return (
      <Routes>
        <Route path="/depot/:token" element={<MagicLinkDropPage />} />
        <Route path="/magic-drop/:token" element={<MagicDropRedirect />} />
      </Routes>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. UTILISATEURS NON CONNECTÉS
  // Base URL "/" : Redirection directe vers l'espace collaborateur de connexion (/app/login)
  // Collaborateurs : /app/login
  // Clients : /client/login
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated || !user) {
    return (
      <Routes>
        {/* Base URL "/" : Redirection vers la page de connexion collaborateur */}
        <Route path="/" element={<Navigate to="/app/login" replace />} />

        {/* Procédure d'activation / réinitialisation par token */}
        <Route path="/setup-password" element={<SetupPasswordPage />} />

        {/* ── A. ESPACE CLIENT ── */}
        <Route path="/client/login" element={<LoginPage onLogin={login} portal="client" />} />
        <Route path="/client/forgot-password" element={<ForgotPasswordPage portal="client" />} />
        <Route path="/portal/login" element={<Navigate to="/client/login" replace />} />
        <Route path="/client-login" element={<Navigate to="/client/login" replace />} />
        <Route path="/client" element={<Navigate to="/client/login" replace />} />
        <Route path="/espace-client" element={<Navigate to="/client/login" replace />} />
        <Route path="/portal" element={<Navigate to="/client/login" replace />} />
        <Route path="/portal/documents" element={<Navigate to="/client/login" replace />} />

        {/* ── B. ÉQUIPE & COLLABORATEURS ── */}
        <Route path="/app/login" element={<LoginPage onLogin={login} portal="team" />} />
        <Route path="/app/forgot-password" element={<ForgotPasswordPage portal="team" />} />
        <Route path="/forgot-password" element={<Navigate to="/app/forgot-password" replace />} />
        <Route path="/login" element={<Navigate to="/app/login" replace />} />
        <Route path="/staff/login" element={<Navigate to="/app/login" replace />} />
        <Route path="/staff" element={<Navigate to="/app/login" replace />} />
        <Route path="/app" element={<Navigate to="/app/login" replace />} />
        <Route path="/app/*" element={<Navigate to="/app/login" replace />} />

        {/* Redirection intelligente pour toute autre URL vers l'espace collaborateur */}
        <Route path="*" element={<Navigate to="/app/login" replace />} />
      </Routes>
    );
  }

  const role = user.role;
  const isAdminTech = role === "Administrateur technique";

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. UTILISATEUR CONNECTÉ : ESPACE CLIENT
  // Nomination unique : /portal (et /portal/documents)
  // ═══════════════════════════════════════════════════════════════════════════
  if (role === "Client") {
    return (
      <Routes>
        {/* Racine et routes client redirigent vers /portal */}
        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="/portal" element={<ClientPortalPage user={user} />} />
        <Route path="/portal/documents" element={<Navigate to="/portal" replace />} />
        <Route path="/client" element={<Navigate to="/portal" replace />} />
        <Route path="/client/login" element={<Navigate to="/portal" replace />} />
        <Route path="/app/login" element={<Navigate to="/portal" replace />} />
        <Route path="/login" element={<Navigate to="/portal" replace />} />
        <Route path="/espace-client" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. UTILISATEURS CONNECTÉS : ÉQUIPE & COLLABORATEURS (CRM)
  // Nomination unique : /app/dashboard
  // ═══════════════════════════════════════════════════════════════════════════
  const getStaffDefaultComponent = () => {
    if (hasAccess.toGlobal(role)) return <DashboardPage />;
    if (isAdminTech) return <SystemSpacePage userRole={role} />;
    return <WorkspacePage userRole={role} />;
  };

  return (
    <Routes>
      {/* Base URL "/" : Session Collaborateur active -> Redirection automatique vers /app/dashboard */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

      {/* ── Tableaux de bord & Espaces CRM ── */}
      <Route path="/app/dashboard" element={getStaffDefaultComponent()} />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

      {hasAccess.toMessage(role) && (
        <>
          <Route path="/app/inbox" element={<InboxPage userRole={role} />} />
          <Route path="/inbox" element={<Navigate to="/app/inbox" replace />} />
        </>
      )}

      {hasAccess.toWorkspace(role) && (
        <>
          <Route path="/app/workspace" element={<WorkspacePage userRole={role} />} />
          <Route path="/workspace" element={<Navigate to="/app/workspace" replace />} />
          <Route path="/dossiers" element={<Navigate to="/app/workspace" replace />} />
          <Route path="/taches" element={<Navigate to="/app/workspace" replace />} />
          <Route path="/tasks" element={<Navigate to="/app/workspace" replace />} />
        </>
      )}

      {hasAccess.toUsers(role) && (
        <>
          <Route path="/app/users-space" element={<UsersSpacePage />} />
          <Route path="/users-space" element={<Navigate to="/app/users-space" replace />} />
          <Route path="/users" element={<Navigate to="/app/users-space" replace />} />
        </>
      )}

      {hasAccess.toSystem(role) && (
        <>
          <Route path="/app/system-space" element={<SystemSpacePage userRole={role} />} />
          <Route path="/system-space" element={<Navigate to="/app/system-space" replace />} />
          <Route path="/roles" element={<Navigate to="/app/system-space" replace />} />
          <Route path="/audit" element={<Navigate to="/app/system-space" replace />} />
        </>
      )}

      {hasAccess.toCMS(role) && (
        <>
          <Route path="/app/cms" element={<CMSPage />} />
          <Route path="/cms" element={<Navigate to="/app/cms" replace />} />
        </>
      )}

      {/* Redirections de sécurité des pages d'authentification vers le Dashboard */}
      <Route path="/app/login" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/staff/login" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/client/login" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/portal" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/settings" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
