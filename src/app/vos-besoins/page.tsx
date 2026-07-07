"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { BarChart2, CheckCircle, ShieldCheck, Database, Building2, TrendingUp, ArrowRight, MoreHorizontal } from "lucide-react";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  const needs = [
    {
      id: "finance-reporting",
      title: t("Finance et Reporting", "Finance and Reporting"),
      desc: t("Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l’activité et à l’aide à la décision.", "Production, structuring and reliability of financial reporting intended for performance management..."),
      icon: BarChart2,
      bullets: ["Reporting financier", "KPI | Dashboard", "Analyse de performance", "Support direction financière", "Consolidation des données", "Analyse financière"]
    },
    {
      id: "controle-de-gestion",
      title: t("Contrôle de gestion", "Management control"),
      desc: t("Appui opérationnel au suivi budgétaire, à l’analyse des écarts et au pilotage de la performance afin d’aider les organisations à mieux maîtriser leurs coûts.", "Operational support for budget monitoring, variance analysis and performance management to help organizations..."),
      icon: CheckCircle,
      bullets: ["Suivi budgétaire", "Analyse des écarts", "Tableaux de bord", "Pilotage de performance", "Suivi des coûts, charges et marges", "Analyse de rentabilité"]
    },
    {
      id: "moa-it-finance",
      title: t("MOA / IT Finance", "MOA / IT Finance"),
      desc: t("Accompagnement dans l’intégration, le paramétrage et l’optimisation des outils financiers, comptables et data.", "Support in the integration, configuration and optimization of financial, accounting and data tools."),
      icon: TrendingUp,
      bullets: ["Recueil des besoins métiers", "Rédaction de cahiers des charges", "Paramétrage d'outils", "Tests de recette (UAT)", "Formation des utilisateurs", "Support post-déploiement"]
    },
    {
      id: "risques-conformite",
      title: t("Risques et Conformité", "Risks and Compliance"),
      desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles.", "Operational support for risk and compliance teams in the processing, control and reliability of sensitive files."),
      icon: ShieldCheck,
      bullets: ["KYC", "LCB-FT", "AML", "Contrôle documentaire", "Analyse et complétude", "Vérification des pièces"]
    },
    {
      id: "operations-marche",
      title: t("Opérations de marché", "Market operations"),
      desc: t("Support opérationnel middle et back office pour la gestion et le suivi des opérations financières et de marché.", "Middle and back office operational support for the management and monitoring of financial and market operations."),
      icon: TrendingUp, // Changed to a suitable icon since the original didn't have one explicitly
      bullets: ["Rapprochements", "Confirmation des trades", "Gestion des OST", "Suivi des suspens", "Règlement/Livraison", "Reporting réglementaire"]
    },
    {
      id: "support-comptable",
      title: t("Support comptable et data", "Accounting and data support"),
      desc: t("Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations.", "Operational support for accounting, administrative and data teams in the processing, reliability and structuring..."),
      icon: Database,
      bullets: ["Saisie comptable", "Rapprochements bancaires", "Lettrage des comptes", "Contrôle des pièces", "Préparation TVA", "Data cleaning"]
    },
    {
      id: "gestion-patrimoine",
      title: t("Gestion de Patrimoine", "Wealth Management"),
      desc: t("Appui opérationnel aux cabinets de gestion de patrimoine, famille offices et structures patrimoniales dans le suivi administratif des dossiers clients.", "Operational support for wealth management firms, family offices and wealth structures in the administrative monitoring..."),
      icon: Building2,
      bullets: ["Dossiers d’entrée en relation", "Collecte des pièces", "Contrôle de complétude", "Mise à jour clients", "Support aux souscriptions", "Support aux arbitrages"]
    },
    {
      id: "autres-besoins",
      title: t("Autres besoins", "Other needs"),
      desc: t("Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d’une fonction financière, comptable, patrimoniale ou data.", "Management of specific, cross-functional or one-off operational needs that do not relate exclusively..."),
      icon: MoreHorizontal,
      bullets: ["Missions ponctuelles", "Support administratif", "Traitement en volume", "Classement et archivage", "Préparation de fichiers", "Structuration de process"]
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 3.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/meeting.jpg" 
            alt="Vos besoins" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Vos besoins", "Your needs")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Un appui opérationnel rigoureux pour vos équipes financières, comptables et réglementées.",
                "Rigorous operational support for your financial, accounting and regulated teams."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── GRID LAYOUT (Nos expertises singulières style) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container">
          <div className="text-center mb-16">
             <div className="inline-block text-left">
               <div className="w-16 h-[3px] bg-[#141824] mb-5" />
               <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold uppercase tracking-wider mb-6">
                  {t("Nos domaines d'intervention", "Our areas of intervention")}
               </h2>
             </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {needs.map((need, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-10 flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group hover:bg-[#141824] hover:border-[#141824] hover:shadow-2xl transition-all duration-500 cursor-pointer">
                 <h3 className="text-[#141824] group-hover:text-white text-[1.2rem] font-bold mb-4 min-h-[3rem] transition-colors duration-500">
                   {need.title}
                 </h3>
                 <p className="text-[#6e7891] group-hover:text-white/80 font-light text-[0.95rem] leading-relaxed mb-8 flex-grow transition-colors duration-500">
                   {need.desc}
                 </p>
                 <a href={`#${need.id}`} className="mt-auto flex items-center gap-3 text-[#141824] group-hover:text-white font-bold uppercase tracking-widest text-[0.7rem] transition-colors duration-500">
                   {t("DÉCOUVRIR", "DISCOVER")} 
                   <span className="w-8 h-8 rounded-full border border-[#141824] group-hover:border-white group-hover:bg-white text-[#141824] flex items-center justify-center transition-colors duration-500">
                     <ArrowRight size={14} />
                   </span>
                 </a>
              </div>
            ))}
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
              <h2 className="text-[1.8rem] md:text-[2rem] text-[#141824] font-bold uppercase tracking-wider">{t("Détail de nos interventions", "Details of our interventions")}</h2>
            </div>
          </div>
          
          <div className="space-y-12 max-w-5xl mx-auto">
            {needs.map((need, idx) => (
              <div key={idx} id={need.id} className="bg-white shadow-xl flex flex-col lg:flex-row scroll-mt-32 overflow-hidden mb-12 border border-gray-100">
                <div className="lg:w-5/12 bg-[#e8e1d7] p-10 md:p-16 flex flex-col justify-center">
                  <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                  <h3 className="text-[2rem] text-[#141824] font-bold mb-6 flex items-center gap-4">
                    <need.icon className="text-[#141824]" size={36} />
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
                        <span>{t(bullet, bullet)}</span>
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
