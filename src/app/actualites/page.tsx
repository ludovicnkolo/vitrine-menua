"use client";
import Link from "next/link";
import { ArrowRight, Star, TrendingUp, BookOpen } from "lucide-react";

export default function ActualitesHubPage() {
  const categories = [
    {
      title: "À la une",
      slug: "a-la-une",
      icon: Star,
      description: "Sélection d’articles, de contenus et d’analyses mis en avant sur les sujets les plus récents ou les plus structurants pour vos activités.",
    },
    {
      title: "Actualités financières & réglementaires",
      slug: "financieres-et-reglementaires",
      icon: TrendingUp,
      description: "Analyse et décryptage des évolutions susceptibles d’avoir un impact sur vos organisations.",
    },
    {
      title: "Nos publications",
      slug: "nos-publications",
      icon: BookOpen,
      description: "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING.",
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
          <img src="/banner-desk.jpg" alt="Actualités" className="w-full h-full object-cover opacity-80 rounded-bl-[4rem]" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Actualités</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4">Actualités</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed">
            MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles.
          </p>
        </div>
      </section>

      {/* GRID CARDS */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-20 rounded-t-[3rem] relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">Nos catégories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
            {categories.map((item, idx) => (
              <Link key={idx} href={`/actualites/${item.slug}`} className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#c89b53]/40 transition-all duration-300 flex flex-col h-full">
                <div className="w-14 h-14 rounded-full bg-[#051014] text-[#c89b53] flex items-center justify-center mb-6 group-hover:bg-[#c89b53] group-hover:text-white transition-colors">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-[#051014] group-hover:text-[#c89b53] transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center text-[#c89b53] text-xs font-bold tracking-widest uppercase mt-auto">
                  Consulter <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
