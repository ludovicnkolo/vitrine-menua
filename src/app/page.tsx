"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PieChart, Users, ShieldCheck, FileSpreadsheet, Briefcase, BarChart3, Lock, Globe, Hand, Settings, Search, Zap, Calendar, Scale, Shield, Award } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0F2B45] text-white overflow-hidden font-sans">
      
      {/* 6.2 HERO */}
      <section className="relative w-full min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#0F2B45]">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.jpg" alt="Finance operations" className="w-full h-full object-cover mix-blend-overlay opacity-40" />
          <div className="absolute inset-0 bg-[#0F2B45]/70"></div>
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto flex pb-16 pt-16 mt-8">
          <div className="w-full lg:w-2/3">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] mb-8 text-white">
              {t("Externalisation opérationnelle des fonctions back & middle office", "Operational outsourcing of back & middle office functions")}
            </h1>

            <p className="text-[#F0F2F5] text-lg max-w-2xl mb-8 leading-relaxed font-light">
              {t(
                "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
                "We secure the execution of your back and middle office operations to allow your teams to focus on strategic decisions."
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link
                href="/nous-contacter"
                className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-lg shadow-[#4A8C7A]/30"
              >
                {t("Présenter un besoin", "Submit a request")} <ArrowRight size={16} />
              </Link>
              <p className="text-white/80 text-sm max-w-xs italic">
                {t(
                  "Interventions en français et en anglais – profils opérationnels bilingues.",
                  "Interventions in French and English – bilingual operational profiles."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6.3 CHIFFRES CLÉS */}
      <section className="bg-[#F8F9FA] relative z-20 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
            <div className="flex flex-col items-center text-center px-4">
              <BarChart3 className="text-[#4A8C7A] mb-4" size={32} />
              <span className="text-4xl font-serif font-bold text-[#0F2B45] mb-2">10+</span>
              <span className="text-sm text-[#3D4F64]">{t("Années d’expérience en environnements réglementés", "Years of experience in regulated environments")}</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <CheckCircle2 className="text-[#4A8C7A] mb-4" size={32} />
              <span className="text-4xl font-serif font-bold text-[#0F2B45] mb-2">50+</span>
              <span className="text-sm text-[#3D4F64]">{t("Missions menées avec succès", "Successfully completed missions")}</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <Lock className="text-[#4A8C7A] mb-4" size={32} />
              <span className="text-4xl font-serif font-bold text-[#0F2B45] mb-2">100%</span>
              <span className="text-sm text-[#3D4F64]">{t("Sous supervision de professionnels habilités", "Under supervision of authorized professionals")}</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <Globe className="text-[#4A8C7A] mb-4" size={32} />
              <span className="text-4xl font-serif font-bold text-[#0F2B45] mb-2">FR / EN</span>
              <span className="text-sm text-[#3D4F64]">{t("Interventions en français et en anglais", "Interventions in French and English")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6.4 POSITIONNEMENT */}
      <section className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2B45] mb-6">
            {t("Au service des entreprises financières et réglementées", "Serving financial and regulated companies")}
          </h2>
          <p className="text-[#3D4F64] text-lg leading-relaxed mb-10">
            <span className="font-bold text-[#0F2B45]">MENUA CONSULTING</span> {t(
              "intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office.",
              "supports financial, accounting, wealth, data, and regulatory teams to secure and strengthen the execution of back and middle office functions."
            )}
          </p>
          <Link
            href="/nous-connaitre"
            className="inline-flex items-center gap-3 bg-[#0F2B45] hover:bg-[#1A2D4A] text-white px-8 py-3.5 rounded text-sm font-bold tracking-wider uppercase transition-all"
          >
            {t("Découvrir Menua Consulting", "Discover Menua Consulting")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6.5 VOS BESOINS */}
      <section className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16 text-[#0F2B45]">
            {t("Vos besoins", "Your Needs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PieChart, title: t("Finance & reporting", "Finance & reporting"), href: "/vos-besoins/finance-et-reporting" },
              { icon: BarChart3, title: t("Contrôle de gestion", "Management control"), href: "/vos-besoins/controle-de-gestion" },
              { icon: ShieldCheck, title: t("Risques & conformité", "Risk & compliance"), href: "/vos-besoins/risques-et-conformite" },
              { icon: FileSpreadsheet, title: t("Support comptable & data", "Accounting & data support"), href: "/vos-besoins/support-comptable-et-data" },
              { icon: Users, title: t("Gestion de patrimoine & support CGP", "Wealth management & CGP support"), href: "/vos-besoins/gestion-de-patrimoine" },
              { icon: Briefcase, title: t("Autres besoins opérationnels", "Other operational needs"), href: "/vos-besoins/autres-besoins" },
            ].map((item, i) => (
              <Link href={item.href} key={i} className="group block">
                <div 
                  className="bg-white rounded-xl p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: "0 4px 12px rgba(15,43,69,0.08)" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 24px rgba(15, 43, 69, 0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 43, 69, 0.08)")}
                >
                  <div className="text-[#4A8C7A] mb-6">
                    <item.icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-4">{item.title}</h3>
                  <div className="mt-auto flex items-center text-[#4A8C7A] text-sm font-semibold group-hover:text-[#2D7A5A] transition-colors">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6.6 POURQUOI MENUA CONSULTING */}
      <section className="bg-[#EDEFF2] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16 text-[#0F2B45]">
            {t("Pourquoi Menua Consulting", "Why Menua Consulting")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-6">
              <div className="text-[#4A8C7A] shrink-0"><Hand size={32} /></div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Approche 100% opérationnelle", "100% operational approach")}</h3>
                <p className="text-[#3D4F64] leading-relaxed">{t("Nous exécutons, nous ne nous arrêtons pas à l'analyse.", "We execute, we don't stop at analysis.")}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[#4A8C7A] shrink-0"><Users size={32} /></div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Ressources spécialisées & flexibles", "Specialized & flexible resources")}</h3>
                <p className="text-[#3D4F64] leading-relaxed">{t("Des profils adaptés à vos besoins et à vos contraintes.", "Profiles adapted to your needs and constraints.")}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[#4A8C7A] shrink-0"><Settings size={32} /></div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Méthodologie éprouvée", "Proven methodology")}</h3>
                <p className="text-[#3D4F64] leading-relaxed">{t("Découverte, analyse, mise en œuvre, suivi dans la durée.", "Discovery, analysis, implementation, long-term follow-up.")}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[#4A8C7A] shrink-0"><Search size={32} /></div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-3">{t("Contrôle qualité permanent", "Permanent quality control")}</h3>
                <p className="text-[#3D4F64] leading-relaxed">{t("Supervision continue et contrôle à quatre yeux.", "Continuous supervision and four-eyes control.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.7 NOS SOLUTIONS */}
      <section className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16 text-[#0F2B45]">
            {t("Nos solutions", "Our Solutions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: t("Urgence", "Emergency"), desc: t("Mobilisation rapide de ressources opérationnelles pour absorber une surcharge et assurer la continuité de service.", "Rapid mobilization of operational resources to absorb an overload and ensure service continuity."), icon: Zap, link: "/nos-solutions/urgence" },
              { num: "02", title: t("Durée", "Duration"), desc: t("Flexibilité contractuelle : missions courtes, longues ou externalisation continue.", "Contractual flexibility: short or long missions, or continuous outsourcing."), icon: Calendar, link: "/nos-solutions/duree" },
              { num: "03", title: t("Volume", "Volume"), desc: t("Dimensionnement adapté au volume de dossiers, flux ou opérations à traiter.", "Sizing adapted to the volume of files, flows or operations to be processed."), icon: BarChart3, link: "/nos-solutions/volume" },
              { num: "04", title: t("Mode d’organisation", "Organization mode"), desc: t("Dispositif dédié, mission, ou prise en charge de flux et process récurrents.", "Dedicated system, mission, or handling of recurring flows and processes."), icon: Users, link: "/nos-solutions/mode-d-organisation" },
            ].map((sol, i) => (
              <div key={i} className="bg-white rounded-xl p-8 flex flex-col border border-gray-100 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-[#F0F2F5] font-serif text-6xl font-bold opacity-30 pointer-events-none group-hover:text-[#C89B5E] transition-colors">{sol.num}</div>
                <div className="text-[#4A8C7A] mb-6 relative z-10"><sol.icon size={32} strokeWidth={1.5} /></div>
                <h3 className="font-serif text-xl font-bold text-[#0F2B45] mb-4 relative z-10">{sol.title}</h3>
                <p className="text-[#3D4F64] text-sm leading-relaxed mb-8 relative z-10">{sol.desc}</p>
                <div className="mt-auto relative z-10">
                  <Link href={sol.link} className="inline-flex items-center text-[#4A8C7A] text-sm font-semibold hover:text-[#2D7A5A] transition-colors">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.8 ACCRÉDITATIONS */}
      <section className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-[#0F2B45] px-6 py-3 rounded-full flex items-center gap-3">
              <Award className="text-[#C89B5E]" size={20} />
              <span className="text-[#C89B5E] text-sm font-semibold">{t("Certification AMF", "AMF Certification")}</span>
            </div>
            <div className="bg-[#0F2B45] px-6 py-3 rounded-full flex items-center gap-3">
              <Shield className="text-[#C89B5E]" size={20} />
              <span className="text-[#C89B5E] text-sm font-semibold">{t("Certification Contrôle Interne & Gestion des Risques", "Internal Control & Risk Management Certification")}</span>
            </div>
            <div className="bg-white border border-gray-200 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
              <ShieldCheck className="text-[#4A8C7A]" size={20} />
              <span className="text-[#4A8C7A] text-sm font-semibold">{t("Supervision client - Environnements réglementés", "Client Supervision - Regulated Environments")}</span>
            </div>
          </div>
          <p className="text-[#3D4F64] text-sm italic text-center max-w-2xl">
            {t("MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre.", "MENUA CONSULTING does not carry out regulated activities in its own name.")}
          </p>
        </div>
      </section>

      {/* 6.9 ACTUALITÉS */}
      <section className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2B45]">
              {t("Actualités", "News")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { img: "/news-1.jpg", date: t("28 MAI 2025","28 MAY 2025"), title: t("Digitalisation des processus back office : enjeux et bonnes pratiques","Digitalization of back office processes: challenges and best practices") },
              { img: "/news-2.jpg", date: t("21 MAI 2025","21 MAY 2025"), title: t("Conformité : les nouvelles exigences réglementaires en 2026","Compliance: the new regulatory requirements in 2026") },
              { img: "/news-3.jpg", date: t("20 MAI 2025","20 MAY 2025"), title: t("Optimiser le reporting financier grâce à la data et à la prise de décision","Optimizing financial reporting through data and decision-making") },
            ].map((news, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden group flex flex-col transition-all duration-200 border border-gray-100 hover:shadow-lg">
                <div className="h-48 overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-[#4A8C7A] text-[0.65rem] font-bold tracking-wider mb-3 block uppercase">{news.date}</span>
                  <h3 className="font-serif text-lg font-bold text-[#0F2B45] mb-6 leading-snug">{news.title}</h3>
                  <div className="mt-auto">
                    <Link
                      href="/actualites"
                      className="inline-flex items-center gap-2 text-[#4A8C7A] text-xs font-semibold hover:text-[#2D7A5A] transition-colors group/link"
                    >
                      {t("Lire l'article", "Read the article")}
                      <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/actualites"
              className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase transition-all"
            >
              {t("Voir toutes les actualités", "View all news")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
