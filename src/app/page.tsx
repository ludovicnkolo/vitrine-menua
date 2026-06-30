"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Calendar, FileCheck, ShieldCheck, Target, Users, Search, Award, BarChart2, PieChart, FileSpreadsheet, Building2, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_home.png"
            alt="Externalisation opérationnelle"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#223930] from-20% via-[#223930]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <h1 className="text-white mb-2 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Externalisation\nopérationnelle", "Operational\noutsourcing").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <h2 className="text-[#E0D6C8] text-[1.8rem] md:text-[2.2rem] lg:text-[2.6rem] italic leading-[1.1] font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("des fonctions back &\nmiddle office", "of back &\nmiddle office functions").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4 mb-10">
                <p>
                  {t(
                    "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques.",
                    "We secure the execution of your back and middle office operations so your teams can focus on strategic decisions."
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/nous-contacter"
                  className="inline-flex items-center gap-3 bg-[#E0D6C8] text-[#223930] hover:bg-transparent hover:text-[#E0D6C8] border border-[#E0D6C8] px-8 py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase transition-all w-fit"
                >
                  {t("Présenter un besoin", "Present a need")} <ArrowRight size={16} />
                </Link>

                <div className="flex items-start gap-3">
                  <Globe className="text-[#E0D6C8] shrink-0 mt-0.5" size={24} strokeWidth={1.5} />
                  <p className="text-white/90 text-[0.85rem] font-medium leading-relaxed max-w-[300px]">
                    {t("Interventions en français et en anglais – profils opérationnels bilingues.", "Interventions in French and English – bilingual operational profiles.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRODUCTION TEXT ── */}
      <section className="w-full bg-[#F5F2EB] py-16 px-6 relative z-20 border-b border-[#E0D6C8]/40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#223930] text-[1.1rem] lg:text-[1.25rem] font-medium leading-snug">
            MENUA CONSULTING {t(
              "intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office.",
              "supports financial, accounting, wealth, data and regulated teams to secure and strengthen the execution of back and middle office functions."
            )}
          </p>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="w-full bg-[#FDFDFD] py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-16 text-center">
            {t("Chiffres clés", "Key figures")}
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-start w-full divide-y md:divide-y-0 md:divide-x divide-[#d5a864]/40">
            {[
              { icon: Calendar, val: "10+", label: t("Années\nd'expérience", "Years of\nexperience") },
              { icon: FileCheck, val: "50+", label: t("Missions\naccomplies", "Missions\naccomplished") },
              { icon: Users, val: "100%", label: t("Supervision\npar des professionnels", "Supervision\nby professionals") },
              { icon: Globe, val: "FR / EN", label: t("Interventions\nbilingues", "Bilingual\ninterventions") },
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center px-4 py-6 md:py-0">
                <stat.icon className="text-[#d5a864] mb-4" size={36} strokeWidth={1} />
                <span className="text-[#223930] text-[2.2rem] font-normal leading-none mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{stat.val}</span>
                <span className="text-[#223930] text-[0.8rem] font-medium italic leading-snug">
                  {stat.label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINES D'INTERVENTION ── */}
      <section className="w-full bg-[#FDFDFD] pb-16 lg:pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-2 text-center">
            {t("Domaines d'intervention", "Areas of intervention")}
          </h2>
          <p className="text-[#223930] text-[0.85rem] font-bold uppercase tracking-widest mb-12 text-center">
            {t("Vos besoins", "Your needs")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              { icon: BarChart2, title: t("Finance & reporting", "Finance & reporting"), desc: t("Production, structuration et fiabilisation de reportings financiers.", "Production, structuring and reliability of financial reporting.") },
              { icon: PieChart, title: t("Contrôle de gestion", "Management control"), desc: t("Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance.", "Operational support for budget monitoring, variance analysis and performance management.") },
              { icon: ShieldCheck, title: t("Risques & conformité", "Risk & compliance"), desc: t("Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles.", "Operational support for risk and compliance teams in the processing, control and reliability of sensitive files.") },
              { icon: FileSpreadsheet, title: t("Support comptable & data", "Accounting & data support"), desc: t("Appui opérationnel aux équipes comptables, administratives et data.", "Operational support for accounting, administrative and data teams.") },
              { icon: Building2, title: t("Gestion de patrimoine", "Wealth management"), desc: t("Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales.", "Operational support for wealth management firms, family offices and patrimonial structures.") },
              { icon: MoreHorizontal, title: t("Autres besoins opérationnels", "Other operational needs"), desc: t("Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques.", "Handling of one-off, transversal or specific operational needs.") },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E0D6C8]/60 p-8 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-4 mb-4">
                  <item.icon className="text-[#d5a864] shrink-0" size={36} strokeWidth={1.5} />
                  <div>
                    <h3 className="text-[#223930] text-[1rem] font-bold mb-2 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[#223930] text-[0.8rem] font-medium leading-[1.6]">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pl-[3.25rem]">
                  <Link href="/vos-besoins" className="inline-flex items-center gap-2 text-[#223930] text-[0.75rem] font-bold uppercase tracking-wide group">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={14} className="text-[#d5a864] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI MENUA CONSULTING ── */}
      <section className="w-full bg-[#FDFDFD] pb-16 lg:pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-12 text-center">
            {t("Pourquoi Menua Consulting ?", "Why Menua Consulting?")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 w-full">
            {[
              { icon: Target, title: t("Approche 100%\nopérationnelle", "100% operational\napproach"), desc: t("Nous exécutons, nous ne nous arrêtons pas à l'analyse.", "We execute, we don't stop at analysis.") },
              { icon: Users, title: t("Ressources\nspécialisées\n& flexibles", "Specialized\n& flexible\nresources"), desc: t("Profils adaptés à vos besoins et contraintes réglementaires.", "Profiles adapted to your needs and regulatory constraints.") },
              { icon: Award, title: t("Contrôle qualité\npermanent", "Permanent\nquality control"), desc: t("Supervision continue et contrôle à quatre yeux.", "Continuous supervision and four-eyes control.") },
              { icon: ShieldCheck, title: t("Expertise sectorielle\ncertifiée", "Certified sector\nexpertise"), desc: t("Maîtrise des environnements AMF, ACPR et réglementations financières.", "Mastery of AMF, ACPR environments and financial regulations.") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start px-2">
                <div className="w-16 h-16 rounded-full border border-[#E0D6C8] flex items-center justify-center mb-6">
                  <item.icon className="text-[#223930]" size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#223930] text-[1rem] font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
                <p className="text-[#223930]/80 text-[0.8rem] font-medium leading-[1.6]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS SOLUTIONS ── */}
      <section className="w-full bg-[#FDFDFD] border-y border-[#E0D6C8]/40 py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-12 text-center">
            {t("Nos solutions", "Our solutions")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full divide-y sm:divide-y-0 sm:divide-x divide-[#E0D6C8]/60">
            {[
              { num: "01", title: t("URGENCE", "EMERGENCY"), desc: t("Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.", "Rapid mobilization of operational resources to meet an immediate need, absorb an overload and ensure the continuity of your service.") },
              { num: "02", title: t("DURÉE", "DURATION"), desc: t("MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.", "MENUA CONSULTING offers flexible outsourcing solutions, adapted to a defined number of files as well as the recurring management of a larger portfolio.") },
              { num: "03", title: t("VOLUME", "VOLUME"), desc: t("MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.", "MENUA CONSULTING adapts its resources to the volume of files, flows or operations, while ensuring continuity and security of execution.") },
              { num: "04", title: t("ORGANISATION", "ORGANIZATION"), desc: t("MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.", "MENUA CONSULTING structures its interventions according to the most suitable format: dedicated setup, mission-based operation or defined flows and processes.") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col pt-6 sm:pt-0 sm:pl-6 lg:pl-10">
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-[#d5a864] text-[2.5rem] font-normal leading-none" style={{ fontFamily: "var(--font-playfair)" }}>{item.num}</span>
                  <h3 className="text-[#223930] text-[1rem] font-bold uppercase tracking-widest mb-1">{item.title}</h3>
                </div>
                <p className="text-[#223930] text-[0.8rem] font-medium leading-[1.6]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPERVISION & CERTIFICATIONS ── */}
      <section className="w-full bg-[#FDFDFD] py-16 lg:py-20 border-b border-[#E0D6C8]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-12 text-center">
            {t("Supervision & certifications", "Supervision & certifications")}
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 mb-10">
             <div className="flex flex-col items-center gap-2">
               <span className="text-[#223930] text-[1.5rem] font-bold tracking-widest uppercase">AMF</span>
               <span className="text-[#223930] text-[0.7rem] font-medium tracking-wider text-center">Certification AMF de la dirigeante</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={28} className="text-[#223930]" strokeWidth={1.5} />
                 <span className="text-[#223930] text-[0.8rem] font-bold uppercase tracking-widest">Contrôle Interne</span>
               </div>
               <span className="text-[#223930] text-[0.7rem] font-medium tracking-wider text-center">Certification en Contrôle Interne et Gestion des Risques</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={28} className="text-[#223930]" strokeWidth={1.5} />
                 <span className="text-[#223930] text-[0.8rem] font-bold uppercase tracking-widest">Risques & Conformité</span>
               </div>
               <span className="text-[#223930] text-[0.7rem] font-medium tracking-wider text-center">Environnements réglementés maîtrisés</span>
             </div>
          </div>

          <p className="text-[#223930] text-[0.85rem] font-medium text-center max-w-2xl leading-relaxed">
            {t(
              "MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients. Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
              "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks. This ensures compliance, quality of operations and process security."
            )}
          </p>
        </div>
      </section>

      {/* ── ACTUALITÉS ── */}
      <section className="w-full bg-[#FDFDFD] py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest mb-12 text-center">
            {t("Actualités", "News")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10">
            {[
              {
                img: "/actualites_hero.png",
                tag: "BACK OFFICE",
                date: t("28 MAI 2025", "28 MAY 2025"),
                title: t("Digitalisation des processus back office : enjeux et bonnes pratiques", "Digitalization of back office processes: challenges and best practices"),
                desc: t("Automatisation, fiabilisation des données, réduction des délais : les leviers clés pour transformer durablement vos opérations.", "Automation, data reliability, reduced delays: the key levers to sustainably transform your operations."),
                featured: true,
              },
              {
                img: "/actualites_hero.png",
                tag: "CONFORMITÉ",
                date: t("21 MAI 2025", "21 MAY 2025"),
                title: t("Conformité réglementaire : les évolutions clés à anticiper en 2025", "Regulatory compliance: key developments to anticipate in 2025"),
                desc: t("Tour d'horizon des nouvelles exigences et bonnes pratiques à intégrer dès maintenant dans vos processus.", "An overview of new requirements and best practices to integrate now into your processes."),
                featured: true,
              },
              {
                img: "/actualites_hero.png",
                tag: "REPORTING",
                date: t("20 MAI 2025", "20 MAY 2025"),
                title: t("Reporting financier : améliorer la qualité des données opérationnelles", "Financial reporting: improving the quality of operational data"),
                desc: t("Méthodes, outils et indicateurs pour produire un reporting fiable, pertinent et décisionnel.", "Methods, tools and indicators to produce reliable, relevant and decision-oriented reporting."),
                featured: false,
              },
            ].map((news, i) => (
              <div key={i} className="bg-white border border-[#E0D6C8]/30 flex flex-col shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                {/* Image */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {news.featured && (
                    <div className="absolute top-3 left-3 bg-[#223930] text-white px-2 py-1 text-[0.5rem] font-bold uppercase tracking-widest">
                      À LA UNE
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#223930] text-white px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-widest rounded-sm">{news.tag}</span>
                    <span className="text-gray-400 text-[0.6rem]">|</span>
                    <span className="text-[#223930] text-[0.6rem] font-bold">{news.date}</span>
                  </div>
                  <h3 className="text-[#223930] text-[0.95rem] font-bold leading-snug mb-2 group-hover:text-[#d5a864] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-[#223930] text-[0.75rem] leading-relaxed font-medium mb-4 flex-1">
                    {news.desc}
                  </p>
                  <Link href="/actualites" className="flex items-center gap-2 text-[#223930] text-[0.65rem] font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                    {t("Lire la suite", "Read more")} <ArrowRight size={14} className="text-[#d5a864]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/actualites" className="inline-flex items-center gap-2 text-[#223930] text-[0.8rem] font-bold uppercase tracking-widest hover:text-[#d5a864] transition-colors">
            {t("Voir toutes les actualités", "View all news")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
