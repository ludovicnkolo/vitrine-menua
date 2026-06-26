"use client";
import Link from "next/link";
import { ArrowRight, Zap, Calendar, Scale, Users2, Languages, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function NosSolutionsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FA] font-sans pt-24">
      {/* ── HEADER INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-8 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2B45] mb-6">
            {t("Nos solutions", "Our Solutions")}
          </h1>
          <p className="text-[#1E2A3A] text-lg max-w-3xl mx-auto leading-relaxed">
            {t(
              "MENUA CONSULTING adapte ses interventions à vos contraintes : urgence, durée, volume ou mode d'organisation. Nous proposons des dispositifs flexibles, fiables et dimensionnés à vos besoins réels.",
              "MENUA CONSULTING adapts its interventions to your constraints: urgency, duration, volume or mode of organization. We offer flexible, reliable solutions sized to your real needs."
            )}
          </p>
        </div>
      </section>

      {/* ── 3.1 URGENCE ──────────────────────────────────────────────────── */}
      <section id="urgence" className="bg-[#F8F9FA] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="text-[#C89B5E] font-serif text-8xl font-bold leading-none mb-4 opacity-30">01</div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <Zap className="text-[#4A8C7A]" size={36} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4 text-center lg:text-left">
                {t("Urgence", "Emergency")}
              </h2>
              <p className="text-[#4A8C7A] font-semibold text-sm tracking-widest uppercase">
                {t("Capacité de réaction", "Response capacity")}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[#1E2A3A] text-lg leading-relaxed mb-8">
                {t(
                  "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.",
                  "Rapid mobilization of operational resources to respond to an immediate need, absorb an activity overload and ensure the continuity of your service."
                )}
              </p>
              <h3 className="font-bold text-[#0F2B45] mb-4 text-sm tracking-widest uppercase border-b border-gray-200 pb-3">
                {t("Cas d'usage :", "Use cases:")}
              </h3>
              <ul className="space-y-4">
                {[
                  t("Surcharge d'activité ou pic de dossiers", "Activity overload or peak in files"),
                  t("Remplacement temporaire d'un collaborateur absent", "Temporary replacement of an absent employee"),
                  t("Renfort ponctuel en période de clôture ou de reporting", "Ad hoc reinforcement during closing or reporting periods"),
                  t("Traitement accéléré de dossiers en retard ou en attente", "Accelerated processing of delayed or pending files"),
                  t("Mise à disposition progressive de ressources pour sécuriser la montée en charge", "Progressive provision of resources to secure the ramp-up"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4A8C7A] shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E2A3A] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.2 DURÉE ────────────────────────────────────────────────────── */}
      <section id="duree" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="text-[#C89B5E] font-serif text-8xl font-bold leading-none mb-4 opacity-30">02</div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <Calendar className="text-[#4A8C7A]" size={36} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4 text-center lg:text-left">
                {t("Durée", "Duration")}
              </h2>
              <p className="text-[#4A8C7A] font-semibold text-sm tracking-widest uppercase">
                {t("Flexibilité contractuelle", "Contractual flexibility")}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[#1E2A3A] text-lg leading-relaxed mb-8">
                {t(
                  "MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.",
                  "MENUA CONSULTING offers flexible outsourcing solutions, adapted to the processing of a defined number of files as well as the recurring management of a larger portfolio."
                )}
              </p>
              <h3 className="font-bold text-[#0F2B45] mb-4 text-sm tracking-widest uppercase border-b border-gray-200 pb-3">
                {t("Nos dispositifs :", "Our arrangements:")}
              </h3>
              <ul className="space-y-4">
                {[
                  { label: t("Mission courte", "Short mission"), desc: t("Pour traiter un besoin identifié sur une période limitée", "To address an identified need over a limited period") },
                  { label: t("Mission longue", "Long mission"), desc: t("Pour accompagner la gestion d'un portefeuille de dossiers dans la durée", "To support the management of a portfolio of files over time") },
                  { label: t("Externalisation continue", "Continuous outsourcing"), desc: t("Pour confier durablement tout ou partie de vos activités opérationnelles", "To durably entrust all or part of your operational activities") },
                  { label: t("Intervention ponctuelle", "Ad hoc intervention"), desc: t("Sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs", "On a volume of accounting, financial, wealth or administrative files") },
                  { label: t("Ajustement du dispositif", "Arrangement adjustment"), desc: t("Selon l'évolution de la charge et des priorités du client", "According to changes in client workload and priorities") },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4A8C7A] shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E2A3A] leading-snug">
                      <strong className="text-[#0F2B45]">{item.label}</strong> : {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.3 VOLUME ───────────────────────────────────────────────────── */}
      <section id="volume" className="bg-[#F8F9FA] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="text-[#C89B5E] font-serif text-8xl font-bold leading-none mb-4 opacity-30">03</div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <Scale className="text-[#4A8C7A]" size={36} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4 text-center lg:text-left">
                {t("Volume", "Volume")}
              </h2>
              <p className="text-[#4A8C7A] font-semibold text-sm tracking-widest uppercase">
                {t("Dimensionnement d'équipe", "Team sizing")}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[#1E2A3A] text-lg leading-relaxed mb-8">
                {t(
                  "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.",
                  "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows or operations to be processed, while ensuring the continuity and security of execution."
                )}
              </p>
              <h3 className="font-bold text-[#0F2B45] mb-4 text-sm tracking-widest uppercase border-b border-gray-200 pb-3">
                {t("Nos dispositifs :", "Our arrangements:")}
              </h3>
              <ul className="space-y-4">
                {[
                  t("Une ressource dédiée sur un périmètre précis", "A dedicated resource on a precise scope"),
                  t("Un renfort ponctuel pour absorber une surcharge d'activité", "Ad hoc reinforcement to absorb an activity overload"),
                  t("Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés", "An operational team to manage a large volume or multiple simultaneous flows"),
                  t("Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client", "An evolving arrangement adjusted according to workload, priorities and client requirements"),
                  t("Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité", "An organization ensuring the continuity of processing in case of absence or variation in activity"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4A8C7A] shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E2A3A] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.4 MODE D'ORGANISATION ──────────────────────────────────────── */}
      <section id="organisation" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="text-[#C89B5E] font-serif text-8xl font-bold leading-none mb-4 opacity-30">04</div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <Users2 className="text-[#4A8C7A]" size={36} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4 text-center lg:text-left">
                {t("Mode d'organisation", "Organization mode")}
              </h2>
              <p className="text-[#4A8C7A] font-semibold text-sm tracking-widest uppercase">
                {t("Intégration & flexibilité", "Integration & flexibility")}
              </p>
            </div>
            <div className="flex-1">
              <div className="text-[#1E2A3A] text-lg leading-relaxed mb-6 space-y-4">
                <p>
                  {t(
                    "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.",
                    "MENUA CONSULTING structures its interventions according to the format best suited to your constraints: dedicated arrangement, mission-based operation or management of defined flows and processes."
                  )}
                </p>
                <p>
                  {t(
                    "Nous intégrons nos équipes à vos modes de fonctionnement existants afin de garantir une exécution fluide, traçable et conforme à vos standards internes.",
                    "We integrate our teams into your existing operating modes to guarantee smooth, traceable execution that complies with your internal standards."
                  )}
                </p>
              </div>
              <h3 className="font-bold text-[#0F2B45] mb-4 text-sm tracking-widest uppercase border-b border-gray-200 pb-3">
                {t("Modes d'intervention :", "Intervention modes:")}
              </h3>
              <ul className="space-y-4">
                {[
                  { label: t("Dispositif dédié", "Dedicated arrangement"), desc: t("Pour un service ou un périmètre clairement identifié", "For a clearly identified service or scope") },
                  { label: t("Intervention par mission", "Mission intervention"), desc: t("Pour un besoin borné dans le temps ou un projet spécifique", "For a time-bounded need or a specific project") },
                  { label: t("Prise en charge de flux ou de process récurrents", "Management of recurring flows or processes"), desc: "" },
                  { label: t("Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes", "Processing of files, subscriptions or operations according to rules defined with your teams"), desc: "" },
                  { label: t("Suivi structuré avec points de contrôle réguliers", "Structured monitoring with regular checkpoints"), desc: "" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#4A8C7A] shrink-0 mt-0.5" size={20} />
                    <span className="text-[#1E2A3A] leading-snug">
                      {item.desc ? <><strong className="text-[#0F2B45]">{item.label}</strong> : {item.desc}</> : item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 LANGUES ──────────────────────────────────────────────────── */}
      <section id="langues" className="bg-[#F8F9FA] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="text-[#C89B5E] font-serif text-8xl font-bold leading-none mb-4 opacity-30">05</div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <Languages className="text-[#4A8C7A]" size={36} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4 text-center lg:text-left">
                {t("Langues", "Languages")}
              </h2>
              <p className="text-[#4A8C7A] font-semibold text-sm tracking-widest uppercase">
                {t("FR / EN et autres", "FR / EN and others")}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[#1E2A3A] text-lg leading-relaxed mb-10">
                {t(
                  "Nous intervenons en français et en anglais. D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.",
                  "We operate in French and English. Other languages can be considered based on the specific needs of your teams."
                )}
              </p>
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-4 bg-white border-2 border-[#C89B5E] rounded-xl px-8 py-4 shadow-sm">
                  <span className="text-3xl">🇫🇷</span>
                  <div>
                    <p className="font-bold text-[#0F2B45] text-lg">Français</p>
                    <p className="text-[#3D4F64] text-sm">{t("Langue principale", "Primary language")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border-2 border-[#C89B5E] rounded-xl px-8 py-4 shadow-sm">
                  <span className="text-3xl">🇬🇧</span>
                  <div>
                    <p className="font-bold text-[#0F2B45] text-lg">English</p>
                    <p className="text-[#3D4F64] text-sm">{t("Langue secondaire", "Secondary language")}</p>
                  </div>
                </div>
              </div>
              <p className="text-[#3D4F64] italic">
                {t("Autres langues sur demande — selon les besoins spécifiques de vos équipes et de vos opérations.", "Other languages on request — according to the specific needs of your teams and operations.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F2B45] px-8 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-white mb-4">
          {t("Vous avez un besoin opérationnel ?", "Do you have an operational need?")}
        </h2>
        <p className="text-white/70 mb-10 max-w-xl mx-auto">
          {t("Présentez-nous votre situation. Nous construisons ensemble le dispositif adapté.", "Present your situation to us. We build the appropriate arrangement together.")}
        </p>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-lg"
        >
          {t("Présenter un besoin", "Submit a request")} <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
