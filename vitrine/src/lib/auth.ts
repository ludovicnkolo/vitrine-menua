// ============================================================
//  MENUA CONSULTING — Utilitaires Auth JWT
//  Vérifie et décode le token JWT depuis le cookie ou le header
// ============================================================

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_MOI_EN_PRODUCTION";

export interface TokenPayload {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: "ADMINISTRATEUR" | "GESTIONNAIRE" | "CONSULTANT" | "LECTURE_SEULE";
}

/**
 * Vérifie le token JWT depuis le cookie HttpOnly ou le header Authorization.
 * Retourne le payload décodé ou null si invalide.
 */
export async function verifierToken(request: NextRequest): Promise<TokenPayload | null> {
  try {
    // Priorité 1 : cookie HttpOnly sécurisé
    let token = request.cookies.get("crm_token")?.value;

    // Priorité 2 : header Authorization Bearer
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Vérifie qu'un utilisateur a au minimum le rôle requis.
 * Hiérarchie : ADMINISTRATEUR > GESTIONNAIRE > CONSULTANT > LECTURE_SEULE
 */
export function aLeRoleMinimum(
  roleUtilisateur: string,
  roleMinimum: "ADMINISTRATEUR" | "GESTIONNAIRE" | "CONSULTANT" | "LECTURE_SEULE"
): boolean {
  const hierarchie = ["LECTURE_SEULE", "CONSULTANT", "GESTIONNAIRE", "ADMINISTRATEUR"];
  return hierarchie.indexOf(roleUtilisateur) >= hierarchie.indexOf(roleMinimum);
}
