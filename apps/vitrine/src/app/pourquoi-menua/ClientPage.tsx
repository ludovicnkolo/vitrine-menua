"use client";
import React from "react";
import Link from "@/components/Link";
import { useLanguage } from "@/components/LanguageProvider";
import { formatBrand } from "@/utils/formatBrand";
import { ArrowRight } from "lucide-react";
import BulletList from "@/components/BulletList";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 5.1 HERO ── */}
      <section className="relative w-full min-h-screen portrait:sm:min-h-0 portrait:sm:h-[70svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/pourquoi-hero.webp" 
            alt="Pourquoi Menua Consulting" 
            className="w-full h-full object-cover object-[center_35%]" 
            onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 relative z-10 pt-56 md:pt-72 landscape:pt-24 lg:pt-0 landscape:lg:pt-0 pb-28 portrait:sm:pb-20 landscape:pb-24 lg:pb-10 landscape:lg:pb-40 xl:pb-16 mt-16 landscape:mt-0 lg:mt-0 landscape:lg:mt-0">
          <div className="max-w-4xl ml-6 md:-ml-10 portrait:sm:ml-8 lg:-ml-4 landscape:ml-6 landscape:lg:-ml-4">
            <h1 className="text-white text-[1.25rem] portrait:sm:text-[1.5rem] md:text-[2.5rem] portrait:md:text-[1.8rem] landscape:text-[1.25rem] landscape:lg:text-[1.88rem] xl:text-[2.75rem] leading-[1.1] mb-6 landscape:mb-3 landscape:lg:mb-6 font-bold uppercase tracking-widest">
              {t("Pourquoi MENUA CONSULTING ?", "Why choose us?")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 landscape:mb-3 landscape:lg:mb-6"></div>
            <p className="text-[1.1rem] lg:text-[1.3rem] landscape:text-[1rem] landscape:lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl mb-1">
              {t(
                "Un partenaire opérationnel pour renforcer vos équipes, fiabiliser vos traitements et sécuriser la continuité de vos activités.",
                "An independent, flexible and specialised approach designed to maintain the delivery of your operations."
              )}
            </p>
            <div className="mt-4">
              <Link href="/nous-contacter" className="inline-flex items-center gap-2 px-4 py-2 border border-white/60 text-white uppercase tracking-wider text-[0.95rem] font-bold hover:bg-white hover:text-[#141824] transition-colors group">
                {t("Présenter votre besoin", "Submit your need")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.2 INTRODUCTION ── */}
      <section className="relative w-full bg-white pt-8 md:pt-[2.75rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
          {/* BREADCRUMB */}
          <div className="w-full mb-8 md:mb-4">
            <p className="text-[#141824] text-[0.7rem] font-bold tracking-widest uppercase mb-0">
              <Link href="/" className="hover:text-[#6e7891] transition-colors">{t("Accueil", "Home")}</Link>
              <span className="mx-2">/</span>
              <span>{t("Pourquoi MENUA CONSULTING ?", "Why choose us?")}</span>
            </p>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center">
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-6/12 lg:h-[420px] z-20 relative shrink-0">
              <img
                src="/img/pourquoi_2.webp"
                alt="Pourquoi Menua"
                className="w-full h-full object-cover object-center shadow-xl"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
              />
            </div>

            {/* Left Overlapping Grey Box */}
            <div className="w-full lg:w-7/12 px-6 portrait:sm:px-10 landscape:px-32 landscape:lg:px-0 py-10 lg:px-12 lg:pl-20 landscape:lg:pl-20 lg:pr-32 landscape:lg:pr-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-mr-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 portrait:sm:left-2 portrait:sm:right-2 landscape:left-16 landscape:right-16 lg:left-0 lg:right-0 landscape:lg:left-0 landscape:lg:right-0 bottom-0 top-[220px] landscape:top-[320px] lg:top-0 landscape:lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
                {t("Notre Vision", "Our vision")}
              </h2>

              {/* Mobile Image (Visible only on mobile) */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-16 z-20 relative shadow-md">
                <img
                  src="/img/pourquoi_2.webp"
                  alt="Pourquoi Menua"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                />
              </div>
              
              <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d’exécution opérationnelle exigeants.",
                  "MENUA CONSULTING supports organisations facing demanding operational delivery challenges."
                ))}
              </p>
              <p className="text-[#6e7891] text-[1rem] font-light leading-relaxed mb-4">
                {formatBrand(t(
                  "Dans des environnements où les délais, la qualité des données, la conformité documentaire et la continuité de service sont essentiels, MENUA CONSULTING apporte un appui structuré aux équipes internes afin de sécuriser le traitement des fonctions back et middle office.",
                  "In environments where deadlines, data quality, documentary compliance and service continuity are critical, MENUA CONSULTING provides structured support to internal teams to safeguard the processing of back and middle-office functions."
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.3 BÉNÉFICES (Image Left, Card Right) ── */}
      <section id="nos-benefices" className="relative w-full bg-white pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 landscape:px-16 landscape:lg:px-16">
          <div className="hidden lg:block w-full lg:w-5/12 h-[400px] lg:h-[550px] shadow-xl">
             <img src="/img/benefices.webp" alt="Bénéfices" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} />
          </div>
          <div className="w-full lg:w-7/12 bg-white p-10 lg:p-14 shadow-sm border border-[#e8e1d7] border-t-4 border-t-[#141824]">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">{t("Bénéfices", "Benefits")}</h2>
            
            {/* Mobile Image */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-12 rounded-sm shadow-md overflow-hidden">
              <img src="/img/benefices.webp" alt="Bénéfices" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/img/besoins-meeting.webp"; }} />
            </div>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
              {formatBrand(t(
                "En externalisant certaines fonctions back et middle office avec MENUA CONSULTING, vos équipes peuvent mieux répartir leur charge, renforcer la continuité opérationnelle et structurer le suivi des dossiers.",
                "By outsourcing selected back and middle-office functions to MENUA CONSULTING, your teams can distribute their workload more effectively, strengthen operational continuity and structure case-handling."
              ))}
            </p>
            <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
              {t(
                "Cette organisation contribue à la maîtrise des traitements, à la qualité de service et à la fidélisation des clients.",
                "This approach supports tighter processing controls, enhanced service quality and stronger client retention."
              )}
            </p>
            <h4 className="text-center text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{t("Bénéfices clés :", "Key benefits:")}</h4>
            <BulletList items={[
              t("gain de temps", "Time savings"),
              t("meilleure maîtrise de la charge interne", "Tighter control over internal workload"),
              t("productivité renforcée", "Enhanced productivity"),
              t("meilleure continuité opérationnelle", "Improved operational continuity"),
              t("fiabilité accrue des traitements", "Greater processing reliability"),
              t("meilleure absorption des pics d’activité", "Better absorption of activity spikes"),
              t("suivi plus structuré des dossiers", "More structured file monitoring"),
              t("amélioration de la qualité de service", "Improved service quality"),
              t("contribution à la fidélisation de vos clients", "Contribution to client retention"),
              t("contribution à la continuité de l’activité", "Contribution to business continuity")
            ]} />
          </div>
        </div>
      </section>

      {/* ── 5.4 CE QUI FAIT LA DIFFÉRENCE (Dark Theme, Full Width) ── */}
      <section id="notre-differenciation" className="relative w-full bg-[#141824] pt-16 md:pt-[7.75rem] pb-16 md:pb-24 scroll-mt-20 overflow-hidden">
        {/* Subtle geometric accent background on the left */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#1a1f2e] skew-x-[10deg] origin-bottom-left hidden lg:block" />
        
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          
          {/* Narrative (Right side visually) */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center -translate-y-4 lg:-translate-y-10">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
            <h2 className="text-white text-[1.3rem] md:text-[1.5rem] font-bold uppercase mb-8 leading-tight">
              {t("Ce qui fait la différence", "What makes the difference")}
            </h2>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-6">
              {t(
                "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l’analyse : nous exécutons.",
                "Specialists in back and middle office, we do not stop at analysis: we execute."
              )}
            </p>
            <p className="text-[#e5e9f0] font-light text-[1.1rem] leading-relaxed mb-12">
              {t(
                "Notre approche 100 % opérationnelle, notre intégration aux organisations clientes et notre capacité d’intervention en français comme en anglais nous permettent d’intervenir dans des environnements exigeants, structurés et ouverts à l’international.",
                "Our 100% operational focus, seamless integration into client organizations, and bilingual delivery in French and English enable us to operate effectively in demanding, structured, and international environments."
              )}
            </p>
          </div>

          {/* Features Card (Left side visually) */}
          <div className="w-full lg:w-7/12 relative">
            <div className="relative bg-white p-10 lg:p-14 shadow-2xl border border-[#e8e1d7] border-t-8 border-t-[#e8e1d7]">
              <h4 className="text-[#141824] font-bold text-[1.1rem] uppercase tracking-widest mb-8">
                {t("Nos différences :", "Our differences:")}
              </h4>
              <BulletList 
                gridCols="grid-cols-1 md:grid-cols-2"
                gapX="gap-x-8" gapY="gap-y-6"
                fontWeight="font-medium"
                items={[
                  t("spécialisation back et middle office ;", "back and middle office specialization;"),
                  t("approche 100 % opérationnelle ;", "100% operational approach;"),
                  t("intégration aux organisations clientes ;", "integration into client organizations;"),
                  t("interventions adaptées aux procédures internes du client ;", "interventions adapted to the client's internal procedures;"),
                  t("exécution fiable et continue ;", "reliable and continuous execution;"),
                  t("suivi structuré des livrables ;", "structured monitoring of deliverables;"),
                  t("mobilisation possible de ressources ou partenaires qualifiés selon les besoins ;", "targeted deployment of qualified resources or partners tailored to project requirements;"),
                  t("intervention en français et en anglais.", "bilingual delivery in French and English.")
                ]}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── SEPARATION BLANC ── */}
      <div className="w-full h-8 md:h-[5.25rem] bg-white"></div>

      {/* ── 5.5 NOS ENGAGEMENTS (Overlapping layout) ── */}
      <section id="nos-engagements" className="relative w-full bg-[#f5f7fa] pt-12 md:pt-[5.25rem] pb-16 md:pb-24 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 relative z-10 landscape:px-16 landscape:lg:px-16">
          <div className="flex flex-col lg:flex-row-reverse items-center">
            
            {/* Right Image (Desktop only) */}
            <div className="hidden lg:block w-full lg:w-6/12 lg:h-[400px] z-20 relative shrink-0">
              <img
                src="/img/pourquoi_4.webp"
                alt="Engagements"
                className="w-full h-full object-cover object-center shadow-xl"
                onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
              />
            </div>

            {/* Left Overlapping White Box */}
            <div className="w-full lg:w-7/12 px-6 portrait:sm:px-10 landscape:px-32 landscape:lg:px-0 py-10 lg:px-12 lg:pl-20 landscape:lg:pl-20 lg:pr-32 landscape:lg:pr-32 lg:pt-16 lg:pb-16 relative z-30 lg:z-10 lg:-mr-24">
              {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
              <div className="absolute left-0 right-0 portrait:sm:left-2 portrait:sm:right-2 landscape:left-16 landscape:right-16 lg:left-0 lg:right-0 landscape:lg:left-0 landscape:lg:right-0 bottom-0 top-[220px] landscape:top-[320px] lg:top-0 landscape:lg:top-0 bg-white rounded-sm shadow-xl border border-[#e8e1d7] border-t-4 border-t-[#141824] -z-10" />

              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
                {t("Nos engagements", "Our commitments")}
              </h2>

              {/* Mobile Image (Visible only on mobile) */}
              <div className="block lg:hidden w-[105%] -ml-[2.5%] portrait:sm:w-[calc(100%-6rem)] portrait:sm:ml-[3rem] landscape:w-[calc(100%-4rem)] landscape:ml-8 h-[280px] portrait:sm:h-[320px] landscape:h-[320px] my-6 landscape:mt-6 landscape:mb-16 z-20 relative shadow-md">
                <img
                  src="/img/pourquoi_4.webp"
                  alt="Engagements"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.src = "/img/intro-office.webp"; }}
                />
              </div>
              
              <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-6">
                {formatBrand(t(
                  "MENUA CONSULTING s’engage sur l’essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                  "At MENUA CONSULTING, we recognise that the processing we handle is vital to the proper functioning of your organisation. That is why our engagements are governed by strict commitments to rigour, reliability and transparency."
                ))}
              </p>
              <p className="text-[#6e7891] font-light text-[1.05rem] leading-relaxed mb-8">
                {t(
                  "Nos interventions s’appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                  "Our services rely on four-eyes review, structured workflows, appropriately trained resources, and strict adherence to your operational, quality and regulatory requirements."
                )}
              </p>
              
              <h4 className="text-[#141824] font-semibold text-[0.95rem] uppercase tracking-wider mb-6">{t("Nos engagements :", "Our commitments:")}</h4>
              <BulletList 
                gridCols="grid-cols-1"
                gapY="space-y-3"
                items={[
                  t("qualité des livrables", "Quality of deliverables"),
                  t("respect des délais", "Strict adherence to deadlines"),
                  t("traçabilité des opérations réalisées", "Traceability of actions and decisions"),
                  t("contrôle à quatre yeux lorsque le périmètre le nécessite", "Four-eyes review where required"),
                  t("communication claire et régulière", "Clear and regular communication"),
                  t("confidentialité des informations confiées", "Data and operational confidentiality"),
                  t("respect des procédures internes du client", "Strict adherence to your procedures and tools"),
                  t("intervention sous supervision des équipes ou professionnels habilités lorsque cela est requis", "Delivery supervised by authorised professionals where required")
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.6 UNE RELATION FONDÉE SUR LA CONFIANCE ── */}
      <section className="relative w-full bg-white pt-12 md:pt-[5.25rem] landscape:pt-8 landscape:lg:pt-[5.25rem] pb-16 md:pb-24 landscape:pb-8 landscape:lg:pb-48 scroll-mt-20">
        <div className="laplace-container portrait:sm:px-10 landscape:px-16 landscape:lg:px-12 max-w-4xl mx-auto text-center">
          <div className="bg-[#e8e1d7] p-10 landscape:p-8 landscape:lg:p-16 md:p-16 shadow-xl border-t-4 border-[#141824]">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-8 leading-tight">{t("Une relation fondée sur la confiance", "A relationship based on trust")}</h2>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed mb-6">
              {t(
                "Chaque mission est cadrée en amont afin de définir le besoin, les responsabilités, les livrables attendus, les délais, les modalités de suivi et les règles de validation.",
                "Each engagement is defined at the outset to clearly establish requirements, responsibilities, expected deliverables, timelines, monitoring arrangements and approval workflows."
              )}
            </p>
            <p className="text-[#141824]/80 font-medium text-[1.1rem] leading-relaxed">
              {formatBrand(t(
                "MENUA CONSULTING privilégie une relation professionnelle claire, structurée et transparente, afin de garantir une collaboration efficace et durable avec ses clients.",
                "MENUA CONSULTING fosters a clear, structured and transparent professional relationship to ensure an effective and lasting collaboration with its clients."
              ))}
            </p>
            

          </div>
        </div>
      </section>



    </main>
  );
}
