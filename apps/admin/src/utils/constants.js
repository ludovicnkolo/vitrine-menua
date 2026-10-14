/**
 * constants.js — Source unique de vérité pour les statuts CRM.
 * Toutes les couleurs, libellés et classes badge sont définis ici.
 * Consommé par helpers.jsx et GenericTaskPage.jsx.
 */

export const STATUS_CONFIG = {
  // ── Communs Dossier / Mission / Tâche ────────────────────────────────────
  NOUVEAU: {
    label: "Nouveau",
    badgeClass: "badge-new",
    bg: "#EFF6FF",
    color: "#1D4ED8",
    dot: "#3B82F6",
  },
  EN_COURS: {
    label: "En cours",
    badgeClass: "badge-progress",
    bg: "#F0FDF4",
    color: "#15803D",
    dot: "#22C55E",
  },
  EN_ATTENTE: {
    label: "En attente",
    badgeClass: "badge-warning",
    bg: "#FFFBEB",
    color: "#B45309",
    dot: "#F59E0B",
  },
  BLOQUE: {
    label: "Bloqué",
    badgeClass: "",
    bg: "#FEE2E2",
    color: "#B91C1C",
    dot: "#EF4444",
  },
  TERMINE: {
    label: "Terminé",
    badgeClass: "badge-success",
    bg: "#F0FDF4",
    color: "#15803D",
    dot: "#22C55E",
  },
  ARCHIVE: {
    label: "Archivé",
    badgeClass: "",
    bg: "#F3F4F6",
    color: "#4B5563",
    dot: "#9CA3AF",
  },
  CLOTURE: {
    label: "Clôturé",
    badgeClass: "badge-success",
    bg: "#F0FDF4",
    color: "#166534",
    dot: "#16A34A",
  },
  CORBEILLE: {
    label: "Corbeille",
    badgeClass: "",
    bg: "#FEF2F2",
    color: "#991B1B",
    dot: "#DC2626",
  },

  // ── Spécifiques Mission ───────────────────────────────────────────────────
  ANNULEE: {
    label: "Annulée",
    badgeClass: "",
    bg: "#FEE2E2",
    color: "#B91C1C",
    dot: "#EF4444",
  },

  // ── Spécifiques Tâche ─────────────────────────────────────────────────────
  EN_RELECTURE: {
    label: "En relecture",
    badgeClass: "",
    bg: "#FEF3C7",
    color: "#D97706",
    dot: "#F59E0B",
  },
  EN_APPROBATION: {
    label: "En approbation",
    badgeClass: "",
    bg: "#FEF3C7",
    color: "#D97706",
    dot: "#F59E0B",
  },
  APPROUVEE: {
    label: "Approuvée",
    badgeClass: "badge-success",
    bg: "#DCFCE7",
    color: "#16A34A",
    dot: "#22C55E",
  },
  A_CORRIGER: {
    label: "À corriger",
    badgeClass: "",
    bg: "#FEF2F2",
    color: "#DC2626",
    dot: "#EF4444",
  },

  // ── Utilisateurs ─────────────────────────────────────────────────────────
  Actif: {
    label: "Actif",
    badgeClass: "",
    bg: "#DEF7EC",
    color: "#03543F",
    dot: "#0F9B6A",
  },
  Inactif: {
    label: "Inactif",
    badgeClass: "",
    bg: "#FDE8E8",
    color: "#9B1C1C",
    dot: "#E02424",
  },
};

/**
 * Retourne le libellé localisé d'un statut.
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  return STATUS_CONFIG[status]?.label ?? status;
}

/**
 * Matrice des transitions autorisées côté frontend (miroir de statusRules.js).
 * Utilisée pour construire la liste des statuts disponibles dans les dropdowns.
 */
export const TACHE_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_RELECTURE: "En relecture",
  EN_APPROBATION: "En approbation",
  APPROUVEE: "Approuvée",
  A_CORRIGER: "À corriger",
  EN_ATTENTE: "En attente",
  BLOQUE: "Bloqué",
  TERMINE: "Terminé",
  CORBEILLE: "Corbeille",
};

