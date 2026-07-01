"use client";
import Link from "next/link";
import { Zap, Calendar, BarChart3, Network, ArrowRight, Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nos_solutions_hero.png"
            alt="Nos Solutions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122017] from-20% via-[#122017]/75 via-50% to-transparent to-70%" />
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
              <h1 className="text-white mb-8 text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] font-bold uppercase max-w-3xl tracking-tight">
                {t("Nos\nsolutions", "Our\nsolutions").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white/90 text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3">
                <p>
                  {t(
                    "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles.",
                    "We design tailor-made outsourcing solutions, adapted to your operational constraints."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══ 1. URGENCE — Fond vert foncé, image droite ══ */}
      <section id="urgence" className="w-full bg-[#122017] py-12 lg:py-16 my-10 lg:my-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text left */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("01 — Dispositif", "01 — Solution")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6 tracking-tight">
              {t("Urgence", "Emergency")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-white/80 text-[0.95rem] leading-[1.8] mb-8">
              {t(
                "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.",
                "Rapid mobilization of operational resources to meet an immediate need, absorb an overload of activity and ensure the continuity of your service."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                t("Surcharge imprévue", "Unexpected overload"),
                t("Remplacement temporaire", "Temporary replacement"),
                t("Renfort en clôture", "Closing reinforcement"),
                t("Dossiers en retard", "Overdue files"),
                t("Absences ou congés", "Absences or leave"),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          {/* Image right */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
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

      {/* ══ 2. DURÉE — Fond crème, image gauche ══ */}
      <section id="duree" className="w-full bg-[#F6F3F0] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: image */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-[460px] h-[380px] rounded-2xl overflow-hidden shadow-xl border border-[#E0D6C8]/50">
              <img
                src="/office-lounge.jpg"
                alt="Durée"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
          {/* Right: text */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2 flex flex-col sticky top-24 self-start">
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("02 — Dispositif", "02 — Solution")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
              {t("Durée", "Duration")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <p className="text-[#122017]/75 text-[0.95rem] leading-[1.8] mb-8">
              MENUA CONSULTING {t(
                "propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille.",
                "offers flexible outsourcing solutions, adapted to the processing of a defined number of files as well as the recurring management of a portfolio."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                t("Mission courte durée", "Short term mission"),
                t("Mission longue durée", "Long term mission"),
                t("Externalisation continue", "Continuous outsourcing"),
                t("Intervention récurrente", "Recurring intervention"),
                t("Projets de transition", "Transition projects"),
                t("Congé maternité/sabbatique", "Maternity/sabbatical leave"),
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#122017]/70 text-[0.82rem]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D9B151] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. VOLUME — Fond bois/brun, grille de cards ══ */}
      <section id="volume" className="w-full py-12 lg:py-16 mb-10 lg:mb-16 overflow-hidden" style={{
        background: "linear-gradient(160deg, #8B6240 0%, #5A3A1E 40%, #3E2510 100%)"
      }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-14">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("03 — Dispositif", "03 — Solution")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-4">
              {t("Volume", "Volume")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-white/70 text-[0.95rem] text-center max-w-2xl leading-[1.8]">
              MENUA CONSULTING {t(
                "adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter.",
                "adapts the sizing of its resources to the volume of files, flows or operations to be processed."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
            {[
              { label: t("Portefeuille défini", "Defined portfolio"), desc: t("Prise en charge d'un portefeuille spécifique.", "Handling of a specific portfolio.") },
              { label: t("Flux de dossiers", "File flows"), desc: t("Gestion de flux de dossiers spécifiques en continu.", "Continuous management of specific file flows.") },
              { label: t("Volumes variables", "Variable volumes"), desc: t("Traitement de volumes variables ou saisonniers.", "Processing of variable or seasonal volumes.") },
              { label: t("Pics de charge", "Peak loads"), desc: t("Flexibilité pour absorber les pics de charge.", "Flexibility to absorb peak loads.") },
            ].map((card, i) => (
              <div key={i} className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/15 hover:bg-white/15 transition-all">
                <span className="text-[#D9B151]/50 text-[2.5rem] font-bold leading-none mb-3 select-none">0{i + 1}</span>
                <h3 className="text-white text-[0.85rem] font-bold uppercase tracking-wide mb-3 leading-tight">{card.label}</h3>
                <p className="text-white/65 text-[0.78rem] leading-[1.7]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. ORGANISATION — Fond blanc, cards verticales ══ */}
      <section id="organisation" className="w-full bg-[#FDFDFD] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: sticky title block */}
          <div className="w-full lg:w-[38%] flex flex-col sticky top-24 self-start">
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("04 — Dispositif", "04 — Solution")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
              {t("Organisation", "Organization")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <p className="text-[#122017]/70 text-[0.9rem] leading-[1.7]">
              MENUA CONSULTING {t(
                "structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux.",
                "structures its interventions according to the format most suited to your constraints: dedicated setup, mission-based operation or flow management."
              )}
            </p>
          </div>
          {/* Right: cards */}
          <div className="w-full lg:w-[62%] flex flex-col gap-5">
            {[
              { title: t("Dispositif dédié", "Dedicated setup"), desc: t("Dispositif exclusif et intégré aux outils et systèmes de votre organisation.", "Exclusive setup integrated with your organization's tools and systems.") },
              { title: t("Fonctionnement par mission", "Mission-based operation"), desc: t("Intervention ponctuelle ou structurée autour d'un projet précis.", "Occasional or structured intervention around a specific project.") },
              { title: t("Prise en charge de process", "Process handling"), desc: t("Suivi structuré avec reporting d'avancement pour les processus récurrents.", "Structured follow-up with progress reporting for recurring processes.") },
            ].map((pillar, i) => (
              <div key={i} className="flex items-start gap-6 bg-[#F6F3F0] rounded-xl p-7 border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[0.75rem] tracking-widest" style={{ backgroundColor: ["#122017", "#5A3A1E", "#8B6240"][i] }}>
                  0{i + 1}
                </div>
                <div>
                  <h3 className="text-[#122017] text-[1rem] font-bold mb-2 uppercase tracking-wide">{pillar.title}</h3>
                  <p className="text-[#122017]/70 text-[0.88rem] leading-[1.7]">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANGUES BANNER ── */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="bg-[#122017] py-10 px-10 flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-xl border border-white/10">
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
            <p className="text-white/70 text-[0.95rem] font-medium">
              {t("D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.", "Other languages can be studied according to the specific needs of your teams.")}
            </p>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
