import React from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { STATUS_CONFIG } from "./constants";
// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) {
    return <span className="badge badge-new">{status}</span>;
  }
  const style = cfg.badgeClass
    ? {}
    : {
        backgroundColor: cfg.bg,
        color: cfg.color,
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      };
  return (
    <span className={`badge ${cfg.badgeClass || ""}`} style={style}>
      {cfg.label}
    </span>
  );
}

function getPriorityBadge(priority) {
  const map = {
    URGENT: (
      <span
        className="inline-flex items-center font-normal" style={{gap:"4px",color:"var(--danger)"}}
      >
        <AlertCircle size={14} /> Urgent
      </span>
    ),
    NORMAL: (
      <span
        className="inline-flex items-center font-normal" style={{gap:"4px",color:"var(--success)"}}
      >
        <CheckCircle size={14} /> Normal
      </span>
    ),
    LOW: (
      <span
        className="inline-flex items-center font-normal" style={{gap:"4px",color:"var(--text-muted)"}}
      >
        <Clock size={14} /> Faible
      </span>
    ),
  };
  return map[priority] || priority;
}

function getRoleBadge(role) {
  return (
    <span className="font-medium text-[var(--text-main)]">
      {role}
    </span>
  );
}

function getMessageStatusBadge(status) {
  const map = {
    NOUVEAU: { text: "Nouveau", bg: "#E53E3E", color: "#FFF" },
    ATTRIBUE: { text: "Attribué", bg: "#DD6B20", color: "#FFF" },
    INITIE: { text: "Initié", bg: "#3182CE", color: "#FFF" },
    CONTROLE: { text: "Contrôlé", bg: "#805AD5", color: "#FFF" },
    A_CORRIGER: { text: "À corriger", bg: "#E53E3E", color: "#FFF" },
    REATTRIBUE: { text: "Réattribué", bg: "#DD6B20", color: "#FFF" },
    TERMINE: { text: "Terminé", bg: "#38A169", color: "#FFF" },
    ARCHIVE: { text: "Archivé", bg: "#718096", color: "#FFF" },
  };
  const formatUnknown = (st) =>
    st
      ? st.charAt(0).toUpperCase() +
        st.slice(1).toLowerCase().replaceAll("_", " ")
      : "";
  const s = map[status] || {
    text: formatUnknown(status),
    bg: "#718096",
    color: "#FFF",
  };
  return (
    <span className="badge" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.text}
    </span>
  );
}

export {
  getStatusBadge,
  getPriorityBadge,
  getRoleBadge,
  getMessageStatusBadge,
};

function getSafeApiUrl(path) {
  const base = import.meta.env.VITE_API_URL || "";
  try {
    const origin = base || window.location.origin;
    const url = new URL(path, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return path;
    return url.toString();
  } catch (e) {
    return path;
  }
}

/**
 * Fetch authentifié vers l'API CRM.
 * @param {string} endpoint - Chemin de l'API (ex: '/api/crm/users')
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} method
 * @param {object|null} body - Corps JSON optionnel
 */
async function apiFetch(endpoint, method = "GET", body = null) {
  const token = typeof window !== "undefined"
    ? (sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken"))
    : null;
  const options = {
    method,
    credentials: "include",
    headers: {},
  };
  if (token && token !== "null" && token !== "undefined") {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  return fetch(new URL(getSafeApiUrl(endpoint)).toString(), options);
}

/**
 * Upload d'un fichier vers le serveur.
 * @param {File} file - Fichier à uploader
 * @param {string} bucket - Répertoire de destination ('formulaires', 'users_id_cards', etc.)
 * @returns {Promise<string|null>} - Nom du fichier ou URL selon le bucket, null si erreur
 */
async function uploadFile(file, bucket = "formulaires") {
  if (!file) return null;
  const formData = new FormData();
  formData.append("bucket", bucket);
  formData.append("file", file);
  try {
    const res = await fetch(getSafeApiUrl("/api/files/upload"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return bucket === "users_id_cards"
        ? getSafeApiUrl(`/api/files/view/${data.fileData.path}`)
        : data.fileData.path;
    }
  } catch (e) {
    console.error("Upload error", e);
  }
  return null;
}

/**
 * Formate une date en chaîne lisible fr-FR.
 * @param {string|Date} date
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Évalue l'échéance d'une tâche, mission ou dossier :
 * - Sous 24h ou dépassée : isCritical = true (alerte, rouge fixe)
 * - Au-delà de 24h : isCritical = false, isOk = true (dans les temps, vert)
 * - Terminée / annulée ou sans échéance : neutre
 *
 * @param {Object} item - Tâche, mission ou dossier
 * @returns {{ status: string, isCritical: boolean, isOverdue: boolean, label: string }}
 */
function getDeadlineEvaluation(item) {
  if (!item?.echeance) {
    return {
      status: "NONE",
      isCritical: false,
      isOverdue: false,
      label: "Aucune",
    };
  }

  // Statuts terminaux / clôturés : l'alerte est éteinte
  if (["TERMINE", "ARCHIVE", "ANNULEE", "CLOTURE"].includes(item.status)) {
    return {
      status: "DONE",
      isCritical: false,
      isOverdue: false,
      label: new Date(item.echeance).toLocaleDateString("fr-FR"),
    };
  }

  const now = new Date();
  const due = new Date(item.echeance);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Critique si arrive à échéance sous 24h (ou déjà en retard)
  if (diffHours <= 24) {
    return {
      status: "CRITICAL",
      isCritical: true,
      isOverdue: diffMs < 0,
      label: new Date(item.echeance).toLocaleDateString("fr-FR"),
    };
  }

  return {
    status: "OK",
    isCritical: false,
    isOverdue: false,
    label: new Date(item.echeance).toLocaleDateString("fr-FR"),
  };
}

export { getSafeApiUrl, apiFetch, uploadFile, formatDate, getDeadlineEvaluation };

/**
 * Extrait une valeur depuis du HTML structuré (utilisé pour les formulaires de contact/recrutement).
 */
function extractContentFromHtml(html, label, isBlock = false) {
  if (!html) return null;
  let regex = new RegExp(
    String.raw`>\s*${label}\s*<\/strong>\s*<div[^>]*>([\s\S]*?)<\/div>`,
    "i",
  );
  let match = html.match(regex);
  if (!match && !isBlock) {
    regex = new RegExp(
      String.raw`>\s*${label}\s*<\/strong>\s*:\s*<span[^>]*>([\s\S]*?)<\/span>`,
      "i",
    );
    match = html.match(regex);
  }
  if (match?.[1]) {
    let content = match[1];
    if (isBlock) content = content.replace(/<br\s*\/?>/gi, "\n");
    return content.replace(/<[^>]*>?/gm, "").trim();
  }
  return null;
}

const extractFieldFromHtml = (html, fieldName) =>
  extractContentFromHtml(html, fieldName, false);
const extractBlockFromHtml = (html, blockName) =>
  extractContentFromHtml(html, blockName, true);

export { extractFieldFromHtml, extractBlockFromHtml };
