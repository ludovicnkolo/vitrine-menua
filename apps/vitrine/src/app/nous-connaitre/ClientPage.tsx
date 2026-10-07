"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function NousConnaitrePage() {
  const { t, lang } = useLanguage();
  const isEN = lang === 'EN';

  return (
    <main className="flex flex-col w-full min-h-screen">

      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/connaitre-hero.webp"
            alt={t("Arrière-plan", "Hero Background")}
            className="w-full h-full object-cover object-[center_65%]"
            onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10  landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-12 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Nous connaître", "About us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t("Une organisation opérationnelle structurée pour accompagner les entreprises dans l'exécution fiable de leurs fonctions back ", "A specialised operational organisation supporting businesses in the reliable execution of their back ")}
              <span className="font-sans font-medium">&amp;</span>
              {t(" middle office.", " middle office functions.")}
            </p>
            <div className="mt-4">
              <Link href="#notre-approche" className="inline-flex items-center gap-2 text-left px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                <span className={`hidden xl:!inline ${!isEN ? 'sm:inline' : 'sm:hidden'}`}>
                  {t("Découvrir notre approche", "Discover our approach")}
                </span>
                <span className={`flex flex-col items-start xl:!hidden ${!isEN ? 'sm:hidden' : 'sm:flex'}`}>
                  <span>{t("Découvrir notre", "Discover our")}</span>
                  <span>{t("approche", "approach")}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.2 MENUA CONSULTING (Overlapping style, image right) ── */}
      <section id="presentation-du-cabinet" className="relative w-full bg-white py-16 lg:py-20 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          {/* BREADCRUMB */}
          <div className="w-full mb-8 md:mb-12">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Nous connaître", "About us")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row-reverse lg:items-center">

            {/* Right Image */}
            <div className="hidden lg:flex w-5/12 shrink-0 z-20 items-center justify-start">
              <div className="w-[85%] lg:h-[420px] relative overflow-hidden shadow-xl">
                <img
                  src="/img/connaitre_2.webp"
                  alt={t("Cabinet", "Firm")}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Left Card */}
            <div className="w-full lg:w-8/12 lg:-mr-16 z-10 flex items-center">
              <div className="w-full bg-[#f5f7fa] shadow-xl px-6 portrait:sm:px-10 lg:pl-14 lg:pr-28 py-10 lg:py-14">
                <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                  {t("MENUA CONSULTING", "MENUA CONSULTING")}
                </h2>

                {/* Mobile Image */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                  <img
                    src="/img/connaitre_2.webp"
                    alt={t("Cabinet", "Firm")}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="space-y-4 text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
                  <p>
                    {formatBrand(t(
                      "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office.",
                      "MENUA CONSULTING specialises in the operational outsourcing of back and middle office functions."
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
                      "Notre intervention s’adresse notamment aux équipes financières, comptables, patrimoniales, IT, data et réglementées, ainsi qu’aux cabinets de gestion de patrimoine à la recherche d’un support opérationnel structuré et fiable pour la réalisation de travaux d'analyse financière, de contrôles et de suivi administratif.",
                      "Our services are designed in particular for finance, accounting, IT and data teams, teams operating in regulated environments, and wealth management firms seeking structured and dependable operational support for financial analysis, compliance checks and administrative tracking."
                    )}
                  </p>
                  <p>
                    {formatBrand(t(
                      "MENUA CONSULTING adopte une posture résolument exécutante. Nos clients définissent leurs besoins, leurs procédures, leurs priorités et leurs circuits de validation. Nous prenons ensuite en charge la réalisation opérationnelle des tâches confiées, dans le respect de leurs instructions, avec rigueur, confidentialité et traçabilité.",
                      "MENUA CONSULTING takes a firmly delivery-focused approach. Our clients define their requirements, procedures, priorities and approval workflows. We then carry out the assigned operational tasks with rigour, confidentiality and traceability, in accordance with their instructions and under the required level of supervision."
                    ))}
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right">
                    <span className="max-w-[18ch] portrait:sm:max-w-[24ch] landscape:max-lg:max-w-[21ch] landscape:lg:max-w-[22ch] xl:max-w-none">{t("Présenter votre besoin", "Tell us about your requirements")}</span>
                    <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                    <ChevronRight size={18} className="-ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2.3 Notre Expertise */}
        <div id="notre-expertise" className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16 mt-16 lg:mt-20 scroll-mt-20">
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
                    "MENUA CONSULTING accompagne les entreprises, cabinets et organisations dans la prise en charge de leurs fonctions back et middle office en français et en anglais, incluant notamment les travaux d'analyse financière préparatoire, de contrôle documentaire et de reporting, afin de renforcer la fiabilité de leurs opérations et de garantir la continuité de leurs activités.",
                    "MENUA CONSULTING supports businesses, professional firms and other organisations in the delivery of their back and middle office functions, in both French and English. This includes preparatory financial analysis, documentary review and reporting, with the aim of improving operational reliability and maintaining business continuity."
                  ))}
                </p>
                <p>
                  {t(
                    "Cette approche permet aux équipes internes de se concentrer sur les décisions stratégiques, les validations réglementaires et la relation client, tout en sécurisant le traitement opérationnel des activités back et middle office.",
                    "This enables internal teams to focus on strategic decisions, regulatory approvals and client relationships, while ensuring dependable delivery across back and middle office activities."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 2.4 Notre approche */}
      <section id="notre-approche" className="relative w-full bg-white pb-16 lg:pb-20 pt-0 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16">

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
              <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[280px] portrait:sm:h-[320px] my-6 rounded-sm shadow-md overflow-hidden">
                <img
                  src="/img/connaitre-approche.webp"
                  alt={t("Notre approche", "Our approach")}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }}
                />
              </div>

              <div className="w-[85%] aspect-[4/5] rounded-sm overflow-hidden shadow-lg hidden lg:block">
                <img
                  src="/img/connaitre-approche.webp"
                  alt={t("Notre approche", "Our approach")}
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
      <section id="notre-methodologie" className="relative w-full bg-[#e8e1d7] py-16 lg:py-20 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5 mx-auto" />
              <h2 className="text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider text-center">{t("Notre méthodologie", "Our methodology")}</h2>
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
                desc: t(
                  "Avant toute entrée en relation, MENUA vérifie les informations essentielles du client nécessaires à la bonne exécution de la mission : identité juridique, coordonnées et éléments administratifs utiles, ainsi que la cohérence du besoin exprimé avec le périmètre d’intervention de MENUA.",
                  "Before any engagement begins, MENUA verifies the essential client information required for proper delivery of the assignment: legal identity, contact details and relevant administrative information, as well as the consistency of the stated requirement with MENUA’s scope of services."
                )
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

          <div className="mt-8 flex justify-end">
            <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right">
              <span className="max-w-[18ch] portrait:sm:max-w-[24ch] landscape:max-lg:max-w-[21ch] landscape:lg:max-w-[22ch] xl:max-w-none">{t("Présenter votre besoin", "Tell us about your requirements")}</span>
              <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
              <ChevronRight size={18} className="-ml-2" />
            </Link>
          </div>
        </div>
      </section>



      {/* ── 2.6 NOTRE ÉQUIPE ── */}
      <section id="notre-equipe" className="relative w-full bg-white py-16 lg:py-20 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16 max-w-4xl mx-auto text-center">
          <div className="inline-block text-left mb-10 text-center">
            <div className="w-16 h-[3px] bg-[#141824] mb-5 mx-auto" />
            <h2 className="mb-4 text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold uppercase tracking-wider">{t("Notre équipe", "Our team")}</h2>
            <p className="text-[#141824] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
              {t("Une direction impliquée au plus près des opérations.", "Leadership closely involved in operational delivery.")}
            </p>
          </div>

          <div className="bg-[#141824] text-[#e8e1d7] p-10 md:p-14 shadow-xl text-left">
            <h3 className="text-[1.6rem] font-semibold mb-8 text-white">{t("La dirigeante", "Founder and President")}</h3>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Photo */}
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

              {/* Text content */}
              <div className="flex-1">
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t("Rosette Fouelefack dispose d’une expérience en finance, gestion des risques, conformité, appui aux environnements patrimoniaux et opérations back ", "Rosette Fouelefack has experience across finance, risk management, compliance, wealth-management environments and back ")}<span className="font-sans font-medium">&amp;</span>{t(" middle office, acquise au sein d’organisations bancaires et d’acteurs financiers réglementés.", " middle-office operations, gained within banking institutions and regulated financial entities.")}
                </p>
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {formatBrand(t(
                    "Elle a fondé MENUA CONSULTING avec l’objectif de proposer aux entreprises un appui opérationnel fiable, structuré et flexible, capable de renforcer l’exécution des fonctions back et middle office tout en respectant les procédures internes de chaque client.",
                    "She founded MENUA CONSULTING to provide businesses with reliable, structured and flexible operational support that strengthens the delivery of back and middle office functions while respecting each client’s internal procedures."
                  ))}
                </p>
                <p className="text-[#e8e1d7] font-bold leading-relaxed">
                  {formatBrand(t(
                    "Menua Consulting s’appuie sur une organisation agile, pilotée depuis la France, avec des équipes MENUA mobilisées selon les besoins de chaque mission, en fonction des compétences, du volume et du niveau de technicité requis.",
                    "Menua Consulting operates through an agile model led from France, with dedicated MENUA teams mobilised according to each engagement’s required skills, workload and level of complexity."
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── 2.7 ACCRÉDITATIONS ET NOTRE ÉQUIPE ── */}
      <section id="certifications" className="relative w-full bg-white pb-16 lg:pb-20 pt-0 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
          <div className="flex flex-col lg:flex-row-reverse lg:items-center">

            {/* Image (Right Desktop only) */}
            <div className="hidden lg:flex w-5/12 shrink-0 z-20 items-center justify-start">
              <div className="w-[85%] lg:h-[450px] relative overflow-hidden shadow-xl">
                <img src="/img/conforme.jpg" alt={t("Accréditations", "Accreditations")} className="w-full h-full object-cover object-bottom" onError={(e) => { e.currentTarget.src = "/img/hero-paris.webp"; }} />
              </div>
            </div>

            {/* Beige block with list (Left) */}
            <div className="w-full lg:w-8/12 lg:-mr-16 z-10 flex items-center">
              <div className="w-full bg-[#e8e1d7] shadow-xl px-6 portrait:sm:px-10 lg:pl-14 lg:pr-28 py-10 lg:py-14 border border-[#e8e1d7] border-t-4 border-t-[#141824]">
                <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
                  {t("Formations, certifications et expertises", "Qualifications, certifications and expertise")}
                </h2>

                {/* Mobile Image */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                  <img src="/img/conforme.jpg" alt={t("Accréditations", "Accreditations")} className="w-full h-full object-cover object-bottom" onError={(e) => { e.currentTarget.src = "/img/hero-paris.webp"; }} />
                </div>

                <div className="space-y-4 text-[#141824] text-[1.05rem] font-light leading-relaxed">
                  <p>
                    {formatBrand(t(
                      "Menua Consulting intervient dans des environnements soumis à des exigences élevées en matière de conformité, de qualité et de traçabilité.",
                      "MENUA CONSULTING works in environments with demanding compliance, quality and traceability requirements."
                    ))}
                  </p>
                  <p>
                    {t(
                      "Selon le périmètre de la mission, Menua Consulting mobilise au sein de son organisation les compétences nécessaires, notamment en comptabilité, data, reporting et pilotage de gestion.",
                      "Depending on the scope of the engagement, Menua Consulting mobilises the required capabilities within its organisation, particularly in accounting, data, reporting and performance management."
                    )}
                  </p>
                  <p>
                    {t(
                      "Ce modèle permet de proposer une réponse flexible et adaptée, tout en conservant un pilotage clair, une exigence élevée de confidentialité et une qualité d’exécution conforme aux attentes du client.",
                      "This model enables a flexible and tailored response while maintaining clear oversight, a high standard of confidentiality and delivery quality aligned with the client’s expectations."
                    )}
                  </p>
                  <div className="bg-white/40 border-l-4 border-[#141824] p-5 my-2 shadow-sm">
                    <p className="font-bold text-[#141824] text-[1rem]">
                      {formatBrand(t(
                        "Menua Consulting n’exerce pas d’activité réglementée en son nom propre. Le cabinet intervient en support opérationnel, dans le cadre des procédures, agréments et validations propres à ses clients.",
                        "MENUA CONSULTING does not carry out regulated activities in its own name. It provides operational support within the procedures, permissions, regulatory approvals, controls and validation frameworks of its clients."
                      ))}
                    </p>
                  </div>
                  <div className="mt-12 pt-4 border-t border-[#141824]/10">
                    <p className="font-bold text-[#141824] mb-6">{t("La dirigeante dispose notamment :", "The President holds the following qualifications and areas of expertise:")}</p>
                    <div className="space-y-4 text-[0.95rem] text-[#141824]/80">
                      <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0 mt-[0.45rem]"></div><span className="font-semibold">{t("Certification AMF · Contrôle interne et risques · Finance d'entreprise · Back et middle office", "AMF certification · Internal control and risk · Corporate finance · Back and middle office")}</span></div>
                      <div className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-[#141824] rounded-full shrink-0 mt-[0.45rem]"></div><span className="font-semibold">{t("Conformité financière · Gestion des risques · Analyse financière · KYC / AML / reporting", "Financial compliance · Risk management · Financial analysis · KYC / AML / CTF and reporting")}</span></div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right">
                      <span className="max-w-[18ch] portrait:sm:max-w-[24ch] landscape:max-lg:max-w-[21ch] landscape:lg:max-w-[22ch] xl:max-w-none">{t("Présenter votre besoin", "Tell us about your requirements")}</span>
                      <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                      <ChevronRight size={18} className="-ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
