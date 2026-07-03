"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

const articles = [
  {
    image: "/actualites_hero.png",
    tag: "BACK OFFICE",
    date: "28 MAI 2025",
    title: "Digitalisation des processus back office : enjeux et bonnes pratiques",
    desc: "Automatisation, fiabilisation des données, réduction des délais : les leviers clés pour transformer durablement vos opérations.",
    featured: true,
  },
  {
    image: "/actualites_hero.png", // Use a real placeholder or duplicate for now
    tag: "CONFORMITÉ",
    date: "21 MAI 2025",
    title: "Conformité réglementaire : les évolutions clés à anticiper en 2025",
    desc: "Tour d'horizon des nouvelles exigences et bonnes pratiques à intégrer dès maintenant dans vos processus.",
    featured: true,
  },
  {
    image: "/actualites_hero.png",
    tag: "REPORTING",
    date: "20 MAI 2025",
    title: "Reporting financier : améliorer la qualité des données opérationnelles",
    desc: "Méthodes, outils et indicateurs pour produire un reporting fiable, pertinent et décisionnel.",
    categoryTag: "ACTUALITÉS FINANCIÈRES &\nRÉGLEMENTAIRES",
    featured: false,
  },
  {
    image: "/actualites_hero.png",
    tag: "RÉGLEMENTATION",
    date: "15 MAI 2025",
    title: "Externalisation opérationnelle : un levier de performance durable",
    desc: "Flexibilité, expertise, continuité : pourquoi de plus en plus d'organisations choisissent l'externalisation.",
    categoryTag: "ACTUALITÉS FINANCIÈRES &\nRÉGLEMENTAIRES",
    featured: false,
  },
];

export default function ActualitesPage() {
  const { t } = useLanguage();
  
  const [activeFilter, setActiveFilter] = useState("Toutes");

  const filters = [
    t("Toutes", "All"),
    t("Finance", "Finance"),
    t("Réglementation", "Regulation"),
    t("Opérationnel", "Operational"),
    t("Reporting", "Reporting"),
    t("Conformité", "Compliance"),
  ];

  const getFilteredArticles = () => {
    if (activeFilter === t("Toutes", "All")) return articles;
    
    return articles.filter(article => {
      const activeLower = activeFilter.toLowerCase();
      const tagLower = article.tag.toLowerCase();
      const catLower = article.categoryTag ? article.categoryTag.toLowerCase() : "";
      
      if (tagLower.includes(activeLower)) return true;
      if (catLower.includes(activeLower)) return true;
      
      // Special mappings
      if (activeLower === "finance" || activeLower === "finance") {
        return catLower.includes("financières");
      }
      if (activeLower === "opérationnel" || activeLower === "operational") {
        return tagLower === "back office" || tagLower === "reporting";
      }
      if (activeLower === "réglementation" || activeLower === "regulation") {
         return tagLower === "réglementation" || catLower.includes("réglementaires");
      }
      
      return false;
    });
  };

  const displayedArticles = getFilteredArticles();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/actualites_hero.png"
            alt="Actualités"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#223930] from-20% via-[#223930]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Ressources", "Resources")}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] text-white mb-8">
                {t("Actualités", "News")}
              </h1>
              <div className="text-white text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4 mb-8" style={{ color: 'white' }}>
                <p>
                  {t(
                    "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles.",
                    "MENUA CONSULTING monitors financial, accounting, wealth, regulatory and operational developments on a regular basis."
                  )}
                </p>
              </div>
              <button className="inline-flex items-center gap-3 bg-[#E0D6C8] text-[#223930] px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-transparent hover:text-[#E0D6C8] border border-[#E0D6C8] w-fit">
                {t("S'abonner à la veille", "Subscribe to the watch")} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section id="articles" className="w-full bg-white px-8 py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {filters.map((filter, i) => (
              <button 
                key={i} 
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeFilter === filter 
                    ? "bg-[#223930] text-white" 
                    : "bg-[#F5F2EB] text-[#223930] hover:bg-[#E0D6C8]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full">
            {displayedArticles.map((article, index) => (
              <div key={index} className="bg-white border border-[#E0D6C8]/30 flex flex-col shadow-sm hover:shadow-md transition-shadow group">
                {/* Image Box */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {article.featured && (
                    <div className="absolute top-3 left-3 bg-[#223930] text-white px-2 py-1 text-[0.5rem] font-bold uppercase tracking-widest">
                      À LA UNE
                    </div>
                  )}
                  {article.categoryTag && (
                    <div className="absolute top-3 left-3 bg-[#223930] text-white px-2 py-1 text-[0.5rem] font-bold uppercase tracking-widest whitespace-pre-line">
                      {article.categoryTag}
                    </div>
                  )}
                </div>
                {/* Content Box */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#223930] text-white px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-widest rounded-sm">{article.tag}</span>
                    <span className="text-gray-400 text-[0.6rem]">|</span>
                    <span className="text-[#223930] text-[0.6rem] font-bold">{article.date}</span>
                  </div>
                  <h3 className="text-[#223930] text-[0.95rem] font-bold leading-snug mb-2 group-hover:text-[#d5a864] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#223930] text-[0.75rem] leading-relaxed font-medium mb-4 flex-1">
                    {article.desc}
                  </p>
                  <Link href="#" className="flex items-center gap-2 text-[#223930] text-[0.65rem] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                    {t("Lire la suite", "Read more")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-3 bg-[#223930] text-white px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all hover:bg-[#1a2c25] mb-16">
            {t("Voir toutes les actualités", "See all news")} <ArrowRight size={16} />
          </button>

          {/* LinkedIn Banner */}
          <div className="w-full bg-[#F5F2EB] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#E0D6C8]/30">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[#223930] text-white flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <p className="text-[#223930] text-[1.1rem] font-medium">
                {t("Retrouvez nos analyses et publications sur LinkedIn.", "Find our analyses and publications on LinkedIn.")}
              </p>
            </div>
            <a href="https://linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-3 border border-[#d5a864] bg-transparent text-[#223930] hover:bg-white px-6 py-3 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-colors">
              {t("Suivre Menua Consulting", "Follow Menua Consulting")} <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
