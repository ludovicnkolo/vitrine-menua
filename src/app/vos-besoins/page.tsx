"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, LineChart, ShieldAlert, Database, Briefcase, PlusCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function VosBesoinsHubPage() {
  const { t } = useLanguage();
  const besoins = [
    {
      title: "Finance & reporting",
      slug: "finance-et-reporting",
      icon: LineChart,
      description: "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance.",
    },
    {
      title: "Contrôle de gestion",
      slug: "controle-de-gestion",
      icon: BarChart3,
      description: "Appui opérationnel au suivi budgétaire, à l’analyse des écarts et au pilotage de la performance.",
    },
    {
      title: "Risques & conformité",
      slug: "risques-et-conformite",
      icon: ShieldAlert,
      description: "Appui aux équipes risques et conformité dans le traitement et le contrôle des dossiers sensibles (KYC, AML).",
    },
    {
      title: "Support comptable & data",
      slug: "support-comptable-et-data",
      icon: Database,
      description: "Appui opérationnel aux équipes comptables, administratives et data dans le traitement des informations.",
    },
    {
      title: "Gestion de patrimoine & CGP",
      slug: "gestion-de-patrimoine",
      icon: Briefcase,
      description: "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales.",
    },
    {
      title: "Autres besoins opérationnels",
      slug: "autres-besoins",
      icon: PlusCircle,
      description: "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.",
    }
  ];

  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">
      {/* HERO */}
      <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/50 to-transparent z-10 w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#051014] z-10"></div>
          <img src="/vos-besoins-hero.jpg" alt="Vos besoins" className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Vos besoins</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">Vos besoins</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
            MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l’ensemble des fonctions back et middle office.
          </p>
        </div>
      </section>

      {/* GRID CARDS */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 rounded-t-[3rem] relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">Nos domaines d'intervention</h2>
          
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
                  Découvrir <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
