"use client";
import Link from "next/link";
import { ArrowRight, PieChart, BarChart3, ShieldCheck, FileSpreadsheet, Building2, Briefcase, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  const sections = [
    {
      id: "finance-reporting",
      icon: PieChart,
      title: t("Finance & reporting", "Finance & reporting"),
      desc: t(
        "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
        "Production, structuring and reliability of financial reports intended for performance management, activity monitoring and decision support."
      ),
      services: [
        t("Reporting financier", "Financial reporting"),
        t("KPI / Dashboard", "KPI / Dashboard"),
        t("Analyse de performance", "Performance analysis"),
        t("Support direction financière", "Financial management support"),
        t("Consolidation des données", "Data consolidation"),
        t("Analyse financière", "Financial analysis"),
        t("Préparation de reportings pour direction financière", "Preparation of reports for financial management"),
        t("Suivi d'activité", "Activity monitoring"),
        t("Reporting mensuel / trimestriel", "Monthly / quarterly reporting"),
        t("Reporting de trésorerie", "Cash reporting"),
        t("Reporting de rentabilité", "Profitability reporting"),
        t("Suivi des indicateurs", "Indicator monitoring"),
      ],
      bg: "bg-[#F8F9FA]"
    },
    {
      id: "controle-gestion",
      icon: BarChart3,
      title: t("Contrôle de gestion", "Management control"),
      desc: t(
        "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
        "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources."
      ),
      services: [
        t("Suivi budgétaire", "Budget monitoring"),
        t("Analyse des écarts entre réalisé, budget et prévisionnel", "Analysis of variances between actual, budget and forecast"),
        t("Tableaux de bord", "Dashboards"),
        t("Pilotage de performance", "Performance management"),
        t("Suivi des coûts, charges et marges", "Monitoring of costs, expenses and margins"),
        t("Analyse de rentabilité", "Profitability analysis"),
        t("Suivi des indicateurs opérationnels", "Monitoring of operational indicators"),
        t("Préparation de reportings de gestion", "Preparation of management reports"),
        t("Suivi du chiffre d'affaires et des objectifs", "Monitoring of turnover and objectives"),
        t("Mise à jour de fichiers de pilotage", "Updating management files"),
        t("Consolidation des données de gestion", "Consolidation of management data"),
        t("Support aux directions financières et responsables opérationnels", "Support to financial departments and operational managers"),
      ],
      bg: "bg-[#EDEFF2]"
    },
    {
      id: "risques-conformite",
      icon: ShieldCheck,
      title: t("Risques & conformité", "Risk & compliance"),
      desc: t(
        "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
        "Operational support for risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
      ),
      services: [
        t("KYC (Know Your Customer)", "KYC (Know Your Customer)"),
        t("LCB-FT (Lutte contre le blanchiment et le financement du terrorisme)", "AML-CFT (Anti-Money Laundering and Combating the Financing of Terrorism)"),
        t("AML (Anti-Money Laundering)", "AML (Anti-Money Laundering)"),
        t("Contrôle documentaire", "Documentary control"),
        t("Analyse et complétude des dossiers clients", "Analysis and completeness of client files"),
        t("Vérification des pièces justificatives", "Verification of supporting documents"),
        t("Entrée en relation client", "Client onboarding"),
        t("Revue périodique des dossiers", "Periodic review of files"),
        t("Remédiation KYC", "KYC remediation"),
        t("Traitement des alertes de conformité", "Processing of compliance alerts"),
        t("Analyse des mouvements inhabituels", "Analysis of unusual movements"),
        t("Support aux équipes risques et conformité", "Support to risk and compliance teams"),
        t("Suivi des procédures internes", "Monitoring of internal procedures"),
        t("Préparation de dossiers pour validation par les équipes habilitées", "Preparation of files for validation by authorized teams"),
      ],
      bg: "bg-[#F8F9FA]"
    },
    {
      id: "support-comptable",
      icon: FileSpreadsheet,
      title: t("Support comptable & data", "Accounting & data support"),
      desc: t(
        "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
        "Operational support for accounting, administrative and data teams in the processing, reliability and structuring of the information necessary for accounting production and reporting."
      ),
      services: [
        t("Saisie comptable", "Accounting entry"),
        t("Rapprochements bancaires", "Bank reconciliations"),
        t("Lettrage des comptes", "Account matching"),
        t("Contrôle et classement des pièces comptables", "Control and filing of accounting documents"),
        t("Préparation des déclarations de TVA", "Preparation of VAT returns"),
        t("Préparation des éléments comptables pour révision", "Preparation of accounting elements for review"),
        t("Suivi des factures clients et fournisseurs", "Monitoring of customer and supplier invoices"),
        t("Relances administratives liées aux pièces manquantes", "Administrative reminders linked to missing documents"),
        t("Data cleaning", "Data cleaning"),
        t("Structuration et mise à jour de bases de données", "Structuring and updating databases"),
        t("Contrôle de cohérence des données", "Data consistency check"),
        t("Préparation de fichiers de reporting", "Preparation of reporting files"),
        t("Consolidation de données comptables et opérationnelles", "Consolidation of accounting and operational data"),
        t("Archivage et organisation documentaire", "Archiving and document organization"),
      ],
      bg: "bg-[#EDEFF2]"
    },
    {
      id: "gestion-patrimoine",
      icon: Building2,
      title: t("Gestion de patrimoine & Support CGP", "Wealth management & CGP support"),
      desc: t(
        "Appui opérationnel aux cabinets de gestion de patrimoine, famille offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
        "Operational support for wealth management firms, family offices and wealth structures in the processing, preparation and administrative monitoring of client files."
      ),
      services: [
        t("Préparation des dossiers d'entrée en relation", "Preparation of onboarding files"),
        t("Collecte et contrôle des pièces justificatives", "Collection and control of supporting documents"),
        t("Contrôle de complétude des dossiers clients", "Completeness check of client files"),
        t("Mise à jour des informations clients", "Updating client information"),
        t("Préparation et pré remplissage de formulaires", "Preparation and pre-filling of forms"),
        t("Support administratif aux souscriptions", "Administrative support for subscriptions"),
        t("Support aux arbitrages", "Support for arbitrages"),
        t("Support aux rachats partiels ou totaux", "Support for partial or total redemptions"),
        t("Suivi des demandes clients", "Monitoring of client requests"),
        t("Organisation et archivage documentaire", "Document organization and archiving"),
        t("Mise à jour des bases clients", "Updating client databases"),
        t("Préparation de dossiers pour validation par les conseillers habilités", "Preparation of files for validation by authorized advisors"),
        t("Suivi des opérations patrimoniales dans le respect des procédures internes", "Monitoring of wealth operations in compliance with internal procedures"),
      ],
      bg: "bg-[#F8F9FA]"
    },
    {
      id: "autres-besoins",
      icon: Briefcase,
      title: t("Autres besoins opérationnels", "Other operational needs"),
      desc: t(
        "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
        "Taking charge of ad hoc, cross-functional or specific operational needs that do not exclusively fall under a financial, accounting, wealth, compliance or data function."
      ),
      services: [
        t("Missions ponctuelles de renfort opérationnel", "Ad hoc operational reinforcement missions"),
        t("Support administratif financier", "Financial administrative support"),
        t("Traitement de dossiers en volume", "Volume processing of files"),
        t("Classement, archivage et organisation documentaire", "Filing, archiving and document organization"),
        t("Préparation et mise à jour de fichiers de suivi", "Preparation and updating of monitoring files"),
        t("Support à la gestion d'opérations transverses", "Support for the management of cross-functional operations"),
        t("Assistance à la formalisation de procédures internes", "Assistance with the formalization of internal procedures"),
        t("Aide à la structuration de process opérationnels", "Help with the structuring of operational processes"),
        t("Préparation de documents administratifs", "Preparation of administrative documents"),
        t("Suivi de demandes internes ou clients", "Monitoring of internal or client requests"),
        t("Support en période de surcharge d'activité", "Support during periods of activity overload"),
        t("Remplacement ou appui temporaire d'équipe", "Replacement or temporary team support"),
        t("Coordination entre équipes internes et prestataires externalisés", "Coordination between internal teams and outsourced service providers"),
        t("Étude de besoins spécifiques non listés dans les rubriques précédentes", "Study of specific needs not listed in the previous sections"),
      ],
      bg: "bg-[#EDEFF2]"
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FA] font-sans pt-24">
      {/* ── HEADER INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2B45] mb-6">
            {t("Vos besoins", "Your Needs")}
          </h1>
          <p className="text-[#1E2A3A] text-lg max-w-3xl mx-auto leading-relaxed">
            {t(
              "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
              "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
            )}
          </p>
        </div>
      </section>

      {/* ── SECTIONS BESOINS ─────────────────────────────────────────────── */}
      {sections.map((section, idx) => (
        <section key={idx} id={section.id} className={`${section.bg} px-8 py-20 border-t border-gray-200/60`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100 shrink-0">
                <section.icon className="text-[#4A8C7A]" size={32} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2B45]">
                {section.title}
              </h2>
            </div>
            
            <p className="text-[#1E2A3A] text-lg mb-12 max-w-4xl leading-relaxed">
              {section.desc}
            </p>

            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h3 className="text-[#0F2B45] font-bold mb-6 text-lg border-b border-gray-100 pb-4">{t("Services couverts :", "Covered services:")}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                {section.services.map((service, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4A8C7A] shrink-0 mt-0.5" size={18} />
                    <span className="text-[#1E2A3A] text-sm leading-snug">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F2B45] px-8 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-white mb-8">
          {t("Un besoin opérationnel spécifique ?", "A specific operational need?")}
        </h2>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-lg"
        >
          {t("Présenter un besoin", "Submit a request")} <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
