"use client";
import Link from "next/link";
import { ArrowRight, Zap, Calendar, BarChart3, Users, Globe2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden bg-white gap-12 md:gap-20 pb-12 md:pb-20">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nos_solutions_hero.png"
            alt="Nos Solutions"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680] from-20% via-[#1B3680]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#B8922A]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#B8922A]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#B8922A]" />
            
            <div className="relative">
              <p className="text-[#B8922A] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Vue d’ensemble des dispositifs", "Overview of solutions")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "Des dispositifs flexibles,\ncalibrés sur vos\ncontraintes opérationnelles.",
                  "Flexible solutions,\ncalibrated to your\noperational constraints."
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  <strong className="text-white">MENUA CONSULTING</strong>{" "}
                  {t(
                    "adapte ses interventions à vos contraintes : urgence, durée, volume, mode d'organisation ou langues. Nous ne proposons pas de solution standardisée, mais concevons des dispositifs flexibles, fiables et dimensionnés à vos besoins réels.",
                    "adapts its interventions to your constraints: urgency, duration, volume, organizational mode or languages. We do not offer standardized solutions, but design flexible, reliable solutions tailored to your real needs."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUITE TEXTE (Overlap layout possible) ── */}
      <section className="bg-white overflow-hidden -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto px-8 relative flex flex-col items-center justify-center">
          <div 
            className="w-full bg-[#F5F0EA] p-8 md:p-12 z-10 relative shadow-lg"
            style={{ borderRadius: "2rem 8rem 8rem 2rem" }}
          >
            <p className="text-[#3A3A3A] text-[1.05rem] leading-[1.7] font-normal space-y-4">
              <span>
                {t(
                  "Que vous ayez besoin d’un renfort immédiat pour absorber un pic d’activité, d’une externalisation continue pour sécuriser un périmètre entier, ou d’une équipe dédiée pour traiter un volume important, nous construisons avec vous la réponse opérationnelle la plus adaptée.",
                  "Whether you need immediate reinforcement to absorb a peak in activity, continuous outsourcing to secure an entire perimeter, or a dedicated team to process a large volume, we build the most appropriate operational response with you."
                )}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── MOSAÏQUE ── */}
      <section className="bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem]"
              
            >
              {t("Nos axes de flexibilité", "Our flexibility axes")}
            </h2>
            <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] mt-4 font-normal">
              {t(
                "Découvrez ci-dessous les 5 axes de flexibilité de nos interventions. Cliquez sur chaque thématique pour en explorer le détail.",
                "Discover below the 5 axes of flexibility of our interventions. Click on each theme to explore the details."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { icon: Zap, title: t("Urgence", "Emergency"), desc: t("Une mobilisation rapide pour garantir la continuité de votre service.", "Rapid mobilization to ensure your service continuity."), link: "/nos-solutions/urgence" },
              { icon: Calendar, title: t("Durée", "Duration"), desc: t("Des engagements adaptés à votre horizon de mission.", "Commitments tailored to your mission horizon."), link: "/nos-solutions/duree" },
              { icon: BarChart3, title: t("Volume", "Volume"), desc: t("Une équipe dimensionnée à votre volumétrie et à vos flux.", "A team scaled to your volume and flows."), link: "/nos-solutions/volume" },
              { icon: Users, title: t("Mode d'organisation", "Organization mode"), desc: t("Une intégration fluide à vos processus et vos outils.", "Seamless integration with your processes and tools."), link: "/nos-solutions/mode-organisation" },
              { icon: Globe2, title: t("Langues", "Languages"), desc: t("Une capacité d'intervention multilingue pour vos opérations internationales.", "Multilingual intervention capability for your international operations."), link: "/nos-solutions/langues" },
            ].map((item, i) => (
              <Link href={item.link} key={i} className="group bg-white block">
                <div className="p-10 h-full flex flex-col gap-4 transition-all duration-200 group-hover:bg-[#F2F0ED]">
                  <div className="text-[#1C40C2]">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[#1B3680] text-[1.3rem] font-semibold"
                    
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] font-normal mb-6">
                    {item.desc}
                  </p>
                  <div className="mt-auto flex items-center text-[#1C40C2] text-sm font-semibold gap-2 group-hover:gap-3 transition-all">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
