"use client";
import Link from "next/link";
import { BarChart2, PieChart, ShieldCheck, FileSpreadsheet, Building2, MoreHorizontal, ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-transparent">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/vos_besoins_hero.png"
            alt="Vos Besoins"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08] from-40% via-[#1A0E08]/75 via-65% to-transparent to-90%" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <p className="text-[#D9B151] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.2em] uppercase mb-6">
                {t("Expertises", "Expertise")}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.5rem] font-bold leading-[1.1] text-white mb-8">
                {t("Vos besoins", "Your needs").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3" style={{ color: 'white' }}>
                <p>
                  MENUA CONSULTING {t(
                    "intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions",
                    "supports financial, accounting, wealth, IT and regulated teams on all"
                  )}{" "}
                  <span className="text-[#D9B151] font-semibold">back et middle office</span>{" "}
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
                <div className="w-8 h-[1px] bg-[#D9B151]" />
                <span className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.15em] uppercase">
                  {t("01 — Domaine", "01 — Area")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-6">
                {t("Finance & Reporting", "Finance & Reporting").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-16 h-[3px] bg-[#D9B151] mb-8" />
              <div className="text-[#4A4E5A] text-[1.05rem] leading-[1.8] mb-8 font-normal">
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
                  <div key={i} className="flex items-start gap-3 text-[#122017]/70 text-[0.82rem]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image right */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/trust-circle.jpg"
                alt="Finance & Reporting"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* ══ 2. CONTRÔLE DE GESTION ══ */}
      <section id="controle-de-gestion" className="mt-12 bg-[#8e8478] w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
            {t("02 — Domaine", "02 — Area")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
            {t("Contrôle de gestion", "Management Control").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
          </h2>
          <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
          <p className="text-white/85 text-[0.95rem] leading-[1.8] mb-8 max-w-3xl">
            {t(
              "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
              "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources."
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div key={i} className="flex items-start gap-3 text-white/80 text-[0.82rem]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. RISQUES & CONFORMITÉ ══ */}
      <section id="risques-conformite" className="mt-12 bg-[#e4dcf7] w-full flex flex-col">
        {/* Top Banner */}
        <div className="w-full border-y border-[#E0D6C8]/50">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row">
            {/* Left Box (Title & Icon) */}
            <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center">
              <p className="font-serif text-xl lg:text-2xl font-bold text-[#D9B151] mb-1">
                03
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#122017] mb-2">
                {t("Risques & Conformité", "Risk & Compliance")}
              </h2>
              <p className="text-[#4A4E5A] text-[0.9rem] leading-[1.5]">
                {t(
                  "Des processus fiabilisés au service de la conformité réglementaire.",
                  "Reliable processes serving regulatory compliance."
                )}
              </p>
            </div>
            {/* Right Image */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[350px] p-4 lg:p-6">
              <img
                src="/office-lounge.jpg"
                alt="Risques & Conformité"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="w-full py-10 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            
            {/* Left Paragraph */}
            <div className="w-full md:w-[35%] text-[#122017]/80 text-[0.95rem] leading-[1.8] font-medium">
              {t(
                "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
                "Operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
              )}
            </div>

            {/* Right List */}
            <div className="w-full md:w-[65%] border-t md:border-t-0 md:border-l border-[#D9B151] pt-12 md:pt-0 md:pl-12 lg:pl-16">
              <h3 className="text-[#8B6240] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                {t("Périmètre d'intervention", "Scope of intervention")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
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
                    {/* Checkmark icon (Lucide Check path) */}
                    <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-[#122017]/80 text-[0.85rem] leading-[1.5]">{item}</span>
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
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("04 — Domaine", "04 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
              {t("Support Comptable & Data", "Accounting & Data Support").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-white/85 text-[0.95rem] leading-[1.8] mb-8 max-w-3xl">
              {t(
                "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
                "Operational support to accounting, administrative and data teams in processing, making reliable and structuring information necessary for accounting production and reporting."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div key={i} className="flex items-start gap-3 text-white/80 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
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
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("05 — Domaine", "05 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Gestion de Patrimoine & CGP", "Wealth Management & IFA")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8 max-w-3xl">
              {t(
                "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
                "Operational support to wealth management firms, family offices and wealth structures in the processing, preparation and administrative follow-up of client files."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div key={i} className="flex items-start gap-3 text-[#122017]/75 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. AUTRES BESOINS ══ */}
      <section id="autres-besoins" className="mt-12 bg-[#e4dcf7] w-full flex flex-col">
        {/* Top Banner */}
        <div className="w-full border-y border-[#E0D6C8]/50">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row">
            {/* Left Image (order 2 on mobile, order 1 on desktop) */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[350px] p-4 lg:p-6 order-2 md:order-1">
              <img
                src="/meeting.jpg"
                alt="Autres besoins opérationnels"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
                onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
              />
            </div>
            {/* Right Box (Title) (order 1 on mobile, order 2 on desktop) */}
            <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center order-1 md:order-2">
              <p className="font-serif text-xl lg:text-2xl font-bold text-[#D9B151] mb-1">
                06
              </p>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#122017] mb-2">
                {t("Autres besoins opérationnels", "Other operational needs")}
              </h2>
              <p className="text-[#4A4E5A] text-[0.9rem] leading-[1.5]">
                {t(
                  "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.",
                  "Handling of occasional, transversal or specific operational needs."
                )}
              </p>
              <div className="mt-6 flex items-center gap-3 text-[#122017] font-bold text-[0.85rem] border border-[#122017]/20 bg-white/60 px-4 py-3 rounded-lg w-fit">
                <Globe size={18} className="text-[#8B6240]" />
                {t("FR / EN — Bilingue", "FR / EN — Bilingual")}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="w-full py-10 lg:py-12">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            
            {/* Left Paragraph */}
            <div className="w-full md:w-[35%] text-[#122017]/80 text-[0.95rem] leading-[1.8] font-medium">
              {t(
                "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
                "Handling of occasional, transversal or specific operational needs not exclusively related to a financial, accounting, wealth, compliance or data function."
              )}
            </div>

            {/* Right List */}
            <div className="w-full md:w-[65%] border-t md:border-t-0 md:border-l border-[#D9B151] pt-12 md:pt-0 md:pl-12 lg:pl-16">
              <h3 className="text-[#8B6240] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                {t("Périmètre d'intervention", "Scope of intervention")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
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
                    {/* Checkmark icon (Lucide Check path) */}
                    <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-[#122017]/80 text-[0.85rem] leading-[1.5]">{item}</span>
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
