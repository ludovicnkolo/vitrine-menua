"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight, ChevronRight } from "lucide-react";
import BulletList from "@/components/BulletList";

/** Section claire : image à gauche ou droite + card de liste */
const NeedCardSection = ({ id, imgSrc, imgAlt, imgFallback, title, intro, items, reversed = false, bgClass = "bg-[#f5f7fa]", cardBg = "bg-white" }: any) => (
  <section id={id} className={`relative w-full ${bgClass} pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20`}>
    <div className={`laplace-container max-w-6xl mx-auto flex flex-col${reversed ? "-reverse" : ""} lg:flex-row${reversed ? "-reverse" : ""} items-center gap-12 lg:gap-16`}>
      <div className="hidden lg:block w-full lg:w-5/12 h-[400px] lg:h-[550px] shadow-xl">
        <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
      </div>
      <div className={`w-full lg:w-7/12 ${cardBg} p-10 lg:p-14 shadow-sm border border-[#e8e1d7] border-t-4 border-t-[#141824]`}>
        <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6">{title}</h3>
        {/* Mobile Image */}
        <div className={`block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden`}>
          <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" onError={(e: any) => { e.currentTarget.src = imgFallback; }} />
        </div>
        <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">{intro}</p>
        <h4 className="text-center text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{items.label}</h4>
        <BulletList items={items.list} />
      </div>

    </div>
  </section>
);

