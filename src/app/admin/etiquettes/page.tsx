"use client";

import React from "react";

export default function EtiquettesPage() {
  const etiquettes = [
    { nom: "🔥 Urgent", desc: "Réponse attendue rapidement", color: "text-rose-700 bg-rose-50 border-rose-100", count: 12 },
    { nom: "🏦 Banque", desc: "Demande liée à un établissement bancaire", color: "text-blue-700 bg-blue-50 border-blue-100", count: 45 },
    { nom: "📊 Finance", desc: "Sujet financier", color: "text-emerald-700 bg-emerald-50 border-emerald-100", count: 38 },
    { nom: "📑 Comptabilité", desc: "Mission comptable", color: "text-indigo-700 bg-indigo-50 border-indigo-100", count: 24 },
    { nom: "🛡️ Conformité", desc: "Demande réglementaire", color: "text-amber-700 bg-amber-50 border-amber-100", count: 18 },
    { nom: "📈 Reporting", desc: "Reporting financier", color: "text-cyan-700 bg-cyan-50 border-cyan-100", count: 15 },
    { nom: "🗄️ Back Office", desc: "Externalisation back office", color: "text-slate-700 bg-slate-50 border-slate-200", count: 52 },
    { nom: "⚙️ Middle Office", desc: "Mission middle office", color: "text-slate-700 bg-slate-50 border-slate-200", count: 41 },
    { nom: "🌍 Français", desc: "Échange en français", color: "text-gray-700 bg-gray-50 border-gray-200", count: 120 },
    { nom: "🌐 Anglais", desc: "Échange en anglais", color: "text-gray-700 bg-gray-50 border-gray-200", count: 36 },
    { nom: "🇫🇷 France", desc: "Client basé en France", color: "text-blue-800 bg-blue-50 border-blue-200", count: 98 },
    { nom: "🌍 International", desc: "Client étranger", color: "text-indigo-800 bg-indigo-50 border-indigo-200", count: 24 },
    { nom: "⭐ VIP", desc: "Client stratégique", color: "text-yellow-700 bg-yellow-50 border-yellow-200", count: 8 },
    { nom: "📞 À rappeler", desc: "Nécessite un appel", color: "text-orange-700 bg-orange-50 border-orange-100", count: 14 },
    { nom: "📎 Pièce jointe", desc: "Contient des documents", color: "text-gray-600 bg-gray-50 border-gray-200", count: 86 },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="admin-title">Étiquettes</h1>
          <p className="admin-subtitle">Gérez vos tags de suivi</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Nouvelle étiquette
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Étiquette</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Utilisations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {etiquettes.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1.5 rounded border font-medium ${e.color}`}>{e.nom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {e.desc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-medium">
                    {e.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
