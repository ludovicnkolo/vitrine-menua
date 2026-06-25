"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Briefcase } from "lucide-react";
import { use } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Translation = { fr: string; en: string };
type PageData = { title: Translation; description: Translation; role: Translation; image: string; items: Translation[] };

const besoinsData: Record<string, PageData> = {
  "finance-et-reporting": {
    title: { 
      fr: "Finance & reporting", 
      en: "Finance & Reporting" 
    },
    description: { 
      fr: "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
      en: "Production, structuring, and reliability of financial reporting intended for performance management, activity tracking, and decision-making."
    },
    role: { 
      fr: "C'est une offre cœur métier", 
      en: "Core business offer" 
    },
    image: "/finance-globe.jpg",
    items: [
      { fr: "Reporting financier, KPI | Dashboard", en: "Financial reporting, KPI | Dashboard" },
      { fr: "Analyse de performance", en: "Performance analysis" },
      { fr: "Support direction financière", en: "Financial department support" },
      { fr: "Consolidation de données", en: "Data consolidation" },
      { fr: "Analyse financière", en: "Financial analysis" },
      { fr: "Préparation de reportings pour direction financière", en: "Preparation of reporting for the financial department" },
      { fr: "Suivi d'activité", en: "Activity tracking" },
      { fr: "Reporting mensuel / trimestriel", en: "Monthly / quarterly reporting" },
      { fr: "Reporting de trésorerie", en: "Cash flow reporting" },
      { fr: "Reporting de rentabilité", en: "Profitability reporting" },
      { fr: "Suivi des indicateurs", en: "Tracking of indicators" }
    ]
  },
  "controle-de-gestion": {
    title: { 
      fr: "Contrôle de gestion", 
      en: "Management Control" 
    },
    description: { 
      fr: "Appui opérationnel au suivi budgétaire, à l’analyse des écarts et au pilotage de la performance afin d’aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
      en: "Operational support for budget monitoring, variance analysis, and performance management to help organizations better control their costs, margins, and resources."
    },
    role: { 
      fr: "Optimisation interne des coûts et performance", 
      en: "Internal cost and performance optimization" 
    },
    image: "/notebook.jpg",
    items: [
      { fr: "Suivi budgétaire", en: "Budget tracking" },
      { fr: "Analyse des écarts entre réalisé, budget et prévisionnel", en: "Analysis of variances between actual, budget, and forecast" },
      { fr: "Tableaux de bord", en: "Dashboards" },
      { fr: "Pilotage de performance", en: "Performance management" },
      { fr: "Suivi des coûts, charges et marges", en: "Tracking of costs, expenses, and margins" },
      { fr: "Analyse de rentabilité", en: "Profitability analysis" },
      { fr: "Suivi des indicateurs opérationnels", en: "Tracking of operational indicators" },
      { fr: "Préparation de reportings de gestion", en: "Preparation of management reporting" },
      { fr: "Suivi du chiffre d’affaires et des objectifs", en: "Tracking of revenue and objectives" },
      { fr: "Mise à jour de fichiers de pilotage", en: "Updating of management files" },
      { fr: "Consolidation des données de gestion", en: "Consolidation of management data" },
      { fr: "Support aux directions financières et responsables opérationnels", en: "Support to financial departments and operational managers" }
    ]
  },
  "risques-et-conformite": {
    title: { 
      fr: "Risques & conformité", 
      en: "Risk & Compliance" 
    },
    description: { 
      fr: "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
      en: "Operational support to risk and compliance teams in the processing, control, and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
    },
    role: { 
      fr: "Sécurisation et conformité", 
      en: "Security and compliance" 
    },
    image: "/vos-besoins-hero.jpg",
    items: [
      { fr: "KYC", en: "KYC" },
      { fr: "LCB-FT", en: "AML/CFT" },
      { fr: "AML", en: "AML" },
      { fr: "Contrôle documentaire", en: "Documentary control" },
      { fr: "Analyse et complétude des dossiers clients", en: "Analysis and completeness of client files" },
      { fr: "Vérification des pièces justificatives", en: "Verification of supporting documents" },
      { fr: "Entrée en relation client", en: "Client onboarding" },
      { fr: "Revue périodique des dossiers", en: "Periodic review of files" },
      { fr: "Remédiation KYC", en: "KYC remediation" },
      { fr: "Traitement des alertes de conformité", en: "Processing of compliance alerts" },
      { fr: "Analyse des mouvements inhabituels", en: "Analysis of unusual movements" },
      { fr: "Support aux équipes risques & conformité", en: "Support to risk & compliance teams" },
      { fr: "Suivi des procédures internes", en: "Tracking of internal procedures" },
      { fr: "Préparation de dossiers pour validation par les équipes habilitées", en: "Preparation of files for validation by authorized teams" }
    ]
  },
  "support-comptable-et-data": {
    title: { 
      fr: "Support comptable & data", 
      en: "Accounting & Data Support" 
    },
    description: { 
      fr: "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
      en: "Operational support to accounting, administrative, and data teams in the processing, reliability, and structuring of information necessary for accounting production and reporting."
    },
    role: { 
      fr: "Back-office opérationnel", 
      en: "Operational back-office" 
    },
    image: "/nous-rejoindre-hero.jpg",
    items: [
      { fr: "Saisie comptable", en: "Accounting entry" },
      { fr: "Rapprochements bancaires", en: "Bank reconciliations" },
      { fr: "Lettrage des comptes", en: "Account matching" },
      { fr: "Contrôle et classement des pièces comptables", en: "Control and filing of accounting documents" },
      { fr: "Préparation des déclarations de TVA", en: "Preparation of VAT returns" },
      { fr: "Préparation des éléments comptables pour révision", en: "Preparation of accounting elements for review" },
      { fr: "Suivi des factures clients et fournisseurs", en: "Tracking of client and supplier invoices" },
      { fr: "Relances administratives liées aux pièces manquantes", en: "Administrative follow-ups related to missing documents" },
      { fr: "Data cleaning", en: "Data cleaning" },
      { fr: "Structuration et mise à jour de bases de données", en: "Structuring and updating databases" },
      { fr: "Contrôle de cohérence des données", en: "Data consistency check" },
      { fr: "Préparation de fichiers de reporting", en: "Preparation of reporting files" },
      { fr: "Consolidation de données comptables et opérationnelles", en: "Consolidation of accounting and operational data" },
      { fr: "Archivage et organisation documentaire", en: "Archiving and document organization" }
    ]
  },
  "gestion-de-patrimoine": {
    title: { 
      fr: "Gestion de patrimoine & Support CGP", 
      en: "Wealth Management & CGP Support" 
    },
    description: { 
      fr: "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
      en: "Operational support to wealth management firms, family offices, and wealth structures in the processing, preparation, and administrative follow-up of client files."
    },
    role: { 
      fr: "Accompagnement administratif patrimonial", 
      en: "Wealth administrative support" 
    },
    image: "/headphones.jpg",
    items: [
      { fr: "Préparation des dossiers d’entrée en relation", en: "Preparation of onboarding files" },
      { fr: "Collecte et contrôle des pièces justificatives", en: "Collection and control of supporting documents" },
      { fr: "Contrôle de complétude des dossiers clients", en: "Control of client file completeness" },
      { fr: "Mise à jour des informations clients", en: "Updating client information" },
      { fr: "Préparation et pré-remplissage de formulaires", en: "Preparation and pre-filling of forms" },
      { fr: "Support administratif aux souscriptions", en: "Administrative support for subscriptions" },
      { fr: "Support aux arbitrages", en: "Support for arbitrations" },
      { fr: "Support aux rachats partiels ou totaux", en: "Support for partial or total redemptions" },
      { fr: "Suivi des demandes clients", en: "Tracking of client requests" },
      { fr: "Organisation et archivage documentaire", en: "Organization and document archiving" },
      { fr: "Mise à jour des bases clients", en: "Updating client databases" },
      { fr: "Préparation de dossiers pour validation par les conseillers habilités", en: "Preparation of files for validation by authorized advisors" },
      { fr: "Suivi des opérations patrimoniales dans le respect des procédures internes", en: "Tracking of wealth operations in compliance with internal procedures" }
    ]
  },
  "autres-besoins": {
    title: { 
      fr: "Autres besoins opérationnels", 
      en: "Other Operational Needs" 
    },
    description: { 
      fr: "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d’une fonction financière, comptable, patrimoniale, conformité ou data.",
      en: "Handling of specific, transversal, or punctual operational needs that do not exclusively fall under a financial, accounting, wealth, compliance, or data function."
    },
    role: { 
      fr: "Support flexible et sur-mesure", 
      en: "Flexible and customized support" 
    },
    image: "/nos-solutions-hero.jpg",
    items: [
      { fr: "Missions ponctuelles de renfort opérationnel", en: "Occasional operational reinforcement missions" },
      { fr: "Support administratif financier", en: "Financial administrative support" },
      { fr: "Traitement de dossiers en volume", en: "Volume processing of files" },
      { fr: "Classement, archivage et organisation documentaire", en: "Filing, archiving, and document organization" },
      { fr: "Préparation et mise à jour de fichiers de suivi", en: "Preparation and updating of tracking files" },
      { fr: "Support à la gestion d’opérations transverses", en: "Support in managing cross-functional operations" },
      { fr: "Assistance à la formalisation de procédures internes", en: "Assistance in formalizing internal procedures" },
      { fr: "Aide à la structuration de process opérationnels", en: "Help in structuring operational processes" },
      { fr: "Préparation de documents administratifs", en: "Preparation of administrative documents" },
      { fr: "Suivi de demandes internes ou clients", en: "Tracking of internal or client requests" },
      { fr: "Support en période de surcharge d’activité", en: "Support during periods of activity overload" },
      { fr: "Remplacement ou appui temporaire d’équipe", en: "Temporary replacement or team support" },
      { fr: "Coordination entre équipes internes et prestataires externalisés", en: "Coordination between internal teams and outsourced service providers" },
      { fr: "Étude de besoins spécifiques non listés dans les rubriques précédentes", en: "Study of specific needs not listed in the previous sections" }
    ]
  }
};

