"use client";

import { useState } from "react";

export default function ClientConversationsPage() {
  const [activeTicket, setActiveTicket] = useState<number | null>(0);

  const clientTickets = [
    {
      id: "REQ-2024-089",
      subject: "Partenariat stratégique",
      status: "En cours",
      date: "Aujourd'hui, 10:24",
      unread: false,
      messages: [
        { sender: "client", name: "Vous", text: "Suite à notre échange téléphonique, voici la proposition de partenariat. Pouvez-vous me faire un retour ?", time: "Lundi, 09:00" },
        { sender: "admin", name: "Menua Consulting", text: "Bonjour, bien reçu. Nous étudions votre demande avec notre pôle juridique et revenons vers vous d'ici demain.", time: "Hier, 15:30" }
      ]
    },
    {
      id: "REQ-2024-042",
      subject: "Demande de reporting Q2",
      status: "Traité",
      date: "12 Mai 2024",
      unread: false,
      messages: [
        { sender: "client", name: "Vous", text: "Pouvez-vous nous faire parvenir le reporting financier pour le deuxième trimestre ?", time: "10 Mai 2024" },
        { sender: "admin", name: "Menua Consulting", text: "Veuillez trouver ci-joint le reporting demandé. Restant à votre disposition.", time: "12 Mai 2024" }
      ]
    }
  ];

  return (
    <div className="client-page !flex-row !h-[calc(100vh-80px)] !pb-6 gap-6">
      
      {/* Liste des tickets (gauche) */}
      <div className="w-1/3 client-card !p-0 !rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une demande..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {clientTickets.map((ticket, idx) => (
            <div 
              key={ticket.id}
              onClick={() => setActiveTicket(idx)}
              className={`p-5 border-b border-gray-100 cursor-pointer transition-colors ${activeTicket === idx ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{ticket.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  ticket.status === 'Traité' ? 'bg-emerald-100 text-emerald-700' :
                  ticket.status === 'En cours' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{ticket.subject}</h3>
              <p className="text-xs text-gray-500 truncate">{ticket.messages[ticket.messages.length - 1].text}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span>Dernière maj: {ticket.date}</span>
                <span className="text-blue-600">Voir →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Détail du ticket (droite) */}
      <div className="flex-1 client-card !p-0 !rounded-2xl flex flex-col overflow-hidden">
        {activeTicket !== null ? (
          <>
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{clientTickets[activeTicket].subject}</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    clientTickets[activeTicket].status === 'Traité' ? 'bg-emerald-100 text-emerald-700' :
                    clientTickets[activeTicket].status === 'En cours' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {clientTickets[activeTicket].status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Réf: {clientTickets[activeTicket].id}
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {clientTickets[activeTicket].messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                    msg.sender === 'client' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}>
                    <div className="flex justify-between items-center mb-2 gap-8">
                      <span className={`text-xs font-bold ${msg.sender === 'client' ? 'text-blue-100' : 'text-indigo-600'}`}>
                        {msg.name}
                      </span>
                      <span className={`text-[10px] ${msg.sender === 'client' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white border-t border-gray-100">
              <div className="relative">
                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 pr-16 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none h-24 transition-colors"
                  placeholder="Écrivez votre réponse ici..."
                ></textarea>
                <div className="absolute right-4 bottom-4 flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    📎
                  </button>
                  <button className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-4">💬</span>
            <p className="font-medium text-gray-500">Sélectionnez une demande pour voir l'historique</p>
          </div>
        )}
      </div>

    </div>
  );
}
