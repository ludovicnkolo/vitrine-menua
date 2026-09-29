"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight, ChevronRight } from "lucide-react";
import BulletList from "@/components/BulletList";

/** Section claire : image à gauche ou droite + card de liste */
const NeedCardSection = ({ id, imgSrc, imgAlt, imgFallback, title, intro, items, reversed = false, bgClass = "bg-[#f5f7fa]", cardBg = "bg-white", containerClass = "" }: any) => {
  const isReversed = reversed;
  return (
    <section id={id} className={`relative w-full ${bgClass} pt-12 md:pt-[8rem] pb-16 md:pb-24 scroll-mt-20`}>
      <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
          
          {/* Image */}
          <div className="hidden lg:block w-full lg:w-6/12 lg:h-[400px] z-20 relative shrink-0">
            <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover object-center shadow-xl" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
          </div>

          {/* Text Box */}
          <div className={`w-full lg:w-7/12 px-6 portrait:sm:px-10 landscape:px-32 landscape:lg:px-0 py-10 lg:px-12 ${isReversed ? 'lg:pl-20 landscape:lg:pl-20 lg:pr-32 landscape:lg:pr-32 lg:-mr-24' : 'lg:pr-20 landscape:lg:pr-20 lg:pl-32 landscape:lg:pl-32 lg:-ml-24'} lg:pt-16 lg:pb-16 relative z-30 lg:z-10 ${containerClass}`}>
            
            {/* Absolute background */}
            <div className={`absolute left-0 right-0 portrait:sm:left-2 portrait:sm:right-2 landscape:left-16 landscape:right-16 lg:left-0 lg:right-0 landscape:lg:left-0 landscape:lg:right-0 bottom-0 top-[220px] landscape:top-[320px] lg:top-0 landscape:lg:top-0 ${cardBg} rounded-sm shadow-xl border border-[#e8e1d7] border-t-4 border-t-[#141824] -z-10`} />

            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">{title}</h2>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-12 rounded-sm shadow-md overflow-hidden">
              <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover object-center" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
            </div>

            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">{intro}</p>
            <h4 className="text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{items.label}</h4>
            <BulletList items={items.list} />
          </div>

        </div>
      </div>
    </section>
  );
};

