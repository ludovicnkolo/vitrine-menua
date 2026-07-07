"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { BarChart2, CheckCircle, ShieldCheck, Database, Building2, MoreHorizontal } from "lucide-react";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 3.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/meeting.jpg" 
            alt="Vos besoins" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Vos besoins", "Your needs")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l’ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "MENUA CONSULTING supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3.2 FINANCE & REPORTING (Overlapping Beige Box) ── */}
      <section className="relative w-full bg-white pt-24 pb-32" id="finance-reporting">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 mt-0 lg:mt-0 lg:mr-[-10%] shadow-2xl order-2 lg:order-1">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-8 font-bold flex items-center gap-4">
                <BarChart2 className="text-[#141824]" size={36} />
                {t("Finance & Reporting", "Finance & Reporting")}
              </h2>
              <div className="w-16 h-1 bg-[#141824] mb-8 animate-fade-in-up" />
              
              <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
                {t("Rôle : C’est une offre cœur métier", "Role: It is a core business offer")}
              </p>
              <p className="text-[#141824] text-[1.05rem] font-light leading-relaxed mb-8">
                {t(
                  "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l’activité et à l’aide à la décision.",
                  "Production, structuring and reliability of financial reporting intended for performance management, activity monitoring and decision support."
                )}
              </p>
              
              <ul className="space-y-4 text-[#141824] text-[1.05rem] font-light">
                {[
                  "Reporting financier", "KPI | Dashboard", "Analyse de performance", "Support direction financière",
                  "Consolidation des données", "Analyse financière", "Préparation de reportings pour direction financière",
                  "Suivi d’activité", "Reporting mensuel / trimestriel", "Reporting de trésorerie",
                  "Reporting de rentabilité", "Suivi des indicateurs"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <span>{t(item, item)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Image */}
            <div className="w-full lg:w-7/12 h-[500px] lg:h-[700px] z-10 shadow-xl order-1 lg:order-2 mb-[-4rem] lg:mb-0">
              <img src="/office-lounge.jpg" alt="Finance & Reporting" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.3 CONTRÔLE DE GESTION (Dark Blue Section) ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding" id="controle-de-gestion">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">
          <div className="order-2 lg:order-1 h-full min-h-[400px] border border-white/10 p-12 flex items-center justify-center bg-white/5">
             <CheckCircle size={120} className="text-white opacity-10" strokeWidth={1} />
          </div>
          <div className="animate-fade-in-up order-1 lg:order-2">
            <h2 className="text-[2rem] text-white mb-6 flex items-center gap-4">
              <CheckCircle className="text-[#e8e1d7]" size={36} />
              {t("Contrôle de gestion", "Management control")}
            </h2>
            <div className="w-16 h-1 bg-[#e8e1d7] mb-8" />
            
            <p className="font-bold text-[#e8e1d7] mb-4 text-[1.1rem]">
              {t("Rôle : Optimisation interne des coûts et performance", "Role: Internal cost optimization and performance")}
            </p>
            <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "Appui opérationnel au suivi budgétaire, à l’analyse des écarts et au pilotage de la performance afin d’aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
                "Operational support for budget monitoring, variance analysis and performance management to help organizations better control their costs, margins and resources."
              )}
            </p>
            
            <ul className="space-y-4 text-[#e5e9f0] text-[1.05rem] font-light">
              {[
                "Suivi budgétaire", "Analyse des écarts entre réalisé, budget et prévisionnel", "Tableaux de bord",
                "Pilotage de performance", "Suivi des coûts, charges et marges", "Analyse de rentabilité",
                "Suivi des indicateurs opérationnels", "Préparation de reportings de gestion",
                "Suivi du chiffre d’affaires et des objectifs", "Mise à jour de fichiers de pilotage",
                "Consolidation des données de gestion", "Support aux directions financières et responsables opérationnels"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8e1d7] shrink-0 mt-2" />
                  <span>{t(item, item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3.4 RISQUES & CONFORMITÉ (Overlapping Dark Blue Image Left) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-24 pb-32" id="risques-conformite">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[500px] lg:h-[700px] z-10 shadow-xl">
              <img src="/digitalisation.jpg" alt="Risques & Conformité" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
            </div>
            
            {/* Right Overlapping Blue Box */}
            <div className="w-full lg:w-6/12 bg-[#141824] text-white p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-white mb-8 font-bold flex items-center gap-4">
                <ShieldCheck className="text-[#e8e1d7]" size={36} />
                {t("Risques & Conformité", "Risks & Compliance")}
              </h2>
              <div className="w-16 h-1 bg-[#e8e1d7] mb-8 animate-fade-in-up" />
              
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed mb-8">
                {t(
                  "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
                  "Operational support for risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
                )}
              </p>
              
              <ul className="space-y-4 text-[#e5e9f0] text-[1.05rem] font-light">
                {[
                  "KYC", "LCB-FT", "AML", "Contrôle documentaire", "Analyse et complétude des dossiers clients",
                  "Vérification des pièces justificatives", "Entrée en relation client", "Revue périodique des dossiers",
                  "Remédiation KYC", "Traitement des alertes de conformité", "Analyse des mouvements inhabituels",
                  "Support aux équipes risques", "Support aux équipes conformité", "Suivi des procédures internes",
                  "Préparation de dossiers pour validation par les équipes habilitées"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8e1d7] shrink-0 mt-2" />
                    <span>{t(item, item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 SUPPORT COMPTABLE & DATA (White/Light Section) ── */}
      <section className="relative w-full bg-white section-padding" id="support-comptable">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-[2rem] text-[#141824] mb-6 flex items-center gap-4">
              <Database className="text-[#141824]" size={36} />
              {t("Support comptable & data", "Accounting & data support")}
            </h2>
            <div className="w-16 h-1 bg-[#141824] mb-8" />
            
            <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
              {t("Rôle : Back-office opérationnel", "Role: Operational back-office")}
            </p>
            <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
                "Operational support for accounting, administrative and data teams in the processing, reliability and structuring of the information necessary for accounting production and reporting."
              )}
            </p>
            
            <ul className="space-y-4 text-[#6e7891] text-[1.05rem] font-light">
              {[
                "Saisie comptable", "Rapprochements bancaires", "Lettrage des comptes", "Contrôle et classement des pièces comptables",
                "Préparation des déclarations de TVA", "Préparation des éléments comptables pour révision",
                "Suivi des factures clients et fournisseurs", "Relances administratives liées aux pièces manquantes",
                "Data cleaning", "Structuration et mise à jour de bases de données", "Contrôle de cohérence des données",
                "Préparation de fichiers de reporting", "Consolidation de données comptables et opérationnelles",
                "Archivage et organisation documentaire"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                  <span>{t(item, item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-full min-h-[400px] border border-[#e8e1d7] bg-[#f5f7fa] p-12 flex items-center justify-center">
             <Database size={120} className="text-[#141824] opacity-10" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ── 3.6 GESTION DE PATRIMOINE & SUPPORT CGP (Overlapping Beige Box) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-24 pb-32" id="gestion-patrimoine">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[500px] lg:h-[700px] z-10 shadow-xl">
              <img src="/banner-desk.jpg" alt="Gestion de Patrimoine" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
            </div>
            
            {/* Right Overlapping Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-8 font-bold flex items-center gap-4">
                <Building2 className="text-[#141824]" size={36} />
                {t("Gestion de Patrimoine & Support CGP", "Wealth Management & IFA Support")}
              </h2>
              <div className="w-16 h-1 bg-[#141824] mb-8 animate-fade-in-up" />
              
              <p className="text-[#141824] text-[1.05rem] font-light leading-relaxed mb-8">
                {t(
                  "Appui opérationnel aux cabinets de gestion de patrimoine, famille offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
                  "Operational support for wealth management firms, family offices and wealth structures in the processing, preparation and administrative monitoring of client files."
                )}
              </p>
              
              <ul className="space-y-4 text-[#141824] text-[1.05rem] font-light">
                {[
                  "Préparation des dossiers d’entrée en relation", "Collecte et contrôle des pièces justificatives",
                  "Contrôle de complétude des dossiers clients", "Mise à jour des informations clients",
                  "Préparation et pré remplissage de formulaires", "Support administratif aux souscriptions",
                  "Support aux arbitrages", "Support aux rachats partiels ou totaux", "Suivi des demandes clients",
                  "Organisation et archivage documentaire", "Mise à jour des bases clients",
                  "Préparation de dossiers pour validation par les conseillers habilités",
                  "Suivi des opérations patrimoniales dans le respect des procédures internes"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <span>{t(item, item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.7 AUTRES BESOINS OPERATIONNELS ── */}
      <section className="relative w-full bg-white section-padding" id="autres-besoins">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div className="order-2 lg:order-1 h-full min-h-[400px] border border-[#e8e1d7] bg-[#f5f7fa] p-12 flex items-center justify-center">
             <MoreHorizontal size={120} className="text-[#141824] opacity-10" strokeWidth={1} />
          </div>
          <div className="animate-fade-in-up order-1 lg:order-2">
            <h2 className="text-[2rem] text-[#141824] mb-6 flex items-center gap-4">
              <MoreHorizontal className="text-[#141824]" size={36} />
              {t("Autres besoins opérationnels", "Other operational needs")}
            </h2>
            <div className="w-16 h-1 bg-[#141824] mb-8" />
            
            <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d’une fonction financière, comptable, patrimoniale, conformité ou data.",
                "Management of specific, cross-functional or one-off operational needs that do not relate exclusively to a financial, accounting, wealth, compliance or data function."
              )}
            </p>
            
            <ul className="space-y-4 text-[#6e7891] text-[1.05rem] font-light">
              {[
                "Missions ponctuelles de renfort opérationnel", "Support administratif financier",
                "Traitement de dossiers en volume", "Classement, archivage et organisation documentaire",
                "Préparation et mise à jour de fichiers de suivi", "Support à la gestion d’opérations transverses",
                "Assistance à la formalisation de procédures internes", "Aide à la structuration de process opérationnels",
                "Préparation de documents administratifs", "Suivi de demandes internes ou clients",
                "Support en période de surcharge d’activité", "Remplacement ou appui temporaire d’équipe",
                "Coordination entre équipes internes et prestataires externalisés",
                "Étude de besoins spécifiques non listés dans les rubriques précédentes"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                  <span>{t(item, item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </main>
  );
}
