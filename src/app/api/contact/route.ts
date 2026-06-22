// ============================================================
//  API — Formulaire de contact vitrine
//  Route : POST /api/contact
//  Enregistre la soumission en BDD + envoie un email de notification
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nom, societe, fonction, email, telephone, typesBesoin, urgence, message } = body;

    // Validation minimale
    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : nom, email, message." },
        { status: 400 }
      );
    }

    // Map urgence texte → enum Prisma
    const urgenceMap: Record<string, string> = {
      immediate: "IMMEDIATE",
      "1_week": "SOUS_1_SEMAINE",
      "1_month": "SOUS_1_MOIS",
      not_urgent: "NON_URGENTE",
    };

    // Enregistrement en base de données
    const soumission = await prisma.formulaireContact.create({
      data: {
        nom,
        societe: societe || null,
        fonction: fonction || null,
        email,
        telephone: telephone || null,
        typesBesoin: JSON.stringify(typesBesoin || []),
        urgence: urgenceMap[urgence] as any || null,
        message,
      },
    });

    // TODO : Envoyer email via Nodemailer (activer quand SMTP OVH configuré)
    // await sendContactEmail({ nom, email, societe, message, typesBesoin, urgence });

    return NextResponse.json(
      { success: true, id: soumission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /contact] Erreur :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
