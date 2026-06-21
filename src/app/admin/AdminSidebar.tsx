"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Tableau de bord", href: "/admin", icon: "📊", badge: null },
    { 
      label: "Conversations", 
      href: "/admin/conversations", 
      icon: "💬", 
      badge: "156",
      children: [
        { label: "Nouveaux", href: "/admin/conversations/nouveaux", icon: "🆕", badge: "12" },
        { label: "En cours", href: "/admin/conversations/en-cours", icon: "🔄", badge: "6" },
        { label: "En attente", href: "/admin/conversations/en-attente", icon: "⏳", badge: "4" },
        { label: "Traités", href: "/admin/conversations/traites", icon: "✅", badge: "138" },
        { label: "Archivés", href: "/admin/conversations/archives", icon: "📦", badge: null },
      ]
    },
    { label: "Contacts", href: "/admin/contacts", icon: "👥", badge: null },
    { label: "Organisations", href: "/admin/organisations", icon: "🏢", badge: null },
    { label: "Catégories", href: "/admin/categories", icon: "📂", badge: null },
    { label: "Étiquettes", href: "/admin/etiquettes", icon: "🏷️", badge: null },
    { label: "Priorités", href: "/admin/priorites", icon: "⚡", badge: null },
    { label: "Utilisateurs", href: "/admin/utilisateurs", icon: "👤", badge: null },
    { label: "Paramètres", href: "/admin/parametres", icon: "⚙️", badge: null },
  ];

  return (
    <aside className="w-64 bg-[#0a1128] text-white flex flex-col h-screen border-r border-gray-800">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white">
          CRM
        </div>
        <span className="font-bold text-xl tracking-wide">MyCRM</span>
      </div>

      {/* Action Button */}
      <div className="px-5 mb-6">
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
          <span>+</span> Nouveau message
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isExactActive = pathname === item.href;
            const isChildActive = item.children && item.children.some(c => pathname === c.href);
            const isActive = isExactActive || isChildActive;

            return (
              <li key={item.label} className="mb-1">
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isExactActive
                      ? "bg-indigo-600/20 text-indigo-400 font-medium"
                      : isActive 
                        ? "text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isExactActive ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Sub-menu rendering */}
                {item.children && (
                  <ul className="mt-1 ml-9 space-y-1 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-800">
                    {item.children.map(child => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.label} className="relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-gray-800"></div>
                          <Link
                            href={child.href}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ml-2 ${
                              childActive
                                ? "bg-indigo-600/10 text-indigo-400 font-medium"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{child.icon}</span>
                              <span>{child.label}</span>
                            </div>
                            {child.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${childActive ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"}`}>
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold overflow-hidden">
          JD
        </div>
        <div>
          <p className="text-sm font-medium text-white">Jean Dupont</p>
          <p className="text-xs text-gray-500">Administrateur</p>
        </div>
      </div>
    </aside>
  );
}
