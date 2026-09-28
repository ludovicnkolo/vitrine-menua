"use client";
import React, { useState, useEffect } from "react";
import Link from "@/components/Link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function ActualitesPage() {
  const { lang, t } = useLanguage();
  const isEN = lang === 'EN';
  
  const displayTitle = (pub: any) => (isEN && pub.title_en) ? pub.title_en : pub.title;
  const displayContent = (pub: any) => (isEN && pub.contentHtml_en) ? pub.contentHtml_en : pub.contentHtml;
  const displayCategory = (pub: any) => (isEN && pub.category_en) ? pub.category_en : pub.category;
  const [activeFilter, setActiveFilter] = useState("TOUTES LES ACTUALITÉS");
  const [publications, setPublications] = useState<any[]>([]);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const res = await fetch('/api/cms/public?type=ACTUALITE');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setPublications(data.data);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités:", err);
      }
    };
    fetchPubs();
  }, []);

  const featuredPub = publications.length > 0 ? publications[0] : null;
  const filteredPubs = activeFilter === "TOUTES LES ACTUALITÉS" 
    ? publications
    : publications.filter(p => p.category === activeFilter);

  const filters = [
    { key: "TOUTES LES ACTUALITÉS", fr: "TOUTES LES ACTUALITÉS", en: "ALL NEWS" },
    { key: "FINANCE ET COMPTABILITÉ", fr: "FINANCE ET COMPTABILITÉ", en: "FINANCE AND ACCOUNTING" },
    { key: "BACK ET MIDDLE OFFICE", fr: "BACK ET MIDDLE OFFICE", en: "BACK & MIDDLE OFFICE" },
    { key: "DATA ET REPORTING", fr: "DATA ET REPORTING", en: "DATA AND REPORTING" },
    { key: "RISQUES, CONFORMITÉ ET KYC", fr: "RISQUES, CONFORMITÉ ET KYC", en: "RISK, COMPLIANCE AND KYC" },
    { key: "GESTION DE PATRIMOINE", fr: "GESTION DE PATRIMOINE", en: "WEALTH MANAGEMENT" },
    { key: "ORGANISATION ET EXTERNALISATION", fr: "ORGANISATION ET EXTERNALISATION", en: "ORGANIZATION AND OUTSOURCING" }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      
      {/* ── 6.1 INTRODUCTION (Full BleedHero) ─*/}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/accueil-actus.webp" 
            alt="Actualités et Veille" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-4 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Actualités", "News")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {formatBrand(t(
                "Analyses, repères et publications consacrés aux enjeux opérationnels des entreprises, cabinets et organisations.",
                "Analyses, benchmarks and publications dedicated to the operational challenges of companies, firms and organisations."
              ))}
            </p>
            <div className="mt-4">
              <Link href="#articles" className="inline-flex items-center gap-2 px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                {t("Découvrir nos articles", "Discover our articles")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATION BLANC AVEC BREADCRUMB ── */}
      <div className="w-full h-8 md:h-[5.75rem] bg-white relative">
        <div className="laplace-container portrait:sm:px-10 max-w-6xl mx-auto relative h-full">
          <div className="absolute top-2 md:top-4 left-6 md:left-12 lg:left-0 z-50">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Actualités", "News")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 6.2 À LA UNE (Dark Section) ── */}
      <section id="articles" className="relative w-full bg-[#141824] pt-12 md:pt-[5.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <div className="w-16 h-[3px] bg-white mb-5"></div>
            <h2 className="text-white text-[1.2rem] font-bold uppercase tracking-widest mb-3">
              {t("À la une", "Featured")}
            </h2>

          </div>

          {/* Featured Card */}
          {featuredPub ? (
            <div className="bg-white border border-[#e8e1d7] flex flex-col md:flex-row w-full group hover:border-[#141824] transition-all duration-300">
              <div className="w-full md:w-1/2 h-[250px] md:h-[400px] overflow-hidden bg-[#f5f7fa] flex items-center justify-center relative">
                {featuredPub.coverImageUrl ? (
                  <img src={featuredPub.coverImageUrl} alt={displayTitle(featuredPub)} className="block w-full h-full min-w-full max-w-none object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <span className="text-[#141824]/20 font-bold tracking-widest uppercase text-xl">MENUA CONSULTING</span>
                )}
                {featuredPub.category && (
                  <div className="absolute top-4 left-4 bg-[#e8e1d7] text-[#141824] px-4 py-2 text-[0.8rem] font-bold uppercase tracking-wider">
                    {displayCategory(featuredPub)}
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white group-hover:bg-[#141824] transition-colors duration-300">
                <p className="text-[#6e7891] group-hover:text-white/70 text-[0.8rem] font-medium tracking-wide mb-3 transition-colors duration-300">
                  {featuredPub.publishedAt ? formatDate(featuredPub.publishedAt) : formatDate(featuredPub.createdAt)}
                </p>
                <h3 className="text-[#141824] group-hover:text-white text-[1.4rem] font-bold leading-tight mb-4 transition-colors duration-300">
                  {displayTitle(featuredPub)}
                </h3>
                <p className="text-[#6e7891] group-hover:text-white/70 text-[1.1rem] font-light leading-relaxed mb-8 transition-colors duration-300 line-clamp-4">
                  {displayContent(featuredPub) ? displayContent(featuredPub).replace(/<[^>]+>/g, "").substring(0, 150) + "..." : "Découvrez notre nouvelle publication et l'analyse détaillée de nos experts métier sur ce sujet."}
                </p>
                
                <div className="flex justify-end mt-auto">
                  <a href={`/actualites/${featuredPub.id}`} className="inline-flex items-center gap-2 text-[#141824] group-hover:text-white font-bold tracking-wider uppercase text-[0.7rem] transition-colors duration-300">
                    {t("LIRE L'ARTICLE", "READ ARTICLE")} 
                    <span className="w-6 h-[1px] bg-[#141824] group-hover:bg-white group-hover:w-10 transition-all duration-300"></span>
                    <ChevronRight size={14} className="-ml-2 group-hover:text-white transition-colors duration-300" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e8e1d7] flex flex-col md:flex-row w-full group hover:border-[#141824] transition-all duration-300">
              <div className="w-full md:w-1/2 h-[250px] md:h-auto overflow-hidden bg-[#f5f7fa] flex items-center justify-center">
                 <span className="text-[#141824]/20 font-bold tracking-widest uppercase text-xl">MENUA CONSULTING</span>
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white group-hover:bg-[#141824] transition-colors duration-300">
                <p className="text-[#6e7891] group-hover:text-white/70 text-[1.1rem] font-light leading-relaxed transition-colors duration-300">
                  {formatBrand(t(
                    "Cette rubrique accueillera prochainement les analyses et publications de MENUA CONSULTING consacrées aux évolutions opérationnelles, aux méthodes de travail, à la fiabilisation des processus et à la continuité d’activité.",
                    "This section will soon host MENUA CONSULTING's analyses and publications dedicated to operational developments, working methods, process reliability and business continuity."
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 6.3 ACTUALITÉS FINANCIÈRES ET RÉGLEMENTAIRES ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-6xl mx-auto">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="text-[#141824] text-[1.4rem] font-semibold uppercase tracking-wider flex items-center gap-4">
                <span className="w-8 h-[2px] bg-[#141824]"></span>
                {t("RUBRIQUES", "CATEGORIES")}
              </h3>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-12">
              {filters.map((filter) => (
                <button type="button" 
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

              {filteredPubs.map(pub => (
                <div key={pub.id} className="group flex flex-col bg-white border border-[#e8e1d7] hover:border-[#141824] transition-all duration-300 h-full">
                  <div className="h-[200px] overflow-hidden bg-[#f5f7fa] relative flex items-center justify-center">
                    {pub.coverImageUrl ? (
                      <>
                        <img 
                          src={pub.coverImageUrl} 
                          alt={displayTitle(pub)} 
                          className="block w-full h-full min-w-full max-w-none object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0 z-10 bg-[#f5f7fa]" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="text-[#141824]/20 font-bold tracking-widest uppercase text-sm z-0">MENUA CONSULTING</span>
                      </>
                    ) : (
                      <span className="text-[#141824]/20 font-bold tracking-widest uppercase text-sm">MENUA CONSULTING</span>
                    )}
                    {pub.category && (
                      <div className="absolute top-3 left-3 bg-[#e8e1d7] text-[#141824] px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider">
                        {displayCategory(pub)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <p className="text-[#6e7891] text-[0.75rem] font-medium tracking-wide mb-2">
                      {pub.publishedAt ? formatDate(pub.publishedAt) : formatDate(pub.createdAt)}
                    </p>
                    <h4 className="text-[#141824] font-semibold text-[1.1rem] leading-snug mb-3 line-clamp-2">{displayTitle(pub)}</h4>
                    <p className="text-[#6e7891] text-[0.85rem] font-light leading-relaxed flex-grow mb-4 line-clamp-3">
                      {displayContent(pub) ? displayContent(pub).replace(/<[^>]+>/g, "").substring(0, 150) + "..." : "Analyse détaillée de nos experts métier sur ce sujet."}
                    </p>
                    <a href={`/actualites/${pub.id}`} className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.7rem] group-hover:gap-3 transition-all">
                      {t("LIRE L'ARTICLE", "READ ARTICLE")} <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}

              {filteredPubs.length === 0 && publications.length > 0 && (
                <div className="col-span-full py-12 text-center text-[#6e7891]">
                  {t("Aucune publication dans cette rubrique pour le moment.", "No publications in this category at the moment.")}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── LINKEDIN BANNER ── */}
      <section id="linkedin" className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-5xl mx-auto bg-[#141824] p-8 md:p-12 shadow-2xl border-t-4 border-t-[#e8e1d7] flex flex-col md:flex-row items-center justify-between gap-8">
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
                {t("Retrouvez nos articles, analyses et retours d'expérience sur LinkedIn.", "Explore our insights, operational analyses, and practical feedback on LinkedIn.")}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-center md:text-right mt-4 md:mt-0">

            <a href="https://www.linkedin.com/company/menua-consulting/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white uppercase tracking-wider text-[0.85rem] font-bold justify-end hover:text-[#e8e1d7] transition-colors group">
              {t("RETROUVEZ-NOUS SUR LINKEDIN", "FIND US ON LINKEDIN")} 
              <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={18} className="-ml-2" />
            </a>
          </div>
        </div>
      </section>



    </main>
  );
}
