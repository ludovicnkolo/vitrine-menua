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
            src="/nos_solutions_hero.png"
            alt="Nos Solutions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <p className="text-[#D9B151] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.2em] uppercase mb-6">
                {t("Dispositifs", "Solutions")}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.5rem] font-bold leading-[1.1] text-white mb-8 max-w-4xl">
                {t("Des solutions", "Outsourcing")}<br />
                <span className="text-[#D9B151]">{t("d'externalisation", "solutions")}</span><br />
                {t("conçues pour s'adapter", "designed to adapt")}<br />
                {t("à vos contraintes.", "to your constraints.")}
              </h1>
              <div className="text-white text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-2xl font-normal space-y-3" style={{ color: 'white' }}>
                <p>
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
      <section id="urgence" className="mt-12 bg-white ">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent rounded-2xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            
            {/* Text left */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-[#D9B151]" />
                <span className="text-[#D9B151] text-[0.7rem] font-bold tracking-[0.15em] uppercase">
                  {t("01 — Dispositif", "01 — Solution")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-6">
                {t("Urgence", "Emergency")}
              </h2>
              <div className="w-16 h-[3px] bg-[#D9B151] mb-8" />
              <div className="text-[#4A4E5A] text-[1.05rem] leading-[1.8] mb-8 font-normal">
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
                  <div key={i} className="flex items-start gap-3 text-[#122017]/70 text-[0.85rem]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-2" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image right */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/trust-circle.jpg"
                alt="Urgence"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. DURÉE ══ */}
      <section id="duree" className="mt-12 bg-[#e4dcf7] w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start gap-16">
          {/* Text */}
          <div className="w-full flex flex-col">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("02 — Dispositif", "02 — Solution")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Durée", "Duration")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8 max-w-3xl">
              MENUA CONSULTING {t(
                "propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.",
                "offers flexible outsourcing solutions, adapted to the processing of a defined number of files as well as the recurring management of a larger portfolio."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                t("Mission courte pour traiter un besoin identifié sur une période limitée", "Short mission to address an identified need over a limited period"),
                t("Mission longue pour accompagner la gestion d'un portefeuille de dossiers dans la durée", "Long mission to support the management of a portfolio of files over time"),
                t("Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles", "Continuous outsourcing to permanently entrust all or part of your operational activities"),
                t("Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs", "Occasional intervention on a volume of accounting, financial, wealth or administrative files"),
                t("Ajustement du dispositif selon l'évolution de la charge et des priorités du client", "Adjustment of the setup according to the evolution of the workload and the client's priorities"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-[#122017]/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. VOLUME ══ */}
      <section id="volume" className="mt-12 bg-[#FDFBF7] w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
            {t("03 — Dispositif", "03 — Solution")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
            {t("Volume", "Volume")}
          </h2>
          <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
          <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8 max-w-3xl">
            MENUA CONSULTING {t(
              "adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.",
              "adapts the sizing of its resources to the volume of files, flows or operations to be processed, while ensuring continuity and secure execution."
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              t("Une ressource dédiée sur un périmètre précis", "A dedicated resource on a specific scope"),
              t("Un renfort ponctuel pour absorber une surcharge d'activité", "Occasional reinforcement to absorb an activity overload"),
              t("Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés", "An operational team to manage a large volume or several simultaneous flows"),
              t("Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client", "A scalable setup adjusted according to the workload, priorities and client requirements"),
              t("Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité", "An organization ensuring processing continuity in case of absence or variation in activity"),
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-[#122017]/70 text-[0.82rem]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. ORGANISATION ══ */}
      <section id="organisation" className="mt-12 bg-[#1A0E08] w-full py-12 ">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="w-full max-w-[1100px] mx-auto p-10 lg:p-16 flex flex-col justify-center">
            
            {/* Text Content */}
            <div className="relative z-10">
              <p className="font-serif text-xl md:text-2xl font-bold text-[#D9B151] mb-2">
                {t("04 — Dispositif", "04 — Solution")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-8">
                {t("Organisation", "Organization")}
              </h2>
              <div className="w-12 h-[3px] bg-[#D9B151] mb-8" />
              
              <div className="text-white/90 text-[0.95rem] leading-[1.8] space-y-6 font-normal">
                <p className="max-w-3xl">
                  MENUA CONSULTING {t(
                    "structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.",
                    "structures its interventions according to the format most suited to your constraints: dedicated setup, mission-based operation or management of defined flows and processes."
                  )}
                </p>
                <p className="max-w-3xl">
                  {t(
                    "Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.",
                    "We integrate our teams into your existing operating modes to guarantee smooth, traceable execution that complies with your internal standards."
                  )}
                </p>
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    t("Dispositif dédié pour un service ou un périmètre clairement identifié", "Dedicated setup for a clearly identified service or scope"),
                    t("Intervention par mission pour un besoin borné dans le temps ou un projet spécifique", "Mission-based intervention for a time-bound need or specific project"),
                    t("Prise en charge de flux ou de process récurrents", "Handling of recurring flows or processes"),
                    t("Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes", "Processing of files, memberships or operations according to rules defined with your teams"),
                    t("Suivi structuré avec points de contrôle réguliers", "Structured monitoring with regular control points"),
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-white/90 text-[0.85rem]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0 mt-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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
            <h3 className="text-white text-[1.15rem] font-bold mb-2">
              {t("Nous intervenons en français et en anglais.", "We operate in French and English.")}
            </h3>
            <p className="text-white text-[0.95rem] font-medium">
              {t("D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
