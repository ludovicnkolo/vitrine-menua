import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { getSafeApiUrl, apiFetch } from "../utils/helpers";

const TYPE_ICON = {
  TACHE_ASSIGNEE: { icon: "📋", color: "#6366F1" },
  TACHE_A_CORRIGER: { icon: "🔁", color: "#EF4444" },
  TACHE_A_VERIFIER: { icon: "🔍", color: "#F59E0B" },
  TACHE_FINALISER: { icon: "✅", color: "#10B981" },
  TACHE_CLOTUREE: { icon: "🏁", color: "#10B981" },
  MISSION_TERMINE: { icon: "🎯", color: "#6366F1" },
  DOSSIER_CLOTURE: { icon: "📁", color: "#4B5563" },
  NOUVEAU_MESSAGE: { icon: "💬", color: "#3B82F6" },
  DEMANDE_DOCUMENT: { icon: "📥", color: "#F59E0B" },
  DEPOT_DOCUMENT_CLIENT: { icon: "📤", color: "#10B981" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} j`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const pollRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await apiFetch("/api/crm/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    pollRef.current = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/crm/notifications/${id}/read`, "PATCH");
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const markAllRead = async () => {
    try {
      setLoading(true);
      await apiFetch("/api/crm/notifications/read-all", "PATCH");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const meta = (type) => TYPE_ICON[type] || { icon: "🔔", color: "#6366F1" };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          const wasOpen = open;
          setOpen((o) => !o);
          // Marquer toutes comme lues à l'ouverture du panneau
          if (!wasOpen && unreadCount > 0) {
            markAllRead();
          }
        }}
        title="Notifications"
        className="relative cursor-pointer p-2 flex items-center justify-center" style={{background:"transparent",border:"none",borderRadius:"0.5rem",color:"var(--text-main, #1e293b)",transition:"background 0.2s"}}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--bg-hover, #f1f5f9)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Bell size={22} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute font-bold flex items-center justify-center" style={{top:2,right:2,background:"#EF4444",color:"#fff",borderRadius:"999px",minWidth:18,height:18,fontSize:"0.65rem",padding:"0 4px",lineHeight:1}}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute flex flex-col"
          style={{
            top: "calc(100% + 8px)",
            right: 0,
            width: 370,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: 480,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center" style={{padding:"0.875rem 1rem",borderBottom:"1px solid #f1f5f9",background:"#fafafa"}}
          >
            <span
              className="font-semibold" style={{fontSize:"0.9rem",color:"#1e293b"}}
            >
              Notifications{" "}
              {unreadCount > 0 && (
                <span style={{ color: "#6366F1" }}>({unreadCount})</span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={loading}
                className="cursor-pointer font-semibold flex items-center" style={{background:"none",border:"none",color:"#6366F1",fontSize:"0.75rem",gap:"0.25rem"}}
              >
                <CheckCheck size={14} /> Tout marquer lu
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div
                className="p-8 text-center" style={{color:"#94a3b8"}}
              >
                <Bell
                  size={32}
                  className="mb-2" style={{opacity:0.4}}
                />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((n) => {
                const m = meta(n.type);
                return (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      padding: "0.875rem 1rem",
                      borderBottom: "1px solid #f8fafc",
                      background: n.isRead ? "transparent" : "#f0f4ff",
                      transition: "background 0.15s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = n.isRead
                        ? "#f8fafc"
                        : "#e8eeff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = n.isRead
                        ? "transparent"
                        : "#f0f4ff")
                    }
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: m.color + "18",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      {m.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: n.isRead ? 500 : 700,
                          fontSize: "0.825rem",
                          color: "#1e293b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {n.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.775rem",
                          color: "#64748b",
                          marginTop: 2,
                        }}
                      >
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#94a3b8",
                          marginTop: 3,
                        }}
                      >
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>

                    {/* Mark read button */}
                    {!n.isRead && (
                      <button
                        onClick={() => markRead(n.id)}
                        title="Marquer comme lu"
                        className="cursor-pointer" style={{background:"none",border:"none",color:"#6366F1",padding:"0.25rem",borderRadius:"50%"}}
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
