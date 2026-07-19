
export const mockDossiers = [];
export const mockTasks = [];
export const mockInbox = [];
export const mockContactInbox = [];
export const mockRecrutementInbox = [];
export const mockClients = [];
export const mockUsers = [
  { id: 'U-001', name: 'Marie Claire', role: 'ADMIN', email: 'm.claire@menua.fr', status: 'Actif', lastLogin: 'Il y a 2h' },
  { id: 'U-002', name: 'Jean Dupont', role: 'SUPERVISOR', email: 'j.dupont@menua.fr', status: 'Actif', lastLogin: 'Hier' },
  { id: 'U-003', name: 'Alice Martin', role: 'COLLABORATOR', email: 'a.martin@menua.fr', status: 'Inactif', lastLogin: 'Il y a 10j' }
];
export const mockRoles = [
  { id: 'R-001', name: 'ADMIN', users: 1, permissions: 'Accès total, Configuration', status: 'Actif' },
  { id: 'R-002', name: 'SUPERVISOR', users: 1, permissions: 'Gestion des dossiers, Assignations', status: 'Actif' },
  { id: 'R-003', name: 'COLLABORATOR', users: 2, permissions: 'Traitement des dossiers, Messages', status: 'Actif' },
  { id: 'R-004', name: 'PRESTATAIRE', users: 1, permissions: 'Accès dossiers assignés', status: 'Actif' },
  { id: 'R-005', name: 'READ_ONLY', users: 0, permissions: 'Consultation uniquement', status: 'Inactif' }
];
