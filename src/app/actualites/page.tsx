"use client";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

const articles = [
  { slug: "kyc-lcft-nouvelles-obligations", title: "KYC & LCB-FT – Les nouvelles obligations réglementaires à anticiper", date: "Juin 2025", cat: "Conformité", featured: true },
  { slug: "externalisation-securiser-continuite", title: "Externalisation back office – Comment sécuriser la continuité opérationnelle ?", date: "Mai 2025", cat: "Opérations", featured: true },
  { slug: "reporting-erreurs-frequentes", title: "Reporting financier – Les erreurs les plus fréquentes et comment les éviter", date: "Avril 2025", cat: "Finance", featured: true },
  { slug: "dora-etablissements-financiers", title: "DORA – Ce que les établissements financiers doivent savoir", date: "Juin 2025", cat: "Réglementation", featured: false },
  { slug: "clotures-comptables-anticiper-pics", title: "Clôtures comptables – Anticiper les pics d'activité", date: "Mai 2025", cat: "Comptabilité", featured: false },
  { slug: "cgp-enjeux-administratifs-devoir-conseil", title: "CGP – Enjeux administratifs du devoir de conseil", date: "Mai 2025", cat: "Gestion de patrimoine", featured: false },
  { slug: "remediation-kyc-strategies", title: "Remédiation KYC – Stratégies et bonnes pratiques", date: "Avril 2025", cat: "Conformité", featured: false },
  { slug: "data-quality-finance", title: "Data quality en finance – Enjeux et solutions", date: "Mars 2025", cat: "Data", featured: false },
  { slug: "middle-office-perimetre-sous-estime", title: "Middle office – Un périmètre souvent sous-estimé", date: "Mars 2025", cat: "Opérations", featured: false },
];

export default function ActualitesPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden bg-white gap-12 md:gap-20 pb-12 md:pb-20">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/actualites_hero.png"
            alt="Actualités"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680] from-20% via-[#1B3680]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#B8922A]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#B8922A]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#B8922A]" />
            
            <div className="relative">
              <p className="text-[#B8922A] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Actualités et Insights", "News and Insights")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "Analyses,\ndécryptages et\nprises de parole.",
                  "Analysis,\ndecoding and\nspeaking out."
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  {t(
                    "Retrouvez ici les analyses, décryptages et prises de parole de MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels qui façonnent les métiers de la finance, de la comptabilité, de la conformité et de la gestion de patrimoine.",
                    "Find here MENUA CONSULTING's analyses, decodings and speeches on the operational, regulatory and sectoral issues that shape the finance, accounting, compliance and wealth management professions."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LISTING ── */}
      <section className="bg-white px-8 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 shadow-lg" style={{ borderRadius: "2rem 8rem 2rem 2rem" }}>
          
          <h2 className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-8 border-b border-[#D8DCE8] pb-4">
            À la une
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {articles.filter(a => a.featured).map((article) => (
              <Link href={`/actualites/${article.slug}`} key={article.slug} className="group flex flex-col h-full bg-[#FAFBFC] border border-[#D8DCE8] overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-[#122560] relative p-6 flex flex-col justify-between">
                  <span className="text-[#DAF0F7] text-xs font-bold uppercase tracking-wider bg-black/20 self-start px-3 py-1 rounded">
                    {article.cat}
                  </span>
                  <Newspaper className="text-[#DAF0F7]/20 absolute right-6 bottom-6" size={64} />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <p className="text-[#6B7794] text-xs font-semibold mb-3">{article.date}</p>
                  <h3 className="text-[#1B3680] text-[1.3rem] font-semibold mb-6 group-hover:text-[#1C40C2] transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center text-[#1C40C2] text-sm font-semibold gap-2 group-hover:gap-3 transition-all">
                    {t("Lire l'article", "Read article")} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-8 border-b border-[#D8DCE8] pb-4">
            Tous les articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {articles.filter(a => !a.featured).map((article) => (
              <Link href={`/actualites/${article.slug}`} key={article.slug} className="group border-b border-[#D8DCE8] pb-8 flex items-start gap-6">
                <div className="hidden sm:flex w-24 h-24 shrink-0 bg-[#F2F0ED] items-center justify-center rounded">
                  <Newspaper className="text-[#1B3680]/20" size={32} />
                </div>
                <div>
                  <div className="flex gap-3 items-center mb-2">
                    <span className="text-[#1C40C2] text-[0.65rem] font-bold uppercase tracking-wider">{article.cat}</span>
                    <span className="text-[#6B7794] text-[0.65rem]">•</span>
                    <span className="text-[#6B7794] text-xs">{article.date}</span>
                  </div>
                  <h3 className="text-[#1B3680] text-[1.3rem] font-semibold mb-3 group-hover:text-[#1C40C2] transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-[#1C40C2] text-xs font-semibold gap-1 group-hover:gap-2 transition-all">
                    {t("Lire la suite", "Read more")} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
