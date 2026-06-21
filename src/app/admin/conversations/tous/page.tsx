"use client";

import React, { useState } from "react";

export default function ConversationsPage() {
  const [activeMessage, setActiveMessage] = useState(0);
  const [activeTab, setActiveTab] = useState("Tous");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const tabs = [
    { id: "Tous", label: "Tous", count: 156 },
    { id: "Nouveaux", label: "Nouveaux", count: 12 },
    { id: "En cours", label: "En cours", count: 6 },
    { id: "En attente", label: "En attente", count: 4 },
    { id: "Traités", label: "Traités", count: 138 },
  ];

  // Dummy messages to fill the list (around 9 items)
  const mockConversations = [
    {
      name: "Jean Martin",
      clientType: "Prospect",
      time: "10:24",
      subject: "Demande de devis pour site web",
      snippet: "Bonjour, je souhaite un devis pour la création d'un site web vitrine pour mon entreprise...",
      counts: { nouveaux: 2, encours: 1, enattente: 0 }
    },
    {
      name: "Marie Bernard",
      clientType: "Client",
      time: "09:15",
      subject: "Problème de connexion",
      snippet: "Bonjour, je n'arrive plus à me connecter à mon espace client depuis hier...",
      counts: { nouveaux: 0, encours: 3, enattente: 1 }
    },
    {
      name: "Société Alpha",
      clientType: "Partenaire",
      time: "Hier",
      subject: "Partenariat stratégique",
      snippet: "Suite à notre échange téléphonique, voici la proposition de partenariat...",
      counts: { nouveaux: 1, encours: 0, enattente: 0 }
    },
    {
      name: "Lucie Dubois",
      clientType: "Anonyme",
      time: "Hier",
      subject: "Candidature - Analyste Financier",
      snippet: "Veuillez trouver ci-joint mon CV et ma lettre de motivation pour le poste...",
      counts: { nouveaux: 0, encours: 0, enattente: 2 }
    },
    {
      name: "Cabinet Dubois & Associés",
      clientType: "Client",
      time: "Lun",
      subject: "Demande de reporting Q2",
      snippet: "Pouvez-vous nous faire parvenir le reporting financier pour le deuxième trimestre ?",
      counts: { nouveaux: 0, encours: 1, enattente: 0 }
    },
    {
      name: "Pierre Lefevre",
      clientType: "Prospect",
      time: "Lun",
      subject: "Question sur la conformité AMF",
      snippet: "Nous avons une interrogation concernant les nouvelles directives de conformité...",
      counts: { nouveaux: 1, encours: 2, enattente: 0 }
    },
    {
      name: "Banque Nationale",
      clientType: "Partenaire",
      time: "24/05",
      subject: "Validation des flux SEPA",
      snippet: "Les flux SEPA de ce matin nécessitent une double validation de votre part.",
      counts: { nouveaux: 0, encours: 0, enattente: 1 }
    },
    {
      name: "Sophie Laurent",
      clientType: "Client",
      time: "23/05",
      subject: "Assistance technique requise",
      snippet: "Le portail partenaire affiche une erreur 500 lorsque j'essaie de télécharger...",
      counts: { nouveaux: 0, encours: 4, enattente: 0 }
    },
    {
      name: "Groupe Horizon",
      clientType: "Prospect",
      time: "22/05",
      subject: "Externalisation Back Office",
      snippet: "Nous souhaiterions discuter de l'externalisation de notre back office titres.",
      counts: { nouveaux: 3, encours: 0, enattente: 0 }
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Left List */}
      <div className="w-1/3 min-w-[350px] max-w-md border-r border-gray-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversations</h2>
          <div className="relative mb-4">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.label} {tab.count}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv, idx) => (
            <div 
              key={idx}
              className={`p-4 border-b border-gray-100 cursor-pointer ${activeMessage === idx ? "bg-indigo-50 border-l-4 border-l-indigo-600" : "hover:bg-gray-50 border-l-4 border-l-transparent"}`} 
              onClick={() => setActiveMessage(idx)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{conv.name}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    conv.clientType === 'Client' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    conv.clientType === 'Prospect' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    conv.clientType === 'Partenaire' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {conv.clientType}
                  </span>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
              </div>
              <p className="text-xs font-medium text-gray-800 mb-1">{conv.subject}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{conv.snippet}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {conv.counts.nouveaux} Nouveaux
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {conv.counts.encours} En cours
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {conv.counts.enattente} En attente
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane (Horizontal Details + Message Thread) */}
      <div className="flex-1 bg-gray-50 flex flex-col h-full overflow-hidden">
        
        {/* HORIZONTAL DETAILS BAR */}
        <div className="bg-white border-b border-gray-200 flex flex-col flex-shrink-0">
          <div className="px-6 py-3 flex flex-wrap items-center gap-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</label>
              <select className="text-sm bg-gray-50 border border-gray-200 rounded p-1.5 outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 font-medium cursor-pointer">
                <option>Nouveau</option>
                <option>En cours</option>
                <option>En attente</option>
                <option>Traité</option>
                <option>Archivé</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</label>
              <select className="text-sm bg-gray-50 border border-gray-200 rounded p-1.5 outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 cursor-pointer">
                <option>Demande de devis</option>
                <option>Contact général</option>
                <option>Demande commerciale</option>
                <option>Recrutement</option>
                <option>Partenariat</option>
                <option>Presse / Média</option>
                <option>Juridique</option>
                <option>Support technique</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigné à</label>
              <select className="text-sm bg-gray-50 border border-gray-200 rounded p-1.5 outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 cursor-pointer">
                <option>Jean Dupont</option>
                <option>Sophie Martin</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priorité</label>
              <select className="text-sm bg-gray-50 border border-gray-200 rounded p-1.5 outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 cursor-pointer">
                <option>Normale</option>
                <option>Haute</option>
                <option>Basse</option>
              </select>
            </div>

            <div className="ml-auto">
              <button className="text-xs px-4 py-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg font-medium hover:bg-rose-100 transition-colors">
                Archiver
              </button>
            </div>
          </div>
          
          <div className="px-6 py-2 bg-gray-50 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Étiquettes</span>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-white text-slate-700 rounded border border-slate-200 shadow-sm">🗄️ Back Office</span>
              <span className="text-xs px-2 py-1 bg-white text-gray-700 rounded border border-gray-200 shadow-sm">🌍 Français</span>
              <button className="text-xs px-2 py-1 border border-dashed border-gray-300 text-gray-500 rounded hover:bg-white bg-transparent">+</button>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{mockConversations[activeMessage].subject}</h2>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="text-sm px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm transition-colors"
            >
              <span className="text-indigo-600">⏱️</span> Historique complet
            </button>
          </div>
          
          {/* Incoming Message */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {mockConversations[activeMessage].name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">{mockConversations[activeMessage].name}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      mockConversations[activeMessage].clientType === 'Client' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      mockConversations[activeMessage].clientType === 'Prospect' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      mockConversations[activeMessage].clientType === 'Partenaire' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {mockConversations[activeMessage].clientType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">contact@client.com</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{mockConversations[activeMessage].time}</span>
            </div>
            <div className="text-sm text-gray-700 space-y-4">
              <p>Bonjour,</p>
              <p>{mockConversations[activeMessage].snippet}</p>
              <p>Pouvez-vous me recontacter rapidement à ce sujet ?</p>
              <p>Cordialement,<br/>{mockConversations[activeMessage].name}</p>
            </div>
          </div>
          
          {/* Reply Box */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex gap-4 text-sm font-medium">
              <button className="text-indigo-600 border-b-2 border-indigo-600 pb-2 -mb-3">Répondre</button>
              <button className="text-gray-500 hover:text-gray-700">Note interne</button>
            </div>
            <div className="p-4">
              <textarea 
                className="w-full h-32 outline-none resize-none text-sm p-2"
                placeholder="Écrire votre réponse..."
                defaultValue={`Bonjour ${mockConversations[activeMessage].name.split(" ")[0]},\n\nMerci pour votre message. Je vous contacte dans la journée pour discuter de votre demande.`}
              ></textarea>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="flex gap-3 text-gray-500">
                <button className="hover:text-gray-700">📎</button>
                <button className="hover:text-gray-700">😀</button>
                <button className="hover:text-gray-700">A</button>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding History Drawer */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isHistoryOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsHistoryOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isHistoryOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 text-lg">Historique complet</h3>
            <button 
              onClick={() => setIsHistoryOpen(false)} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Timeline items */}
              <div className="relative pl-6 border-l-2 border-indigo-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Aujourd'hui, {mockConversations[activeMessage].time}</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 shadow-sm">
                  <span className="font-semibold text-indigo-700 block mb-1">{mockConversations[activeMessage].name} :</span> 
                  {mockConversations[activeMessage].snippet}
                </div>
              </div>
              
              <div className="relative pl-6 border-l-2 border-gray-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Hier, 15:30</p>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-gray-700">
                  <span className="font-semibold text-indigo-700 block mb-1">Vous :</span> 
                  Bonjour, bien reçu. Nous étudions votre demande et revenons vers vous.
                </div>
              </div>

              <div className="relative pl-6 border-transparent pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white"></div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Hier, 10:00</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700">
                  <span className="font-semibold text-gray-700 block mb-1">Système :</span> 
                  Création du ticket depuis le formulaire de contact web.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
