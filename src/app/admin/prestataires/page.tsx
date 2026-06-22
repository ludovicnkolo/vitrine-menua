"use client";

// ============================================================
//  PAGE — Pôle Prestataires / Collaborateurs / Consultants
//  /admin/prestataires
//  Séparé du pôle clients — logique de mission et compétences
// ============================================================

import { useState } from "react";
import Link from "next/link";

// Données de démonstration (remplacer par fetch API /crm/prestataires)
const prestatairesDemoData = [
  {
    id: "p1",
    type: "COLLABORATEUR",
    nom: "Diallo",
    prenom: "Mamadou",
    fonction: "Analyste Back Office",
    email: "m.diallo@example.com",
    telephone: "+221 77 123 45 67",
    pays: "Sénégal",
    ville: "Dakar",
    langues: "Français, Anglais",
    competences: "Réconciliations, Reporting financier, VBA",
    disponibilite: "Immédiate",
    missions: "Missions récurrentes",
  },
  {
    id: "p2",
    type: "PRESTATAIRE",
    nom: "Chen",
    prenom: "Li Wei",
    fonction: "Consultant Conformité / KYC",
    email: "liwei.chen@example.com",
    telephone: "+33 6 98 76 54 32",
    pays: "France",
    ville: "Paris",
    langues: "Français, Anglais, Mandarin",
    competences: "KYC, LCB-FT, DORA, Analyse documentaire",
    disponibilite: "Sous 1 mois",
    missions: "Mission ponctuelle",
  },
  {
    id: "p3",
    type: "CANDIDAT",
    nom: "Kouassi",
    prenom: "Béatrice",
    fonction: "Comptable / Support Administratif",
    email: "b.kouassi@example.com",
    telephone: "+225 05 44 33 22",
    pays: "Côte d'Ivoire",
    ville: "Abidjan",
    langues: "Français",
    competences: "Saisie comptable, Rapprochements bancaires, Sage 50",
    disponibilite: "Immédiate",
    missions: "Les deux",
  },
];

const typeColors: Record<string, string> = {
  COLLABORATEUR: "bg-indigo-100 text-indigo-700",
  PRESTATAIRE: "bg-purple-100 text-purple-700",
  CANDIDAT: "bg-amber-100 text-amber-700",
};

const dispoColors: Record<string, string> = {
  "Immédiate": "text-emerald-600",
  "Sous 1 mois": "text-amber-600",
  "Sous 1 semaine": "text-blue-600",
};

export default function PrestatairesPage() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<"TOUS" | "COLLABORATEUR" | "PRESTATAIRE" | "CANDIDAT">("TOUS");

  const filtered = prestatairesDemoData.filter((p) => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.competences} ${p.pays} ${p.langues}`.toLowerCase().includes(search.toLowerCase());
    const matchFiltre = filtre === "TOUS" || p.type === filtre;
    return matchSearch && matchFiltre;
  });

  return (
    <div className="admin-page">
      {/* ── En-tête ── */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Pôle Prestataires & Collaborateurs</h1>
          <p className="admin-subtitle">
            Profils, compétences, disponibilités, missions, vérifications — séparé du pôle clients
          </p>
        </div>
        <Link href="/admin/prestataires/nouveau" className="admin-btn-primary">
          + Ajouter un profil
        </Link>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Nom, compétences, pays, langue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
          {(["TOUS", "COLLABORATEUR", "PRESTATAIRE", "CANDIDAT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                filtre === f ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "TOUS" ? "Tous" : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grille des profils ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="admin-card flex flex-col gap-3">
            {/* En-tête carte */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 shrink-0">
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{p.prenom} {p.nom}</p>
                  <p className="text-xs text-gray-500">{p.fonction}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0 ${typeColors[p.type]}`}>
                {p.type}
              </span>
            </div>

            {/* Infos clés */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="font-medium">{p.pays}</span>
                <span className="text-gray-400">— {p.ville}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>{p.langues}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span className={`font-semibold ${dispoColors[p.disponibilite] || "text-gray-600"}`}>
                  Dispo : {p.disponibilite}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>{p.missions}</span>
              </div>
            </div>

            {/* Compétences */}
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Compétences</p>
              <p className="text-xs text-gray-700">{p.competences}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <Link
                href={`/admin/prestataires/${p.id}`}
                className="flex-1 text-center py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              >
                Voir le profil
              </Link>
              <Link
                href={`/admin/dossiers?prestataireId=${p.id}`}
                className="flex-1 text-center py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                Dossiers
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-400">
            <span className="text-4xl mb-2 block">🤝</span>
            <p>Aucun profil trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
