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
    <section id={id} className={`relative w-full ${bgClass} py-16 lg:py-20 scroll-mt-20`}>
      <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:items-center`}>

          {/* Image */}
          <div className={`hidden lg:flex w-5/12 shrink-0 z-30 relative items-center ${isReversed ? 'justify-start' : 'justify-end'}`}>
            <div className="w-[85%] lg:h-[360px] relative overflow-hidden shadow-xl">
              <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover object-center" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
            </div>
          </div>

          {/* Text Box */}
          <div className={`w-full lg:w-8/12 ${isReversed ? 'lg:-mr-16' : 'lg:-ml-16'} flex items-center z-10 ${containerClass}`}>
            <div className={`w-full ${cardBg} shadow-xl px-6 portrait:sm:px-10 py-10 lg:py-14 ${isReversed ? 'lg:pl-14 lg:pr-28' : 'lg:pr-14 lg:pl-28'}`}>
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">{title}</h2>

              {/* Mobile Image */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover object-center" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
              </div>

              <div className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8 space-y-4">{intro}</div>
              <h4 className="text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{items.label}</h4>
              <BulletList items={items.list} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/** Section sombre asymétrique : texte narratif + card de liste */
const DarkNeedSection = ({ id, bgClass, topDecoClass, titleDecoClass, title, intro, disclaimer, listLabel, listItems, borderClass }: any) => (
  <section id={id} className={`relative w-full ${bgClass} py-16 lg:py-20 scroll-mt-20 overflow-hidden`}>
    {topDecoClass && <div className={topDecoClass} />}
    <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
      <div className="w-full lg:w-5/12 flex flex-col justify-center">
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
  const { t, lang } = useLanguage();
  const isEN = lang === 'EN';

  return (
    <main className="flex flex-col w-full min-h-screen">

      {/* ── 3.1 HERO ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/besoins-hero.webp"
            alt={t("Hero Vos Besoins", "Hero Your Needs")}
            className="w-full h-full object-cover object-[center_35%]"
            onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }}
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-12 landscape:ml-6 landscape:lg:-ml-4">
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
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-left px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                <span className={`hidden xl:!inline ${!isEN ? 'sm:inline' : 'sm:hidden'}`}>
                  {t("Présenter votre besoin", "Tell us about your requirements")}
                </span>
                <span className={`flex flex-col items-start xl:!hidden ${!isEN ? 'sm:hidden' : 'sm:flex'}`}>
                  <span>{t("Présenter votre", "Tell us about your")}</span>
                  <span>{t("besoin", "requirements")}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white py-16 lg:py-20 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          <div className="w-full mb-8 md:mb-12">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Vos besoins", "Your needs")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row-reverse lg:items-center">

            {/* Right Image */}
            <div className="hidden lg:flex w-5/12 shrink-0 z-30 relative items-center justify-start">
              <div className="w-[85%] lg:h-[360px] relative overflow-hidden shadow-xl">
                <img
                  src="/img/besoins-intro.webp"
                  alt={t("Vos besoins", "Your Needs")}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                />
              </div>
            </div>

            {/* Left Box */}
            <div className="w-full lg:w-8/12 lg:-mr-16 flex items-center z-10">
              <div className="w-full bg-[#f5f7fa] shadow-xl px-6 portrait:sm:px-10 lg:pl-14 lg:pr-28 py-10 lg:py-14 border border-[#e8e1d7]">
                <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                  {t("Notre Intervention", "How we support you")}
                </h2>

                {/* Mobile Image */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                  <img src="/img/besoins-intro.webp" alt={t("Vos besoins", "Your Needs")} className="w-full h-full object-cover object-center" onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} />
                </div>

                <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-6">
                  {formatBrand(t(
                    "MENUA CONSULTING intervient en appui des équipes financières, comptables, conformité, data, patrimoniales et réglementées sur les fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                    "MENUA CONSULTING supports finance, accounting, compliance, data and wealth management teams, as well as teams operating in regulated environments, by providing the rigorous back and middle office support needed to ensure operational reliability and continuity."
                  ))}
                </p>
                <p className="text-[#6e7891] text-[1rem] font-light leading-relaxed mb-6">
                  {t(
                    "Nos interventions s'adaptent aux besoins ponctuels, récurrents ou volumineux : traitement de dossiers, contrôle documentaire, reporting, suivi opérationnel, mise à jour de données, préparation de livrables ou renfort temporaire d'équipes.",
                    "Our services are designed to meet one-off, recurring or high-volume requirements. This includes file processing, document review, reporting, operational monitoring, data updates, deliverable preparation and temporary team reinforcement."
                  )}
                </p>
                <div className="p-4 border-l-2 border-[#141824]/30 bg-[#141824]/5 mb-10">
                  <p className="text-[#141824] text-[0.95rem] font-medium leading-relaxed">
                    {t(
                      "Nos interventions couvrent l'analyse financière préparatoire, l'instruction technique de dossiers de crédit et le support aux opérations, la décision finale d'octroi ou d'investissement demeurant le monopole des établissements habilités.",
                      "Our interventions cover preparatory financial analysis, technical review of credit files and operational support, while the final credit or investment decision remains the exclusive responsibility of authorized institutions."
                    )}
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right">
                    <span className="max-w-[18ch] portrait:sm:max-w-[24ch] landscape:max-lg:max-w-[21ch] landscape:lg:max-w-[22ch] xl:max-w-none">{t("Présenter votre besoin", "Tell us about your requirements")}</span>
                    <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                    <ChevronRight size={18} className="-ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.3 FINANCE & REPORTING ── */}
      <NeedCardSection
        id="finance-reporting"
        imgSrc="/img/besoins-finance.webp"
        imgAlt={t("Finance & Reporting", "Finance & Reporting")}
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
        imgAlt={t("Contrôle de gestion", "Management control")}
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


      {/* ── ESPACE BLANC UNIVERSEL ── */}
      <div className="w-full h-16 lg:h-20 bg-white"></div>

      {/* ── 3.6 SUPPORT COMPTABLE & DATA ── */}
      <NeedCardSection
        id="support-comptable-data"
        imgSrc="/img/besoins-data.webp"
        imgAlt={t("Support comptable & Data", "Accounting & Data Support")}
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
        imgAlt={t("Support aux CGP", "Support for wealth management firms")}
        imgFallback="/img/intro-office.webp"
        title={t("Support aux cabinets de gestion de patrimoine / CGP", "Support for wealth management firms and financial advisers")}
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

      {/* ── 3.8 ASSURANCE ── */}
      <DarkNeedSection
        id="assurance-courtage"
        bgClass="bg-[#f5f7fa]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#eef2f6] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#141824]"
        borderClass="border border-[#e2e8f0]"
        title={t("ASSURANCE — BACK & MIDDLE OFFICE, GESTION CONTRACTUELLE, ANALYSE & PRESTATIONS", "INSURANCE — BACK & MIDDLE OFFICE, POLICY ADMINISTRATION, ANALYSIS, CLAIMS & BENEFITS SUPPORT")}
        intro={
          <>
            <p className="mb-4">
              {formatBrand(t(
                "Menua Consulting accompagne les assureurs, courtiers et équipes de gestion sur un large périmètre d’activités back et middle office liées aux contrats, prestations, sinistres, demandes clients et opérations de gestion. Les interventions peuvent porter aussi bien sur des actes courants que sur des dossiers nécessitant un niveau d’analyse ou de technicité particulier : analyse contractuelle, contrôle de cohérence, revue documentaire, instruction opérationnelle, préparation de dossiers, suivi et reporting.",
                "Menua Consulting supports insurers, brokers, third-party administrators and insurance operations teams across a broad range of back and middle office activities relating to policies, benefits, claims, customer requests and operational workflows. Our services can cover both routine processing and technically demanding files requiring contract analysis, consistency checks, document review, operational assessment, file preparation, monitoring and reporting."
              ))}
            </p>
            <p>
              {t(
                "MENUA intervient dans le cadre des procédures, règles de gestion, outils, habilitations et circuits de validation du client. Les équipes peuvent notamment analyser les documents contractuels et justificatifs, identifier les garanties, exclusions, franchises, plafonds, délais et pièces applicables, contrôler la complétude et la cohérence des dossiers et préparer les éléments nécessaires au traitement d’une demande ou à la réponse au client. Les décisions de souscription, de garantie, d’indemnisation, de conseil ou tout autre acte réglementé ou engageant restent sous la responsabilité du client ou des professionnels habilités.",
                "MENUA works within the client’s procedures, business rules, systems, authorisation framework and approval workflows. Our teams may review policy wording and supporting documentation, identify applicable cover, exclusions, deductibles, limits, deadlines and required documents, assess file completeness and consistency, and prepare the operational elements required to process a case or respond to a customer. Underwriting, coverage, claims settlement, advisory and other regulated or binding decisions remain the responsibility of the client or its authorised professionals."
              )}
            </p>
          </>
        }
        listLabel={t("Besoins couverts :", "Our support includes:")}
        listItems={[
          t("Gestion administrative des contrats et souscriptions : adhésions, avenants, attestations, renouvellements et modifications.", "Policy administration and servicing: applications, endorsements, certificates, renewals and amendments."),
          t("Analyse opérationnelle des contrats, notices, conditions générales et particulières.", "Operational review of policies, notices, general terms and specific terms and conditions."),
          t("Identification des garanties, exclusions, franchises, plafonds, délais et pièces nécessaires.", "Identification of cover, exclusions, deductibles, limits, deadlines and required documents."),
          t("Préparation de réponses clients à partir des documents et référentiels approuvés par le client.", "Preparation of customer responses based on client-approved documentation and reference materials."),
          t("Traitement des demandes clients, courriers, e-mails et opérations de gestion.", "Processing of customer requests, correspondence, emails and policy servicing operations."),
          t("Préparation et contrôle de complétude de dossiers de souscription avant validation du client.", "Preparation and completeness checks of underwriting files before client approval."),
          t("Ouverture et suivi administratif de dossiers de sinistre et de prestations.", "Opening and administrative follow-up of claims and benefit files."),
          t("Contrôle des justificatifs, complétude et cohérence documentaire.", "Supporting-document checks, completeness and documentary consistency."),
          t("Prévoyance : incapacité, invalidité, décès et prestations associées.", "Protection insurance: incapacity, disability, death and related benefits."),
          t("IARD : automobile, habitation, responsabilité et autres risques selon procédures du client.", "P&C insurance: motor, home, liability and other risks in line with the client’s procedures."),
          t("Coordination avec assureurs, courtiers, gestionnaires, experts et interlocuteurs opérationnels.", "Coordination with insurers, brokers, claims handlers, experts and operational stakeholders."),
          t("Suivi des délais, relances, cohérence des données contractuelles, traitement de volumes importants, tableaux de bord, reporting et contrôles qualité.", "Monitoring of deadlines, follow-ups, contractual data consistency, high-volume processing, dashboards, reporting and quality checks.")
        ]}
      />

      {/* ── 3.9 AUTRES BESOINS ── */}
      <DarkNeedSection
        id="autres-besoins"
        bgClass="bg-[#e8e1d7]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#e0d8cd] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#141824]"
        borderClass="border border-[#e8e1d7]"
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
          t("coordination entre équipes internes et interlocuteurs opérationnels", "coordination across internal teams and operational stakeholders"),
          t("étude de besoins spécifiques non listés dans les rubriques précédentes", "assessment of specific needs not covered above"),
        ]}
      />

    </main>
  );
}
