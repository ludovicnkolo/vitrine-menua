"use client";
import Link from "next/link";
import { BarChart2, PieChart, ShieldCheck, FileSpreadsheet, Building2, MoreHorizontal, ArrowRight, Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/vos_besoins_hero.png"
            alt="Vos Besoins"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122017] from-20% via-[#122017]/75 via-50% to-transparent to-70%" />
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
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] text-white mb-8">
                {t("Vos\nbesoins", "Your\nneeds").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
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

      {/* ══ 1. FINANCE & REPORTING — Fond vert foncé, image droite ══ */}
      <section id="finance-reporting" className="w-full bg-[#122017] py-12 lg:py-16 my-10 lg:my-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text left */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("01 — Domaine", "01 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
              {t("Finance &\nReporting", "Finance &\nReporting").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-white text-[0.95rem] leading-[1.8] mb-8">
              {t(
                "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
                "Production, structuring and reliability of financial reporting intended for performance management, activity monitoring and decision support."
              )}
            </p>
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
                <div key={i} className="flex items-start gap-3 text-white text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Image right */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
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

      {/* ══ 2. CONTRÔLE DE GESTION — Fond crème, image gauche ══ */}
      <section id="controle-de-gestion" className="w-full bg-[#F6F3F0] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: image first on desktop */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-[460px] h-[380px] rounded-2xl overflow-hidden shadow-xl border border-[#E0D6C8]/50">
              <img
                src="/office-lounge.jpg"
                alt="Contrôle de gestion"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
          {/* Right: text */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2 flex flex-col sticky top-24 self-start">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("02 — Domaine", "02 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Contrôle\nde gestion", "Management\nControl").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8">
              {t(
                "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
                "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div key={i} className="flex items-start gap-3 text-[#122017]/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. RISQUES & CONFORMITÉ — Fond bois/brun, grille de cards ══ */}
      <section id="risques-conformite" className="w-full py-12 lg:py-16 mb-10 lg:mb-16 overflow-hidden" style={{
        background: "linear-gradient(160deg, #8B6240 0%, #5A3A1E 40%, #3E2510 100%)"
      }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-14">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("03 — Domaine", "03 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-white mb-10">
              {t("Risques & Conformité", "Risk & Compliance")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-white text-[0.95rem] text-center max-w-2xl leading-[1.8]">
              {t(
                "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
                "Operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 max-w-[1100px] mx-auto mt-8">
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
              <div key={i} className="flex items-start gap-3 text-white text-[0.88rem] bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-2" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. SUPPORT COMPTABLE & DATA — Fond blanc, image droite ══ */}
      <section id="support-comptable-data" className="w-full bg-[#FDFDFD] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: text */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("04 — Domaine", "04 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Support\nComptable & Data", "Accounting &\nData Support").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8">
              {t(
                "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
                "Operational support to accounting, administrative and data teams in processing, making reliable and structuring information necessary for accounting production and reporting."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div key={i} className="flex items-start gap-3 text-[#122017]/75 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: image */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] h-[400px] rounded-2xl overflow-hidden shadow-xl border border-[#E0D6C8]/30">
              <img
                src="/meeting.jpg"
                alt="Support Comptable & Data"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. GESTION DE PATRIMOINE — Fond vert foncé, cards ══ */}
      <section id="gestion-patrimoine" className="w-full bg-[#122017] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-14">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("05 — Domaine", "05 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-white mb-10">
              {t("Gestion de Patrimoine & CGP", "Wealth Management & IFA")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-white text-[0.9rem] text-center max-w-2xl leading-[1.8]">
              {t(
                "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
                "Operational support to wealth management firms, family offices and wealth structures in the processing, preparation and administrative follow-up of client files."
              )}
            </p>
          </div>
          {/* Grid of bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto mt-8">
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
              <div key={i} className="flex items-start gap-3 text-white text-[0.85rem] bg-[#1a2e24] p-4 rounded-xl border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-2" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. AUTRES BESOINS — Fond crème ══ */}
      <section id="autres-besoins" className="w-full bg-[#F6F3F0] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: sticky title block */}
          <div className="w-full lg:w-[38%] flex flex-col sticky top-24 self-start">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("06 — Domaine", "06 — Area")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Autres besoins\nopérationnels", "Other operational\nneeds").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-[#122017]/70 text-[0.9rem] leading-[1.7]">
              {t(
                "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
                "Handling of occasional, transversal or specific operational needs not exclusively related to a financial, accounting, wealth, compliance or data function."
              )}
            </p>
            <div className="mt-8 flex items-center gap-3 text-[#122017] font-bold text-[0.85rem] border border-[#122017]/20 bg-white px-4 py-3 rounded-lg w-fit">
              <Globe size={18} className="text-[#8B6240]" />
              {t("FR / EN — Bilingue", "FR / EN — Bilingual")}
            </div>
          </div>
          {/* Right: cards list */}
          <div className="w-full lg:w-[62%] grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#E0D6C8]/50 shadow-sm text-[#122017]/80 text-[0.82rem]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
