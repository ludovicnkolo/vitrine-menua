import React from "react";

const MOCK_CONTACTS = [
  { id: 1, name: "Lucie Bernard", company: "Consulting Group", subject: "Demande d'informations", date: "01 Juin 2026", status: "Clôturé" },
  { id: 2, name: "Antoine Petit", company: "Retail Corp", subject: "Mise en conformité", date: "25 Mai 2026", status: "Traité" },
];

export default function ContactsArchivesPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Archives Contacts</h1>
          <p className="admin-subtitle">Historique des demandes traitées ou fermées.</p>
        </div>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Entreprise</th>
                <th className="p-4 font-medium">Sujet</th>
                <th className="p-4 font-medium">Date de clôture</th>
                <th className="p-4 font-medium">Statut final</th>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {contact.status}
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
