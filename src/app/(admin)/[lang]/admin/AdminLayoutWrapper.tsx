"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/admin/login");
  const lang = pathname.split('/')[1] || 'fr';
  const isEn = lang === 'en';

  if (isLoginPage) {
    return (
      <main className="w-full h-screen bg-[#0a1128] flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ── Top Header Bar ── */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 shrink-0 gap-3 shadow-sm">
          {/* Notifications bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* User profile */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Rosette Fouelefack</p>
              <p className="text-xs text-gray-500">{isEn ? "Administrator" : "Administrateur"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-transparent group-hover:ring-indigo-300 transition-all">
              RF
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f6]">
          {children}
        </main>
      </div>
    </>
  );
}
