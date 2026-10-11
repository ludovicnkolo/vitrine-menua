import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Files,
  Users,
  Settings,
  Inbox,
  LogOut,
  Globe,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { hasAccess } from "../../constants/roles";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header justify-between">
          <div className="flex items-center" style={{gap:"0.75rem"}}>
            <div
              className="flex items-center justify-center font-bold" style={{width:32,height:32,borderRadius:8,background:"var(--secondary)",color:"var(--primary)"}}
            >
              M
            </div>
            <span
              className="font-semibold" style={{fontSize:"1.1rem",letterSpacing:"-0.5px"}}
            >
              MENUA CRM
            </span>
          </div>
          <button 
            className="sidebar-close-btn text-white cursor-pointer bg-transparent border-none"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ padding: "1rem 0", flex: "0 0 auto" }}>
          {hasAccess.toGlobal(role) && (
            <Link
              to="/"
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              <LayoutDashboard size={20} />
              {t("nav.global")}
            </Link>
          )}

          {hasAccess.toMessage(role) && (
            <Link
              to="/inbox"
              className={`nav-item ${location.pathname.includes("/inbox") ? "active" : ""}`}
            >
              <Inbox size={20} />
              {t("nav.message")}
            </Link>
          )}

          {hasAccess.toWorkspace(role) && (
            <Link
              to="/workspace"
              className={`nav-item ${location.pathname.includes("/workspace") ? "active" : ""}`}
            >
              <Files size={20} />
              {t("nav.workspace")}
            </Link>
          )}

          {hasAccess.toUsers(role) && (
            <Link
              to="/users-space"
              className={`nav-item ${location.pathname.includes("/users-space") ? "active" : ""}`}
            >
              <Users size={20} />
              {t("nav.userSpace")}
            </Link>
          )}

          {hasAccess.toCMS(role) && (
            <Link
              to="/cms"
              className={`nav-item ${location.pathname.includes("/cms") ? "active" : ""}`}
            >
              <Globe size={20} />
              {t("nav.websiteSpace")}
            </Link>
          )}

          {hasAccess.toSystem(role) && (
            <Link
              to="/system-space"
              className={`nav-item ${location.pathname.includes("/system-space") ? "active" : ""}`}
            >
              <Settings size={20} />
              {t("nav.systemSpace")}
            </Link>
          )}
        </nav>

        <div
          className="p-6 mt-6" style={{borderTop:"1px solid rgba(255,255,255,0.1)"}}
        >
          <div
            className="flex items-center mb-4" style={{gap:"0.75rem"}}
          >
            <div
              className="flex items-center justify-center font-bold" style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.2)"}}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium" style={{fontSize:"0.875rem"}}>
                {user.name}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}
              >
                {user.role}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => logout()}
            className="btn btn-outline w-full text-white flex gap-2 justify-center items-center" style={{borderColor:"rgba(255,255,255,0.2)"}}
          >
            <LogOut size={16} /> {t("nav.logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
