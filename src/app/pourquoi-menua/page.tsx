"use client";
import Link from "next/link";
import { ArrowRight, Trophy, Star, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img src="/pourquoi_menua_hero.png" alt="Pourquoi Menua" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-8 text-white mt-8">
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-6">
            {t("Vue d’ensemble des bénéfices", "Overview of benefits")}
          </p>
          <h1
            className="text-white mb-[2.25rem] text-[2.5rem] leading-[2.5rem] font-bold uppercase"
            
          >
            {t(
              "Parce que l'excellence opérationnelle n'est pas une option.",
              "Because operational excellence is not an option."
            )}
          </h1>
          <div className="text-white/90 text-[0.95rem] leading-[1.5] max-w-3xl mx-auto space-y-6 font-normal">
            <p>
              {t(
                "Choisir MENUA CONSULTING, c'est confier l'exécution de vos opérations à un partenaire spécialisé, rigoureux et engagé. Nous ne nous contentons pas d’analyser : nous exécutons, nous intégrons et nous sécurisons vos processus au quotidien.",
                "Choosing MENUA CONSULTING means entrusting the execution of your operations to a specialized, rigorous and committed partner. We don't just analyze: we execute, we integrate and we secure your processes on a daily basis."
              )}
            </p>
            <p>
              {t(
                "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                "Our 100% operational approach, our integration into client organizations and our ability to intervene in both French and English allow us to intervene in demanding, structured and internationally open environments."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── MOSAÏQUE ── */}
      <section className="bg-white px-8 py-24 border-t border-[#D8DCE8]">
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
