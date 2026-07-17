"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight } from "lucide-react";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 4.1 HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/solutions-hero.jpg" 
            alt="Nos solutions" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nos solutions", "Our solutions")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-8">
              {t(
                "Des dispositifs d’externalisation flexibles, adaptés à vos contraintes d’urgence, de durée, de volume et d’organisation.",
                "Flexible outsourcing systems, adapted to your constraints of urgency, duration, volume and organization."
              )}
            </p>
            <div className="flex w-full justify-end mb-8 lg:absolute lg:right-12 lg:bottom-28">
              <Link href="/nous-contacter" className="inline-flex items-center gap-3 px-4 py-2 w-fit bg-[#e8e1d7] text-[#141824] uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white transition-colors group">
                {t("Présenter votre besoin", "Submit your need")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[8.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container relative z-10">
          {/* BREADCRUMB */}
          <div className="absolute -top-8 md:-top-[6rem] left-6 md:left-12 lg:left-0 z-50">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Nos solutions", "Our solutions")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* Left Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[350px] lg:-mt-12 z-20 relative shrink-0">
              <img 
                src="/img/solutions_3.jpg" 
                alt="Nos solutions" 
                className="w-full h-full object-cover shadow-xl" 
                onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
              />
            </div>
            
            {/* Right Overlapping Box */}
            <div className="w-full lg:w-10/12 px-6 py-10 lg:px-12 lg:pr-20 lg:pl-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-ml-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <div className="leading-relaxed text-[#6e7891] text-[1rem] font-light mb-8 space-y-6">
                <h2 className="text-[#141824] font-bold text-[1.3rem] md:text-[1.5rem] leading-tight mb-4 uppercase tracking-wider">
                  {t("Une Approche Sur Mesure", "A Tailor-made Approach")}
                </h2>

                {/* Mobile Image (Visible only on mobile) */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 z-20 relative shadow-md">
                  <img
                    src="/img/solutions-hero.jpg"
                    alt="Nos solutions"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }}
                  />
                </div>
                
                <p className="text-[1.1rem] font-medium">
                  {formatBrand(t(
                    "MENUA CONSULTING conçoit des solutions d’externalisation opérationnelle sur mesure pour accompagner les entreprises, cabinets et organisations dans la gestion de leurs fonctions back et middle office.",
                    "MENUA CONSULTING designs tailor-made operational outsourcing solutions to support companies, firms and organizations in the management of their back and middle office functions."
                  ))}
                </p>
                <p>
                  {t(
                    "Nos interventions peuvent répondre à un besoin ponctuel, à une surcharge d’activité, à un volume important de dossiers ou à une organisation récurrente nécessitant continuité, rigueur et fiabilité.",
                    "Our interventions can meet an ad hoc need, an overload of activity, a large volume of files or a recurring organization requiring continuity, rigor and reliability."
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 4.3 URGENCE (Image Left, Card Right) ── */}
      <section className="relative w-full bg-[#141824] py-24 scroll-mt-20 overflow-hidden">
        {/* Subtle geometric accent background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[-10deg] origin-bottom-right hidden lg:block" />
        
        <div className="laplace-container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Narrative */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-8" />
            <h3 className="text-white font-bold text-[2rem] lg:text-[2.2rem] leading-tight mb-8">
              {t("Urgence", "Urgency")}
            </h3>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING peut mobiliser des ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d’activité ou sécuriser la continuité d’un service.",
                "MENUA CONSULTING can mobilize operational resources to meet an immediate need, absorb an overload of activity or secure the continuity of a service."
              ))}
            </p>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-12">
              {t(
                "Cette solution est adaptée aux situations nécessitant une réaction rapide, notamment lorsque les équipes internes font face à un pic d’activité, un retard de traitement ou une absence temporaire.",
                "This solution is adapted to situations requiring a rapid reaction, in particular when internal teams face an activity peak, a processing delay or a temporary absence."
              )}
            </p>
          </div>

          {/* Right Column: Features Card */}
          <div className="w-full lg:w-7/12 relative">
            <div className="relative bg-white p-10 lg:p-14 shadow-2xl border border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]">
              <h4 className="text-center text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
                {t("Exemples de besoins :", "Examples of needs:")}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-[#6e7891] font-medium text-[0.95rem]">
                {[
                  t("surcharge d’activité ou pic de dossiers", "activity overload or peak of files"),
                  t("remplacement temporaire d’un collaborateur absent", "temporary replacement of an absent employee"),
                  t("renfort ponctuel en période de clôture ou de reporting", "ad hoc reinforcement during closing or reporting periods"),
                  t("traitement accéléré de dossiers en retard ou en attente", "accelerated processing of delayed or pending files"),
                  t("mise à disposition progressive de ressources pour sécuriser une montée en charge", "progressive provision of resources to secure an increase in load")
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 4.4 DURÉE (Notre approche layout) ── */}
      <section className="w-full bg-white scroll-mt-20">
        <div className="laplace-container pb-16 lg:pb-24">
          <div className="w-full bg-[#f5f7fa] rounded-sm pt-12 lg:pt-16 pb-12 lg:pb-16 px-6 lg:pl-32 lg:pr-20 flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
          
          {/* Left Col: Title & Intro */}
          <div className="w-full lg:w-4/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-6" />
            <h2 className="text-[#141824] text-[1.5rem] md:text-[1.8rem] font-bold uppercase tracking-widest mb-8">
              {t("Durée", "Duration")}
            </h2>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
              {formatBrand(t("MENUA CONSULTING propose des formats d’intervention flexibles, adaptés aussi bien aux missions courtes qu’aux besoins récurrents.", "MENUA CONSULTING offers flexible intervention formats, adapted to short missions as well as recurring needs."))}
            </p>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
              {t("La durée de la mission est définie selon le périmètre, les volumes à traiter, les objectifs attendus et les contraintes propres à l’organisation du client.", "The duration of the mission is defined according to the scope, the volumes to be processed, the expected objectives and the constraints specific to the client's organization.")}
            </p>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden">
              <img src="/img/solutions_2.jpg" alt="Durée" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} />
            </div>
            <div className="w-full aspect-[4/5] rounded-sm overflow-hidden shadow-lg hidden lg:block">
              <img 
                src="/img/solutions_2.jpg" 
                alt="Durée" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
              />
            </div>
          </div>

          {/* Right Col: Pillars */}
          <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Mission courte", "Short mission")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour traiter un besoin identifié sur une période limitée", "to address an identified need over a limited period")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Mission longue", "Long mission")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour accompagner la gestion d’un portefeuille de dossiers", "to support the management of a portfolio of files")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Intervention ponctuelle", "Ad hoc intervention")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("sur un volume de dossiers comptables, financiers, patrimoniaux, conformité ou administratifs", "on a volume of accounting, financial, wealth, compliance or administrative files")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Externalisation récurrente", "Recurring outsourcing")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour confier durablement tout ou partie de certaines activités opérationnelles", "to durably entrust all or part of certain operational activities")}
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm md:col-span-1">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Ajustement du dispositif", "System adjustment")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("selon l’évolution de la charge et des priorités du client", "according to the evolution of the client's load and priorities")}
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── 4.5 VOLUME (Dark Theme Full Width) ── */}
      <section className="relative w-full bg-[#141824] pt-16 md:pt-[7.75rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden">
        {/* Subtle geometric accent background on the left */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[10deg] origin-bottom-left hidden lg:block" />
        
        <div className="laplace-container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          
          {/* Narrative (Right side visually) */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-8" />
            <h3 className="text-white font-bold text-[2rem] lg:text-[2.2rem] leading-tight mb-8">
              {t("Volume", "Volume")}
            </h3>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d’opérations à traiter.",
                "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows or operations to be processed."
              ))}
            </p>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-12">
              {t(
                "L’objectif est de garantir une exécution fluide, continue et sécurisée, même lorsque les volumes augmentent ou lorsque plusieurs flux doivent être suivis simultanément.",
                "The objective is to guarantee fluid, continuous and secure execution, even when volumes increase or when several flows must be tracked simultaneously."
              )}
            </p>
          </div>

          {/* Features Card (Left side visually) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="relative bg-white p-10 lg:p-14 shadow-2xl border border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]">
              <h4 className="text-center text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
                {t("Dispositifs possibles :", "Possible systems:")}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-[#6e7891] font-medium text-[0.95rem]">
                {[
                  t("une ressource dédiée sur un périmètre précis", "a dedicated resource on a specific scope"),
                  t("un renfort ponctuel pour absorber une surcharge d’activité", "an ad hoc reinforcement to absorb an activity overload"),
                  t("une équipe opérationnelle pour gérer un volume important de dossiers", "an operational team to manage a large volume of files"),
                  t("un dispositif évolutif ajusté selon la charge, les priorités et les délais", "an scalable system adjusted according to the load, priorities and deadlines"),
                  t("une organisation permettant de maintenir la continuité du traitement en cas d’absence ou de variation d’activité", "an organization allowing to maintain the continuity of processing in case of absence or variation of activity")
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── 4.6 MODE D'ORGANISATION ── */}
      <section className="relative w-full bg-[#e8e1d7] pt-16 md:pt-[7.75rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden">
        {/* Subtle geometric accent background on the right */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#e0d8cd] skew-x-[-10deg] origin-bottom-right hidden lg:block" />
        
        <div className="laplace-container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Narrative (Left side visually) */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
            <div className="w-16 h-[3px] bg-[#141824] mb-8" />
            <h3 className="text-[#141824] font-bold text-[2rem] lg:text-[2.2rem] leading-tight mb-8">
              {t("Mode d’organisation", "Organization mode")}
            </h3>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING structure ses interventions selon le format le plus adapté à l’organisation du client : mission dédiée, intervention ponctuelle, traitement de flux ou prise en charge de process définis.",
                "MENUA CONSULTING structures its interventions according to the format most adapted to the client's organization: dedicated mission, ad hoc intervention, flow processing or management of defined processes."
              ))}
            </p>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed mb-12">
              {t(
                "Nos équipes s’intègrent aux méthodes, outils, procédures et circuits de validation existants, afin de garantir une exécution fluide, traçable et conforme aux standards internes du client.",
                "Our teams integrate into existing methods, tools, procedures and validation circuits, in order to guarantee a fluid, traceable execution in line with the client's internal standards."
              )}
            </p>
          </div>

          {/* Features Card (Right side visually) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="relative bg-white p-10 lg:p-14 shadow-2xl border border-[#e8e1d7] border-t-8 border-t-[#141824]">
              <h4 className="text-center text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
                {t("Modes d’intervention possibles :", "Possible intervention modes:")}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-[#6e7891] font-medium text-[0.95rem]">
                {[
                  t("dispositif dédié pour un service ou un périmètre clairement identifié", "dedicated system for a clearly identified service or scope"),
                  t("intervention par mission pour un besoin borné dans le temps", "intervention by mission for a time-bound need"),
                  t("prise en charge de flux ou de process récurrents", "management of recurring flows or processes"),
                  t("traitement de dossiers, adhésions, opérations ou demandes selon des règles définies avec le client", "processing of files, memberships, operations or requests according to rules defined with the client"),
                  t("suivi structuré avec points de contrôle réguliers", "structured monitoring with regular control points"),
                  t("reporting opérationnel selon la fréquence convenue", "operational reporting according to the agreed frequency")
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.7 LANGUES & 4.8 BON A SAVOIR ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Langues Card */}
            <div className="bg-[#141824] p-10 lg:p-12 shadow-xl border-t-4 border-t-[#e8e1d7] flex flex-col justify-center">
              <h3 className="text-white font-bold text-[1.5rem] mb-6">{t("Langues", "Languages")}</h3>
              <p className="text-[#e5e9f0] font-light text-[1.05rem] leading-relaxed">
                {formatBrand(t(
                  "MENUA CONSULTING peut intervenir en français et en anglais afin de faciliter la gestion des échanges, des reportings, des contrôles documentaires et des opérations dans un contexte national ou international. D’autres langues peuvent être étudiées selon les besoins spécifiques du client, la nature de la mission et les ressources mobilisables.",
                  "MENUA CONSULTING can intervene in French and English in order to facilitate the management of exchanges, reports, documentary controls and operations in a national or international context. Other languages can be studied according to the specific needs of the client, the nature of the mission and the resources that can be mobilized."
                ))}
              </p>
            </div>

            {/* Bon à savoir Card */}
            <div className="bg-white p-10 lg:p-12 shadow-xl border border-[#e8e1d7] border-t-4 border-t-[#141824] flex flex-col justify-center">
              <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6">{t("Bon à savoir", "Good to know")}</h3>
              <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed">
                {formatBrand(t(
                  "Chaque solution est construite après analyse du besoin, du volume, des délais, des outils disponibles et du niveau de supervision attendu. MENUA CONSULTING privilégie une approche claire, progressive et contrôlable, afin de garantir une exécution fiable et adaptée aux contraintes réelles de chaque organisation.",
                  "Each solution is built after analysis of the need, volume, deadlines, available tools and expected level of supervision. MENUA CONSULTING favors a clear, progressive and controllable approach, in order to guarantee reliable execution adapted to the real constraints of each organization."
                ))}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
