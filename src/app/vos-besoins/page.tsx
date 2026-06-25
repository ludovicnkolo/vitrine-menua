"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, LineChart, ShieldAlert, Database, Briefcase, PlusCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function VosBesoinsHubPage() {
  const { t } = useLanguage();
  const besoins = [
    {
      title: t("Finance & reporting", "Finance & Reporting"),
      slug: "finance-et-reporting",
      icon: LineChart,
      description: t(
        "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance.",
        "Production, structuring and reliability of financial reports for performance management."
      ),
    },
    {
      title: t("Contrôle de gestion", "Management Control"),
      slug: "controle-de-gestion",
      icon: BarChart3,
      description: t(
        "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance.",
        "Operational support for budget monitoring, variance analysis, and performance management."
      ),
    },
    {
      title: t("Risques & conformité", "Risks & Compliance"),
      slug: "risques-et-conformite",
      icon: ShieldAlert,
      description: t(
        "Appui aux équipes risques et conformité dans le traitement et le contrôle des dossiers sensibles (KYC, AML).",
        "Support for risk and compliance teams in processing and controlling sensitive files (KYC, AML)."
      ),
    },
    {
      title: t("Support comptable & data", "Accounting & Data Support"),
      slug: "support-comptable-et-data",
      icon: Database,
      description: t(
        "Appui opérationnel aux équipes comptables, administratives et data dans le traitement des informations.",
        "Operational support for accounting, administrative, and data teams in processing information."
      ),
    },
    {
      title: t("Gestion de patrimoine & CGP", "Wealth Management & CGP"),
      slug: "gestion-de-patrimoine",
      icon: Briefcase,
      description: t(
        "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales.",
        "Operational support for wealth management firms, family offices, and wealth structures."
      ),
    },
    {
      title: t("Autres besoins opérationnels", "Other Operational Needs"),
      slug: "autres-besoins",
      icon: PlusCircle,
      description: t(
        "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.",
        "Handling of specific, cross-functional, or one-time operational needs."
      ),
    }
  ];

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO — height adapts to content */}
      <section className="relative w-full flex items-end overflow-hidden pt-36 pb-20 bg-[#051014]">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#051014] z-10"></div>
          <img src="/vos-besoins-hero.jpg" alt={t("Vos besoins", "Your Needs")} className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Vos besoins", "Your Needs")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">{t("Vos besoins", "Your Needs")}</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
            {t(
              "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office.",
              "MENUA CONSULTING supports financial, accounting, wealth, IT, and regulated teams across all back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* GRID CARDS */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 rounded-t-[3rem] relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">{t("Nos domaines d'intervention", "Our Areas of Intervention")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {besoins.map((item, idx) => (
              <Link key={idx} href={`/vos-besoins/${item.slug}`} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c89b53]/40 transition-all duration-300 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-[#051014] text-[#c89b53] flex items-center justify-center mb-6 group-hover:bg-[#c89b53] group-hover:text-white transition-colors">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-[#051014] group-hover:text-[#c89b53] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center text-[#c89b53] text-xs font-bold tracking-widest uppercase mt-auto">
                  {t("Découvrir", "Discover")} <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
