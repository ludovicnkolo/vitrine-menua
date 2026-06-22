import React from "react";

const MOCK_CANDIDATES = [
  { id: 1, name: "Charles Darwin", role: "Analyste Risques", reason: "Manque d'expérience sectorielle", date: "15 Mai 2026", status: "Refusé" },
  { id: 2, name: "Nikola Tesla", role: "Ingénieur Financier", reason: "Profil gardé pour futures missions", date: "10 Juin 2026", status: "Vivier" },
];

export default function RecrutementVivierPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Vivier / Refusés</h1>
          <p className="admin-subtitle">Historique des candidatures clôturées ou mises en attente de futures opportunités.</p>
        </div>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Candidat</th>
                <th className="p-4 font-medium">Poste visé</th>
                <th className="p-4 font-medium">Motif / Commentaire</th>
                <th className="p-4 font-medium">Date de décision</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CANDIDATES.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{candidate.name}</td>
                  <td className="p-4 text-sm text-gray-600">{candidate.role}</td>
                  <td className="p-4 text-sm text-gray-500">{candidate.reason}</td>
                  <td className="p-4 text-sm text-gray-500">{candidate.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.status === 'Vivier' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Consulter</button>
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
