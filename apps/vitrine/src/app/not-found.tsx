"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[70vh] bg-white pt-32 pb-16 px-6 text-center">
      <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#141824] mb-4 uppercase tracking-widest">
        {t("Page introuvable", "Page not found")}
      </h1>
      <div className="w-16 h-[3px] bg-[#e8e1d7] mb-6 mx-auto"></div>
      <p className="text-[1.1rem] md:text-[1.3rem] text-[#6e7891] font-light max-w-xl mb-10 leading-relaxed">
        {t(
          "La page que vous recherchez n'existe pas ou a été déplacée.",
          "The page you are looking for does not exist or has been moved."
        )}
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center bg-[#141824] text-white px-8 py-4 font-bold uppercase tracking-wider text-[0.95rem] hover:bg-[#1f2638] transition-colors duration-300"
      >
        {t("Retour à l'accueil", "Back to home page")}
      </Link>
    </main>
  );
}
