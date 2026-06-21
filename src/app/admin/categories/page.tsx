"use client";

import React from "react";

export default function CategoriesPage() {
  const categories = [
    { nom: "Contact général", desc: "Question ou prise de contact", color: "#6b7280", colorClass: "bg-gray-500", count: 42 },
    { nom: "Demande commerciale", desc: "Prospect souhaitant vos services", color: "#3b82f6", colorClass: "bg-blue-500", count: 28 },
    { nom: "Demande de devis", desc: "Besoin d'une estimation ou proposition", color: "#10b981", colorClass: "bg-emerald-500", count: 35 },
    { nom: "Recrutement", desc: "Candidature via 'Nous rejoindre'", color: "#f59e0b", colorClass: "bg-amber-500", count: 18 },
    { nom: "Partenariat", desc: "Collaboration B2B", color: "#8b5cf6", colorClass: "bg-purple-500", count: 12 },
    { nom: "Presse / Média", desc: "Journalistes ou interviews", color: "#ec4899", colorClass: "bg-pink-500", count: 5 },
    { nom: "Juridique", desc: "Questions légales ou conformité", color: "#14b8a6", colorClass: "bg-teal-500", count: 8 },
    { nom: "Support technique", desc: "Problème lié au site", color: "#f43f5e", colorClass: "bg-rose-500", count: 14 },
    { nom: "Autre", desc: "Cas ne correspondant à aucune catégorie", color: "#9ca3af", colorClass: "bg-gray-400", count: 4 },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos catégories de messages</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Nouvelle catégorie
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Couleur</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Nombre de messages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-indigo-600">{c.nom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {c.desc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border border-gray-200 ${c.colorClass}`}></div>
                      <span className="text-sm text-gray-500 font-mono uppercase">{c.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                    {c.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-500">5 résultats</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-400 font-medium text-sm">‹</button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white font-medium text-sm">1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-400 font-medium text-sm">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
