// ============================================================
//  API — Formulaire de recrutement vitrine
//  Route : POST /api/recrutement
//  Aucun CV — seulement infos profil (sécurité + maîtrise données)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      nom, prenom, email, telephone,
      pays, ville, competences, anneesExperience,
      langues, disponibilite, typeMission,
      lieuLinkedin, message,
    } = body;

    // Validation minimale
    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : nom, prénom, email." },
        { status: 400 }
      );
    }

    // Enregistrement en base
    const soumission = await prisma.formulaireRecrutement.create({
      data: {
        nom,
        prenom,
        email,
        telephone: telephone || null,
        pays: pays || null,
        ville: ville || null,
        competences: competences || null,
        anneesExperience: anneesExperience || null,
        langues: langues || null,
        disponibilite: disponibilite || null,
        typeMission: typeMission || null,
        lieuLinkedin: lieuLinkedin || null,
        message: message || null,
      },
    });

    // TODO : Notification email interne Menua
    // await sendRecrutementEmail(soumission);

    return NextResponse.json(
      { success: true, id: soumission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /recrutement] Erreur :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
