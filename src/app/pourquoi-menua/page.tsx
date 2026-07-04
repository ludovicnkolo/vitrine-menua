"use client";
import Link from "next/link";
import { Clock, Users, TrendingUp, ShieldCheck, Handshake, DollarSign, Target, Settings, Network, Globe, Award, Calendar, FileCheck, CheckCircle2, MessageCircle, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function PourquoiMenuaPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-transparent">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/pourquoi_menua_hero.png"
            alt="Pourquoi Menua"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08] from-40% via-[#1A0E08]/75 via-65% to-transparent to-90%" />
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

      {/* ══ 1. BÉNÉFICES — Fond vert foncé, grille ══ */}
      <section id="nos-benefices" className="bg-[#E3C29E] w-full py-12 lg:py-16 my-10 lg:my-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-10">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("01 — Valeur ajoutée", "01 — Added value")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-white mb-10">
              {t("Bénéfices", "Benefits")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <div className="text-white text-[0.95rem] text-center max-w-2xl leading-[1.8] space-y-4">
              <p>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
            {[
              { icon: Clock, title: t("Gain de temps", "Time saving") },
              { icon: Users, title: t("Réduction des charges internes", "Reduction of internal costs") },
              { icon: TrendingUp, title: t("Productivité accrue", "Increased productivity") },
              { icon: Target, title: t("Efficacité renforcée", "Enhanced efficiency") },
              { icon: ShieldCheck, title: t("Fiabilité des opérations", "Reliability of operations") },
              { icon: Handshake, title: t("Fidélisation de la clientèle", "Customer loyalty") },
              { icon: DollarSign, title: t("Chiffre d'affaires soutenu", "Sustained turnover") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white/5 backdrop-blur-sm rounded-xl p-7 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#D9B151]/20 flex items-center justify-center mb-5 shrink-0">
                  <item.icon className="text-[#D9B151]" size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. DIFFÉRENCIATION — Fond crème ══ */}
      <section id="notre-differenciation" className="bg-[#C2D5C4] w-full py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-start gap-16">
          {/* Left: sticky title block */}
          <div className="w-full lg:w-[38%] flex flex-col sticky top-24 self-start">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#8B6240] mb-4">
              {t("02 — Valeur ajoutée", "02 — Added value")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#122017] mb-10">
              {t("Différenciation", "Differentiation")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <div className="text-[#122017]/70 text-[0.9rem] leading-[1.7] space-y-4">
              <p>
                {t(
                  "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.",
                  "As back and middle office specialists, we don't stop at analysis: we execute."
                )}
              </p>
              <p>
                {t(
                  "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international.",
                  "Our 100% operational approach, our integration into client organizations and our ability to intervene in both French and English allow us to operate in demanding, structured and internationally open environments."
                )}
              </p>
            </div>
          </div>
          {/* Right: grid */}
          <div className="w-full lg:w-[62%] grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Target, title: t("Spécialisation back et middle office", "Back and middle office specialization") },
              { icon: Settings, title: t("Approche 100% opérationnelle", "100% operational approach") },
              { icon: Network, title: t("Intégration à votre organisation", "Integration into your organization") },
              { icon: FileCheck, title: t("Exécution fiable et continue", "Reliable and continuous execution") },
              { icon: ShieldCheck, title: t("Supervision qualité des livrables", "Quality supervision of deliverables") },
              { icon: Globe, title: t("Intervention bilingue français / anglais", "Bilingual intervention French / English") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white rounded-xl p-8 border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#8B6240] mb-6">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#122017] leading-tight">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. ENGAGEMENTS — Fond bois/brun ══ */}
      <section id="nos-engagements" className="bg-[#FDFBF7] w-full py-12 lg:py-16 mb-10 lg:mb-16 overflow-hidden" style={{ background: "linear-gradient(160deg, #8B6240 0%, #5A3A1E 40%, #3E2510 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-10">
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#D9B151] mb-4">
              {t("03 — Valeur ajoutée", "03 — Added value")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-white mb-10">
              {t("Engagements", "Commitments")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
            <div className="text-white text-[0.95rem] text-center max-w-2xl leading-[1.8] space-y-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            {[
              { icon: Award, title: t("Qualité des livrables", "Quality of deliverables") },
              { icon: Calendar, title: t("Respect des délais", "Respect of deadlines") },
              { icon: FileCheck, title: t("Traçabilité des opérations", "Traceability of operations") },
              { icon: CheckCircle2, title: t("Contrôle à quatre yeux", "Four-eyes control") },
              { icon: MessageCircle, title: t("Communication claire et régulière", "Clear and regular communication") },
              { icon: BookOpen, title: t("Formation des ressources mobilisées", "Training of mobilized resources") },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/15 hover:bg-white/20 transition-all">
                <div className="text-[#D9B151] mb-5">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
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
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
                {t("Respect de vos exigences opérationnelles, qualité et réglementaires", "Respect of your operational, quality and regulatory requirements")}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
