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
          <div className="flex items-center" style={{ gap: "0.75rem" }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-label="Logo MENUA CONSULTING"
            >
              <path d="M4 23L12 5L18 17L12 27L4 23Z" fill="#a38b6d" />
              <path d="M28 23L20 5L14 17L20 27L28 23Z" fill="#D4AF37" />
              <path d="M16 13L20 5L12 5L16 13Z" fill="#e8c766" />
            </svg>
            <span
              className="font-extrabold text-white tracking-tight"
              style={{ fontSize: "0.95rem", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}
            >
              MENUA CONSULTING
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
              to="/app/dashboard"
              className={`nav-item ${location.pathname === "/app/dashboard" || location.pathname === "/" ? "active" : ""}`}
            >
              <LayoutDashboard size={20} />
              {t("nav.global")}
            </Link>
          )}

          {hasAccess.toMessage(role) && (
            <Link
              to="/app/inbox"
              className={`nav-item ${location.pathname.includes("inbox") ? "active" : ""}`}
            >
              <Inbox size={20} />
              {t("nav.message")}
            </Link>
          )}

          {hasAccess.toWorkspace(role) && (
            <Link
              to="/app/workspace"
              className={`nav-item ${location.pathname.includes("workspace") || location.pathname.includes("dossiers") || location.pathname.includes("taches") ? "active" : ""}`}
            >
              <Files size={20} />
              {t("nav.workspace")}
            </Link>
          )}

          {hasAccess.toUsers(role) && (
            <Link
              to="/app/users-space"
              className={`nav-item ${location.pathname.includes("users") ? "active" : ""}`}
            >
              <Users size={20} />
              {t("nav.userSpace")}
            </Link>
          )}

          {hasAccess.toCMS(role) && (
            <Link
              to="/app/cms"
              className={`nav-item ${location.pathname.includes("cms") ? "active" : ""}`}
            >
              <Globe size={20} />
              {t("nav.websiteSpace")}
            </Link>
          )}

          {hasAccess.toSystem(role) && (
            <Link
              to="/app/system-space"
              className={`nav-item ${location.pathname.includes("system") || location.pathname.includes("roles") || location.pathname.includes("audit") ? "active" : ""}`}
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
            className="w-full flex gap-2 justify-center items-center py-2 px-4 rounded-md font-medium text-sm transition-all duration-200"
            style={{
              color: "#FFFFFF",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
          >
            <LogOut size={16} color="#FFFFFF" /> {t("nav.logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
