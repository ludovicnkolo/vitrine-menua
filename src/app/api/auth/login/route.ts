// ============================================================
//  API — Authentification CRM Admin
//  Route : POST /api/auth/login
//  Génère un JWT signé (8h) après vérification bcrypt
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_MOI_EN_PRODUCTION";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export async function POST(request: NextRequest) {
  try {
    const { email, motDePasse } = await request.json();

    if (!email || !motDePasse) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur CRM
    const utilisateur = await prisma.utilisateurCRM.findUnique({
      where: { email },
    });

    if (!utilisateur || !utilisateur.actif) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe haché
    const valide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!valide) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Générer le token JWT avec le rôle intégré
    const token = jwt.sign(
      {
        userId: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Retourner le token + infos utilisateur (sans mot de passe)
    const response = NextResponse.json({
      success: true,
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });

    // Stocker aussi dans un cookie HttpOnly sécurisé
    response.cookies.set("crm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 heures
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[API /auth/login] Erreur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
