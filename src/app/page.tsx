"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PieChart, Users, ShieldCheck, FileSpreadsheet, Briefcase, BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#051014] text-white overflow-hidden font-sans">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#051014] via-[#051014]/80 to-transparent z-10 w-1/2"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051014] via-transparent to-transparent z-10"></div>
          <img src="/hero-bg.jpg" alt="Cityscape" className="w-full h-full object-cover object-right opacity-80 mix-blend-luminosity" />
        </div>

        <div className="absolute bottom-0 w-full h-full z-0 pointer-events-none overflow-hidden opacity-30">
          <svg viewBox="0 0 1000 1000" className="absolute -bottom-20 right-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 1000 Q 400 600 1000 800" fill="none" stroke="#c89b53" strokeWidth="1" />
            <path d="M 100 1000 Q 500 700 1000 900" fill="none" stroke="#c89b53" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto flex pb-32 lg:pb-0 pt-16">
          <div className="w-full lg:w-1/2">
            <div className="text-[#c89b53] text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-8 flex items-center gap-3">
              <span>{t("Conseil", "Consulting")}</span> <span>•</span> <span>{t("Performance", "Performance")}</span> <span>•</span> <span>{t("Confiance", "Trust")}</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] mb-8">
              <span className="text-white block mb-2">{t("Externalisation", "Operational")}</span>
              <span className="text-white block mb-2">{t("opérationnelle des", "outsourcing of")}</span>
              <span className="text-[#c89b53] block italic font-normal text-4xl md:text-5xl lg:text-6xl mt-4">{t("fonctions back & middle office", "back & middle office functions")}</span>
            </h1>

            <p className="text-gray-300 text-base lg:text-lg max-w-lg mb-4 leading-relaxed font-light">
              {t(
                "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
                "We secure the execution of your back and middle office operations to allow your teams to focus on strategic decisions."
              )}
            </p>
            <p className="text-gray-500 text-sm max-w-md mb-10 italic">
              {t(
                "Interventions en français et en anglais – profils opérationnels bilingues.",
                "Interventions in French and English – bilingual operational profiles."
              )}
            </p>

            <Link href="/nous-contacter" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-colors">
              {t("Présenter un besoin", "Submit a request")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="bg-[#f4f4f3] text-[#051014] rounded-t-[3rem] relative z-20 px-8 py-16 -mt-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto font-light">
            <span className="font-bold text-[#051014]">MENUA CONSULTING</span> {t(
              "intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office.",
              "supports financial, accounting, wealth, data, and regulatory teams to secure and strengthen the execution of back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">{t("Nos domaines d'expertise", "Our Areas of Expertise")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: PieChart, title: "Finance\n& reporting" },
              { icon: BarChart3, title: "Contrôle\nde gestion" },
              { icon: ShieldCheck, title: "Risques\n& conformité" },
              { icon: FileSpreadsheet, title: "Support\ncomptable & data" },
              { icon: Users, title: "Support\nCGP / Patrimoine" },
              { icon: Briefcase, title: "Autres besoins\nopérationnels" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 group cursor-pointer">
                <div className="text-[#c89b53] mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-xs whitespace-pre-line leading-snug">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-[#051014] rounded-t-[3rem] -mt-10 relative z-30 px-8 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d222b] via-[#051014] to-[#051014] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="text-white lg:pr-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 leading-tight">Pourquoi les entreprises<br/>nous font confiance</h2>
              <ul className="space-y-6">
                {["Approche 100% opérationnelle","Ressources spécialisées & flexibles","Méthodologie éprouvée","Contrôle qualité permanent"].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300 text-sm">
                    <CheckCircle2 className="text-[#c89b53] shrink-0" size={20} /><span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center py-10 lg:py-0">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#051014] shadow-2xl relative z-10">
                <img src="/trust-circle.jpg" alt="Architecture" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0d222b] p-8 rounded-2xl z-20 w-80 shadow-2xl border border-gray-800 text-center">
                <h3 className="font-serif text-lg font-bold mb-4 text-white">Un besoin particulier ?<br/>Parlons-en ensemble.</h3>
                <Link href="/nous-contacter" className="inline-flex items-center gap-2 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-3 rounded text-xs font-bold tracking-wider uppercase transition-colors">
                  Présenter un besoin <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="text-white lg:pl-8 mt-16 lg:mt-0 relative">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 leading-tight">Une approche<br/>qui crée<br/>de la valeur</h2>
              <ul className="space-y-6">
                {["Spécialisation back & middle office","Intégration à votre organisation","Exécution fiable et continue","Intervention bilingue FR / EN"].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300 text-sm">
                    <CheckCircle2 className="text-[#c89b53] shrink-0" size={20} /><span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALITES SECTION */}
      <section className="bg-[#f4f4f3] text-[#051014] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Actualités & publications</h2>
            <Link href="/actualites" className="flex items-center gap-2 text-[#c89b53] font-bold text-xs tracking-wider uppercase hover:text-[#b38541] transition-colors border border-gray-300 px-6 py-3 rounded">
              Voir toutes les actualités <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { img: "/news-1.jpg", date: "28 MAI 2025", title: "Digitalisation des processus back office : enjeux et bonnes pratiques" },
              { img: "/news-2.jpg", date: "21 MAI 2025", title: "Conformité : les nouvelles exigences réglementaires en 2026" },
              { img: "/news-3.jpg", date: "20 MAI 2025", title: "Optimiser le reporting financier grâce à la data et à la prise de décision" },
            ].map((news, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col border border-gray-100">
                <div className="h-48 overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-gray-400 text-[0.65rem] font-bold tracking-wider mb-3 block">{news.date}</span>
                  <h3 className="font-serif text-lg font-bold text-[#051014] mb-6 leading-snug">{news.title}</h3>
                  <div className="mt-auto">
                    <Link href="/actualites" className="inline-flex items-center gap-2 text-[#c89b53] text-xs font-semibold hover:text-[#b38541] transition-colors">
                      Lire l'article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA BOTTOM BANNER */}
          <div className="bg-[#051014] rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[300px] shadow-2xl">
            <div className="p-10 md:p-14 flex-1 flex flex-col justify-center relative z-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 leading-tight max-w-md">
                Externaliser pour mieux<br/>piloter votre performance.
              </h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">Contactez-nous pour échanger sur vos besoins.</p>
              <Link href="/nous-contacter" className="inline-flex items-center gap-3 bg-[#c89b53] hover:bg-[#b38541] text-white px-6 py-3 rounded text-xs font-bold tracking-wider uppercase transition-colors w-fit">
                Présenter un besoin <ArrowRight size={16} />
              </Link>
            </div>
            <div className="md:w-5/12 min-h-[250px] md:min-h-full relative">
              <img src="/banner-desk.jpg" alt="Desk" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#051014] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
