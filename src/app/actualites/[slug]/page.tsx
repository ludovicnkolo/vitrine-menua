"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FileText, ChevronRight } from "lucide-react";
import { use } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Translation = { fr: string; en: string };
type PageData = { title: Translation; description: Translation; image: string; content: Translation };

const actualitesData: Record<string, PageData> = {
  "a-la-une": {
    title: { 
      fr: "À la une", 
      en: "Headlines" 
    },
    description: { 
      fr: "Sélection d’articles, de contenus et d’analyses mis en avant sur les sujets les plus récents ou les plus structurants pour vos activités.",
      en: "Selection of articles, content, and analysis highlighted on the most recent or structuring subjects for your activities."
    },
    image: "/banner-desk.jpg",
    content: { 
      fr: "Retrouvez ici notre sélection d’articles, de contenus et d’analyses mis en avant sur les sujets les plus récents ou les plus structurants pour vos activités.\n\nMENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d’éclairer ses clients sur les enjeux qui impactent leurs activités.",
      en: "Find here our selection of articles, content, and analysis highlighted on the most recent or structuring subjects for your activities.\n\nMENUA CONSULTING ensures regular monitoring of financial, accounting, wealth, regulatory, and operational developments to enlighten its clients on the issues that impact their activities."
    }
  },
  "financieres-et-reglementaires": {
    title: { 
      fr: "Actualités financières & réglementaires", 
      en: "Financial & Regulatory News" 
    },
    description: { 
      fr: "Analyse et décryptage des évolutions susceptibles d’avoir un impact sur vos organisations.",
      en: "Analysis and deciphering of developments likely to have an impact on your organizations."
    },
    image: "/vos-besoins-hero.jpg",
    content: { 
      fr: "Analyse et décryptage des évolutions susceptibles d’avoir un impact sur vos organisations : finance, comptabilité, gestion de patrimoine, conformité, réglementation et pratiques opérationnelles.\n\nNos équipes assure une veille constante pour vous apporter des éclairages précis et actionnables sur ces évolutions majeures.",
      en: "Analysis and deciphering of developments likely to have an impact on your organizations: finance, accounting, wealth management, compliance, regulation, and operational practices.\n\nOur teams maintain constant monitoring to provide you with precise and actionable insights on these major developments."
    }
  },
  "nos-publications": {
    title: { 
      fr: "Nos publications", 
      en: "Our Publications" 
    },
    description: { 
      fr: "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING.",
      en: "Find the speaking engagements, analysis, and content published by MENUA CONSULTING."
    },
    image: "/nous-rejoindre-hero.jpg",
    content: { 
      fr: "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels.\n\nNous publions régulièrement nos réflexions et décryptages sur les sujets qui transforment vos directions financières et opérationnelles.",
      en: "Find the speaking engagements, analysis, and content published by MENUA CONSULTING on operational, regulatory, and sectoral issues.\n\nWe regularly publish our thoughts and decipherings on the subjects that transform your financial and operational departments."
    }
  }
};

export default function ActualitesDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const pageData = actualitesData[slug];

  if (!pageData) {
    notFound();
  }

  const lang = (language === 'en' ? 'en' : 'fr') as keyof Translation;

  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (idx === 0) {
        return (
          <p key={idx} className="text-gray-700 leading-loose mb-6 text-lg font-light">
            <span className="float-left text-5xl font-serif text-[#c89b53] pr-3 pt-2 leading-none">{block.charAt(0)}</span>
            {block.slice(1)}
          </p>
        );
      }
      return <p key={idx} className="text-gray-600 leading-relaxed mb-6 font-light">{block}</p>;
    });
  };

  return (
    <main className="flex flex-col w-full bg-[#f4f4f3] text-[#051014] font-sans min-h-screen">
      <section className="relative w-full min-h-[55vh] flex items-end overflow-hidden pt-24 bg-[#051014]">
        <div className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/90 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-[#051014]/40 to-transparent z-10"></div>
          <img src={pageData.image} alt={pageData.title[lang]} className="w-full h-full object-cover opacity-50" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-[0.2em] uppercase mb-6 flex items-center flex-wrap gap-3 font-bold">
            <Link href="/" className="hover:text-white transition-colors">{t("Accueil", "Home")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <Link href="/actualites" className="hover:text-white transition-colors">{t("Actualités", "News")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <span className="text-white">{pageData.title[lang]}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 max-w-4xl text-white">
            {pageData.title[lang]}
          </h1>
          <div className="w-16 h-[2px] bg-[#c89b53] mb-8"></div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            {pageData.description[lang]}
          </p>
        </div>
      </section>

      <section className="px-8 py-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-10 inline-flex items-center gap-2 border border-[#c89b53]/30 bg-[#c89b53]/10 px-5 py-2.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#c89b53] animate-pulse"></div>
                  <span className="text-[#c89b53] text-[0.7rem] font-bold tracking-[0.15em] uppercase">{t("Publication", "Publication")}</span>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent(pageData.content[lang])}
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-[#051014] text-white p-10 rounded-2xl sticky top-32 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-6 leading-snug">{t("Restez informé", "Stay informed")}</h3>
                <div className="w-8 h-1 bg-[#c89b53] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                  {t(
                    "Suivez l'actualité de MENUA CONSULTING sur LinkedIn pour ne manquer aucune de nos analyses et publications sur les enjeux de votre secteur.",
                    "Follow MENUA CONSULTING news on LinkedIn so you don't miss any of our analyses and publications on the challenges of your sector."
                  )}
                </p>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-4 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#c89b53]/20 w-full group">
                  {t("Suivez-nous sur LinkedIn", "Follow us on LinkedIn")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
