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
