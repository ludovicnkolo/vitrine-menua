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
            src="/pourquoi.png"
            alt="Pourquoi Menua"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#304239]/90 to-[#304239]/70" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-white" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-white" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-white" />
            <div className="relative">
              <h1 className="h1-hero mb-8">
                <span className="block">{t("Notre valeur ajoutée", "Our added value")}</span>
                <span className="block mt-2">{t("Pourquoi nous choisir comme", "Why choose us as an")}</span>
                <span className="block mt-2">{t("partenaire opérationnel ?", "operational partner?")}</span>
              </h1>
              <div className="mb-8 max-w-2xl">
                <p className="p-1">
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
        <div className="relative w-full flex flex-col rounded-3xl">
          <div className="absolute inset-y-0 left-0 w-full lg:w-[85%] bg-[#CFC9C6] z-0 rounded-3xl shadow-lg border border-black/5"></div>
          {/* Top Banner */}
          <div className="relative z-10 w-full border-b border-[#E0D6C8]/50">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-[#122017]" />
                  <h2 className="h2-surtitre text-[#122017]">
                    {t("Bénéfices", "Benefits")}
                  </h2>
                </div>
                <p className="text-[#4A4E5A] text-[0.95rem] leading-[1.6]">
                  {t(
                    "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité et renforcez votre fiabilité.",
                    "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity and strengthen your reliability."
                  )}
                </p>
              </div>
              {/* Right Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl order-first md:order-none">
                <img
                  src="/benefice.png"
                  alt="Bénéfices"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 w-full py-8 px-8 lg:pl-12 lg:pr-[16%]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {[
                t("Gain de temps", "Time saving"),
                t("Réduction des charges internes", "Reduction of internal costs"),
                t("Productivité accrue", "Increased productivity"),
                t("Efficacité renforcée", "Enhanced efficiency"),
                t("Fiabilité des opérations", "Reliability of operations"),
                t("Fidélisation de la clientèle", "Customer loyalty"),
                t("Chiffre d'affaires soutenu", "Sustained turnover"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#8B6240] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h4 className="h4-titre text-[#122017]">{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. DIFFÉRENCIATION — Layout as "Risques & Conformité" (Image Left) ══ */}
      <section id="notre-differenciation" className="mt-12 w-full max-w-[1100px] mx-auto px-6 lg:px-10 pt-10">
        <div className="relative w-full flex flex-col rounded-3xl">
          <div className="absolute inset-y-0 right-0 w-full lg:w-[85%] bg-[#8e8478] z-0 rounded-3xl shadow-lg border border-black/5"></div>
          {/* Top Banner */}
          <div className="relative z-10 w-full border-b border-[#E0D6C8]/30">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Image — negative mt to create upward offset */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[420px] -mt-10 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/difference.png"
                  alt="Différenciation"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
                />
              </div>
              {/* Right Box (Title & Icon) */}
              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-[2px] bg-white" />
                  <h2 className="h2-surtitre text-white">
                    {t("Différenciation", "Differentiation")}
                  </h2>
                </div>
                <h3 className="h3-section text-white">
                  {t(
                    "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.",
                    "As back and middle office specialists, we don't stop at analysis: we execute."
                  )}
                </h3>
              </div>
            </div>
          </div>

          {/* Bottom Details */}
          <div className="relative z-10 w-full py-8 px-8 lg:pl-[16%] lg:pr-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {[
                t("Spécialisation back et middle office", "Back and middle office specialization"),
                t("Approche 100% opérationnelle", "100% operational approach"),
                t("Intégration à votre organisation", "Integration into your organization"),
                t("Exécution fiable et continue", "Reliable and continuous execution"),
                t("Supervision qualité des livrables", "Quality supervision of deliverables"),
                t("Intervention bilingue français / anglais", "Bilingual intervention French / English"),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#122017] shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h4 className="h4-titre text-white">{item}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. ENGAGEMENTS ══ */}
      <section id="nos-engagements" className="mt-12 bg-[#CFC9C6] w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col items-start">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[2px] bg-[#304239]" />
              <h2 className="h2-surtitre text-[#304239]">
                {t("Engagements", "Commitments")}
              </h2>
            </div>
            <p className="p-2 text-[#304239]/90 mb-8 max-w-3xl">
              MENUA CONSULTING {t(
                "s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                "commits to the essentials: quality of deliverables, respect of deadlines, traceability of operations and clear communication with your teams."
              )}{" "}
              {t(
                "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                "Our interventions are based on a four-eyes control, structured working methods, training of mobilized resources and respect for your operational, quality and regulatory requirements."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-10">
              {[
                t("Qualité des livrables", "Quality of deliverables"),
                t("Respect des délais", "Respect of deadlines"),
                t("Traçabilité des opérations", "Traceability of operations"),
                t("Contrôle à quatre yeux", "Four-eyes control"),
                t("Communication claire et régulière", "Clear and regular communication"),
                t("Formation des ressources mobilisées", "Training of mobilized resources"),
                t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Respect of your operational, quality and regulatory requirements"),
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center bg-white/50 border border-black/5 rounded-xl p-5 hover:shadow-xl transition-all h-full">
                  <h4 className="h4-titre text-[#304239]">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
