"use client";

import React from "react";

export default function DashboardPage() {
  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <h1 className="admin-title">Tableau de bord</h1>
          <p className="admin-subtitle">Vue d'ensemble de vos conversations</p>
        </div>
        <div>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
            <span>📅</span> 7 derniers jours
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard title="Total messages" value="156" trend="+12% vs sem. dern." trendUp={true} icon="💬" color="indigo" />
        <StatCard title="Non traités" value="12" trend="-8% vs sem. dern." trendUp={false} icon="⏱️" color="rose" />
        <StatCard title="En cours" value="6" trend="+3% vs sem. dern." trendUp={true} icon="🔄" color="amber" />
        <StatCard title="Traités" value="138" trend="+15% vs sem. dern." trendUp={true} icon="✅" color="emerald" />
        <StatCard title="Temps moy." value="2h 45m" trend="-18% vs sem. dern." trendUp={true} icon="⏳" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Messages par catégorie */}
        <div className="admin-card">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Messages par catégorie</h2>
          <div className="flex items-center gap-4">
            {/* Mock Donut Chart */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path className="text-blue-500" strokeWidth="6" stroke="currentColor" fill="none" strokeDasharray="38, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-500" strokeWidth="6" stroke="currentColor" fill="none" strokeDasharray="24, 100" strokeDashoffset="-38" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-gray-300" strokeWidth="6" stroke="currentColor" fill="none" strokeDasharray="20, 100" strokeDashoffset="-62" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-rose-500" strokeWidth="6" stroke="currentColor" fill="none" strokeDasharray="10, 100" strokeDashoffset="-82" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-purple-500" strokeWidth="6" stroke="currentColor" fill="none" strokeDasharray="8, 100" strokeDashoffset="-92" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              <LegendItem color="bg-blue-500" label="Clients" value="62" percentage="38.7%" />
              <LegendItem color="bg-amber-500" label="Prospects" value="38" percentage="24.4%" />
              <LegendItem color="bg-gray-300" label="Anonymes" value="32" percentage="20.5%" />
              <LegendItem color="bg-rose-500" label="Partenaires" value="14" percentage="9.0%" />
              <LegendItem color="bg-purple-500" label="Autres" value="10" percentage="6.4%" />
            </div>
          </div>
        </div>

        {/* Évolution des messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:col-span-2">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Évolution des messages</h2>
          {/* Mock Line Chart */}
          <div className="w-full h-32 relative flex items-end justify-between pt-2 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400">
              <div className="border-b border-gray-100 w-full h-0">40</div>
              <div className="border-b border-gray-100 w-full h-0">30</div>
              <div className="border-b border-gray-100 w-full h-0">20</div>
              <div className="border-b border-gray-100 w-full h-0">10</div>
              <div className="border-b border-gray-100 w-full h-0">0</div>
            </div>
            {/* Chart SVG */}
            <svg className="absolute inset-0 w-full h-full pt-4 pb-6 px-4" preserveAspectRatio="none">
              <polyline points="0,120 100,100 200,130 300,110 400,140 500,60 600,110 700,90" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />
              <polyline points="0,150 100,160 200,150 300,155 400,160 500,130 600,140 700,150" fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="5,5" strokeLinejoin="round" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between px-4 text-xs font-medium text-gray-500">
              <span>25 Mai</span>
              <span>26 Mai</span>
              <span>27 Mai</span>
              <span>28 Mai</span>
              <span>29 Mai</span>
              <span>30 Mai</span>
              <span>31 Mai</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Reçus</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-blue-300"></span> Envoyés</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Messages récents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-2 px-4">
          <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
            <h2 className="text-sm font-bold text-gray-900">Messages récents</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Voir tous les messages →</button>
          </div>
          <div className="space-y-0">
            <RecentMessage name="Jean Martin" subject="Demande de devis pour site web" status="Non traité" statusColor="text-rose-500 bg-rose-50" time="10:24" initial="J" />
            <RecentMessage name="Marie Bernard" subject="Problème de connexion à mon compte" status="En cours" statusColor="text-amber-500 bg-amber-50" time="09:15" initial="M" />
            <RecentMessage name="contact@entreprise.com" subject="Partenariat potentiel" status="En attente" statusColor="text-blue-500 bg-blue-50" time="Hier" initial="C" />
            <RecentMessage name="Anonyme" subject="Question sur vos services ?" status="Non traité" statusColor="text-rose-500 bg-rose-50" time="Hier" initial="A" />
          </div>
        </div>

        {/* Répartition des statuts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-2 px-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-50 pb-2">Répartition des statuts</h2>
          <div className="flex items-center gap-4 h-full pb-1">
            <div className="relative w-20 h-20 flex-shrink-0 mx-auto">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path className="text-emerald-500" strokeWidth="8" stroke="currentColor" fill="none" strokeDasharray="88.5, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-rose-500" strokeWidth="8" stroke="currentColor" fill="none" strokeDasharray="7.7, 100" strokeDashoffset="-88.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-amber-500" strokeWidth="8" stroke="currentColor" fill="none" strokeDasharray="3.8, 100" strokeDashoffset="-96.2" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-rose-500"></span>
                  <span className="text-sm font-medium text-gray-700">Non traités</span>
                </div>
                <div className="text-sm text-gray-500">12 (7.7%)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-amber-500"></span>
                  <span className="text-sm font-medium text-gray-700">En cours</span>
                </div>
                <div className="text-sm text-gray-500">6 (3.8%)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-blue-500"></span>
                  <span className="text-sm font-medium text-gray-700">En attente</span>
                </div>
                <div className="text-sm text-gray-500">4 (2.6%)</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500"></span>
                  <span className="text-sm font-medium text-gray-700">Traités</span>
                </div>
                <div className="text-sm text-gray-500">138 (88.5%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className={`text-[10px] font-medium ${trendUp ? "text-emerald-600" : "text-gray-500"}`}>
          {trend}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="text-xl font-bold text-gray-900 leading-none">{value}</div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, percentage }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex gap-4">
        <span className="text-sm font-semibold text-gray-900 w-8 text-right">{value}</span>
        <span className="text-sm text-gray-400 w-12 text-right">{percentage}</span>
      </div>
    </div>
  );
}

function RecentMessage({ name, subject, status, statusColor, time, initial }: any) {
  return (
    <div className="flex items-center gap-2 py-1 px-1.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-[10px] flex-shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-semibold text-gray-900 truncate leading-tight">{name}</h4>
        <p className="text-[10px] text-gray-500 truncate leading-tight">{subject}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusColor} leading-none`}>{status}</span>
        <span className="text-[9px] text-gray-400 leading-none">{time}</span>
      </div>
    </div>
  );
}
