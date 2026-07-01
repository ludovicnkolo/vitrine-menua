"use client";
import Link from "next/link";
import { Clock, Users, TrendingUp, ShieldCheck, Handshake, DollarSign, Target, Settings, Network, Globe, Award, Calendar, FileCheck, CheckCircle2, MessageCircle, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/pourquoi_menua_hero.png"
            alt="Pourquoi Menua"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122017] from-20% via-[#122017]/75 via-50% to-transparent to-70%" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <p className="text-[#D9B151] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.2em] uppercase mb-6">
                {t("Notre valeur ajoutée", "Our added value")}
              </p>
              <h1 className="text-white mb-8 text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] font-bold uppercase max-w-3xl tracking-tight">
                {t("Pourquoi\nMenua Consulting ?", "Why\nMenua Consulting?").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white/90 text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3">
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

      {/* ══ 1. BÉNÉFICES — Fond vert foncé, grille ══ */}
      <section id="nos-benefices" className="w-full bg-[#122017] py-12 lg:py-16 my-10 lg:my-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("01 — Valeur ajoutée", "01 — Added value")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-6">
              {t("Bénéfices", "Benefits")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
            {[
              { icon: Clock, title: t("Gain de temps", "Time saving") },
              { icon: Users, title: t("Réduction des charges internes", "Reduction of internal costs") },
              { icon: Settings, title: t("Flexibilité des ressources", "Flexibility of resources") },
              { icon: TrendingUp, title: t("Productivité accrue", "Increased productivity") },
              { icon: ShieldCheck, title: t("Fiabilité des opérations", "Reliability of operations") },
              { icon: Handshake, title: t("Fidélisation de la clientèle", "Customer loyalty") },
              { icon: DollarSign, title: t("Chiffre d'affaires soutenu", "Sustained turnover") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white/5 backdrop-blur-sm rounded-xl p-7 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#D9B151]/20 flex items-center justify-center mb-5 shrink-0">
                  <item.icon className="text-[#D9B151]" size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-white text-[0.95rem] font-bold uppercase tracking-wide leading-[1.4]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. DIFFÉRENCIATION — Fond crème ══ */}
      <section id="notre-differenciation" className="w-full bg-[#F6F3F0] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: sticky title block */}
          <div className="w-full lg:w-[38%] flex flex-col sticky top-24 self-start">
            <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("02 — Valeur ajoutée", "02 — Added value")}
            </p>
            <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
              {t("Différenciation", "Differentiation")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151]" />
          </div>
          {/* Right: grid */}
          <div className="w-full lg:w-[62%] grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Target, title: t("Spécialisation\nback et middle office", "Back and middle office\nspecialization") },
              { icon: Settings, title: t("Approche 100%\nopérationnelle", "100% operational\napproach") },
              { icon: Network, title: t("Intégration complète\nà votre organisation", "Complete integration\ninto your organization") },
              { icon: Globe, title: t("Intervention bilingue\nfrançais / anglais", "Bilingual intervention\nFrench / English") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white rounded-xl p-8 border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#8B6240] mb-6">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#122017] text-[1.05rem] font-bold uppercase tracking-wide leading-tight">
                  {item.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. ENGAGEMENTS — Fond bois/brun ══ */}
      <section id="nos-engagements" className="w-full py-12 lg:py-16 mb-10 lg:mb-16 overflow-hidden" style={{
        background: "linear-gradient(160deg, #8B6240 0%, #5A3A1E 40%, #3E2510 100%)"
      }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("03 — Valeur ajoutée", "03 — Added value")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-6">
              {t("Engagements", "Commitments")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            {[
              { icon: Award, title: t("Qualité des livrables", "Quality of deliverables") },
              { icon: Calendar, title: t("Respect des délais", "Respect of deadlines") },
              { icon: FileCheck, title: t("Traçabilité des opérations", "Traceability of operations") },
              { icon: CheckCircle2, title: t("Contrôle à quatre yeux", "Four-eyes control") },
              { icon: MessageCircle, title: t("Communication claire et régulière", "Clear and regular communication") },
              { icon: BookOpen, title: t("Formation continue des ressources mobilisées", "Continuous training of mobilized resources") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/15 hover:bg-white/20 transition-all">
                <div className="text-[#D9B151] mb-5">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-white text-[0.95rem] font-bold uppercase tracking-wide leading-[1.4]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
          
          {/* Full width box at bottom */}
          <div className="w-full max-w-5xl mx-auto mt-6">
            <div className="flex flex-col items-center text-center bg-[#122017] rounded-xl p-8 lg:p-10 border border-white/10 shadow-xl">
              <div className="text-[#D9B151] mb-4">
                <Shield size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-white text-[1.1rem] md:text-[1.2rem] font-bold uppercase tracking-wide leading-tight max-w-2xl">
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