export const MISSION_STATUS_LABELS = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  EN_ATTENTE: "En attente",
  BLOQUE: "Bloqué",
  TERMINE: "Terminé",
  ANNULEE: "Annulée",
  CORBEILLE: "Corbeille",
};

// ── Espace Messages ───────────────────────────────────────────────────────────

/**
 * Configuration des statuts de l'espace Messages (couleurs + libellés).
 * Source unique de vérité côté frontend — consommé par InboxPage.jsx.
 */
export const MESSAGE_STATUS_CONFIG = {
  // Commun
  NOUVEAU:      { label: "Nouveau",      bg: "#DBEAFE", color: "#1E3A8A", dot: "#3B82F6" },

  // Pipeline Contact
  A_RAPPELER:   { label: "À rappeler",   bg: "#FEF3C7", color: "#D97706", dot: "#F59E0B" },
  DISCUSSION:   { label: "Discussion",   bg: "#E0E7FF", color: "#4F46E5", dot: "#6366F1" },
  SANS_SUITE:   { label: "Sans suite",   bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
  GAGNE:        { label: "Gagné",        bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },

  // Pipeline Recrutement
  ENTRETIEN:    { label: "Entretien",    bg: "#E0E7FF", color: "#4F46E5", dot: "#6366F1" },
  RETENU:       { label: "Retenu",       bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
  REFUSE:       { label: "Refusé",       bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },

  // Pipeline Interne
  NON_CONSULTE: { label: "Non consulté", bg: "#DBEAFE", color: "#1E3A8A", dot: "#3B82F6" },
  CONSULTE:     { label: "Consulté",     bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },

  // Statuts transversaux / hérités
  TRAITE:       { label: "Traité",       bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
  EN_ATTENTE:   { label: "En attente",   bg: "#FFFBEB", color: "#B45309", dot: "#F59E0B" },
};

/**
 * Statuts terminaux définitifs de l'espace Messages.
 * Un message dans ces statuts ne peut pas recevoir la priorité "Urgente".
 * Miroir de DEFINITIVE_STATUSES dans statusRules.js.
 */
export const DEFINITIVE_MESSAGE_STATUSES = ["SANS_SUITE", "GAGNE", "RETENU", "REFUSE"];

/**
 * Matrice des transitions autorisées — miroir côté frontend de MESSAGE_TRANSITIONS (statusRules.js).
 * Utilisée par getAllowedMessageStatuses dans InboxPage.jsx.
 */
export const MESSAGE_TRANSITIONS_FRONTEND = {
  contact: {
    NOUVEAU:    ["A_RAPPELER", "DISCUSSION", "SANS_SUITE", "GAGNE"],
    A_RAPPELER: ["DISCUSSION", "SANS_SUITE", "GAGNE"],
    DISCUSSION: ["A_RAPPELER", "SANS_SUITE", "GAGNE"],
    SANS_SUITE: ["DISCUSSION"],
    GAGNE:      [],
  },
  recrutement: {
    NOUVEAU:    ["A_RAPPELER", "ENTRETIEN", "REFUSE"],
    A_RAPPELER: ["ENTRETIEN", "REFUSE"],
    ENTRETIEN:  ["A_RAPPELER", "RETENU", "REFUSE"],
    RETENU:     [],
    REFUSE:     [],
  },
  interne: {
    NON_CONSULTE: ["CONSULTE"],
    CONSULTE:     ["NON_CONSULTE"],
  },
  general: {
    NOUVEAU:    ["A_RAPPELER"],
    A_RAPPELER: ["NOUVEAU"],
  },
};

/**
 * Retourne le libellé d'un statut message.
 * @param {string} status
 * @returns {string}
 */
export function getMessageStatusLabel(status) {
  return MESSAGE_STATUS_CONFIG[status]?.label ?? status;
}

