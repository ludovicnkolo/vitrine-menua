"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
//  ADMIN SIDEBAR — Menua Consulting CRM
// ============================================================

type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string | null;
  children?: NavItem[];
};

// ── Séparateur de section ──────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-600 select-none">
      {label}
    </p>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  // Extract lang from pathname (e.g., "/fr/admin/..." -> "fr")
  const lang = pathname.split('/')[1] || 'fr';
  const isEn = lang === 'en';

  // ── 1. RÉCEPTION & ÉCHANGES : CONTACTS ────────────────────
  const contactsItems: NavItem[] = [
    { label: isEn ? "Inbox" : "Boîte de réception", href: `/${lang}/admin/contacts/inbox`, icon: "📥", badge: "12" },
    { label: isEn ? "In Progress" : "En cours / À traiter", href: `/${lang}/admin/contacts/en-cours`, icon: "🔄", badge: "4" },
    { label: isEn ? "Archives" : "Archives", href: `/${lang}/admin/contacts/archives`, icon: "🗄️" },
  ];

  // ── 2. RÉCEPTION & ÉCHANGES : RECRUTEMENT ─────────────────
  const recrutementItems: NavItem[] = [
    { label: isEn ? "New Applications" : "Nouvelles candidatures", href: `/${lang}/admin/recrutements/inbox`, icon: "👋", badge: "3" },
    { label: isEn ? "In Evaluation" : "Profils en évaluation", href: `/${lang}/admin/recrutements/evaluation`, icon: "⏳" },
    { label: isEn ? "Talent Pool / Rejected" : "Vivier / Refusés", href: `/${lang}/admin/recrutements/vivier`, icon: "📁" },
  ];

  // ── 3. SUIVI RÉEL (Clients) ─────────────────────────────────
  const suiviClientsItems: NavItem[] = [
    { label: isEn ? "Clients & Prospects" : "Clients & Prospects", href: `/${lang}/admin/clients`, icon: "🏦" },
    { label: isEn ? "Mission Files" : "Dossiers de mission", href: `/${lang}/admin/dossiers?pole=clients`, icon: "📋" },
    { label: isEn ? "KYC / Contracts" : "Suivi KYC / Contrats", href: `/${lang}/admin/clients/documents`, icon: "🛡️" },
  ];

  const suiviPrestatairesItems: NavItem[] = [
    { label: isEn ? "Contractors" : "Collaborateurs / Prestataires", href: `/${lang}/admin/prestataires`, icon: "🤝" },
    { label: isEn ? "Mission Assignments" : "Affectation missions", href: `/${lang}/admin/dossiers?pole=prestataires`, icon: "🎯" },
    { label: isEn ? "Legal Documents" : "Documents légaux", href: `/${lang}/admin/prestataires/documents`, icon: "📄" },
  ];

  // ── Configuration ───────────────────────────────────────
  const configItems: NavItem[] = [
    { label: isEn ? "Global Dashboard" : "Tableau de bord global", href: `/${lang}/admin`, icon: "📊" },
    { label: isEn ? "CRM Users" : "Utilisateurs CRM", href: `/${lang}/admin/utilisateurs`, icon: "⚙️" },
    { label: isEn ? "Settings" : "Paramètres", href: `/${lang}/admin/parametres`, icon: "🔧" },
  ];

  const isActive = (item: NavItem) => {
    // Exact match handling query parameters
    const pathWithoutQuery = item.href.split('?')[0];
    if (pathname === pathWithoutQuery) return true;
    if (item.children) return item.children.some((c) => pathname === c.href.split('?')[0]);
    return false;
  };

  const renderItem = (item: NavItem) => {
    const active = isActive(item);
    const exactActive = pathname === item.href.split('?')[0];

    return (
      <li key={item.label} className="mb-0.5">
        <Link
          href={item.href}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
            exactActive
              ? "bg-indigo-600/20 text-indigo-400 font-semibold"
              : active
              ? "text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </div>
          {item.badge && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                exactActive ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"
              }`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  // Helper to switch language keeping the same path
  const toggleLangPath = isEn ? pathname.replace(/^\/en/, '/fr') : pathname.replace(/^\/fr/, '/en');

  return (
    <aside className="w-64 bg-[#0a1128] text-white flex flex-col h-screen border-r border-gray-800 shrink-0">
      {/* ── Brand ── */}
      <div className="p-5 flex items-center justify-between border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            MC
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-white">MENUA</span>
            <span className="block text-[10px] text-gray-500 tracking-widest uppercase">CRM</span>
          </div>
        </div>

        {/* ── Language Switcher ── */}
        <Link href={toggleLangPath} className="text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded">
          {isEn ? "FR" : "EN"}
        </Link>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">

        {/* 1. Messagerie Contacts */}
        <SectionLabel label={isEn ? "1. Contact Messages" : "1. Messagerie Contacts"} />
        <ul className="space-y-0.5">
          {contactsItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* 2. Messagerie Recrutement */}
        <SectionLabel label={isEn ? "2. Recruitment Messages" : "2. Messagerie Recrutement"} />
        <ul className="space-y-0.5">
          {recrutementItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* 3. Base de Suivi Réel */}
        <SectionLabel label={isEn ? "3. Active Tracking : Clients" : "3. Suivi Actif : Clients"} />
        <ul className="space-y-0.5 mb-2">
          {suiviClientsItems.map(renderItem)}
        </ul>

        <SectionLabel label={isEn ? "3. Active Tracking : Contractors" : "3. Suivi Actif : Prestataires"} />
        <ul className="space-y-0.5">
          {suiviPrestatairesItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* Configuration */}
        <SectionLabel label={isEn ? "Administration" : "Administration"} />
        <ul className="space-y-0.5">
          {configItems.map(renderItem)}
        </ul>
      </div>

      {/* ── Profil utilisateur ── */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
          RF
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">Rosette Fouelefack</p>
          <p className="text-[11px] text-gray-500">{isEn ? "Administrator" : "Administrateur"}</p>
        </div>
      </div>
    </aside>
  );
}
