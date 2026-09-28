"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight } from "lucide-react";
import BulletList from "@/components/BulletList";

const SolutionSection = ({ id, title, intro, desc, isReversed, listTitle, listItems, bgClass, topDecoClass, titleDecoClass, borderClass, zIndexClass = "z-10" }: any) => {
  return (
    <section id={id} className={`relative w-full py-24 scroll-mt-20 overflow-hidden ${bgClass}`}>
      {topDecoClass && <div className={topDecoClass} />}
      <div className={`laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 relative ${zIndexClass} max-w-7xl mx-auto flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}>
        <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
          <div className={`w-16 h-[3px] mb-5 ${titleDecoClass}`} />
          <h2 className={`${bgClass.includes('bg-[#141824]') ? 'text-white' : 'text-[#141824]'} text-[1.3rem] md:text-[1.5rem] font-bold uppercase mb-8 leading-tight`}>
            {title}
          </h2>
          <p className={`${bgClass.includes('bg-[#141824]') ? 'text-[#e5e9f0]' : 'text-[#141824]/80 font-medium'} font-light text-[1.1rem] leading-relaxed mb-6`}>
            {intro}
          </p>
          <p className={`${bgClass.includes('bg-[#141824]') ? 'text-[#e5e9f0]' : 'text-[#141824]/80 font-medium'} font-light text-[1.1rem] leading-relaxed mb-12`}>
            {desc}
          </p>
        </div>
        <div className="w-full lg:w-7/12 relative">
          <div className={`relative bg-white p-10 lg:p-14 shadow-2xl border ${borderClass}`}>
            <h4 className="text-center text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
              {listTitle}
            </h4>
            <BulletList 
              gridCols="grid-cols-1 md:grid-cols-2"
              gapX="gap-x-8" gapY="gap-y-6"
              fontWeight="font-medium"
              items={listItems}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 4.1 HERO ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/solutions-hero.webp" 
            alt="Nos solutions" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-4 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Nos solutions", "Our solutions")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t(
                "Des dispositifs d’externalisation flexibles, adaptés à vos contraintes d’urgence, de durée, de volume et d’organisation.",
                "Flexible operational outsourcing arrangements adapted to your requirements for speed, duration, volume and delivery model."
              )}
            </p>
            <div className="mt-4">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                {t("Présenter votre besoin", "Tell us about your requirements")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-8 md:pt-[2.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
          {/* BREADCRUMB */}
          <div className="w-full mb-8 md:mb-4">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Nos solutions", "Our solutions")}</span>
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* Left Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-4/12 lg:h-[350px] lg:-mt-12 z-20 relative shrink-0">
              <img 
                src="/img/solutions_3.webp" 
                alt="Nos solutions" 
                className="w-full h-full object-cover shadow-xl" 
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
              />
            </div>
            
            {/* Right Overlapping Box */}
            <div className="w-full lg:w-10/12 px-6 portrait:sm:px-10 landscape:px-32 landscape:lg:px-0 py-10 lg:px-12 lg:pr-20 landscape:lg:pr-20 lg:pl-32 landscape:lg:pl-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-ml-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 portrait:sm:left-2 portrait:sm:right-2 landscape:left-16 landscape:right-16 lg:left-0 lg:right-0 landscape:lg:left-0 landscape:lg:right-0 bottom-0 top-[220px] landscape:top-[320px] lg:top-0 landscape:lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <div className="leading-relaxed text-[#6e7891] text-[1rem] font-light mb-8 space-y-6">
                <h2 className="text-[#141824] font-bold text-[1.3rem] md:text-[1.5rem] leading-tight mb-4 uppercase tracking-wider">
                  {t("Une approche sur mesure", "A tailored approach")}
                </h2>
                {/* Mobile Image (Visible only on mobile) */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-16 z-20 relative shadow-md">
                  <img
                    src="/img/solutions_3.webp"
                    alt="Nos solutions"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                  />
                </div>
                
                <p className="text-[1.1rem] font-medium">
                  {formatBrand(t(
                    "MENUA CONSULTING conçoit des solutions d’externalisation opérationnelle sur mesure pour accompagner les entreprises, cabinets et organisations dans la gestion de leurs fonctions back et middle office.",
                    "MENUA CONSULTING designs tailored operational outsourcing arrangements to support businesses, professional firms and other organisations in the management of their back and middle office functions."
                  ))}
                </p>
                <p>
                  {t(
                    "Nos interventions peuvent répondre à un besoin ponctuel, à une surcharge d’activité, à un volume important de dossiers ou à une organisation récurrente nécessitant continuité, rigueur et fiabilité.",
                    "Our services can address a one-off need, a spike in activity, high case volumes, or an ongoing requirement where continuity, rigour and reliability are essential."
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 4.3 URGENCE ── */}
      <SolutionSection 
        id="urgence"
        bgClass="bg-[#141824]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#e8e1d7]"
        borderClass="border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]"
        isReversed={false}
        title={t("Urgence", "Responsiveness")}
        intro={formatBrand(t(
          "MENUA CONSULTING peut mobiliser des ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d’activité ou sécuriser la continuité d’un service.",
          "MENUA CONSULTING can mobilise operational resources to meet an immediate need, absorb a spike in activity or maintain service continuity."
        ))}
        desc={t(
          "Cette solution est adaptée aux situations nécessitant une réaction rapide, notamment lorsque les équipes internes font face à un pic d’activité, un retard de traitement ou une absence temporaire.",
          "This approach is suited to situations requiring a rapid response, particularly when internal teams face a spike in activity, processing delays or temporary staff absence."
        )}
        listTitle={t("Exemples de besoins :", "Examples of needs:")}
        listItems={[
          t("surcharge d’activité ou pic de dossiers ;", "a surge in activity or a spike in case volumes;"),
          t("remplacement temporaire d’un collaborateur absent ;", "temporary cover for absent staff;"),
          t("renfort ponctuel en période de clôture ou de reporting ;", "additional support during closing or reporting periods;"),
          t("traitement accéléré de dossiers en retard ou en attente ;", "accelerated processing for backlogs or pending files;"),
          t("mobilisation progressive de ressources pour sécuriser une montée en charge.", "gradual mobilisation of resources to support scaling.")
        ]}
      />

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 4.4 DURÉE (Notre approche layout) ── */}
      <section id="duree" className="w-full bg-white scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 pb-16 lg:pb-24 landscape:px-16 landscape:lg:px-16">
          <div className="w-full bg-[#f5f7fa] rounded-sm pt-12 landscape:pt-8 landscape:lg:pt-16 pb-12 landscape:pb-8 landscape:lg:pb-16 px-6 landscape:px-10 landscape:lg:px-6 lg:pl-32 lg:pr-20 flex flex-col lg:flex-row landscape:flex-row gap-12 landscape:gap-8 landscape:lg:gap-16 relative z-10">
          
          {/* Left Col: Title & Intro */}
          <div className="w-full lg:w-4/12 landscape:w-5/12 landscape:lg:w-4/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
              {t("Durée", "Flexibility")}
            </h2>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
              {formatBrand(t("MENUA CONSULTING propose des formats d’intervention flexibles, adaptés aussi bien aux missions courtes qu’aux besoins récurrents.", "MENUA CONSULTING offers flexible support arrangements adapted to short missions as well as recurring needs."))}
            </p>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
              {t("La durée de la mission est définie selon le périmètre, les volumes à traiter, les objectifs attendus et les contraintes propres à l’organisation du client.", "Our support arrangements adjust to the length of your requirement, whether for a specific, time-bound engagement or for an ongoing operational partnership.")}
            </p>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 rounded-sm shadow-md overflow-hidden">
              <img src="/img/solutions_2.webp" alt="Durée" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} />
            </div>
            <div className="w-full aspect-[4/5] rounded-sm overflow-hidden shadow-lg hidden lg:block">
              <img 
                src="/img/solutions_2.webp" 
                alt="Durée" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
              />
            </div>
          </div>

          {/* Right Col: Pillars */}
          <div className="w-full lg:w-8/12 landscape:w-7/12 landscape:lg:w-8/12 grid grid-cols-1 md:grid-cols-2 landscape:grid-cols-2 gap-8 landscape:gap-4 landscape:lg:gap-8">
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Mission courte", "One-off engagement")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour traiter un besoin identifié sur une période limitée", "to address a specific need over a limited period")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Mission longue", "Long-term partnership")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour accompagner la gestion d’un portefeuille de dossiers", "to support the ongoing management of a portfolio of files")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Intervention ponctuelle", "Support during transition")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("sur un volume de dossiers comptables, financiers, patrimoniaux, conformité ou administratifs", "managing volumes of accounting, financial, wealth-management, compliance or administrative files")}
              </p>
            </div>
            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Externalisation récurrente", "Recurring outsourcing")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("pour confier durablement tout ou partie de certaines activités opérationnelles", "to entrust all or part of certain operational activities on a long-term basis")}
              </p>
            </div>

            <div className="bg-white p-8 border-l-4 border-[#141824] shadow-sm md:col-span-1">
              <h4 className="text-[#141824] font-bold text-[1.1rem] mb-3">{t("Ajustement du dispositif", "Adjustable arrangements")}</h4>
              <p className="text-[#6e7891] font-light text-[0.95rem] leading-relaxed">
                {t("selon l’évolution de la charge et des priorités du client", "adapting to changes in the client’s workload and priorities")}
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── 4.5 VOLUME ── */}
      <SolutionSection 
        id="volume"
        bgClass="bg-[#141824]"
        topDecoClass="absolute top-0 left-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[10deg] origin-bottom-left hidden lg:block"
        titleDecoClass="bg-[#e8e1d7]"
        borderClass="border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]"
        isReversed={true}
        title={t("Volume", "Scalability")}
        intro={formatBrand(t(
          "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d’opérations à traiter.",
          "We size our teams according to the volume and complexity of the operations to be handled, with the ability to ramp up during peak periods."
        ))}
        desc={t(
          "L’objectif est de garantir une exécution fluide, continue et sécurisée, même lorsque les volumes augmentent ou lorsque plusieurs flux doivent être suivis simultanément.",
          "Our goal is to ensure smooth, continuous and secure execution, even as volumes increase or multiple workflows need to be managed simultaneously."
        )}
        listTitle={t("Dispositifs possibles :", "Possible arrangements:")}
        listItems={[
          t("une ressource dédiée sur un périmètre précis", "a dedicated resource for a specific scope"),
          t("un renfort ponctuel pour absorber une surcharge d’activité", "ad-hoc reinforcement to absorb a surge in activity"),
          t("une équipe opérationnelle pour gérer un volume important de dossiers", "an operational team to manage high volumes of files"),
          t("un dispositif évolutif ajusté selon la charge, les priorités et les délais", "a scalable arrangement adjusted according to workload, priorities and deadlines"),
          t("une organisation permettant de maintenir la continuité du traitement en cas d’absence ou de variation d’activité", "an operating model that maintains processing continuity during absences or fluctuations in activity")
        ]}
      />

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── 4.6 MODE D'ORGANISATION ── */}
      <SolutionSection 
        id="organisation"
        bgClass="bg-[#e8e1d7]"
        topDecoClass="absolute top-0 right-0 w-1/2 h-full bg-[#e0d8cd] skew-x-[-10deg] origin-bottom-right hidden lg:block"
        titleDecoClass="bg-[#141824]"
        borderClass="border-[#e8e1d7] border-t-8 border-t-[#141824]"
        isReversed={false}
        title={t("Mode d’organisation", "Delivery model")}
        intro={formatBrand(t(
          "MENUA CONSULTING structure ses interventions selon le format le plus adapté à l’organisation du client : mission dédiée, intervention ponctuelle, traitement de flux ou prise en charge de process définis.",
          "Our operating framework is built around your internal processes, technical environment and security constraints."
        ))}
        desc={t(
          "Nos équipes s’intègrent aux méthodes, outils, procédures et circuits de validation existants, afin de garantir une exécution fluide, traçable et conforme aux standards internes du client.",
          "Our teams integrate seamlessly with your existing methods, tools, procedures and approval workflows to guarantee smooth, traceable delivery in line with your internal standards."
        )}
        listTitle={t("Modes d’intervention possibles :", "Delivery model features:")}
        listItems={[
          t("dispositif dédié pour un service ou un périmètre clairement identifié", "a dedicated team for a clearly identified service or scope"),
          t("intervention par mission pour un besoin borné dans le temps", "project-based support for time-bound requirements"),
          t("prise en charge de flux ou de process récurrents", "management of recurring workflows or processes"),
          t("traitement de dossiers, adhésions, opérations ou demandes selon des règles définies avec le client", "processing of files, operations or requests based on rules agreed with the client"),
          t("suivi structuré avec points de contrôle réguliers", "structured oversight with regular control points"),
          t("reporting opérationnel selon la fréquence convenue", "operational reporting at an agreed frequency")
        ]}
      />

      {/* ── 4.7 LANGUES & 4.8 BON A SAVOIR ── */}
      <section id="langues" className="relative w-full bg-white pt-12 md:pt-[5.25rem] landscape:pt-8 landscape:lg:pt-[5.25rem] pb-16 md:pb-24 landscape:pb-8 landscape:lg:pb-48 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 landscape:grid-cols-2 gap-12 landscape:gap-8 lg:gap-16">
            
            {/* Langues Card */}
            <div className="bg-[#141824] p-10 lg:p-12 shadow-xl border-t-4 border-t-[#e8e1d7] flex flex-col justify-center">
              <h3 className="text-white font-bold text-[1.5rem] mb-6">{t("Langues", "Languages")}</h3>
              <p className="text-[#e5e9f0] font-light text-[1.05rem] leading-relaxed">
                {formatBrand(t(
                  "MENUA CONSULTING peut intervenir en français et en anglais afin de faciliter la gestion des échanges, des reportings, des contrôles documentaires et des opérations dans un contexte national ou international. D’autres langues peuvent être étudiées selon les besoins spécifiques du client, la nature de la mission et les ressources mobilisables.",
                  "MENUA CONSULTING operates in French and English, facilitating communication, reporting, document review and operations in both domestic and international contexts. Additional languages can be accommodated depending on the client’s specific needs, the nature of the engagement and available resources."
                ))}
              </p>
            </div>

            {/* Bon à savoir Card */}
            <div className="bg-white p-10 lg:p-12 shadow-xl border border-[#e8e1d7] border-t-4 border-t-[#141824] flex flex-col justify-center">
              <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6">{t("Bon à savoir", "Good to know")}</h3>
              <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed">
                {formatBrand(t(
                  "Chaque solution est construite après analyse du besoin, du volume, des délais, des outils disponibles et du niveau de supervision attendu. MENUA CONSULTING privilégie une approche claire, progressive et contrôlable, afin de garantir une exécution fiable et adaptée aux contraintes réelles de chaque organisation.",
                  "Every solution is designed following an assessment of requirements, volumes, timescales, available tools and the expected level of supervision. MENUA CONSULTING favours a clear, phased and manageable approach to ensure reliable delivery tailored to the practical constraints of each organisation."
                ))}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
