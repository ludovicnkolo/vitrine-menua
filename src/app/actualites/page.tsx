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
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img src="/actualites_hero.png" alt="Actualités" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-8 text-white mt-8">
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-6">
            {t("Actualités et Insights", "News and Insights")}
          </p>
          <h1
            className="mb-8"
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {t(
              "Analyses, décryptages et prises de parole.",
              "Analysis, decoding and speaking out."
            )}
          </h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
            {t(
              "Retrouvez ici les analyses, décryptages et prises de parole de MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels qui façonnent les métiers de la finance, de la comptabilité, de la conformité et de la gestion de patrimoine.",
              "Find here MENUA CONSULTING's analyses, decodings and speeches on the operational, regulatory and sectoral issues that shape the finance, accounting, compliance and wealth management professions."
            )}
          </p>
        </div>
      </section>

      {/* ── LISTING ── */}
      <section className="bg-white px-8 py-24 border-t border-[#D8DCE8]">
        <div className="max-w-6xl mx-auto">
          
          <h2 className="text-xl font-bold text-[#1B3680] mb-8 border-b border-[#D8DCE8] pb-4 font-serif">
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
                  <h3 className="font-serif text-xl font-bold text-[#1B3680] mb-6 group-hover:text-[#1C40C2] transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center text-[#1C40C2] text-sm font-semibold gap-2 group-hover:gap-3 transition-all">
                    {t("Lire l'article", "Read article")} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold text-[#1B3680] mb-8 border-b border-[#D8DCE8] pb-4 font-serif">
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
                  <h3 className="font-serif text-lg font-bold text-[#1B3680] mb-3 group-hover:text-[#1C40C2] transition-colors">
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
