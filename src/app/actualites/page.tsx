"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function ActualitesPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/actualite.png"
            alt="Actualités"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#304239]/90 to-[#304239]/70" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-white" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-white" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-white" />
            
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("ACTUALITÉS", "NEWS")}</span>
                <span className="block mt-2">
                  {t("Éclairages et analyses", "Insights and analyses")}<br />
                  {t("pour anticiper les", "to anticipate")}<br />
                  {t("évolutions du secteur.", "sector evolutions.")}
                </span>
              </h1>
              <div className="mb-8 max-w-2xl">
                <p className="p-1">
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
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-[#122017]" />
              <h2 className="h2-surtitre text-[#122017]">{t("À la une", "Featured")}</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0D6C8]/50 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
              <div className="w-full md:w-1/2 h-[300px] md:h-auto">
                <img src="/digitalisation.jpg" alt="A la une" className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                <p className="text-[#122017] text-[0.75rem] font-bold tracking-[0.1em] uppercase mb-4">
                  DIGITALISATION • 18 MAI 2024
                </p>
                <h4 className="h4-titre text-[#122017] mb-4">
                  Digitalisation des processus back office : enjeux et bonnes pratiques
                </h4>
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-[#122017]" />
                  <h2 className="h2-surtitre text-[#122017]">Actualités financières et réglementaires</h2>
                </div>
              </div>
              <Link href="#" className="text-[#122017] text-[0.75rem] font-bold tracking-widest uppercase hover:text-[#8B6240] transition-colors flex items-center gap-2">
                VOIR TOUTES LES ACTUALITÉS <ArrowRight size={14} />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-8 mb-10 border-b border-[#E0D6C8]/50 pb-4">
              <button className="bg-[#122017] text-white px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase rounded-sm">TOUTES LES ACTUALITÉS</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">FINANCE ET COMPTABILITÉ</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">RÉGLEMENTATION</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">GESTION DE PATRIMOINE</button>
              <button className="bg-transparent text-[#122017]/70 border border-[#E0D6C8] px-5 py-2 text-[0.75rem] font-bold tracking-wider uppercase hover:bg-[#F6F3F0] rounded-sm transition-colors">OPÉRATIONS ET OUTILS</button>
            </div>

            {/* Grid 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/digitalisation.jpg" alt="Article 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#122017] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    DIGITALISATION • 12 MAI 2024
                  </p>
                  <h4 className="h4-titre text-[#122017] mb-3 group-hover:text-[#8B6240] transition-colors">
                    {t("Digitalisation des processus back office : enjeux et bonnes pratiques", "Digitalization of back office processes: challenges and best practices")}
                  </h4>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Panorama des évolutions majeures et de leurs impacts sur le reporting financier et la consolidation.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#122017] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/news-2.jpg" alt="Article 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#122017] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    RÉGLEMENTATION • 06 MAI 2024
                  </p>
                  <h4 className="h4-titre text-[#122017] mb-3 group-hover:text-[#8B6240] transition-colors">
                    {t("Conformité réglementaire : les évolutions dès à anticiper en 2025", "Regulatory compliance: key developments to anticipate in 2025")}
                  </h4>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Focus sur les dernières attentes des autorités et les bonnes pratiques pour sécuriser vos dispositifs.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#122017] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-all group">
                <div className="h-[200px] w-full overflow-hidden">
                  <img src="/news-3.jpg" alt="Article 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[#122017] text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3">
                    REPORTING • 28 MAI 2024
                  </p>
                  <h4 className="h4-titre text-[#122017] mb-3 group-hover:text-[#8B6240] transition-colors">
                    {t("Reporting financier : améliorer la qualité des données opérationnelles", "Financial reporting: improving the quality of operational data")}
                  </h4>
                  <p className="text-[#122017]/75 text-[0.85rem] leading-[1.6] mb-6 flex-1">
                    Comment les outils digitaux et la data structurée optimisent les processus et la prise de décision.
                  </p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#122017] text-[0.75rem] font-bold tracking-widest uppercase group-hover:gap-3 transition-all mt-auto">
                    LIRE L'ARTICLE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>



          {/* LINKEDIN BANNER */}
          <div className="w-full bg-[#122017] rounded-xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="w-16 h-16 rounded-xl border border-[white]/30 flex items-center justify-center shrink-0 text-[white]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <div className="flex flex-col">
                <h3 className="h3-section text-white mb-2">
                  Suivez notre actualité<br />et nos publications professionnelles
                </h3>
                <p className="text-white/80 text-[0.95rem]">
                  Retrouvez nos articles, analyses et retours d'expérience sur LinkedIn.
                </p>
              </div>
            </div>
            <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="link-action shrink-0">
              RETROUVEZ-NOUS SUR LINKEDIN <ArrowRight size={16} className="inline ml-2" />
            </a>
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
