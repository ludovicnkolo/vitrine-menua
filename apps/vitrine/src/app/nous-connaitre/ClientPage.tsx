"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/connaitre-hero.webp" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-[center_65%]" 
            onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous connaître", "About us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t("Une organisation opérationnelle structurée pour accompagner les entreprises dans l'exécution fiable de leurs fonctions back ", "A trusted operational partner working closely with businesses to deliver reliable back ")}
              <span className="font-sans font-medium">&amp;</span>
              {t(" middle office.", " middle-office support.")}
            </p>
            <div className="mt-4">
              <Link href="#notre-approche" className="inline-flex items-center gap-2 px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.8rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                {t("Découvrir notre approche", "Discover our approach")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.2 MENUA CONSULTING (Overlapping style, image left) ── */}
      <section id="presentation-du-cabinet" className="relative w-full bg-white pt-12 md:pt-[5.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container relative z-10">
          {/* BREADCRUMB */}
          <div className="absolute -top-8 md:-top-[4rem] left-0 z-50">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Nous connaître", "About us")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row-reverse items-center">
            
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[420px] z-20 relative shrink-0">
              <img
                src="/img/connaitre_2.webp"
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
                  src="/img/connaitre_2.webp"
                  alt="Cabinet"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="space-y-4 text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
                <p>
                  {formatBrand(t(
                    "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office.",
                    "MENUA CONSULTING specialises in the operational outsourcing of back and middle-office functions."
                  ))}
                </p>
                <p>
                  {t(
                    "Nous accompagnons les entreprises, les cabinets et les organisations qui souhaitent fiabiliser leurs opérations, sécuriser leurs processus et assurer la continuité de leurs activités quotidiennes.",
                    "We support businesses, professional firms and other organisations seeking to improve operational reliability, strengthen their processes and maintain continuity across day-to-day activities."
                  )}
                </p>
                <p>
                  {t(
                    "Notre intervention s’adresse notamment aux équipes financières, comptables, patrimoniales, IT, data et réglementées, ainsi qu’aux cabinets de gestion de patrimoine à la recherche d’un support opérationnel structuré et fiable.",
                    "Our services are designed in particular for finance, accounting, IT and data teams, teams operating in regulated environments, and wealth management firms seeking structured and dependable operational support."
                  )}
                </p>
                <p>
                  {formatBrand(t(
                    "MENUA CONSULTING adopte une posture résolument exécutante. Nos clients définissent leurs besoins, leurs procédures, leurs priorités et leurs circuits de validation. Nous prenons ensuite en charge la réalisation opérationnelle des tâches confiées, dans le respect de leurs instructions, avec rigueur, confidentialité et traçabilité.",
                    "MENUA CONSULTING takes a firmly delivery-focused approach while maintaining a close working relationship with each client. Our clients define their requirements, procedures, priorities and approval workflows. We then carry out the assigned activities with rigour, confidentiality and traceability, under the appropriate level of supervision whenever required."
                  ))}
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Présenter votre besoin", "Tell us about your requirements")} 
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
            
            <div className="space-y-6 text-[#6e7891] text-[1.05rem] md:text-[1.1rem] font-light leading-relaxed">
              <p>
                {formatBrand(t(
                  "MENUA CONSULTING accompagne les entreprises, cabinets et organisations dans l’externalisation de leurs fonctions back et middle office en français et en anglais, afin de renforcer la fiabilité de leurs opérations, d’optimiser leurs ressources et de garantir la continuité de leurs activités.",
                  "MENUA CONSULTING supports its clients in both French and English through a responsive, collaborative working relationship. We help improve operational reliability, make better use of internal resources and maintain business continuity."
                ))}
              </p>
              <p>
                {t(
                  "Cette approche permet aux équipes internes de se concentrer sur les décisions stratégiques, les validations réglementaires et la relation client, tout en sécurisant le traitement opérationnel des activités back et middle office.",
                  "This enables internal teams to focus on strategic decisions, regulatory approvals and client relationships while ensuring dependable delivery across back and middle-office activities."
                )}
              </p>
            </div>
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

              {/* Mobile Image */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden">
                <img 
                  src="/img/connaitre-approche.webp" 
                  alt="Notre approche" 
                  className="w-full h-full object-cover object-center" 
                  onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
                />
              </div>

              <div className="w-[85%] aspect-[4/5] rounded-sm overflow-hidden shadow-lg hidden lg:block">
                <img 
                  src="/img/connaitre-approche.webp" 
                  alt="Notre approche" 
                  className="w-full h-full object-cover object-left" 
                  onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} 
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
                    "Providing the right level of support during periods of increased workload, transition or temporary need so that day-to-day activities continue to run smoothly."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Suivi et traçabilité", "Monitoring and traceability")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Structurer le suivi des interventions, documenter les principales étapes et offrir au client une visibilité claire sur l’avancement des travaux réalisés.",
                    "Structuring delivery, documenting key stages and giving clients clear visibility over work in progress."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Confidentialité", "Confidentiality")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Protéger les informations, les documents et les données traités dans le cadre des missions, conformément aux exigences de discrétion et de confidentialité définies avec le client.",
                    "Protecting the information, documents and data processed during each engagement in line with client requirements and applicable rules."
                  )}
                </p>
              </div>
              <div className="bg-[#f5f7fa] p-8 border-l-4 border-[#141824]">
                <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Qualité des livrables", "Quality of deliverables")}</h4>
                <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                  {t(
                    "Remettre des travaux contrôlés, directement exploitables et conformes aux procédures, aux formats et aux attentes préalablement établis.",
                    "Producing reviewed, usable outputs that meet the agreed procedures, formats and expectations."
                  )}
                </p>
              </div>

              <div className="md:col-span-2 mt-6 flex items-start gap-4 px-4">
                <div className="w-8 h-[1px] bg-[#6e7891] mt-3 flex-shrink-0" />
                <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
                  {t(
                    "Nos équipes interviennent en français et en anglais pour faciliter les échanges, le traitement des opérations et la production de reportings dans des environnements nationaux ou internationaux.",
                    "Our teams can work in French and English, supporting communication, operational processing and reporting in both domestic and international environments."
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
          <div className="text-center mb-20 ">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">{t("Notre méthodologie", "Our methodology")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                id: "decouverte",
                title: t("Découverte", "Discovery"),
                desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.", "We review your organisation, processes and constraints to define a precise scope of work.")
              },
              {
                id: "verifications",
                title: t("Vérifications préalables", "Pre-engagement checks"),
                desc: t("Vérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.", "We verify the legal identity, administrative standing and operational consistency of the client or partner before onboarding.")
              },
              {
                id: "analyse",
                title: t("Analyse", "Assessment and proposal"),
                desc: t("Construction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation, les délais et les livrables attendus.", "We design an operational arrangement covering the required profiles, delivery model, timescales, responsibilities and expected outputs.")
              },
              {
                id: "mise-en-oeuvre",
                title: <>{t("Mise en œuvre ", "Implementation ")}<span className="font-sans font-medium">&amp;</span>{t(" intégration", " integration")}</>,
                desc: t("Déploiement des équipes, intégration aux outils, aux procédures et aux standards de votre organisation.", "We onboard the team into the client’s tools, procedures and quality standards.")
              },
              {
                id: "suivi",
                title: t("Suivi dans la durée", "Ongoing oversight"),
                desc: t("Pilotage continu de la mission, ajustements réguliers, contrôle qualité et suivi des livrables.", "We monitor the engagement, review quality, make agreed adjustments and track deliverables at the required frequency.")
              }
            ].map((step) => (
              <div key={step.id} className="bg-white/50 border border-[#141824]/10 p-8 hover:bg-white/80 transition-all duration-300 flex flex-col items-center text-center shadow-sm">
                <h4 className="text-[1.1rem] font-bold text-[#141824] mb-4 min-h-[3rem]">{step.title}</h4>
                <p className="text-[#6e7891] text-[0.95rem] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-right">
            <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
              {t("Présenter votre besoin", "Tell us about your requirements")}
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
              {t("Une direction impliquée au plus près des opérations.", "Leadership closely involved in operational delivery.")}
            </p>
          </div>
          
          <div className="bg-[#141824] text-[#e8e1d7] p-10 md:p-14 shadow-xl text-left">
            <h3 className="text-[1.6rem] font-semibold mb-8 text-white">{t("La dirigeante", "Founder and President")}</h3>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Discreet Photo */}
              <div className="shrink-0 flex flex-col items-center mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] border-[#e8e1d7]/40 bg-[#141824] mb-4">
                  <img 
                    src="/img/rosette.webp" 
                    alt="Rosette Fouelefack" 
                    className="w-full h-full object-cover object-[center_15%]"
                    onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
                  />
                </div>
                <span className="text-[#e8e1d7] text-[1rem] font-bold uppercase tracking-wider text-center leading-tight">
                  Rosette Fouelefack
                </span>
                <span className="text-[#e8e1d7]/70 text-[0.85rem] mt-2 font-medium text-center">
                  {formatBrand(t("Présidente de MENUA CONSULTING", "President of MENUA CONSULTING"))}
                </span>
              </div>

              {/* Text content (main focus) */}
              <div className="flex-1">
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t("Rosette Fouelefack dispose d’une expérience en finance, gestion des risques, conformité, appui aux environnements patrimoniaux et opérations back ", "Rosette Fouelefack has experience across finance, risk management, compliance, wealth-management environments and back ")}<span className="font-sans font-medium">&amp;</span>{t(" middle office, acquise auprès d’organisations bancaires, financiers réglementés.", " middle-office operations, gained within banking, financial and regulated organisations.")}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {formatBrand(t(
                    "Elle a fondé MENUA CONSULTING avec l’objectif de proposer aux entreprises un appui opérationnel fiable, structuré et flexible, capable de renforcer l’exécution des fonctions back et middle office tout en respectant les procédures internes de chaque client.",
                    "She founded MENUA CONSULTING to provide businesses with reliable, structured and flexible operational support that strengthens the delivery of back and middle-office functions while respecting each client’s internal procedures."
                  ))}
                </p>
                <p className="text-[#e8e1d7] font-bold leading-relaxed">
                  {formatBrand(t(
                    "MENUA CONSULTING s’appuie sur une organisation agile, pilotée depuis la France et complétée, selon les besoins des missions, par des collaborateurs ou partenaires sélectionnés et encadrés.",
                    "MENUA CONSULTING operates through an agile model led from France and complemented, depending on the engagement, by carefully selected and supervised professionals or partners."
                  ))}
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
              {t("Formations, certifications et expertises", "Training, certifications and expertise")}
            </h2>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden">
              <img src="/img/connaitre-certifications.webp" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} />
            </div>
            
            <div className="space-y-4 text-[#141824] text-[1.05rem] font-light leading-relaxed">
              <p>
                {formatBrand(t(
                  "MENUA CONSULTING intervient dans des environnements soumis à des exigences élevées en matière de conformité, de qualité et de traçabilité.", 
                  "MENUA CONSULTING works in environments with demanding compliance, quality and traceability requirements."
                ))}
              </p>
              <p>
                {t(
                  "Pour répondre à des besoins spécifiques, le cabinet peut également s’appuyer sur un réseau de partenaires qualifiés, notamment sur des sujets liés aux métiers de la comptabilité, de la data, du reporting et du pilotage de gestion.", 
                  "Depending on the scope, the firm can draw on relevant capabilities in accounting, data, reporting and performance management."
                )}
              </p>
              <p>
                {t(
                  "Cette organisation permet de proposer une réponse flexible et adaptée, tout en conservant un cadre de suivi clair, une exigence de confidentialité et une qualité d’exécution conforme aux attentes du client.", 
                  "This structure ensures a flexible and tailored response while maintaining clear oversight, strict confidentiality and execution quality that meets client expectations."
                )}
              </p>
              <div className="bg-white/40 border-l-4 border-[#141824] p-5 my-2 shadow-sm">
                <p className="font-bold text-[#141824] text-[1rem]">
                  {formatBrand(t(
                    "MENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet intervient en support opérationnel, dans le cadre des procédures, agréments et validations propres à ses clients.", 
                    "MENUA CONSULTING does not carry out regulated activities in its own name. It provides operational support within the procedures, permissions, regulatory approvals, controls and validation frameworks of its clients."
                  ))}
                </p>
              </div>
              <div className="mt-12 pt-4 border-t border-[#141824]/10">
                <p className="font-bold text-[#141824] mb-6">{t("La dirigeante dispose notamment :", "The executive notably holds:")}</p>
                <div className="space-y-4 text-[0.95rem] text-[#141824]/80">
                  <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0 mt-[0.45rem]"></div><span className="font-semibold">{t("Certification AMF · Contrôle interne et risques · Finance d'entreprise · Back et middle office", "AMF certification · Internal control and risk · Corporate finance · Back and middle office")}</span></div>
                  <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0 mt-[0.45rem]"></div><span className="font-semibold">{t("Conformité financière · Gestion des risques · Analyse financière · KYC / AML / reporting", "Financial compliance · Risk management · Financial analysis · KYC / AML / CTF and reporting")}</span></div>






                </div>
              </div>
              
              <div className="mt-12 text-right">
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group">
                  {t("Présenter votre besoin", "Tell us about your requirements")}
                  <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                  <ChevronRight size={18} className="-ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Image (Right Desktop only) */}
          <div className="hidden lg:block w-full lg:w-5/12 h-[300px] lg:h-[450px] shadow-xl">
             <img src="/img/connaitre-certifications.webp" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} />
          </div>
        </div>
      </section>



    </main>
  );
}
