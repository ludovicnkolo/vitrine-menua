"use client";
import Link from "next/link";
import { ArrowRight, Clock, CalendarDays, Layers, Workflow, Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NosSolutionsHubPage() {
  const { t } = useLanguage();
  const solutions = [
    {
      title: t("Urgence", "Urgency"),
      slug: "urgence",
      icon: Clock,
      description: t(
        "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat et assurer la continuité.",
        "Rapid mobilization of operational resources to meet an immediate need and ensure continuity."
      ),
    },
    {
      title: t("Durée", "Duration"),
      slug: "duree",
      icon: CalendarDays,
      description: t(
        "Des dispositifs d'externalisation flexibles, adaptés dans le temps, pour mission courte ou longue.",
        "Flexible outsourcing arrangements, adaptable over time, for short or long-term missions."
      ),
    },
    {
      title: t("Volume", "Volume"),
      slug: "volume",
      icon: Layers,
      description: t(
        "Adaptation de nos ressources au volume de dossiers, de flux ou d'opérations à traiter.",
        "Adaptation of our resources to the volume of files, flows, or operations to be processed."
      ),
    },
    {
      title: t("Mode d'organisation", "Organization Mode"),
      slug: "mode-d-organisation",
      icon: Workflow,
      description: t(
        "Nous structurons nos interventions selon le format le plus adapté à vos contraintes internes.",
        "We structure our interventions according to the format best suited to your internal constraints."
      ),
    },
    {
      title: t("Langues", "Languages"),
      slug: "langues",
      icon: Globe,
      description: t(
        "Nous intervenons de manière native et fluide en français et en anglais.",
        "We operate natively and fluently in French and English."
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
          <img src="/nos-solutions-hero.jpg" alt={t("Nos solutions", "Our Solutions")} className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">{t("Accueil", "Home")}</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>{t("Nos solutions", "Our Solutions")}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">{t("Nos solutions", "Our Solutions")}</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
            {t(
              "Des dispositifs d'externalisation sur mesure, flexibles et adaptés à vos enjeux de croissance, de volume ou de ressources.",
              "Tailor-made, flexible outsourcing arrangements adapted to your growth, volume, or resource challenges."
            )}
          </p>
        </div>
      </section>

      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 rounded-t-[3rem] relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">{t("Des solutions adaptées", "Tailored Solutions")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {solutions.map((item, idx) => (
              <Link key={idx} href={`/nos-solutions/${item.slug}`} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c89b53]/40 transition-all duration-300 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-[#051014] text-[#c89b53] flex items-center justify-center mb-6 group-hover:bg-[#c89b53] group-hover:text-white transition-colors">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-[#051014] group-hover:text-[#c89b53] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center text-[#c89b53] text-xs font-bold tracking-widest uppercase mt-auto">
                  {t("En savoir plus", "Learn more")} <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
