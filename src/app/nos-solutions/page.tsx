"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Clock, Briefcase, FileStack, Settings, Globe, ArrowRight } from "lucide-react";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  const solutions = [
    {
      id: "urgence",
      title: t("Urgence", "Urgency"),
      role: t("Rôle : Capacité de réaction", "Role: Response capacity"),
      desc: t("Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat et assurer la continuité de votre service.", "Rapid mobilization of operational resources to meet an immediate need and ensure the continuity of your service."),
      icon: Clock,
      how: "Comment ?",
      bullets: ["Surcharge d’activité ou pic de dossiers", "Remplacement temporaire d’un collaborateur absent", "Renfort ponctuel en période de clôture", "Traitement accéléré de dossiers en retard", "Mise à disposition progressive de ressources"]
    },
    {
      id: "duree",
      title: t("Durée", "Duration"),
      role: t("Rôle : Flexibilité contractuelle", "Role: Contractual flexibility"),
      desc: t("Des dispositifs d’externalisation flexibles, adaptés au traitement d’un nombre défini de dossiers comme à la gestion récurrente.", "Flexible outsourcing systems, adapted to the processing of a defined number of files as well as to recurring management."),
      icon: Briefcase,
      how: "Garanties :",
      bullets: ["Mission courte sur une période limitée", "Mission longue dans la durée", "Externalisation continue", "Intervention ponctuelle sur un volume de dossiers", "Ajustement du dispositif selon la charge"]
    },
    {
      id: "volume",
      title: t("Volume", "Volume"),
      role: t("Rôle : Dimensionnement", "Role: Sizing"),
      desc: t("Adaptation du dimensionnement de nos ressources au volume de dossiers ou d’opérations à traiter, tout en sécurisant l’exécution.", "Adaptation of the sizing of our resources to the volume of files or operations to be processed..."),
      icon: FileStack,
      how: "Nos dispositifs :",
      bullets: ["Ressource dédiée sur un périmètre précis", "Renfort ponctuel pour absorber une surcharge", "Équipe opérationnelle pour flux simultanés", "Dispositif évolutif", "Organisation permettant la continuité"]
    },
    {
      id: "organisation",
      title: t("Mode d’organisation", "Organization"),
      role: t("Rôle : Comment le travail est exécuté", "Role: How work is executed"),
      desc: t("Intégration de nos équipes à vos modes de fonctionnement pour garantir une exécution fluide et conforme à vos standards.", "Integration of our teams into your operating modes to guarantee smooth execution in compliance with your standards."),
      icon: Settings,
      how: "Mode d'interventions :",
      bullets: ["Dispositif dédié clairement identifié", "Intervention par mission bornée dans le temps", "Prise en charge de flux récurrents", "Traitement selon des règles définies", "Suivi structuré avec points de contrôle"]
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 4.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner-desk.jpg" 
            alt="Nos solutions" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nos solutions", "Our solutions")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Nous concevons des dispositifs d’externalisation sur mesure, adaptés à vos contraintes opérationnelles d’urgence, de durée, de volume et d’organisation.",
                "We design tailor-made outsourcing systems, adapted to your operational constraints of urgency, duration, volume and organization."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── LAYOUT 1: BEIGE CARDS ROW (Nos solutions placements style) ── */}
      <section className="relative w-full bg-[#e8e1d7] section-padding">
        <div className="laplace-container">
          <div className="mb-12">
            <div className="w-16 h-[3px] bg-white/60 mb-5" />
            <h2 className="text-[1.2rem] text-[#141824] font-bold uppercase tracking-widest mb-4">
              {t("NOS SOLUTIONS D'EXTERNALISATION", "OUR OUTSOURCING SOLUTIONS")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {solutions.map((sol, idx) => (
              <div key={idx} className="bg-white/40 border border-white/40 p-8 flex flex-col group hover:bg-white transition-all duration-500">
                <h3 className="text-[#141824] text-[1.4rem] font-bold mb-4">{sol.title}</h3>
                <p className="text-[#141824]/80 font-light text-[0.95rem] leading-relaxed mb-10 flex-grow">
                  {sol.desc}
                </p>
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
      </section>

      {/* ── DETAILED SECTIONS ── */}
      <div className="bg-[#f5f7fa] py-20">
        <div className="laplace-container space-y-16 max-w-5xl mx-auto">
          {solutions.map((sol, idx) => (
            <div key={idx} id={sol.id} className="bg-white p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 scroll-mt-32">
               <div className="lg:w-5/12">
                  <div className="w-16 h-[3px] bg-[#141824] mb-5" />
                  <h3 className="text-[2rem] text-[#141824] font-bold mb-6 flex items-center gap-4">
                    <sol.icon className="text-[#141824]" size={36} />
                    {sol.title}
                  </h3>
                  <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
                    {sol.role}
                  </p>
                  <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed">
                    {sol.desc}
                  </p>
               </div>
               <div className="lg:w-7/12 bg-[#f9fafb] p-8 border border-gray-100">
                 <p className="font-bold text-[#141824] mb-6 text-[1.1rem]">
                    {t(sol.how, sol.how)}
                 </p>
                 <ul className="space-y-4 text-[#31374a] text-[1.05rem] font-light">
                   {sol.bullets.map((bullet, bIdx) => (
                     <li key={bIdx} className="flex items-start gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                       <span>{t(bullet, bullet)}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4.6 LANGUES (Beige Full Width Block) ── */}
      <section className="relative w-full bg-[#141824] section-padding text-[#e8e1d7]">
        <div className="laplace-container flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <Globe size={64} className="text-[#e8e1d7] shrink-0 opacity-80" strokeWidth={1} />
          <div className="max-w-2xl">
            <h3 className="text-[1.4rem] font-bold text-white mb-2">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="text-[#e5e9f0] font-light text-[1.1rem]">
              {t("D’autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
