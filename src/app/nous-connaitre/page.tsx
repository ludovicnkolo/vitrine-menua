"use client";
import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Search, ShieldCheck, BarChart2, Users, CheckCircle, Network, BookOpen, UserCheck, Settings } from "lucide-react";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* ── 2.1 INTRODUCTION (Full Bleed Laplace Style) ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/office-lounge.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
            onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} 
          />
          <div className="absolute inset-0 bg-[#141824]/70"></div>
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
            <p className="animate-fade-in-up stagger-3 text-[1.1rem] text-white font-medium">
              {t(
                "Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation.",
                "We provide support to internal teams in a structured framework, defined by the methods, priorities and requirements of each organization."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2.2 PRÉSENTATION DU CABINET (Laplace Overlapping Beige) ── */}
      <section className="relative w-full bg-white pt-24 pb-32">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Beige Box */}
            <div className="w-full lg:w-6/12 bg-[#e8e1d7] p-12 lg:p-20 z-20 mt-0 lg:mt-0 lg:mr-[-10%] shadow-2xl order-2 lg:order-1">
              <h2 className="text-[1.8rem] md:text-[2.2rem] text-[#141824] mb-8 font-bold">
                {t("MENUA CONSULTING", "MENUA CONSULTING")}
              </h2>
              <div className="w-16 h-1 bg-[#141824] mb-8 animate-fade-in-up" />
              <div className="space-y-6 text-[#141824] text-[1.05rem] font-light leading-relaxed">
                <p>
                  {t(
                    "MENUA CONSULTING est un cabinet spécialisé dans l’externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, de la gestion de patrimoine et data.",
                    "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management and data."
                  )}
                </p>
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
                <p>
                  {t(
                    "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                    "This organization allows clients to focus on their core business, while guaranteeing controlled, smooth and sustainable processes."
                  )}
                </p>
              </div>
            </div>
            {/* Right Image */}
            <div className="w-full lg:w-7/12 h-[400px] lg:h-[600px] z-10 shadow-xl order-1 lg:order-2 mb-[-4rem] lg:mb-0">
              <img src="/preCabinet.png" alt="Cabinet" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.3 NOTRE APPROCHE (Laplace Dark Blue Section) ── */}
      <section className="relative w-full bg-[#141824] text-white section-padding">
        <div className="laplace-container">
          <div className="max-w-3xl mb-16 animate-fade-in-up mx-auto text-center">
            <h2 className="mb-6 text-[2rem] text-white">{t("Notre approche", "Our approach")}</h2>
            <div className="w-16 h-1 bg-[#e8e1d7] mb-10 mx-auto" />
            <p className="text-[#e5e9f0] text-[1.1rem] mb-6 font-light leading-relaxed">
              {t(
                "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l’exécution.",
                "MENUA CONSULTING adopts a resolutely operational posture: clients define needs, methods and priorities, we ensure execution."
              )}
            </p>
            <p className="text-[#e5e9f0] text-[1.1rem] mb-10 font-light leading-relaxed">
              {t(
                "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation.",
                "We operate in financial, accounting, wealth and regulated environments, strictly respecting internal procedures, validation circuits and the quality requirements specific to each organization."
              )}
            </p>
            <p className="text-[#e8e1d7] font-bold text-[1.2rem]">
              {t("Notre approche repose sur trois piliers :", "Our approach is based on three pillars:")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { title: t("Continuité opérationnelle", "Operational continuity"), icon: Network },
              { title: t("Traçabilité des actions", "Traceability of actions"), icon: ShieldCheck },
              { title: t("Fiabilité des livrables", "Reliability of deliverables"), icon: CheckCircle }
            ].map((item, idx) => (
              <div key={idx} className="animate-fade-in-up flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <item.icon className="text-[#e8e1d7] mb-6" size={48} strokeWidth={1} />
                <h3 className="text-[1.2rem] text-white">{item.title}</h3>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-[#e8e1d7] text-[#141824] p-8 max-w-3xl mx-auto text-center shadow-lg">
            <p className="text-[1.1rem] font-medium">
              {t(
                "Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international.",
                "Our teams can intervene in French and English, ensuring smooth management of exchanges, reporting and operations in an international context."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2.4 NOTRE MÉTHODOLOGIE (Beige Cards) ── */}
      <section className="relative w-full bg-[#f5f7fa] section-padding">
        <div className="laplace-container">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-[#141824] text-[2rem] mb-6">{t("Notre méthodologie", "Our methodology")}</h2>
            <div className="w-16 h-1 bg-[#141824] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: t("Découverte", "Discovery"),
                icon: Search,
                desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d’intervention.", "Analysis of your organization, your processes and your constraints in order to precisely define the scope of intervention.")
              },
              {
                title: t("Vérifications préalables", "Preliminary checks"),
                icon: UserCheck,
                desc: t("Vérification de l’identité juridique, de la situation administrative et de la cohérence opérationnelle du client ou partenaire, afin de sécuriser l’entrée en relation.", "Verification of the legal identity, administrative situation and operational consistency of the client or partner, to secure the start of the relationship.")
              },
              {
                title: t("Analyse", "Analysis"),
                icon: BarChart2,
                desc: t("Construction d’une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d’organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including the profiles, the organization mode and the expected deliverables.")
              },
              {
                title: t("Mise en œuvre & formation", "Implementation & training"),
                icon: Settings,
                desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into your organization's tools, processes and standards.")
              },
              {
                title: t("Suivi dans la durée", "Long-term monitoring"),
                icon: ShieldCheck,
                desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous steering of the mission, regular adjustments and quality control of deliverables.")
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-[#e8e1d7] border-t-4 border-t-[#141824] p-8 hover:shadow-xl transition-shadow duration-300">
                <step.icon className="text-[#141824] mb-6" size={32} strokeWidth={1.5} />
                <h4 className="text-[1.1rem] font-bold text-[#141824] mb-4">{step.title}</h4>
                <p className="text-[#6e7891] text-[0.95rem] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2.5 ACCRÉDITATIONS (Overlap Image Right) ── */}
      <section className="relative w-full bg-white pt-24 pb-32">
        <div className="laplace-container relative">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Image */}
            <div className="w-full lg:w-7/12 h-[400px] lg:h-[500px] z-10 shadow-xl">
              <img src="/certification.jpg" alt="Accréditations" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }} />
            </div>
            
            {/* Right Overlapping Blue Box */}
            <div className="w-full lg:w-6/12 bg-[#141824] p-12 lg:p-20 z-20 -mt-16 lg:mt-0 lg:-ml-24 shadow-2xl text-white">
              <div className="w-16 h-1 bg-[#e8e1d7] mb-10 animate-fade-in-up" />
              <h2 className="leading-relaxed animate-fade-in-up stagger-1 text-white text-[1.6rem] md:text-[2rem] font-light mb-8">
                {t("Accréditations, certifications & cadre d’intervention", "Accreditations, certifications & intervention framework")}
              </h2>
              <div className="space-y-6 text-[#e5e9f0] text-[1.05rem] font-light leading-relaxed">
                <p>
                  {t(
                    "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
                    "MENUA CONSULTING operates in environments subject to high regulatory requirements."
                  )}
                </p>
                <p>
                  {t(
                    "La dirigeante dispose notamment de la certification AMF, d’une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d’une expérience acquise au sein d’environnements financiers, patrimoniaux et réglementés.",
                    "The director holds an AMF certification, a certification in Internal Control and Risk Management of financial institutions, as well as experience gained in financial, wealth and regulated environments."
                  )}
                </p>
                <p>
                  {t(
                    "Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).",
                    "The firm intervenes in coordination with the authorized teams of its clients (banks, firms, regulated structures)."
                  )}
                </p>
                <p>
                  {t(
                    "MENUA CONSULTING n’exerce pas d’activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d’agrément et de supervision de ses clients.",
                    "MENUA CONSULTING does not exercise any regulated activity in its own name. The firm provides specialized operational resources integrated into the approval and supervision frameworks of its clients."
                  )}
                </p>
                <p className="text-[#e8e1d7] font-bold">
                  {t(
                    "Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
                    "This system guarantees compliance, quality of operations and process security."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.6 NOTRE ÉQUIPE ── */}
      <section className="relative w-full bg-[#e8e1d7] section-padding">
        <div className="laplace-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <h2 className="mb-4 text-[#141824] text-[2rem]">{t("Notre équipe", "Our team")}</h2>
            <p className="text-[#141824] font-bold tracking-widest uppercase text-[0.85rem] mb-6 opacity-70">
              {t("Une direction impliquée au plus près des opérations", "Management closely involved in operations")}
            </p>
            <div className="w-16 h-1 bg-[#141824] mb-8" />
            <div className="space-y-6 text-[#141824] text-[1.05rem] font-light leading-relaxed">
              <h3 className="text-[1.4rem] font-bold mb-2">La dirigeante</h3>
              <p>
                {t(
                  "Rosette Fouelefack est directrice générale de MENUA CONSULTING.",
                  "Rosette Fouelefack is the General Manager of MENUA CONSULTING."
                )}
              </p>
              <p>
                {t(
                  "Elle dispose d’une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d’environnements exigeants.",
                  "She has experience in finance, risk management, wealth management and back & middle office operations acquired in demanding environments."
                )}
              </p>
              <p>
                {t(
                  "Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.",
                  "She directly supervises the structuring of missions, the building of teams, the validation of deliverables and the quality control system."
                )}
              </p>
              <p>
                {t(
                  "MENUA CONSULTING s’appuie sur une organisation agile, composée d’une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.",
                  "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced employees or partners mobilized according to clients' needs."
                )}
              </p>
              <p>
                {t(
                  "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d’exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.",
                  "Each mission is governed by monitoring, validation and control procedures, to guarantee an execution level that meets the client's expectations and the rigorous standards expected on the French market."
                )}
              </p>
              <p className="font-bold border-l-4 border-[#141824] pl-4 py-2 mt-6">
                {t(
                  "MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.",
                  "MENUA CONSULTING is based on a four-eyes control principle and continuous supervision of operations to guarantee reliability, rigor and service continuity."
                )}
              </p>
            </div>
          </div>
          <div className="w-full h-[500px] lg:h-[700px] shadow-2xl">
            <img src="/rosette.jpg" alt="Rosette Fouelefack" className="w-full h-full object-cover object-top" onError={(e) => { e.currentTarget.src = "/office-lounge.jpg"; }} />
          </div>
        </div>
      </section>

    </main>
  );
}
