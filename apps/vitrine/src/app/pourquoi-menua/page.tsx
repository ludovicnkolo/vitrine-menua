"use client";
import React from "react";
import { CheckCircle2, Clock, TrendingDown, TrendingUp, ShieldCheck, Heart, DollarSign, Star, Target, Link as LinkIcon, RefreshCw, CheckSquare, Globe, Award, Calendar, FileText, Eye, MessageCircle, BookOpen, FileCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/pourquoi-hero.jpg" 
            alt="Pourquoi nous choisir" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-56 md:pt-72 pb-20 mt-16">
          <div className="max-w-4xl -ml-1.5 md:-ml-6 lg:-ml-12">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[1.8rem] md:text-[2.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Pourquoi Menua Consulting ?", "Why Menua Consulting ?")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] lg:text-[1.3rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants.",
                "MENUA CONSULTING supports organizations facing demanding operational execution challenges."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.2 BÉNÉFICES (Overlapping style, image right) ── */}
      <section id="nos-benefices" className="relative w-full bg-white section-padding mt-16 lg:mt-0 scroll-mt-20">
        <div className="laplace-container relative z-10">

          {/* Text block — full width on mobile, leaves room for image on right on desktop */}
          <div className="px-6 py-10 lg:px-16 lg:pt-12 lg:pb-14 lg:pr-[38%] relative z-30 lg:z-10 lg:mt-0">
            {/* Absolute background: drops down on mobile so title is on white and image overlaps it */}
            <div className="absolute left-0 right-0 bottom-0 top-[220px] lg:top-0 bg-[#f5f7fa] rounded-sm shadow-xl -z-10" />

            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Bénéfices", "Benefits")}
            </h2>

            {/* Mobile Image (Visible only on mobile) */}
            <div className="block lg:hidden w-[105%] -ml-[2.5%] h-[250px] my-6 z-20 relative shadow-md">
              <img
                src="/img/pourquoi-precision.jpg"
                alt="Résultats tangibles"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-4">
              {t(
                "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires.",
                "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity, strengthen your reliability and sustainably support your turnover."
              )}
            </p>
            <p className="text-[#6e7891] text-[1.1rem] font-light leading-relaxed mb-10">
              {t(
                "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle.",
                "This organization allows you to reduce your internal costs, better absorb your activity volumes and sustainably retain your customers."
              )}
            </p>

            {/* Benefits list */}
            <div className="border-t border-[#e8e1d7] pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  t("Gain de temps", "Time saving"),
                  t("Réduction des charges internes", "Reduction of internal costs"),
                  t("Productivité accrue", "Increased productivity"),
                  t("Efficacité renforcée", "Enhanced efficiency"),
                  t("Fiabilité des opérations", "Reliability of operations"),
                  t("Fidélisation de la clientèle", "Customer loyalty"),
                  t("Chiffre d'affaires soutenu", "Sustained turnover"),
                ].map((label, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                    <span className="text-[#141824] text-[1.05rem] font-light">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image — absolutely overlapping the right side */}
          <div className="hidden lg:block absolute -top-24 right-0 w-[36%] h-[75%] z-20">
            <img
              src="/img/pourquoi-precision.jpg"
              alt="Différenciation"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.3 NOTRE DIFFÉRENCIATION (Accréditations style) ── */}
      <section id="notre-differenciation" className="relative w-full bg-white section-padding scroll-mt-20">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Beige block with content (Left) */}
          <div className="w-full lg:w-1/2 bg-[#e8e1d7] p-10 lg:p-16 flex flex-col justify-center shadow-xl">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.3rem] md:text-[1.5rem] text-[#141824] font-bold uppercase mb-4 leading-tight">
              {t("DIFFÉRENCIATION", "DIFFERENTIATION")}
            </h2>

            <p className="text-[#141824] text-[1.05rem] font-light leading-relaxed mb-4">
              {t(
                "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.",
                "As back and middle office specialists, we don't stop at analysis: we execute."
              )}
            </p>
            <p className="text-[#141824] text-[1.05rem] font-light leading-relaxed mb-8">
              {t(
                "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                "Our 100% operational approach, our integration into client organizations and our ability to intervene in French and English allow us to operate in demanding, structured and internationally open environments."
              )}
            </p>

            <ul className="space-y-4 text-[#141824] text-[1.05rem] font-medium">
              {[
                t("Spécialisation back et middle office", "Back and middle office specialization"),
                t("Approche 100% opérationnelle", "100% operational approach"),
                t("Intégration à votre organisation", "Integration into your organization"),
                t("Exécution fiable et continue", "Reliable and continuous execution"),
                t("Supervision qualité des livrables", "Quality supervision of deliverables"),
                t("Intervention bilingue français / anglais", "Bilingual intervention French / English"),
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141824] shrink-0 mt-2" />
                  <span className="font-light">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image (Right) */}
          <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] shadow-xl">
            <img
              src="/img/pourquoimenua_3.jpg"
              alt="Notre différenciation"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.4 NOS ENGAGEMENTS (Pourquoi MENUA style, light gray) ── */}
      <section id="nos-engagements" className="relative w-full bg-[#f5f7fa] text-[#141824] section-padding scroll-mt-20">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">

          {/* Left Column: Narrative */}
          <div className="w-full md:w-5/12">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[#141824] text-[1.3rem] md:text-[1.5rem] font-bold mb-6 uppercase tracking-wider">
              {t("ENGAGEMENTS", "COMMITMENTS")}
            </h2>
            <p className="text-[1.1rem] text-[#6e7891] font-light leading-relaxed mb-6">
              {t(
                "MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                "MENUA CONSULTING commits to the essentials: quality of deliverables, respect of deadlines, traceability of operations and clear communication with your teams."
              )}
            </p>
            <p className="text-[1.1rem] text-[#6e7891] font-light leading-relaxed mb-10">
              {t(
                "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                "Our interventions are based on a four-eyes control, structured working methods, training of mobilized resources and respect for your operational, quality and regulatory requirements."
              )}
            </p>
          </div>

          {/* Right Column: Grid of commitments */}
          <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { title: t("Qualité des livrables", "Quality of deliverables") },
              { title: t("Respect des délais", "Respect of deadlines") },
              { title: t("Traçabilité des opérations", "Traceability of operations") },
              { title: t("Contrôle à quatre yeux", "Four-eyes control") },
              { title: t("Communication claire et régulière", "Clear and regular communication") },
              { title: t("Formation des ressources mobilisées", "Training of mobilized resources") },
              { title: t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Respect of your operational, quality and regulatory requirements"), span: true },
            ].map((item, i) => (
              <div key={i} className={`border-l-2 border-[#141824]/20 pl-6 flex items-center ${item.span ? 'sm:col-span-2 sm:max-w-[50%] sm:mx-auto sm:w-full' : ''}`}>
                <h3 className="text-[#141824] font-semibold text-[1.05rem] leading-snug">{item.title}</h3>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      <CallToAction />
    </main>
  );
}
