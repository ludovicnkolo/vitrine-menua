"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Search, ShieldCheck, BarChart2, Users, CheckCircle, Network, UserCheck, Settings, ArrowRight } from "lucide-react";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/connaitre-hero-v3.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-[center_65%]" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous connaître", "About us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-4">
              {t(
                "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office.",
                "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions."
              )}
            </p>
            <p className="animate-fade-in-up stagger-4 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation.",
                "We provide support to internal teams in a structured framework, defined by the methods, priorities and requirements of each organization."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.2 PRÉSENTATION DU CABINET (Overlapping style, image left) ── */}
      <section id="presentation-du-cabinet" className="relative w-full bg-white section-padding mt-16 lg:mt-0 scroll-mt-20">
        <div className="laplace-container relative">
          
          <div className="block lg:hidden w-full h-[350px] relative z-20">
            <img
              src="/img/connaitre-approche-v3.jpg"
              alt="Cabinet"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Text block — full width on mobile, leaves room for image on left on desktop */}
          <div className="bg-[#f5f7fa] shadow-xl relative z-30 lg:z-10 px-10 lg:px-16 pt-12 pb-14 lg:pl-[38%] -mt-16 lg:mt-0">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("MENUA CONSULTING", "MENUA CONSULTING")}
            </h2>
            <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-8">
              {t(
                "MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office pour des acteurs de la finance, de la comptabilité, de la conformité, de la gestion de patrimoine et de la data.",
                "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions for players in finance, accounting, compliance, wealth management and data."
              )}
            </p>
            <div className="space-y-4 text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
              <p>
                {t(
                  "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
                  "We provide companies, firms and financial players with dedicated operational teams, capable of executing demanding missions with rigor, continuity and reliability."
                )}
              </p>
              <p>
                {t(
                  "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
                  "Our employees integrate into client organizations to take charge of operational execution, optimize internal costs and secure business continuity."
                )}
              </p>
              <p>
                {t(
                  "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                  "This organization allows clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes."
                )}
              </p>
            </div>

          </div>

          {/* Image — absolutely overlapping the left side of the white box */}
          <div className="hidden lg:block absolute -top-24 left-0 w-[36%] h-[75%] z-20">
            <img
              src="/img/connaitre-approche-v3.jpg"
              alt="Cabinet"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Notre approche - Pleine largeur */}
        <div id="notre-approche" className="laplace-container mt-16 lg:mt-24 scroll-mt-20">
          <div className="border-t border-[#141824]/10 pt-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold uppercase tracking-wider mb-6">
                {t("Notre approche", "Our approach")}
              </h2>
              <div className="text-[#141824] text-[1.1rem] leading-relaxed font-light mb-8 space-y-4">
                <p>
                  {t(
                    "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.",
                    "MENUA CONSULTING adopts a resolutely operational posture: clients define needs, methods and priorities, we ensure execution."
                  )}
                </p>
                <p>
                  {t(
                    "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.",
                    "We operate in financial, accounting, wealth and regulated environments, strictly respecting internal procedures, validation circuits and the quality requirements specific to each organization."
                  )}
                </p>
              </div>
              <p className="text-[#141824] font-bold text-[1.1rem] md:text-[1.2rem] mb-8">
                {t("Notre approche repose sur trois piliers :", "Our approach is based on three pillars:")}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-around items-center gap-12 text-[#141824] font-bold uppercase tracking-widest text-[0.85rem] text-center mb-12">
              <div className="flex flex-col items-center justify-center flex-1 w-full p-8 bg-[#f5f7fa] border border-[#e8e1d7] hover:bg-[#141824] hover:text-[#e8e1d7] transition-colors duration-300 group min-h-[100px]">
                <span>{t("continuité opérationnelle", "operational continuity")}</span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1 w-full p-8 bg-[#f5f7fa] border border-[#e8e1d7] hover:bg-[#141824] hover:text-[#e8e1d7] transition-colors duration-300 group min-h-[100px]">
                <span>{t("traçabilité des actions", "traceability of actions")}</span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1 w-full p-8 bg-[#f5f7fa] border border-[#e8e1d7] hover:bg-[#141824] hover:text-[#e8e1d7] transition-colors duration-300 group min-h-[100px]">
                <span>{t("fiabilité des livrables", "reliability of deliverables")}</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[#141824] text-[1.1rem] leading-relaxed font-light">
                {t(
                  "Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.",
                  "Our teams can intervene in French and English, guaranteeing smooth management of exchanges, reporting and operations in an international context."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.4 NOTRE MÉTHODOLOGIE (Dark Navy Section) ── */}
      <section id="notre-methodologie" className="relative w-full bg-[#141824] section-padding scroll-mt-20">
        <div className="laplace-container">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
              <h2 className="text-white text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">{t("Notre méthodologie", "Our methodology")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: t("Découverte", "Discovery"),
                desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.", "Analysis of your organization, your processes and your constraints in order to precisely define the scope of intervention.")
              },
              {
                title: t("Vérifications préalables", "Preliminary checks"),
                desc: t("Vérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.", "Verification of the legal identity, the administrative situation and the operational consistency of the client or partner, in order to secure the onboarding.")
              },
              {
                title: t("Analyse", "Analysis"),
                desc: t("Construction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode and expected deliverables.")
              },
              {
                title: t("Mise en œuvre et formation", "Implementation and training"),
                desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into the tools, processes and standards of your organization.")
              },
              {
                title: t("Suivi dans la durée", "Long-term monitoring"),
                desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous steering of the mission, regular adjustments and quality control of deliverables.")
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white/5 border border-[#e8e1d7]/20 p-8 hover:bg-white/10 transition-all duration-300 flex flex-col items-center text-center">
                <h4 className="text-[1.1rem] font-bold text-white mb-4 min-h-[3rem]">{step.title}</h4>
                <p className="text-white/70 text-[0.95rem] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.5 ACCRÉDITATIONS ET NOTRE ÉQUIPE ── */}
      <section id="certifications" className="relative w-full bg-white section-padding scroll-mt-20">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Beige block with list (Left) */}
          <div className="w-full lg:w-7/12 bg-[#e8e1d7] p-10 lg:p-16 flex flex-col justify-center shadow-xl">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
              {t("ACCRÉDITATIONS, CERTIFICATIONS ET CADRE D'INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS AND INTERVENTION FRAMEWORK")}
            </h2>
            
            <div className="space-y-4 text-[#141824] text-[1.05rem] font-light leading-relaxed">
              <p>
                {t("MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.", "MENUA CONSULTING operates in environments subject to high regulatory requirements.")}
              </p>
              <div className="pt-2 pb-2 border-l-4 border-[#141824]/20 pl-4 my-4">
                <p className="font-medium leading-relaxed">
                  {t(
                    "La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.",
                    "The director notably holds the AMF certification, a certification in Internal Control and Risk Management of financial institutions, as well as experience acquired within financial, wealth and regulated environments."
                  )}
                </p>
              </div>
              <p>
                {t("Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).", "The firm operates in coordination with the authorized teams of its clients (banks, firms, regulated structures).")}
              </p>
              <div className="bg-white/40 border-l-4 border-[#141824] p-5 my-2 shadow-sm">
                <p className="font-bold text-[#141824] text-[1rem]">
                  {t("MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients.", "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into the approval and supervision frameworks of its clients.")}
                </p>
              </div>
              <p className="font-medium pt-2">
                {t("Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.", "This system guarantees compliance, quality of operations, and process security.")}
              </p>
            </div>
          </div>
          
          {/* Image (Right) */}
          <div className="w-full lg:w-5/12 h-[300px] lg:h-[450px] shadow-xl">
             <img src="/img/connaitre-cert.jpg" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── NOTRE ÉQUIPE DETAILS ── */}
      <section id="notre-equipe" className="relative w-full bg-white section-padding scroll-mt-20">
        <div className="laplace-container max-w-4xl mx-auto text-center">
          <div className="inline-block text-left">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="mb-4 text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold uppercase tracking-wider">{t("Notre équipe", "Our team")}</h2>
            <p className="text-[#141824] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
              {t("Une direction impliquée au plus près des opérations", "Management closely involved in operations")}
            </p>
          </div>
          
          <div className="bg-[#141824] text-[#e8e1d7] p-10 md:p-14 shadow-xl text-left">
            <h3 className="text-[1.6rem] font-semibold mb-8 text-white">{t("La dirigeante", "The director")}</h3>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Discreet Photo */}
              <div className="shrink-0 flex flex-col items-center mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] border-[#e8e1d7]/40 bg-[#141824] mb-4">
                  <img 
                    src="/img/rosette.jpg" 
                    alt="Rosette Fouelefack" 
                    className="w-full h-full object-cover object-[center_15%]"
                    onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
                  />
                </div>
                <span className="text-[#e8e1d7] text-[0.85rem] font-bold uppercase tracking-wider text-center leading-tight">
                  Rosette<br/>Fouelefack
                </span>
              </div>

              {/* Text content (main focus) */}
              <div className="flex-1">
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Rosette Fouelefack est présidente de MENUA CONSULTING.",
                    "Rosette Fouelefack is the President of MENUA CONSULTING."
                  )}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Elle dispose d’une expérience en finance, gestion des risques, gestion de patrimoine et opérations back et middle office acquise au sein d’environnements exigeants.",
                    "She has experience in finance, risk management, wealth management and back et middle office operations acquired in demanding environments."
                  )}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.",
                    "She directly supervises the structuring of missions, the constitution of teams, the validation of deliverables and the quality control system."
                  )}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                    "MENUA CONSULTING relies on an agile organization, composed of an operational management in France and outsourced employees or partners mobilized according to clients' needs."
                  )}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.",
                    "Each mission is framed by monitoring, validation and control procedures, in order to guarantee a level of execution in line with the client's expectations and the standards of rigor expected on the French market."
                  )}
                </p>
                <p className="text-[#e8e1d7] font-bold">
                  {t(
                    "MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.",
                    "MENUA CONSULTING relies on a four-eyes control principle and continuous supervision of operations in order to guarantee reliability, rigor and continuity of service."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
