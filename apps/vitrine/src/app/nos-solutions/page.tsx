"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Clock, Briefcase, FileStack, Settings, Globe, ArrowRight } from "lucide-react";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  const solutions = [
    {
      id: "urgence",
      title: t("URGENCE", "URGENCY"),
      desc: t("Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.", "Rapid mobilization of operational resources to meet an immediate need, absorb an activity overload and ensure the continuity of your service."),
      icon: Clock,
      bullets: [
        t("Surcharge d'activité ou pic de dossiers", "Activity overload or peak in files"),
        t("Remplacement temporaire d'un collaborateur absent", "Temporary replacement of an absent employee"),
        t("Renfort ponctuel en période de clôture ou de reporting", "Occasional reinforcement during closing or reporting periods"),
        t("Traitement accéléré de dossiers en retard ou en attente", "Accelerated processing of overdue or pending files"),
        t("Mise à disposition progressive de ressources pour sécuriser la montée en charge", "Progressive provision of resources to secure the ramp-up")
      ]
    },
    {
      id: "duree",
      title: t("DURÉE", "DURATION"),
      desc: t("MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.", "MENUA CONSULTING offers flexible outsourcing systems, adapted to the processing of a defined number of files as well as to recurring management of a larger portfolio."),
      icon: Briefcase,
      bullets: [
        t("Mission courte pour traiter un besoin identifié sur une période limitée", "Short mission to address an identified need over a limited period"),
        t("Mission longue pour accompagner la gestion d'un portefeuille de dossiers dans la durée", "Long-term mission to support the management of a portfolio of files over time"),
        t("Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles", "Continuous outsourcing to permanently entrust all or part of your operational activities"),
        t("Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs", "One-off intervention on a volume of accounting, financial, wealth or administrative files"),
        t("Ajustement du dispositif selon l'évolution de la charge et des priorités du client", "Adjustment of the system according to the evolution of the workload and the client's priorities")
      ]
    },
    {
      id: "volume",
      title: t("VOLUME", "VOLUME"),
      desc: t("MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.", "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows or operations to be processed, while ensuring continuity and securing execution."),
      icon: FileStack,
      bullets: [
        t("Une ressource dédiée sur un périmètre précis", "A dedicated resource on a specific scope"),
        t("Un renfort ponctuel pour absorber une surcharge d'activité", "Occasional reinforcement to absorb an activity overload"),
        t("Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés", "An operational team to manage a large volume or several simultaneous flows"),
        t("Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client", "A scalable system adjusted according to the workload, priorities and requirements of the client"),
        t("Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité", "An organization ensuring continuity of processing in case of absence or variation in activity")
      ]
    },
    {
      id: "organisation",
      title: t("MODE D'ORGANISATION", "ORGANIZATION MODE"),
      desc: t("MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.\n\nNous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.", "MENUA CONSULTING structures its interventions according to the most suitable format for your constraints: dedicated system, mission-based operation or management of defined flows and processes.\n\nWe integrate our teams into your existing operating modes to guarantee smooth, traceable execution in compliance with your internal standards."),
      icon: Settings,
      bullets: [
        t("Dispositif dédié pour un service ou un périmètre clairement identifié", "Dedicated system for a clearly identified service or scope"),
        t("Intervention par mission pour un besoin borné dans le temps ou un projet spécifique", "Mission intervention for a time-bound need or specific project"),
        t("Prise en charge de flux ou de process récurrents", "Management of recurring flows or processes"),
        t("Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes", "Processing of files, memberships or operations according to rules defined with your teams"),
        t("Suivi structuré avec points de contrôle réguliers", "Structured monitoring with regular control points")
      ]
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 4.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/solutions-hero.jpg" 
            alt="Nos Solutions" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/80"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nos solutions", "Our solutions")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles d'urgence, de durée, de volume et d'organisation.",
                "We design tailor-made outsourcing systems, adapted to your operational constraints of urgency, duration, volume and organization."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── LAYOUT 1: GRID STYLE ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative z-10">
          <div className="absolute left-0 right-0 bottom-0 top-[180px] md:top-0 bg-[#f5f7fa] rounded-sm shadow-sm -z-10 mt-8" />
          <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-10 md:pb-10 lg:px-16 pt-6 lg:pt-8 lg:pb-16 mt-8">
            <div className="flex flex-col-reverse md:flex-row items-center justify-start mb-12 px-4 lg:px-0 gap-8 md:gap-24 lg:gap-32">
               <div className="w-full md:w-auto flex justify-start mt-4 md:mt-0 md:-mt-16 lg:-mt-20">
                 <img 
                   src="/img/nossolution_2.jpg" 
                   alt="Solutions d'externalisation" 
                   className="w-[85%] sm:w-80 md:w-56 h-auto object-cover rounded-sm shadow-md" 
                 />
               </div>
               <div className="text-left w-full md:w-auto flex-shrink-0">
                 <div className="w-16 h-[3px] bg-[#141824] mb-4" />
                 <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase tracking-wider md:mb-0">
                    {t("Nos solutions d'externalisation", "Our outsourcing solutions")}
                 </h2>
               </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {solutions.map((sol, idx) => (
              <div key={idx} className="bg-white/40 border border-white/40 p-8 flex flex-col group hover:bg-white transition-all duration-500">
                <h3 className="text-[#141824] text-[1.4rem] font-semibold mb-4">{sol.title}</h3>
                <div className="text-[#141824]/80 font-light text-[0.95rem] leading-relaxed mb-10 flex-grow space-y-3">
                  {sol.desc.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <a href={`#${sol.id}`} className="mt-auto flex items-center justify-between text-[#141824] font-bold uppercase tracking-widest text-[0.7rem] group-hover:text-[#6e7891] transition-colors">
                  {t("PLUS D'INFORMATIONS", "MORE INFORMATION")}
                  <span className="w-8 h-8 rounded-full border border-[#141824] flex items-center justify-center group-hover:bg-[#141824] group-hover:text-white transition-colors">
                    <ArrowRight size={14} />
                  </span>
                </a>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── DETAILED SECTIONS ── */}
      <div className="bg-[#f5f7fa] py-20">
        <div className="laplace-container space-y-16 max-w-5xl mx-auto">
          {solutions.map((sol, idx) => (
            <div key={idx} id={sol.id} className="bg-white shadow-xl flex flex-col lg:flex-row scroll-mt-32 overflow-hidden mb-12 border border-gray-100">
               <div className="lg:w-5/12 bg-[#e8e1d7] p-10 md:p-16 flex flex-col justify-center">
                  <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                  <h3 className="text-[2rem] text-[#141824] font-semibold mb-6 flex items-center gap-4">
                    <sol.icon className="text-[#141824]" size={36} />
                    {sol.title}
                  </h3>
               </div>
               <div className="lg:w-7/12 p-10 md:p-16 bg-white flex flex-col justify-center">
                 <ul className="space-y-4 text-[#31374a] text-[1.05rem] font-light">
                   {sol.bullets.map((bullet, bIdx) => (
                     <li key={bIdx} className="flex items-start gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                       <span>{bullet}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4.6 LANGUES (Beige Full Width Block) ── */}
      <section className="relative w-full bg-[#141824] py-4 md:py-6 text-[#e8e1d7]">
        <div className="laplace-container flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <Globe size={40} className="text-[#e8e1d7] shrink-0 opacity-80" strokeWidth={1} />
          <div className="max-w-2xl">
            <h3 className="text-[1.1rem] font-semibold text-white mb-0.5">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="text-[#e5e9f0] font-light text-[1rem]">
              {t("D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