/** Section sombre asymétrique : texte narratif + card de liste */
const DarkNeedSection = ({ id, bgClass, topDecoClass, titleDecoClass, title, intro, disclaimer, listLabel, listItems, borderClass }: any) => (
  <section id={id} className={`relative w-full ${bgClass} pt-12 md:pt-[8rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden`}>
    {topDecoClass && <div className={topDecoClass} />}
    <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
      <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
        <div className={`w-16 h-[3px] mb-5 ${titleDecoClass}`} />
        <h2 className={`${bgClass.includes("bg-[#141824]") ? "text-white" : "text-[#141824]"} text-[1.3rem] md:text-[1.5rem] font-bold uppercase mb-8 leading-tight`}>
          {title}
        </h2>
        <p className={`${bgClass.includes("bg-[#141824]") ? "text-[#e5e9f0]" : "text-[#141824]/80 font-medium"} font-light text-[1.1rem] leading-relaxed mb-${disclaimer ? "8" : "12"}`}>
          {intro}
        </p>
        {disclaimer && (
          <div className="p-6 border-l-4 border-[#e8e1d7] bg-white/5 relative">
            <p className="text-[#e8e1d7] font-medium text-[0.95rem] leading-relaxed">{disclaimer}</p>
          </div>
        )}
      </div>
      <div className="w-full lg:w-7/12 relative">
        <div className={`relative bg-white p-10 lg:p-14 shadow-2xl border ${borderClass}`}>
          <h4 className="text-center text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">{listLabel}</h4>
          <BulletList 
            gridCols="grid-cols-1 md:grid-cols-2" 
            gapX="gap-x-8" gapY="gap-y-6" 
            fontWeight="font-medium"
            items={listItems} 
          />
        </div>
      </div>
    </div>
  </section>
);

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 3.1 HERO ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/besoins-hero.webp" 
            alt="Hero Vos Besoins" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-4 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Vos besoins", "Your needs")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t(
                "Un appui opérationnel structuré pour renforcer vos équipes, sécuriser vos traitements et maintenir la continuité de vos activités.",
                "Structured operational support to strengthen your teams, safeguard your processes and maintain continuity."
              )}
            </p>
            <div className="mt-4">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                {t("Présenter votre besoin", "Tell us about your requirements")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-8 md:pt-[4.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
          <div className="w-full mb-8 md:mb-4">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Vos besoins", "Your needs")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row-reverse items-center">
            
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-6/12 lg:h-[400px] z-20 relative shrink-0">
              <img
                src="/img/besoins-intro.webp"
                alt="Vos besoins"
                className="w-full h-full object-cover object-center shadow-xl"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
              />
            </div>

            {/* Left Overlapping Grey Box */}
            <div className="w-full lg:w-7/12 px-6 portrait:sm:px-10 landscape:px-32 landscape:lg:px-0 py-10 lg:px-12 lg:pl-20 landscape:lg:pl-20 lg:pr-32 landscape:lg:pr-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-mr-24">
              <div className="absolute left-0 right-0 portrait:sm:left-2 portrait:sm:right-2 landscape:left-16 landscape:right-16 lg:left-0 lg:right-0 landscape:lg:left-0 landscape:lg:right-0 bottom-0 top-[220px] landscape:top-[320px] lg:top-0 landscape:lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                {t("Notre Intervention", "How we support you")}
              </h2>
              
              <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-16 z-20 relative shadow-md">
                <img src="/img/besoins-intro.webp" alt="Vos besoins" className="w-full h-full object-cover object-center" onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} />
              </div>
              
              <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING intervient en appui des équipes financières, comptables, conformité, data, patrimoniales et réglementées sur les fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                  "MENUA CONSULTING supports finance, accounting, compliance, data and wealth management teams, as well as teams operating in regulated environments, by providing the rigorous back and middle office support needed to ensure operational reliability and continuity."
                ))}
              </p>
              <p className="text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
                {t(
                  "Nos interventions s'adaptent aux besoins ponctuels, récurrents ou volumineux : traitement de dossiers, contrôle documentaire, reporting, suivi opérationnel, mise à jour de données, préparation de livrables ou renfort temporaire d'équipes.",
                  "Our services are designed to meet one-off, recurring or high-volume requirements. This includes file processing, document review, reporting, operational monitoring, data updates, deliverable preparation and temporary team reinforcement."
                )}
              </p>
              <div className="mt-8">
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Présenter votre besoin", "Tell us about your requirements")} 
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ChevronRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.3 FINANCE & REPORTING ── */}
      <NeedCardSection
        id="finance-reporting"
        imgSrc="/img/besoins-finance.webp"
        imgAlt="Finance & Reporting"
        imgFallback="/img/intro-office.webp"
        title={<>{t("Finance", "Finance")} <span className="font-sans font-medium">&amp;</span> {t("Reporting", "Reporting")}</>}
        intro={formatBrand(t(
          "MENUA CONSULTING accompagne les équipes financières dans la production, la structuration et la fiabilisation de reportings destinés au pilotage de l'activité, au suivi de la performance et à l'aide à la décision.",
          "MENUA CONSULTING supports finance teams by producing, structuring and verifying the reports required for performance management, operational oversight and decision-making."
        ))}
        items={{
          label: t("Besoins couverts :", "Our support includes:"),
          list: [
            t("reporting financier", "financial reporting"),
            t("KPI et tableaux de bord", "KPIs and dashboards"),
            t("analyse de performance", "performance analysis"),
            t("analyse financière", "financial analysis"),
            t("consolidation de données", "data consolidation"),
            t("reporting mensuel ou trimestriel", "monthly or quarterly reporting"),
            t("reporting de trésorerie", "cash flow reporting"),
            t("reporting de rentabilité", "profitability reporting"),
            t("suivi d'activité et indicateurs opérationnels", "activity monitoring and operational indicators"),
            t("support aux directions financières", "support to financial departments"),
          ]
        }}
        bgClass="bg-[#f5f7fa]"
        cardBg="bg-white"
      />

      {/* ── 3.4 CONTRÔLE DE GESTION ── */}
      <NeedCardSection
        id="controle-gestion"
        reversed
        imgSrc="/img/besoins-gestion.webp"
        imgAlt="Contrôle de gestion"
        imgFallback="/img/besoins-meeting.webp"
        title={t("Contrôle de gestion", "Management control")}
        intro={formatBrand(t(
          "MENUA CONSULTING intervient en appui opérationnel des équipes de contrôle de gestion pour renforcer le suivi budgétaire, l'analyse des écarts et le pilotage de la performance. L'objectif est d'aider les organisations à mieux suivre leurs coûts, leurs marges, leurs objectifs et leurs indicateurs, à partir de données structurées et fiables.",
          "MENUA CONSULTING provides operational support to management control teams, strengthening budget tracking, variance analysis and performance management. Our goal is to help organisations better monitor costs, margins, objectives and indicators using structured, reliable data."
        ))}
        items={{
          label: t("Besoins couverts :", "Our support includes:"),
          list: [
            t("suivi budgétaire", "budget tracking"),
            t("analyse des écarts entre réalisé, budget et prévisionnel", "analysis of variances between actual, budget and forecast"),
            t("tableaux de bord de gestion", "management dashboards"),
            t("pilotage de la performance", "performance management"),
            t("suivi des coûts, charges et marges", "monitoring of costs, expenses and margins"),
            t("analyse de rentabilité", "profitability analysis"),
            t("suivi du chiffre d'affaires et des objectifs", "monitoring of turnover and objectives"),
            t("mise à jour de fichiers de pilotage", "updating of management files"),
            t("consolidation des données de gestion", "consolidation of management data"),
            t("support aux directions financières et responsables opérationnels", "support to financial departments and operational managers"),
          ]
        }}
        bgClass="bg-white"
        cardBg="bg-[#f5f7fa]"
      />

      {/* ── 3.5 RISQUES & CONFORMITÉ ── */}
      <DarkNeedSection
        id="risques-conformite"
        bgClass="bg-[#141824]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#e8e1d7]"
        borderClass="border border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]"
        title={<>{t("Risques", "Risk")} <span className="font-sans font-medium text-[#e8e1d7]">&amp;</span> {t("Conformité", "Compliance")}</>}
        intro={formatBrand(t(
          "MENUA CONSULTING apporte un appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences applicables.",
          "Operating within demanding compliance environments, MENUA CONSULTING works alongside risk and compliance teams, handling operational processes that require a rigorous, traceable approach."
        ))}
        disclaimer={formatBrand(t(
          "MENUA CONSULTING intervient en support des équipes habilitées du client. Les validations réglementaires, arbitrages et décisions finales restent de la responsabilité du client ou de ses professionnels autorisés.",
          "MENUA CONSULTING supports the client’s authorised teams. Regulatory approvals, judgements and final decisions remain the responsibility of the client or its authorised professionals."
        ))}
        listLabel={t("Besoins couverts :", "Our support includes:")}
        listItems={[
          t("KYC", "KYC"),
          t("AML / LCB-FT", "AML / CFT"),
          t("contrôle documentaire", "documentary control"),
          t("analyse et complétude des dossiers clients", "analysis and completeness of client files"),
          t("vérification des pièces justificatives", "verification of supporting documents"),
          t("entrée en relation client", "client onboarding"),
          t("revue périodique des dossiers", "periodic review of files"),
          t("remédiation KYC", "KYC remediation"),
          t("traitement et suivi des alertes de conformité", "processing and monitoring of compliance alerts"),
          t("support aux équipes risques", "support for risk teams"),
          t("support aux équipes conformité", "support for compliance teams"),
          t("suivi des procédures internes", "monitoring of internal procedures"),
          t("préparation de dossiers pour validation par les équipes habilitées", "preparation of files for validation by authorized teams"),
        ]}
      />

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── 3.6 SUPPORT COMPTABLE & DATA ── */}
      <NeedCardSection
        id="support-comptable-data"
        imgSrc="/img/besoins-data.webp"
        imgAlt="Support comptable & Data"
        imgFallback="/img/intro-office.webp"
        title={<>{t("Support comptable", "Accounting")} <span className="font-sans font-medium">&amp;</span> {t("Data", "Data Support")}</>}
        intro={formatBrand(t(
          "MENUA CONSULTING intervient en support opérationnel des équipes comptables, administratives et data dans le traitement, la fiabilisation, le classement et la structuration des informations nécessaires au suivi comptable, administratif et opérationnel. MENUA CONSULTING ne se substitue pas à un expert-comptable lorsque son intervention est requise. Les travaux préparés restent soumis aux contrôles et validations du client ou de son expert-comptable.",
          "MENUA CONSULTING strengthens accounting, administrative and data teams by handling time-consuming, repetitive or high-volume tasks, allowing them to focus on analysis and validation. MENUA CONSULTING does not replace a chartered accountant. All prepared work remains subject to review and approval by the client or their chartered accountant."
        ))}
        items={{
          label: t("Besoins couverts :", "Our support includes:"),
          list: [
            t("collecte, classement et contrôle des pièces comptables", "collection, classification and control of accounting documents"),
            t("rapprochements bancaires", "bank reconciliations"),
            t("lettrage des comptes", "matching and clearing of open items"),
            t("suivi des factures clients et fournisseurs", "monitoring of client and supplier invoices"),
            t("relances administratives liées aux pièces manquantes", "administrative reminders linked to missing documents"),
            t("déclarations de TVA, sous supervision du client", "VAT returns, under client supervision"),
            t("préparation des éléments comptables pour révision", "preparation of accounting elements for review"),
            t("data cleaning", "data cleaning"),
            t("structuration et mise à jour de bases de données", "structuring and updating of databases"),
            t("contrôle de cohérence des données", "data consistency check"),
            t("préparation de fichiers de reporting", "preparation of reporting files"),
            t("consolidation de données comptables et opérationnelles", "consolidation of accounting and operational data"),
            t("archivage et organisation documentaire", "archiving and documentary organisation"),
          ]
        }}
        bgClass="bg-[#f5f7fa]"
        cardBg="bg-white"
      />

      {/* ── 3.7 SUPPORT AUX CGP ── */}
      <NeedCardSection
        id="support-cgp"
        reversed
        imgSrc="/img/besoins-cgp.webp"
        imgAlt="Support aux CGP"
        imgFallback="/img/intro-office.webp"
        containerClass="landscape:px-16 landscape:lg:px-16" title={t("Support aux cabinets de gestion de patrimoine / CGP", "Support for wealth management firms and financial advisers")}
        intro={formatBrand(t(
          "MENUA CONSULTING accompagne les cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients. Les conseils, recommandations, arbitrages et validations demeurent sous la responsabilité des professionnels habilités du client. MENUA CONSULTING intervient uniquement sur la préparation et le suivi opérationnels des dossiers.",
          "MENUA CONSULTING supports wealth management firms, family offices and wealth-management structures in the processing, preparation and administrative monitoring of client files. Advice, recommendations, investment decisions and approvals remain the responsibility of the client’s authorised professionals. MENUA CONSULTING focuses strictly on operational preparation and monitoring."
        ))}
        items={{
          label: t("Besoins couverts :", "Our support includes:"),
          list: [
            t("préparation des dossiers d'entrée en relation ;", "preparation of client onboarding files;"),
            t("collecte et contrôle des pièces justificatives ;", "collection and verification of supporting documents;"),
            t("contrôle de complétude des dossiers clients ;", "client file completeness reviews;"),
            t("mise à jour des informations clients ;", "updating client records and KYC data;"),
            t("support administratif aux souscriptions ;", "administrative support for subscriptions;"),
            t("préparation administrative des demandes d'arbitrage ;", "administrative preparation of investment switch and reallocation requests;"),
            t("préparation administrative des demandes de rachat partiel ou total ;", "administrative preparation of partial or full surrender requests;"),
            t("suivi des demandes clients ;", "tracking client enquiries and requests;"),
            t("organisation et archivage documentaire ;", "document management and archiving;"),
            t("mise à jour des bases clients ;", "maintaining client databases;"),
            t("suivi des opérations patrimoniales dans le respect des procédures internes.", "monitoring wealth operations in compliance with internal procedures.")
          ]
        }}
        bgClass="bg-white"
        cardBg="bg-[#f5f7fa]"
      />

      {/* ── 3.8 AUTRES BESOINS ── */}
      <DarkNeedSection
        id="autres-besoins"
        bgClass="bg-[#e8e1d7]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#e0d8cd] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#141824]"
        borderClass="border border-[#e8e1d7] border-t-8 border-t-[#141824]"
        title={t("Autres besoins opérationnels", "Other operational needs")}
        intro={formatBrand(t(
          "MENUA CONSULTING peut également intervenir sur des besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, conformité, patrimoniale ou data. Cette flexibilité permet d'accompagner les organisations en période de surcharge, de transition, de réorganisation ou de besoin temporaire de renfort.",
          "MENUA CONSULTING can also manage ad-hoc, cross-functional or specific operational needs that do not fall strictly within a finance, accounting, compliance, wealth or data function. This operational support is a flexible solution designed to address specific resource challenges and help maintain day-to-day delivery."
        ))}
        listLabel={t("Besoins couverts :", "You might call on us to manage:")}
        listItems={[
          t("missions ponctuelles de renfort opérationnel", "ad hoc operational reinforcement missions"),
          t("support administratif financier", "financial and administrative support"),
          t("traitement de dossiers en volume", "high-volume file processing"),
          t("classement, archivage et organisation documentaire", "classification, archiving and documentary organisation"),
          t("préparation et mise à jour de fichiers de suivi", "preparation and updating of tracking files"),
          t("support à la gestion d'opérations transverses", "support for cross-functional operations"),
          t("aide à la formalisation de procédures internes", "help with the formalization of internal procedures"),
          t("aide à la structuration de process opérationnels", "help with the structuring of operational processes"),
          t("suivi de demandes internes ou clients", "monitoring of internal or client requests"),
          t("support en période de surcharge d'activité", "support during periods of overload"),
          t("remplacement ou appui temporaire d'équipe", "replacement or temporary team support"),
          t("coordination entre équipes internes et prestataires externalisés", "coordination between internal teams and outsourced providers"),
          t("étude de besoins spécifiques non listés dans les rubriques précédentes", "assessment of specific needs not covered above"),
        ]}
      />

    </main>
  );
}


