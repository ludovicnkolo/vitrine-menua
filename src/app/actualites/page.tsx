import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    img: "/news-1.jpg",
    date: "28 MAI 2025",
    category: "Actualités financières & réglementaires",
    tag: "Financier",
    title: "Digitalisation des processus back office : enjeux et bonnes pratiques",
    excerpt: "La transformation numérique des fonctions back office impose aux acteurs financiers d'adapter leurs processus internes avec rigueur et méthode."
  },
  {
    img: "/news-2.jpg",
    date: "21 MAI 2025",
    category: "Nos publications",
    tag: "Publication",
    title: "Conformité : les nouvelles exigences réglementaires en 2026",
    excerpt: "Les évolutions du cadre réglementaire imposent aux équipes conformité une vigilance accrue sur le traitement des dossiers KYC et LCB-FT."
  },
  {
    img: "/news-3.jpg",
    date: "20 MAI 2025",
    category: "Actualités financières & réglementaires",
    tag: "Financier",
    title: "Optimiser le reporting financier grâce à la data et à la prise de décision",
    excerpt: "La fiabilisation des données de reporting est devenue un levier stratégique pour les directions financières et les équipes de contrôle de gestion."
  },
  {
    img: "/news-1.jpg",
    date: "14 MAI 2025",
    category: "Nos publications",
    tag: "Publication",
    title: "Externalisation back office : pourquoi les acteurs patrimoniaux font le choix de la flexibilité",
    excerpt: "Face à la complexité croissante des opérations, la délégation des fonctions back et middle office s'impose comme une solution structurante."
  },
  {
    img: "/news-2.jpg",
    date: "05 MAI 2025",
    category: "Actualités financières & réglementaires",
    tag: "Financier",
    title: "Rapprochements bancaires et lettrage : les bonnes pratiques opérationnelles",
    excerpt: "La qualité des rapprochements bancaires conditionne la fiabilité de la production comptable et la sécurité des clôtures."
  },
  {
    img: "/news-3.jpg",
    date: "28 AVR. 2025",
    category: "Nos publications",
    tag: "Publication",
    title: "Contrôle à quatre yeux : un standard d'exigence pour les opérations sensibles",
    excerpt: "Le double regard sur les opérations critiques est un pilier de la qualité opérationnelle et de la maîtrise des risques internes."
  },
];

export default function Actualites() {
  return (
    <main className="flex flex-col w-full bg-[#051014] text-white font-sans">

      {/* HERO */}
      <section className="relative w-full min-h-[55vh] flex items-end overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/70 to-transparent z-10 w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/banner-desk.jpg" alt="Actualités" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pb-20">
          <div className="text-[#c89b53] text-[0.65rem] tracking-wider uppercase mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2 text-gray-600">›</span>
            <span>Actualités</span>
          </div>
          <h1 className="font-serif text-6xl font-bold leading-tight mb-4">Actualités</h1>
          <div className="w-12 h-1 bg-[#c89b53] mb-6"></div>
          <p className="text-gray-300 max-w-lg text-sm leading-relaxed">
            MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d'éclairer ses clients sur les enjeux qui impactent leurs activités.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 pt-12 pb-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
          {["Tous", "Actualités financières & réglementaires", "Nos publications"].map((cat, i) => (
            <button key={i} className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors border ${i === 0 ? "bg-[#051014] text-white border-[#051014]" : "bg-white text-gray-600 border-gray-200 hover:border-[#c89b53] hover:text-[#c89b53]"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLE À LA UNE — horizontal hero card */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c89b53] text-[0.65rem] font-bold tracking-wider uppercase mb-6">À la une</p>
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="md:w-1/2 h-72 md:h-auto overflow-hidden relative">
              <img src={articles[0].img} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex-1 p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#c89b53]/10 text-[#c89b53] text-[0.6rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full">{articles[0].tag}</span>
                <span className="text-gray-400 text-[0.65rem]">{articles[0].date}</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-4">{articles[0].title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{articles[0].excerpt}</p>
              <Link href="#" className="inline-flex items-center gap-2 text-[#c89b53] text-xs font-semibold hover:text-[#b38541] transition-colors">
                Lire l'article <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GRID HORIZONTAL — tous les articles */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c89b53] text-[0.65rem] font-bold tracking-wider uppercase mb-8">Toutes les actualités</p>
          
          {/* Articles in horizontal card rows — image left, text right */}
          <div className="space-y-6">
            {articles.slice(1).map((article, i) => (
              <div key={i} className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                {/* Image on left */}
                <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0 relative">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Content on right */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#c89b53]/10 text-[#c89b53] text-[0.6rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full">{article.tag}</span>
                    <span className="text-gray-400 text-[0.65rem]">{article.date}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-snug mb-3">{article.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <Link href="#" className="inline-flex items-center gap-2 text-[#c89b53] text-xs font-semibold hover:text-[#b38541] transition-colors w-fit">
                    Lire l'article <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOS PUBLICATIONS LinkedIn CTA */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-16 border-t border-gray-200 pt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">Nos publications</h2>
            <p className="text-gray-500 text-sm">Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur LinkedIn.</p>
          </div>
          <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-[#c89b53] text-[#c89b53] px-6 py-3 rounded text-xs font-bold tracking-wider uppercase hover:bg-[#c89b53]/10 transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            Suivre sur LinkedIn
          </a>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section className="bg-[#051014] px-8 py-20">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[220px]">
          <div className="flex-1 bg-[#0d222b] p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Un besoin particulier ?<br/>Nous construisons une solution adaptée.</h2>
            <Link href="/nous-contacter" className="mt-4 inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
          <div className="md:w-5/12 min-h-[200px] relative">
            <img src="/nous-contacter-hero.jpg" alt="Contact" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d222b] to-transparent"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
