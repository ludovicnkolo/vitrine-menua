"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, BookOpen, LineChart } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ActualitesPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 6.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner-desk.jpg" 
            alt="Actualités" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Actualités", "News")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d’éclairer ses clients sur les enjeux qui impactent leurs activités.",
                "MENUA CONSULTING regularly monitors financial, accounting, wealth, regulatory and operational developments to enlighten its clients on the issues that impact their activities."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 6.2 SECTIONS (Laplace Beige/Dark Cards) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-24 pb-32">
        <div className="laplace-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* À la une */}
            <div className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-10 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-fade-in-up">
              <Newspaper size={40} className="text-[#141824] mb-8" strokeWidth={1.5} />
              <h2 className="text-[1.6rem] mb-6 text-[#141824] font-bold">{t("À la une", "Featured")}</h2>
              <div className="w-16 h-1 bg-[#141824] mb-6" />
              <p className="text-[#6e7891] leading-relaxed text-[1.05rem] font-light flex-grow">
                {t(
                  "Sélection d’articles, de contenus et d’analyses mis en avant sur les sujets les plus récents ou les plus structurants pour vos activités.",
                  "Selection of articles, content and analyzes highlighted on the most recent or structuring subjects for your activities."
                )}
              </p>
            </div>

            {/* Actualités financières & réglementaires */}
            <div className="bg-[#141824] text-white border-t-4 border-t-[#e8e1d7] p-10 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-fade-in-up stagger-1">
              <LineChart size={40} className="text-[#e8e1d7] mb-8" strokeWidth={1.5} />
              <h2 className="text-[1.6rem] mb-6 text-white font-bold">{t("Actualités financières & réglementaires", "Financial & Regulatory News")}</h2>
              <div className="w-16 h-1 bg-[#e8e1d7] mb-6" />
              <p className="text-[#e8e1d7] leading-relaxed font-bold mb-4 text-[1.05rem]">
                {t(
                  "Actualités financières, comptables, patrimoniales & réglementaires",
                  "Financial, accounting, wealth & regulatory news"
                )}
              </p>
              <p className="text-[#e5e9f0] leading-relaxed text-[1.05rem] font-light flex-grow">
                {t(
                  "Analyse et décryptage des évolutions susceptibles d’avoir un impact sur vos organisations : finance, comptabilité, gestion de patrimoine, conformité, réglementation et pratiques opérationnelles.",
                  "Analysis and decoding of developments likely to have an impact on your organizations: finance, accounting, wealth management, compliance, regulation and operational practices."
                )}
              </p>
            </div>

            {/* Nos publications */}
            <div className="bg-[#e8e1d7] text-[#141824] border-t-4 border-t-[#141824] p-10 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-fade-in-up stagger-2">
              <BookOpen size={40} className="text-[#141824] mb-8" strokeWidth={1.5} />
              <h2 className="text-[1.6rem] mb-6 text-[#141824] font-bold">{t("Nos publications", "Our publications")}</h2>
              <div className="w-16 h-1 bg-[#141824] mb-6" />
              <p className="text-[#141824] leading-relaxed text-[1.05rem] font-light flex-grow">
                {t(
                  "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels.",
                  "Find the speeches, analyzes and content published by MENUA CONSULTING on operational, regulatory and sector issues."
                )}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── LINKEDIN BANNER ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding">
        <div className="laplace-container flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8e1d7] shrink-0 opacity-80">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
          <div className="max-w-2xl">
            <p className="text-[#e5e9f0] text-[1.1rem] font-light">
              {t(
                "(Le lien vers la page LinkedIn officielle de MENUA CONSULTING sera intégré dès sa création)",
                "(The link to the official MENUA CONSULTING LinkedIn page will be integrated as soon as it is created)"
              )}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
