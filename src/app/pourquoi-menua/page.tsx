"use client";
import Link from "next/link";
import { Clock, Users, TrendingUp, ShieldCheck, Handshake, DollarSign, Target, Settings, Network, Globe, Award, Calendar, FileCheck, CheckCircle2, MessageCircle, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/pourquoi_menua_hero.png"
            alt="Pourquoi Menua"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/90 to-[#1A0E08]/70" />
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
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[2.5rem] font-bold leading-[1.1] text-white mb-2">
                {t("Pourquoi nous choisir comme", "Why choose us as an")}
              </h1>
              <h2 className="text-[#D9B151] italic text-3xl md:text-4xl lg:text-[1.9rem] font-bold leading-[1.1] mb-8">
                {t("partenaire opérationnel ?", "operational partner?")}
              </h2>
              <div className="text-white text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-2xl font-normal space-y-3" style={{ color: 'white' }}>
                <p>
                  {t(
                    "Parce que nous transformons l'externalisation en un levier de performance, de fiabilité et de sérénité pour vos équipes.",
                    "Because we transform outsourcing into a lever of performance, reliability and peace of mind for your teams."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 1. BÉNÉFICES — Layout as "Risques & Conformité" ══ */}
      <section id="nos-benefices" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-[#e4dcf7] w-full flex flex-col rounded-3xl shadow-lg border border-black/5">
          {/* Top Banner */}
          <div className="w-full border-b border-[#E0D6C8]/50">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <p className="font-serif text-xl lg:text-2xl font-bold text-[#D9B151] mb-1">
                  {t("01 — Valeur ajoutée", "01 — Added value")}
                </p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#122017] mb-4">
                  {t("Bénéfices", "Benefits")}
                </h2>
                <p className="text-[#4A4E5A] text-[0.95rem] leading-[1.6]">
                  {t(
                    "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité et renforcez votre fiabilité.",
                    "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity and strengthen your reliability."
                  )}
                </p>
              </div>
              {/* Right Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/office-lounge.jpg"
                  alt="Bénéfices"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="w-full pt-20 pb-14 px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Paragraph */}
              <div className="w-full md:w-[35%] text-[#122017]/80 text-[0.95rem] leading-[1.8] font-medium">
                <p className="mb-4">
                  {t(
                    "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires.",
                    "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity, strengthen your reliability and sustainably support your turnover."
                  )}
                </p>
                <p>
                  {t(
                    "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle.",
                    "This organization allows you to reduce your internal costs, better absorb your business volumes and sustainably build customer loyalty."
                  )}
                </p>
              </div>

              {/* Right List */}
              <div className="w-full md:w-[65%] border-t md:border-t-0 md:border-l border-[#D9B151] pt-12 md:pt-0 md:pl-12 lg:pl-16">
                <h3 className="text-[#8B6240] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                  {t("Vos avantages", "Your advantages")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {[
                    t("Gain de temps", "Time saving"),
                    t("Réduction des charges internes", "Reduction of internal costs"),
                    t("Productivité accrue", "Increased productivity"),
                    t("Efficacité renforcée", "Enhanced efficiency"),
                    t("Fiabilité des opérations", "Reliability of operations"),
                    t("Fidélisation de la clientèle", "Customer loyalty"),
                    t("Chiffre d'affaires soutenu", "Sustained turnover"),
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-[#122017]/80 text-[0.85rem] leading-[1.5]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. DIFFÉRENCIATION — Layout as "Risques & Conformité" (Image Left) ══ */}
      <section id="notre-differenciation" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="bg-[#8e8478] w-full flex flex-col rounded-3xl shadow-lg border border-black/5">
          {/* Top Banner */}
          <div className="w-full border-b border-[#E0D6C8]/30">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                <img
                  src="/meeting.jpg"
                  alt="Différenciation"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
              {/* Right Box (Title & Icon) (order 1 on mobile, order 2 on desktop) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-1 md:order-2">
                <p className="font-serif text-xl lg:text-2xl font-bold text-[#D9B151] mb-1">
                  {t("02 — Valeur ajoutée", "02 — Added value")}
                </p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-4">
                  {t("Différenciation", "Differentiation")}
                </h2>
                <p className="text-white/85 text-[0.95rem] leading-[1.6]">
                  {t(
                    "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.",
                    "As back and middle office specialists, we don't stop at analysis: we execute."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="w-full pt-20 pb-14 px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Paragraph */}
              <div className="w-full md:w-[35%] text-white/90 text-[0.95rem] leading-[1.8] font-medium">
                <p>
                  {t(
                    "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                    "Our 100% operational approach, our integration into client organizations and our ability to intervene in both French and English allow us to operate in demanding, structured and internationally open environments."
                  )}
                </p>
              </div>

              {/* Right List */}
              <div className="w-full md:w-[65%] border-t md:border-t-0 md:border-l border-[#D9B151] pt-12 md:pt-0 md:pl-12 lg:pl-16">
                <h3 className="text-[#D9B151] text-[0.85rem] font-bold tracking-[0.15em] uppercase mb-10">
                  {t("Nos points forts", "Our strengths")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {[
                    t("Spécialisation back et middle office", "Back and middle office specialization"),
                    t("Approche 100% opérationnelle", "100% operational approach"),
                    t("Intégration à votre organisation", "Integration into your organization"),
                    t("Exécution fiable et continue", "Reliable and continuous execution"),
                    t("Supervision qualité des livrables", "Quality supervision of deliverables"),
                    t("Intervention bilingue français / anglais", "Bilingual intervention French / English"),
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <svg className="w-4 h-4 text-[#D9B151] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-white/85 text-[0.85rem] leading-[1.5]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. ENGAGEMENTS — compact, sans icônes ══ */}
      <section id="nos-engagements" className="mt-12 bg-[#e4dcf7] w-full py-10">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          
          <p className="font-serif text-xl md:text-2xl font-bold text-[#D9B151] mb-3 text-center">
            {t("03 — Valeur ajoutée", "03 — Added value")}
          </p>
          <h2 className="text-[#1A0E08] text-2xl lg:text-[1.8rem] font-bold text-center mb-4">
            {t("Engagements", "Commitments")}
          </h2>
          <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />

          <div className="text-[#1A0E08]/80 text-[0.95rem] text-center max-w-2xl leading-[1.8] space-y-3 mb-10">
            <p>
              MENUA CONSULTING {t(
                "s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                "commits to the essentials: quality of deliverables, respect of deadlines, traceability of operations and clear communication with your teams."
              )}
            </p>
            <p>
              {t(
                "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                "Our interventions are based on a four-eyes control, structured working methods, training of mobilized resources and respect for your operational, quality and regulatory requirements."
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-8">
            {[
              t("Qualité des livrables", "Quality of deliverables"),
              t("Respect des délais", "Respect of deadlines"),
              t("Traçabilité des opérations", "Traceability of operations"),
              t("Contrôle à quatre yeux", "Four-eyes control"),
              t("Communication claire et régulière", "Clear and regular communication"),
              t("Formation des ressources mobilisées", "Training of mobilized resources"),
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center text-center bg-white/40 border border-white/50 rounded-xl px-4 py-4 hover:shadow-md transition-all">
                <span className="text-[#1A0E08] text-[0.9rem] font-semibold leading-[1.3]">{item}</span>
              </div>
            ))}
          </div>

          <p className="font-serif text-xl md:text-2xl font-bold text-[#1A0E08] text-center max-w-2xl">
            {t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Respect of your operational, quality and regulatory requirements")}
          </p>

        </div>
      </section>

      <CallToAction />
    </main>
  );
}
