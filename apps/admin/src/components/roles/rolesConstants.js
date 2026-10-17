export const AVAILABLE_PERMISSIONS = [
  { value: "MESSAGES_VIEW", label: "Consulter les messages" },
  { value: "MESSAGES_PROCESS", label: "Traiter les messages" },
  { value: "DOSSIERS_MANAGE", label: "Gérer les dossiers" },
  { value: "TACHES_MANAGE", label: "Créer et gérer les tâches" },
  { value: "TACHES_VIEW_ALL", label: "Consulter toutes les tâches" },
  { value: "TACHES_VALIDATE", label: "Valider les tâches" },
  { value: "TACHES_VIEW_ASSIGNED", label: "Voir ses tâches assignées" },
  { value: "TACHES_EDIT_ASSIGNED", label: "Modifier ses tâches assignées" },
  { value: "CLIENTS_MANAGE", label: "Gérer les clients" },
  { value: "USERS_MANAGE", label: "Gérer les utilisateurs" },
  { value: "ROLES_MANAGE", label: "Gérer les rôles" },
];

export const DOMAIN_GROUPS = [
  {
    title: "MESSAGES & COMMUNICATION",
    permValues: ["MESSAGES_VIEW", "MESSAGES_PROCESS"],
    pillStyle: {
      backgroundColor: "#EFF6FF",
      border: "1px solid #BFDBFE",
      color: "#1D4ED8",
    },
  },
  {
    title: "DOSSIERS & GESTION DES TÂCHES",
    permValues: [
      "DOSSIERS_MANAGE",
      "TACHES_MANAGE",
      "TACHES_VIEW_ALL",
      "TACHES_VALIDATE",
      "TACHES_VIEW_ASSIGNED",
      "TACHES_EDIT_ASSIGNED",
    ],
    pillStyle: {
      backgroundColor: "#ECFDF5",
      border: "1px solid #A7F3D0",
      color: "#059669",
    },
  },
  {
    title: "ADMINISTRATION & SÉCURITÉ SYSTÈME",
    permValues: ["CLIENTS_MANAGE", "USERS_MANAGE", "ROLES_MANAGE"],
    pillStyle: {
      backgroundColor: "#FAF5FF",
      border: "1px solid #E9D5FF",
      color: "#7E22CE",
    },
  },
];

export const getRoleInitials = (name) => {
  if (!name) return "RO";
  const cleaned = name.replace(/[-_]/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const getPermLabel = (val) =>
  AVAILABLE_PERMISSIONS.find((p) => p.value === val)?.label || val;

export const parseRolePermissions = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
