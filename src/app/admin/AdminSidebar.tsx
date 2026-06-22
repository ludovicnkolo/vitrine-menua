"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
//  ADMIN SIDEBAR — Menua Consulting CRM
//  Séparation stricte Pôle Clients/Prospects ≠ Pôle Prestataires
//  Conforme aux directives de la Présidente (email du 22/06/2026)
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

  // ── 1. RÉCEPTION & ÉCHANGES : CONTACTS ────────────────────
  // Formulaires vitrine (demandes commerciales, devis...)
  const contactsItems: NavItem[] = [
    { label: "Boîte de réception", href: "/admin/contacts/inbox", icon: "📥", badge: "12" },
    { label: "En cours / À traiter", href: "/admin/contacts/en-cours", icon: "🔄", badge: "4" },
    { label: "Archives", href: "/admin/contacts/archives", icon: "🗄️" },
  ];

  // ── 2. RÉCEPTION & ÉCHANGES : RECRUTEMENT ─────────────────
  // Formulaires candidatures
  const recrutementItems: NavItem[] = [
    { label: "Nouvelles candidatures", href: "/admin/recrutements/inbox", icon: "👋", badge: "3" },
    { label: "Profils en évaluation", href: "/admin/recrutements/evaluation", icon: "⏳" },
    { label: "Vivier / Refusés", href: "/admin/recrutements/vivier", icon: "📁" },
  ];

  // ── 3. SUIVI RÉEL (Ceux qui intègrent l'entreprise) ───────
  // La base de données active
  const suiviClientsItems: NavItem[] = [
    { label: "Clients & Prospects", href: "/admin/clients", icon: "🏦" },
    { label: "Dossiers de mission", href: "/admin/dossiers?pole=clients", icon: "📋" },
    { label: "Suivi KYC / Contrats", href: "/admin/clients/documents", icon: "🛡️" },
  ];

  const suiviPrestatairesItems: NavItem[] = [
    { label: "Collaborateurs / Prestataires", href: "/admin/prestataires", icon: "🤝" },
    { label: "Affectation missions", href: "/admin/dossiers?pole=prestataires", icon: "🎯" },
    { label: "Documents légaux", href: "/admin/prestataires/documents", icon: "📄" },
  ];

  // ── Configuration ───────────────────────────────────────
  const configItems: NavItem[] = [
    { label: "Tableau de bord global", href: "/admin", icon: "📊" },
    { label: "Utilisateurs CRM", href: "/admin/utilisateurs", icon: "⚙️" },
    { label: "Paramètres", href: "/admin/parametres", icon: "🔧" },
  ];

  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) return item.children.some((c) => pathname === c.href);
    return false;
  };

  const renderItem = (item: NavItem) => {
    const active = isActive(item);
    const exactActive = pathname === item.href;

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

  return (
    <aside className="w-64 bg-[#0a1128] text-white flex flex-col h-screen border-r border-gray-800 shrink-0">
      {/* ── Brand ── */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-800/60">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
          MC
        </div>
        <div>
          <span className="font-bold text-sm tracking-wide text-white">MENUA</span>
          <span className="block text-[10px] text-gray-500 tracking-widest uppercase">CRM</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">

        {/* 1. Messagerie Contacts */}
        <SectionLabel label="1. Messagerie Contacts" />
        <ul className="space-y-0.5">
          {contactsItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* 2. Messagerie Recrutement */}
        <SectionLabel label="2. Messagerie Recrutement" />
        <ul className="space-y-0.5">
          {recrutementItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* 3. Base de Suivi Réel */}
        <SectionLabel label="3. Suivi Actif : Clients" />
        <ul className="space-y-0.5 mb-2">
          {suiviClientsItems.map(renderItem)}
        </ul>

        <SectionLabel label="3. Suivi Actif : Prestataires" />
        <ul className="space-y-0.5">
          {suiviPrestatairesItems.map(renderItem)}
        </ul>

        <div className="my-3 mx-3 border-t border-gray-800" />

        {/* Configuration */}
        <SectionLabel label="Administration" />
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
          <p className="text-[11px] text-gray-500">Administrateur</p>
        </div>
      </div>
    </aside>
  );
}
