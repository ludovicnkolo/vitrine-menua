"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── SECTION 1 : HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden mb-20 lg:mb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/paris-aerial.jpg" 
            alt="Paris Aerial" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              MENUA CONSULTING
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "L'externalisation opérationnelle des fonctions back et middle office.",
                "Operational outsourcing of back and middle office functions."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : INTRO (Overlapping Laplace style) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-4/12 h-[250px] lg:h-[360px] z-20 relative">
              <img 
                src="/rosette.jpg" 
                alt="Intro" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
              />
            </div>
            
            {/* Right Overlapping Beige Box */}
            <div className="w-full lg:w-9/12 bg-[#e8e1d7] px-12 lg:pr-20 lg:pl-32 pt-8 lg:pt-16 pb-12 lg:pb-16 z-10 -mt-16 lg:mt-0 lg:-ml-24 shadow-xl">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <div className="leading-relaxed text-[#141824] text-[1.1rem] md:text-[1.2rem] font-light mb-8 space-y-6">
                <h2 className="font-bold text-[1.6rem] md:text-[2rem] leading-tight mb-4 uppercase tracking-wider">
                  {t(
                    "Externalisation back et middle office",
                    "Back and middle office outsourcing"
                  )}
                </h2>
                <p>
                  {t(
                    "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l’exécution des fonctions back et middle office.",
                    "MENUA CONSULTING supports financial, accounting, wealth, data and regulated teams to secure and strengthen the execution of back and middle office functions."
                  )}
                </p>
                <p>
                  {t(
                    "Nous sécurisons l’exécution de vos opérations afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
                    "We secure the execution of your operations to allow your teams to focus on strategic decisions."
                  )}
                </p>
              </div>
              <Link href="/nous-connaitre" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
                {t("Nous connaître", "About Us")} 
                <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={16} className="-ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : POURQUOI MENUA (Dark Navy block) ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
            <h2 className="text-white text-[1.8rem] md:text-[2.2rem] font-bold mb-6 uppercase tracking-wider">
              {t("Pourquoi MENUA CONSULTING ?", "Why MENUA CONSULTING?")}
            </h2>
            <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed mb-8">
              {t(
                "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d’exécution opérationnelle exigeants.",
                "MENUA CONSULTING supports organizations facing demanding operational execution challenges."
              )}
            </p>
            <div className="mb-12 md:mb-0">
              <Link href="/pourquoi-menua" className="inline-flex items-center gap-2 text-[#e8e1d7] font-bold uppercase tracking-wider text-[0.85rem] hover:text-white transition-colors group">
                 {t("Nos atouts et engagements", "Our strengths and commitments")} 
                 <span className="w-8 h-[1px] bg-[#e8e1d7] group-hover:w-12 transition-all duration-300"></span>
                 <ChevronRight size={16} className="-ml-2" />
               </Link>
            </div>
          </div>
          
          {/* Right Column: 4 Assets in a Grid */}
          <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
             <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-bold text-[1.3rem] mb-2">{t("Spécialisation", "Specialization")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">Back et Middle Office</p>
             </div>
             <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-bold text-[1.3rem] mb-2">{t("Exécution", "Execution")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">100% Opérationnelle</p>
             </div>
             <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-bold text-[1.3rem] mb-2">{t("Fiabilité", "Reliability")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">Continuité de service</p>
             </div>
             <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-bold text-[1.3rem] mb-2">{t("Bilingue", "Bilingual")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">Français / Anglais</p>
             </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4 : VOS BESOINS (Light section with cards) ── */}
      <section className="relative w-full bg-[#f5f7fa] section-padding">
        <div className="laplace-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                {t("Vos besoins", "Your Needs")}
              </h2>
            </div>
            <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed">
              {t(
                "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l’ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 shadow-lg border border-[#e8e1d7]/50 flex flex-col group">
               <h3 className="text-[#141824] text-[1.3rem] font-bold mb-4">{t("Finance et Reporting", "Finance and Reporting")}</h3>
               <p className="text-[#6e7891] font-light text-sm flex-grow mb-8">
                 {t("Production, structuration et fiabilisation de reportings financiers...", "Production, structuring and reliability of financial reports...")}
               </p>
               <Link href="/vos-besoins#finance-reporting" className="mt-auto flex items-center justify-between text-[#141824] font-bold uppercase tracking-wider text-[0.75rem] group-hover:text-[#8B6240] transition-colors">
                 {t("Découvrir", "Discover")} <ArrowRight size={16} />
               </Link>
            </div>
            <div className="bg-white p-10 shadow-lg border border-[#e8e1d7]/50 flex flex-col group">
               <h3 className="text-[#141824] text-[1.3rem] font-bold mb-4">{t("Risques et Conformité", "Risk and Compliance")}</h3>
               <p className="text-[#6e7891] font-light text-sm flex-grow mb-8">
                 {t("Appui opérationnel aux équipes risques et conformité dans le traitement...", "Operational support for risk and compliance teams in processing...")}
               </p>
               <Link href="/vos-besoins#risques-conformite" className="mt-auto flex items-center justify-between text-[#141824] font-bold uppercase tracking-wider text-[0.75rem] group-hover:text-[#8B6240] transition-colors">
                 {t("Découvrir", "Discover")} <ArrowRight size={16} />
               </Link>
            </div>
            <div className="bg-white p-10 shadow-lg border border-[#e8e1d7]/50 flex flex-col group">
               <h3 className="text-[#141824] text-[1.3rem] font-bold mb-4">{t("Support Comptable et Data", "Accounting and Data Support")}</h3>
               <p className="text-[#6e7891] font-light text-sm flex-grow mb-8">
                 {t("Appui opérationnel aux équipes comptables, administratives et data...", "Operational support for accounting, administrative and data teams...")}
               </p>
               <Link href="/vos-besoins#support-comptable-data" className="mt-auto flex items-center justify-between text-[#141824] font-bold uppercase tracking-wider text-[0.75rem] group-hover:text-[#8B6240] transition-colors">
                 {t("Découvrir", "Discover")} <ArrowRight size={16} />
               </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/vos-besoins" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
              {t("Voir tous vos besoins", "See all your needs")} 
              <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={16} className="-ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : NOS SOLUTIONS (Beige Minimal Section) ── */}
      <section className="relative w-full bg-[#e8e1d7] section-padding">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Nos solutions d'externalisation", "Our outsourcing solutions")}
            </h2>
            <p className="text-[#141824] text-[1.1rem] font-light leading-relaxed mb-8">
              {t(
                "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles d'urgence, de durée, de volume et d'organisation.",
                "We design tailor-made outsourcing systems, adapted to your operational constraints of urgency, duration, volume and organization."
              )}
            </p>
            <div className="mb-12 md:mb-0">
              <Link href="/nos-solutions" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
                 {t("Découvrir nos solutions", "Discover our solutions")} 
                 <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                 <ChevronRight size={16} className="-ml-2" />
               </Link>
            </div>
          </div>

          {/* Right Column: 4 constraints in a 2x2 grid */}
          <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
             <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-bold text-[1.3rem] mb-2">{t("Urgence", "Urgency")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">Réactivité</p>
             </div>
             <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-bold text-[1.3rem] mb-2">{t("Durée", "Duration")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">Flexibilité</p>
             </div>
             <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-bold text-[1.3rem] mb-2">{t("Volume", "Volume")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">Agilité</p>
             </div>
             <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-bold text-[1.3rem] mb-2">{t("Format", "Format")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">Sur Mesure</p>
             </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 6 : ACTUALITÉS (Minimal visual representation) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container text-center max-w-4xl mx-auto">
          <div className="inline-block text-left">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Actualités et Veille", "News and Monitoring")}
            </h2>
          </div>
          <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-12">
            {t(
              "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d’éclairer ses clients sur les enjeux qui impactent leurs activités.",
              "MENUA CONSULTING ensures regular monitoring of financial, accounting, wealth, regulatory and operational developments to enlighten its clients on the issues that impact their activities."
            )}
          </p>
          <Link href="/actualites" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
            {t("Lire nos actualités", "Read our news")} 
            <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
            <ChevronRight size={16} className="-ml-2" />
          </Link>
        </div>
      </section>

    </main>
  );
}
