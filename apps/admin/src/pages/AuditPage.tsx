import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Shield,
  Search,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";
import { getStoredToken, redirectToLogin } from "../services/api";

const PAGE_SIZE = 15;

// --- Interfaces TypeScript ---

export interface AuditUser {
  id?: string;
  name?: string;
  role?: string | { name: string };
}

export interface AuditLog {
  id: string;
  action: string;
  details?: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  ip?: string;
  createdAt: string;
  user?: AuditUser;
  userName?: string;
}

// --- Utilitaires de formatage ---

function formatActionLabel(str?: string): string {
  if (!str) return "";
  const formatted = String(str).replace(/_/g, " ").toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getActionBadgeStyle(action?: string): string {
  const act = (action || "").toLowerCase();
  if (act.includes("create") || act.includes("créat") || act.includes("ajout")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (act.includes("deconnexion") || act.includes("logout")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  if (act.includes("login") || act.includes("connexion")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (
    act.includes("mdp") ||
    act.includes("password") ||
    act.includes("reinit") ||
    act.includes("reset") ||
    act.includes("otp")
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (act.includes("delete") || act.includes("suppr")) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

// --- Composant Principal ---

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtres
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateFilterActive, setDateFilterActive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Gestion temporisée des alertes d'erreur sans fuite mémoire
  const triggerError = useCallback((msg: string) => {
    setErrorMessage(msg);
  }, []);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = getStoredToken();
      if (!token) {
        redirectToLogin("expired");
        return;
      }

      const res = await fetch(getSafeApiUrl("/api/crm/audit"), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        redirectToLogin("expired");
        return;
      }

      if (res.status === 403) {
        triggerError("Accès refusé : permissions insuffisantes.");
        setLogs([]);
        return;
      }

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Erreur serveur (${res.status})`);
      }

      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      triggerError(err instanceof Error ? err.message : "Erreur de chargement des journaux.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [triggerError]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Options pour les menus déroulants
  const actionOptions = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));
  }, [logs]);

  const userOptions = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map((l) => l.user?.name || l.userName)
          .filter((name): name is string => Boolean(name))
      )
    );
  }, [logs]);

  // Filtrage combiné
  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const today = new Date();

    return logs.filter((log) => {
      const userName = log.user?.name || log.userName || "";
      const matchesSearch =
        !q ||
        (log.action || "").toLowerCase().includes(q) ||
        userName.toLowerCase().includes(q) ||
        (log.details || "").toLowerCase().includes(q) ||
        (log.targetType || "").toLowerCase().includes(q) ||
        (log.targetId || "").toLowerCase().includes(q) ||
        (log.ipAddress || "").toLowerCase().includes(q) ||
        (log.ip || "").toLowerCase().includes(q);

      const matchesAction = selectedAction === "all" || log.action === selectedAction;
      const matchesUser = selectedUser === "all" || userName === selectedUser;

      let matchesDate = true;
      if (dateFilterActive && log.createdAt) {
        const d = new Date(log.createdAt);
        matchesDate =
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesAction && matchesUser && matchesDate;
    });
  }, [logs, searchQuery, selectedAction, selectedUser, dateFilterActive]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, page]);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const startIndex = filteredLogs.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredLogs.length);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Journal d'Audit</h1>
          <p className="text-sm text-slate-500">
            Traçabilité et journalisation immuable des activités d'administration
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-blue-700">
          <Shield className="h-4 w-4" />
          Journal d'activité & traçabilité
        </div>
      </div>

      {/* Barre d'outils et filtres */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une action, un compte, une cible..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => {
            setSelectedAction(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
        >
          <option value="all">Toutes les actions</option>
          {actionOptions.map((act) => (
            <option key={act} value={act}>
              {formatActionLabel(act)}
            </option>
          ))}
        </select>

        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
        >
          <option value="all">Tous les utilisateurs</option>
          {userOptions.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setDateFilterActive(!dateFilterActive);
            setPage(1);
          }}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            dateFilterActive
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Calendar className="h-4 w-4 text-blue-600" />
          Aujourd'hui ({todayFormatted})
        </button>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tableau des logs */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-[170px] px-4 py-3">Horodatage</th>
                <th className="w-[22%] px-4 py-3">Utilisateur</th>
                <th className="w-[18%] px-4 py-3">Action</th>
                <th className="w-[45%] px-4 py-3">Cible / Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400 mb-2" />
                    Chargement du journal d'audit...
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    Aucun événement correspondant aux critères.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const d = new Date(log.createdAt || Date.now());
                  const dateStr = d.toLocaleDateString("fr-FR");
                  const timeStr = d.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  const userName = log.user?.name || log.userName || "Système";
                  const roleLabel =
                    typeof log.user?.role === "object"
                      ? log.user.role?.name
                      : log.user?.role || "Membre";

                  const targetLabel = log.targetType
                    ? `${formatActionLabel(log.targetType)} (#${(log.targetId || "").slice(0, 8)})`
                    : log.targetId
                    ? `#${log.targetId.slice(0, 8)}`
                    : null;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-xs text-slate-900">{dateStr}</div>
                        <div className="text-[11px] text-slate-500">{timeStr}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-0 flex-1 truncate">
                          <div className="truncate font-medium text-slate-900" title={userName}>
                            {userName}
                          </div>
                          <div className="truncate text-xs text-slate-500" title={roleLabel}>
                            {roleLabel}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getActionBadgeStyle(
                            log.action
                          )}`}
                        >
                          {formatActionLabel(log.action)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-0 flex-1">
                          {targetLabel && (
                            <div
                              className="truncate font-medium text-xs text-slate-800"
                              title={targetLabel}
                            >
                              {targetLabel}
                            </div>
                          )}
                          <div
                            className="truncate text-xs text-slate-500"
                            title={log.details || "-"}
                          >
                            {log.details || "-"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de page et pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          <div>
            Affichage de{" "}
            <span className="font-semibold">{startIndex}</span> à{" "}
            <span className="font-semibold">{endIndex}</span> sur{" "}
            <span className="font-semibold">{filteredLogs.length}</span> enregistrements
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Précédent
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
