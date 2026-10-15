import { Role } from "../types/auth";

export const ALLOWED_ROLES: Role[] = [
  "Super-administrateur",
  "Responsable opérationnel",
  "Relecteur",
  "Collaborateur",
  "Administrateur technique",
  "Client",
  "SANS ROLE",
];

// Helper fonctionnel purement typé pour les droits d'accès
export const hasAccess = {
  toGlobal: (role: Role) => role === "Super-administrateur" || role === "Responsable opérationnel",
  toMessage: (role: Role) => role === "Super-administrateur" || role === "Responsable opérationnel" || role === "Relecteur" || role === "Collaborateur",
  toWorkspace: (role: Role) => role === "Super-administrateur" || role === "Responsable opérationnel" || role === "Relecteur" || role === "Collaborateur",
  toUsers: (role: Role) => role === "Super-administrateur",
  toSystem: (role: Role) => role === "Super-administrateur" || role === "Administrateur technique" || role === "Responsable opérationnel" || role === "Relecteur" || role === "Collaborateur",
  toCMS: (role: Role) => role === "Super-administrateur",
};
