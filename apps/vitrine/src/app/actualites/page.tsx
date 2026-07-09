"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ActualitesPage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("TOUTES LES ACTUALITÉS");

  const filters = [
    { key: "TOUTES LES ACTUALITÉS", fr: "TOUTES LES ACTUALITÉS", en: "ALL NEWS" },
    { key: "FINANCE ET COMPTABILITÉ", fr: "FINANCE ET COMPTABILITÉ", en: "FINANCE AND ACCOUNTING" },
    { key: "RÉGLEMENTATION", fr: "RÉGLEMENTATION", en: "REGULATION" },
    { key: "GESTION DE PATRIMOINE", fr: "GESTION DE PATRIMOINE", en: "WEALTH MANAGEMENT" },
    { key: "OPÉRATIONS ET DATA", fr: "OPÉRATIONS ET DATA", en: "OPERATIONS AND DATA" }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
      {/* ── 6.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/news-hero.jpg" 
            alt="Actualités et Veille" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Actualités", "News")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "L'essentiel de l'actualité financière, comptable et réglementaire.",
                "The essentials of financial, accounting and regulatory news."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 6.2 À LA UNE (Dark Section) ── */}
      <section className="relative w-full bg-[#141824] section-padding">
        <div className="laplace-container max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <div className="w-16 h-[3px] bg-white mb-5"></div>
            <h2 className="text-white text-[1.2rem] font-bold uppercase tracking-widest mb-3">
              {t("À la une", "Featured")}
            </h2>
          </div>

          {/* Featured Card */}
          <div className="bg-white border border-[#e8e1d7] flex flex-col md:flex-row w-full group hover:border-[#141824] transition-all duration-300">
            <div className="w-full md:w-1/2 h-[250px] md:h-auto overflow-hidden">
              <img src="/img/article-finance.jpg" alt="À la une" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white group-hover:bg-[#141824] transition-colors duration-300">
              <p className="text-[#141824] group-hover:text-[#e8e1d7] text-[0.65rem] font-bold tracking-widest uppercase mb-4 transition-colors duration-300">
                {t("À LA UNE • FINANCE ET COMPTABILITÉ", "FEATURED • FINANCE AND ACCOUNTING")} 
              </p>
              <h3 className="text-[#141824] group-hover:text-white text-[1.3rem] md:text-[1.5rem] font-bold mb-6 leading-snug uppercase transition-colors duration-300">
                {t("Actualités financières, comptables, patrimoniales et réglementaires", "Financial, accounting, wealth and regulatory news")}
              </h3>
              <p className="text-[#6e7891] group-hover:text-white/70 text-[1rem] font-light leading-relaxed mb-8 transition-colors duration-300">
                {t("Analyse et décryptage des évolutions susceptibles d'avoir un impact sur vos organisations : finance, comptabilité, gestion de patrimoine, conformité, réglementation et pratiques opérationnelles.", "Analysis and decoding of developments likely to have an impact on your organizations: finance, accounting, wealth management, compliance, regulation and operational practices.")}
              </p>
              
              <div className="flex justify-end mt-auto">
                <a href="#" className="text-[#141824] group-hover:text-white text-[0.65rem] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300">
                  {t("LIRE L'ARTICLE", "READ ARTICLE")} 
                  <span className="w-5 h-5 rounded-full border border-[#141824] group-hover:border-white flex items-center justify-center transition-colors duration-300">
                    <ArrowRight size={10} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 6.3 ACTUALITÉS FINANCIÈRES ET RÉGLEMENTAIRES ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container max-w-6xl mx-auto">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="text-[#141824] text-[1.4rem] font-semibold uppercase tracking-wider flex items-center gap-4">
                <span className="w-8 h-[2px] bg-[#141824]"></span>
                {t("ACTUALITÉS FINANCIÈRES ET RÉGLEMENTAIRES", "FINANCIAL AND REGULATORY NEWS")}
              </h3>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-12">
              {filters.map((filter) => (
                <button 
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 text-[0.7rem] font-bold tracking-widest uppercase transition-colors border ${
                    activeFilter === filter.key 
                      ? "bg-[#141824] text-white border-[#141824]" 
                      : "bg-white text-[#141824] border-[#e8e1d7] hover:border-[#141824]"
                  }`}
                >
                  {t(filter.fr, filter.en)}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Card 1 */}
              <div className="bg-white border border-[#e8e1d7] p-5 flex flex-col group hover:bg-[#141824] hover:border-[#141824] transition-all duration-300">
                <div className="w-full h-[220px] overflow-hidden mb-6">
                  <img src="/img/article-finance.jpg" alt="Actualités" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-[#141824] group-hover:text-[#e8e1d7] text-[0.65rem] font-bold tracking-widest uppercase mb-4 transition-colors duration-300">
                    {t("FINANCE ET COMPTABILITÉ •", "FINANCE AND ACCOUNTING •")} 
                  </p>
                  <h4 className="text-[#141824] group-hover:text-white text-[1.1rem] font-bold mb-4 leading-snug uppercase transition-colors duration-300">
                    {t("Actualités financières, comptables, patrimoniales et réglementaires", "Financial, accounting, wealth and regulatory news")}
                  </h4>
                  <p className="text-[#6e7891] group-hover:text-white/70 text-[0.95rem] font-light leading-relaxed mb-8 flex-grow transition-colors duration-300">
                    {t(
                      "Analyse et décryptage des évolutions susceptibles d'avoir un impact sur vos organisations : finance, comptabilité, gestion de patrimoine, conformité, réglementation et pratiques opérationnelles.",
                      "Analysis and decoding of developments likely to have an impact on your organizations: finance, accounting, wealth management, compliance, regulation and operational practices."
                    )}
                  </p>
                  <div className="flex justify-end mt-auto">
                    <a href="#" className="text-[#141824] group-hover:text-white text-[0.65rem] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300">
                      {t("LIRE L'ARTICLE", "READ ARTICLE")} 
                      <span className="w-5 h-5 rounded-full border border-[#141824] group-hover:border-white flex items-center justify-center transition-colors duration-300">
                        <ArrowRight size={10} />
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#e8e1d7] p-5 flex flex-col group hover:bg-[#141824] hover:border-[#141824] transition-all duration-300">
                <div className="w-full h-[220px] overflow-hidden mb-6">
                  <img src="/img/article-publications.jpg" alt="Publications" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-[#141824] group-hover:text-[#e8e1d7] text-[0.65rem] font-bold tracking-widest uppercase mb-4 transition-colors duration-300">
                    {t("PUBLICATIONS •", "PUBLICATIONS •")} 
                  </p>
                  <h4 className="text-[#141824] group-hover:text-white text-[1.1rem] font-bold mb-4 leading-snug uppercase transition-colors duration-300">
                    {t("Nos publications et prises de parole", "Our publications and speeches")}
                  </h4>
                  <p className="text-[#6e7891] group-hover:text-white/70 text-[0.95rem] font-light leading-relaxed mb-8 flex-grow transition-colors duration-300">
                    {t(
                      "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels.",
                      "Find the speeches, analyzes and content published by MENUA CONSULTING on operational, regulatory and sector issues."
                    )}
                  </p>
                  <div className="flex justify-end mt-auto">
                    <a href="#" className="text-[#141824] group-hover:text-white text-[0.65rem] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300">
                      {t("LIRE L'ARTICLE", "READ ARTICLE")} 
                      <span className="w-5 h-5 rounded-full border border-[#141824] group-hover:border-white flex items-center justify-center transition-colors duration-300">
                        <ArrowRight size={10} />
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3 (Placeholder for grid symmetry) */}
              <div className="bg-white border border-[#e8e1d7] p-5 flex flex-col group hover:bg-[#141824] hover:border-[#141824] transition-all duration-300">
                <div className="w-full h-[220px] overflow-hidden mb-6">
                  <img src="/img/news-veille.jpg" alt="Veille" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-[#141824] group-hover:text-[#e8e1d7] text-[0.65rem] font-bold tracking-widest uppercase mb-4 transition-colors duration-300">
                    {t("RÉGLEMENTATION •", "REGULATION •")} 
                  </p>
                  <h4 className="text-[#141824] group-hover:text-white text-[1.1rem] font-bold mb-4 leading-snug uppercase transition-colors duration-300">
                    {t("Veille réglementaire et conformité", "Regulatory watch and compliance")}
                  </h4>
                  <p className="text-[#6e7891] group-hover:text-white/70 text-[0.95rem] font-light leading-relaxed mb-8 flex-grow transition-colors duration-300">
                    {t(
                      "Restez informés des dernières évolutions réglementaires et découvrez nos conseils pour adapter vos processus opérationnels en toute sécurité.",
                      "Stay informed of the latest regulatory developments and discover our advice to safely adapt your operational processes."
                    )}
                  </p>
                  <div className="flex justify-end mt-auto">
                    <a href="#" className="text-[#141824] group-hover:text-white text-[0.65rem] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300">
                      {t("LIRE L'ARTICLE", "READ ARTICLE")} 
                      <span className="w-5 h-5 rounded-full border border-[#141824] group-hover:border-white flex items-center justify-center transition-colors duration-300">
                        <ArrowRight size={10} />
                      </span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── LINKEDIN BANNER ── */}
      <section className="relative w-full bg-[#141824] section-padding">
        <div className="laplace-container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-md border border-[#e8e1d7]/30 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-white text-[1.2rem] font-semibold mb-2">
                {t("Suivez notre actualité et nos publications professionnelles", "Follow our news and professional publications")}
              </h3>
              <p className="text-[#e5e9f0] text-[0.95rem] font-light">
                {t("Retrouvez nos articles, analyses et retours d'expériences sur LinkedIn.", "Find our articles, analyzes and feedback on LinkedIn.")}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-center md:text-right mt-4 md:mt-0">

            <a href="#" className="text-white text-[0.75rem] font-bold tracking-widest uppercase flex items-center gap-3 justify-end hover:text-[#e8e1d7] transition-colors">
              {t("RETROUVEZ-NOUS SUR LINKEDIN", "FIND US ON LINKEDIN")} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
