import React from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
// --- HELPERS (Badges) ---
function getStatusBadge(status) {
  const map = {
    // ─── DICTIONNAIRE STRICT DES STATUTS ───

    // STATUTS COMMUNS (Dossier, Mission, Tache)
    NOUVEAU: { text: "Nouveau", class: "badge-new" },
    
    EN_COURS: { text: "En cours", class: "badge-progress" }, // Tache
    EN_ATTENTE: { text: "En attente", class: "badge-warning" },
    BLOQUE: {
      text: "Bloqué",
      style: {
        backgroundColor: "#FEE2E2",
        color: "#B91C1C",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    TERMINE: { text: "Terminé", class: "badge-success" },
    ARCHIVE: {
      text: "Archivé",
      style: {
        backgroundColor: "#F3F4F6",
        color: "#4B5563",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    ANNULEE: {
      text: "Annulé",
      style: {
        backgroundColor: "#FEE2E2",
        color: "#B91C1C",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },

    // SPECIFIQUES CONTROLE QUALITE (Tache)
    VERIFIER: { text: "À vérifier", class: "badge-warning" },
    A_CORRIGER: {
      text: "À corriger",
      style: {
        backgroundColor: "#FEF2F2",
        color: "#DC2626",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    FINALISER: {
      text: "Finalisé (Attente Clôture)",
      style: {
        backgroundColor: "#EDE9FE",
        color: "#6D28D9",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    REATTRIBUE: { text: "Réattribuée", class: "badge-warning" },

    // NOUVEAUX STATUTS TACHE / MISSION / DOSSIER
    EN_RELECTURE: {
      text: "En relecture",
      style: {
        backgroundColor: "#FEF3C7",
        color: "#D97706",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    EN_APPROBATION: {
      text: "En approbation",
      style: {
        backgroundColor: "#FEF3C7",
        color: "#D97706",
        padding: "0.25rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },
    APPROUVEE: { text: "Approuvée", class: "badge-success" },
    CLOTURE: { text: "Clôturé", class: "badge-success" },

    // STATUTS SYSTEMES OU FALLBACKS
    Actif: {
      text: "Actif",
      style: { backgroundColor: "#DEF7EC", color: "#03543F" },
    },
    Inactif: {
      text: "Inactif",
      style: { backgroundColor: "#FDE8E8", color: "#9B1C1C" },
    },
  };
  const s = map[status] || { text: status, class: "badge-new" };
  return (
    <span className={`badge ${s.class || ""}`} style={s.style || {}}>
      {s.text}
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
