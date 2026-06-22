import React from "react";

const MOCK_CONTACTS = [
  { id: 1, name: "Sophie Laurent", company: "Banque Atlantique", subject: "Audit des processus middle-office", date: "15 Juin 2026", status: "En cours" },
  { id: 2, name: "Pierre Dubois", company: "FinTech Solutions", subject: "Mission de transition DAF", date: "10 Juin 2026", status: "En attente client" },
];

export default function ContactsEnCoursPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Contacts en cours</h1>
          <p className="admin-subtitle">Suivi des discussions commerciales et devis en cours d'élaboration.</p>
        </div>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Entreprise</th>
                <th className="p-4 font-medium">Dossier</th>
                <th className="p-4 font-medium">Dernier échange</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{contact.name}</td>
                  <td className="p-4 text-sm text-gray-600">{contact.company}</td>
                  <td className="p-4 text-sm text-gray-900">{contact.subject}</td>
                  <td className="p-4 text-sm text-gray-500">{contact.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.status === 'En cours' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Suivre</button>
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
