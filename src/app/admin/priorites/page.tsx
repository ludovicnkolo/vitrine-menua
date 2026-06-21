"use client";

import React from "react";

export default function PrioritesPage() {
  const priorites = [
    { nom: "🔴 Haute", desc: "À traiter immédiatement", badge: "bg-rose-100 text-rose-700 border-rose-200", delai: "Sous 4h" },
    { nom: "🟠 Moyenne", desc: "À traiter prochainement", badge: "bg-amber-100 text-amber-700 border-amber-200", delai: "Sous 24h" },
    { nom: "🟢 Basse", desc: "Peut attendre", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", delai: "Sous 72h" },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Priorités</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les niveaux de priorité de vos conversations</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Priorité</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Délai recommandé</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {priorites.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${p.badge}`}>{p.nom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {p.desc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {p.delai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Modifier</button>
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
