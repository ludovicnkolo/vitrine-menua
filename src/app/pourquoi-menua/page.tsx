"use client";
import Link from "next/link";
import { ArrowRight, Trophy, Star, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden bg-white gap-12 md:gap-20 pb-12 md:pb-20">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/pourquoi_menua_hero.png"
            alt="Pourquoi Menua"
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
                {t("Vue d’ensemble des bénéfices", "Overview of benefits")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "Parce que l'excellence\nopérationnelle\nn'est pas une option.",
                  "Because operational\nexcellence\nis not an option."
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  {t(
                    "Choisir MENUA CONSULTING, c'est confier l'exécution de vos opérations à un partenaire spécialisé, rigoureux et engagé. Nous ne nous contentons pas d’analyser : nous exécutons, nous intégrons et nous sécurisons vos processus au quotidien.",
                    "Choosing MENUA CONSULTING means entrusting the execution of your operations to a specialized, rigorous and committed partner. We don't just analyze: we execute, we integrate and we secure your processes on a daily basis."
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
                  "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                  "Our 100% operational approach, our integration into client organizations and our ability to intervene in both French and English allow us to intervene in demanding, structured and internationally open environments."
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
              {t("La valeur MENUA CONSULTING", "The MENUA CONSULTING value")}
            </h2>
            <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] mt-4 font-normal">
              {t(
                "Découvrez en détail nos bénéfices, nos atouts différenciants et nos engagements qualité.",
                "Discover in detail our benefits, our differentiating assets and our quality commitments."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { icon: Trophy, title: t("Nos bénéfices", "Our benefits"), desc: t("Gagnez en efficacité, fiabilité et performance durable.", "Gain efficiency, reliability and sustainable performance."), link: "/pourquoi-menua/nos-benefices" },
              { icon: Star, title: t("Notre différenciation", "Our differentiation"), desc: t("Spécialistes du back et du middle office, nous exécutons.", "Back and middle office specialists, we execute."), link: "/pourquoi-menua/notre-differenciation" },
              { icon: Shield, title: t("Nos engagements", "Our commitments"), desc: t("Une promesse de rigueur, de transparence et de conformité.", "A promise of rigor, transparency and compliance."), link: "/pourquoi-menua/nos-engagements" },
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
