import React from "react";

const MOCK_CANDIDATES = [
  { id: 1, name: "Marie Curie", role: "Contrôleur de gestion Senior", experience: "8 ans", date: "22 Juin 2026", status: "Nouvelle candidature" },
  { id: 2, name: "Albert Einstein", role: "Expert Data Analyst", experience: "5 ans", date: "21 Juin 2026", status: "Nouvelle candidature" },
];

export default function RecrutementInboxPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Nouvelles Candidatures</h1>
          <p className="admin-subtitle">Candidats fraîchement reçus via le site vitrine.</p>
        </div>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Candidat</th>
                <th className="p-4 font-medium">Poste visé</th>
                <th className="p-4 font-medium">Expérience</th>
                <th className="p-4 font-medium">Date de dépôt</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CANDIDATES.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                        {candidate.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{candidate.role}</td>
                  <td className="p-4 text-sm text-gray-600">{candidate.experience}</td>
                  <td className="p-4 text-sm text-gray-500">{candidate.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      À examiner
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">CV</button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Évaluer</button>
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
