"use client";
import React from "react";
import Link from "@/components/Link";
import { ArrowRight, Globe, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── SECTION 1 : HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/hero-paris.webp" 
            alt="Paris Aerial" 
            className="w-full h-full object-cover object-[75%_center] md:object-[80%_center] lg:object-center"
            onError={(e) => { e.currentTarget.src = "/img/hero-paris.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        
        <div className="laplace-container relative z-10 pt-40 md:pt-48 pb-20 mt-8">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Externalisation opérationnelle des fonctions back ", "Operational outsourcing of back ")}
              <span className="font-sans font-medium">&amp;</span>
              {t(" middle office", " middle office functions")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-8">
              {t(
                "Nous sécurisons l’exécution de vos opérations afin de permettre à vos équipes de se concentrer sur leurs décisions stratégiques, leurs validations et leur relation client.",
                "We secure the execution of your operations to allow your teams to focus on their strategic decisions, their validations and their client relationship."
              )}
            </p>
            <div className="flex w-full justify-end mb-8 lg:absolute lg:right-12 lg:bottom-28">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 px-4 py-2 w-fit bg-[#e8e1d7] text-[#141824] uppercase tracking-wider text-[0.85rem] font-bold hover:bg-white transition-colors group">
                {t("Présenter votre besoin", "Submit your need")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="  mt-1 flex items-center gap-2 text-white">
              <Globe size={16} />
              <p className="text-[0.9rem] lg:text-[0.95rem] text-white font-light italic tracking-wide">
                {t(
                  "Interventions en français et en anglais – profils opérationnels bilingues.",
                  "Interventions in French and English – bilingual operational profiles."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : INTRO (Overlapping Laplace style) ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.75rem] pb-16 md:pb-24">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[420px] z-20 relative shrink-0">
              <img 
                src="/img/accueil-intro.webp" 
                alt="Intro" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
              />
            </div>
            
            {/* Right Overlapping Beige Box */}
            <div className="w-full lg:w-10/12 px-6 py-10 lg:px-12 lg:pr-20 lg:pl-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-ml-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#e8e1d7] rounded-sm shadow-xl -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <div className="leading-relaxed text-[#141824] text-[1.1rem] md:text-[1.2rem] font-light mb-8 space-y-6">
                <h2 className="font-bold text-[1.3rem] md:text-[1.5rem] leading-tight mb-4 uppercase tracking-wider">
                  {t(
                    "MENUA CONSULTING",
                    "MENUA CONSULTING"
                  )}
                </h2>

                {/* Mobile Image (Visible only on mobile) */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[200px] my-6 z-20 relative shadow-md">
                  <img 
                    src="/img/accueil-intro.webp" 
                    alt="Intro" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
                  />
                </div>

                <p>
                  {formatBrand(t(
                    "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT, data et réglementées pour sécuriser et renforcer l’exécution de leurs fonctions back et middle office. Nous prenons en charge des opérations clairement définies, selon les procédures, les outils, les priorités et les circuits de validation de chaque client.",
                    "MENUA CONSULTING supports financial, accounting, wealth, IT, data and regulated teams to secure and strengthen the execution of their back and middle office functions. We take charge of clearly defined operations, according to the procedures, tools, priorities and validation circuits of each client."
                  ))}
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <Link href="/nous-connaitre" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Nous connaître", "About Us")} 
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ChevronRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : POURQUOI MENUA (Dark Navy block) ── */}
      <section className="relative w-full bg-[#141824] text-white pt-12 md:pt-[9.25rem] pb-16 md:pb-24">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12 md:-translate-y-16">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
            <h2 className="text-white text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">
              {t("Pourquoi MENUA CONSULTING ?", "Why MENUA CONSULTING?")}
            </h2>
            <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed mb-8">
              {formatBrand(t(
                "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d’exécution opérationnelle exigeants, avec une approche structurée, traçable et adaptée à leurs contraintes.",
                "MENUA CONSULTING supports organizations facing demanding operational execution challenges, with a structured, traceable approach adapted to their constraints."
              ))}
            </p>
          </div>
          
          {/* Right Column: 4 Assets in a Grid */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
               <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                  <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Spécialisation", "Specialization")}</h3>
                  <p className="text-white/80 font-light text-[1.05rem]">Back et Middle Office</p>
               </div>
               <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                  <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Exécution", "Execution")}</h3>
                  <p className="text-white/80 font-light text-[1.05rem]">100% Opérationnelle</p>
               </div>
               <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                  <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Fiabilité", "Reliability")}</h3>
                  <p className="text-white/80 font-light text-[1.05rem]">Continuité de service</p>
               </div>
               <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                  <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Bilingue", "Bilingual")}</h3>
                  <p className="text-white/80 font-light text-[1.05rem]">Français / Anglais</p>
                </div>
            </div>
            
            <div className="hidden md:flex justify-end mt-auto translate-y-12">
              <Link href="/pourquoi-menua" className="inline-flex items-center gap-2 text-[#e8e1d7] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                 {t("Nos atouts et engagements", "Our strengths and commitments")} 
                 <span className="w-8 h-[1px] bg-[#e8e1d7] group-hover:w-12 transition-all duration-300"></span>
                 <ChevronRight size={18} className="-ml-2" />
               </Link>
            </div>
          </div>
          
          {/* Mobile Button */}
          <div className="mt-8 md:hidden flex justify-end">
            <Link href="/pourquoi-menua" className="inline-flex items-center gap-2 text-[#e8e1d7] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
               {t("Nos atouts et engagements", "Our strengths and commitments")} 
               <span className="w-8 h-[1px] bg-[#e8e1d7] group-hover:w-12 transition-all duration-300"></span>
               <ChevronRight size={18} className="-ml-2" />
             </Link>
          </div>

        </div>
      </section>

      {/* ── SECTION 4 : VOS BESOINS (Light section with image overlap) ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row-reverse items-center">
            
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[360px] z-20 relative shrink-0">
              <img
                src="/img/besoins-meeting.webp"
                alt="Vos besoins"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
              />
            </div>

            {/* Left Overlapping Grey Box */}
            <div className="w-full lg:w-10/12 px-6 py-10 lg:px-12 lg:pl-20 lg:pr-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-mr-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                {t("Vos besoins", "Your Needs")}
              </h2>

              {/* Mobile Image (Visible only on mobile) */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[200px] my-6 z-20 relative shadow-md">
                <img
                  src="/img/besoins-meeting.webp"
                  alt="Vos besoins"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                />
              </div>
              <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-10">
                {formatBrand(t(
                  "Un appui opérationnel adapté aux équipes financières, comptables, patrimoniales, IT, data et réglementées, pour traiter les opérations qui exigent rigueur, continuité et fiabilité.",
                  "Operational support tailored to financial, accounting, wealth, IT, data and regulated teams, to process operations that require rigor, continuity and reliability."
                ))}
              </p>

              {/* 3 need items */}
              <div className="flex flex-col md:flex-row gap-0 mb-10 border-t border-[#e8e1d7] pt-8">
                {[
                  { title: t("Finance et Reporting", "Finance and Reporting"), desc: t("Production, structuration et fiabilisation de reportings financiers...", "Production, structuring and reliability of financial reports..."), href: "/vos-besoins#finance-reporting" },
                  { title: t("Risques et Conformité", "Risk and Compliance"), desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement...", "Operational support for risk and compliance teams in processing..."), href: "/vos-besoins#risques-conformite" },
                  { title: t("Support Comptable et Data", "Accounting and Data Support"), desc: t("Appui opérationnel aux équipes comptables, administratives et data...", "Operational support for accounting, administrative and data teams..."), href: "/vos-besoins#support-comptable-data" },
                ].map((item, i, arr) => (
                  <Link key={item.href} href={item.href} className={`flex flex-col gap-2 group flex-1 pr-6 ${i < arr.length - 1 ? "md:border-r border-[#e8e1d7] md:mr-6" : ""}`}>
                    <h3 className="text-[#141824] font-semibold text-[1rem] group-hover:text-[#6e7891] transition-colors">{item.title}</h3>
                    <p className="text-[#6e7891] text-[0.85rem] font-light leading-snug flex-grow">{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[#141824] text-[0.75rem] font-bold uppercase tracking-wider mt-2 group-hover:gap-2 transition-all">
                      {t("Découvrir", "Discover")} <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Link href="/vos-besoins" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Voir tous vos besoins", "See all your needs")} 
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ChevronRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : NOS SOLUTIONS (Beige Minimal Section) ── */}
      <section className="relative w-full bg-[#e8e1d7] pt-12 md:pt-[9.25rem] pb-16 md:pb-24">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12 md:-translate-y-16">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Nos solutions d'externalisation", "Our outsourcing solutions")}
            </h2>
            <p className="text-[#141824] text-[1.1rem] font-light leading-relaxed mb-8">
              {t(
                "Nous concevons des dispositifs d’externalisation sur mesure, adaptés à vos contraintes d’urgence, de durée, de volume et d’organisation.",
                "We design tailor-made outsourcing systems, adapted to your constraints of urgency, duration, volume and organization."
              )}
            </p>
          </div>

          {/* Right Column: 4 constraints in a 2x2 grid */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
               <div className="border-l-2 border-[#141824]/30 pl-6">
                  <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Urgence", "Urgency")}</h3>
                  <p className="text-[#141824]/70 font-light text-[1.05rem]">Réactivité</p>
               </div>
               <div className="border-l-2 border-[#141824]/30 pl-6">
                  <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Durée", "Duration")}</h3>
                  <p className="text-[#141824]/70 font-light text-[1.05rem]">Flexibilité</p>
               </div>
               <div className="border-l-2 border-[#141824]/30 pl-6">
                  <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Volume", "Volume")}</h3>
                  <p className="text-[#141824]/70 font-light text-[1.05rem]">Agilité</p>
               </div>
                <div className="border-l-2 border-[#141824]/30 pl-6">
                   <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Format", "Format")}</h3>
                   <p className="text-[#141824]/70 font-light text-[1.05rem]">Sur Mesure</p>
                </div>
            </div>
            
            <div className="hidden md:flex justify-end mt-auto translate-y-12">
              <Link href="/nos-solutions" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                 {t("Découvrir nos solutions", "Discover our solutions")} 
                 <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                 <ChevronRight size={18} className="-ml-2" />
               </Link>
            </div>
          </div>
          
          {/* Mobile Button */}
          <div className="mt-8 md:hidden flex justify-end">
            <Link href="/nos-solutions" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
               {t("Découvrir nos solutions", "Discover our solutions")} 
               <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
               <ChevronRight size={18} className="-ml-2" />
             </Link>
          </div>

        </div>
      </section>

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── SECTION 6 : ACTUALITÉS (3 article cards) ── */}
      <section className="relative w-full bg-[#141824] pt-12 md:pt-[5.25rem] pb-16 md:pb-24">
        <div className="laplace-container">
          
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-block text-left max-w-2xl">
              <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-white font-bold mb-4 uppercase tracking-wider">
                {t("Actualités et Veille", "News and Monitoring")}
              </h2>
              <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed">
                {t(
                  "Retrouvez nos analyses, publications et contenus consacrés aux enjeux opérationnels, financiers, comptables, patrimoniaux, data et réglementaires.",
                  "Find our analyses, publications and content dedicated to operational, financial, accounting, wealth, data and regulatory issues."
                )}
              </p>
            </div>

          </div>

          {/* 3 Article Cards (Placeholder) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Articles will be dynamically injected here. Displaying a single placeholder for now. */}
            <Link href="/actualites" className="group flex flex-col bg-white/5 border border-[#e8e1d7]/20 hover:bg-white/10 transition-all duration-300 md:col-span-1 md:col-start-2">
              {/* Image Placeholder */}
              <div className="h-[180px] overflow-hidden bg-[#1a1f2e] flex items-center justify-center">
                <span className="text-[#e8e1d7]/20 font-bold tracking-widest uppercase text-lg">MENUA CONSULTING</span>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                <p className="text-white/70 text-[0.85rem] font-light leading-relaxed flex-grow mb-4">
                  {formatBrand(t(
                    "Cette rubrique accueillera prochainement les analyses et publications de MENUA CONSULTING consacrées aux évolutions opérationnelles, aux méthodes de travail, à la fiabilisation des processus et à la continuité d’activité.",
                    "This section will soon host MENUA CONSULTING's analyses and publications dedicated to operational developments, working methods, process reliability and business continuity."
                  ))}
                </p>
                <span className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[0.75rem] group-hover:gap-3 transition-all">
                  {t("Découvrir la rubrique", "Discover the section")} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>

          {/* CTA */}
          <div className="flex justify-end mt-4">
            <Link href="/actualites" className="inline-flex items-center gap-2 text-white uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
              {t("Voir toutes nos actualités", "See all our news")} 
              <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={18} className="-ml-2" />
            </Link>
          </div>

        </div>
      </section>



    </main>
  );
}
