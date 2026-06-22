"use client";

export default function ClientLoginPage() {
  return (
    <div className="w-full max-w-[440px] p-10 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100">
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl mb-5 shadow-lg shadow-blue-500/30">
          MC
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Espace Client</h1>
        <p className="text-sm text-gray-500 mt-2">
          Connectez-vous pour suivre vos demandes et échanger avec Menua Consulting.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href = '/client/conversations'; }}>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Adresse email</label>
          <input
            type="email"
            required
            placeholder="contact@entreprise.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm"
            defaultValue="contact@societe-alpha.com"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-800">Mot de passe</label>
            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">Mot de passe oublié ?</a>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-sm tracking-widest"
            defaultValue="password123"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-600/20 transition-all mt-4 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
