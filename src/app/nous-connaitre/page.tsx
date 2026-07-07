"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Search, ShieldCheck, BarChart2, Users, CheckCircle, Network, UserCheck, Settings, ArrowRight } from "lucide-react";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Hero) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/office-lounge.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
        </div>
        <div className="laplace-container relative z-10 pt-32 pb-20 mt-16">
          <div className="max-w-4xl">
            <h1 className="animate-fade-in-up stagger-1 text-white text-[3rem] md:text-[4.5rem] leading-[1.1] mb-6 font-bold uppercase tracking-widest">
              {t("Nous connaître", "About us")}
            </h1>
            <div className="w-24 h-[2px] bg-[#e8e1d7] mb-6 animate-fade-in-up stagger-2"></div>
            <p className="animate-fade-in-up stagger-3 text-[1.2rem] lg:text-[1.5rem] text-[#e5e9f0] font-light max-w-2xl">
              {t(
                "Votre partenaire expert en externalisation back et middle office.",
                "Your expert partner in back and middle office outsourcing."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.2 PRÉSENTATION DU CABINET (Overlapping style, image left) ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container relative">
          
          {/* Text block — full width on mobile, leaves room for image on left on desktop */}
          <div className="bg-[#f5f7fa] shadow-xl relative z-10 px-10 lg:px-16 pt-12 pb-14 lg:pl-[38%]">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] font-bold mb-6 uppercase tracking-wider">
              {t("MENUA CONSULTING", "MENUA CONSULTING")}
            </h2>
            <p className="text-[#6e7891] text-[1.1rem] font-medium leading-relaxed mb-8">
              {t(
                "Cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
                "Firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
              )}
            </p>
            <div className="space-y-4 text-[#6e7891] text-[1rem] font-light leading-relaxed mb-10">
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

            {/* Notre approche */}
            <div className="border-t border-[#e8e1d7] pt-8 mt-8">
              <p className="text-[#141824] font-bold text-[1.1rem] mb-8">
                {t("Notre approche repose sur trois piliers :", "Our approach is based on three pillars:")}
              </p>
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 text-[#141824] font-medium uppercase tracking-widest text-[0.75rem]">
                <div className="flex flex-col items-start gap-3 flex-1">
                  <Network size={24} className="text-[#6e7891]" />
                  <span>{t("Continuité opérationnelle", "Operational continuity")}</span>
                </div>
                <div className="flex flex-col items-start gap-3 flex-1">
                  <ShieldCheck size={24} className="text-[#6e7891]" />
                  <span>{t("Traçabilité des actions", "Traceability of actions")}</span>
                </div>
                <div className="flex flex-col items-start gap-3 flex-1">
                  <CheckCircle size={24} className="text-[#6e7891]" />
                  <span>{t("Fiabilité des livrables", "Reliability of deliverables")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image — absolutely overlapping the left side of the white box */}
          <div className="hidden lg:block absolute -top-24 left-0 w-[36%] h-[75%] z-20">
            <img
              src="/preCabinet.png"
              alt="Cabinet"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }}
            />
          </div>

        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.4 NOTRE MÉTHODOLOGIE (Dark Navy Section) ── */}
      <section className="relative w-full bg-[#141824] section-padding">
        <div className="laplace-container">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block text-left">
              <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
              <h2 className="text-white text-[2rem] font-bold mb-6 uppercase tracking-wider">{t("Notre méthodologie", "Our methodology")}</h2>
            </div>
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
              <div key={idx} className="bg-white/5 border border-[#e8e1d7]/20 p-8 hover:bg-white/10 transition-all duration-300 flex flex-col items-center text-center">
                <step.icon className="text-[#e8e1d7] mb-6" size={32} strokeWidth={1} />
                <h4 className="text-[1.1rem] font-bold text-white mb-4 min-h-[3rem]">{step.title}</h4>
                <p className="text-white/70 text-[0.95rem] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── 2.5 ACCRÉDITATIONS ET NOTRE ÉQUIPE ── */}
      <section className="relative w-full bg-white section-padding">
        <div className="laplace-container max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Beige block with list (Left) */}
          <div className="w-full lg:w-1/2 bg-[#e8e1d7] p-10 lg:p-16 flex flex-col justify-center shadow-xl">
            <div className="w-16 h-[3px] bg-[#141824] mb-5" />
            <h2 className="text-[1.6rem] md:text-[2rem] text-[#141824] font-bold uppercase mb-8 leading-tight">
              {t("ACCRÉDITATIONS, CERTIFICATIONS ET CADRE D’INTERVENTION", "ACCREDITATIONS, CERTIFICATIONS AND INTERVENTION FRAMEWORK")}
            </h2>
            
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
          <div className="w-full lg:w-1/2 h-[300px] lg:h-[450px] shadow-xl">
             <img src="/certification.jpg" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

      {/* ── NOTRE ÉQUIPE DETAILS ── */}
      <section id="equipe" className="relative w-full bg-[#141824] section-padding text-[#e8e1d7] scroll-mt-20">
        <div className="laplace-container max-w-4xl mx-auto text-center">
          <div className="inline-block text-left">
            <div className="w-16 h-[3px] bg-[#e8e1d7] mb-5" />
            <h2 className="mb-4 text-white text-[2rem] font-bold uppercase tracking-wider">{t("Notre équipe", "Our team")}</h2>
            <p className="text-[#e8e1d7] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
              {t("Une direction impliquée au plus près des opérations", "Management closely involved in operations")}
            </p>
          </div>
          
          <div className="bg-white/5 p-10 md:p-14 border border-white/10 text-left">
            <h3 className="text-[1.6rem] font-bold mb-8 text-white">La Présidente</h3>
            
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Discreet Photo */}
              <div className="shrink-0 flex flex-col items-center mx-auto md:mx-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#e8e1d7]/30 bg-[#141824] mb-4">
                  <img 
                    src="/rosette.jpg" 
                    alt="Rosette Fouelefack" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
                  />
                </div>
                <span className="text-[#e8e1d7] text-[0.85rem] font-bold uppercase tracking-wider text-center leading-tight">
                  Rosette<br/>Fouelefack
                </span>
              </div>

              {/* Text content (main focus) */}
              <div className="flex-1">
                <p className="text-[#e5e9f0] font-light leading-relaxed mb-6">
                  {t(
                    "Rosette Fouelefack est Présidente de MENUA CONSULTING.",
                    "Rosette Fouelefack is the President of MENUA CONSULTING."
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
                    "La Présidente est personnellement impliquée dans chaque mission : de la phase d’audit et de définition des besoins jusqu’au déploiement et à la supervision des équipes.",
                    "The President is personally involved in each mission: from the audit phase and defining needs to deployment and team supervision."
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
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ── */}
      <div className="w-full h-8 md:h-16 bg-white"></div>

    </main>
  );
}
