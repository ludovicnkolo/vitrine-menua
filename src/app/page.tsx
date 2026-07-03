"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Calendar, FileCheck, ShieldCheck, Target, Users, Search, Award, BarChart2, PieChart, FileSpreadsheet, Building2, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";
import "./home.css";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      
      {/* ── HERO INTRO ── */}
      <section className="home-hero-section">
        <div className="absolute inset-0 z-0">
          <img
            src="/office-lounge.jpg"
            alt="Externalisation opérationnelle"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.currentTarget.src = "/banner-desk.jpg"; }}
          />
          <div className="home-hero-overlay" />
        </div>

        <div className="home-hero-content">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
            <h1 className="home-hero-title">
              {t("Externalisation\nopérationnelle", "Operational\noutsourcing").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h1>
            <h2 className="home-hero-subtitle">
              {t("des fonctions back &\nmiddle office", "of back &\nmiddle office functions").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            
            <div className="home-hero-desc">
              <p className="text-white">
                {t(
                  "Nous aidons les entreprises à optimiser leurs opérations back et middle office afin de leur permettre de se concentrer sur leurs décisions stratégiques.",
                  "We help companies optimize their back and middle office operations so they can focus on strategic decisions."
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/nous-contacter"
                className="home-hero-btn"
              >
                {t("Présenter un besoin", "Present a need")} <ArrowRight size={16} />
              </Link>

              <div className="flex items-center gap-3 text-white">
                <Globe className="shrink-0 text-white" size={24} strokeWidth={1.5} />
                <p className="text-white text-[0.75rem] font-medium leading-relaxed max-w-[250px]">
                  {t("Interventions en français et en anglais – profils opérationnels bilingues.", "Interventions in French and English – bilingual operational profiles.")}
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO TEXT ── */}
      <section className="w-full relative bg-[#FDFDFD]">
        <div className="relative w-full max-w-[1000px] mx-auto px-6 py-12 md:py-16 flex justify-center items-center">
          <p className="home-wave-text">
            MENUA CONSULTING {t(
              "intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office.",
              "supports financial, accounting, wealth, IT and regulated teams to secure and strengthen the execution of back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="home-chiffres-section">
        <div className="home-chiffres-container">
          
          {/* Diamond Grid Layout */}
          <div className="relative mx-auto" style={{ width: "100%", maxWidth: "440px", height: "440px", marginTop: "2rem", marginBottom: "2rem" }}>
            
            {/* Circle connector lines */}
            <div className="absolute rounded-full border border-[#122017]/30"
              style={{ width: "46%", height: "46%", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

            {/* Center label */}
            <div className="absolute z-10 text-center pointer-events-none"
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <span className="text-[#122017] text-[1rem] md:text-[1.15rem] font-light italic whitespace-nowrap">
                {t("Chiffres clés", "Key figures")}
              </span>
            </div>

            {/* TOP — 10+ */}
            <div className="absolute flex items-center justify-center"
              style={{ width: "34%", aspectRatio: "1/1", top: "0", left: "50%", transform: "translateX(-50%) rotate(45deg)", backgroundColor: "#122017", borderRadius: "1.2rem", boxShadow: "4px 4px 16px rgba(44,74,56,0.3)" }}>
              <div style={{ transform: "rotate(-45deg)", textAlign: "center", padding: "0.5rem" }}>
                <div className="text-white text-[1.8rem] md:text-[2.2rem] font-light leading-none">10+</div>
                <div className="text-white/70 text-[0.45rem] md:text-[0.55rem] font-bold uppercase tracking-widest mt-2 leading-tight">
                  {t("Années", "Years")}<br/>{t("d'expérience", "of experience")}
                </div>
              </div>
            </div>

            {/* LEFT — 50+ */}
            <div className="absolute flex items-center justify-center"
              style={{ width: "34%", aspectRatio: "1/1", top: "50%", left: "-12%", transform: "translateY(-50%) rotate(45deg)", backgroundColor: "#122017", borderRadius: "1.2rem", boxShadow: "4px 4px 16px rgba(44,74,56,0.3)" }}>
              <div style={{ transform: "rotate(-45deg)", textAlign: "center", padding: "0.5rem" }}>
                <div className="text-white text-[1.8rem] md:text-[2.2rem] font-light leading-none">50+</div>
                <div className="text-white/70 text-[0.45rem] md:text-[0.55rem] font-bold uppercase tracking-widest mt-2 leading-tight">
                  {t("Missions", "Missions")}<br/>{t("accomplies", "accomplished")}
                </div>
              </div>
            </div>

            {/* RIGHT — FR/EN */}
            <div className="absolute flex items-center justify-center"
              style={{ width: "34%", aspectRatio: "1/1", top: "50%", right: "-12%", transform: "translateY(-50%) rotate(45deg)", backgroundColor: "#122017", borderRadius: "1.2rem", boxShadow: "4px 4px 16px rgba(44,74,56,0.3)" }}>
              <div style={{ transform: "rotate(-45deg)", textAlign: "center", padding: "0.5rem" }}>
                <div className="text-white text-[1.1rem] md:text-[1.5rem] font-light leading-none">FR / EN</div>
                <div className="text-white/70 text-[0.45rem] md:text-[0.55rem] font-bold uppercase tracking-widest mt-2 leading-tight">
                  {t("Interventions", "Interventions")}<br/>{t("bilingues", "bilingual")}
                </div>
              </div>
            </div>

            {/* BOTTOM — 100% */}
            <div className="absolute flex items-center justify-center"
              style={{ width: "34%", aspectRatio: "1/1", bottom: "0", left: "50%", transform: "translateX(-50%) rotate(45deg)", backgroundColor: "#122017", borderRadius: "1.2rem", boxShadow: "4px 4px 16px rgba(44,74,56,0.3)" }}>
              <div style={{ transform: "rotate(-45deg)", textAlign: "center", padding: "0.5rem" }}>
                <div className="text-white text-[1.8rem] md:text-[2.2rem] font-light leading-none">100%</div>
                <div className="text-white/70 text-[0.45rem] md:text-[0.55rem] font-bold uppercase tracking-widest mt-2 leading-tight">
                  {t("Supervision", "Supervision")}<br/>{t("par des professionnels", "by professionals")}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── DOMAINES D'INTERVENTION ── */}
      <section className="home-domaines-section" id="domaines">
        <div className="home-domaines-container">
          
          {/* Left Text Block */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h2 className="home-domaines-title-sm">
              {t("Domaines d'intervention", "Areas of intervention")}
            </h2>
            <h3 className="home-domaines-title-lg uppercase">
              {t("VOS BESOINS", "YOUR NEEDS")}
            </h3>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-12" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {[
                { title: t("Finance & Reporting", "Finance & Reporting"), desc: t("Production, structuration et fiabilisation de reportings financiers.", "Production, structuring and reliability of financial reporting.") },
                { title: t("Contrôle de gestion", "Management control"), desc: t("Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance.", "Operational support for budget monitoring, variance analysis and performance management.") },
                { title: t("Risques & Conformité", "Risk & Compliance"), desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement des dossiers sensibles.", "Operational support to risk and compliance teams in the processing of sensitive files.") },
                { title: t("Support comptable & data", "Accounting & data support"), desc: t("Appui opérationnel aux équipes comptables, administratives et data.", "Operational support to accounting, administrative and data teams.") },
                { title: t("Gestion de Patrimoine & CGP", "Wealth management & IFA"), desc: t("Appui opérationnel aux cabinets de gestion de patrimoine et structures patrimoniales.", "Operational support to wealth management firms and wealth structures.") },
                { title: t("Autres besoins opérationnels", "Other operational needs"), desc: t("Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.", "Handling of occasional, transversal or specific operational needs.") },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'sm:border-l-[2px] sm:border-[#D9B151]/40 sm:pl-6' : 'sm:pr-4'}`}>
                  <h3 className="font-semibold text-xs whitespace-pre-line leading-snug text-[#111F18] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#646A66] text-[0.95rem] lg:text-[1rem] font-medium leading-[1.6]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Block */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="w-full max-w-[450px] h-[350px] rounded-[2rem] overflow-hidden shadow-xl">
              <img src="/trust-circle.jpg" alt="Vos besoins" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/besoin.png"; }} />
            </div>
          </div>
          
        </div>
      </section>

      {/* ── POURQUOI MENUA CONSULTING ── */}
      <section className="home-pourquoi-section">
        {/* Effet Bois Huilé (Oiled Wood Background) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 30% at 45% 45%, rgba(255,210,140,0.18) 0%, transparent 100%),
              linear-gradient(160deg, #8B6240 0%, #5A3A1E 50%, #3E2510 100%)
            `,
          }}
        />

        <div className="home-pourquoi-container">
          <div className="flex flex-col items-center mb-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-center">
              {t("Pourquoi Menua Consulting ?", "Why Menua Consulting?")}
            </h2>
            <div className="w-10 h-[2px] bg-white" />
          </div>

          {/* Staircase cards */}
          <div className="w-full flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-0 lg:justify-center">
            {[
              { num: "01", title: t("Approche 100%\nopérationnelle", "100% operational\napproach"), desc: t("Nous exécutons, nous restons impliqués, nous livrons.", "We execute, we stay involved, we deliver.") },
              { num: "02", title: t("Ressources\nspécialisées\n& flexibles", "Specialized\n& flexible\nresources"), desc: t("Profils adaptés à vos besoins et contraintes réglementaires.", "Profiles adapted to your needs and regulatory constraints.") },
              { num: "03", title: t("Contrôle qualité\npermanent", "Permanent\nquality control"), desc: t("Supervision continue et contrôlée à chaque étape.", "Continuous supervision and controlled at each step.") },
              { num: "04", title: t("Expertise sectorielle\ncertifiée", "Certified sector\nexpertise"), desc: t("Maîtrise des environnements AMF, ACPR et réglementations internationales.", "Mastery of AMF, ACPR environments and international regulations.") },
            ].map((item, i) => (
              <div
                key={i}
                className="home-pourquoi-card"
                style={{
                  backgroundColor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                  marginTop: i === 0 ? "0" : undefined,
                  transform: `translateY(${i * 40}px)`,
                  zIndex: 10 - i,
                  marginLeft: i !== 0 ? "-1.5rem" : undefined,
                }}
              >
                <div className="text-[#D9B151] text-[2.5rem] font-light leading-none mb-3 opacity-80">{item.num}</div>
                <div className="w-8 h-[2px] bg-[#D9B151] mb-4 opacity-70" />
                <h3 className="font-semibold text-xs leading-snug text-white mb-4">
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
                <p className="text-white/70 text-[0.75rem] font-normal leading-[1.7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Bottom spacing for staircase offset */}
          <div className="h-[120px] lg:h-[160px]" />
        </div>
      </section>

      {/* ── NOS SOLUTIONS ── */}
      <section className="home-solutions-section">
        <div className="home-solutions-container">

          {/* Left: cream block with title + 2x2 cards */}
          <div className="home-solutions-cream-block">
            {/* Title */}
            <div className="flex flex-col items-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#272A2C] mb-3">
                {t("Nos solutions", "Our solutions")}
              </h2>
              <div className="w-10 h-[2px] bg-[#D9B151]" />
            </div>

            {/* 2x2 card grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { num: "01", title: t("URGENCE", "EMERGENCY"), desc: t("Mobilisation rapide de ressources spécialisées pour répondre à un besoin urgent et assurer le soutien adapté et structuré la continuité de votre service.", "Rapid mobilization of specialized resources to respond to an urgent need and ensure adapted, structured support and continuity of your service.") },
                { num: "02", title: t("DURÉE", "DURATION"), desc: t("Menua Consulting propose des missions adaptées à la fois en durée et en intensité selon nécessaire à vos projets.", "Menua Consulting offers missions adapted in both duration and intensity as necessary to your projects.") },
                { num: "03", title: t("VOLUME", "VOLUME"), desc: t("Gestion optimisée de vos volumes d'opérations avec une capacité d'adaptation rapide et efficace.", "Optimized management of your operational volumes with rapid and efficient adaptation capacity.") },
                { num: "04", title: t("ORGANISATION", "ORGANIZATION"), desc: t("Intégration fluide dans vos processus existants pour renforcer votre structure sans impacter en performance.", "Fluid integration into your existing processes to strengthen your structure without impacting performance.") },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white rounded-2xl p-5"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderBottom: "3px solid #D9B151" }}
                >
                  <span className="text-[#D9B151]/30 text-[2.5rem] font-light leading-none mb-3 select-none">{item.num}</span>
                  <h3 className="font-semibold text-xs leading-snug text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-[#6B6B6B] text-[0.72rem] font-normal leading-[1.7]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image — above cream block in Z */}
          <div className="home-solutions-img-wrapper">
            <div className="w-full h-[360px] lg:h-[420px] rounded-2xl lg:rounded-l-none overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <img
                src="/meeting.jpg"
                alt="Nos solutions"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── SUPERVISION & CERTIFICATIONS ── */}
      <section className="home-supervision-section">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-center">
              {t("Supervision & certifications", "Supervision & certifications")}
            </h2>
            <div className="w-10 h-[2px] bg-white" />
          </div>
          
          <div className="home-supervision-grid">
             <div className="home-supervision-item md:border-r border-white/20">
               <span className="text-white text-[0.85rem] font-bold tracking-widest uppercase mb-4">AMF</span>
               <span className="text-white text-[0.75rem] font-medium leading-[1.6]">Certification AMF<br/>en tant qu'apporteur</span>
             </div>
             <div className="home-supervision-item md:border-r border-white/20">
               <span className="text-white text-[0.85rem] font-bold tracking-widest uppercase mb-4">Contrôle Interne</span>
               <span className="text-white text-[0.75rem] font-medium leading-[1.6]">Certification en Contrôle Interne<br/>et Gestion des Risques</span>
             </div>
             <div className="home-supervision-item">
               <span className="text-white text-[0.85rem] font-bold tracking-widest uppercase mb-4">Risques & Conformité</span>
               <span className="text-white text-[0.75rem] font-medium leading-[1.6]">Environnements réglementés maîtrisés</span>
             </div>
          </div>

          <p className="text-white text-[0.75rem] font-medium text-center max-w-4xl leading-[1.8]">
            {t(
              "MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients. Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
              "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks. This ensures compliance, quality of operations and process security."
            )}
          </p>
        </div>
      </section>

      {/* ── ACTUALITÉS ── */}
      <section className="home-news-section">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center">
            {t("Actualités", "News")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
            {[
              {
                img: "/news-1.jpg",
                tag: "ACTUALITÉ",
                date: t("12 MAI 2024", "12 MAY 2024"),
                title: t("Digitalisation des processus back office : enjeux et bonnes pratiques", "Digitalization of back office processes: challenges and best practices"),
                desc: t("Automatisation, fiabilisation des données, réduction des délais : les leviers clés pour transformer durablement vos opérations.", "Automation, data reliability, reduced delays: the key levers to sustainably transform your operations."),
              },
              {
                img: "/news-2.jpg",
                tag: "RÉGLEMENTATION",
                date: t("06 MAI 2024", "06 MAY 2024"),
                title: t("Conformité réglementaire : les évolutions dès à anticiper en 2025", "Regulatory compliance: key developments to anticipate in 2025"),
                desc: t("Tour d'horizon des nouvelles exigences et bonnes pratiques à intégrer dès maintenant dans vos processus.", "An overview of new requirements and best practices to integrate now into your processes."),
              },
              {
                img: "/news-3.jpg",
                tag: "REPORTING",
                date: t("28 MAI 2024", "28 MAY 2024"),
                title: t("Reporting financier : améliorer la qualité des données opérationnelles", "Financial reporting: improving the quality of operational data"),
                desc: t("Méthodes, outils et indicateurs pour produire un reporting fiable, pertinent et décisionnel.", "Methods, tools and indicators to produce reliable, relevant and decision-oriented reporting."),
              },
            ].map((news, i) => (
              <div key={i} className="home-news-card group">
                {/* Image */}
                <div className="home-news-img-wrapper">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute -bottom-0 left-6">
                    <div className="bg-[#C16150] text-white px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-widest shadow-md">
                      {news.tag}
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-8 pt-6 flex flex-col flex-1">
                  <div className="text-[#918279] text-[0.65rem] font-bold mb-4 uppercase tracking-widest">{news.date}</div>
                  <h3 className="text-[#272A2C] text-[1rem] font-bold leading-[1.4] mb-4 group-hover:text-[#D9B151] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-[#272A2C]/70 text-[0.8rem] leading-relaxed font-medium mb-6 flex-1">
                    {news.desc}
                  </p>
                  <Link href="/actualites" className="flex items-center gap-2 text-[#C16150] text-[0.7rem] font-bold uppercase tracking-widest transition-all mt-auto w-fit">
                    {t("Lire la suite", "Read more")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/actualites" className="inline-flex items-center justify-center gap-2 bg-transparent text-[#272A2C] border border-[#272A2C]/20 px-8 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] hover:bg-[#F6F3F0] transition-colors w-full sm:w-auto">
            {t("Voir toutes les actualités", "View all news")} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
