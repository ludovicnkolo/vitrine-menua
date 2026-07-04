"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function ActualitesPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-transparent">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/actualites_hero.png"
            alt="Actualités"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08] from-40% via-[#1A0E08]/75 via-65% to-transparent to-90%" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            
            <div className="relative">
              <p className="text-[#D9B151] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.2em] uppercase mb-6">
                {t("ACTUALITÉS", "NEWS")}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-[1.8rem] font-bold leading-[1.2] text-white mb-8">
                {t("Éclairages & analyses", "Insights & analyses")}<br />
                <span className="text-[#D9B151]">{t("pour anticiper les", "to anticipate")}</span><br />
                <span className="text-[#D9B151]">{t("évolutions du secteur.", "sector evolutions.")}</span>
              </h1>
              <div className="text-white text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-2xl font-normal space-y-3" style={{ color: 'white' }}>
                <p>
                  MENUA CONSULTING {t(
                    "assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d'éclairer ses clients sur les enjeux qui impactent leurs activités.",
                    "monitors financial, accounting, wealth, regulatory and operational developments on a regular basis to enlighten its clients on the issues impacting their activities."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENU PRINCIPAL ── */}
      <section className="mt-12 bg-white w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          {/* A LA UNE */}
          <div className="mb-20">
            <h2 className="font-serif text-3xl font-bold text-[#122017] mb-4">{t("À la une", "Featured")}</h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-10" />
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0D6C8]/50 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
              <div className="w-full md:w-1/2 h-[300px] md:h-auto">
                <img src="/trust-circle.jpg" alt="A la une" className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                <p className="text-[#D9B151] text-[0.75rem] font-bold tracking-[0.1em] uppercase mb-4">
                  RÉGLEMENTATION • 18 MAI 2024
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#122017] mb-4 leading-tight">
                  Digitalisation des processus back office : enjeux et bonnes pratiques
                </h3>
                <p className="text-[#122017]/80 text-[0.95rem] leading-[1.6] mb-8">
                  La digitalisation des processus back office transforme la gestion des données, renforce la fiabilité des opérations et améliore la performance globale des organisations financières.
                </p>
                <Link href="#" className="inline-flex items-center justify-center gap-3 bg-[#122017] text-white px-6 py-3 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#1a2e24] transition-colors w-fit rounded-sm">
                  LIRE L'ARTICLE <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* ACTUALITÉS FINANCIÈRES & RÉGLEMENTAIRES */}
          <div className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#122017] mb-4">Actualités financières & réglementaires</h2>
                <div className="w-12 h-[2px] bg-[#D9B151]" />
              </div>
              <Link href="#" className="text-[#D9B151] text-[0.75rem] font-bold tracking-widest uppercase hover:text-[#8B6240] transition-colors flex items-center gap-2">
                VOIR TOUTES LES ACTUALITÉS <ArrowRight size={14} />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-8 mb-10 border-b border-[#E0D6C8]/50 pb-4">
              <button className="bg-[#122017] text-white px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase rounded-sm">TOUTES LES ACTUALITÉS</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">FINANCE & COMPTABILITÉ</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">RÉGLEMENTATION</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">GESTION DE PATRIMOINE</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">OPÉRATIONS & OUTILS</button>
            </div>

            {/* Grid 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/office-lounge.jpg" alt="Article 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    COMPTABILITÉ • 08 MAI 2024
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#122017] leading-tight mb-3 group-hover:text-[#8B6240] transition-colors">
                    Réforme des normes comptables 2024 : ce que les entreprises doivent anticiper
                  </h3>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Panorama des évolutions majeures et de leurs impacts sur le reporting financier et la consolidation.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#D9B151] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/presentation_cabinet_desk.png" alt="Article 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    RÉGLEMENTATION • 02 MAI 2024
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#122017] leading-tight mb-3 group-hover:text-[#8B6240] transition-colors">
                    LCB-FT : renforcer la vigilance dans un contexte réglementaire en mutation
                  </h3>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Focus sur les dernières attentes des autorités et les bonnes pratiques pour sécuriser vos dispositifs.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#D9B151] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/meeting.jpg" alt="Article 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    DIGITAL & OUTILS • 25 AVRIL 2024
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#122017] leading-tight mb-3 group-hover:text-[#8B6240] transition-colors">
                    Automatisation et data : leviers de performance pour le middle office
                  </h3>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Comment les outils digitaux et la data structurée optimisent les processus et la prise de décision.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#D9B151] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>



          {/* LINKEDIN BANNER */}
          <div className="w-full bg-[#122017] rounded-xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="w-16 h-16 rounded-xl border border-[#D9B151]/30 flex items-center justify-center shrink-0 text-[#D9B151]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-2">
                  Suivez notre actualité<br />et nos publications professionnelles
                </h3>
                <p className="text-white/80 text-[0.95rem]">
                  Retrouvez nos articles, analyses et retours d'expérience sur LinkedIn.
                </p>
              </div>
            </div>
            <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-[#D9B151] text-[#122017] px-8 py-4 text-[0.8rem] font-bold tracking-widest uppercase hover:bg-white transition-colors rounded-sm shadow-md">
              RETROUVEZ-NOUS SUR LINKEDIN <ArrowRight size={16} className="inline ml-2" />
            </a>
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
