import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import GlobalAlerts from "./components/GlobalAlerts";
import NotificationBell from "./components/NotificationBell";
import "./utils/AlertService"; // initialize overrides
import { socket } from "./utils/socket";

function MainApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    const handleForceLogout = (data: { userId?: string }) => {
      if (data?.userId && user?.id === data.userId) {
        console.warn("[AUTH] Déconnexion forcée par l'administrateur (réinitialisation mot de passe).");
        logout("reset_by_admin");
      }
    };

    socket.on("force_logout", handleForceLogout);

    return () => {
      socket.off("force_logout", handleForceLogout);
      socket.disconnect();
    };
  }, [isAuthenticated, user, logout]);

  // Si l'utilisateur n'est pas connecté : afficher UNIQUEMENT les vues publiques (login, etc.)
  // Pas de sidebar, pas de topbar, pas de conteneur CRM
  if (!isAuthenticated || !user) {
    return (
      <div className="auth-wrapper min-h-screen w-full flex flex-col">
        <GlobalAlerts />
        <AppRoutes />
      </div>
    );
  }

  // Si l'utilisateur est un Client connecté : afficher l'Espace Client dédié sans la sidebar CRM interne
  if (user.role === "Client") {
    return (
      <div className="client-portal-layout min-h-screen w-full bg-[#f8fafc] text-slate-800">
        <GlobalAlerts />
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <GlobalAlerts />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="main-content">
        <div
          className="topbar-header flex justify-between items-center sticky"
          style={{
            padding: "0.75rem 1.5rem 0",
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
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
