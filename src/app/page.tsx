"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, BarChart2, CheckCircle2, FileSpreadsheet, Building2, Zap, Clock, Maximize, Settings, Search, Lightbulb, CheckSquare, Network, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">

      {/* ── SECTION 1 : HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src="/office-lounge.jpg" alt="Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("Externalisation", "Outsourcing")}</span>
                <span className="block">{t("opérationnelle.", "operational.")}</span>
                <span className="block mt-2">{t("Sérénité garantie.", "Guaranteed serenity.")}</span>
              </h1>
              <div className="mb-8 max-w-xl">
                <p className="p-1">
                  {t("Nous sécurisons l'exécution de vos opérations back et middle office pour que vos équipes se concentrent sur les décisions stratégiques qui comptent.", "We secure the execution of your back and middle office operations so your teams can focus on strategic decisions that matter.")}
                </p>
              </div>
              <div className="flex items-center gap-3 text-white text-[0.95rem] mb-10 font-medium">
                <Globe className="text-[#D9B151]" size={20} />
                <span>{t("Interventions en français et en anglais", "Interventions in French and English")}</span>
              </div>
              <Link href="/nous-contacter" className="link-action">
                {t("PRÉSENTER UN BESOIN", "PRESENT A NEED")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : L'EXPERTISE D'UN CABINET SPÉCIALISÉ ── */}
      <section className="section-gap bg-[#8e8478]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#1A0E08]" />
                <h2 className="h2-surtitre text-[#1A0E08]">
                  {t("Le partenaire opérationnel de vos équipes", "The operational partner of your teams")}
                </h2>
              </div>
              <h3 className="h3-section text-[#1A0E08]">
                {t("L'expertise d'un cabinet spécialisé, la fiabilité d'une équipe dédiée.", "The expertise of a specialized firm, the reliability of a dedicated team.")}
              </h3>
              <p className="p-2 text-[#1A0E08] mb-10 max-w-xl">
                {t("MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées. Notre mission: sécuriser et renforcer l'exécution de vos fonctions back et middle office pour vous permettre de vous concentrer sur votre cœur de métier.", "MENUA CONSULTING supports financial, accounting, wealth, data and regulated teams. Our mission: to secure and strengthen the execution of your back and middle office functions to allow you to focus on your core business.")}
              </p>
              <Link href="/nous-connaitre" className="link-action text-[#1A0E08]">
                {t("DÉCOUVRIR NOS EXPERTISES", "DISCOVER OUR EXPERTISE")} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img src="/banner-desk.jpg" alt="Expertise" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : DES EXPERTISES OPÉRATIONNELLES ── */}
      <section className="section-gap bg-[#1A0E08]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 flex flex-col items-start">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[2px] bg-white" />
            <h2 className="h2-surtitre text-white">
              {t("VOS BESOINS", "YOUR NEEDS")}
            </h2>
          </div>
          
          <h3 className="h3-section">
            {t("Des expertises opérationnelles, au cœur de votre activité.", "Operational expertise, at the heart of your activity.")}
          </h3>
          <p className="p-2 mb-10">
            {t("Un appui ciblé pour chaque fonction de votre organisation.", "Targeted support for each function of your organization.")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-10">
            {[
              { icon: BarChart2, title: t("Finance et\nReporting", "Finance and\nReporting"), desc: t("Des données fiabilisées pour un pilotage éclairé.", "Reliable data for informed management.") },
              { icon: CheckCircle2, title: t("Contrôle\nde gestion", "Management\ncontrol"), desc: t("Une maîtrise accrue des coûts et de la performance.", "Increased control of costs and performance.") },
              { icon: FileSpreadsheet, title: t("Support\ncomptable et Data", "Accounting\nand Data support"), desc: t("Des opérations fluides et des données structurées.", "Smooth operations and structured data.") },
              { icon: Building2, title: t("Gestion de\nPatrimoine et CGP", "Wealth Management\nand IFA"), desc: t("Un support administratif réactif pour vos conseillers.", "Responsive administrative support for your advisors.") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white/10 border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all">
                <h4 className="h4-titre text-white mb-3 whitespace-pre-line">
                  {item.title}
                </h4>
                <p className="p-3">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/vos-besoins" className="link-action mt-4">
            {t("VOIR TOUS NOS DOMAINES D'INTERVENTION", "VIEW ALL OUR AREAS OF INTERVENTION")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── SECTION 4 : NOTRE APPROCHE ── */}
      <section className="section-gap bg-[#e4dcf7]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 bg-transparent rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">

            {/* Image à gauche */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img src="/meeting.jpg" alt="Notre approche" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
            </div>

            {/* Texte à droite */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[2px] bg-[#1A0E08]" />
                <h2 className="h2-surtitre text-[#1A0E08]">
                  {t("Notre approche", "Our approach")}
                </h2>
              </div>
              <h3 className="h3-section text-[#1A0E08]">
                {t("Une approche 100% opérationnelle, intégrée à vos process.", "A 100% operational approach, integrated into your processes.")}
              </h3>
              <p className="p-2 !text-[#4A4E5A] mb-8">
                {t(
                  "Nous ne sommes pas des consultants. Nous sommes les bras et l'expertise qui exécutent.",
                  "We are not consultants. We are the hands and expertise that execute."
                )}
              </p>

              {/* 3 piliers */}
              <div className="flex flex-col gap-5 mb-8">
                {[
                  {
                    icon: Network,
                    title: t("Intégration Fluide", "Seamless Integration"),
                    desc: t("Vos méthodes, vos outils, vos procédures. Nous nous adaptons à votre organisation pour un renfort immédiatement opérationnel.", "Your methods, tools, procedures. We adapt to your organization for immediately operational support."),
                  },
                  {
                    icon: ShieldCheck,
                    title: t("Contrôle Qualité Permanent", "Permanent Quality Control"),
                    desc: t("Une supervision continue et un contrôle à quatre yeux sur chaque livrable, garantissant une fiabilité et une traçabilité sans faille.", "Continuous supervision and four-eyes control on every deliverable, ensuring flawless reliability and traceability."),
                  },
                  {
                    icon: Globe,
                    title: t("Intervention Bilingue", "Bilingual Intervention"),
                    desc: t("Une capacité d'intervention en français et en anglais pour une gestion fluide de vos opérations et reportings dans un contexte international.", "Ability to intervene in French and English for smooth management of your operations and reporting in an international context."),
                  },
                ].map((pilier, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full border border-[#D9B151] bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <pilier.icon className="text-[#D9B151]" size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="h4-titre text-[#1A0E08] mb-1">{pilier.title}</h4>
                      <p className="p-3 !text-[#4A4E5A] !text-[0.85rem]">{pilier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/pourquoi-menua" className="link-action text-[#1A0E08] mt-2">
                {t("En savoir plus sur notre méthodologie", "Learn more about our methodology")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ── SECTION 5 : DES SOLUTIONS D'EXTERNALISATION ── */}
      <section className="section-gap bg-[#1A0E08]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
              <div className="w-8 h-[2px] bg-white" />
              <h2 className="h2-surtitre text-white">
                {t("NOS SOLUTIONS", "OUR SOLUTIONS")}
              </h2>
            </div>
            <h3 className="h3-section text-center lg:text-left">
              {t("Des solutions d'externalisation conçues pour s'adapter à vos contraintes.", "Outsourcing solutions designed to adapt to your constraints.")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16 pt-4">
              {[
                { title: t("Urgence", "Emergency"), desc: t("Mobilisation rapide de ressources pour absorber un pic d'activité ou un besoin immédiat.", "Rapid mobilization of resources to absorb a peak in activity or an immediate need.") },
                { title: t("Durée", "Duration"), desc: t("De la mission ponctuelle à l'externalisation continue, la flexibilité contractuelle que vous attendez.", "From ad hoc missions to continuous outsourcing, the contractual flexibility you expect.") },
                { title: t("Volume", "Volume"), desc: t("Un dimensionnement d'équipe ajusté à la charge de travail, pour une efficacité optimale.", "Team sizing adjusted to the workload, for optimal efficiency.") },
                { title: t("Organisation", "Organization"), desc: t("Intégration dédiée, prise en charge de processus métiers spécifiques, selon vos besoins.", "Dedicated integration, handling of specific business processes, according to your needs.") },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-white/10 border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all">
                  <h4 className="h4-titre text-white mb-3 whitespace-pre-line">
                    {item.title}
                  </h4>
                  <p className="p-3">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center lg:justify-start">
              <Link href="/nos-solutions" className="link-action">
                {t("DÉCOUVRIR NOS SOLUTIONS", "DISCOVER OUR SOLUTIONS")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 : ÉCLAIRAGES & ANALYSES ── */}
      <section className="section-gap bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="w-8 h-[2px] bg-[#1A0E08]" />
            <h2 className="h2-surtitre text-[#1A0E08]">
              {t("Éclairages et analyses", "Insights and analyses")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
            {[
              { img: "/digitalisation.jpg", tag: "DIGITALISATION", date: "12 MAI 2024", title: t("Digitalisation des processus back office : enjeux et bonnes pratiques", "Digitalization of back office processes: challenges and best practices") },
              { img: "/news-2.jpg", tag: "RÉGLEMENTATION", date: "06 MAI 2024", title: t("Conformité réglementaire : les évolutions dès à anticiper en 2025", "Regulatory compliance: key developments to anticipate in 2025") },
              { img: "/news-3.jpg", tag: "REPORTING", date: "28 MAI 2024", title: t("Reporting financier : améliorer la qualité des données opérationnelles", "Financial reporting: improving the quality of operational data") },
            ].map((news, i) => (
              <div key={i} className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all rounded-lg group">
                <div className="h-[220px] overflow-hidden">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[#918279] text-[0.65rem] font-bold mb-4 uppercase tracking-widest">
                    <span>{news.date}</span>
                    <span>|</span>
                    <span>{news.tag}</span>
                  </div>
                  <h3 className="text-[#122017] text-[1.15rem] font-bold leading-[1.4] mb-8">{news.title}</h3>
                  <Link href="/actualites" className="link-action text-[#1A0E08] mt-auto text-[0.8rem] gap-2">
                    {t("LIRE LA SUITE", "READ MORE")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/actualites" className="link-action text-[#1A0E08] mt-6">
            {t("VOIR TOUTES LES ACTUALITÉS", "VIEW ALL NEWS")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── SECTION 7 : L'EXPERTISE AU SERVICE DE VOTRE PERFORMANCE ── */}
      <CallToAction />

    </main>
  );
}
