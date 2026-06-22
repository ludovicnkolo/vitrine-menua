import React from "react";

const MOCK_CONTACTS = [
  { id: 1, name: "Jean Dupont", company: "Société Générale", subject: "Demande d'externalisation KYC", date: "22 Juin 2026", status: "Nouveau" },
  { id: 2, name: "Alice Martin", company: "Cabinet Légal Paris", subject: "Support reporting financier", date: "21 Juin 2026", status: "Nouveau" },
  { id: 3, name: "Marc Tremblay", company: "Indépendant", subject: "Partenariat d'affaires", date: "20 Juin 2026", status: "Nouveau" },
];

export default function ContactsInboxPage() {
  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Boîte de réception (Contacts)</h1>
          <p className="admin-subtitle">Nouvelles demandes commerciales et messages entrants.</p>
        </div>
        <button className="admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nouveau Message
        </button>
      </div>

      <div className="admin-card mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-medium">Expéditeur</th>
                <th className="p-4 font-medium">Entreprise</th>
                <th className="p-4 font-medium">Sujet</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {contact.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{contact.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{contact.company}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{contact.subject}</td>
                  <td className="p-4 text-sm text-gray-500">{contact.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Ouvrir</button>
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
