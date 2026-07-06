"use client";
import Link from "next/link";
import { BarChart2, PieChart, ShieldCheck, FileSpreadsheet, Building2, MoreHorizontal, ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/besoins.png"
            alt="Vos Besoins"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("Expertises", "Expertise")}</span>
                <span className="block mt-2">{t("Vos besoins", "Your needs").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}</span>
              </h1>
              <div className="mb-8 max-w-xl">
                <p className="p-1">
                  MENUA CONSULTING {t(
                    "intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions",
                    "supports financial, accounting, wealth, IT and regulated teams on all"
                  )}{" "}
                  back et middle office{" "}
                  {t(
                    "nécessitant rigueur, continuité et fiabilité opérationnelle.",
                    "requiring rigor, continuity and operational reliability."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 1. FINANCE & REPORTING ══ */}
      <section id="finance-reporting" className="mt-12 bg-[#e4dcf7] ">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent rounded-2xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            
            {/* Text left */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#122017]" />
                <h2 className="h2-surtitre text-[#122017]">
                  {t("Finance et Reporting", "Finance and Reporting")}
                </h2>
              </div>
              <div className="p-2 text-[#4A4E5A] mb-8 font-normal">
                <p>
                  {t(
                    "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
                    "Production, structuring and reliability of financial reporting intended for performance management, activity monitoring and decision support."
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  t("Reporting financier", "Financial reporting"),
                  t("KPI | Dashboard", "KPI | Dashboard"),
                  t("Analyse de performance", "Performance analysis"),
                  t("Support direction financière", "Financial direction support"),
                  t("Consolidation de donnée", "Data consolidation"),
                  t("Analyse financière", "Financial analysis"),
                  t("Consolidation des données", "Data consolidation"),
                  t("Préparation de reportings pour direction financière", "Preparation of reporting for financial direction"),
                  t("Suivi d'activité", "Activity tracking"),
                  t("Reporting mensuel / trimestriel", "Monthly / quarterly reporting"),
                  t("Reporting de trésorerie", "Treasury reporting"),
                  t("Reporting de rentabilité", "Profitability reporting"),
                  t("Suivi des indicateurs", "Indicator tracking"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-2" />
                    <h4 className="h4-titre text-[#122017]">{item}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Image right */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/finance.png"
                alt="Finance et Reporting"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* ══ 2. CONTRÔLE DE GESTION ══ */}
      <section id="controle-de-gestion" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-[#8e8478] w-full flex flex-col rounded-3xl shadow-lg border border-black/5">
          {/* Top Banner */}
          <div className="w-full border-b border-[#E0D6C8]/30">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                <img
                  src="/conGest.jpg"
                  alt="Contrôle de gestion"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
              <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center order-1 md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-white" />
                  <h2 className="h2-surtitre text-white">
                    {t("Contrôle de gestion", "Management Control")}
                  </h2>
                </div>
                <p className="text-white/90 text-[0.95rem] leading-[1.6]">
                  {t(
                    "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
                    "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="w-full py-12 px-8 lg:px-12">
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  t("Suivi budgétaire", "Budget tracking"),
                  t("Analyse des écarts entre réalisé, budget et prévisionnel", "Variance analysis between actual, budget and forecast"),
                  t("Tableaux de bord", "Dashboards"),
                  t("Pilotage de performance", "Performance management"),
                  t("Suivi des coûts, charges et marges", "Tracking of costs, expenses and margins"),
                  t("Analyse de rentabilité", "Profitability analysis"),
                  t("Suivi des indicateurs opérationnels", "Tracking of operational indicators"),
                  t("Préparation de reportings de gestion", "Preparation of management reporting"),
                  t("Suivi du chiffre d'affaires et des objectifs", "Tracking of turnover and objectives"),
                  t("Mise à jour de fichiers de pilotage", "Update of management files"),
                  t("Consolidation des données de gestion", "Consolidation of management data"),
                  t("Support aux directions financières et responsables opérationnels", "Support to financial directions and operational managers"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <svg className="w-4 h-4 text-[#D9B151] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <h4 className="h4-titre text-white">{item}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. RISQUES & CONFORMITÉ ══ */}
      <section id="risques-conformite" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-[#e4dcf7] w-full flex flex-col rounded-3xl shadow-lg border border-black/5">
          {/* Top Banner */}
          <div className="w-full border-b border-[#E0D6C8]/50">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-[#122017]" />
                  <h2 className="h2-surtitre text-[#122017]">
                    {t("Risques et Conformité", "Risk and Compliance")}
                  </h2>
                </div>
                <h3 className="h3-section text-[#122017] mb-4">
                  {t(
                    "Des processus fiabilisés au service de la conformité réglementaire.",
                    "Reliable processes serving regulatory compliance."
                  )}
                </h3>
                <p className="text-[#122017]/90 text-[0.95rem] leading-[1.6]">
                  {t(
                    "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
                    "Operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
                  )}
                </p>
              </div>
              {/* Right Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/risConfor.jpg"
                  alt="Risques et Conformité"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="w-full py-12 px-8 lg:px-12">
            <div className="w-full">
              <h3 className="text-[#8B6240] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                {t("Périmètre d'intervention", "Scope of intervention")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  "KYC",
                  "LCB-FT",
                  "AML",
                  t("Contrôle documentaire", "Documentary control"),
                  t("Analyse et complétude des dossiers clients", "Analysis and completeness of client files"),
                  t("Vérification des pièces justificatives", "Verification of supporting documents"),
                  t("Entrée en relation client", "Client onboarding"),
                  t("Revue périodique des dossiers", "Periodic review of files"),
                  t("Remédiation KYC", "KYC Remediation"),
                  t("Traitement des alertes de conformité", "Processing of compliance alerts"),
                  t("Analyse des mouvements inhabituels", "Analysis of unusual movements"),
                  t("Support aux équipes risques", "Support to risk teams"),
                  t("Support aux équipes conformité", "Support to compliance teams"),
                  t("Suivi des procédures internes", "Monitoring of internal procedures"),
                  t("Préparation de dossiers pour validation par les équipes habilitées", "Preparation of files for validation by authorized teams"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <h4 className="h4-titre text-[#122017]">{item}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. SUPPORT COMPTABLE & DATA ══ */}
      <section id="support-comptable-data" className="mt-12 bg-[#1A0E08] w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start gap-16">
          {/* Text */}
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-white" />
              <h2 className="h2-surtitre text-white">
                {t("Support Comptable et Data", "Accounting and Data Support")}
              </h2>
            </div>
            <p className="p-2 mb-8 max-w-3xl">
              {t(
                "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
                "Operational support to accounting, administrative and data teams in processing, making reliable and structuring information necessary for accounting production and reporting."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-10">
              {[
                t("Saisie comptable", "Accounting entry"),
                t("Rapprochements bancaires", "Bank reconciliations"),
                t("Lettrage des comptes", "Account lettering"),
                t("Contrôle et classement des pièces comptables", "Control and filing of accounting documents"),
                t("Préparation des déclarations de TVA", "Preparation of VAT returns"),
                t("Préparation des éléments comptables pour révision", "Preparation of accounting elements for review"),
                t("Suivi des factures clients et fournisseurs", "Tracking of client and supplier invoices"),
                t("Relances administratives liées aux pièces manquantes", "Administrative follow-ups linked to missing documents"),
                t("Data cleaning", "Data cleaning"),
                t("Structuration et mise à jour de bases de données", "Structuring and updating of databases"),
                t("Contrôle de cohérence des données", "Data consistency control"),
                t("Préparation de fichiers de reporting", "Preparation of reporting files"),
                t("Consolidation de données comptables et opérationnelles", "Consolidation of accounting and operational data"),
                t("Archivage et organisation documentaire", "Archiving and document organization"),
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center bg-white/10 border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all h-full">
                  <h4 className="h4-titre text-white">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. GESTION DE PATRIMOINE ══ */}
      <section id="gestion-patrimoine" className="mt-12 bg-white w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start gap-16">
          {/* Text */}
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-[#122017]" />
              <h2 className="h2-surtitre text-[#122017]">
                {t("Gestion de Patrimoine et CGP", "Wealth Management and IFA")}
              </h2>
            </div>
            <p className="p-2 text-[#122017]/90 mb-8 max-w-3xl">
              {t(
                "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
                "Operational support to wealth management firms, family offices and wealth structures in the processing, preparation and administrative follow-up of client files."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-10">
              {[
                t("Préparation des dossiers d'entrée en relation", "Preparation of onboarding files"),
                t("Collecte et contrôle des pièces justificatives", "Collection and control of supporting documents"),
                t("Contrôle de complétude des dossiers clients", "Completeness control of client files"),
                t("Mise à jour des informations clients", "Update of client information"),
                t("Préparation et pré remplissage de formulaires", "Preparation and pre-filling of forms"),
                t("Support administratif aux souscriptions", "Administrative support for subscriptions"),
                t("Support aux arbitrages", "Support for arbitrations"),
                t("Support aux rachats partiels ou totaux", "Support for partial or total redemptions"),
                t("Suivi des demandes clients", "Follow-up of client requests"),
                t("Organisation et archivage documentaire", "Document organization and archiving"),
                t("Mise à jour des bases clients", "Update of client databases"),
                t("Préparation de dossiers pour validation par les conseillers habilités", "Preparation of files for validation by authorized advisors"),
                t("Suivi des opérations patrimoniales dans le respect des procédures internes", "Follow-up of wealth operations in compliance with internal procedures"),
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center bg-[#F8F9FA] border border-black/5 rounded-xl p-5 hover:shadow-xl transition-all h-full">
                  <h4 className="h4-titre text-[#122017]">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. AUTRES BESOINS ══ */}
      <section id="autres-besoins" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-[#8e8478] w-full flex flex-col rounded-3xl shadow-lg border border-black/5">
          {/* Top Banner */}
          <div className="w-full border-b border-[#E0D6C8]/30">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                <img
                  src="/autrBes.jpg"
                  alt="Autres besoins opérationnels"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
              {/* Right Box (Title & Icon) (order 1 on mobile, order 2 on desktop) */}
              <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center order-1 md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-white" />
                  <h2 className="h2-surtitre text-white">
                    {t("Autres besoins opérationnels", "Other operational needs")}
                  </h2>
                </div>
                <h3 className="h3-section text-white mb-4">
                  {t(
                    "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.",
                    "Handling of occasional, transversal or specific operational needs."
                  )}
                </h3>
                <p className="text-white/90 text-[0.95rem] leading-[1.6]">
                  {t(
                    "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
                    "Handling of occasional, transversal or specific operational needs not exclusively related to a financial, accounting, wealth, compliance or data function."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="w-full py-12 px-8 lg:px-12">
            <div className="w-full">
              <h3 className="text-[#D9B151] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                {t("Périmètre d'intervention", "Scope of intervention")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  t("Missions ponctuelles de renfort opérationnel", "Occasional operational reinforcement missions"),
                  t("Support administratif financier", "Financial administrative support"),
                  t("Traitement de dossiers en volume", "Volume file processing"),
                  t("Classement, archivage et organisation documentaire", "Filing, archiving and document organization"),
                  t("Préparation et mise à jour de fichiers de suivi", "Preparation and update of tracking files"),
                  t("Support à la gestion d'opérations transverses", "Support for the management of transverse operations"),
                  t("Assistance à la formalisation de procédures internes", "Assistance in the formalization of internal procedures"),
                  t("Aide à la structuration de process opérationnels", "Help in structuring operational processes"),
                  t("Préparation de documents administratifs", "Preparation of administrative documents"),
                  t("Suivi de demandes internes ou clients", "Follow-up of internal or client requests"),
                  t("Support en période de surcharge d'activité", "Support during periods of activity overload"),
                  t("Remplacement ou appui temporaire d'équipe", "Replacement or temporary team support"),
                  t("Coordination entre équipes internes et prestataires externalisés", "Coordination between internal teams and external providers"),
                  t("Étude de besoins spécifiques non listés dans les rubriques précédentes", "Study of specific needs not listed in previous sections"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <svg className="w-4 h-4 text-[#D9B151] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <h4 className="h4-titre text-white">{item}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
