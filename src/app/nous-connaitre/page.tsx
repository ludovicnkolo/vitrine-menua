"use client";
import React from "react";
import Link from "next/link";
import { Landmark, Target, GitMerge, FileCheck, ShieldCheck, ArrowRight, Globe, Users, CheckCircle, RefreshCw, FileText, Search, ClipboardCheck, BarChart2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-transparent">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous_connaitre_hero.png"
            alt="Nous Connaître"
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
                {t("Le cabinet", "The firm")}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.5rem] font-bold leading-[1.1] text-white mb-2">
                {t("Un partenaire de confiance", "A trusted partner")}
              </h1>
              <h2 className="text-[#D9B151] italic text-3xl md:text-4xl lg:text-[1.9rem] font-bold leading-[1.1] mb-8">
                {t("pour vos opérations financières.", "for your financial operations.")}
              </h2>
              <div className="text-white text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3 mb-10">
                <p>
                  {t(
                    "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de leurs fonctions back et middle office. Un engagement fondé sur la rigueur, la continuité et la fiabilité.",
                    "MENUA CONSULTING supports companies in the operational outsourcing of their back and middle office functions. A commitment based on rigor, continuity and reliability."
                  )}
                </p>
              </div>
              <Link href="/nous-connaitre#excellence" className="inline-flex items-center justify-center gap-3 bg-[#D9B151] text-[#122017] border border-[#D9B151] px-8 py-3.5 text-[0.85rem] font-bold tracking-wider uppercase transition-all hover:bg-transparent hover:text-[#D9B151] w-fit rounded-sm shadow-md">
                {t("DÉCOUVRIR NOTRE CABINET", "DISCOVER OUR FIRM")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 1. PRÉSENTATION DU CABINET ══ */}
      <section id="presentation-du-cabinet" className="bg-[#E3C29E] mt-12 mb-6 ">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent rounded-2xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

            {/* Text left */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-[#D9B151]" />
                <span className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.15em] uppercase">
                  {t("Le cabinet", "The firm")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-6">
                {t("MENUA CONSULTING PRÉSENTATION DU CABINET", "MENUA CONSULTING FIRM PRESENTATION").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-16 h-[3px] bg-[#D9B151] mb-8" />
              <div className="text-[#4A4E5A] text-[1.05rem] leading-[1.8] space-y-5 font-normal">
                <p>
                  {t("MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, de la gestion de patrimoine et data.", "MENUA CONSULTING is a firm specialized in operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data.")}
                </p>
                <p>
                  {t("Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.", "We provide companies, firms and financial players with dedicated operational teams, capable of executing demanding missions with rigor, continuity and reliability.")}
                </p>
                <p>
                  {t("Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.", "Our collaborators integrate into client organizations to take charge of operational execution, optimize internal costs and secure operational continuity.")}
                </p>
                <p>
                  {t("Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.", "This organization allows clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes.")}
                </p>
              </div>
            </div>

            {/* Image right — same dimensions as homepage section 2 */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/presentation_cabinet_desk.png"
                alt="Cabinet Menua Consulting"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/banner-desk.jpg"; }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. NOTRE APPROCHE ══ */}
      <section id="notre-approche" className="bg-[#C2D5C4] w-full py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-6">
            {t("NOTRE APPROCHE", "OUR APPROACH").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
          </h2>
          <div className="w-16 h-[3px] bg-[#D9B151] mb-10" />

          <div className="text-[#223930] text-[1rem] leading-[1.8] space-y-6 font-normal max-w-4xl mb-12">
            <p>
              {t(
                "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.",
                "MENUA CONSULTING adopts a resolutely operational stance: clients define needs, methods and priorities, we ensure execution."
              )}
            </p>
            <p>
              {t(
                "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.",
                "We operate in financial, accounting, wealth and regulated environments, strictly respecting internal procedures, validation circuits and the quality requirements specific to each organization."
              )}
            </p>
            <p>
              {t(
                "Notre approche repose sur trois piliers : continuité opérationnelle, traçabilité des actions et fiabilité des livrables.",
                "Our approach is based on three pillars: operational continuity, traceability of actions and reliability of deliverables."
              )}
            </p>
            <p>
              {t(
                "Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.",
                "Our teams can intervene in French and English, guaranteeing smooth management of exchanges, reporting and operations in an international context."
              )}
            </p>
          </div>

          {/* 3 pillars — horizontal, no icons, no boxes */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-0 border-t border-[#D9B151]/30 pt-10">
            {[
              t("CONTINUITÉ OPÉRATIONNELLE", "OPERATIONAL CONTINUITY"),
              t("TRAÇABILITÉ DES ACTIONS", "TRACEABILITY OF ACTIONS"),
              t("FIABILITÉ DES LIVRABLES", "RELIABILITY OF DELIVERABLES"),
            ].map((label, i) => (
              <React.Fragment key={i}>
                <span className="text-[#122017] font-bold text-[1rem] tracking-wide uppercase whitespace-nowrap py-2 sm:py-0">
                  {label}
                </span>
                {i < 2 && (
                  <div className="hidden sm:block w-px h-6 bg-[#D9B151] mx-10 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </section>

      {/* ══ 3. NOTRE MÉTHODOLOGIE — Fond marron foncé, 5 cartes centrées ══ */}
      <section id="notre-methodologie" className="bg-[#FDFBF7] w-full bg-[#462F1D] py-16 lg:py-24 mb-10 lg:mb-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start">
          <div className="mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
              {t("NOTRE MÉTHODOLOGIE", "OUR METHODOLOGY").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-16 h-[3px] bg-[#D9B151]" />
          </div>

          <div className="w-full flex flex-wrap justify-center gap-6">
            {[
              { icon: Search, title: t("DÉCOUVERTE", "DISCOVERY"), desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.", "Analysis of your organization, processes and constraints to precisely define the scope of intervention.") },
              { icon: ClipboardCheck, title: t("VÉRIFICATIONS PRÉALABLES", "PRELIMINARY CHECKS"), desc: t("Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l'entrée en relation.", "Verification of legal identity, administrative situation and operational coherence of the client or partner, to secure the entry into relation.") },
              { icon: BarChart2, title: t("ANALYSE", "ANALYSIS"), desc: t("Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode and expected deliverables.") },
              { icon: Users, title: t("MISE EN ŒUVRE & FORMATION", "IMPLEMENTATION & TRAINING"), desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into your organization's tools, processes and standards.") },
              { icon: ShieldCheck, title: t("SUIVI DANS LA DURÉE", "LONG-TERM FOLLOW-UP"), desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous mission management, regular adjustments and quality control of deliverables.") },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1rem)] max-w-[400px]">
                <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#D9B151] flex items-center justify-center mb-6 shrink-0">
                  <step.icon size={32} className="text-[#D9B151]" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-xs leading-snug text-white text-center mb-4">{step.title}</h3>
                <p className="text-white/90 text-[0.88rem] leading-[1.8] text-center font-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. ACCRÉDITATIONS & CERTIFICATIONS — Composant pleine largeur avec image ══ */}
      <section id="certifications" className="bg-[#E2E4E1] w-full py-16 lg:py-24 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* Main Text Block with Image Background and Green Overlay */}
          <div className="w-full max-w-[1000px] mx-auto relative rounded-2xl shadow-2xl overflow-hidden p-10 lg:p-16 flex flex-col justify-center">
            
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('/dark_stairs.png')] bg-cover bg-center" />
            
            {/* Green Gradient Overlay (same color #122017 with transparency) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#436850]/95 via-[#436850]/85 to-[#436850]/60" />
            
            {/* Text Content */}
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
                {t("ACCRÉDITATIONS, CERTIFICATIONS & CADRE D'INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS & INTERVENTION FRAMEWORK").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-12 h-[3px] bg-[#D9B151] mb-8" />
              
              <div className="text-white/90 text-[0.95rem] leading-[1.8] space-y-6 font-normal">
                <p>
                  {t(
                    "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
                    "MENUA CONSULTING operates in environments subject to high regulatory requirements."
                  )}
                </p>
                <p>
                  {t(
                    "La dirigeante dispose notamment de la certification AMF, d’une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d’une expérience acquise au sein d’environnements financiers, patrimoniaux et réglementés.",
                    "The CEO holds an AMF certification, a certification in Internal Control and Risk Management of financial institutions, and experience in financial, wealth and regulated environments."
                  )}
                </p>
                <p>
                  {t(
                    "Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).",
                    "The firm works in coordination with the authorized teams of its clients (banks, firms, regulated structures)."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d’agrément et de supervision de ses clients.",
                    "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks."
                  )}
                </p>
                <p>
                  {t(
                    "Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
                    "This system guarantees compliance, operational quality, and process security."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. NOTRE ÉQUIPE — Fond vert foncé, grand portrait ══ */}
      {/* ══ 5. NOTRE ÉQUIPE ══ */}
      <section id="notre-equipe" className="bg-[#E3C29E] w-full py-16 lg:py-24 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            
            {/* Left: Photo */}
            <div className="w-full lg:w-[28%] shrink-0 lg:translate-y-32">
              <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src="/rosette.jpg"
                  alt="La dirigeante"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.currentTarget.style.background = "#1a2e24"; }}
                />
              </div>
            </div>

            {/* Right: Text */}
            <div className="w-full lg:w-[72%] flex flex-col pt-2 lg:pt-4">
              
              {/* Header: 01 — NOTRE ÉQUIPE */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[#D9B151] text-3xl font-bold">01</span>
                <div className="w-8 h-[2px] bg-[#D9B151]"></div>
                <h1 className="text-[#D9B151] text-[0.85rem] font-semibold uppercase tracking-[0.15em] m-0">
                  {t("NOTRE ÉQUIPE", "OUR TEAM")}
                </h1>
              </div>
              
              {/* Title & Subtitle in the exact order requested */}
              <h2 className="text-[#D9B151] text-[1.1rem] md:text-[1.25rem] mb-3 font-normal">
                {t("Une direction impliquée au plus près des opérations", "Management closely involved with operations")}
              </h2>
              
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-12 leading-tight">
                {t("La dirigeante", "The Director")}
              </h3>
              
              {/* Body Text */}
              <div className="text-white/85 text-[1.05rem] leading-[1.8] space-y-6 font-normal">
                <p>
                  {t(
                    "Rosette Fouelefack est directrice générale de MENUA CONSULTING.",
                    "Rosette Fouelefack is the chief executive officer of MENUA CONSULTING."
                  )}
                </p>
                <p>
                  {t(
                    "Elle dispose d’une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d’environnements exigeants.",
                    "She has experience in finance, risk management, wealth management, and back & middle office operations acquired in demanding environments."
                  )}
                </p>
                <p>
                  {t(
                    "Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.",
                    "She directly supervises the structuring of missions, team formation, validation of deliverables, and the quality control system."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING s’appuie sur une organisation agile, composée d’une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                    "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced collaborators or partners mobilized according to client needs."
                  )}
                </p>
                <p>
                  {t(
                    "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d’exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.",
                    "Each mission is governed by monitoring, validation, and control procedures to guarantee a level of execution in line with client expectations and the rigorous standards expected on the French market."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.",
                    "MENUA CONSULTING is based on a four-eyes control principle and continuous supervision of operations to guarantee reliability, rigor, and continuity of service."
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
