import { getSafeApiUrl } from "../utils/helpers";
import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Clock,
  Search,
  AlertCircle,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setRawError] = useState(null);
  const setError = (msg) => {
    setRawError(msg);
    if (msg) setTimeout(() => setRawError(null), 3000);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(getSafeApiUrl(`/api/crm/audit`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setError("Accès refusé : droits insuffisants pour consulter le journal d'audit. (Super-administrateur ou Administrateur technique requis)");
        setLogs([]);
        return;
      }
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Erreur HTTP ${res.status} lors de la récupération de l'audit`);
      }
      const data = await res.json();
      const logsArray = Array.isArray(data) ? data : [];
      setLogs(logsArray);
      // Pas d'erreur si la liste est vide — c'est un état légitime
    } catch (err) {
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatStr = (str) => {
    if (!str) return "";
    const formatted = String(str).replace(/_/g, " ").toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Distinct action and user lists for filter dropdowns
  const actionOptions = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      if (l.action) set.add(l.action);
    });
    return Array.from(set);
  }, [logs]);

  const userOptions = useMemo(() => {
    const set = new Set();
    logs.forEach((l) => {
      const name = l.user?.name || l.userName;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [logs]);

  const getPillStyle = (action) => {
    const act = (action || "").toLowerCase();
    if (act.includes("create") || act.includes("créat") || act.includes("ajout")) {
      return { background: "#EFF6FF", color: "#2563EB" }; // Blue pill
    }
    if (act.includes("deconnexion") || act.includes("logout")) {
      return { background: "#FAF5FF", color: "#9333EA" }; // Purple pill
    }
    if (act.includes("login") || act.includes("connexion")) {
      return { background: "#ECFDF5", color: "#059669" }; // Green pill
    }
    if (
      act.includes("mdp") ||
      act.includes("password") ||
      act.includes("reinit") ||
      act.includes("reset") ||
      act.includes("otp")
    ) {
      return { background: "#FEF3C7", color: "#D97706" }; // Amber pill
    }
    if (act.includes("delete") || act.includes("suppr")) {
      return { background: "#FEE2E2", color: "#DC2626" }; // Red pill
    }
    return { background: "#F1F5F9", color: "#475569" };
  };

  const getSecurityBadge = (log) => {
    if (log.ipAddress) return `IP: ${log.ipAddress}`;
    if (log.ip) return `IP: ${log.ip}`;
    if (log.details) {
      const match = log.details.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
      if (match) return `IP: ${match[0]}`;
    }
    const act = (log.action || "").toLowerCase();
    if (act.includes("deconnexion") || act.includes("logout")) {
      return "Session close";
    }
    if (act.includes("reinit") || act.includes("otp") || act.includes("mdp")) {
      if (log.details && log.details.toLowerCase().includes("tentative")) {
        return "Tentative OTP";
      }
      return "OTP Envoyé";
    }
    return "Traçabilité interne";
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (log.action || "").toLowerCase().includes(q) ||
        (log.user?.name || "").toLowerCase().includes(q) ||
        (log.details || "").toLowerCase().includes(q) ||
        (log.targetType || "").toLowerCase().includes(q) ||
        (log.targetId || "").toLowerCase().includes(q);

      const matchesAction =
        selectedAction === "all" || log.action === selectedAction;

      const userName = log.user?.name || log.userName || "";
      const matchesUser =
        selectedUser === "all" || userName === selectedUser;

      let matchesDate = true;
      if (dateFilterActive && log.createdAt) {
        const d = new Date(log.createdAt);
        const today = new Date();
        matchesDate =
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesAction && matchesUser && matchesDate;
    });
  }, [logs, searchQuery, selectedAction, selectedUser, dateFilterActive]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  const todayFormatted = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      {/* Title & Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-main, #0F172A)",
              margin: "0 0 0.25rem 0",
            }}
          >
            Journal d'Audit
          </h1>
          <p style={{ color: "var(--text-muted, #64748B)", margin: 0, fontSize: "0.85rem" }}>
            Traçabilité complète et immutable de toutes les actions effectuées sur la plateforme
          </p>
        </div>
        <div
          style={{
            background: "rgba(37, 99, 235, 0.1)",
            color: "var(--accent, #2563EB)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            padding: "0.45rem 1rem",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 600,
            fontSize: "0.82rem",
          }}
        >
          <Shield size={16} />
          Journal d'activité & traçabilité
        </div>
      </div>

      {/* Filter Row Card */}
      <div
        style={{
          background: "var(--card-bg, #FFF)",
          border: "1px solid var(--border, #E2E8F0)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          />
          <input
            type="text"
            placeholder="Rechercher une action, un utilisateur, une cible (#id)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              padding: "0.6rem 1rem 0.6rem 2.4rem",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              background: "#FFF",
              fontSize: "0.85rem",
              outline: "none",
              color: "var(--text-main)",
            }}
          />
        </div>

        {/* Filter Action */}
        <select
          value={selectedAction}
          onChange={(e) => {
            setSelectedAction(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 2rem 0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1.5px solid #3B82F6",
            background: "#FFF",
            fontSize: "0.85rem",
            color: "var(--text-main)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="all">Toutes les actions</option>
          {actionOptions.map((act) => (
            <option key={act} value={act}>
              {formatStr(act)}
            </option>
          ))}
        </select>

        {/* Filter User */}
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 2rem 0.6rem 0.85rem",
            borderRadius: "8px",
            border: "1.5px solid #3B82F6",
            background: "#FFF",
            fontSize: "0.85rem",
            color: "var(--text-main)",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="all">Tous les utilisateurs</option>
          {userOptions.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Date Button */}
        <button
          type="button"
          onClick={() => {
            setDateFilterActive(!dateFilterActive);
            setPage(1);
          }}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: dateFilterActive ? "1.5px solid #2563EB" : "1.5px solid #3B82F6",
            background: dateFilterActive ? "#EFF6FF" : "#FFF",
            color: dateFilterActive ? "#1D4ED8" : "var(--text-main)",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          <Calendar size={15} color="#2563EB" />
          Aujourd'hui ({todayFormatted})
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={fetchLogs}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            background: "var(--text-main)",
            color: "#FFF",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Rafraîchir
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "0.9rem 1.2rem",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Table Card */}
      <div
        style={{
          background: "#FFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#FFF", borderBottom: "1px solid #E2E8F0" }}>
                <th
                  className="table-date-cell"
                  style={{
                    padding: "0.9rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    width: "165px",
                  }}
                >
                  Horodatage
                </th>
                <th
                  style={{
                    padding: "0.9rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    width: "20%",
                  }}
                >
                  Utilisateur & Rôle
                </th>
                <th
                  style={{
                    padding: "0.9rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    width: "18%",
                  }}
                >
                  Action effectuée
                </th>
                <th
                  style={{
                    padding: "0.9rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    width: "32%",
                  }}
                >
                  Cible / Détails contextuels
                </th>
                <th
                  style={{
                    padding: "0.9rem 1.25rem",
                    textAlign: "right",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    width: "14%",
                  }}
                >
                  Sécurité
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#64748B",
                      fontSize: "0.9rem",
                    }}
                  >
                    Chargement du journal d'audit...
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#64748B",
                      fontSize: "0.9rem",
                    }}
                  >
                    Aucun enregistrement trouvé.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const d = new Date(log.createdAt || Date.now());
                  const dateStr = d.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const timeStr = d.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  const pill = getPillStyle(log.action);
                  const userName = log.user?.name || log.userName || "Système";
                  const userInitial = userName.charAt(0).toUpperCase();
                  const userRole =
                    log.user?.role?.name ||
                    log.user?.role ||
                    (userName.toLowerCase().includes("rosette")
                      ? "Super-administrateur"
                      : "Administrateur technique");

                  const secBadge = getSecurityBadge(log);
                  const targetLabel = log.targetType
                    ? `${formatStr(log.targetType)} (#${(log.targetId || "").split("-")[0].toLowerCase()})`
                    : log.targetId
                    ? `#${log.targetId.split("-")[0]}`
                    : "";

                  return (
                    <tr
                      key={log.id || Math.random()}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Horodatage */}
                      <td className="table-date-cell" style={{ padding: "0.9rem 1.25rem", verticalAlign: "middle", width: "165px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <Clock size={15} style={{ color: "#94A3B8", marginTop: "2px", flexShrink: 0 }} />
                          <div style={{ whiteSpace: "nowrap" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)", whiteSpace: "nowrap" }}>
                              {dateStr}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#64748B", whiteSpace: "nowrap" }}>
                              {timeStr}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Utilisateur & Rôle */}
                      <td style={{ padding: "0.9rem 1.25rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: "#F1F5F9",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              flexShrink: 0,
                            }}
                          >
                            {userInitial}
                          </div>
                          <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                            <div className="truncate-name" style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)", maxWidth: "100%" }} title={userName}>
                              {userName}
                            </div>
                            <div className="truncate-name" style={{ fontSize: "0.75rem", color: "#64748B", maxWidth: "100%" }} title={userRole}>
                              {userRole}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action effectuée */}
                      <td style={{ padding: "0.9rem 1.25rem", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            background: pill.background,
                            color: pill.color,
                          }}
                        >
                          {formatStr(log.action)}
                        </span>
                      </td>

                      {/* Cible / Détails contextuels */}
                      <td style={{ padding: "0.9rem 1.25rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", minWidth: 0 }}>
                          <FileText size={15} style={{ color: "#94A3B8", marginTop: "2px", flexShrink: 0 }} />
                          <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                            {targetLabel && (
                              <div className="truncate-name" style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-main)", maxWidth: "100%" }} title={targetLabel}>
                                {targetLabel}
                              </div>
                            )}
                            <div className="truncate-name" style={{ fontSize: "0.78rem", color: "#64748B", maxWidth: "100%" }} title={log.details || "-"}>
                              {log.details || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sécurité */}
                      <td style={{ padding: "0.9rem 1.25rem", textAlign: "right", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            color: "#64748B",
                            background: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            fontFamily: "monospace",
                          }}
                        >
                          {secBadge}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.85rem 1.25rem",
            borderTop: "1px solid #F1F5F9",
            background: "#FFF",
            fontSize: "0.8rem",
            color: "#64748B",
          }}
        >
          <div>
            Affichage de {filteredLogs.length > 0 ? (page - 1) * pageSize + 1 : 0} à{" "}
            {Math.min(page * pageSize, filteredLogs.length)} sur {filteredLogs.length} événements enregistrés
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "#FFF",
                color: page <= 1 ? "#CBD5E1" : "#334155",
                fontSize: "0.8rem",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <ChevronLeft size={14} /> Précédent
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
                background: "#FFF",
                color: page >= totalPages ? "#CBD5E1" : "#334155",
                fontSize: "0.8rem",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
