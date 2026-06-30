"use client";
import Link from "next/link";
import { Clock, Users, TrendingUp, ShieldCheck, Handshake, DollarSign, Target, Settings, Network, Globe, Award, Calendar, FileCheck, CheckCircle2, MessageCircle, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/pourquoi_menua_hero.png"
            alt="Pourquoi Menua"
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
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Notre valeur ajoutée", "Our added value")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Pourquoi\nMenua Consulting ?", "Why\nMenua Consulting?").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  MENUA CONSULTING {t(
                    "accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants.",
                    "supports organizations facing demanding operational execution challenges."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BÉNÉFICES ── */}
      <section id="nos-benefices" className="w-full bg-[#FDFDFD] py-16 lg:py-20 relative z-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.8rem] font-bold uppercase tracking-widest mb-16 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("Bénéfices", "Benefits")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 w-full max-w-5xl">
            {[
              { icon: Clock, title: t("Gain de temps", "Time saving") },
              { icon: Users, title: t("Réduction des\ncharges internes", "Reduction of\ninternal costs") },
              { icon: Settings, title: t("Flexibilité des\nressources", "Flexibility of\nresources") },
              { icon: TrendingUp, title: t("Productivité accrue", "Increased productivity") },
              { icon: ShieldCheck, title: t("Fiabilité des\nopérations", "Reliability of\noperations") },
              { icon: Handshake, title: t("Fidélisation de\nla clientèle", "Customer\nloyalty") },
              { icon: DollarSign, title: t("Chiffre d'affaires\nsoutenu", "Sustained\nturnover") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#223930] flex items-center justify-center shrink-0 shadow-md">
                  <item.icon className="text-[#E0D6C8]" size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#223930] text-[1rem] font-semibold leading-tight">
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFÉRENCIATION ── */}
      <section id="notre-differenciation" className="w-full bg-[#F9F7F3] py-16 lg:py-20 border-y border-[#E0D6C8]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.8rem] font-bold uppercase tracking-widest mb-16 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("Différenciation", "Differentiation")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 w-full lg:divide-x divide-[#E0D6C8]/60">
            {[
              { icon: Target, title: t("Spécialisation\nback et middle\noffice", "Back and middle\noffice\nspecialization") },
              { icon: Settings, title: t("Approche 100%\nopérationnelle", "100% operational\napproach") },
              { icon: Network, title: t("Intégration\ncomplète à votre\norganisation", "Complete integration\ninto your\norganization") },
              { icon: Globe, title: t("Intervention\nbilingue\nfrançais / anglais", "Bilingual\nintervention\nFrench / English") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center px-6">
                <div className="text-[#d5a864] mb-6">
                  <item.icon size={48} strokeWidth={1} />
                </div>
                <h3 className="text-[#223930] text-[1.05rem] font-medium leading-tight">
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section id="nos-engagements" className="w-full bg-[#FDFDFD] py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <h2 className="text-[#223930] text-[1.8rem] font-bold uppercase tracking-widest mb-2 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("Engagements", "Commitments")}
          </h2>
          <div className="w-12 h-[2px] bg-[#d5a864] mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              { icon: Award, title: t("Qualité des\nlivrables", "Quality of\ndeliverables") },
              { icon: Calendar, title: t("Respect des\ndélais", "Respect of\ndeadlines") },
              { icon: FileCheck, title: t("Traçabilité des\nopérations", "Traceability of\noperations") },
              { icon: CheckCircle2, title: t("Contrôle à\nquatre yeux", "Four-eyes\ncontrol") },
              { icon: MessageCircle, title: t("Communication\nclaire et régulière", "Clear and regular\ncommunication") },
              { icon: BookOpen, title: t("Formation continue\ndes ressources\nmobilisées", "Continuous training\nof mobilized\nresources") },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E0D6C8]/60 p-8 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-sm">
                <div className="text-[#223930] mb-5">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#223930] text-[0.95rem] font-medium leading-tight">
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
              </div>
            ))}
          </div>
          
          {/* Full width box at bottom */}
          <div className="w-full max-w-5xl mt-6">
             <div className="bg-white border border-[#E0D6C8]/60 p-8 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-sm">
                <div className="text-[#223930] mb-5">
                  <Shield size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#223930] text-[0.95rem] font-medium leading-tight max-w-[300px]">
                  {t("Respect des exigences opérationnelles, qualité et réglementaires", "Respect of operational, quality and regulatory requirements")}
                </h3>
              </div>
          </div>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
