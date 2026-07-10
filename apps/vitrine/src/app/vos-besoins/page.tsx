"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { BarChart2, CheckCircle, ShieldCheck, Database, Building2, TrendingUp, ArrowRight, MoreHorizontal, ChevronRight } from "lucide-react";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  const needs = [
    {
      id: "finance-reporting",
      title: t("FINANCE ET REPORTING", "FINANCE AND REPORTING"),
      desc: t("Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.", "Production, structuring and reliability of financial reporting intended for performance management..."),
      icon: BarChart2,
      bullets: [
        { fr: "Reporting financier", en: "Financial reporting" },
        { fr: "KPI", en: "KPI" },
        { fr: "Tableaux de bord", en: "Dashboards" },
        { fr: "Analyse de performance", en: "Performance analysis" },
        { fr: "Analyse financière", en: "Financial analysis" },
        { fr: "Consolidation des données", en: "Data consolidation" },
        { fr: "Préparation de reportings pour direction financière", en: "Preparation of reporting for financial management" },
        { fr: "Suivi d'activité", en: "Activity tracking" },
        { fr: "Reporting mensuel / trimestriel", en: "Monthly / quarterly reporting" },
        { fr: "Reporting de trésorerie", en: "Cash flow reporting" },
        { fr: "Reporting de rentabilité", en: "Profitability reporting" },
        { fr: "Suivi des indicateurs", en: "Indicator tracking" }
      ]
    },
    {
      id: "controle-de-gestion",
      title: t("CONTRÔLE DE GESTION", "MANAGEMENT CONTROL"),
      desc: t("Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.", "Operational support for budget monitoring, variance analysis and performance management to help organizations..."),
      icon: CheckCircle,
      bullets: [
        { fr: "Suivi budgétaire", en: "Budget monitoring" },
        { fr: "Analyse des écarts entre réalisé, budget et prévisionnel", en: "Variance analysis between actual, budget and forecast" },
        { fr: "Tableaux de bord de gestion", en: "Management dashboards" },
        { fr: "Pilotage de la performance", en: "Performance management" },
        { fr: "Suivi des coûts, charges et marges", en: "Cost, expense and margin tracking" },
        { fr: "Analyse de rentabilité", en: "Profitability analysis" },
        { fr: "Suivi des indicateurs opérationnels", en: "Operational indicator tracking" },
        { fr: "Préparation de reportings de gestion", en: "Preparation of management reports" },
        { fr: "Suivi du chiffre d'affaires et des objectifs", en: "Tracking of turnover and objectives" },
        { fr: "Mise à jour de fichiers de pilotage", en: "Updating of management files" },
        { fr: "Consolidation des données de gestion", en: "Consolidation of management data" },
        { fr: "Support aux directions financières et responsables opérationnels", en: "Support for financial departments and operational managers" }
      ]
    },
    {
      id: "risques-conformite",
      title: t("RISQUES ET CONFORMITÉ", "RISKS AND COMPLIANCE"),
      desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.", "Operational support for risk and compliance teams in the processing, control and reliability of sensitive files..."),
      icon: ShieldCheck,
      bullets: [
        { fr: "LCB-FT", en: "AML-CFT" },
        { fr: "AML", en: "AML" },
        { fr: "Contrôle documentaire", en: "Documentary control" },
        { fr: "Analyse et complétude des dossiers clients", en: "Analysis and completeness of client files" },
        { fr: "Vérification des pièces justificatives", en: "Verification of supporting documents" },
        { fr: "Entrée en relation client", en: "Client onboarding" },
        { fr: "Revue périodique des dossiers", en: "Periodic review of files" },
        { fr: "Remédiation KYC", en: "KYC remediation" },
        { fr: "Traitement des alertes de conformité", en: "Processing of compliance alerts" },
        { fr: "Analyse des mouvements inhabituels", en: "Analysis of unusual movements" },
        { fr: "Support aux équipes risques", en: "Support for risk teams" },
        { fr: "Support aux équipes conformité", en: "Support for compliance teams" },
        { fr: "Suivi des procédures internes", en: "Monitoring of internal procedures" },
        { fr: "Préparation de dossiers pour validation par les équipes habilitées", en: "Preparation of files for validation by authorized teams" }
      ]
    },
    {
      id: "support-comptable",
      title: t("SUPPORT COMPTABLE ET DATA", "ACCOUNTING AND DATA SUPPORT"),
      desc: t("Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.", "Operational support for accounting, administrative and data teams in the processing, reliability and structuring..."),
      icon: Database,
      bullets: [
        { fr: "Saisie comptable", en: "Accounting entry" },
        { fr: "Rapprochements bancaires", en: "Bank reconciliations" },
        { fr: "Lettrage des comptes", en: "Account matching" },
        { fr: "Contrôle et classement des pièces comptables", en: "Control and filing of accounting documents" },
        { fr: "Préparation des déclarations de TVA", en: "Preparation of VAT returns" },
        { fr: "Préparation des éléments comptables pour révision", en: "Preparation of accounting elements for review" },
        { fr: "Suivi des factures clients et fournisseurs", en: "Monitoring of customer and supplier invoices" },
        { fr: "Relances administratives liées aux pièces manquantes", en: "Administrative reminders for missing documents" },
        { fr: "Data cleaning", en: "Data cleaning" },
        { fr: "Structuration et mise à jour de bases de données", en: "Structuring and updating of databases" },
        { fr: "Contrôle de cohérence des données", en: "Data consistency check" },
        { fr: "Préparation de fichiers de reporting", en: "Preparation of reporting files" },
        { fr: "Consolidation de données comptables et opérationnelles", en: "Consolidation of accounting and operational data" },
        { fr: "Archivage et organisation documentaire", en: "Archiving and documentary organization" }
      ]
    },
    {
      id: "gestion-patrimoine",
      title: t("GESTION DE PATRIMOINE ET SUPPORT CGP", "WEALTH MANAGEMENT AND CGP SUPPORT"),
      desc: t("Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.", "Operational support for wealth management firms, family offices and wealth structures in the administrative monitoring..."),
      icon: Building2,
      bullets: [
        { fr: "Préparation des dossiers d'entrée en relation", en: "Preparation of onboarding files" },
        { fr: "Collecte et contrôle des pièces justificatives", en: "Collection and control of supporting documents" },
        { fr: "Contrôle de complétude des dossiers clients", en: "Completeness check of client files" },
        { fr: "Mise à jour des informations clients", en: "Updating of client information" },
        { fr: "Préparation et préremplissage de formulaires", en: "Preparation and pre-filling of forms" },
        { fr: "Support administratif aux souscriptions", en: "Administrative support for subscriptions" },
        { fr: "Support aux arbitrages", en: "Support for arbitrations" },
        { fr: "Support aux rachats partiels ou totaux", en: "Support for partial or total surrenders" },
        { fr: "Suivi des demandes clients", en: "Monitoring of client requests" },
        { fr: "Organisation et archivage documentaire", en: "Documentary organization and archiving" },
        { fr: "Mise à jour des bases clients", en: "Updating of client databases" },
        { fr: "Préparation de dossiers pour validation par les conseillers habilités", en: "Preparation of files for validation by authorized advisors" },
        { fr: "Suivi des opérations patrimoniales dans le respect des procédures internes", en: "Monitoring of wealth operations in compliance with internal procedures" }
      ]
    },
    {
      id: "autres-besoins",
      title: t("AUTRES BESOINS OPÉRATIONNELS", "OTHER OPERATIONAL NEEDS"),
      desc: t("Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.", "Management of specific, cross-functional or one-off operational needs that do not relate exclusively..."),
      icon: MoreHorizontal,
      bullets: [
        { fr: "Missions ponctuelles de renfort opérationnel", en: "Ad-hoc operational reinforcement missions" },
        { fr: "Support administratif financier", en: "Financial administrative support" },
        { fr: "Traitement de dossiers en volume", en: "Volume file processing" },
        { fr: "Classement, archivage et organisation documentaire", en: "Filing, archiving and documentary organization" },
        { fr: "Préparation et mise à jour de fichiers de suivi", en: "Preparation and updating of tracking files" },
        { fr: "Support à la gestion d'opérations transverses", en: "Support for the management of cross-functional operations" },
        { fr: "Assistance à la formalisation de procédures internes", en: "Assistance with the formalization of internal procedures" },
        { fr: "Aide à la structuration de process opérationnels", en: "Assistance with the structuring of operational processes" },
        { fr: "Préparation de documents administratifs", en: "Preparation of administrative documents" },
        { fr: "Suivi de demandes internes ou clients", en: "Monitoring of internal or client requests" },
        { fr: "Support en période de surcharge d'activité", en: "Support during periods of workload peak" },
        { fr: "Remplacement ou appui temporaire d'équipe", en: "Temporary replacement or team support" },
        { fr: "Coordination entre équipes internes et prestataires externalisés", en: "Coordination between internal teams and outsourced providers" },
        { fr: "Étude de besoins spécifiques non listés dans les rubriques précédentes", en: "Study of specific needs not listed in previous sections" }
      ]
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 3.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/besoins-hero.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Vos besoins", "Your needs")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── GRID LAYOUT (Nos expertises singulières style) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative z-10">
          {/* Absolute background drops down on mobile so image overlaps it */}
          <div className="absolute left-0 right-0 bottom-0 top-[180px] md:top-0 bg-[#f5f7fa] rounded-sm shadow-sm -z-10 mt-8" />
          
          <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-10 md:pb-10 lg:px-16 pt-6 lg:pt-8 lg:pb-16 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-start mb-12 px-4 lg:px-0 gap-8 md:gap-24 lg:gap-32">
               <div className="text-left w-full md:w-auto flex-shrink-0">
                 <div className="w-16 h-[3px] bg-[#141824] mb-4" />
                 <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase tracking-wider md:mb-0">
                    {t("Nos domaines d'intervention", "Our areas of intervention")}
                 </h2>
               </div>
               <div className="w-full md:w-auto flex justify-start mt-4 md:mt-0 md:-mt-16 lg:-mt-20">
                 <img 
                   src="/img/vosbensoin_2.jpg" 
                   alt="Domaines d'intervention" 
                   className="w-[85%] sm:w-80 md:w-56 h-auto object-cover rounded-sm shadow-md" 
                 />
               </div>
            </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {needs.map((need, idx) => (
              <a key={idx} href={`#${need.id}`} className="bg-white border border-gray-200 p-10 flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group hover:bg-[#141824] hover:border-[#141824] hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer">
                 <h3 className="text-[#141824] group-hover:text-white text-[1.2rem] font-semibold mb-4 min-h-[3rem] transition-colors duration-500">
                   {need.title}
                 </h3>
                 <p className="text-[#6e7891] group-hover:text-white/80 font-light text-[0.95rem] leading-relaxed mb-8 flex-grow transition-colors duration-500">
                   {need.desc}
                 </p>
                 <div className="mt-auto inline-flex items-center gap-2 text-[#141824] group-hover:text-white font-bold uppercase tracking-wider text-[0.75rem] group-hover:gap-3 transition-all duration-300">
                   {t("DÉCOUVRIR", "DISCOVER")} <ArrowRight size={14} />
                 </div>
              </a>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── DETAILED SECTIONS BELOW ── */}
      <div className="bg-[#f5f7fa] py-20">
        <div className="laplace-container">
          <div className="text-center mb-16">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase tracking-wider">{t("Détail de nos interventions", "Details of our interventions")}</h2>
            </div>
          </div>
          
          <div className="space-y-12 max-w-5xl mx-auto">
            {needs.map((need, idx) => (
              <div key={idx} id={need.id} className="bg-white shadow-xl flex flex-col lg:flex-row scroll-mt-32 overflow-hidden mb-12 border border-gray-100">
                <div className="lg:w-5/12 bg-[#e8e1d7] p-10 md:p-16 flex flex-col justify-center">
                  <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                  <h3 className="text-[2rem] text-[#141824] font-semibold mb-6">
                    {need.title}
                  </h3>
                </div>
                <div className="lg:w-7/12 p-10 md:p-16 bg-white flex flex-col justify-center">
                  <p className="font-bold text-[#141824] mb-6 text-[1.1rem] uppercase tracking-wider text-sm">
                    {t("Périmètre d'action", "Scope of action")}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#31374a] text-[1.05rem] font-light">
                    {need.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                        <span>{t(bullet.fr, bullet.en)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
