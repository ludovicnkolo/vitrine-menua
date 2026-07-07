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
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden mb-20 lg:mb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/difference.png" 
            alt="Pourquoi nous choisir" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="animate-fade-in-up stagger-1 text-[#e8e1d7] text-[0.9rem] font-bold tracking-widest uppercase mb-6">
              {t("Notre valeur ajoutée", "Our added value")}
            </p>
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Pourquoi nous choisir comme partenaire opérationnel ?", "Why choose us as an operational partner?")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "Parce que nous transformons l'externalisation en un levier de performance, de fiabilité et de sérénité pour vos équipes.",
                "Because we transform outsourcing into a lever of performance, reliability and peace of mind for your teams."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2.2 BÉNÉFICES (Beige Cards) ── */}
      <section className="relative w-full section-padding bg-[#f5f7fa]">
        <div className="laplace-container">
          <div className="animate-fade-in-up mb-16 text-center">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#141824] mb-5" />
              <h2 className="mb-6 text-[2rem] text-[#141824] font-bold uppercase tracking-wider">{t("Bénéfices", "Benefits")}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Clock, title: t("Gain de temps", "Time saving") },
              { icon: TrendingDown, title: t("Réduction des charges internes", "Reduction of internal costs") },
              { icon: TrendingUp, title: t("Productivité accrue", "Increased productivity") },
              { icon: Target, title: t("Efficacité renforcée", "Enhanced efficiency") },
              { icon: ShieldCheck, title: t("Fiabilité des opérations", "Reliability of operations") },
              { icon: Heart, title: t("Fidélisation de la clientèle", "Customer loyalty") },
              { icon: DollarSign, title: t("Chiffre d'affaires soutenu", "Sustained turnover") },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                <b.icon size={36} className="text-[#141824] mb-6" strokeWidth={1.5} />
                <h3 className="font-bold text-[#141824] text-[1.1rem] leading-snug">{b.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2.3 NOTRE DIFFÉRENCIATION (Overlapping Beige Box) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[500px] lg:h-[700px] z-10 shadow-xl">
              <img src="/office-lounge.jpg" alt="Notre différenciation" className="w-full h-full object-cover" />
            </div>
            
            {/* Right Overlapping Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl">
              <p className="text-[#141824] text-[0.85rem] font-bold tracking-widest uppercase mb-4 opacity-70">
                {t("Notre différenciation", "Our Differentiation")}
              </p>
              <div className="w-16 h-[3px] bg-[#141824] mb-5 animate-fade-in-up" />
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-8 font-bold leading-tight uppercase tracking-wider">
                {t("Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.", "As back and middle office specialists, we don't stop at analysis: we execute.")}
              </h2>
              
              <ul className="space-y-6 text-[#141824] text-[1.05rem] font-light">
                {[
                  { icon: Star, text: t("Spécialisation back et middle office", "Back and middle office specialization") },
                  { icon: Target, text: t("Approche 100% opérationnelle", "100% operational approach") },
                  { icon: LinkIcon, text: t("Intégration à votre organisation", "Integration into your organization") },
                  { icon: RefreshCw, text: t("Exécution fiable et continue", "Reliable and continuous execution") },
                  { icon: CheckSquare, text: t("Supervision qualité des livrables", "Quality supervision of deliverables") },
                  { icon: Globe, text: t("Intervention bilingue français / anglais", "Bilingual intervention French / English") },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <item.icon size={20} className="text-[#141824] mt-1 shrink-0" strokeWidth={1.5} />
                    <span className="font-bold leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

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

      <CallToAction />
    </main>
  );
}
