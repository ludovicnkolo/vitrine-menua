"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Search, ShieldCheck, BarChart2, Users, CheckCircle, Network, UserCheck, Settings, ArrowRight } from "lucide-react";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-[50vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/office-lounge.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/80"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4rem] leading-tight mb-8 font-bold">
              {t("Nous connaître", "About us")}
            </h1>
            <p className="animate-fade-in-up stagger-2 text-[1.2rem] lg:text-[1.4rem] text-[#e5e9f0] leading-relaxed mb-6 font-light">
              {t(
                "MENUA CONSULTING accompagne les entreprises dans l’externalisation opérationnelle de fonctions back et middle office.",
                "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2.2 PRÉSENTATION DU CABINET (Layout 4 - Les belles rencontres...) ── */}
      <section className="relative w-full bg-[#e8e1d7] pt-24 pb-20 overflow-hidden">
        <div className="laplace-container relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            {/* Text on the Left */}
            <div className="w-full lg:w-1/2 pt-10">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-6 font-bold uppercase tracking-wider">
                {t("MENUA CONSULTING", "MENUA CONSULTING")}
              </h2>
              <div className="w-16 h-[1px] bg-[#141824] mb-8" />
              <p className="text-[#141824] text-[1.1rem] font-medium leading-relaxed mb-8">
                {t(
                  "Cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
                  "Firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
                )}
              </p>
              <div className="space-y-4 text-[#141824]/80 text-[1rem] font-light leading-relaxed">
                <p>
                  {t(
                    "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d’exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
                    "We provide companies, firms and financial players with dedicated operational teams, capable of executing demanding missions with rigor, continuity and reliability."
                  )}
                </p>
                <p>
                  {t(
                    "Nos collaborateurs s’intègrent aux organisations clientes afin de prendre en charge l’exécution opérationnelle, d’optimiser les charges internes et de sécuriser la continuité des opérations.",
                    "Our employees integrate into client organizations to take charge of operational execution, optimize internal costs and secure business continuity."
                  )}
                </p>
              </div>
            </div>
            
            {/* Image on the Right (Floating style) */}
            <div className="w-full lg:w-1/2 relative lg:-mt-12">
              <div className="shadow-xl">
                <img src="/preCabinet.png" alt="Cabinet" className="w-full h-[350px] md:h-[450px] object-cover" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
              </div>
            </div>
          </div>

          {/* Multi-column list style (Layout 5 style) for "Notre approche" */}
          <div className="mt-24 text-center">
            <p className="text-[#141824] font-bold text-[1.1rem] mb-12">
              {t("Notre approche repose sur trois piliers :", "Our approach is based on three pillars:")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-[#141824] font-medium uppercase tracking-widest text-[0.85rem]">
              <div className="flex flex-col items-center gap-4">
                <Network size={32} className="text-[#141824]/50" />
                <span>{t("Continuité opérationnelle", "Operational continuity")}</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <ShieldCheck size={32} className="text-[#141824]/50" />
                <span>{t("Traçabilité des actions", "Traceability of actions")}</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <CheckCircle size={32} className="text-[#141824]/50" />
                <span>{t("Fiabilité des livrables", "Reliability of deliverables")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.4 NOTRE MÉTHODOLOGIE (White Section) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-[#141824] text-[2rem] font-bold mb-6">{t("Notre méthodologie", "Our methodology")}</h2>
            <div className="w-16 h-[1px] bg-[#141824] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: t("Découverte", "Discovery"),
                icon: Search,
                desc: t("Analyse de votre organisation, processus et contraintes pour définir le périmètre d’intervention.", "Analysis of your organization, processes and constraints to define the scope of intervention.")
              },
              {
                title: t("Vérifications préalables", "Preliminary checks"),
                icon: UserCheck,
                desc: t("Vérification de l’identité juridique et cohérence opérationnelle du partenaire.", "Verification of the legal identity and operational consistency of the partner.")
              },
              {
                title: t("Analyse", "Analysis"),
                icon: BarChart2,
                desc: t("Construction d’une proposition adaptée à vos besoins (profils, organisation, livrables).", "Construction of a proposal adapted to your needs (profiles, organization, deliverables).")
              },
              {
                title: t("Mise en œuvre", "Implementation"),
                icon: Settings,
                desc: t("Déploiement des équipes et intégration aux outils et standards de votre organisation.", "Deployment of teams and integration into your organization's tools and standards.")
              },
              {
                title: t("Suivi dans la durée", "Long-term monitoring"),
                icon: ShieldCheck,
                desc: t("Pilotage continu de la mission, ajustements et contrôle qualité des livrables.", "Continuous steering of the mission, adjustments and quality control of deliverables.")
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-[#e8e1d7] p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                <step.icon className="text-[#141824] mb-6" size={32} strokeWidth={1} />
                <h4 className="text-[1.1rem] font-bold text-[#141824] mb-4 min-h-[3rem]">{step.title}</h4>
                <p className="text-[#6e7891] text-[0.95rem] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2.5 ACCRÉDITATIONS ET NOTRE ÉQUIPE (Layout 2 - Le groupe Crystal célébrait...) ── */}
      <section className="relative w-full bg-[#f5f7fa] py-32 flex justify-center">
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px]">
          {/* Beige block with list (Left) */}
          <div className="w-full lg:w-1/2 bg-[#e8e1d7] p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-[1.6rem] md:text-[2rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
              {t("ACCRÉDITATIONS, CERTIFICATIONS ET CADRE D’INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS AND INTERVENTION FRAMEWORK")}
            </h2>
            <div className="w-16 h-[1px] bg-[#141824] mb-10" />
            
            <ul className="space-y-4 text-[#141824] text-[1.05rem] font-medium">
              <li className="flex items-start gap-4">
                <ArrowRight size={18} className="shrink-0 mt-1" />
                <span className="font-light">{t("Environnements soumis à des exigences réglementaires élevées", "Environments subject to high regulatory requirements")}</span>
              </li>
              <li className="flex items-start gap-4">
                <ArrowRight size={18} className="shrink-0 mt-1" />
                <span className="font-light">{t("Certification AMF et Gestion des Risques", "AMF certification and Risk Management")}</span>
              </li>
              <li className="flex items-start gap-4">
                <ArrowRight size={18} className="shrink-0 mt-1" />
                <span className="font-light">{t("Coordination avec les équipes habilitées des clients", "Coordination with clients' authorized teams")}</span>
              </li>
              <li className="flex items-start gap-4">
                <ArrowRight size={18} className="shrink-0 mt-1" />
                <span className="font-light">{t("Intégration aux cadres d’agrément et de supervision", "Integration into approval and supervision frameworks")}</span>
              </li>
              <li className="flex items-start gap-4">
                <ArrowRight size={18} className="shrink-0 mt-1" />
                <span className="font-light">{t("Garantie de la conformité et de la sécurité des processus", "Guarantee of compliance and process security")}</span>
              </li>
            </ul>

            <div className="mt-16 flex justify-end">
              <div className="text-right">
                <p className="text-[#141824] uppercase tracking-widest text-[0.7rem] font-bold mb-4">
                  {t("PLUS D'INFORMATIONS SUR NOTRE ÉQUIPE", "MORE INFORMATION ABOUT OUR TEAM")}
                </p>
                <a href="#equipe" className="inline-flex w-10 h-10 rounded-full border border-[#141824] items-center justify-center hover:bg-[#141824] hover:text-white transition-colors">
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Image (Right) */}
          <div className="w-full lg:w-1/2 h-[500px] lg:h-auto">
             <img src="/certification.jpg" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE DETAILS ── */}
      <section id="equipe" className="relative w-full bg-[#141824] section-padding text-[#e8e1d7] scroll-mt-20">
        <div className="laplace-container max-w-4xl mx-auto text-center">
          <Users size={48} className="text-[#e8e1d7] mx-auto mb-8 opacity-80" />
          <h2 className="mb-4 text-white text-[2rem] font-bold">{t("Notre équipe", "Our team")}</h2>
          <p className="text-[#e8e1d7] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
            {t("Une direction impliquée au plus près des opérations", "Management closely involved in operations")}
          </p>
          <div className="w-16 h-[1px] bg-[#e8e1d7] mx-auto mb-10" />
          
          <div className="bg-white/5 p-12 border border-white/10 text-left">
            <h3 className="text-[1.6rem] font-bold mb-4 text-white">La dirigeante</h3>
            <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
              {t(
                "Rosette Fouelefack est directrice générale de MENUA CONSULTING.",
                "Rosette Fouelefack is the General Manager of MENUA CONSULTING."
              )}
            </p>
            <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
              {t(
                "Forte d’une expérience confirmée dans les domaines du back-office, du middle-office, de la conformité et de la gestion de patrimoine, elle a développé une expertise pointue de l’exécution opérationnelle en environnement réglementé.",
                "With confirmed experience in the fields of back-office, middle-office, compliance and wealth management, she has developed in-depth expertise in operational execution in a regulated environment."
              )}
            </p>
            <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
              {t(
                "La dirigeante est personnellement impliquée dans chaque mission : de la phase d’audit et de définition des besoins jusqu’au déploiement et à la supervision des équipes.",
                "The director is personally involved in each mission: from the audit phase and defining needs to deployment and team supervision."
              )}
            </p>
            <p className="text-[#e8e1d7] font-bold">
              {t(
                "Cet engagement garantit aux clients un niveau de qualité constant, une réactivité maximale et une adaptation permanente du dispositif à leurs exigences.",
                "This commitment guarantees clients a constant level of quality, maximum responsiveness and permanent adaptation of the system to their requirements."
              )}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
