"use client";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function ActualitesPage() {
  const { t } = useLanguage();

  const featuredArticles = [
    {
      date: "Juin 2025",
      category: t("Conformité", "Compliance"),
      title: t(
        "KYC & LCB-FT : les nouvelles obligations réglementaires à anticiper",
        "KYC & AML-CFT: new regulatory obligations to anticipate"
      ),
      excerpt: t(
        "L'évolution constante du cadre réglementaire impose aux acteurs financiers une vigilance accrue sur les processus d'entrée en relation et de revue périodique. Tour d'horizon des changements à intégrer.",
        "The constant evolution of the regulatory framework requires financial players to be increasingly vigilant about onboarding and periodic review processes. An overview of the changes to integrate."
      ),
      tag: "LCB-FT"
    },
    {
      date: "Mai 2025",
      category: t("Externalisation", "Outsourcing"),
      title: t(
        "Externalisation back office : comment sécuriser la continuité opérationnelle ?",
        "Back office outsourcing: how to secure operational continuity?"
      ),
      excerpt: t(
        "L'externalisation est un levier puissant, à condition de bien structurer le dispositif de suivi et de contrôle. Retour sur les bonnes pratiques pour garantir fiabilité et traçabilité des opérations.",
        "Outsourcing is a powerful lever, provided the monitoring and control arrangement is well structured. A look back at best practices to guarantee the reliability and traceability of operations."
      ),
      tag: t("Opérations", "Operations")
    },
    {
      date: "Avril 2025",
      category: t("Finance", "Finance"),
      title: t(
        "Reporting financier : les erreurs les plus fréquentes et comment les éviter",
        "Financial reporting: the most common mistakes and how to avoid them"
      ),
      excerpt: t(
        "Un reporting fiable est la base d'une prise de décision éclairée. Nous passons en revue les erreurs récurrentes observées dans les processus de reporting et les solutions pour y remédier.",
        "Reliable reporting is the basis for informed decision-making. We review recurring errors observed in reporting processes and the solutions to remedy them."
      ),
      tag: t("Reporting", "Reporting")
    }
  ];

  const financialArticles = [
    {
      date: "Juin 2025",
      category: "Réglementation",
      title: t("DORA : ce que les établissements financiers doivent savoir", "DORA: what financial institutions need to know"),
      tags: ["DORA", t("Conformité", "Compliance")]
    },
    {
      date: "Mai 2025",
      category: "Finance",
      title: t("Clôtures comptables : anticiper les pics d'activité", "Accounting closings: anticipating peaks in activity"),
      tags: [t("Comptabilité", "Accounting"), t("Gestion", "Management")]
    },
    {
      date: "Mai 2025",
      category: "Patrimoine",
      title: t("CGP : enjeux administratifs du devoir de conseil", "IFA: administrative challenges of the duty of advice"),
      tags: ["CGP", t("Patrimoine", "Wealth")]
    },
    {
      date: "Avril 2025",
      category: "Conformité",
      title: t("Remédiation KYC : stratégies et bonnes pratiques", "KYC remediation: strategies and best practices"),
      tags: ["KYC", "AML"]
    },
    {
      date: "Mars 2025",
      category: "Data",
      title: t("Data quality en finance : enjeux et solutions", "Data quality in finance: challenges and solutions"),
      tags: ["Data", t("Finance", "Finance")]
    },
    {
      date: "Mars 2025",
      category: "Gestion",
      title: t("Middle office : un périmètre souvent sous-estimé", "Middle office: an often underestimated scope"),
      tags: ["Middle office", t("Opérations", "Operations")]
    }
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F8F9FA] font-sans pt-24">
      {/* ── HEADER INTRO ─────────────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-8 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2B45] mb-6">
            {t("Actualités", "News")}
          </h1>
          <p className="text-[#1E2A3A] text-lg max-w-2xl mx-auto leading-relaxed">
            {t(
              "Analyses, décryptages et prises de parole de MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels.",
              "Analysis, explanations and commentary from MENUA CONSULTING on operational, regulatory and sectoral issues."
            )}
          </p>
        </div>
      </section>

      {/* ── 5.1 À LA UNE ─────────────────────────────────────────────────── */}
      <section id="a-la-une" className="bg-[#F8F9FA] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-12">
            {t("À la une", "Featured")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="aspect-video bg-gradient-to-br from-[#0F2B45] to-[#1A2D4A] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[url('/nous-rejoindre-hero.jpg')] bg-cover bg-center"></div>
                  <span className="relative z-10 text-[#C89B5E] font-serif text-4xl font-bold opacity-40 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#4A8C7A] text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                      {article.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[#4A8C7A] text-xs font-semibold mb-3">
                    <CalendarDays size={14} />
                    {article.date}
                    <span className="text-gray-300 mx-1">•</span>
                    <span className="text-gray-500">{article.category}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F2B45] mb-3 leading-snug flex-1">
                    {article.title}
                  </h3>
                  <p className="text-[#3D4F64] text-sm leading-relaxed mb-5">
                    {article.excerpt}
                  </p>
                  <Link
                    href="/nous-contacter"
                    className="inline-flex items-center gap-2 text-[#4A8C7A] hover:text-[#2D7A5A] font-semibold text-sm transition-colors"
                  >
                    {t("Lire l'article", "Read the article")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5.2 ACTUALITÉS FINANCIÈRES & RÉGLEMENTAIRES ──────────────────── */}
      <section id="actualites-financieres" className="bg-[#EDEFF2] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-4">
            {t("Actualités financières & réglementaires", "Financial & regulatory news")}
          </h2>
          <p className="text-[#3D4F64] text-lg mb-12 max-w-3xl">
            {t(
              "Analyse et décryptage des évolutions susceptibles d'avoir un impact sur vos organisations : finance, comptabilité, gestion de patrimoine, conformité, réglementation et pratiques opérationnelles.",
              "Analysis and explanation of developments likely to impact your organizations: finance, accounting, wealth management, compliance, regulation and operational practices."
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialArticles.map((article, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="text-[#4A8C7A]" size={14} />
                  <span className="text-[#4A8C7A] text-xs font-semibold">{article.date}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span className="text-gray-500 text-xs">{article.category}</span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#0F2B45] leading-snug mb-4 flex-1">
                  {article.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                  {article.tags.map((tag, j) => (
                    <span key={j} className="bg-[#4A8C7A]/10 text-[#4A8C7A] text-xs font-semibold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5.3 NOS PUBLICATIONS ─────────────────────────────────────────── */}
      <section id="nos-publications" className="bg-[#F8F9FA] px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#0F2B45] mb-6">
            {t("Nos publications", "Our publications")}
          </h2>
          <p className="text-[#1E2A3A] text-lg max-w-3xl mb-12 leading-relaxed">
            {t(
              "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels.",
              "Find the commentary, analyses and content published by MENUA CONSULTING on operational, regulatory and sectoral issues."
            )}
          </p>
          <div className="bg-[#0F2B45] rounded-2xl p-12 text-center shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <LinkedInIcon />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              {t("Suivez nos publications sur LinkedIn", "Follow our publications on LinkedIn")}
            </h3>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              {t(
                "Analyses de marché, décryptages réglementaires, conseils opérationnels et actualités du secteur — retrouvez toutes nos publications sur notre page LinkedIn.",
                "Market analysis, regulatory explanations, operational advice and industry news — find all our publications on our LinkedIn page."
              )}
            </p>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-[#0F2B45] px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-lg"
            >
              <LinkedInIcon />
              {t("Voir notre page LinkedIn", "View our LinkedIn page")}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#EDEFF2] px-8 py-16 text-center border-t border-gray-200">
        <h2 className="font-serif text-2xl font-bold text-[#0F2B45] mb-4">
          {t("Un sujet vous intéresse ? Échangeons.", "A topic interests you? Let's talk.")}
        </h2>
        <Link
          href="/nous-contacter"
          className="inline-flex items-center gap-3 bg-[#4A8C7A] hover:bg-[#2D7A5A] text-white px-8 py-4 rounded text-sm font-bold tracking-wider uppercase transition-all shadow-md"
        >
          {t("Nous contacter", "Contact us")} <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
