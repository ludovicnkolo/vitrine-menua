"use client";

import React from "react";

export default function ParametresPage() {
  return (
    <div className="p-8 w-full max-w-4xl mx-auto h-screen flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h1 className="admin-title">Paramètres</h1>
        <p className="admin-subtitle">Configurez votre environnement MyCRM</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Profil et Notifications</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Notifications par email</h3>
              <p className="text-xs text-gray-500">Recevoir un email à chaque nouveau message entrant.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Réponse automatique</h3>
              <p className="text-xs text-gray-500">Envoyer automatiquement un accusé de réception.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Apparence</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Thème par défaut</label>
            <select className="w-full md:w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500">
              <option>Clair</option>
              <option>Sombre</option>
              <option>Système</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Langue de l'interface</label>
            <select className="w-full md:w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500">
              <option>Français</option>
              <option>Anglais</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}
