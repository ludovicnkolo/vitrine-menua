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
              <h1 className="text-white mb-8 text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] font-bold uppercase max-w-3xl tracking-tight">
                {t("Vos\nbesoins", "Your\nneeds").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white/90 text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3">
                <p>
                  MENUA CONSULTING {t(
                    "intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées sur l'ensemble des fonctions",
                    "supports financial, accounting, wealth, data and regulated teams on all"
                  )}{" "}
                  <span className="text-[#D9B151] font-semibold">back & middle office.</span>
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
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("01 — Domaine", "01 — Area")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6 tracking-tight">
              {t("Finance &\nReporting", "Finance &\nReporting").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-white/80 text-[0.95rem] leading-[1.8] mb-8">
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
                t("Consolidation de données", "Data consolidation"),
                t("Reporting mensuel / trimestriel", "Monthly / quarterly reporting"),
                t("Reporting de trésorerie", "Treasury reporting"),
                t("Suivi des indicateurs", "Indicator tracking"),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0" />
                  {item}
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
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("02 — Domaine", "02 — Area")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
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
                t("Analyse des écarts (réalisé vs budget)", "Variance analysis (actual vs budget)"),
                t("Tableaux de bord", "Dashboards"),
                t("Pilotage de performance", "Performance management"),
                t("Suivi des coûts et marges", "Cost and margin tracking"),
                t("Analyse de rentabilité", "Profitability analysis"),
                t("Reportings de gestion", "Management reporting"),
                t("Support aux directions financières", "Financial direction support"),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#122017]/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0" />
                  {item}
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
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("03 — Domaine", "03 — Area")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-4">
              {t("Risques & Conformité", "Risk & Compliance")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-white/70 text-[0.95rem] text-center max-w-2xl leading-[1.8]">
              {t(
                "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
                "Operational support to risk and compliance teams in the processing, control and reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { label: "KYC", desc: t("Collecte, vérification et revue des dossiers clients.", "Collection, verification and review of client files.") },
              { label: "LCB-FT / AML", desc: t("Traitement des alertes, analyse des mouvements inhabituels.", "Alert processing, analysis of unusual movements.") },
              { label: t("Contrôle documentaire", "Documentary control"), desc: t("Analyse et complétude des pièces justificatives.", "Analysis and completeness of supporting documents.") },
              { label: t("Remédiation KYC", "KYC Remediation"), desc: t("Mise à jour et correction des dossiers non-conformes.", "Update and correction of non-compliant files.") },
              { label: t("Suivi des procédures", "Procedure monitoring"), desc: t("Respect des procédures internes et exigences réglementaires.", "Compliance with internal procedures and regulatory requirements.") },
            ].map((card, i) => (
              <div key={i} className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/15 hover:bg-white/15 transition-all">
                <span className="text-[#D9B151]/50 text-[2.5rem] font-bold leading-none mb-3 select-none">0{i + 1}</span>
                <h3 className="text-white text-[0.85rem] font-bold uppercase tracking-wide mb-3 leading-tight">{card.label}</h3>
                <p className="text-white/65 text-[0.78rem] leading-[1.7]">{card.desc}</p>
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
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("04 — Domaine", "04 — Area")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
              {t("Support\nComptable & Data", "Accounting &\nData Support").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8">
              {t(
                "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
                "Operational support to accounting, administrative and data teams in processing, making reliable and structuring information necessary for accounting production and reporting."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t("Comptabilité opérationnelle", "Operational accounting"), items: [t("Saisie comptable", "Accounting entry"), t("Rapprochements bancaires", "Bank reconciliations"), t("Lettrage des comptes", "Account lettering"), t("Contrôle des pièces", "Document control")] },
                { label: t("Data & Structuration", "Data & Structuring"), items: [t("Data cleaning", "Data cleaning"), t("Bases de données", "Databases"), t("Contrôle de cohérence", "Consistency control"), t("Reporting files", "Reporting files")] },
              ].map((group, i) => (
                <div key={i} className="bg-[#F6F3F0] rounded-xl p-5 border border-[#E0D6C8]/50">
                  <h3 className="text-[#122017] text-[0.78rem] font-bold uppercase tracking-wide mb-3">{group.label}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-[#122017]/70 text-[0.8rem]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("05 — Domaine", "05 — Area")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-4">
              {t("Gestion de Patrimoine & CGP", "Wealth Management & IFA")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-white/60 text-[0.9rem] text-center max-w-2xl leading-[1.8]">
              {t(
                "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
                "Operational support to wealth management firms, family offices and wealth structures in the processing, preparation and administrative follow-up of client files."
              )}
            </p>
          </div>
          {/* Cards layout like director card in nous-connaitre */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {[
              { num: "01", title: t("Dossiers clients", "Client files"), desc: t("Préparation des dossiers d'entrée en relation, collecte et contrôle des pièces justificatives, contrôle de complétude.", "Preparation of onboarding files, collection and control of supporting documents, completeness check.") },
              { num: "02", title: t("Mises à jour & formulaires", "Updates & forms"), desc: t("Mise à jour des informations clients, préparation et pré-remplissage de formulaires, support aux souscriptions.", "Update of client information, preparation and pre-filling of forms, subscription support.") },
              { num: "03", title: t("Opérations patrimoniales", "Wealth operations"), desc: t("Support aux arbitrages, rachats partiels ou totaux, suivi des demandes clients dans le respect des procédures internes.", "Support for arbitrations, partial or total redemptions, client request follow-up in compliance with internal procedures.") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white/10 backdrop-blur-sm rounded-xl p-7 border border-white/15 hover:bg-white/15 transition-all">
                <span className="text-[#D9B151]/50 text-[2.5rem] font-bold leading-none mb-3 select-none">{item.num}</span>
                <h3 className="text-white text-[0.9rem] font-bold uppercase tracking-wide mb-3">{item.title}</h3>
                <p className="text-white/65 text-[0.82rem] leading-[1.7]">{item.desc}</p>
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
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("06 — Domaine", "06 — Area")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
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
          {/* Right: cards */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">
            {[
              { title: t("Renfort opérationnel ponctuel", "Occasional operational reinforcement"), desc: t("Missions ponctuelles de renfort, traitement de dossiers en volume, support en période de surcharge d'activité.", "Occasional reinforcement missions, volume file processing, support during periods of activity overload.") },
              { title: t("Support administratif & organisationnel", "Administrative & organizational support"), desc: t("Classement, archivage, organisation documentaire, préparation et mise à jour de fichiers de suivi, coordination entre équipes.", "Filing, archiving, document organization, preparation and update of tracking files, coordination between teams.") },
              { title: t("Structuration de processus", "Process structuring"), desc: t("Assistance à la formalisation de procédures internes, aide à la structuration de process opérationnels, préparation de documents administratifs.", "Assistance in formalizing internal procedures, help structuring operational processes, preparation of administrative documents.") },
            ].map((pillar, i) => (
              <div key={i} className="flex items-start gap-6 bg-white rounded-xl p-7 border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[0.75rem] tracking-widest" style={{ backgroundColor: ["#122017", "#5A3A1E", "#8B6240"][i] }}>
                  0{i + 1}
                </div>
                <div>
                  <h3 className="text-[#122017] text-[1rem] font-bold mb-2 uppercase tracking-wide">{pillar.title}</h3>
                  <p className="text-[#122017]/70 text-[0.88rem] leading-[1.7]">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
