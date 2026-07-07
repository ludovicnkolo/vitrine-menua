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
            src="/difference.png" 
            alt="Pourquoi nous choisir" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Pourquoi Menua ?", "Why Menua ?")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "L'externalisation comme levier de performance, de fiabilité et de sérénité.",
                "Outsourcing as a lever for performance, reliability and peace of mind."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.2 BÉNÉFICES (Overlapping style, image right) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative">

          {/* Text block — full width on mobile, leaves room for image on right on desktop */}
          <div className="bg-[#f5f7fa] shadow-xl relative z-10 px-10 lg:px-16 pt-12 pb-14 lg:pr-[38%]">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("Bénéfices", "Benefits")}
            </h2>
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
              <p className="text-[#141824] font-bold text-[0.85rem] uppercase tracking-widest mb-6">
                {t("Bénéfices pour votre organisation :", "Benefits for your organization:")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {[
                  { icon: Clock, label: t("Gain de temps", "Time saving") },
                  { icon: TrendingDown, label: t("Réduction des charges internes", "Reduction of internal costs") },
                  { icon: TrendingUp, label: t("Productivité accrue", "Increased productivity") },
                  { icon: Target, label: t("Efficacité renforcée", "Enhanced efficiency") },
                  { icon: ShieldCheck, label: t("Fiabilité des opérations", "Reliability of operations") },
                  { icon: Heart, label: t("Fidélisation de la clientèle", "Customer loyalty") },
                  { icon: DollarSign, label: t("Chiffre d'affaires soutenu", "Sustained turnover") },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <b.icon size={16} className="text-[#141824] shrink-0" strokeWidth={2} />
                    <span className="text-[#141824] text-[0.95rem] font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image — absolutely overlapping the right side */}
          <div className="hidden lg:block absolute -top-24 right-0 w-[36%] h-[75%] z-20">
            <img
              src="/difference.png"
              alt="Bénéfices"
              className="w-full h-full object-cover shadow-xl"
              onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
            />
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.3 NOTRE DIFFÉRENCIATION (Accréditations style) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Beige block with content (Left) */}
          <div className="w-full lg:w-1/2 bg-[#e8e1d7] p-10 lg:p-16 flex flex-col justify-center shadow-xl">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.6rem] md:text-[2rem] text-[#141824] font-bold uppercase mb-4 leading-tight">
              {t("DIFFÉRENCIATION", "DIFFERENTIATION")}
            </h2>
            <p className="text-[#141824] font-bold text-[0.85rem] uppercase tracking-widest mb-6 opacity-70">
              {t("Pourquoi nous choisir ?", "Why choose us?")}
            </p>

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
                { icon: Star, text: t("Spécialisation back et middle office", "Back and middle office specialization") },
                { icon: Target, text: t("Approche 100% opérationnelle", "100% operational approach") },
                { icon: LinkIcon, text: t("Intégration à votre organisation", "Integration into your organization") },
                { icon: RefreshCw, text: t("Exécution fiable et continue", "Reliable and continuous execution") },
                { icon: CheckSquare, text: t("Supervision qualité des livrables", "Quality supervision of deliverables") },
                { icon: Globe, text: t("Intervention bilingue français / anglais", "Bilingual intervention French / English") },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <item.icon size={18} className="text-[#141824] mt-1 shrink-0" strokeWidth={1.5} />
                  <span className="font-light">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image (Right) */}
          <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] shadow-xl">
            <img
              src="/office-lounge.jpg"
              alt="Notre différenciation"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.4 NOS ENGAGEMENTS (Dark Blue Section) ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding">
        <div className="laplace-container">
          <div className="animate-fade-in-up mb-16 text-center max-w-4xl mx-auto">
            <div className="inline-block text-left mb-6">
              <p className="text-[#e8e1d7] text-[0.85rem] font-bold tracking-widest uppercase mb-4">
                {t("Nos engagements", "Our Commitments")}
              </p>
              <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
              <h2 className="text-[2rem] text-white font-bold uppercase tracking-wider">
                {t("Une garantie de qualité et de sérénité", "A guarantee of quality and peace of mind")}
              </h2>
            </div>
            <p className="text-[#e5e9f0] text-[1.1rem] leading-relaxed mb-6 font-light">
              {t("MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.", "MENUA CONSULTING commits to the essentials: quality of deliverables, respect of deadlines, traceability of operations and clear communication with your teams.")}
            </p>
            <p className="text-[#e5e9f0] text-[1.1rem] leading-relaxed font-light">
              {t("Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.", "Our interventions are based on a four-eyes control, structured working methods, training of mobilized resources and respect for your operational, quality and regulatory requirements.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Award, text: t("Qualité des livrables", "Quality of deliverables") },
              { icon: Calendar, text: t("Respect des délais", "Respect of deadlines") },
              { icon: FileText, text: t("Traçabilité des opérations", "Traceability of operations") },
              { icon: Eye, text: t("Contrôle à quatre yeux", "Four-eyes control") },
              { icon: MessageCircle, text: t("Communication claire et régulière", "Clear and regular communication") },
              { icon: BookOpen, text: t("Formation des ressources mobilisées", "Training of mobilized resources") },
              { icon: FileCheck, text: t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Respect of your operational, quality and regulatory requirements"), colSpan: "sm:col-span-2 lg:col-span-3 xl:col-span-1" },
            ].map((item, i) => (
              <div key={i} className={`bg-white/5 border border-white/10 p-6 flex flex-col items-start gap-4 hover:bg-white/10 transition-colors ${item.colSpan || ''}`}>
                <item.icon size={28} className="text-[#e8e1d7]" strokeWidth={1} />
                <span className="font-bold text-white leading-snug">{item.text}</span>
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
