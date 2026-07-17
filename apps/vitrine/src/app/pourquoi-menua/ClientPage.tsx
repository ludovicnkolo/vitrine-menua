"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight } from "lucide-react";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 5.1 HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/pourquoi-hero.jpg" 
            alt="Pourquoi Menua Consulting" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="  text-white text-[1.25rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Pourquoi MENUA CONSULTING ?", "Why MENUA CONSULTING?")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6  "></div>
            <p className="  text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-8">
              {t(
                "Un partenaire opérationnel pour renforcer vos équipes, fiabiliser vos traitements et sécuriser la continuité de vos activités.",
                "An operational partner to strengthen your teams, make your processing reliable and secure the continuity of your activities."
              )}
            </p>
            <div className="flex w-full justify-end mb-8 lg:absolute lg:right-12 lg:bottom-28">
              <Link href="/nous-contacter" className="inline-flex items-center gap-3 px-4 py-2 w-fit bg-[#e8e1d7] text-[#141824] uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white transition-colors group">
                {t("Présenter votre besoin", "Submit your need")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[11.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container relative z-10">
          {/* BREADCRUMB */}
          <div className="absolute -top-8 md:-top-[8rem] left-6 md:left-12 lg:left-0 z-50">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Pourquoi MENUA CONSULTING ?", "Why MENUA CONSULTING?")}</span>
            </p>
          </div>
          {/* Text block — full width on mobile, leaves room for image on right on desktop */}
          <div className="px-6 py-10 lg:px-16 lg:pt-12 lg:pb-14 lg:pr-[38%] relative z-30 lg:z-10 lg:mt-0">
            {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
            <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Notre Vision", "Our Vision")}
            </h2>

            {/* Mobile Image (Visible only on mobile) */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 z-20 relative shadow-md">
              <img
                src="/img/pourquoi_2.jpg"
                alt="Pourquoi Menua"
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }}
              />
            </div>
            
            <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d’exécution opérationnelle exigeants.",
                "MENUA CONSULTING supports organizations facing demanding operational execution challenges."
              ))}
            </p>
            <p className="text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
              {formatBrand(t(
                "Dans des environnements où les délais, la qualité des données, la conformité documentaire et la continuité de service sont essentiels, MENUA CONSULTING apporte un appui structuré aux équipes internes afin de sécuriser le traitement des fonctions back et middle office.",
                "In environments where deadlines, data quality, documentary compliance and service continuity are essential, MENUA CONSULTING provides structured support to internal teams to secure the processing of back and middle office functions."
              ))}
            </p>


          </div>

          {/* Image — absolutely overlapping the right side of the white box */}
          <div className="hidden lg:block absolute -top-24 right-0 w-[36%] h-[75%] z-20">
            <img
              src="/img/pourquoi_2.jpg"
              alt="Pourquoi Menua"
              className="w-full h-full object-cover shadow-xl"
              onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }}
            />
          </div>

        </div>
      </section>

      {/* ── 5.3 BÉNÉFICES (Image Left, Card Right) ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="hidden lg:block w-full lg:w-5/12 h-[400px] lg:h-[550px] shadow-xl">
             <img src="/img/benefices.png" alt="Bénéfices" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.jpg"; }} />
          </div>
          <div className="w-full lg:w-7/12 bg-white p-10 lg:p-14 shadow-sm border border-[#e8e1d7] border-t-4 border-t-[#141824]">
            <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6">{t("Bénéfices", "Benefits")}</h3>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden">
              <img src="/img/benefices.png" alt="Bénéfices" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.jpg"; }} />
            </div>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
              {formatBrand(t(
                "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d’affaires.",
                "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity, strengthen your reliability and sustainably support your turnover."
              ))}
            </p>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
              {t(
                "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d’activité et de fidéliser durablement votre clientèle.",
                "This organization allows you to reduce your internal costs, better absorb your business volumes and sustainably build customer loyalty."
              )}
            </p>
            <h4 className="text-center text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{t("Bénéfices clés :", "Key benefits:")}</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-[#6e7891] font-light text-[0.95rem]">
              {[
                t("gain de temps", "time saving"),
                t("réduction des charges internes", "reduction of internal costs"),
                t("productivité renforcée", "enhanced productivity"),
                t("meilleure continuité opérationnelle", "better operational continuity"),
                t("fiabilité accrue des traitements", "increased processing reliability"),
                t("meilleure absorption des pics d’activité", "better absorption of activity peaks"),
                t("suivi plus structuré des dossiers", "more structured monitoring of files"),
                t("amélioration de la qualité de service", "improvement of service quality"),
                t("contribution à la fidélisation de vos clients", "contribution to building customer loyalty"),
                t("Chiffre d’affaires soutenu", "Supported turnover")
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5.4 CE QUI FAIT LA DIFFÉRENCE (Dark Theme, Full Width) ── */}
      <section className="relative w-full bg-[#141824] pt-16 md:pt-[7.75rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden">
        {/* Subtle geometric accent background on the left */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[10deg] origin-bottom-left hidden lg:block" />
        
        <div className="laplace-container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          
          {/* Narrative (Right side visually) */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-8" />
            <h3 className="text-white font-bold text-[2rem] lg:text-[2.2rem] leading-tight mb-8">
              {t("Ce qui fait la différence", "What makes the difference")}
            </h3>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-6">
              {t(
                "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.",
                "Specialists in back and middle office, we do not stop at analysis: we execute."
              )}
            </p>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-12">
              {t(
                "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d’intervention en français comme en anglais nous permettent d’intervenir dans des environnements exigeants, structurés et ouverts à l’international.",
                "Our 100% operational approach, our integration into client organizations and our capacity to intervene in French and English allow us to intervene in demanding, structured and internationally open environments."
              )}
            </p>
          </div>

          {/* Features Card (Left side visually) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="relative bg-white p-10 lg:p-14 shadow-2xl border border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]">
              <h4 className="text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
                {t("Nos différences :", "Our differences:")}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-[#6e7891] font-medium text-[0.95rem]">
                {[
                  t("spécialisation back et middle office ;", "back and middle office specialization;"),
                  t("approche 100 % opérationnelle ;", "100% operational approach;"),
                  t("intégration aux organisations clientes ;", "integration into client organizations;"),
                  t("interventions adaptées aux procédures internes du client ;", "interventions adapted to the client's internal procedures;"),
                  t("exécution fiable et continue ;", "reliable and continuous execution;"),
                  t("suivi structuré des livrables ;", "structured monitoring of deliverables;"),
                  t("mobilisation possible de ressources ou partenaires qualifiés selon les besoins ;", "possible mobilization of resources or qualified partners according to needs;"),
                  t("intervention en français et en anglais.", "intervention in French and English.")
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── 5.5 NOS ENGAGEMENTS (Card Left, Image Right) ── */}
      <section className="relative w-full bg-[#f5f7fa] pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-7/12 bg-white p-10 lg:p-14 shadow-sm border border-[#e8e1d7] border-t-4 border-t-[#141824]">
            <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6">{t("Nos engagements", "Our commitments")}</h3>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
              {formatBrand(t(
                "MENUA CONSULTING s’engage sur l’essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                "MENUA CONSULTING commits to the essential: the quality of deliverables, respect for deadlines, traceability of operations and clear communication with your teams."
              ))}
            </p>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
              {t(
                "Nos interventions s’appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                "Our interventions are based on a four-eyes control, structured working methods, training of mobilized resources and compliance with your operational, quality and regulatory requirements."
              )}
            </p>
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 rounded-sm shadow-md overflow-hidden">
              <img src="/img/connaitre-approche.jpg" alt="Engagements" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} />
            </div>
            
            <h4 className="text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{t("Nos engagements :", "Our commitments:")}</h4>
            <ul className="space-y-3 text-[#6e7891] font-light text-[0.95rem]">
              {[
                t("qualité des livrables", "quality of deliverables"),
                t("respect des délais", "respect for deadlines"),
                t("traçabilité des opérations réalisées", "traceability of operations carried out"),
                t("contrôle à quatre yeux lorsque le périmètre le nécessite", "four-eyes control when the scope requires it"),
                t("communication claire et régulière", "clear and regular communication"),
                t("confidentialité des informations confiées", "confidentiality of entrusted information"),
                t("respect des procédures internes du client", "compliance with the client's internal procedures"),
                t("intervention sous supervision des équipes ou professionnels habilités lorsque cela est requis", "intervention under the supervision of authorized teams or professionals when required")
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-[#141824] rounded-full mt-2 shrink-0"></span><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block w-full lg:w-5/12 h-[400px] lg:h-[550px] shadow-xl">
             <img src="/img/connaitre-approche.jpg" alt="Engagements" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/intro-office.jpg"; }} />
          </div>
        </div>
      </section>

      {/* ── 5.6 UNE RELATION FONDÉE SUR LA CONFIANCE ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container max-w-4xl mx-auto text-center">
          <div className="bg-[#e8e1d7] p-10 md:p-16 shadow-xl border-t-4 border-[#141824]">
            <h3 className="text-[#141824] font-bold text-[1.5rem] mb-6 uppercase tracking-widest">{t("Une relation fondée sur la confiance", "A relationship based on trust")}</h3>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed mb-6">
              {t(
                "Chaque mission est cadrée en amont afin de définir le besoin, les responsabilités, les livrables attendus, les délais, les modalités de suivi et les règles de validation.",
                "Each mission is framed upstream in order to define the need, responsibilities, expected deliverables, deadlines, monitoring methods and validation rules."
              )}
            </p>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed">
              {formatBrand(t(
                "MENUA CONSULTING privilégie une relation professionnelle claire, structurée et transparente, afin de garantir une collaboration efficace et durable avec ses clients.",
                "MENUA CONSULTING favors a clear, structured and transparent professional relationship, in order to guarantee an effective and lasting collaboration with its clients."
              ))}
            </p>
            

          </div>
        </div>
      </section>



    </main>
  );
}
