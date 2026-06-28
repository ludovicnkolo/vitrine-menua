"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PieChart, Users, ShieldCheck, FileSpreadsheet, Briefcase, BarChart3, Lock, Globe, Settings, Search, Zap, Calendar, Scale, Shield, Award } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden">

      {/* ── HERO — pleine largeur, photo + overlay marine ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Finance opérationnelle"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680] from-20% via-[#1B3680]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#B8922A]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#B8922A]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#B8922A]" />
            
            <div className="relative">
              <p className="text-[#B8922A] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Cabinet de conseil — France", "Advisory firm — France")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "Externalisation opérationnelle\ndes fonctions back\n& middle office",
                  "Operational outsourcing\nof back & middle office functions"
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal">
                {t(
                  "Nous sécurisons l'exécution de vos opérations pour que vos équipes se concentrent sur les décisions stratégiques.",
                  "We secure your operations execution so your teams focus on strategic decisions."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS — parallelogrammes style référence ── */}
      <div className="bg-white py-6 px-8">
      <section className="bg-[#0E1F5B] py-6 px-8 max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-center items-stretch">
          {[
            { value: "10+", label: t("Années en environnements réglementés", "Years in regulated environments"), accent: "#1C40C2" },
            { value: "50+", label: t("Missions accomplies avec succès", "Successfully completed missions"), accent: "#1C7CC2" },
            { value: "100%", label: t("Supervision par professionnels habilités", "Supervised by qualified professionals"), accent: "#5B4FC2" },
            { value: "FR / EN", label: t("Interventions bilingues", "Bilingual interventions"), accent: "#B8922A" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-1 relative bg-[#162466] border border-white/10 px-8 py-3 flex flex-col items-center text-center"
              style={{ clipPath: "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)" }}
            >
              <span className="text-white text-[2rem] font-bold leading-tight tracking-tight mb-1">
                {stat.value}
              </span>
              <span className="text-white/70 text-[0.78rem] leading-snug max-w-[130px]">
                {stat.label}
              </span>
              {/* colored bottom accent */}
              <div
                className="absolute bottom-0 left-[6%] right-[6%] h-[3px]"
                style={{ backgroundColor: stat.accent }}
              />
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* ── POSITIONNEMENT — Overlap Layout Exact ── */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative flex flex-col md:flex-row items-center">
          
          {/* COLONNE GAUCHE — Panneau beige en superposition */}
          <div 
            className="w-full md:w-[52%] bg-[#F5F0EA] p-10 md:p-14 lg:p-16 z-10 relative shadow-lg"
            style={{ borderRadius: "2rem 8rem 8rem 2rem" }}
          >
            <p className="text-[#B8922A] text-[0.72rem] font-bold tracking-[0.2em] uppercase mb-3">
              {t("Notre positionnement", "Our positioning")}
            </p>
            <div className="w-8 h-[2px] bg-[#B8922A] mb-7" />
            <h2 className="text-[#1A1A1A] text-[1.85rem] leading-[1.2] font-bold mb-6">
              {t("Au service des ", "Serving ")}<span className="text-[#B8922A]">{t("acteurs\nfinanciers", "financial\nplayers").split('\n').map((l,i)=><span key={i} className="block">{l}</span>)}</span>
              {" "}{t("et", "and")}{" "}<span className="text-[#B8922A]">{t("réglementés", "regulated")}</span>{" "}
              <span className="block">{t("en France", "in France")}</span>
            </h2>
            <p className="text-[#3A3A3A] text-[0.9rem] leading-[1.7] mb-8 font-normal">
              <strong className="text-[#B8922A]">MENUA CONSULTING</strong>{" "}
              {t(
                "est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back office et middle office pour des acteurs financiers et réglementés : banques, cabinets de gestion de patrimoine, sociétés financières, experts-comptables.",
                "is a firm specialising in operational outsourcing of back office and middle office functions for financial and regulated players: banks, wealth management firms, financial companies, chartered accountants."
              )}
            </p>
            <Link
              href="/nous-connaitre"
              className="inline-flex items-center gap-3 border border-[#B8922A] text-[#B8922A] hover:bg-[#B8922A] hover:text-white px-6 py-2.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase transition-all duration-200 w-fit"
            >
              {t("Découvrir le cabinet", "Discover the firm")} <ArrowRight size={12} />
            </Link>
          </div>

          {/* COLONNE DROITE — Image en arrière-plan partiel */}
          <div className="w-full md:w-[58%] h-[400px] md:h-[600px] relative z-0 md:-ml-[10%] mt-8 md:mt-0">
            <img
              src="/notre_position.png"
              alt="Notre positionnement"
              className="w-full h-full object-cover object-center rounded-[2rem] shadow-md"
            />
            {/* Badge circulaire bas-droite */}
            <Link
              href="/nous-connaitre"
              className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 w-24 h-24 rounded-full bg-[#9c8e80] border border-white/20 flex flex-col items-center justify-center text-center hover:bg-[#B8922A] transition-all duration-300 shadow-xl group z-20"
            >
              <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center mb-1">
                <ArrowRight size={12} className="text-white" />
              </div>
              <span className="text-white text-[0.55rem] font-bold tracking-wider uppercase leading-tight text-center">
                <span className="block">Découvrir</span>
                <span className="block">le cabinet</span>
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── VOS BESOINS — layout asymétrique avec image courbée ── */}
      <section className="bg-[#F8F9FA] relative py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto w-full relative flex flex-col md:flex-row items-stretch">
          
          {/* COLONNE GAUCHE - TEXTE ET GRILLE */}
          <div className="w-full md:w-[60%] pl-8 pr-8 lg:pl-20 lg:pr-16 z-10 flex flex-col justify-center">
            
            <div className="flex items-center gap-4 mb-4">
              <p className="text-[#B8922A] text-[0.75rem] font-bold tracking-[0.15em] uppercase">
                {t("Domaines d'intervention", "Areas of intervention")}
              </p>
              <div className="h-[1.5px] bg-[#B8922A] w-12" />
            </div>
            
            <h2 className="text-[#1B3680] text-[1.8rem] leading-[1.2] font-bold uppercase mb-12 tracking-wide">
              {t("Vos besoins", "Your needs")}
            </h2>

            {/* GRILLE 3x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: PieChart, title: t("Finance & reporting", "Finance & reporting"), href: "/vos-besoins#finance-reporting" },
                { icon: BarChart3, title: t("Contrôle de gestion", "Management control"), href: "/vos-besoins#controle-gestion" },
                { icon: ShieldCheck, title: t("Risques & conformité", "Risk & compliance"), href: "/vos-besoins#risques-conformite" },
                { icon: FileSpreadsheet, title: t("Support comptable & data", "Accounting & data support"), href: "/vos-besoins#support-comptable" },
                { icon: Users, title: t("Gestion de patrimoine & CGP", "Wealth management & CGP"), href: "/vos-besoins#gestion-patrimoine" },
                { icon: Briefcase, title: t("Autres besoins opérationnels", "Other operational needs"), href: "/vos-besoins#autres-besoins" },
              ].map((item, i) => {
                // Determine border classes based on position to match image
                const isTopRow = i < 3;
                const isLeftCol = i % 3 === 0;
                const isMidCol = i % 3 === 1;
                const isRightCol = i % 3 === 2;
                
                return (
                  <Link 
                    href={item.href} 
                    key={i} 
                    className={`group flex flex-col p-6 lg:p-8 transition-colors hover:bg-white
                      ${isTopRow ? 'border-b border-t border-[#D8DCE8]' : 'border-b border-[#D8DCE8]'}
                      ${!isRightCol ? 'border-r border-[#D8DCE8]' : ''}
                    `}
                  >
                    <div className="text-[#1B3680] mb-8">
                      <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#1B3680] text-[0.95rem] font-bold leading-snug mb-8 flex-grow">
                      {item.title}
                    </h3>
                    <div className="mt-auto flex items-center text-[#1B3680] text-[0.8rem] font-medium gap-2 group-hover:gap-3 transition-all">
                      {t("En savoir plus", "Learn more")} <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLONNE DROITE - IMAGE COURBÉE */}
          <div className="hidden md:block absolute right-0 top-0 w-[43%] h-full z-0 overflow-visible">
            <div 
              className="absolute inset-0 overflow-hidden shadow-2xl" 
              style={{ borderTopLeftRadius: '45% 100%', borderBottomLeftRadius: '45% 100%' }}
            >
              <img 
                src="/besoin.png" 
                alt="Vos besoins" 
                className="w-full h-full object-cover object-center" 
              />
              {/* Ligne dorée qui suit la courbe */}
              <div 
                className="absolute inset-0 border-l-[1.5px] border-[#B8922A] pointer-events-none" 
                style={{ borderRadius: 'inherit' }} 
              />
            </div>
            
            {/* Points dorés (dots) sur la courbe */}
            <div className="absolute left-[3px] top-[32%] w-2 h-2 bg-[#B8922A] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm" />
            <div className="absolute left-[-1px] top-[55%] w-2 h-2 bg-[#B8922A] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm" />
          </div>

        </div>
      </section>

      {/* ── POURQUOI MENUA — fond bleu institutionnel ── */}
      <section className="bg-[#1B3680] px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Colonne gauche : Introduction */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-[#B8922A] text-[0.75rem] font-bold tracking-[0.15em] uppercase">
                  {t("Notre valeur ajoutée", "Our value proposition")}
                </p>
                <div className="h-[1.5px] bg-[#B8922A] w-12" />
              </div>
              <h2 className="text-white mb-6 text-[1.8rem] leading-[1.2] font-bold uppercase tracking-wide">
                {t("Pourquoi Menua Consulting ?", "Why Menua Consulting?")}
              </h2>
              <p className="text-white/80 text-[0.95rem] leading-[1.6] mb-8 font-normal max-w-lg">
                {t(
                  "Nous exécutons là où les autres s'arrêtent à l'analyse. Notre approche opérationnelle, nos profils spécialisés et notre méthodologie éprouvée font la différence dans vos environnements réglementés.",
                  "We execute where others stop at analysis. Our operational approach, specialised profiles, and proven methodology make the difference in your regulated environments."
                )}
              </p>
              <Link
                href="/pourquoi-menua"
                className="inline-flex items-center gap-3 border border-[#B8922A] text-[#B8922A] hover:bg-[#B8922A] hover:text-white px-7 py-3 text-[0.75rem] font-bold tracking-[0.15em] uppercase transition-all duration-200"
              >
                {t("Nos différenciants", "Our differentiators")} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Colonne droite : Différenciants */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Settings, title: t("Approche 100% opérationnelle", "100% operational approach"), desc: t("Nous exécutons, nous ne nous arrêtons pas à l'analyse.", "We execute, not just analyse.") },
                { icon: Users, title: t("Ressources spécialisées & flexibles", "Specialised & flexible resources"), desc: t("Profils adaptés à vos besoins et contraintes réglementaires.", "Profiles adapted to your needs and regulatory constraints.") },
                { icon: Search, title: t("Contrôle qualité permanent", "Permanent quality control"), desc: t("Supervision continue et contrôle à quatre yeux.", "Continuous supervision and four-eyes control.") },
                { icon: Scale, title: t("Expertise sectorielle certifiée", "Certified sector expertise"), desc: t("Maîtrise des environnements AMF, ACPR et réglementations financières.", "Expertise in AMF, ACPR and financial regulations.") },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white/5 backdrop-blur-sm p-5 border-l-2 border-[#B8922A] hover:bg-white/10 transition-colors">
                  <div className="text-[#B8922A] shrink-0 mt-1">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-white mb-1.5 text-[1.1rem] font-bold tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-[0.85rem] leading-[1.5] font-normal">
                      {item.desc}
                    </p>
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
              className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem]"
              
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
                    className="key-number text-[#D8DCE8] group-hover:text-[#2447A0] transition-colors"
                    
                  >
                    {sol.num}
                  </span>
                  <div className="text-[#1C40C2] group-hover:text-[#DAF0F7] transition-colors">
                    <sol.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[#1B3680] group-hover:text-white transition-colors text-[1.3rem] font-semibold"
                    
                  >
                    {sol.title}
                  </h3>
                  <p className="text-[#4A4E5A] group-hover:text-white/75 text-[0.95rem] leading-[1.5] font-normal transition-colors">
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
              className="text-white text-[1.3rem] leading-[1.6rem] font-bold uppercase"
              
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
                className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem]"
                
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
                    className="text-[#1B3680] text-[1.3rem] font-semibold leading-snug mb-6 flex-grow"
                    
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
            className="text-white mb-[2.25rem] text-[1.3rem] leading-[1.6rem] font-bold uppercase"
            
          >
            {t(
              "Un projet d'externalisation ? Parlons-en.",
              "An outsourcing project? Let's talk."
            )}
          </h2>
          <p className="text-white/60 text-[0.95rem] leading-[1.5] mb-10 max-w-xl mx-auto font-normal">
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
