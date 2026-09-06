"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type Language = "FR" | "EN";

interface LanguageContextType {
  lang: Language;
  /** Alias for `lang` — use either interchangeably */
  language: Language;
  setLang: (lang: Language) => void;
  t: (frText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLang = "FR" 
}: { 
  children: React.ReactNode; 
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let currentLang: Language = initialLang;
    if (window.location.pathname.startsWith("/en")) {
      currentLang = "EN";
    } else if (window.location.pathname.startsWith("/fr") || window.location.pathname === "/") {
      currentLang = "FR";
    } else {
      const savedLang = localStorage.getItem("menua_lang") as Language;
      if (savedLang === "FR" || savedLang === "EN") {
        currentLang = savedLang;
      }
    }
    setLangState(currentLang);
    setMounted(true);
  }, [pathname, initialLang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("menua_lang", newLang);
  };

  // Translation helper: returns enText if lang is EN (works on SSR and client)
  const t = (frText: string, enText: string) => {
    const activeLang = lang || initialLang;
    return activeLang === "EN" ? enText : frText;
  };

  return (
    <LanguageContext.Provider value={{ lang, language: lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
