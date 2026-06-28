"use client";
import Link from "next/link";
import { ArrowRight, Shield, Search, FileText, CheckCircle2, RotateCw, MapPin, Network, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FAFBFC] font-sans">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img src="/nous_connaitre_hero.png" alt="Nous Connaître" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1B3680]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-8 text-white mt-8">
          <p className="text-[#DAF0F7] text-xs font-bold tracking-widest uppercase mb-6">
            {t("Vue d'ensemble du cabinet", "Firm overview")}
          </p>
          <h1
            className="text-white mb-[2.25rem] text-[2.5rem] leading-[2.5rem] font-bold uppercase"
            
          >
            {t(
              "L'excellence opérationnelle au service de vos back et middle offices.",
              "Operational excellence serving your back and middle offices."
            )}
          </h1>
          <div className="text-white/90 text-[0.95rem] leading-[1.5] max-w-3xl mx-auto space-y-6 font-normal">
            <p>
              <strong className="text-white">MENUA CONSULTING</strong>{" "}
              {t(
                "est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
                "is a firm specialized in operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
              )}
            </p>
            <p>
              {t(
                "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité. Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
                "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability. Our employees integrate into client organizations to take charge of operational execution, optimize internal costs and secure business continuity."
              )}
            </p>
            <p>
              {t(
                "Cette organisation permet à nos clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                "This organization allows our clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── MOSAÏQUE ── */}
      <section className="bg-white px-8 py-24 border-t border-[#D8DCE8]">
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
