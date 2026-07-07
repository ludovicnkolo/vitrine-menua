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

      {/* ── SECTION 4 : VOS BESOINS (Light section with image overlap) ── */}
      <section className="relative w-full bg-[#f5f7fa] section-padding">
        <div className="laplace-container relative">

          {/* Text block — full width on mobile, leaves room for image on desktop */}
          <div className="bg-white shadow-xl relative z-10 px-10 lg:px-16 pt-12 pb-14 lg:pr-[38%]">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Vos besoins", "Your Needs")}
            </h2>
            <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-10">
              {t(
                "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
              )}
            </p>

            {/* 3 need items */}
            <div className="flex flex-col md:flex-row gap-0 mb-10 border-t border-[#e8e1d7] pt-8">
              {[
                { title: t("Finance et Reporting", "Finance and Reporting"), desc: t("Production, structuration et fiabilisation de reportings financiers...", "Production, structuring and reliability of financial reports..."), href: "/vos-besoins#finance-reporting" },
                { title: t("Risques et Conformité", "Risk and Compliance"), desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement...", "Operational support for risk and compliance teams in processing..."), href: "/vos-besoins#risques-conformite" },
                { title: t("Support Comptable et Data", "Accounting and Data Support"), desc: t("Appui opérationnel aux équipes comptables, administratives et data...", "Operational support for accounting, administrative and data teams..."), href: "/vos-besoins#support-comptable-data" },
              ].map((item, i, arr) => (
                <Link key={i} href={item.href} className={`flex flex-col gap-2 group flex-1 pr-6 ${i < arr.length - 1 ? "md:border-r border-[#e8e1d7] md:mr-6" : ""}`}>
                  <h3 className="text-[#141824] font-bold text-[1rem] group-hover:text-[#6e7891] transition-colors">{item.title}</h3>
                  <p className="text-[#6e7891] text-[0.85rem] font-light leading-snug flex-grow">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[#141824] text-[0.75rem] font-bold uppercase tracking-wider mt-2 group-hover:gap-2 transition-all">
                    {t("Découvrir", "Discover")} <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>

            <Link href="/vos-besoins" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
              {t("Voir tous vos besoins", "See all your needs")} 
              <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={16} className="-ml-2" />
            </Link>
          </div>

          {/* Image — absolutely overlapping the right side of the white box */}
          <div className="hidden lg:block absolute -top-24 right-0 w-[36%] h-[75%] z-20">
            <img
              src="/meeting.jpg"
              alt="Vos besoins"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "/rosette.jpg"; }}
            />
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

      {/* ── SECTION 6 : ACTUALITÉS (3 article cards) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container">
          
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-4 uppercase tracking-wider">
                {t("Actualités et Veille", "News and Monitoring")}
              </h2>
            </div>

          </div>

          {/* 3 Article Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                category: t("Finance et Comptabilité", "Finance & Accounting"),
                img: "/article-finance.jpg",
                fallback: "/meeting.jpg",
                title: t("Actualités financières, comptables, patrimoniales et réglementaires", "Financial, accounting, wealth and regulatory news"),
                desc: t("Analyse et décryptage des évolutions susceptibles d'avoir un impact sur vos organisations.", "Analysis of developments likely to impact your organizations."),
                href: "/actualites",
              },
              {
                category: t("Publications", "Publications"),
                img: "/article-publications.jpg",
                fallback: "/rosette.jpg",
                title: t("Nos publications et prises de parole", "Our publications and statements"),
                desc: t("Retrouvez les analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels et sectoriels.", "Find analyses and content published by MENUA CONSULTING on operational and sector issues."),
                href: "/actualites",
              },
              {
                category: t("Réglementation", "Regulation"),
                img: "/article-reglementation.jpg",
                fallback: "/office-lounge.jpg",
                title: t("Veille réglementaire et conformité", "Regulatory watch and compliance"),
                desc: t("Restez informés des dernières évolutions réglementaires et adaptez vos processus opérationnels.", "Stay informed of the latest regulatory developments and adapt your operational processes."),
                href: "/actualites",
              },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="group flex flex-col bg-white border border-[#e8e1d7]/60 hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = card.fallback; }}
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#6e7891] mb-3">{card.category}</span>
                  <h3 className="text-[#141824] font-bold text-[1rem] leading-snug mb-3 group-hover:text-[#6e7891] transition-colors">{card.title}</h3>
                  <p className="text-[#6e7891] text-[0.85rem] font-light leading-relaxed flex-grow mb-4">{card.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.75rem] group-hover:gap-3 transition-all">
                    {t("Lire l'article", "Read article")} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/actualites" className="inline-flex items-center gap-2 text-[#141824] font-bold uppercase tracking-wider text-[0.85rem] hover:text-[#6e7891] transition-colors group">
              {t("Voir toutes nos actualités", "See all our news")} 
              <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={16} className="-ml-2" />
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
