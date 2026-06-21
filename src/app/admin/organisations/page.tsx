"use client";

import React from "react";

export default function OrganisationsPage() {
  const organisations = [
    { nom: "Banque Alpha", secteur: "Banque de détail", contacts: 12, statut: "Client Actif", color: "bg-emerald-100 text-emerald-700" },
    { nom: "Cabinet Gestion Pro", secteur: "Gestion de patrimoine", contacts: 4, statut: "Prospect", color: "bg-blue-100 text-blue-700" },
    { nom: "Finance Plus", secteur: "Société financière", contacts: 8, statut: "Client Actif", color: "bg-emerald-100 text-emerald-700" },
    { nom: "Expertise & Co", secteur: "Expert-comptable", contacts: 2, statut: "Partenaire", color: "bg-purple-100 text-purple-700" },
    { nom: "Global Invest", secteur: "Fonds d'investissement", contacts: 5, statut: "En négociation", color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organisations</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les entreprises et cabinets clients</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Nouvelle organisation
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nom de l'organisation</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Secteur</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Contacts liés</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {organisations.map((org, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">
                        {org.nom.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{org.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {org.secteur}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-medium">
                    {org.contacts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${org.color}`}>
                      {org.statut}
                    </span>
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
