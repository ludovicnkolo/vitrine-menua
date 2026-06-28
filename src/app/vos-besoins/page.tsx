"use client";
import Link from "next/link";
import { ArrowRight, PieChart, ShieldCheck, FileSpreadsheet, Users, Briefcase, BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden bg-white gap-12 md:gap-20 pb-12 md:pb-20">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/vos_besoins_hero.png"
            alt="Vos Besoins"
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
                {t("Vue d’ensemble des expertises", "Overview of expertise")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "Une réponse opérationnelle\nsur mesure pour vos\nback et middle offices.",
                  "A tailor-made\noperational response for your\nback and middle offices."
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  <strong className="text-white">MENUA CONSULTING</strong>{" "}
                  {t(
                    "intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                    "supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
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
                  "Que vous ayez besoin de renforcer ponctuellement vos équipes, de sécuriser un processus critique ou de gérer un pic d’activité, nous mettons à votre disposition des profils immédiatement opérationnels, intégrés à vos outils et à vos méthodes.",
                  "Whether you need to temporarily strengthen your teams, secure a critical process or manage a peak in activity, we provide you with immediately operational profiles, integrated into your tools and methods."
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
              {t("Nos 5 domaines d'intervention", "Our 5 areas of intervention")}
            </h2>
            <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] mt-4 font-normal">
              {t(
                "Découvrez ci-dessous nos domaines d’intervention. Cliquez sur chaque service pour accéder à sa description complète.",
                "Discover our areas of intervention below. Click on each service to access its full description."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { icon: PieChart, title: t("Finance & reporting", "Finance & reporting"), desc: t("Production, structuration et fiabilisation de vos reportings financiers.", "Production, structuring and reliability of your financial reporting."), link: "/vos-besoins/finance-reporting" },
              { icon: ShieldCheck, title: t("Risques & conformité", "Risk & compliance"), desc: t("Appui opérationnel aux équipes risques et conformité (KYC, LCB-FT).", "Operational support for risk and compliance teams (KYC, AML)."), link: "/vos-besoins/risques-conformite" },
              { icon: FileSpreadsheet, title: t("Support comptable & data", "Accounting & data support"), desc: t("Fiabilisation, structuration et traitement de vos données comptables.", "Reliability, structuring and processing of your accounting data."), link: "/vos-besoins/support-comptable-data" },
              { icon: Users, title: t("Gestion de patrimoine & CGP", "Wealth management & CGP"), desc: t("L’exécution administrative au service des conseillers en gestion de patrimoine.", "Administrative execution for wealth management advisors."), link: "/vos-besoins/gestion-patrimoine-cgp" },
              { icon: Briefcase, title: t("Autres besoins opérationnels", "Other operational needs"), desc: t("Une réponse agile à vos besoins ponctuels, transverses ou spécifiques.", "An agile response to your one-off, transversal or specific needs."), link: "/vos-besoins/autres-besoins-operationnels" },
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
