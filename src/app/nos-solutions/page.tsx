"use client";
import Link from "next/link";
import { Zap, Calendar, BarChart3, Network, ArrowRight, Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/solution.png"
            alt="Nos Solutions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-white" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-white" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-white" />
            <div className="relative">
              <h1 className="h1-hero mb-8 max-w-4xl">
                <span className="block">{t("Dispositifs", "Solutions")}</span>
                <span className="block mt-2">
                  {t("Des solutions", "Outsourcing")}<br />
                  {t("d'externalisation", "solutions")}<br />
                  {t("conçues pour s'adapter", "designed to adapt")}<br />
                  {t("à vos contraintes.", "to your constraints.")}
                </span>
              </h1>
              <div className="mb-8 max-w-2xl">
                <p className="p-1">
                  {t(
                    "Nous concevons des dispositifs sur mesure, flexibles et évolutifs pour répondre à vos enjeux d'urgence, de durée, de volume et d'organisation.",
                    "We design tailor-made, flexible and scalable solutions to meet your challenges of emergency, duration, volume and organization."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══ 1. URGENCE ══ */}
      <section id="urgence" className="relative mt-12 py-12">
        <div className="absolute inset-y-0 left-[max(1rem,calc(50vw-550px))] w-[calc(100%-2rem)] lg:w-[850px] bg-white z-0 rounded-3xl shadow-sm"></div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            
            {/* Text left */}
            <div className="flex flex-col">
      
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#122017]" />
                <h2 className="h2-surtitre text-[#122017]">
                  {t("Urgence", "Emergency")}
                </h2>
              </div>
              <div className="p-2 text-[#4A4E5A] mb-8 font-normal">
                <p>
                  {t(
                    "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.",
                    "Rapid mobilization of operational resources to meet an immediate need, absorb an overload of activity and ensure the continuity of your service."
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  t("Surcharge d'activité ou pic de dossiers", "Activity overload or peak files"),
                  t("Remplacement temporaire d'un collaborateur absent", "Temporary replacement of an absent collaborator"),
                  t("Renfort ponctuel en période de clôture ou de reporting", "Occasional reinforcement during closing or reporting periods"),
                  t("Traitement accéléré de dossiers en retard ou en attente", "Accelerated processing of overdue or pending files"),
                  t("Mise à disposition progressive de ressources pour sécuriser la montée en charge", "Progressive provision of resources to secure ramp-up"),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A0E08] shrink-0 mt-2" />
                    <h4 className="h4-titre text-[#122017]">{item}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Image right */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl order-first lg:order-none">
              <img
                src="/urgence.png"
                alt="Urgence"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. DURÉE ══ */}
      <section id="duree" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="relative w-full flex flex-col rounded-3xl">
          <div className="absolute inset-y-0 left-0 w-full lg:w-[85%] bg-[#e4dcf7] z-0 rounded-3xl shadow-lg border border-black/5"></div>
          {/* Top Banner */}
          <div className="relative z-10 w-full border-b border-[#E0D6C8]/50">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-[#122017]" />
                  <h2 className="h2-surtitre text-[#122017]">
                    {t("Durée", "Duration")}
                  </h2>
                </div>
                <p className="text-[#122017]/90 text-[0.95rem] leading-[1.6]">
                  MENUA CONSULTING {t(
                    "propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.",
                    "offers flexible outsourcing solutions, adapted to the processing of a defined number of files as well as the recurring management of a larger portfolio."
                  )}
                </p>
              </div>
              {/* Right Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl order-first md:order-none">
                <img
                  src="/duree.png"
                  alt="Durée"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 w-full py-8 px-8 lg:pl-12 lg:pr-[16%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {[
                t("Mission courte pour traiter un besoin identifié sur une période limitée", "Short mission to address an identified need over a limited period"),
                t("Mission longue pour accompagner la gestion d'un portefeuille de dossiers dans la durée", "Long mission to support the management of a portfolio of files over time"),
                t("Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles", "Continuous outsourcing to permanently entrust all or part of your operational activities"),
                t("Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs", "Occasional intervention on a volume of accounting, financial, wealth or administrative files"),
                t("Ajustement du dispositif selon l'évolution de la charge et des priorités du client", "Adjustment of the setup according to the evolution of the workload and the client's priorities"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h4 className="h4-titre text-[#122017]">{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="volume" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="relative w-full flex flex-col rounded-3xl">
          <div className="absolute inset-y-0 right-0 w-full lg:w-[85%] bg-[#8e8478] z-0 rounded-3xl shadow-lg border border-black/5"></div>
          {/* Top Banner */}
          <div className="relative z-10 w-full border-b border-[#E0D6C8]/30">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/volume.png"
                  alt="Volume"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
              {/* Right Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-white" />
                  <h2 className="h2-surtitre text-white">
                    {t("Volume", "Volume")}
                  </h2>
                </div>
                <p className="text-white/90 text-[0.95rem] leading-[1.6]">
                  MENUA CONSULTING {t(
                    "adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.",
                    "adapts the sizing of its resources to the volume of files, flows or operations to be processed, while ensuring continuity and secure execution."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 w-full py-8 px-8 lg:pl-[16%] lg:pr-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {[
                t("Une ressource dédiée sur un périmètre précis", "A dedicated resource on a specific scope"),
                t("Un renfort ponctuel pour absorber une surcharge d'activité", "Occasional reinforcement to absorb an activity overload"),
                t("Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés", "An operational team to manage a large volume or several simultaneous flows"),
                t("Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client", "A scalable setup adjusted according to the workload, priorities and client requirements"),
                t("Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité", "An organization ensuring processing continuity in case of absence or variation in activity"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D9B151] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h4 className="h4-titre text-white">{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. ORGANISATION ══ */}
      <section id="organisation" className="mt-12 bg-[#1A0E08] w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-white" />
              <h2 className="h2-surtitre text-white">
                {t("Organisation", "Organization")}
              </h2>
            </div>
            <p className="p-2 mb-8 max-w-3xl">
              MENUA CONSULTING {t(
                "structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.",
                "structures its interventions according to the format most suited to your constraints: dedicated setup, mission-based operation or management of defined flows and processes."
              )}{" "}
              {t(
                "Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.",
                "We integrate our teams into your existing operating modes to guarantee smooth, traceable execution that complies with your internal standards."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-10">
              {[
                t("Dispositif dédié pour un service ou un périmètre clairement identifié", "Dedicated setup for a clearly identified service or scope"),
                t("Intervention par mission pour un besoin borné dans le temps ou un projet spécifique", "Mission-based intervention for a time-bound need or specific project"),
                t("Prise en charge de flux ou de process récurrents", "Handling of recurring flows or processes"),
                t("Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes", "Processing of files, memberships or operations according to rules defined with your teams"),
                t("Suivi structuré avec points de contrôle réguliers", "Structured monitoring with regular control points"),
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center bg-white/10 border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all h-full">
                  <h4 className="h4-titre text-white">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGUES BANNER ── */}
      <section className="mt-12 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="bg-[#8e8478] py-10 px-10 flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-xl border border-white/10">
          <div className="flex gap-4 items-center shrink-0">
            {/* French Flag */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 flex shadow-sm">
              <div className="w-1/3 h-full bg-[#0055A4]" />
              <div className="w-1/3 h-full bg-white" />
              <div className="w-1/3 h-full bg-[#EF4135]" />
            </div>
            {/* UK Flag (Simplified representation) */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-[#012169] relative shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-2 bg-white absolute rotate-45" />
                <div className="w-full h-2 bg-white absolute -rotate-45" />
                <div className="w-full h-1 bg-[#C8102E] absolute rotate-45" />
                <div className="w-full h-1 bg-[#C8102E] absolute -rotate-45" />
                <div className="w-full h-4 bg-white absolute" />
                <div className="h-full w-4 bg-white absolute" />
                <div className="w-full h-2 bg-[#C8102E] absolute" />
                <div className="h-full w-2 bg-[#C8102E] absolute" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="h3-section text-white mb-2">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="p-2 font-medium">
              {t("D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
