"use client";

import React from "react";

export default function UtilisateursPage() {
  const users = [
    { nom: "Jean Dupont", email: "jean.dupont@menuaconsulting.com", role: "Administrateur", status: "Actif", initial: "JD", bg: "bg-indigo-600" },
    { nom: "Sophie Martin", email: "sophie.martin@menuaconsulting.com", role: "Agent", status: "Actif", initial: "SM", bg: "bg-emerald-600" },
    { nom: "Marc Tremblay", email: "marc.tremblay@menuaconsulting.com", role: "Agent", status: "Inactif", initial: "MT", bg: "bg-gray-400" },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les accès de votre équipe</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${u.bg}`}>
                        {u.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{u.nom}</div>
                        <div className="text-gray-500 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'Administrateur' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.status === 'Actif' ? 'text-emerald-700' : 'text-gray-500'}`}>
                      {u.status === 'Actif' ? '🟢 Actif' : '⚪ Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Modifier</button>
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
