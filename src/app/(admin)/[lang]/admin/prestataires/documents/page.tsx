import React from "react";

const MOCK_DOCS = [
  { id: 1, name: "RIB_Prestat_Dupont.pdf", prestataire: "Jean Dupont", type: "Financier", date: "20 Juin 2026", status: "Vérifié" },
  { id: 2, name: "Attestation_URSSAF.pdf", prestataire: "Marie Curie", type: "Légal", date: "21 Juin 2026", status: "Expiré" },
  { id: 3, name: "Contrat_SousTraitance_V2.docx", prestataire: "Consulting Group", type: "Contrat", date: "22 Juin 2026", status: "En attente de signature" },
];

export default function PrestatairesDocumentsPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Documents Légaux Prestataires</h1>
          <p className="admin-subtitle">Centralisation des pièces administratives, URSSAF, RIB et contrats des collaborateurs.</p>
        </div>
        <button className="admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          Uploader un document
        </button>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Fichier</th>
                <th className="p-4 font-medium">Prestataire / Collaborateur</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Date d'upload</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DOCS.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800">{doc.prestataire}</td>
                  <td className="p-4 text-sm text-gray-600">{doc.type}</td>
                  <td className="p-4 text-sm text-gray-500">{doc.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === 'Vérifié' ? 'bg-green-100 text-green-800' : 
                      doc.status === 'Expiré' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="text-gray-500 hover:text-indigo-600" title="Télécharger">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </button>
                    <button className="text-gray-500 hover:text-red-600" title="Supprimer">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
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
