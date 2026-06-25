"use client";
import Link from "next/link";
import { ArrowRight, Building2, Target, GitMerge, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NousConnaitreHubPage() {
  const { t } = useLanguage();
  const sections = [
    {
      title: t("Présentation du cabinet", "Firm Overview"),
      slug: "presentation-du-cabinet",
      icon: Building2,
      description: t(
        "Cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office.",
        "Firm specializing in the operational outsourcing of back and middle office functions."
      ),
    },
    {
      title: t("Notre approche", "Our Approach"),
      slug: "notre-approche",
      icon: Target,
      description: t(
        "Une posture résolument opérationnelle dans des environnements exigeants.",
        "A resolutely operational posture in demanding environments."
      ),
    },
    {
      title: t("Notre méthodologie", "Our Methodology"),
      slug: "notre-methodologie",
      icon: GitMerge,
      description: t(
        "De la découverte au suivi dans la durée : une méthodologie stricte et sécurisée.",
        "From discovery to long-term monitoring: a strict and secure methodology."
      ),
    },
    {
      title: t("Accréditations & certifications", "Accreditations & Certifications"),
      slug: "accreditations-et-certifications",
      icon: ShieldCheck,
      description: t(
        "Interventions conformes dans des environnements réglementaires très élevés.",
        "Compliant interventions in highly regulated environments."
      ),
    },
    {
      title: t("Notre équipe", "Our Team"),
      slug: "notre-equipe",
      icon: Users,
      description: t(
        "Une direction impliquée au plus près des opérations et de vos équipes.",
        "Management involved as close as possible to operations and your teams."
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
          <img src="/nous-rejoindre-hero.jpg" alt={t("Nous connaître", "About Us")} className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Nous connaître", "About Us")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">{t("Nous connaître", "About Us")}</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
            {t(
              "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office.",
              "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* GRID CARDS */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 rounded-t-[3rem] relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">{t("Découvrir le cabinet", "Discover the Firm")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {sections.map((item, idx) => (
              <Link key={idx} href={`/nous-connaitre/${item.slug}`} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c89b53]/40 transition-all duration-300 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-[#051014] text-[#c89b53] flex items-center justify-center mb-6 group-hover:bg-[#c89b53] group-hover:text-white transition-colors">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-[#051014] group-hover:text-[#c89b53] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center text-[#c89b53] text-xs font-bold tracking-widest uppercase mt-auto">
                  {t("Lire la suite", "Read more")} <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
