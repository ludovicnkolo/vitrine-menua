"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items, light = false }: { items: BreadcrumbItem[], light?: boolean }) {
  const { t } = useLanguage();

  const textColor = light ? "text-white/60" : "text-[#6B7794]";
  const hoverColor = light ? "hover:text-white" : "hover:text-[#1C40C2]";
  const activeColor = light ? "text-white" : "text-[#1B3680]";

  return (
    <nav className={`flex items-center text-xs font-semibold tracking-wide ${textColor} mb-8`} aria-label="Breadcrumb">
      <Link href="/" className={`${hoverColor} transition-colors`}>
        {t("Accueil", "Home")}
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-2 opacity-50" />
          {item.href ? (
            <Link href={item.href} className={`${hoverColor} transition-colors`}>
              {item.label}
            </Link>
          ) : (
            <span className={activeColor}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
