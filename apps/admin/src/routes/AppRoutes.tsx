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
      return <Navigate to="/" replace />;
    }
    return <LoginPage onLogin={login} />;
  }

  const role = user.role;
  const isAdminTech = role === "Administrateur technique";

  return (
    <Routes>
      {/* Routes conditionnelles selon rôle */}
      {hasAccess.toGlobal(role) && <Route path="/" element={<DashboardPage />} />}
      {!hasAccess.toGlobal(role) && isAdminTech && (
        <Route path="/" element={<SystemSpacePage userRole={role} />} />
      )}
      {!hasAccess.toGlobal(role) && !isAdminTech && (
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
