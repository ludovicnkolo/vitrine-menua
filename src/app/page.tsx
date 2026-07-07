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
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
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
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4.5rem] leading-[1.1] mb-8 font-bold">
              {t(
                "Externalisation opérationnelle des fonctions back et middle office",
                "Operational outsourcing of back and middle office functions"
              )}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] mb-12 max-w-2xl font-light">
              {t(
                "Nous sécurisons l’exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
                "We secure the execution of your back and middle office operations to allow your teams to focus on strategic decisions."
              )}
            </p>
            
            <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link href="/nous-contacter" className="inline-flex items-center gap-4 bg-[#e8e1d7] text-[#141824] px-8 py-4 text-[0.9rem] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors">
                {t("Présenter un besoin", "Present a need")} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="animate-fade-in-up stagger-4 mt-16 flex items-center gap-4 text-[#e5e9f0] text-[1rem] border-t border-white/20 pt-8 max-w-2xl">
              <Globe className="text-[#e8e1d7]" size={24} />
              <span className="font-light">
                {t(
                  "Interventions en français et en anglais – profils opérationnels bilingues.",
                  "Interventions in French and English – bilingual operational profiles."
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : INTRO (Overlapping Laplace style) ── */}
      <section className="relative w-full bg-white pt-24 pb-32">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[400px] lg:h-[600px] z-10 shadow-xl">
              <img 
                src="/rosette.jpg" 
                alt="Intro" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
              />
            </div>
            
            {/* Right Overlapping Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl">
              <div className="w-16 h-1 bg-[#141824] mb-10" />
              <h2 className="leading-relaxed text-[#141824] text-[1.6rem] md:text-[2rem] font-light mb-8">
                <strong className="font-bold block mb-6 text-[1.8rem] md:text-[2.2rem]">MENUA CONSULTING</strong>
                {t(
                  "intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l’exécution des fonctions back et middle office.",
                  "supports financial, accounting, wealth, data and regulated teams to secure and strengthen the execution of back and middle office functions."
                )}
              </h2>
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
      <section className="relative w-full bg-[#141824] text-white py-24">
        <div className="laplace-container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold mb-6">
               {t("Pourquoi MENUA CONSULTING ?", "Why MENUA CONSULTING?")}
             </h2>
             <div className="w-16 h-1 bg-[#e8e1d7] mb-8" />
             <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed mb-8">
               {t(
                 "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d’exécution opérationnelle exigeants.",
                 "MENUA CONSULTING supports organizations facing demanding operational execution challenges."
               )}
             </p>
             <Link href="/pourquoi-menua" className="inline-flex items-center gap-2 text-[#e8e1d7] font-bold uppercase tracking-wider text-[0.85rem] hover:text-white transition-colors group">
                {t("Nos atouts et engagements", "Our strengths and commitments")} 
                <span className="w-8 h-[1px] bg-[#e8e1d7] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={16} className="-ml-2" />
              </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#e8e1d7] font-bold mb-3">{t("Spécialisation", "Specialization")}</h3>
                <p className="text-white/70 text-sm font-light">Back et Middle Office</p>
             </div>
             <div className="bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#e8e1d7] font-bold mb-3">{t("Exécution", "Execution")}</h3>
                <p className="text-white/70 text-sm font-light">100% Opérationnelle</p>
             </div>
             <div className="bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#e8e1d7] font-bold mb-3">{t("Fiabilité", "Reliability")}</h3>
                <p className="text-white/70 text-sm font-light">Continuité de service</p>
             </div>
             <div className="bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#e8e1d7] font-bold mb-3">{t("Bilingue", "Bilingual")}</h3>
                <p className="text-white/70 text-sm font-light">Français / Anglais</p>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : VOS BESOINS (Light section with cards) ── */}
      <section className="relative w-full bg-[#f5f7fa] py-24">
        <div className="laplace-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6">
              {t("Vos besoins", "Your Needs")}
            </h2>
            <div className="w-16 h-1 bg-[#141824] mx-auto mb-6" />
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
      <section className="relative w-full bg-[#e8e1d7] py-24">
        <div className="laplace-container flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="max-w-2xl">
             <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6">
               {t("Nos solutions d'externalisation", "Our outsourcing solutions")}
             </h2>
             <p className="text-[#141824] text-[1.1rem] font-light leading-relaxed mb-8">
               {t(
                 "Nous concevons des dispositifs d’externalisation sur mesure, adaptés à vos contraintes opérationnelles d’urgence, de durée, de volume et d’organisation.",
                 "We design tailor-made outsourcing systems, adapted to your operational constraints of urgency, duration, volume and organization."
               )}
             </p>
             <Link href="/nos-solutions" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
                {t("Découvrir nos solutions", "Discover our solutions")} 
                <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={16} className="-ml-2" />
              </Link>
           </div>
           <div className="w-full md:w-auto grid grid-cols-2 gap-4">
              <div className="bg-white/40 p-6 text-center border border-[#141824]/10">
                 <span className="block text-[#141824] font-bold text-lg mb-1">{t("Urgence", "Urgency")}</span>
                 <span className="text-[#141824]/70 text-xs uppercase tracking-wider">Réactivité</span>
              </div>
              <div className="bg-white/40 p-6 text-center border border-[#141824]/10">
                 <span className="block text-[#141824] font-bold text-lg mb-1">{t("Durée", "Duration")}</span>
                 <span className="text-[#141824]/70 text-xs uppercase tracking-wider">Flexibilité</span>
              </div>
              <div className="bg-white/40 p-6 text-center border border-[#141824]/10">
                 <span className="block text-[#141824] font-bold text-lg mb-1">{t("Volume", "Volume")}</span>
                 <span className="text-[#141824]/70 text-xs uppercase tracking-wider">Agilité</span>
              </div>
              <div className="bg-white/40 p-6 text-center border border-[#141824]/10">
                 <span className="block text-[#141824] font-bold text-lg mb-1">{t("Format", "Format")}</span>
                 <span className="text-[#141824]/70 text-xs uppercase tracking-wider">Sur Mesure</span>
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 6 : ACTUALITÉS (Minimal visual representation) ── */}
      <section className="relative w-full bg-white py-24">
        <div className="laplace-container text-center max-w-4xl mx-auto">
          <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6">
            {t("Actualités et Veille", "News and Monitoring")}
          </h2>
          <div className="w-16 h-1 bg-[#141824] mx-auto mb-6" />
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