export default function BesoinDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const besoin = besoinsData[slug];

  if (!besoin) {
    notFound();
  }

  const lang = (language === 'EN' ? 'en' : 'fr') as keyof Translation;

  return (
    <main className="flex flex-col w-full bg-[#f4f4f3] text-[#051014] font-sans min-h-screen">
      {/* HERO FULL WIDTH */}
      <section className="relative w-full min-h-[75vh] flex items-end overflow-hidden pt-32 bg-[#051014]">
        <div className="absolute top-0 right-0 w-full md:w-3/4 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/90 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-[#051014]/40 to-transparent z-10"></div>
          <img src={besoin.image} alt={besoin.title[lang]} className="w-full h-full object-cover opacity-50" />
        </div>
        
        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-[0.2em] uppercase mb-6 flex items-center flex-wrap gap-3 font-bold">
            <Link href="/" className="hover:text-white transition-colors">{t("Accueil", "Home")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <Link href="/vos-besoins" className="hover:text-white transition-colors">{t("Vos besoins", "Your Needs")}</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <span className="text-white">{besoin.title[lang]}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8 max-w-4xl text-white">
            {besoin.title[lang]}
          </h1>
          <div className="w-16 h-[2px] bg-[#c89b53] mb-8"></div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            {besoin.description[lang]}
          </p>
        </div>
      </section>

      {/* CONTENU DÉTAILLÉ - CONSTRAINED WIDTH */}
      <section className="px-8 py-24 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* MAIN CONTENT */}
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-10 inline-flex items-center gap-2 border border-[#c89b53]/30 bg-[#c89b53]/10 px-5 py-2.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#c89b53] animate-pulse"></div>
                  <span className="text-[#c89b53] text-[0.7rem] font-bold tracking-[0.15em] uppercase">{besoin.role[lang]}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#051014] rounded-full flex items-center justify-center text-[#c89b53]">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#051014]">{t("Contenus et besoins couverts", "Contents and covered needs")}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
                  {besoin.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-[#fbfbfb] hover:bg-white hover:shadow-md hover:border-[#c89b53]/40 transition-all duration-300 group">
                      <CheckCircle2 className="text-[#c89b53] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={20} />
                      <span className="text-sm text-gray-700 leading-relaxed font-medium">{item[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* SIDEBAR CTA */}
            <div className="lg:w-1/3">
              <div className="bg-[#051014] text-white p-10 rounded-2xl sticky top-32 shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-6 leading-snug">{t("Un besoin sur ce périmètre ?", "A need in this scope?")}</h3>
                <div className="w-8 h-1 bg-[#c89b53] mb-6"></div>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                  {t(
                    "Nos équipes interviennent en support pour sécuriser et renforcer l'exécution de vos opérations.",
                    "Our teams provide support to secure and strengthen the execution of your operations."
                  )}
                </p>
                <Link href="/nous-contacter" className="flex items-center justify-center gap-4 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-4 rounded text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:shadow-[#c89b53]/20 w-full group">
                  {t("Nous solliciter", "Contact us")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
