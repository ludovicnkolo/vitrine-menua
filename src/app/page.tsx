"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PieChart, Users, ShieldCheck, FileSpreadsheet, Briefcase, BarChart3, Lock, Globe, Settings, Search, Zap, Calendar, Scale, Shield, Award } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden">

      {/* ── HERO — pleine largeur, photo + overlay marine ── */}
      <section className="relative w-full min-h-[92vh] flex items-end pb-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Finance opérationnelle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680]/95 via-[#1B3680]/80 to-[#1B3680]/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pb-24 pt-40">
          <p className="section-eyebrow text-[#DAF0F7]/80 mb-6">
            {t("Cabinet de conseil — France", "Advisory firm — France")}
          </p>
          <h1
            className="text-white mb-8 leading-[1.08]"
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
              fontWeight: 600,
            }}
          >
            {t(
              "Externalisation opérationnelle\ndes fonctions back & middle office",
              "Operational outsourcing\nof back & middle office functions"
            )}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-10 leading-relaxed font-light">
            {t(
              "Nous sécurisons l'exécution de vos opérations pour que vos équipes se concentrent sur les décisions stratégiques.",
              "We secure your operations execution so your teams focus on strategic decisions."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/nous-contacter"
              className="inline-flex items-center gap-3 bg-[#1C40C2] hover:bg-[#142E9A] text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
            >
              {t("Présenter un besoin", "Submit a request")} <ArrowRight size={15} />
            </Link>
            <Link
              href="/nous-connaitre"
              className="inline-flex items-center gap-3 border border-white/40 hover:border-white text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
            >
              {t("Découvrir Menua", "Discover Menua")} <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Barre de scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="text-white text-[0.6rem] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ── CHIFFRES CLÉS — bande blanche style Laplace ── */}
      <section className="bg-white border-b border-[#D8DCE8] py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#D8DCE8]">
          {[
            { value: "10+", label: t("Années en environnements réglementés", "Years in regulated environments") },
            { value: "50+", label: t("Missions accomplies avec succès", "Successfully completed missions") },
            { value: "100%", label: t("Supervision par professionnels habilités", "Supervised by qualified professionals") },
            { value: "FR / EN", label: t("Interventions bilingues", "Bilingual interventions") },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-4">
              <span
                className="text-[#1B3680] mb-1"
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span className="text-[#4A4E5A] text-xs leading-snug mt-2 max-w-[120px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── POSITIONNEMENT — fond glacier ── */}
      <section className="bg-[#DAF0F7] px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-eyebrow mb-5">
            {t("Notre positionnement", "Our positioning")}
          </p>
          <h2
            className="text-[#1B3680] mb-8"
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {t(
              "Au service des acteurs financiers et réglementés en France",
              "Serving financial and regulated institutions in France"
            )}
          </h2>
          <p className="text-[#3A4660] text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            <strong className="text-[#1B3680]">MENUA CONSULTING</strong>{" "}
            {t(
              "est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back office et middle office pour des acteurs financiers et réglementés : banques, cabinets de gestion de patrimoine, sociétés financières, experts-comptables.",
              "is a firm specialising in operational outsourcing of back office and middle office functions for financial and regulated players: banks, wealth management firms, financial companies, chartered accountants."
            )}
          </p>
          <Link
            href="/nous-connaitre"
            className="inline-flex items-center gap-3 border border-[#1B3680] text-[#1B3680] hover:bg-[#1B3680] hover:text-white px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
          >
            {t("Découvrir le cabinet", "Discover the firm")} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── VOS BESOINS — fond blanc ── */}
      <section className="bg-white px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow mb-4">{t("Domaines d'intervention", "Areas of intervention")}</p>
            <h2
              className="text-[#1B3680]"
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 600,
              }}
            >
              {t("Vos besoins", "Your needs")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { icon: PieChart, title: t("Finance & reporting", "Finance & reporting"), href: "/vos-besoins#finance-reporting" },
              { icon: BarChart3, title: t("Contrôle de gestion", "Management control"), href: "/vos-besoins#controle-gestion" },
              { icon: ShieldCheck, title: t("Risques & conformité", "Risk & compliance"), href: "/vos-besoins#risques-conformite" },
              { icon: FileSpreadsheet, title: t("Support comptable & data", "Accounting & data support"), href: "/vos-besoins#support-comptable" },
              { icon: Users, title: t("Gestion de patrimoine & CGP", "Wealth management & CGP"), href: "/vos-besoins#gestion-patrimoine" },
              { icon: Briefcase, title: t("Autres besoins opérationnels", "Other operational needs"), href: "/vos-besoins#autres-besoins" },
            ].map((item, i) => (
              <Link href={item.href} key={i} className="group bg-white block">
                <div className="p-10 h-full flex flex-col gap-5 transition-all duration-200 group-hover:bg-[#F2F0ED]">
                  <div className="text-[#1C40C2]">
                    <item.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[#1B3680]"
                    style={{
                      fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center text-[#1C40C2] text-sm font-semibold gap-2 group-hover:gap-3 transition-all">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI MENUA — fond taupe léger ── */}
      <section className="bg-[#F2F0ED] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow mb-5">{t("Notre valeur ajoutée", "Our value proposition")}</p>
              <h2
                className="text-[#1B3680] mb-8"
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 600,
                }}
              >
                {t("Pourquoi Menua Consulting ?", "Why Menua Consulting?")}
              </h2>
              <p className="text-[#3A4660] leading-relaxed mb-8">
                {t(
                  "Nous exécutons là où les autres s'arrêtent à l'analyse. Notre approche opérationnelle, nos profils spécialisés et notre méthodologie éprouvée font la différence dans vos environnements réglementés.",
                  "We execute where others stop at analysis. Our operational approach, specialised profiles, and proven methodology make the difference in your regulated environments."
                )}
              </p>
              <Link
                href="/pourquoi-menua"
                className="inline-flex items-center gap-3 bg-[#1B3680] hover:bg-[#122560] text-white px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-200"
              >
                {t("Nos différenciants", "Our differentiators")} <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Settings, title: t("Approche 100% opérationnelle", "100% operational approach"), desc: t("Nous exécutons, nous ne nous arrêtons pas à l'analyse.", "We execute, not just analyse.") },
                { icon: Users, title: t("Ressources spécialisées & flexibles", "Specialised & flexible resources"), desc: t("Profils adaptés à vos besoins et contraintes réglementaires.", "Profiles adapted to your needs and regulatory constraints.") },
                { icon: Search, title: t("Contrôle qualité permanent", "Permanent quality control"), desc: t("Supervision continue et contrôle à quatre yeux.", "Continuous supervision and four-eyes control.") },
                { icon: Scale, title: t("Expertise sectorielle certifiée", "Certified sector expertise"), desc: t("Maîtrise des environnements AMF, ACPR et réglementations financières.", "Expertise in AMF, ACPR and financial regulations.") },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 bg-white p-6 border-l-2 border-[#1C40C2]">
                  <div className="text-[#1C40C2] shrink-0 mt-0.5">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3
                      className="text-[#1B3680] mb-1"
                      style={{
                        fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[#4A4E5A] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS SOLUTIONS — fond blanc, grille numérotée style Laplace ── */}
      <section className="bg-white px-8 py-24 border-t border-[#D8DCE8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-eyebrow mb-4">{t("Notre offre", "Our offer")}</p>
            <h2
              className="text-[#1B3680]"
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 600,
              }}
            >
              {t("Nos solutions", "Our solutions")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D8DCE8]">
            {[
              { num: "01", icon: Zap, title: t("Urgence", "Emergency"), desc: t("Mobilisation rapide pour absorber une surcharge et assurer la continuité de service.", "Rapid mobilisation to handle overload and ensure service continuity."), link: "/nos-solutions#urgence" },
              { num: "02", icon: Calendar, title: t("Durée", "Duration"), desc: t("Flexibilité contractuelle : missions courtes, longues ou externalisation continue.", "Contractual flexibility: short missions, long missions or ongoing outsourcing."), link: "/nos-solutions#duree" },
              { num: "03", icon: BarChart3, title: t("Volume", "Volume"), desc: t("Dimensionnement adapté au volume de dossiers, flux ou opérations à traiter.", "Sizing adapted to the volume of files, flows or operations to be processed."), link: "/nos-solutions#volume" },
              { num: "04", icon: Users, title: t("Organisation", "Organisation"), desc: t("Dispositif dédié ou prise en charge de flux et process récurrents.", "Dedicated setup or handling of recurring flows and processes."), link: "/nos-solutions#organisation" },
            ].map((sol, i) => (
              <div key={i} className="bg-white group relative overflow-hidden">
                <div className="p-10 flex flex-col h-full gap-4 transition-all duration-200 group-hover:bg-[#1B3680]">
                  <span
                    className="text-[#D8DCE8] group-hover:text-[#2447A0] transition-colors"
                    style={{
                      fontFamily: "var(--font-serif, serif)",
                      fontSize: "3.5rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {sol.num}
                  </span>
                  <div className="text-[#1C40C2] group-hover:text-[#DAF0F7] transition-colors">
                    <sol.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[#1B3680] group-hover:text-white transition-colors"
                    style={{
                      fontFamily: "var(--font-serif, serif)",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                    }}
                  >
                    {sol.title}
                  </h3>
                  <p className="text-[#4A4E5A] group-hover:text-white/75 text-sm leading-relaxed transition-colors">
                    {sol.desc}
                  </p>
                  <Link
                    href={sol.link}
                    className="mt-auto inline-flex items-center gap-2 text-[#1C40C2] group-hover:text-[#DAF0F7] text-sm font-semibold transition-colors"
                  >
                    {t("En savoir plus", "Learn more")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCRÉDITATIONS — bande marine sombre style Laplace ── */}
      <section className="bg-[#1B3680] px-8 py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#DAF0F7]/70 text-[0.65rem] font-bold tracking-widest uppercase mb-2">
              {t("Environnements maîtrisés", "Mastered environments")}
            </p>
            <h3
              className="text-white"
              style={{
                fontFamily: "var(--font-serif, serif)",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {t("Supervision & certifications", "Supervision & certifications")}
            </h3>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {[
              { icon: Award, label: t("Environnement AMF", "AMF Environment") },
              { icon: Shield, label: t("Contrôle Interne & Risques", "Internal Control & Risk") },
              { icon: ShieldCheck, label: t("Conformité ACPR", "ACPR Compliance") },
              { icon: Lock, label: t("Profils habilités", "Authorised profiles") },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5">
                <badge.icon className="text-[#B8922A]" size={16} />
                <span className="text-white text-xs font-semibold">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs italic text-center">
            {t(
              "MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Les interventions sont réalisées sous la supervision des responsables habilités de nos clients.",
              "MENUA CONSULTING does not carry out regulated activities in its own name. Interventions are conducted under the supervision of our clients' authorised managers."
            )}
          </p>
        </div>
      </section>

      {/* ── ACTUALITÉS — fond blanc ── */}
      <section className="bg-white px-8 py-24 border-t border-[#D8DCE8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
            <div>
              <p className="section-eyebrow mb-4">{t("Veille & expertise", "Watch & expertise")}</p>
              <h2
                className="text-[#1B3680]"
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 600,
                }}
              >
                {t("Actualités", "News")}
              </h2>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-[#1C40C2] text-sm font-semibold hover:gap-3 transition-all whitespace-nowrap"
            >
              {t("Voir toutes les actualités", "View all news")} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { img: "/news-1.jpg", cat: t("BACK OFFICE", "BACK OFFICE"), date: t("28 MAI 2025", "28 MAY 2025"), title: t("Digitalisation des processus back office : enjeux et bonnes pratiques", "Back office process digitalisation: challenges and best practices") },
              { img: "/news-2.jpg", cat: t("CONFORMITÉ", "COMPLIANCE"), date: t("21 MAI 2025", "21 MAY 2025"), title: t("Conformité : les nouvelles exigences réglementaires en 2026", "Compliance: new regulatory requirements for 2026") },
              { img: "/news-3.jpg", cat: t("REPORTING", "REPORTING"), date: t("20 MAI 2025", "20 MAY 2025"), title: t("Optimiser le reporting financier grâce à la data", "Optimising financial reporting through data") },
            ].map((news, i) => (
              <Link href="/actualites" key={i} className="group bg-white flex flex-col overflow-hidden">
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={news.img}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#1B3680]/0 group-hover:bg-[#1B3680]/20 transition-all duration-300" />
                  <span className="absolute top-4 left-4 bg-[#1B3680] text-white text-[0.6rem] font-bold tracking-widest uppercase px-3 py-1">
                    {news.cat}
                  </span>
                </div>
                <div className="p-8 flex flex-col flex-grow border-t border-[#D8DCE8]">
                  <span className="text-[#6B7794] text-[0.65rem] font-semibold tracking-wider mb-3">{news.date}</span>
                  <h3
                    className="text-[#1B3680] leading-snug mb-6 flex-grow"
                    style={{
                      fontFamily: "var(--font-serif, serif)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {news.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-[#1C40C2] text-xs font-semibold group-hover:gap-3 transition-all">
                    {t("Lire l'article", "Read article")} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL — marine ── */}
      <section className="bg-[#122560] px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#DAF0F7]/60 text-[0.65rem] font-bold tracking-widest uppercase mb-6">
            {t("Prenons contact", "Get in touch")}
          </p>
          <h2
            className="text-white mb-8"
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 600,
            }}
          >
            {t(
              "Un projet d'externalisation ? Parlons-en.",
              "An outsourcing project? Let's talk."
            )}
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            {t(
              "Nos équipes analysent votre besoin et vous proposent un dispositif adapté à vos contraintes opérationnelles et réglementaires.",
              "Our teams analyse your needs and propose a solution adapted to your operational and regulatory constraints."
            )}
          </p>
          <Link
            href="/nous-contacter"
            className="inline-flex items-center gap-3 bg-white text-[#1B3680] hover:bg-[#DAF0F7] px-10 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-200"
          >
            {t("Nous contacter", "Contact us")} <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
