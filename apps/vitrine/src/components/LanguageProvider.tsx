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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("FR");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Priority: URL > LocalStorage > Default (FR)
    const savedLang = localStorage.getItem("menua_lang") as Language;
    let initialLang: Language = "FR";
    
    if (pathname.startsWith("/en")) {
      initialLang = "EN";
    } else if (pathname.startsWith("/fr")) {
      initialLang = "FR";
    } else if (savedLang === "FR" || savedLang === "EN") {
      initialLang = savedLang;
    }
    
    setLangState(initialLang);
    setMounted(true);
  }, [pathname]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("menua_lang", newLang);
  };

  // Simple translation helper: if lang is EN, return enText, otherwise frText
  const t = (frText: string, enText: string) => {
    if (!mounted) return frText; // Default to FR for SSR to avoid hydration mismatch
    return lang === "EN" ? enText : frText;
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
