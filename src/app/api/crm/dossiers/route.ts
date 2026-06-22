// ============================================================
//  API — Dossiers CRM (CRUD)
//  GET  /api/crm/dossiers        → liste (filtrable par rôle)
//  POST /api/crm/dossiers        → créer un dossier
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifierToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Vérifier le token JWT et extraire le rôle
    const utilisateur = await verifierToken(request);
    if (!utilisateur) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statut = searchParams.get("statut");
    const categorie = searchParams.get("categorie");
    const pole = searchParams.get("pole"); // "clients" ou "prestataires"

    // Filtrage selon le rôle : CONSULTANT ne voit que ses dossiers
    const filtreConsultant =
      utilisateur.role === "CONSULTANT"
        ? { consultantId: utilisateur.userId }
        : {};

    const filtre: Record<string, unknown> = { ...filtreConsultant };
    if (statut) filtre.statut = statut;
    if (categorie) filtre.categorie = categorie;
    // Filtrer par pôle : côté client ou côté prestataire
    if (pole === "clients") filtre.clientId = { not: null };
    if (pole === "prestataires") filtre.prestataireId = { not: null };

    const dossiers = await prisma.dossier.findMany({
      where: filtre,
      include: {
        client: {
          select: { id: true, nom: true, prenom: true, societe: true, pays: true, ville: true, type: true },
        },
        prestataire: {
          select: { id: true, nom: true, prenom: true, societe: true, pays: true, ville: true, type: true },
        },
        consultant: {
          select: { id: true, nom: true, prenom: true, role: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Dernier message seulement pour la liste
        },
        _count: {
          select: { messages: true, documents: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ dossiers });
  } catch (error) {
    console.error("[API /crm/dossiers GET] Erreur :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const utilisateur = await verifierToken(request);
    if (!utilisateur) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // Seuls admins et gestionnaires peuvent créer des dossiers
    if (utilisateur.role === "LECTURE_SEULE") {
      return NextResponse.json({ error: "Droits insuffisants." }, { status: 403 });
    }

    const body = await request.json();
    const { sujet, categorie, priorite, urgence, clientId, prestataireId, consultantId, notesInternes, etiquettes } = body;

    if (!sujet) {
      return NextResponse.json({ error: "Le sujet est obligatoire." }, { status: 400 });
    }

    const dossier = await prisma.dossier.create({
      data: {
        sujet,
        categorie: categorie || "CONTACT_GENERAL",
        priorite: priorite || "MOYENNE",
        urgence: urgence || null,
        clientId: clientId || null,
        prestataireId: prestataireId || null,
        consultantId: consultantId || null,
        notesInternes: notesInternes || null,
        etiquettes: JSON.stringify(etiquettes || []),
      },
    });

    return NextResponse.json({ success: true, dossier }, { status: 201 });
  } catch (error) {
    console.error("[API /crm/dossiers POST] Erreur :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