/** Section sombre asymétrique : texte narratif + card de liste */
const DarkNeedSection = ({ id, bgClass, topDecoClass, titleDecoClass, title, intro, disclaimer, listLabel, listItems, borderClass }: any) => (
  <section id={id} className={`relative w-full ${bgClass} pt-28 md:pt-[14.25rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden`}>
    {topDecoClass && <div className={topDecoClass} />}
    <div className="laplace-container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
      <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-16 lg:-translate-y-36">
        <div className={`w-16 h-[3px] mb-8 ${titleDecoClass}`} />
        <h3 className={`${bgClass.includes("bg-[#141824]") ? "text-white" : "text-[#141824]"} font-bold text-[2rem] lg:text-[2.2rem] leading-tight mb-8`}>
          {title}
        </h3>
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
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/besoins-hero.webp" 
            alt="Hero Vos Besoins" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Vos besoins", "Your Needs")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-8">
              {t(
                "Un appui opérationnel structuré pour renforcer vos équipes, sécuriser vos traitements et maintenir la continuité de vos activités.",
                "Structured operational support to strengthen your teams, secure your processes and maintain the continuity of your activities."
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

      {/* ── 3.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[11.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container relative z-10">
          <div className="absolute -top-8 md:-top-[8rem] left-6 md:left-12 lg:left-0 z-50">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Vos besoins", "Your needs")}</span>
            </p>
          </div>

          <div className="px-6 py-10 lg:px-16 lg:pt-12 lg:pb-14 lg:pr-[38%] relative z-30 lg:z-10 lg:mt-0">
            <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Notre Intervention", "Our Intervention")}
            </h2>
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 z-20 relative shadow-md">
              <img src="/img/besoins-intro.webp" alt="Vos besoins" className="w-full h-full object-cover object-center" onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} />
            </div>
            <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING intervient en appui des équipes financières, comptables, conformité, data, patrimoniales et réglementées sur les fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "MENUA CONSULTING provides support to financial, accounting, compliance, data, wealth and regulated teams on back and middle office functions requiring rigor, continuity and operational reliability."
              ))}
            </p>
            <p className="text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
              {t(
                "Nos interventions s'adaptent aux besoins ponctuels, récurrents ou volumineux : traitement de dossiers, contrôle documentaire, reporting, suivi opérationnel, mise à jour de données, préparation de livrables ou renfort temporaire d'équipes.",
                "Our interventions adapt to specific, recurring or high-volume needs: file processing, documentary control, reporting, operational monitoring, data updating, preparation of deliverables or temporary team reinforcement."
              )}
            </p>
            <div className="mt-8">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                {t("Présenter votre besoin", "Submit your need")} 
                <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={18} className="-ml-2" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -top-24 right-0 w-[36%] h-[75%] z-20">
            <img src="/img/besoins-intro.webp" alt="Vos besoins" className="w-full h-full object-cover shadow-xl" onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} />
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
          "MENUA CONSULTING supports financial teams in the production, structuring and reliability of reports intended for activity management, performance monitoring and decision-making support."
        ))}
        items={{
          label: t("Besoins couverts :", "Needs covered:"),
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
          "MENUA CONSULTING provides operational support to management control teams to strengthen budget monitoring, variance analysis and performance management. The objective is to help organizations better monitor their costs, margins, objectives and indicators, based on structured and reliable data."
        ))}
        items={{
          label: t("Besoins couverts :", "Needs covered:"),
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
          "MENUA CONSULTING provides operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable requirements."
        ))}
        disclaimer={formatBrand(t(
          "MENUA CONSULTING intervient en support des équipes habilitées du client. Les validations réglementaires, arbitrages et décisions finales restent de la responsabilité du client ou de ses professionnels autorisés.",
          "MENUA CONSULTING intervenes in support of the client's authorized teams. Regulatory validations, arbitrations and final decisions remain the responsibility of the client or its authorized professionals."
        ))}
        listLabel={t("Besoins couverts :", "Needs covered:")}
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
          "MENUA CONSULTING provides operational support to accounting, administrative and data teams in the processing, reliability, classification and structuring of information necessary for accounting, administrative and operational monitoring. MENUA CONSULTING does not substitute for a chartered accountant when their intervention is required. The prepared work remains subject to the controls and validations of the client or their chartered accountant."
        ))}
        items={{
          label: t("Besoins couverts :", "Needs covered:"),
          list: [
            t("collecte, classement et contrôle des pièces comptables", "collection, classification and control of accounting documents"),
            t("rapprochements bancaires", "bank reconciliations"),
            t("lettrage des comptes", "lettering of accounts"),
            t("suivi des factures clients et fournisseurs", "monitoring of client and supplier invoices"),
            t("relances administratives liées aux pièces manquantes", "administrative reminders linked to missing documents"),
            t("déclarations de TVA, sous supervision du client", "VAT returns, under client supervision"),
            t("préparation des éléments comptables pour révision", "preparation of accounting elements for review"),
            t("data cleaning", "data cleaning"),
            t("structuration et mise à jour de bases de données", "structuring and updating of databases"),
            t("contrôle de cohérence des données", "data consistency check"),
            t("préparation de fichiers de reporting", "preparation of reporting files"),
            t("consolidation de données comptables et opérationnelles", "consolidation of accounting and operational data"),
            t("archivage et organisation documentaire", "archiving and documentary organization"),
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
        title={t("Support aux cabinets de gestion de patrimoine / CGP", "Support to wealth management firms / CGP")}
        intro={formatBrand(t(
          "MENUA CONSULTING accompagne les cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients. Les conseils, recommandations, arbitrages et validations demeurent sous la responsabilité des professionnels habilités du client. MENUA CONSULTING intervient uniquement sur la préparation et le suivi opérationnels des dossiers.",
          "MENUA CONSULTING supports wealth management firms, family offices and wealth structures in the processing, preparation and administrative monitoring of client files. Advice, recommendations, arbitrations and validations remain under the responsibility of the client's authorized professionals. MENUA CONSULTING intervenes solely on the operational preparation and monitoring of files."
        ))}
        items={{
          label: t("Besoins couverts :", "Needs covered:"),
          list: [
            t("préparation des dossiers d'entrée en relation ;", "preparation of onboarding files;"),
            t("collecte et contrôle des pièces justificatives ;", "collection and control of supporting documents;"),
            t("contrôle de complétude des dossiers clients ;", "check of completeness of client files;"),
            t("mise à jour des informations clients ;", "updating of client information;"),
            t("support administratif aux souscriptions ;", "administrative support for subscriptions;"),
            t("préparation administrative des demandes d'arbitrage ;", "administrative preparation of arbitration requests;"),
            t("préparation administrative des demandes de rachat partiel ou total ;", "administrative preparation of partial or total redemption requests;"),
            t("suivi des demandes clients ;", "monitoring of client requests;"),
            t("organisation et archivage documentaire ;", "documentary organization and archiving;"),
            t("mise à jour des bases clients ;", "updating of client databases;"),
            t("suivi des opérations patrimoniales dans le respect des procédures internes.", "monitoring of wealth operations in compliance with internal procedures.")
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
          "MENUA CONSULTING can also intervene on ad hoc, transversal or specific operational needs not exclusively related to a financial, accounting, compliance, wealth or data function. This flexibility makes it possible to support organizations during periods of overload, transition, reorganization or temporary need for reinforcement."
        ))}
        listLabel={t("Besoins couverts :", "Needs covered:")}
        listItems={[
          t("missions ponctuelles de renfort opérationnel", "ad hoc operational reinforcement missions"),
          t("support administratif financier", "financial administrative support"),
          t("traitement de dossiers en volume", "volume file processing"),
          t("classement, archivage et organisation documentaire", "classification, archiving and documentary organization"),
          t("préparation et mise à jour de fichiers de suivi", "preparation and updating of tracking files"),
          t("support à la gestion d'opérations transverses", "support to the management of transversal operations"),
          t("aide à la formalisation de procédures internes", "help with the formalization of internal procedures"),
          t("aide à la structuration de process opérationnels", "help with the structuring of operational processes"),
          t("suivi de demandes internes ou clients", "monitoring of internal or client requests"),
          t("support en période de surcharge d'activité", "support during periods of overload"),
          t("remplacement ou appui temporaire d'équipe", "replacement or temporary team support"),
          t("coordination entre équipes internes et prestataires externalisés", "coordination between internal teams and outsourced providers"),
          t("étude de besoins spécifiques non listés dans les rubriques précédentes", "study of specific needs not listed in the previous sections"),
        ]}
      />

    </main>
  );
}


