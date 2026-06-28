"use client";
import Link from "next/link";
import { ArrowRight, Shield, Search, FileText, CheckCircle2, RotateCw, MapPin, Network, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen overflow-hidden bg-white gap-12 md:gap-20 pb-12 md:pb-20">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous_connaitre_hero.png"
            alt="Nous Connaître"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3680] from-20% via-[#1B3680]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#B8922A]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#B8922A]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#B8922A]" />
            
            <div className="relative">
              <p className="text-[#B8922A] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Vue d'ensemble du cabinet", "Firm overview")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t(
                  "L'excellence opérationnelle\nau service de vos\nback et middle offices.",
                  "Operational excellence\nserving your\nback and middle offices."
                ).split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  <strong className="text-white">MENUA CONSULTING</strong>{" "}
                  {t(
                    "est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
                    "is a firm specialized in operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
                  )}
                </p>
                <p>
                  {t(
                    "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
                    "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUITE TEXTE (Overlap layout possible) ── */}
      <section className="bg-white overflow-hidden -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto px-8 relative flex flex-col items-center justify-center">
          <div 
            className="w-full bg-[#F5F0EA] p-8 md:p-12 z-10 relative shadow-lg"
            style={{ borderRadius: "2rem 8rem 8rem 2rem" }}
          >
            <p className="text-[#3A3A3A] text-[1.05rem] leading-[1.7] font-normal space-y-4">
              <span>
                {t(
                  "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
                  "Our employees integrate into client organizations to take charge of operational execution, optimize internal costs and secure business continuity."
                )}
              </span>
              <br/><br/>
              <span>
                {t(
                  "Cette organisation permet à nos clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                  "This organization allows our clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes."
                )}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── MOSAÏQUE ── */}
      <section className="bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-[#1B3680] text-[1.3rem] leading-[1.6rem] font-bold uppercase mb-[2.25rem]"
              
            >
              {t("Découvrez notre identité", "Discover our identity")}
            </h2>
            <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] mt-4 font-normal">
              {t(
                "Découvrez ci-dessous notre identité, notre méthodologie, nos certifications et la manière dont nous intervenons.",
                "Discover below our identity, our methodology, our certifications and the way we operate."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D8DCE8]">
            {[
              { icon: FileText, title: t("Présentation du cabinet", "Firm presentation"), desc: t("Un partenaire de confiance pour vos opérations financières et réglementées.", "A trusted partner for your financial and regulated operations."), link: "/nous-connaitre/presentation-du-cabinet" },
              { icon: RotateCw, title: t("Notre approche", "Our approach"), desc: t("Une posture résolument opérationnelle et orientée résultats.", "A resolutely operational and results-oriented posture."), link: "/nous-connaitre/notre-approche" },
              { icon: Search, title: t("Notre méthodologie", "Our methodology"), desc: t("Un cadre structuré pour une exécution sans faille.", "A structured framework for flawless execution."), link: "/nous-connaitre/notre-methodologie" },
              { icon: Shield, title: t("Accréditations", "Accreditations"), desc: t("Une expertise reconnue dans des environnements réglementés.", "Recognized expertise in regulated environments."), link: "/nous-connaitre/accreditations" },
              { icon: Users, title: t("Notre équipe", "Our team"), desc: t("Une direction impliquée au plus près des opérations.", "Management involved as close as possible to operations."), link: "/nous-connaitre/notre-equipe" },
              { icon: MapPin, title: t("Nos implantations", "Our locations"), desc: t("Une capacité d'intervention en France et à l'international.", "An intervention capacity in France and internationally."), link: "/nous-connaitre/nos-implantations" },
              { icon: Network, title: t("L'interprofessionnalité", "Interprofessionalism"), desc: t("Le partenaire privilégié des experts-comptables, avocats et CGP.", "The privileged partner of accountants, lawyers and IFAs."), link: "/nous-connaitre/interprofessionnalite" },
            ].map((item, i) => (
              <Link href={item.link} key={i} className="group bg-white block">
                <div className="p-10 h-full flex flex-col gap-4 transition-all duration-200 group-hover:bg-[#F2F0ED]">
                  <div className="text-[#1C40C2]">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[#1B3680] text-[1.3rem] font-semibold"
                    
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#3A4660] text-[0.95rem] leading-[1.5] font-normal mb-6">
                    {item.desc}
                  </p>
                  <div className="mt-auto flex items-center text-[#1C40C2] text-sm font-semibold gap-2 group-hover:gap-3 transition-all">
                    {t("En savoir plus", "Learn more")} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
