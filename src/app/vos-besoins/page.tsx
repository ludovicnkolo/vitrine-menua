"use client";
import Link from "next/link";
import { ChevronDown, BarChart2, PieChart, ShieldCheck, FileSpreadsheet, Building2, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/vos_besoins_hero.png"
            alt="Vos Besoins"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#223930] from-20% via-[#223930]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Expertises", "Expertise")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Vos besoins", "Your needs")}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  {t(
                    "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions",
                    "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all"
                  )} <span className="text-[#E0D6C8] italic" style={{ fontFamily: "var(--font-playfair)" }}>back et middle office.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROWS CONTENT ── */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-20 bg-[#FDFDFD]">
        
        {/* INTRODUCTION */}
        <div className="max-w-4xl mb-12">
          <p className="text-[#223930] text-[1.05rem] font-medium leading-[1.6]">
            {t(
              "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
              "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
            )}
          </p>
        </div>

        <div className="flex flex-col">
          
          {/* FINANCE & REPORTING */}
          <div id="finance-reporting" className="bg-[#FDFDFD] border-b border-[#E0D6C8]/60 py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <BarChart2 className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Finance & Reporting", "Finance & Reporting")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.", "Production, structuring and reliability of financial reporting intended for performance management, activity monitoring and decision support.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("Reporting financier", "Financial reporting")}</li>
                <li>{t("KPI | Dashboard", "KPI | Dashboard")}</li>
                <li>{t("Analyse de performance", "Performance analysis")}</li>
                <li>{t("Support direction financière", "Financial direction support")}</li>
                <li>{t("Consolidation de donnée", "Data consolidation")}</li>
                <li>{t("Analyse financière", "Financial analysis")}</li>
                <li>{t("Consolidation des données", "Consolidation of data")}</li>
                <li>{t("Préparation de reportings pour direction financière", "Preparation of reporting for financial direction")}</li>
                <li>{t("Suivi d'activité", "Activity tracking")}</li>
                <li>{t("Reporting mensuel / trimestriel", "Monthly / quarterly reporting")}</li>
                <li>{t("Reporting de trésorerie", "Treasury reporting")}</li>
                <li>{t("Reporting de rentabilité", "Profitability reporting")}</li>
                <li>{t("Suivi des indicateurs", "Indicator tracking")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* CONTRÔLE DE GESTION */}
          <div id="controle-de-gestion" className="bg-[#FDFDFD] border-b border-[#E0D6C8]/60 py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <PieChart className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Contrôle de gestion", "Management control")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.", "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("Suivi budgétaire", "Budget tracking")}</li>
                <li>{t("Analyse des écarts entre réalisé, budget et prévisionnel", "Analysis of variances between actual, budget and forecast")}</li>
                <li>{t("Tableaux de bord", "Dashboards")}</li>
                <li>{t("Pilotage de performance", "Performance management")}</li>
                <li>{t("Suivi des coûts, charges et marges", "Cost, charge and margin tracking")}</li>
                <li>{t("Analyse de rentabilité", "Profitability analysis")}</li>
                <li>{t("Suivi des indicateurs opérationnels", "Operational indicator tracking")}</li>
                <li>{t("Préparation de reportings de gestion", "Preparation of management reporting")}</li>
                <li>{t("Suivi du chiffre d'affaires et des objectifs", "Turnover and objective tracking")}</li>
                <li>{t("Mise à jour de fichiers de pilotage", "Update of management files")}</li>
                <li>{t("Consolidation des données de gestion", "Consolidation of management data")}</li>
                <li>{t("Support aux directions financières et responsables opérationnels", "Support to financial directions and operational managers")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* RISQUES & CONFORMITÉ */}
          <div id="risques-conformite" className="bg-[#FDFDFD] border-b border-[#E0D6C8]/60 py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Risques & conformité", "Risk & compliance")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.", "Operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("KYC", "KYC")}</li>
                <li>{t("LCB-FT", "AML-CFT")}</li>
                <li>{t("AML", "AML")}</li>
                <li>{t("Contrôle documentaire", "Documentary control")}</li>
                <li>{t("Analyse et complétude des dossiers clients", "Analysis and completeness of client files")}</li>
                <li>{t("Vérification des pièces justificatives", "Verification of supporting documents")}</li>
                <li>{t("Entrée en relation client", "Client onboarding")}</li>
                <li>{t("Revue périodique des dossiers", "Periodic file review")}</li>
                <li>{t("Remédiation KYC", "KYC remediation")}</li>
                <li>{t("Traitement des alertes de conformité", "Compliance alert processing")}</li>
                <li>{t("Analyse des mouvements inhabituels", "Analysis of unusual movements")}</li>
                <li>{t("Support aux équipes risques", "Support for risk teams")}</li>
                <li>{t("Support aux équipes conformité", "Support for compliance teams")}</li>
                <li>{t("Suivi des procédures internes", "Monitoring of internal procedures")}</li>
                <li>{t("Préparation de dossiers pour validation par les équipes habilitées", "Preparation of files for validation by authorized teams")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* SUPPORT COMPTABLE & DATA */}
          <div id="support-comptable-data" className="bg-[#FDFDFD] border-b border-[#E0D6C8]/60 py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Support comptable & data", "Accounting & data support")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.", "Operational support to accounting, administrative and data teams in processing, making reliable and structuring information necessary for accounting production and reporting.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("Saisie comptable", "Accounting entry")}</li>
                <li>{t("Rapprochements bancaires", "Bank reconciliations")}</li>
                <li>{t("Lettrage des comptes", "Account lettering")}</li>
                <li>{t("Contrôle et classement des pièces comptables", "Control and filing of accounting documents")}</li>
                <li>{t("Préparation des déclarations de TVA", "Preparation of VAT returns")}</li>
                <li>{t("Préparation des éléments comptables pour révision", "Preparation of accounting elements for review")}</li>
                <li>{t("Suivi des factures clients et fournisseurs", "Tracking of customer and supplier invoices")}</li>
                <li>{t("Relances administratives liées aux pièces manquantes", "Administrative reminders for missing documents")}</li>
                <li>{t("Data cleaning", "Data cleaning")}</li>
                <li>{t("Structuration et mise à jour de bases de données", "Structuring and updating databases")}</li>
                <li>{t("Contrôle de cohérence des données", "Data consistency control")}</li>
                <li>{t("Préparation de fichiers de reporting", "Preparation of reporting files")}</li>
                <li>{t("Consolidation de données comptables et opérationnelles", "Consolidation of accounting and operational data")}</li>
                <li>{t("Archivage et organisation documentaire", "Archiving and documentary organization")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* GESTION DE PATRIMOINE */}
          <div id="gestion-patrimoine" className="bg-[#FDFDFD] border-b border-[#E0D6C8]/60 py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <Building2 className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Gestion de patrimoine & support CGP", "Wealth management & IFA support")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.", "Operational support to wealth management firms, family offices and wealth structures in the processing, preparation and administrative follow-up of client files.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("Préparation des dossiers d'entrée en relation", "Preparation of onboarding files")}</li>
                <li>{t("Collecte et contrôle des pièces justificatives", "Collection and control of supporting documents")}</li>
                <li>{t("Contrôle de complétude des dossiers clients", "Completeness check of client files")}</li>
                <li>{t("Mise à jour des informations clients", "Update of client information")}</li>
                <li>{t("Préparation et pré remplissage de formulaires", "Preparation and pre-filling of forms")}</li>
                <li>{t("Support administratif aux souscriptions", "Administrative support for subscriptions")}</li>
                <li>{t("Support aux arbitrages", "Support for arbitrations")}</li>
                <li>{t("Support aux rachats partiels ou totaux", "Support for partial or total redemptions")}</li>
                <li>{t("Suivi des demandes clients", "Follow-up of client requests")}</li>
                <li>{t("Organisation et archivage documentaire", "Organization and document archiving")}</li>
                <li>{t("Mise à jour des bases clients", "Update of client databases")}</li>
                <li>{t("Préparation de dossiers pour validation par les conseillers habilités", "Preparation of files for validation by authorized advisors")}</li>
                <li>{t("Suivi des opérations patrimoniales dans le respect des procédures internes", "Follow-up of wealth operations in compliance with internal procedures")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* AUTRES BESOINS OPÉRATIONNELS */}
          <div id="autres-besoins" className="bg-[#FDFDFD] py-10 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 transition-colors hover:bg-white border-b border-[#E0D6C8]/60">
            <div className="flex flex-col lg:w-[40%]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
                  <MoreHorizontal className="text-white" size={26} strokeWidth={1.5} />
                </div>
                <h2 className="text-[#223930] text-[1.15rem] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("Autres besoins opérationnels", "Other operational needs")}
                </h2>
              </div>
              <p className="text-[#223930] text-[0.95rem] lg:pl-[5.5rem] font-medium leading-relaxed">
                {t("Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.", "Handling of occasional, transversal or specific operational needs not exclusively related to a financial, accounting, wealth, compliance or data function.")}
              </p>
            </div>
            <div className="lg:w-[40%] lg:pl-10">
              <ul className="list-disc pl-5 text-[0.85rem] text-[#223930] space-y-2.5 font-medium marker:text-[#223930]">
                <li>{t("Missions ponctuelles de renfort opérationnel", "Occasional operational reinforcement missions")}</li>
                <li>{t("Support administratif financier", "Financial administrative support")}</li>
                <li>{t("Traitement de dossiers en volume", "Volume processing of files")}</li>
                <li>{t("Classement, archivage et organisation documentaire", "Filing, archiving and documentary organization")}</li>
                <li>{t("Préparation et mise à jour de fichiers de suivi", "Preparation and update of tracking files")}</li>
                <li>{t("Support à la gestion d'opérations transverses", "Support for the management of transversal operations")}</li>
                <li>{t("Assistance à la formalisation de procédures internes", "Assistance in the formalization of internal procedures")}</li>
                <li>{t("Aide à la structuration de process opérationnels", "Assistance in structuring operational processes")}</li>
                <li>{t("Préparation de documents administratifs", "Preparation of administrative documents")}</li>
                <li>{t("Suivi de demandes internes ou clients", "Follow-up of internal or client requests")}</li>
                <li>{t("Support en période de surcharge d'activité", "Support during periods of activity overload")}</li>
                <li>{t("Remplacement ou appui temporaire d'équipe", "Replacement or temporary team support")}</li>
                <li>{t("Coordination entre équipes internes et prestataires externalisés", "Coordination between internal teams and external providers")}</li>
                <li>{t("Étude de besoins spécifiques non listés", "Study of specific unlisted needs")}</li>
              </ul>
            </div>
            <div className="lg:w-[20%] flex lg:justify-end w-full mt-6 lg:mt-0">
              <Link href="#" className="flex items-center gap-2 text-[#223930] font-bold text-[0.85rem] uppercase tracking-wide group">
                {t("En savoir plus", "Learn more")} 
                <ChevronDown size={18} className="text-[#d5a864] -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
