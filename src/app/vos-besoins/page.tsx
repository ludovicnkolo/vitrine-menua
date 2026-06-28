"use client";
import Link from "next/link";
import { ArrowRight, PieChart, ShieldCheck, FileSpreadsheet, Users, Briefcase, BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function VosBesoinsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img src="/vos_besoins_hero.png" alt="Vos Besoins" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-8 text-white mt-8">
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-6">
            {t("Vue d’ensemble des expertises", "Overview of expertise")}
          </p>
          <h1
            className="text-white mb-[2.25rem] text-[2.5rem] leading-[2.5rem] font-bold uppercase"
            
          >
            {t(
              "Une réponse opérationnelle sur mesure pour vos back et middle offices.",
              "A tailor-made operational response for your back and middle offices."
            )}
          </h1>
          <div className="text-white/90 text-[0.95rem] leading-[1.5] max-w-3xl mx-auto space-y-6 font-normal">
            <p>
              <strong className="text-white">MENUA CONSULTING</strong>{" "}
              {t(
                "intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle.",
                "supports financial, accounting, wealth, IT and regulated teams on all back and middle office functions requiring rigor, continuity and operational reliability."
              )}
            </p>
            <p>
              {t(
                "Que vous ayez besoin de renforcer ponctuellement vos équipes, de sécuriser un processus critique ou de gérer un pic d’activité, nous mettons à votre disposition des profils immédiatement opérationnels, intégrés à vos outils et à vos méthodes.",
                "Whether you need to temporarily strengthen your teams, secure a critical process or manage a peak in activity, we provide you with immediately operational profiles, integrated into your tools and methods."
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
