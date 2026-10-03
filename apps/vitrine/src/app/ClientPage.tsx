"use client";
import React, { useState, useEffect } from "react";
import Link from "@/components/Link";
import { ArrowRight, Globe, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { generateSlug } from "@/utils/slug";

export default function Home() {
  const { lang, t } = useLanguage();
  const isEN = lang === 'EN';

  const displayTitle = (pub: any) => (isEN && pub.title_en) ? pub.title_en : pub.title;
  const displayContent = (pub: any) => (isEN && pub.contentHtml_en) ? pub.contentHtml_en : pub.contentHtml;
  const displayCategory = (pub: any) => (isEN && pub.category_en) ? pub.category_en : pub.category;
  const [publications, setPublications] = useState<any[]>([]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const locale = lang === 'EN' ? 'en-GB' : 'fr-FR';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const res = await fetch('/api/cms/public?type=ACTUALITE');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setPublications(data.data.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités:", err);
      }
    };
    fetchPubs();
  }, []);

  return (
    <main className="flex flex-col w-full min-h-screen">

      {/* ── SECTION 1 : HERO ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero-paris.webp"
            alt="Paris Aerial"
            className="w-full h-full object-cover object-[75%_center] md:object-[80%_center] lg:object-center"
            onError={(e) => { e.currentTarget.src = "/img/hero-paris.webp"; }}
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>

        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-40 md:pt-48 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-8 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl lg:max-w-6xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-12 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.65rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              <span className="lg:whitespace-nowrap">
                {t("Externalisation opérationnelle des", "Operational outsourcing")}
                <span className="hidden xl:inline">{isEN ? "" : " fonctions"}</span>
              </span>
              {" "}
              <br className="hidden lg:block" />
              <span className="lg:whitespace-nowrap">
                <span className="xl:hidden">{isEN ? "" : "fonctions "}</span>
                {t("back ", "for back ")}
                <span className="font-sans font-medium text-[1.2em] relative top-[1px] mx-1">&amp;</span>
                {t(" middle office.", " middle-office.")}
              </span>
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t(
                "Nous sécurisons l'exécution de vos opérations afin de permettre à vos équipes de se concentrer sur leurs décisions stratégiques, leurs validations et leur relation client.",
                "We work alongside your teams to safeguard day-to-day operations, so they can focus on strategic decisions, approvals and client relationships."
              )}
            </p>
            <div className="flex items-center gap-2 text-white landscape:mt-2 landscape:lg:mt-0">
              <Globe size={16} />
              <p className="text-[0.9rem] lg:text-[0.95rem] text-white font-light italic tracking-wide">
                {t(
                  "Interventions en français et en anglais – profils opérationnels bilingues.",
                  "Services delivered in French and English — bilingual operational professionals."
                )}
              </p>
            </div>
            <div className="mt-4">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 text-left px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                <span className="max-w-[16ch] sm:max-w-none">{t("Présenter votre besoin", "Tell us about your requirements")}</span>
                <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : INTRO ── */}
      {/* Contained rectangle: image + card live in ONE parent div → no overflow into neighbours */}
      <section className="relative w-full bg-white pt-28 lg:pt-36 pb-16 lg:pb-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center">

            {/* Image — desktop left half */}
            <div className="hidden lg:flex w-5/12 shrink-0 z-20 items-center justify-end">
              <div className="w-[85%] lg:h-[360px] relative overflow-hidden shadow-xl">
                <img
                  src="/img/accueil-intro.webp"
                  alt="Intro"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }}
                />
              </div>
            </div>

            {/* Card — overlaps image with -ml-16, but stays inside the rectangle */}
            <div className="w-full lg:w-8/12 lg:-ml-16 z-10 flex items-center">
              <div className="w-full bg-[#e8e1d7] shadow-xl px-6 portrait:sm:px-10 lg:pr-14 lg:pl-28 py-10 lg:py-14">
                <div className="w-16 h-[3px] bg-[#141824] mb-5"></div>
                <h2 className="font-bold text-[1.3rem] md:text-[1.5rem] text-[#141824] leading-tight mb-6 uppercase tracking-wider">
                  {t("Externalisation back et middle office", "Back and middle-office outsourcing")}
                </h2>

                {/* Mobile Image */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                  <img
                    src="/img/accueil-intro.webp"
                    alt="Intro"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }}
                  />
                </div>

                <div className="leading-relaxed text-[#141824] text-[1.1rem] md:text-[1.2rem] font-light mb-8 space-y-6">
                  <p>
                    {formatBrand(t(
                      "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT, data et réglementées pour sécuriser et renforcer l'exécution de leurs fonctions back et middle office. Nous prenons en charge des opérations clairement définies, selon les procédures, les outils, les priorités et les circuits de validation de chaque client.",
                      "MENUA CONSULTING supports finance, accounting, wealth management, IT and data teams, as well as teams operating in regulated environments, by safeguarding and strengthening the delivery of their back and middle office functions. We take ownership of clearly defined operations in line with each client's procedures, tools, priorities and approval workflows."
                    ))}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Link href="/nous-connaitre" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right sm:text-left">
                    <span className="max-w-[16ch] sm:max-w-none">{t("Nous connaître", "About us")}</span>
                    <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                    <ChevronRight size={18} className="-ml-2" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3 : POURQUOI MENUA (Dark Navy block) ── */}
      <section className="relative w-full bg-[#141824] text-white pt-16 lg:pt-20 pb-16 lg:pb-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">

          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5"></div>
            <h2 className="text-white text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">
              {t("Pourquoi MENUA CONSULTING ?", "Why choose us?")}
            </h2>
            <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed mb-8">
              {formatBrand(t(
                "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants, avec une approche structurée, traçable et adaptée à leurs contraintes.",
                "MENUA CONSULTING works closely with organisations facing demanding operational challenges, providing structured, traceable support tailored to their environment and priorities."
              ))}
            </p>
          </div>

          {/* Right Column: 4 Assets in a Grid */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Spécialisation", "Specialisation")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">{t("Back et Middle Office", "Back and middle office")}</p>
              </div>
              <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Exécution", "Delivery")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">{t("Approche 100 % opérationnelle", "A firmly delivery-focused approach")}</p>
              </div>
              <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Fiabilité", "Reliability")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">{t("Continuité et qualité de service", "Business continuity and consistent service quality")}</p>
              </div>
              <div className="border-l-2 border-[#e8e1d7]/30 pl-6">
                <h3 className="text-[#e8e1d7] font-semibold text-[1.3rem] mb-2">{t("Bilingue", "Bilingual capability")}</h3>
                <p className="text-white/80 font-light text-[1.05rem]">{t("Français et anglais", "French and English")}</p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Link href="/pourquoi-menua" className="inline-flex items-center gap-2 text-[#e8e1d7] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right sm:text-left">
                <span className="max-w-[16ch] sm:max-w-none">{t("Nos atouts et engagements", "Our strengths and commitments")}</span>
                <span className="w-8 h-[1px] bg-[#e8e1d7] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={18} className="-ml-2" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4 : VOS BESOINS ── */}
      {/* Contained rectangle: card + image live in ONE parent div → no overflow */}
      <section className="relative w-full bg-white py-16 lg:py-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-16">
          <div className="flex flex-col lg:flex-row-reverse lg:items-center">

            {/* Image — desktop right half */}
            <div className="hidden lg:block w-4/12 lg:h-[360px] shrink-0 relative overflow-hidden shadow-xl z-20">
              <img
                src="/img/besoins-meeting.webp"
                alt="Vos besoins"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
              />
            </div>

            {/* Card — overlaps image with -mr-16, stays inside the rectangle */}
            <div className="w-full lg:w-9/12 lg:-mr-16 z-10 flex items-center">
              <div className="w-full bg-[#f5f7fa] shadow-xl px-6 portrait:sm:px-10 lg:pl-14 lg:pr-28 py-10 lg:py-14">
                <div className="w-16 h-[3px] bg-[#141824] mb-5"></div>
                <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                  {t("Vos besoins", "Operational needs")}
                </h2>

                {/* Mobile Image */}
                <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] h-[260px] portrait:sm:h-[300px] my-6 shadow-md overflow-hidden">
                  <img
                    src="/img/besoins-meeting.webp"
                    alt="Vos besoins"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                  />
                </div>

                <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-10">
                  {formatBrand(t(
                    "Un appui opérationnel adapté aux équipes financières, comptables, patrimoniales, IT, data et réglementées, pour traiter les opérations qui exigent rigueur, continuité et fiabilité.",
                    "Structured operational support for finance, accounting, wealth management, IT and data teams, as well as teams operating in regulated environments, where activities require rigour, continuity and reliable execution."
                  ))}
                </p>

                {/* 3 need items */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 mb-10 border-t border-[#e8e1d7] pt-8">
                  {[
                    { title: t("Finance et Reporting", "Finance and reporting"), desc: t("Production, structuration et fiabilisation de reportings financiers...", "Production, structuring and reliability of financial reports..."), href: "/vos-besoins#finance-reporting" },
                    { title: t("Risques et Conformité", "Risk and compliance"), desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement...", "Operational support for risk and compliance teams in processing..."), href: "/vos-besoins#risques-conformite" },
                    { title: t("Support Comptable et Data", "Accounting and data support"), desc: t("Appui opérationnel aux équipes comptables, administratives et data...", "Operational support for accounting, administrative and data teams..."), href: "/vos-besoins#support-comptable-data" },
                  ].map((item, i, arr) => (
                    <Link key={item.href} href={item.href} className={`flex flex-col gap-2 group flex-1 pr-6 ${i < arr.length - 1 ? "md:border-r border-[#e8e1d7] md:mr-6" : ""}`}>
                      <h3 className="text-[#141824] font-semibold text-[1rem] group-hover:text-[#6e7891] transition-colors">{item.title}</h3>
                      <p className="text-[#6e7891] text-[0.85rem] font-light leading-snug flex-grow">{item.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[#141824] text-[0.75rem] font-bold uppercase tracking-wider mt-2 group-hover:gap-2 transition-all">
                        {t("Découvrir", "Discover")} <ArrowRight size={14} />
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Link href="/vos-besoins" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right sm:text-left">
                    <span className="max-w-[16ch] sm:max-w-none">{t("Voir tous vos besoins", "Explore your needs")}</span>
                    <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                    <ChevronRight size={18} className="-ml-2" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5 : NOS SOLUTIONS (Beige) ── */}
      <section className="relative w-full bg-[#e8e1d7] pt-16 lg:pt-20 pb-16 lg:pb-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">

          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-5"></div>
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Nos solutions", "Our engagement models")}
            </h2>
            <p className="text-[#141824] text-[1.1rem] font-light leading-relaxed mb-8">
              {t(
                "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes d'urgence, de durée, de volume et d'organisation.",
                "We design tailored operational outsourcing arrangements around your requirements for speed, duration, volume and delivery model."
              )}
            </p>
          </div>

          {/* Right Column: 4 constraints in a 2x2 grid */}
          <div className="w-full md:w-7/12 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Urgence", "Urgent requirements")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">{t("Réactivité", "Responsiveness")}</p>
              </div>
              <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Durée", "Duration")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">{t("Flexibilité", "Flexibility")}</p>
              </div>
              <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Volume", "Volume")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">{t("Agilité", "Scalability")}</p>
              </div>
              <div className="border-l-2 border-[#141824]/30 pl-6">
                <h3 className="text-[#141824] font-semibold text-[1.3rem] mb-2">{t("Format", "Delivery model")}</h3>
                <p className="text-[#141824]/70 font-light text-[1.05rem]">{t("Sur mesure", "Tailored")}</p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Link href="/nos-solutions" className="inline-flex items-center gap-2 text-[#141824] uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right sm:text-left">
                <span className="max-w-[16ch] sm:max-w-none">{t("Découvrir nos solutions", "Explore our solutions")}</span>
                <span className="w-8 h-[1px] bg-[#141824] group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={18} className="-ml-2" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── ESPACE BLANC UNIVERSEL ── */}
      <div className="w-full h-16 lg:h-20 bg-white"></div>

      {/* ── SECTION 6 : ACTUALITÉS (3 article cards) ── */}
      <section className="relative w-full bg-[#141824] pt-16 lg:pt-20 pb-16 lg:pb-20">
        <div className="laplace-container portrait:sm:px-10">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-block text-left max-w-2xl">
              <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5"></div>
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-white font-bold mb-4 uppercase tracking-wider">
                {t("Actualités et Veille", "Insights")}
              </h2>
              <p className="text-[1.1rem] text-[#e5e9f0] font-light leading-relaxed">
                {t(
                  "Retrouvez nos analyses, publications et contenus consacrés aux enjeux opérationnels, financiers, comptables, patrimoniaux, data et réglementaires.",
                  "Explore our analysis, publications and insights on operational, financial, accounting, wealth-management, data and regulatory matters."
                )}
              </p>
            </div>
          </div>

          {publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {publications.map((pub) => (
                <Link key={pub.id} href={`/actualites/${generateSlug(displayTitle(pub), pub.id)}`} className="group flex flex-col bg-white/5 border border-[#e8e1d7]/20 hover:bg-white/10 transition-all duration-300">
                  <div className="h-[180px] overflow-hidden bg-[#1a1f2e] flex items-center justify-center relative">
                    {pub.coverImageUrl ? (
                      <>
                        <img
                          src={pub.coverImageUrl}
                          alt={displayTitle(pub)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0 z-10 bg-[#1a1f2e]"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="text-[#e8e1d7]/20 font-bold tracking-widest uppercase text-lg z-0">MENUA CONSULTING</span>
                      </>
                    ) : (
                      <span className="text-[#e8e1d7]/20 font-bold tracking-widest uppercase text-lg">MENUA CONSULTING</span>
                    )}
                    {pub.category && (
                      <div className="absolute top-4 left-4 bg-[#e8e1d7] text-[#141824] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider">
                        {displayCategory(pub)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <p className="text-white/50 text-[0.7rem] font-medium tracking-wide mb-2 uppercase">
                      {formatDate(pub.publishedAt || pub.createdAt)}
                    </p>
                    <h3 className="text-white font-semibold text-[1.1rem] leading-snug mb-3 line-clamp-2">{displayTitle(pub)}</h3>
                    <p className="text-white/70 text-[0.85rem] font-light leading-relaxed flex-grow mb-4 line-clamp-3">
                      {(() => {
                        const plain = (displayContent(pub) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                        const words = plain.split(' ').filter(Boolean);
                        return words.length > 25 ? words.slice(0, 25).join(' ') + '...' : plain;
                      })()}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[#e8e1d7] font-bold uppercase tracking-wider text-[0.75rem] group-hover:gap-3 transition-all">
                      {t("Lire l'article", "Read article")} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center mb-12">
              <Link href="/actualites" className="group flex flex-col bg-white/5 border border-[#e8e1d7]/20 hover:bg-white/10 transition-all duration-300 w-full max-w-sm">
                <div className="h-[180px] overflow-hidden bg-[#1a1f2e] flex items-center justify-center">
                  <span className="text-[#e8e1d7]/20 font-bold tracking-widest uppercase text-lg">MENUA CONSULTING</span>
                </div>
                <div className="flex flex-col flex-grow p-6 border-t border-[#e8e1d7]/20">
                  <p className="text-white/70 text-[0.85rem] font-light leading-relaxed flex-grow mb-6">
                    {formatBrand(t(
                      "Cette rubrique accueillera prochainement les analyses et publications de MENUA CONSULTING consacrées aux évolutions opérationnelles, aux méthodes de travail, à la fiabilisation des processus et à la continuité d'activité.",
                      "This section will soon host MENUA CONSULTING's analyses and publications dedicated to operational developments, working methods, process reliability and business continuity."
                    ))}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#e8e1d7] font-bold uppercase tracking-wider text-[0.75rem] group-hover:gap-3 transition-all">
                    {t("Découvrir la rubrique", "Discover this section")} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {publications.length > 0 && (
            <div className="flex justify-end mt-4">
              <Link href="/actualites" className="inline-flex items-center gap-2 text-white uppercase tracking-wider text-[1.05rem] hover:text-[#6e7891] transition-colors group text-right sm:text-left">
                <span className="max-w-[16ch] sm:max-w-none">{t("Voir toutes nos actualités", "Browse all publications")}</span>
                <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
                <ChevronRight size={18} className="-ml-2" />
              </Link>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
