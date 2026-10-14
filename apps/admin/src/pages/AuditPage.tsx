import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Shield,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Download,
  FileText,
  X,
} from "lucide-react";
import { getSafeApiUrl } from "../utils/helpers";
import { getStoredToken, redirectToLogin } from "../services/api";

const PAGE_SIZE = 15;

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

function formatActionLabel(str?: string): string {
  if (!str) return "";
  const formatted = String(str).replace(/_/g, " ").toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getActionBadgeStyle(action?: string): string {
  const act = (action || "").toLowerCase();
  if (act.includes("create") || act.includes("créat") || act.includes("ajout"))
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (act.includes("deconnexion") || act.includes("logout"))
    return "bg-purple-50 text-purple-700 border-purple-200";
  if (act.includes("login") || act.includes("connexion"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (act.includes("mdp") || act.includes("password") || act.includes("reinit") || act.includes("reset") || act.includes("otp"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (act.includes("delete") || act.includes("suppr"))
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

// ─── Export CSV ─────────────────────────────────────────────────────────────

function escapeCsv(val: unknown): string {
  const str = String(val ?? "").replace(/"/g, '""');
  return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
}

function exportCsv(rows: AuditLog[], limit: number) {
  const data = rows.slice(0, limit);
  const header = ["Horodatage", "Utilisateur", "Role", "Action", "Cible / Type", "ID Cible", "Details"];
  const lines = data.map((log) => {
    const d = new Date(log.createdAt || "");
    const dateStr = `${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString("fr-FR")}`;
    const userName = log.user?.name || log.userName || "Systeme";
    const roleLabel =
      typeof log.user?.role === "object"
        ? ((log.user?.role) as { name: string })?.name ?? ""
        : (log.user?.role as string) || "Membre";
    return [
      escapeCsv(dateStr),
      escapeCsv(userName),
      escapeCsv(roleLabel),
      escapeCsv(formatActionLabel(log.action)),
      escapeCsv(log.targetType ? formatActionLabel(log.targetType) : ""),
      escapeCsv((log.targetId || "").slice(0, 8)),
      escapeCsv(log.details || ""),
    ].join(",");
  });
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 200);
}

// ─── Export PDF ──────────────────────────────────────────────────────────────

function exportPdf(
  rows: AuditLog[],
  limit: number,
  filters: { search: string; action: string; user: string; dateActive: boolean; date: string }
) {
  const data = rows.slice(0, limit);
  const now = new Date().toLocaleString("fr-FR");
  const filterDesc: string[] = [];
  if (filters.search) filterDesc.push(`Recherche : "${filters.search}"`);
  if (filters.action !== "all") filterDesc.push(`Action : ${formatActionLabel(filters.action)}`);
  if (filters.user !== "all") filterDesc.push(`Utilisateur : ${filters.user}`);
  if (filters.dateActive) filterDesc.push(`Date : ${filters.date}`);

  const rowsHtml = data.map((log) => {
    const d = new Date(log.createdAt || "");
    const dateStr = d.toLocaleDateString("fr-FR");
    const timeStr = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const userName = log.user?.name || log.userName || "Systeme";
    const roleLabel =
      typeof log.user?.role === "object"
        ? ((log.user?.role) as { name: string })?.name ?? ""
        : (log.user?.role as string) || "Membre";
    const targetLabel = log.targetType
      ? `${formatActionLabel(log.targetType)} (#${(log.targetId || "").slice(0, 8)})`
      : log.targetId ? `#${(log.targetId || "").slice(0, 8)}` : "";
    return `<tr>
      <td><strong>${dateStr}</strong><br/><span style="color:#64748b;font-size:11px">${timeStr}</span></td>
      <td><strong>${userName}</strong><br/><span style="color:#64748b;font-size:11px">${roleLabel}</span></td>
      <td><span class="badge">${formatActionLabel(log.action)}</span></td>
      <td>${targetLabel ? `<strong style="font-size:11px">${targetLabel}</strong><br/>` : ""}<span style="color:#475569;font-size:11px">${log.details || "-"}</span></td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
  <title>Journal Audit MENUA CRM</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1e293b;background:#fff;padding:24px}
    h1{font-size:18px;font-weight:700;color:#0f172a}
    .subtitle{font-size:11px;color:#64748b;margin-top:2px}
    .meta{display:flex;gap:24px;margin:14px 0 10px;flex-wrap:wrap}
    .meta-item{font-size:11px;color:#475569}.meta-item strong{color:#0f172a}
    .filters{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:11px;color:#475569;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#f1f5f9;border-bottom:2px solid #e2e8f0}
    th{padding:8px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#64748b;text-align:left}
    td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top}
    tr:nth-child(even) td{background:#fafafa}
    .badge{display:inline-block;padding:2px 8px;border-radius:999px;border:1px solid #e2e8f0;font-size:10px;font-weight:600;background:#f1f5f9;color:#475569}
    .footer{margin-top:20px;font-size:10px;color:#94a3b8;text-align:right;border-top:1px solid #e2e8f0;padding-top:8px}
    @media print{body{padding:12px}}
  </style></head><body>
  <h1>Journal d'Audit - MENUA CRM</h1>
  <p class="subtitle">Tracabilite et journalisation immuable des activites d'administration</p>
  <div class="meta">
    <div class="meta-item">Exporte le : <strong>${now}</strong></div>
    <div class="meta-item">Enregistrements exportes : <strong>${data.length}</strong></div>
    <div class="meta-item">Total filtre : <strong>${rows.length}</strong></div>
  </div>
  ${filterDesc.length > 0 ? `<div class="filters">Filtres appliques : ${filterDesc.join(" · ")}</div>` : ""}
  <table><thead><tr>
    <th style="width:120px">Horodatage</th>
    <th style="width:18%">Utilisateur</th>
    <th style="width:15%">Action</th>
    <th>Cible / Details</th>
  </tr></thead><tbody>${rowsHtml}</tbody></table>
  <div class="footer">MENUA CRM · Journal d'Audit · ${now}</div>
  </body></html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

// ─── Modal Export ─────────────────────────────────────────────────────────────

interface ExportModalProps {
  filteredCount: number;
  onClose: () => void;
  onExport: (format: "pdf" | "csv", limit: number) => void;
}

function ExportModal({ filteredCount, onClose, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<"pdf" | "csv">("pdf");
  const [limit, setLimit] = useState<string>("100");

  const limitOptions = [
    { value: "50", label: "50 enregistrements" },
    { value: "100", label: "100 enregistrements" },
    { value: "200", label: "200 enregistrements" },
    { value: "500", label: "500 enregistrements" },
    { value: "all", label: `Tous (${filteredCount})` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-5">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 hover:bg-slate-100 text-slate-400">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
            <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Exporter le journal</h2>
            <p className="text-xs text-slate-500">Filtres actifs appliques · {filteredCount} resultat{filteredCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {(["pdf", "csv"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  format === f
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <FileText className="h-4 w-4" />
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre d'enregistrements</label>
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {limitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onExport(format, limit === "all" ? filteredCount : parseInt(limit, 10))}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");  // search by user name (debounced or on Enter)
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  // Date range filter (applied server-side)
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  // Applied values — only change on "Appliquer" click
  const [appliedFrom, setAppliedFrom] = useState<string>("");
  const [appliedTo, setAppliedTo] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const triggerError = useCallback((msg: string) => { setErrorMessage(msg); }, []);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Fetch all system roles once on mount
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    fetch(getSafeApiUrl("/api/crm/roles"), {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableRoles(data.map((r: { name: string }) => r.name).filter(Boolean).sort());
        }
      })
      .catch(() => {});
  }, []);

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = getStoredToken();
      if (!token) { redirectToLogin("expired"); return; }
      // Build query string with all server-side filters
      const params = new URLSearchParams();
      if (appliedFrom) params.set("dateFrom", appliedFrom);
      if (appliedTo) params.set("dateTo", appliedTo);
      if (searchQuery.trim()) params.set("userName", searchQuery.trim());
      if (selectedRole && selectedRole !== "all") params.set("roleName", selectedRole);
      const url = getSafeApiUrl(`/api/crm/audit${params.toString() ? "?" + params.toString() : ""}`);
      const res = await fetch(url, {
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { redirectToLogin("expired"); return; }
      if (res.status === 403) { triggerError("Acces refuse : permissions insuffisantes."); setLogs([]); return; }
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
  }, [triggerError, appliedFrom, appliedTo, searchQuery, selectedRole]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionOptions = useMemo(() => Array.from(new Set(logs.map((l) => l.action).filter(Boolean))), [logs]);
  // Extract unique role names from API and returned logs for the role filter dropdown
  const roleOptions = useMemo(() => {
    const seen = new Set<string>(availableRoles);
    for (const log of logs) {
      const r = typeof log.user?.role === "object"
        ? (log.user?.role as { name: string })?.name
        : (log.user?.role as string);
      if (r) seen.add(r);
    }
    return Array.from(seen).sort();
  }, [logs, availableRoles]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = selectedAction === "all" || log.action === selectedAction;
      return matchesAction;
    });
  }, [logs, selectedAction]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, page]);

  const todayFormatted = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const startIndex = filteredLogs.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min(page * PAGE_SIZE, filteredLogs.length);

  const handleExport = (format: "pdf" | "csv", limit: number) => {
    setShowExportModal(false);
    const periodLabel = appliedFrom || appliedTo
      ? `Du ${appliedFrom || "…"} au ${appliedTo || "…"}`
      : "";
    const filters = { search: searchQuery, action: selectedAction, user: selectedRole !== 'all' ? `Rôle: ${selectedRole}` : '', dateActive: Boolean(appliedFrom || appliedTo), date: periodLabel };
    if (format === "csv") exportCsv(filteredLogs, limit);
    else exportPdf(filteredLogs, limit, filters);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {showExportModal && (
        <ExportModal filteredCount={filteredLogs.length} onClose={() => setShowExportModal(false)} onExport={handleExport} />
      )}

      {/* En-tete */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Journal d'Audit</h1>
          <p className="text-sm text-slate-500">Tracabilite et journalisation immuable des activites d'administration</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            Exporter PDF / CSV
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-blue-700">
            <Shield className="h-4 w-4" />
            Journal d'activite &amp; tracabilite
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom d'utilisateur..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchQuery(searchInput);
                setPage(1);
              }
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select value={selectedAction} onChange={(e) => { setSelectedAction(e.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500">
          <option value="all">Toutes les actions</option>
          {actionOptions.map((act) => <option key={act} value={act}>{formatActionLabel(act)}</option>)}
        </select>
        <select
          value={selectedRole}
          onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
        >
          <option value="all">Tous les rôles</option>
          {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {/* Filtre période Du → Au */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Période :</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
            <span className="text-xs text-slate-500 mr-1">Du</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent cursor-pointer"
              style={{ colorScheme: "light" }}
            />
          </div>
          <span className="text-slate-400 text-xs">→</span>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
            <span className="text-xs text-slate-500 mr-1">Au</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent cursor-pointer"
              style={{ colorScheme: "light" }}
            />
          </div>
          <button
            type="button"
            onClick={() => { setAppliedFrom(dateFrom); setAppliedTo(dateTo); setPage(1); }}
            className="inline-flex items-center rounded-lg bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Appliquer
          </button>

        </div>
        <button
          type="button"
          onClick={() => {
            // Réinitialise tous les filtres puis recharge
            setSearchInput("");
            setSearchQuery("");
            setSelectedAction("all");
            setSelectedRole("all");
            setDateFrom("");
            setDateTo("");
            setAppliedFrom("");
            setAppliedTo("");
            setPage(1);
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Erreur */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-[170px] px-4 py-3">Horodatage</th>
                <th className="w-[22%] px-4 py-3">Utilisateur</th>
                <th className="w-[18%] px-4 py-3">Action</th>
                <th className="w-[45%] px-4 py-3">Cible / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400 mb-2" />
                  Chargement du journal d'audit...
                </td></tr>
              ) : paginatedLogs.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">Aucun evenement correspondant aux criteres.</td></tr>
              ) : (
                paginatedLogs.map((log) => {
                  const d = new Date(log.createdAt || Date.now());
                  const dateStr = d.toLocaleDateString("fr-FR");
                  const timeStr = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                  const userName = log.user?.name || log.userName || "Systeme";
                  const roleLabel = typeof log.user?.role === "object"
                    ? ((log.user.role) as { name: string })?.name
                    : (log.user?.role as string) || "Membre";
                  const targetLabel = log.targetType
                    ? `${formatActionLabel(log.targetType)} (#${(log.targetId || "").slice(0, 8)})`
                    : log.targetId ? `#${log.targetId.slice(0, 8)}` : null;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-xs text-slate-900">{dateStr}</div>
                        <div className="text-[11px] text-slate-500">{timeStr}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="truncate font-medium text-slate-900" title={userName}>{userName}</div>
                        <div className="truncate text-xs text-slate-500" title={roleLabel ?? ""}>{roleLabel}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getActionBadgeStyle(log.action)}`}>
                          {formatActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {targetLabel && <div className="truncate font-medium text-xs text-slate-800" title={targetLabel}>{targetLabel}</div>}
                        <div className="truncate text-xs text-slate-500" title={log.details || "-"}>{log.details || "-"}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          <div>
            Affichage de <span className="font-semibold">{startIndex}</span> a <span className="font-semibold">{endIndex}</span> sur <span className="font-semibold">{filteredLogs.length}</span> enregistrements
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="h-3.5 w-3.5" /> Precedent
            </button>
            <span className="px-2 font-medium text-slate-700">Page {page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Suivant <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
