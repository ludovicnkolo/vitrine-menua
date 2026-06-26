"use client";
import Link from "next/link";
import { ArrowRight, Clock, TrendingDown, Zap, BarChart3, Shield, Users, CheckCircle2, Award, Target, Lock, MessageCircle, GraduationCap } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  const benefits = [
    { icon: Clock, label: t("Gain de temps", "Time savings") },
    { icon: TrendingDown, label: t("Réduction des charges internes", "Reduction of internal costs") },
    { icon: Zap, label: t("Productivité accrue", "Increased productivity") },
    { icon: BarChart3, label: t("Efficacité renforcée", "Enhanced efficiency") },
    { icon: Shield, label: t("Fiabilité des opérations", "Operational reliability") },
    { icon: Users, label: t("Fidélisation de la clientèle", "Client retention") },
    { icon: TrendingDown, label: t("Chiffre d'affaires soutenu", "Sustained revenue") },
  ];

  const differentiations = [
    t("Spécialisation back et middle office", "Back and middle office specialization"),
    t("Approche 100% opérationnelle", "100% operational approach"),
    t("Intégration à votre organisation", "Integration into your organization"),
    t("Exécution fiable et continue", "Reliable and continuous execution"),
    t("Supervision qualité des livrables", "Quality supervision of deliverables"),
    t("Intervention bilingue français / anglais", "Bilingual French / English intervention"),
  ];

  const commitments = [
    { icon: Award, label: t("Qualité des livrables", "Quality of deliverables") },
    { icon: Clock, label: t("Respect des délais", "Meeting deadlines") },
    { icon: Lock, label: t("Traçabilité des opérations", "Traceability of operations") },
    { icon: Shield, label: t("Contrôle à quatre yeux", "Four-eyes control") },
    { icon: MessageCircle, label: t("Communication claire et régulière", "Clear and regular communication") },
    { icon: GraduationCap, label: t("Formation des ressources mobilisées", "Training of mobilized resources") },
    { icon: Target, label: t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Compliance with your operational, quality and regulatory requirements") },
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FA] font-sans pt-24">
      {/* ── HEADER INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-8 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2B45] mb-6">
            {t("Pourquoi Menua Consulting ?", "Why Menua Consulting?")}
          </h1>
          <p className="text-[#1E2A3A] text-lg max-w-3xl mx-auto leading-relaxed">
            {t(
              "Parce que l'excellence opérationnelle n'est pas une option. Choisir MENUA CONSULTING, c'est confier l'exécution de vos opérations à un partenaire spécialisé, rigoureux et engagé.",
              "Because operational excellence is not an option. Choosing MENUA CONSULTING means entrusting the execution of your operations to a specialized, rigorous and committed partner."
            )}
          </p>
        </div>
      </section>

      {/* ── 4.1 NOS BÉNÉFICES ────────────────────────────────────────────── */}
      <section id="benefices" className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6 text-center">
            {t("Nos bénéfices", "Our benefits")}
          </h2>
          <p className="text-[#1E2A3A] text-center text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
            {t(
              "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires. Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle.",
              "By outsourcing your back and middle office functions with MENUA CONSULTING, you save time, improve your productivity, strengthen your reliability and sustainably support your revenue. This organization allows you to reduce your internal costs, better absorb your activity volumes and sustainably retain your clients."
            )}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#4A8C7A]/30 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-full bg-[#4A8C7A]/10 flex items-center justify-center mb-4">
                  <b.icon className="text-[#4A8C7A]" size={28} />
                </div>
                <p className="font-semibold text-[#0F2B45] text-sm leading-snug">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4.2 NOTRE DIFFÉRENCIATION ────────────────────────────────────── */}
      <section id="differenciation" className="bg-[#EDEFF2] px-8 py-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6">
              {t("Notre différenciation", "Our differentiation")}
            </h2>
            <div className="text-[#1E2A3A] text-lg leading-relaxed space-y-4 mb-8">
              <p className="font-semibold text-[#0F2B45]">
                {t(
                  "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.",
                  "Specialists in back and middle office, we don't stop at analysis: we execute."
                )}
              </p>
              <p>
                {t(
                  "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                  "Our 100% operational approach, our integration into client organizations and our ability to intervene in French and English allow us to operate in demanding, structured and internationally open environments."
                )}
              </p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h3 className="font-bold text-[#0F2B45] mb-6 text-sm tracking-widest uppercase border-b border-gray-300 pb-3">
              {t("Nos atouts différenciants :", "Our differentiating strengths:")}
            </h3>
            <ul className="space-y-4">
              {differentiations.map((item, i) => (
                <li key={i} className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <span className="w-8 h-8 rounded-full bg-[#4A8C7A]/10 flex items-center justify-center shrink-0 font-bold text-[#4A8C7A] text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[#1E2A3A] font-medium leading-snug pt-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4.3 NOS ENGAGEMENTS ──────────────────────────────────────────── */}
      <section id="engagements" className="bg-[#F8F9FA] px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6 text-center">
            {t("Nos engagements", "Our commitments")}
          </h2>
          <div className="text-[#1E2A3A] text-center text-lg max-w-4xl mx-auto mb-8 leading-relaxed">
            <p className="mb-4">
              {t(
                "MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes.",
                "MENUA CONSULTING commits to the essentials: the quality of deliverables, meeting deadlines, the traceability of operations and clear communication with your teams."
              )}
            </p>
            <p>
              {t(
                "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires.",
                "Our interventions are based on four-eyes control, structured working methods, the training of mobilized resources and compliance with your operational, quality and regulatory requirements."
              )}
            </p>
          </div>

          {/* Gold badge */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-3 border-2 border-[#C89B5E] text-[#C89B5E] bg-white px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase shadow-sm">
              <CheckCircle2 size={20} />
              {t("Contrôle à quatre yeux garanti", "Four-eyes control guaranteed")}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {commitments.map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#4A8C7A]/30 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-full bg-[#4A8C7A]/10 flex items-center justify-center mb-4">
                  <c.icon className="text-[#4A8C7A]" size={28} />
                </div>
                <p className="font-semibold text-[#0F2B45] text-sm leading-snug">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F2B45] px-8 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-white mb-4">
          {t("Prêt à nous confier vos opérations ?", "Ready to entrust us with your operations?")}
        </h2>
        <p className="text-white/70 mb-10 max-w-xl mx-auto">
          {t("Contactez-nous pour étudier votre besoin et construire ensemble le dispositif adapté.", "Contact us to study your need and build the appropriate arrangement together.")}
        </p>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-lg"
        >
          {t("Nous contacter", "Contact us")} <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
