"use client";

import React from "react";

export default function ContactsPage() {
  const contacts = [
    { name: "Jean Martin", email: "jean.martin@gmail.com", company: "Martin & Co", phone: "+33 6 12 34 56 78", type: "Client", tags: ["Devis", "Site web"] },
    { name: "Marie Bernard", email: "marie.bernard@entreprise.com", company: "Entreprise SAS", phone: "+33 6 98 76 54 32", type: "Client", tags: ["Support"] },
    { name: "Pierre Dubois", email: "pierre.dubois@gmail.com", company: "-", phone: "+33 6 45 67 89 12", type: "Prospect", tags: ["Prospection"] },
    { name: "Sophie Leroy", email: "sophie.leroy@example.com", company: "Leroy Consulting", phone: "+33 6 23 45 67 89", type: "Prospect", tags: ["Animation"] },
    { name: "contact@startup.com", email: "contact@startup.com", company: "Startup", phone: "+33 1 23 45 67 89", type: "Partenaire", tags: ["Partenariat"] },
    { name: "Anonyme", email: "-", company: "-", phone: "-", type: "Anonyme", tags: [] },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos contacts</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>+</span> Nouveau contact
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div className="relative w-72">
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un contact..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="text-sm px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <span>⚙️</span> Filtrer
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{contact.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{contact.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.type === "Client" ? "bg-blue-100 text-blue-800" :
                      contact.type === "Prospect" ? "bg-amber-100 text-amber-800" :
                      contact.type === "Partenaire" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {contact.tags.map((tag, j) => (
                        <span key={j} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-200">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length === 0 && <span className="text-gray-400">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-500">
            6 résultats
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded bg-indigo-600 text-white font-medium text-sm">1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600 font-medium text-sm">2</button>
            <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600 font-medium text-sm">›</button>
          </div>
        </div>

      </div>
    </div>
  );
}
