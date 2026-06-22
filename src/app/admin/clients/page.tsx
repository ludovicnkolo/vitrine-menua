"use client";

// ============================================================
//  PAGE — Pôle Clients & Prospects
//  /admin/clients
//  Séparé du pôle prestataires — logique commerciale uniquement
// ============================================================

import { useState } from "react";
import Link from "next/link";

// Données de démonstration (remplacer par fetch API /crm/clients)
const clientsDemoData = [
  {
    id: "c1",
    type: "CLIENT",
    nom: "Martin",
    prenom: "Jean",
    societe: "Finance Corp",
    fonction: "DAF",
    email: "j.martin@financecorp.fr",
    telephone: "+33 6 12 34 56 78",
    pays: "France",
    ville: "Paris",
    langue: "Français",
    statut_kyc: "Validé",
    notes: "Client historique. Priorité haute.",
  },
  {
    id: "c2",
    type: "PROSPECT",
    nom: "Mensah",
    prenom: "Abena",
    societe: "African Growth Partners",
    fonction: "CEO",
    email: "a.mensah@agp.com",
    telephone: "+225 07 00 11 22",
    pays: "Côte d'Ivoire",
    ville: "Abidjan",
    langue: "Français / Anglais",
    statut_kyc: "En attente",
    notes: "Prospect international — mission back office.",
  },
  {
    id: "c3",
    type: "CLIENT",
    nom: "Leroy",
    prenom: "Sophie",
    societe: "Cabinet Leroy & Associés",
    fonction: "Associée",
    email: "s.leroy@leroy-associes.fr",
    telephone: "+33 1 45 67 89 01",
    pays: "France",
    ville: "Lyon",
    langue: "Français",
    statut_kyc: "Validé",
    notes: "Cabinet CGP. Suivi trimestriel.",
  },
];

const typeColors: Record<string, string> = {
  CLIENT: "bg-emerald-100 text-emerald-700",
  PROSPECT: "bg-blue-100 text-blue-700",
};

const kycColors: Record<string, string> = {
  "Validé": "bg-emerald-100 text-emerald-700",
  "En attente": "bg-amber-100 text-amber-700",
  "Non requis": "bg-gray-100 text-gray-500",
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<"TOUS" | "CLIENT" | "PROSPECT">("TOUS");

  const filtered = clientsDemoData.filter((c) => {
    const matchSearch =
      `${c.nom} ${c.prenom} ${c.societe} ${c.email} ${c.pays}`.toLowerCase().includes(search.toLowerCase());
    const matchFiltre = filtre === "TOUS" || c.type === filtre;
    return matchSearch && matchFiltre;
  });

  return (
    <div className="admin-page">
      {/* ── En-tête ── */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Pôle Clients & Prospects</h1>
          <p className="admin-subtitle">
            Relations commerciales — besoins, devis, contrats, KYC, échanges
          </p>
        </div>
        <Link
          href="/admin/clients/nouveau"
          className="admin-btn-primary"
        >
          + Nouveau contact
        </Link>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom, société, pays…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(["TOUS", "CLIENT", "PROSPECT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                filtre === f ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "TOUS" ? "Tous" : f === "CLIENT" ? "Clients" : "Prospects"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table des contacts ── */}
      <div className="admin-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays / Ville</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Langue</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                      {contact.prenom[0]}{contact.nom[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{contact.prenom} {contact.nom}</p>
                      <p className="text-xs text-gray-500">{contact.fonction} — {contact.societe}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${typeColors[contact.type]}`}>
                    {contact.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-700 font-medium">{contact.pays}</p>
                  <p className="text-xs text-gray-400">{contact.ville}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{contact.langue}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${kycColors[contact.statut_kyc] || "bg-gray-100 text-gray-500"}`}>
                    {contact.statut_kyc}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/clients/${contact.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Voir →
                    </Link>
                    <Link
                      href={`/admin/dossiers?clientId=${contact.id}`}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Dossiers
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <span className="text-3xl mb-2 block">🏦</span>
            <p>Aucun contact trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
