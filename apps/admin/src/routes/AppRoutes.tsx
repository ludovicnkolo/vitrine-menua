import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

export default function AppRoutes() {
  const { user, isAuthenticated, login } = useAuth();
  const location = useLocation();

  if (location.pathname.startsWith("/magic-drop/")) {
    return (
      <Routes>
        <Route path="/magic-drop/:token" element={<MagicLinkDropPage />} />
      </Routes>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ROUTES UTILISATEURS NON CONNECTÉS (DEUX INTERFACES TOTALEMENT SÉPARÉES)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated || !user) {
    return (
      <Routes>
        {/* Procédure d'activation / réinitialisation par token */}
        <Route path="/setup-password" element={<SetupPasswordPage />} />

        {/* ── 1. PORTAIL ET CONNEXION ESPACE CLIENT SÉCURISÉ ────────────────── */}
        <Route path="/client/login" element={<LoginPage onLogin={login} portal="client" />} />
        <Route path="/client/forgot-password" element={<ForgotPasswordPage portal="client" />} />
        <Route path="/client-login" element={<Navigate to="/client/login" replace />} />
        <Route path="/client" element={<Navigate to="/client/login" replace />} />
        <Route path="/espace-client" element={<Navigate to="/client/login" replace />} />

        {/* ── 2. PORTAIL ET CONNEXION ESPACE COLLABORATEUR CRM ──────────────── */}
        <Route path="/login" element={<LoginPage onLogin={login} portal="team" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage portal="team" />} />
        <Route path="/" element={<LoginPage onLogin={login} portal="team" />} />

        {/* Redirection intelligente pour toute autre URL */}
        <Route
          path="*"
          element={
            location.pathname.startsWith("/client") ? (
              <Navigate to="/client/login" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    );
  }

  const role = user.role;
  const isAdminTech = role === "Administrateur technique";

  // ═══════════════════════════════════════════════════════════════════════════
  // ROUTES UTILISATEURS CONNECTÉS
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <Routes>
      {/* Client connecté */}
      {role === "Client" && (
        <>
          <Route path="/" element={<ClientPortalPage user={user} />} />
          <Route path="/client" element={<Navigate to="/" replace />} />
          <Route path="/client/login" element={<Navigate to="/" replace />} />
          <Route path="/espace-client" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* Collaborateurs CRM */}
      {role !== "Client" && hasAccess.toGlobal(role) && <Route path="/" element={<DashboardPage />} />}
      {role !== "Client" && !hasAccess.toGlobal(role) && isAdminTech && (
        <Route path="/" element={<SystemSpacePage userRole={role} />} />
      )}
      {role !== "Client" && !hasAccess.toGlobal(role) && !isAdminTech && (
        <Route path="/" element={<WorkspacePage userRole={role} />} />
      )}

      {hasAccess.toMessage(role) && (
        <Route path="/inbox" element={<InboxPage userRole={role} />} />
      )}
      {hasAccess.toWorkspace(role) && (
        <Route path="/workspace" element={<WorkspacePage userRole={role} />} />
      )}
      {hasAccess.toUsers(role) && (
        <Route path="/users-space" element={<UsersSpacePage />} />
      )}
      {hasAccess.toSystem(role) && (
        <Route path="/system-space" element={<SystemSpacePage userRole={role} />} />
      )}
      {hasAccess.toCMS(role) && <Route path="/cms" element={<CMSPage />} />}

      {/* Redirections sécurisées */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/client/login" element={<Navigate to="/" replace />} />
      <Route path="/dossiers" element={hasAccess.toWorkspace(role) ? <Navigate to="/workspace" replace /> : <Navigate to="/" replace />} />
      <Route path="/taches" element={hasAccess.toWorkspace(role) ? <Navigate to="/workspace" replace /> : <Navigate to="/" replace />} />
      <Route path="/tasks" element={hasAccess.toWorkspace(role) ? <Navigate to="/workspace" replace /> : <Navigate to="/" replace />} />
      <Route path="/users" element={hasAccess.toUsers(role) ? <Navigate to="/users-space" replace /> : <Navigate to="/" replace />} />
      <Route path="/roles" element={hasAccess.toSystem(role) ? <Navigate to="/system-space" replace /> : <Navigate to="/" replace />} />
      <Route path="/audit" element={hasAccess.toSystem(role) ? <Navigate to="/system-space" replace /> : <Navigate to="/" replace />} />
      <Route path="/settings" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
