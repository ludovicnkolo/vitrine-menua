"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/client/login";

  if (isLoginPage) {
    return (
      <main className="w-full h-screen bg-[#0a1128] flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar Client */}
      <aside className="w-64 bg-[#0d1e35] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg mb-3">
            MC
          </div>
          <h2 className="text-sm font-bold tracking-wider text-blue-100 uppercase">Espace Client</h2>
          <p className="text-xs text-blue-300/60 mt-1">Société Alpha</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/client/conversations" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/client/conversations') ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-gray-300 hover:bg-white/5'}`}>
            <span>💬</span> Mes demandes
          </Link>
          <Link href="/client/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors">
            <span>👤</span> Mon profil
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <Link href="/client/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-colors text-sm font-medium">
            <span>🚪</span> Déconnexion
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center flex-shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Suivi de vos demandes</h1>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20">
            + Nouvelle demande
          </button>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
