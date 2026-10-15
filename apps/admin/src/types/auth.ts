export type Role = 
  | "Super-administrateur"
  | "Responsable opérationnel"
  | "Relecteur"
  | "Collaborateur"
  | "Administrateur technique"
  | "Client"
  | "SANS ROLE";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status?: string;
  clientId?: string;
  lastLogin?: string;
}

export interface UserData {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}
