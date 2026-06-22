"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const MOCK_DOSSIERS = [
  { id: "DOS-2026-001", client: "Société Générale", title: "Externalisation KYC Q3", progress: 65, manager: "Sophie L.", status: "Actif" },
  { id: "DOS-2026-002", client: "BNP Paribas", title: "Support Reporting Réglementaire", progress: 20, manager: "Marc T.", status: "Actif" },
  { id: "DOS-2026-003", client: "Cabinet Légal Paris", title: "Audit de conformité LCB-FT", progress: 100, manager: "Sophie L.", status: "Terminé" },
];

export default function DossiersPage() {
  const searchParams = useSearchParams();
  const pole = searchParams?.get("pole") || "clients";
  
  const isClients = pole === "clients";

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">
            Dossiers de mission <span className="text-indigo-600">({isClients ? "Clients" : "Prestataires"})</span>
          </h1>
          <p className="admin-subtitle">Suivi de l'avancement des dossiers et affectations.</p>
        </div>
        <button className="admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nouveau Dossier
        </button>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Référence</th>
                <th className="p-4 font-medium">{isClients ? "Client" : "Prestataire"}</th>
                <th className="p-4 font-medium">Intitulé de la mission</th>
                <th className="p-4 font-medium">Avancement</th>
                <th className="p-4 font-medium">Responsable</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DOSSIERS.map((dossier) => (
                <tr key={dossier.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 text-sm font-medium text-gray-900">{dossier.id}</td>
                  <td className="p-4 text-sm font-semibold text-gray-800">{dossier.client}</td>
                  <td className="p-4 text-sm text-gray-600">{dossier.title}</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${dossier.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${dossier.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{dossier.progress}% complété</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{dossier.manager}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dossier.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {dossier.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Gérer</button>
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
