"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Clock, Briefcase, FileStack, Settings, Globe } from "lucide-react";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 4.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner-desk.jpg" 
            alt="Nos solutions" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Nos solutions", "Our solutions")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "Nous concevons des dispositifs d’externalisation sur mesure, adaptés à vos contraintes opérationnelles d’urgence, de durée, de volume et d’organisation.",
                "We design tailor-made outsourcing systems, adapted to your operational constraints of urgency, duration, volume and organization."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4.2 URGENCE (Overlapping Beige Box) ── */}
      <section className="relative w-full bg-white pt-24 pb-32">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 mt-0 lg:mt-0 lg:mr-[-10%] shadow-2xl order-2 lg:order-1">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-8 font-bold flex items-center gap-4">
                <Clock className="text-[#141824]" size={36} />
                {t("Urgence", "Urgency")}
              </h2>
              <div className="w-16 h-1 bg-[#141824] mb-8 animate-fade-in-up" />
              
              <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
                {t("Rôle : Capacité de réaction", "Role: Response capacity")}
              </p>
              <p className="text-[#141824] text-[1.05rem] font-light leading-relaxed mb-8">
                {t(
                  "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d’activité et assurer la continuité de votre service.",
                  "Rapid mobilization of operational resources to meet an immediate need, absorb a workload overload and ensure the continuity of your service."
                )}
              </p>
              
              <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
                {t("Comment ?", "How?")}
              </p>
              <ul className="space-y-4 text-[#141824] text-[1.05rem] font-light">
                {[
                  "Surcharge d’activité ou pic de dossiers",
                  "Remplacement temporaire d’un collaborateur absent",
                  "Renfort ponctuel en période de clôture ou de reporting",
                  "Traitement accéléré de dossiers en retard ou en attente",
                  "Mise à disposition progressive de ressources pour sécuriser la montée en charge"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <span>{t(item, item)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Image */}
            <div className="w-full lg:w-7/12 h-[400px] lg:h-[600px] z-10 shadow-xl order-1 lg:order-2 mb-[-4rem] lg:mb-0">
              <img src="/meeting.jpg" alt="Urgence" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.3 DURÉE (Dark Blue Full Width) ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">
          <div className="animate-fade-in-up order-2 lg:order-1">
            <h2 className="text-[2rem] text-white mb-6 flex items-center gap-4">
              <Briefcase className="text-[#e8e1d7]" size={36} />
              {t("Durée", "Duration")}
            </h2>
            <div className="w-16 h-1 bg-[#e8e1d7] mb-8" />
            
            <p className="font-bold text-[#e8e1d7] mb-4 text-[1.1rem]">
              {t("Rôle : Flexibilité contractuelle", "Role: Contractual flexibility")}
            </p>
            <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "MENUA CONSULTING propose des dispositifs d’externalisation flexibles, adaptés au traitement d’un nombre défini de dossiers comme à la gestion récurrente d’un portefeuille plus important.",
                "MENUA CONSULTING offers flexible outsourcing systems, adapted to the processing of a defined number of files as well as to the recurring management of a larger portfolio."
              )}
            </p>
            
            <p className="font-bold text-[#e8e1d7] mb-4 text-[1.1rem]">
              {t("Notre expertise nous permet de vous garantir :", "Our expertise allows us to guarantee you:")}
            </p>
            <ul className="space-y-4 text-[#e5e9f0] text-[1.05rem] font-light">
              {[
                "Mission courte pour traiter un besoin identifié sur une période limitée",
                "Mission longue pour accompagner la gestion d’un portefeuille de dossiers dans la durée",
                "Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles",
                "Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs",
                "Ajustement du dispositif selon l’évolution de la charge et des priorités du client"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8e1d7] shrink-0 mt-2" />
                  <span>{t(item, item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 h-full min-h-[400px] border border-white/10 p-12 flex items-center justify-center bg-white/5">
             <Briefcase size={120} className="text-white opacity-10" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* ── 4.4 VOLUME (Overlapping Dark Blue Image Left) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-24 pb-32">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[400px] lg:h-[600px] z-10 shadow-xl">
              <img src="/office-lounge.jpg" alt="Volume" className="w-full h-full object-cover" />
            </div>
            
            {/* Right Overlapping Blue Box */}
            <div className="w-full lg:w-6/12 bg-[#141824] text-white p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-white mb-8 font-bold flex items-center gap-4">
                <FileStack className="text-[#e8e1d7]" size={36} />
                {t("Volume", "Volume")}
              </h2>
              <div className="w-16 h-1 bg-[#e8e1d7] mb-8 animate-fade-in-up" />
              
              <p className="font-bold text-[#e8e1d7] mb-4 text-[1.1rem]">
                {t("Rôle : Dimensionnement de l’équipe – fonctionnement", "Role: Team sizing - operation")}
              </p>
              <p className="text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed mb-8">
                {t(
                  "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d’opérations à traiter, tout en veillant à la continuité et à la sécurisation de l’exécution.",
                  "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows or operations to be processed, while ensuring continuity and secure execution."
                )}
              </p>
              
              <p className="font-bold text-[#e8e1d7] mb-4 text-[1.1rem]">
                {t("Nos dispositifs :", "Our systems:")}
              </p>
              <ul className="space-y-4 text-[#e5e9f0] text-[1.05rem] font-light">
                {[
                  "Une ressource dédiée sur un périmètre précis",
                  "Un renfort ponctuel pour absorber une surcharge d’activité",
                  "Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés",
                  "Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client",
                  "Une organisation permettant d’assurer la continuité du traitement en cas d’absence ou de variation d’activité"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8e1d7] shrink-0 mt-2" />
                    <span>{t(item, item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4.5 MODE D’ORGANISATION ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div className="h-full min-h-[400px] border border-[#e8e1d7] bg-[#f5f7fa] p-12 flex items-center justify-center">
             <Settings size={120} className="text-[#141824] opacity-10" strokeWidth={1} />
          </div>
          <div className="animate-fade-in-up">
            <h2 className="text-[2rem] text-[#141824] mb-6 flex items-center gap-4">
              <Settings className="text-[#141824]" size={36} />
              {t("Mode d’organisation", "Organization mode")}
            </h2>
            <div className="w-16 h-1 bg-[#141824] mb-8" />
            
            <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
              {t("Rôle : Comment le travail est exécuté", "Role: How work is executed")}
            </p>
            <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed mb-4">
              {t(
                "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.",
                "MENUA CONSULTING structures its interventions according to the format best suited to your constraints: dedicated system, mission-based operation or management of defined flows and processes."
              )}
            </p>
            <p className="text-[#6e7891] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.",
                "We integrate our teams into your existing operating modes to guarantee smooth, traceable execution in compliance with your internal standards."
              )}
            </p>
            
            <p className="font-bold text-[#141824] mb-4 text-[1.1rem]">
              {t("Mode d’interventions :", "Intervention modes:")}
            </p>
            <ul className="space-y-4 text-[#6e7891] text-[1.05rem] font-light">
              {[
                "Dispositif dédié pour un service ou un périmètre clairement identifié",
                "Intervention par mission pour un besoin borné dans le temps ou un projet spécifique",
                "Prise en charge de flux ou de process récurrents",
                "Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes",
                "Suivi structuré avec points de contrôle réguliers"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                  <span>{t(item, item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4.6 LANGUES (Beige Full Width Block) ── */}
      <section className="relative w-full bg-[#e8e1d7] section-padding text-[#141824]">
        <div className="laplace-container flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <Globe size={64} className="text-[#141824] shrink-0 opacity-80" strokeWidth={1} />
          <div className="max-w-2xl">
            <h3 className="text-[1.4rem] font-bold text-[#141824] mb-2">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="text-[#141824] font-light text-[1.1rem]">
              {t("D’autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
