"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowRight, ChevronRight } from "lucide-react";

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
            onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous connaître", "About us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-8">
              {t("Un cabinet opérationnel, structuré pour accompagner les entreprises dans l’exécution fiable de leurs fonctions back ", "An operational firm, structured to support companies in the reliable execution of their back ")}<span className="font-sans font-medium">&amp;</span>{t(" middle office.", " middle office.")}
            </p>
            <div className="animate-fade-in-up stagger-4 mb-8">
              <Link href="#notre-approche" className="inline-flex items-center gap-3 px-8 py-4 bg-[#e8e1d7] text-[#141824] uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white transition-colors group">
                {t("Découvrir notre approche", "Discover our approach")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.2 MENUA CONSULTING (Overlapping style, image left) ── */}
      <section id="presentation-du-cabinet" className="relative w-full bg-white pt-12 md:pt-[5.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center">
            
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[420px] z-20 relative shrink-0">
              <img
                src="/img/connaitre-approche-v3.jpg"
                alt="Cabinet"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Left Overlapping Grey Box */}
            <div className="w-full lg:w-10/12 px-6 py-10 lg:px-12 lg:pl-20 lg:pr-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-mr-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                {t("MENUA CONSULTING", "MENUA CONSULTING")}
              </h2>

              {/* Mobile Image (Visible only on mobile) */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 z-20 relative shadow-md">
                <img
                  src="/img/connaitre-approche-v3.jpg"
                  alt="Cabinet"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-8">
                {t(
                  "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office.",
                  "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions."
                )}
              </p>
              <div className="space-y-4 text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
                <p>
                  {t(
                    "Nous accompagnons les entreprises, les cabinets et les organisations qui souhaitent fiabiliser leurs opérations, sécuriser leurs processus et assurer la continuité de leurs activités quotidiennes.",
                    "We support companies, firms and organizations that wish to make their operations reliable, secure their processes and ensure the continuity of their daily activities."
                  )}
                </p>
                <p>
                  {t(
                    "Notre intervention s’adresse notamment aux équipes financières, comptables, conformité, data et réglementées, ainsi qu’aux cabinets de gestion de patrimoine à la recherche d’un support opérationnel structuré et fiable.",
                    "Our intervention is particularly aimed at financial, accounting, compliance, data and regulated teams, as well as wealth management firms looking for structured and reliable operational support."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING adopte une posture résolument exécutante. Nos clients définissent leurs besoins, leurs procédures, leurs priorités et leurs circuits de validation. Nous prenons ensuite en charge la réalisation opérationnelle des tâches confiées, dans le respect de leurs instructions, avec rigueur, confidentialité et traçabilité.",
                    "MENUA CONSULTING adopts a resolutely executing posture. Our clients define their needs, their procedures, their priorities and their validation circuits. We then take charge of the operational execution of the assigned tasks, in compliance with their instructions, with rigor, confidentiality and traceability."
                  )}
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Présenter un besoin", "Submit a need")} 
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ArrowRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* 2.3 Notre Expertise */}
      <div id="notre-expertise" className="laplace-container mt-20 lg:mt-32 scroll-mt-20">
        <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Col: Spacer */}
          <div className="hidden lg:block lg:w-4/12"></div>

          {/* Right Col: Title & Content on the same vertical */}
          <div className="w-full lg:w-8/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-6" />
            <h2 className="text-[#141824] text-[1.5rem] md:text-[1.8rem] font-bold uppercase tracking-widest mb-8">
              {t("Notre Expertise", "Our Expertise")}
            </h2>
            
            <p className="text-[#141824] text-[1.2rem] md:text-[1.3rem] font-medium leading-relaxed mb-6">
              {t(
                "MENUA CONSULTING accompagne les entreprises, cabinets et organisations dans l’externalisation de leurs fonctions back et middle office en français et en anglais, afin de renforcer la fiabilité de leurs opérations, d’optimiser leurs ressources et de garantir la continuité de leurs activités.",
                "MENUA CONSULTING supports companies, firms and organizations in the outsourcing of their back and middle office functions in French and English, in order to strengthen the reliability of their operations, optimize their resources and ensure the continuity of their activities."
              )}
            </p>
            <p className="text-[#6e7891] text-[1.05rem] md:text-[1.1rem] font-light leading-relaxed">
              {t(
                "Cette approche permet aux équipes internes de se concentrer sur les décisions stratégiques, les validations réglementaires et la relation client, tout en sécurisant le traitement opérationnel des activités back et middle office.",
                "This approach allows internal teams to focus on strategic decisions, regulatory validations and customer relations, while securing the operational processing of back and middle office activities."
              )}
            </p>
          </div>
        </div>
      </div>

        {/* 2.4 Notre approche */}
        <div id="notre-approche" className="laplace-container mt-16 lg:mt-32 scroll-mt-20">
          <div className="w-full border-t border-[#141824]/10 pt-16 lg:pt-24 flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Col: Title & Intro */}
            <div className="w-full lg:w-4/12">
              <div className="w-16 h-[3px] bg-[#141824] mb-6" />
              <h2 className="text-[#141824] text-[1.5rem] md:text-[1.8rem] font-bold uppercase tracking-widest mb-8">
                {t("Notre approche", "Our approach")}
              </h2>
              <p className="text-[#141824] font-bold text-[1.1rem] uppercase tracking-wider mb-8">
                {t("Notre approche repose sur quatre principes :", "Our approach is based on four principles:")}
              </p>
              <div className="w-[85%] aspect-[4/5] rounded-sm overflow-hidden shadow-lg hidden lg:block">
                <img 
                  src="/img/connaitre_3.jpg" 
                  alt="Notre approche" 
                  className="w-full h-full object-cover object-left" 
                  onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.jpg"; }} 
                />
              </div>
            </div>

            {/* Right Col: Pillars */}
            <div className="w-full lg:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Continuité opérationnelle", "Operational continuity")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Apporter un renfort adapté lors des périodes de surcharge, de transition ou de besoin ponctuel, afin de préserver la fluidité des activités.",
                    "Provide adapted reinforcement during periods of overload, transition or one-off need, in order to preserve the fluidity of activities."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Suivi et traçabilité", "Monitoring and traceability")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Structurer le suivi des interventions, documenter les principales étapes et offrir au client une visibilité claire sur l’avancement des travaux réalisés.",
                    "Structure the monitoring of interventions, document the main steps and offer the client clear visibility on the progress of the work carried out."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Confidentialité", "Confidentiality")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Protéger les informations, les documents et les données traités dans le cadre des missions, conformément aux exigences de discrétion et de confidentialité définies avec le client.",
                    "Protect the information, documents and data processed in the context of missions, in accordance with the discretion and confidentiality requirements defined with the client."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Qualité des livrables", "Quality of deliverables")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Remettre des travaux contrôlés, directement exploitables et conformes aux procédures, aux formats et aux attentes préalablement établis.",
                    "Deliver controlled work, directly usable and strictly in accordance with previously established procedures, formats and expectations."
                  )}
                </p>
              </div>

              <div className="md:col-span-2 mt-6 flex items-start gap-4 px-4">
                <div className="w-8 h-[1px] bg-[#6e7891] mt-3 flex-shrink-0" />
                <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
                  {t(
                    "Nos équipes interviennent en français et en anglais pour faciliter les échanges, le traitement des opérations et la production de reportings dans des environnements nationaux ou internationaux.",
                    "Our teams intervene in French and English to facilitate exchanges, the processing of operations and the production of reports in national or international environments."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.5 NOTRE MÉTHODOLOGIE (Beige Section) ── */}
      <section id="notre-methodologie" className="relative w-full bg-[#e8e1d7] pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">{t("Notre méthodologie", "Our methodology")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: t("1. Découverte", "1. Discovery"),
                desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.", "Analysis of your organization, your processes and your constraints in order to precisely define the scope of intervention.")
              },
              {
                title: t("2. Vérifications préalables", "2. Preliminary checks"),
                desc: t("Vérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.", "Verification of the legal identity, the administrative situation and the operational consistency of the client or partner, in order to secure the onboarding.")
              },
              {
                title: t("3. Analyse", "3. Analysis"),
                desc: t("Construction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation, les délais et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode, deadlines and expected deliverables.")
              },
              {
                title: <>{t("4. Mise en œuvre ", "4. Implementation ")}<span className="font-sans font-medium">&amp;</span>{t(" intégration", " integration")}</>,
                desc: t("Déploiement des équipes, intégration aux outils, aux procédures et aux standards de votre organisation.", "Deployment of teams, integration into the tools, procedures and standards of your organization.")
              },
              {
                title: t("5. Suivi dans la durée", "5. Long-term monitoring"),
                desc: t("Pilotage continu de la mission, ajustements réguliers, contrôle qualité et suivi des livrables.", "Continuous steering of the mission, regular adjustments, quality control and monitoring of deliverables.")
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white/50 border border-[#141824]/10 p-8 hover:bg-white/80 transition-all duration-300 flex flex-col items-center text-center shadow-sm">
                <h4 className="text-[1.1rem] font-bold text-[#141824] mb-4 min-h-[3rem]">{step.title}</h4>
                <p className="text-[#6e7891] text-[0.95rem] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-right">
            <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
              {t("Présenter un besoin", "Submit a need")}
              <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={18} className="-ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2.6 NOTRE ÉQUIPE ── */}
      <section id="notre-equipe" className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-4xl mx-auto text-center">
          <div className="inline-block text-left mb-10">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="mb-4 text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold uppercase tracking-wider">{t("Notre équipe", "Our team")}</h2>
            <p className="text-[#141824] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
              {t("Une direction impliquée au plus près des opérations.", "Management closely involved in operations.")}
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
                    onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
                  />
                </div>
                <span className="text-[#e8e1d7] text-[1rem] font-bold uppercase tracking-wider text-center leading-tight">
                  Rosette Fouelefack
                </span>
                <span className="text-[#e8e1d7]/70 text-[0.85rem] mt-2 font-medium text-center">
                  {t("Présidente de MENUA CONSULTING", "President of MENUA CONSULTING")}
                </span>
              </div>

              {/* Text content (main focus) */}
              <div className="flex-1">
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t("Rosette Fouelefack dispose d’une expérience en finance, gestion des risques, conformité, appui aux environnements patrimoniaux et opérations back ", "Rosette Fouelefack has experience in finance, risk management, compliance, support for wealth environments and back ")}<span className="font-sans font-medium">&amp;</span>{t(" middle office, acquise auprès d’organisations bancaires, financiers réglementés.", " middle office operations, acquired from banking organizations and regulated financial institutions.")}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Elle a fondé MENUA CONSULTING avec l’objectif de proposer aux entreprises un appui opérationnel fiable, structuré et flexible, capable de renforcer l’exécution des fonctions back et middle office tout en respectant les procédures internes de chaque client.",
                    "She founded MENUA CONSULTING with the aim of offering companies reliable, structured and flexible operational support, capable of strengthening the execution of back and middle office functions while respecting each client's internal procedures."
                  )}
                </p>
                <p className="text-[#e8e1d7] font-bold leading-relaxed">
                  {t(
                    "MENUA CONSULTING s’appuie sur une organisation agile, composée d’une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                    "MENUA CONSULTING relies on an agile organization, composed of an operational management in France and outsourced employees or partners mobilized according to clients' needs."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.7 ACCRÉDITATIONS ET NOTRE ÉQUIPE ── */}
      <section id="certifications" className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          {/* Beige block with list (Left) */}
          <div className="w-full lg:w-7/12 bg-[#e8e1d7] px-6 py-10 lg:pt-16 lg:pb-16 lg:pl-20 lg:pr-32 flex flex-col justify-center shadow-xl">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
              {t("Accréditations, certifications et cadre d’intervention", "Accreditations, certifications and intervention framework")}
            </h2>
            
            <div className="space-y-4 text-[#141824] text-[1.05rem] font-light leading-relaxed">
              <p>
                {t(
                  "MENUA CONSULTING intervient dans des environnements soumis à des exigences élevées en matière de conformité, de qualité et de traçabilité.", 
                  "MENUA CONSULTING operates in environments subject to high requirements in terms of compliance, quality and traceability."
                )}
              </p>
              <p>
                {t(
                  "Pour répondre à des besoins spécifiques, le cabinet peut également s’appuyer sur un réseau de partenaires qualifiés, notamment sur des sujets liés aux métiers de la comptabilité, de la data, du reporting et du pilotage de gestion.", 
                  "To meet specific needs, the firm can also rely on a network of qualified partners, particularly on subjects related to accounting, data, reporting and management steering."
                )}
              </p>
              <p>
                {t(
                  "Cette organisation permet de proposer une réponse flexible et adaptée, tout en conservant un cadre de suivi clair, une exigence de confidentialité et une qualité d’exécution conforme aux attentes du client.", 
                  "This organization makes it possible to offer a flexible and adapted response, while maintaining a clear monitoring framework, a confidentiality requirement and a quality of execution in line with client expectations."
                )}
              </p>
              <div className="bg-white/40 border-l-4 border-[#141824] p-5 my-2 shadow-sm">
                <p className="font-bold text-[#141824] text-[1rem]">
                  {t(
                    "MENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet intervient en support opérationnel, dans le cadre des procédures, agréments et validations propres à ses clients.", 
                    "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides operational support, within the framework of its clients' own procedures, approvals and validations."
                  )}
                </p>
              </div>
              <div className="mt-12 pt-4 border-t border-[#141824]/10">
                <p className="font-bold text-[#141824] mb-6">{t("La dirigeante dispose notamment :", "The executive notably holds:")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-[0.95rem] font-semibold text-[#141824]/80">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Certification AMF", "AMF Certification")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Contrôle interne ", "Internal control ")}<span className="font-sans font-medium">&amp;</span>{t(" risques", " risks")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Finance d’entreprise", "Corporate finance")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Back ", "Back ")}<span className="font-sans font-medium">&amp;</span>{t(" middle office", " middle office")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Conformité financière", "Financial compliance")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Gestion des risques", "Risk management")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("Analyse financière", "Financial analysis")}</span></div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0"></div><span>{t("KYC / AML / reporting", "KYC / AML / reporting")}</span></div>
                </div>
              </div>
              
              <div className="mt-12 text-right">
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Présenter un besoin", "Submit a need")}
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ChevronRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Image (Right) */}
          <div className="w-full lg:w-5/12 h-[300px] lg:h-[450px] shadow-xl">
             <img src="/img/connaitre-cert.jpg" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.jpg"; }} />
          </div>
        </div>
      </section>



    </main>
  );
}
