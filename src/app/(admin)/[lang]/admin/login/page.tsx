"use client";

import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <div className="w-full max-w-[440px] p-10 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100">
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-800 flex items-center justify-center font-bold text-white text-2xl mb-5 shadow-lg shadow-indigo-600/30">
          MC
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Espace Administration</h1>
        <p className="text-sm text-gray-500 mt-2">
          Connectez-vous pour accéder au CRM Menua Consulting.
        </p>
      </div>

      <form action={loginAction} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Adresse email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="votre@email.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
            defaultValue="admin@menuaconsulting.com"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-800">Mot de passe</label>
            <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">Mot de passe oublié ?</a>
          </div>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm tracking-widest"
            defaultValue="admin123"
          />
        </div>

        <div className="flex items-center pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" className="w-5 h-5 border-gray-300 rounded text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer" defaultChecked />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Rester connecté</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all mt-4 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
