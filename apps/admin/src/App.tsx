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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

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
