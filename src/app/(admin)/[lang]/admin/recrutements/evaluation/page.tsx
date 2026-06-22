import React from "react";

const MOCK_CANDIDATES = [
  { id: 1, name: "Isaac Newton", role: "Comptable OPCVM", step: "Entretien RH", interviewer: "Sarah", date: "24 Juin 2026", status: "En évaluation" },
  { id: 2, name: "Ada Lovelace", role: "Spécialiste KYC", step: "Test Technique", interviewer: "Marc", date: "26 Juin 2026", status: "En évaluation" },
];

export default function RecrutementEvaluationPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Profils en évaluation</h1>
          <p className="admin-subtitle">Candidats actuellement dans le processus de recrutement (entretiens, tests).</p>
        </div>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Candidat</th>
                <th className="p-4 font-medium">Poste visé</th>
                <th className="p-4 font-medium">Étape actuelle</th>
                <th className="p-4 font-medium">Évaluateur</th>
                <th className="p-4 font-medium">Prochaine action</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CANDIDATES.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{candidate.name}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{candidate.role}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {candidate.step}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{candidate.interviewer}</td>
                  <td className="p-4 text-sm text-gray-500">{candidate.date}</td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Détails</button>
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
