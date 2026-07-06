"use client";
import React from "react";
import Link from "next/link";
import { Landmark, Target, GitMerge, FileCheck, ShieldCheck, ArrowRight, Globe, Users, CheckCircle, RefreshCw, FileText, Search, ClipboardCheck, BarChart2, Network } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous_connaitre_hero.png"
            alt="Nous Connaître"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/60 to-[#0D1B2A]/30" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-white" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-white" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-white" />
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("Le cabinet", "The firm")}</span>
                <span className="block mt-2">{t("Un partenaire de confiance", "A trusted partner")}</span>
                <span className="block mt-2">{t("pour vos opérations financières.", "for your financial operations.")}</span>
              </h1>
              <div className="mb-10 max-w-xl">
                <p className="p-1">
                  {t(
                    "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de leurs fonctions back et middle office. Un engagement fondé sur la rigueur, la continuité et la fiabilité.",
                    "MENUA CONSULTING supports companies in the operational outsourcing of their back and middle office functions. A commitment based on rigor, continuity and reliability."
                  )}
                </p>
              </div>
              <Link href="/nous-connaitre#excellence" className="link-action">
                {t("DÉCOUVRIR NOTRE CABINET", "DISCOVER OUR FIRM")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 1. PRÉSENTATION DU CABINET ══ */}
      <section id="presentation-du-cabinet" className="relative mt-12 py-12">
        <div className="absolute inset-y-0 left-[max(1rem,calc(50vw-550px))] w-[calc(100%-2rem)] lg:w-[850px] bg-[#0D1B2A] z-0 rounded-3xl shadow-sm"></div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

            {/* Text left */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-white" />
                <h2 className="h2-surtitre text-white">
                  {t("MENUA CONSULTING PRÉSENTATION DU CABINET", "MENUA CONSULTING FIRM PRESENTATION").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
                </h2>
              </div>
              <div className="p-2 space-y-5">
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
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl order-first lg:order-none">
              <img
                src="/preCabinet.png"
                alt="Cabinet Menua Consulting"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/banner-desk.jpg"; }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. NOTRE APPROCHE ══ */}
      <section id="notre-approche" className="relative mt-12 py-12">
        <div className="absolute inset-y-0 right-[max(1rem,calc(50vw-550px))] w-[calc(100%-2rem)] lg:w-[850px] bg-[#CFC9C6] z-0 rounded-3xl shadow-sm"></div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">

            {/* Image à gauche */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img src="/notApproche.png" alt="Notre approche" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
            </div>

            {/* Texte à droite */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#0D1B2A]" />
                <h2 className="h2-surtitre text-[#0D1B2A]">
                  {t("Notre approche", "Our approach")}
                </h2>
              </div>
          

              <div className="p-2 text-[#4A4E5A] mb-8 space-y-3">
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
              </div>

              {/* 3 piliers */}
              <div className="flex flex-col gap-5 mb-8">
                {[
                  {
                    icon: Network,
                    title: t("Continuité opérationnelle", "Operational continuity"),
                    desc: t("Notre approche repose sur la continuité des opérations, garantissant une exécution ininterrompue et fiable pour vos équipes.", "Our approach is based on operational continuity, ensuring uninterrupted and reliable execution for your teams."),
                  },
                  {
                    icon: ShieldCheck,
                    title: t("Traçabilité des actions", "Traceability of actions"),
                    desc: t("Chaque intervention est documentée, tracée et conforme aux procédures internes et aux circuits de validation de votre organisation.", "Each intervention is documented, traced and compliant with the internal procedures and validation circuits of your organization."),
                  },
                  {
                    icon: Globe,
                    title: t("Intervention bilingue", "Bilingual intervention"),
                    desc: t("Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges et des reportings dans un contexte international.", "Our teams can intervene in French and English, ensuring smooth management of exchanges and reporting in an international context."),
                  },
                ].map((pilier, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full border border-[#0D1B2A] bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <pilier.icon className="text-[#0D1B2A]" size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="h4-titre text-[#0D1B2A] mb-1">{pilier.title}</h4>
                      <p className="p-3 !text-[#4A4E5A] !text-[0.85rem]">{pilier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══ 3. NOTRE MÉTHODOLOGIE — Fond marron foncé, 5 cartes centrées ══ */}
      <section id="notre-methodologie" className="mt-12 bg-[#0D1B2A] w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-white" />
              <h2 className="h2-surtitre text-white">
                {t("NOTRE MÉTHODOLOGIE", "OUR METHODOLOGY").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-10">
              {[
                { title: t("DÉCOUVERTE", "DISCOVERY"), desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.", "Analysis of your organization, processes and constraints to precisely define the scope of intervention.") },
                { title: t("VÉRIFICATIONS PRÉALABLES", "PRELIMINARY CHECKS"), desc: t("Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l'entrée en relation.", "Verification of legal identity, administrative situation and operational coherence of the client or partner, to secure the entry into relation.") },
                { title: t("ANALYSE", "ANALYSIS"), desc: t("Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode and expected deliverables.") },
                { title: t("MISE EN ŒUVRE ET FORMATION", "IMPLEMENTATION AND TRAINING"), desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into your organization's tools, processes and standards.") },
                { title: t("SUIVI DANS LA DURÉE", "LONG-TERM FOLLOW-UP"), desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous mission management, regular adjustments and quality control of deliverables.") },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center justify-start text-center bg-white/10 border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all h-full">
                  <h4 className="h4-titre text-white mb-3">
                    {step.title}
                  </h4>
                  <p className="text-white/90 text-[0.85rem] leading-[1.6]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. ACCRÉDITATIONS & CERTIFICATIONS ══ */}
      <section id="certifications" className="relative mt-12 py-12 w-full">
        <div className="absolute inset-y-0 left-[max(1rem,calc(50vw-550px))] w-[calc(100%-2rem)] lg:w-[850px] bg-white z-0 rounded-3xl shadow-sm"></div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#0D1B2A]" />
                <h2 className="h2-surtitre text-[#0D1B2A]">
                  {t("Gage de qualité", "Quality assurance")}
                </h2>
              </div>
              <h3 className="h3-section text-[#0D1B2A] pr-4">
                {t("ACCRÉDITATIONS, CERTIFICATIONS ET CADRE D'INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS AND INTERVENTION FRAMEWORK")}
              </h3>
              <div className="p-2 text-[#4A4E5A] mb-10 max-w-xl space-y-4">
                <p>
                  {t(
                    "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
                    "MENUA CONSULTING operates in environments subject to high regulatory requirements."
                  )}
                </p>
                <p>
                  {t(
                    "La presidente dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.",
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
                    "MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients.",
                    "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks."
                  )}
                </p>
                <p className="font-bold text-[#0D1B2A]">
                  {t(
                    "Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
                    "This system guarantees compliance, operational quality, and process security."
                  )}
                </p>
              </div>
            </div>

            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl order-first lg:order-none">
              <img src="/certification.jpg" alt="Certifications" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
            </div>

          </div>
        </div>
      </section>

      {/* ══ 5. NOTRE ÉQUIPE ══ */}
      <section id="notre-equipe" className="mt-12 bg-[#CFC9C6] w-full py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
            
            {/* Left: Photo */}
            <div className="w-full relative">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden z-10">
                <img
                  src="/rosette.jpg"
                  alt="La dirigeante"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
            </div>

            {/* Right: Text */}
            <div className="w-full flex flex-col">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#0D1B2A]" />
                <h2 className="h2-surtitre text-[#0D1B2A]">
                  {t("NOTRE ÉQUIPE", "OUR TEAM")}
                </h2>
              </div>
              
              <h3 className="h3-section text-[#0D1B2A] mb-3">
                {t("La presidente", "The President")}
              </h3>
              
              <h3 className="p-2 !text-[#8B6240] mb-10">
                {t("Une direction impliquée au plus près des opérations", "Management closely involved with operations")}
              </h3>
              
              {/* Body Text */}
              <div className="p-2 text-[#4A4E5A] space-y-4">
                <p className="text-[#0D1B2A] font-bold">
                  {t(
                    "Rosette Fouelefack est directrice générale de MENUA CONSULTING.",
                    "Rosette Fouelefack is the chief executive officer of MENUA CONSULTING."
                  )}
                </p>
                <p>
                  {t(
                    "Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back et middle office acquise au sein d'environnements exigeants.",
                    "She has experience in finance, risk management, wealth management, and back and middle office operations acquired in demanding environments."
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
                    "MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                    "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced collaborators or partners mobilized according to client needs."
                  )}
                </p>
                <p>
                  {t(
                    "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.",
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
