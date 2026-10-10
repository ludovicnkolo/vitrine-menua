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
  const { user } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="app-layout">
      <GlobalAlerts />
      
      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}

      <main className="main-content">
        {user && (
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
        )}
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
