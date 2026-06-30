"use client";
import Link from "next/link";
import { Landmark, Target, GitMerge, FileCheck, RefreshCw, ClipboardCheck, ShieldCheck, ArrowRight, Globe, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">
      {/* ── HERO INTRO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous_connaitre_hero.png"
            alt="Nous Connaître"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#223930] from-20% via-[#223930]/70 via-45% to-transparent to-65%" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            {/* Decorative golden bracket */}
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#E0D6C8]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#E0D6C8]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#E0D6C8]" />
            
            <div className="relative">
              <p className="text-[#E0D6C8] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.15em] uppercase mb-8">
                {t("Le cabinet", "The firm")}
              </p>
              <h1 className="text-white mb-8 text-[2.2rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.1] font-bold uppercase max-w-4xl tracking-tight">
                {t("Nous connaître", "About Us")}
              </h1>
              <div className="text-white/95 text-[1.05rem] md:text-[1.15rem] leading-[1.6] max-w-2xl font-normal space-y-4">
                <p>
                  MENUA CONSULTING {t(
                    "accompagne les entreprises dans l'externalisation opérationnelle de fonctions",
                    "supports companies in the operational outsourcing of"
                  )} <span className="text-[#E0D6C8] italic" style={{ fontFamily: "var(--font-playfair)" }}>back et middle office.</span>
                </p>
                <p>
                  {t(
                    "Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation.",
                    "We support internal teams within a structured framework, defined by the methods, priorities and requirements of each organization."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROWS CONTENT ── */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-20 bg-[#FDFDFD]">
        
        {/* PRÉSENTATION DU CABINET */}
        <div id="presentation-du-cabinet" className="border-b border-[#E0D6C8]/60 py-12 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <div className="flex items-start gap-8 lg:w-[40%]">
            <div className="w-20 h-20 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
              <Landmark className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest leading-tight mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Présentation\ndu cabinet", "Firm\nPresentation").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-10 h-[2px] bg-[#d5a864]" />
            </div>
          </div>
          <div className="lg:w-[60%] text-[#223930] text-[0.95rem] font-medium leading-[1.6]">
            <p className="mb-4">
              MENUA CONSULTING {t("est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en", "is a firm specialized in operational outsourcing of back and middle office functions in")} <strong className="font-bold">finance, comptabilité, conformité, de la gestion de patrimoine et data.</strong>
            </p>
            <p className="mb-4">
              {t("Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec", "We provide companies, firms and financial players with dedicated operational teams, capable of executing demanding missions with")} <strong className="font-bold">rigueur, continuité et fiabilité.</strong>
            </p>
            <p className="mb-4">
              {t(
                "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
                "Our collaborators integrate into client organizations to take charge of operational execution, optimize internal costs and secure operational continuity."
              )}
            </p>
            <p>
              {t(
                "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
                "This organization allows clients to focus on their core business, while guaranteeing controlled, fluid and sustainable processes."
              )}
            </p>
          </div>
        </div>

        {/* NOTRE APPROCHE */}
        <div id="notre-approche" className="border-b border-[#E0D6C8]/60 py-12 lg:px-8 flex flex-col lg:flex-row items-start gap-10">
          <div className="flex items-start gap-8 lg:w-[40%]">
            <div className="w-20 h-20 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
              <Target className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest leading-tight mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Notre\napproche", "Our\nApproach").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-10 h-[2px] bg-[#d5a864] mb-4" />
              <p className="text-[#223930] text-[0.95rem] font-medium">{t("Approche 100% opérationnelle", "100% operational approach")}</p>
              <p className="text-[#223930] text-[0.95rem] font-medium mt-4">{t("Trois piliers :", "Three pillars:")}</p>
            </div>
          </div>
          <div className="lg:w-[60%] flex flex-col gap-8">
            <div>
              <p className="text-[#223930] text-[0.95rem] font-medium leading-[1.6] mb-4">
                {t(
                  "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.",
                  "MENUA CONSULTING adopts a resolutely operational stance: clients define needs, methods and priorities, we ensure execution."
                )}
              </p>
              <p className="text-[#223930] text-[0.95rem] font-medium leading-[1.6] mb-4">{t("Notre approche repose sur trois piliers :", "Our approach rests on three pillars:")}</p>
              <ul className="list-disc pl-5 text-[#223930] text-[0.95rem] space-y-1.5 font-medium marker:text-[#d5a864]">
                <li>{t("Continuité opérationnelle", "Operational continuity")}</li>
                <li>{t("Traçabilité des actions", "Traceability of actions")}</li>
                <li>{t("Fiabilité des livrables", "Reliability of deliverables")}</li>
              </ul>
            </div>
            <div className="flex items-center gap-3 text-[#223930] font-bold text-[0.9rem]">
              <Globe size={20} className="text-[#223930]" />
              {t("Interventions en français et en anglais", "Interventions in French and English")}
            </div>
          </div>
        </div>

        {/* NOTRE MÉTHODOLOGIE */}
        <div id="notre-methodologie" className="border-b border-[#E0D6C8]/60 py-12 lg:px-8 flex flex-col lg:flex-row items-start gap-10">
          <div className="flex items-start gap-8 lg:w-[40%]">
            <div className="w-20 h-20 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
              <GitMerge className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest leading-tight mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Notre\nméthodologie", "Our\nMethodology").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-10 h-[2px] bg-[#d5a864]" />
            </div>
          </div>
          <div className="lg:w-[60%] flex flex-col md:flex-row gap-2 relative">
            {[
              { num: "01", title: t("Découverte", "Discovery"), desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.", "Analysis of your organization, processes and constraints to precisely define the scope of intervention.") },
              { num: "02", title: t("Vérifications préalables", "Preliminary checks"), desc: t("Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle afin de sécuriser l'entrée en relation.", "Verification of legal identity, administrative situation and operational coherence to secure the entry into relation.") },
              { num: "03", title: t("Analyse", "Analysis"), desc: t("Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode and expected deliverables.") },
              { num: "04", title: t("Mise en œuvre & formation", "Implementation & training"), desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into your organization's tools, processes and standards.") },
              { num: "05", title: t("Suivi dans la durée", "Long-term follow-up"), desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous mission management, regular adjustments and quality control of deliverables.") },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col relative group">
                <div className="bg-white border border-[#E0D6C8]/40 p-5 h-full flex flex-col items-center text-center z-10 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-sm">
                  <div className="w-10 h-10 rounded-full bg-[#223930] text-white flex items-center justify-center text-[0.8rem] font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-[#223930] text-[0.95rem] font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                    {step.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  </h3>
                  <p className="text-[#223930]/80 text-[0.75rem] font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {/* Flèche entre les étapes */}
                {i < 3 && (
                  <div className="hidden md:flex absolute top-[2.5rem] -right-[0.5rem] z-20 text-[#d5a864] translate-x-1/2">
                    <ArrowRight size={20} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS & CADRE */}
        <div id="certifications" className="border-b border-[#E0D6C8]/60 py-12 lg:px-8 flex flex-col lg:flex-row items-start gap-10">
          <div className="flex items-start gap-8 lg:w-[40%]">
            <div className="w-20 h-20 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
              <FileCheck className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest leading-tight mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Certifications &\ncadre d'intervention", "Certifications &\nintervention framework").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-10 h-[2px] bg-[#d5a864]" />
            </div>
          </div>
          <div className="lg:w-[60%] flex flex-col">
            <div className="flex gap-4 mb-6">
              {[
                { icon: Landmark, title: "AMF\nCertification" },
                { icon: ShieldCheck, title: "Contrôle\nInterne" },
                { icon: ShieldCheck, title: "Risques &\nConformité" }
              ].map((cert, i) => (
                <div key={i} className="flex-1 bg-[#F5F2EB] py-6 flex flex-col items-center justify-center text-center rounded-sm">
                  <cert.icon size={36} className="text-[#223930] mb-3" strokeWidth={1} />
                  <span className="text-[#223930] text-[0.95rem] font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                    {cert.title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[#223930] text-[0.85rem] font-medium leading-[1.6] space-y-3">
              <span className="block mb-2">{t("MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.", "MENUA CONSULTING operates in environments subject to high regulatory requirements.")}</span>
              <span className="block mb-2">{t("La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.", "The CEO holds an AMF certification, a certification in Internal Control and Risk Management of financial institutions, and experience in financial, wealth and regulated environments.")}</span>
              <span className="block mb-2">{t("Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).", "The firm works in coordination with the authorized teams of its clients (banks, firms, regulated structures).")}</span>
              <span className="block mb-2">{t("MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients.", "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks.")}</span>
              <span className="block">{t("Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.", "This device guarantees compliance, quality of operations and process security.")}</span>
            </p>
          </div>
        </div>

        {/* NOTRE ÉQUIPE */}
        <div id="notre-equipe" className="py-12 lg:px-8 flex flex-col lg:flex-row items-start gap-10">
          <div className="flex items-start gap-8 lg:w-[40%]">
            <div className="w-20 h-20 rounded-full bg-[#223930] flex items-center justify-center shrink-0">
              <Users className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col mt-2">
              <h2 className="text-[#223930] text-[1.2rem] font-bold uppercase tracking-widest leading-tight mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("Notre équipe", "Our team")}
              </h2>
              <div className="w-10 h-[2px] bg-[#d5a864] mb-4" />
              <p className="text-[#223930] text-[0.9rem] font-medium leading-relaxed max-w-[200px]">
                {t("Une direction impliquée au plus près des opérations", "Management involved closely with operations")}
              </p>
            </div>
          </div>
          <div className="lg:w-[60%] flex items-start gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded bg-gray-200 overflow-hidden shrink-0 shadow-lg">
              <img src="/rosette.jpg" alt="Rosette Fouelefack" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[#223930] text-[1.6rem] font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>Rosette Fouelefack</h3>
              <p className="text-[#d5a864] font-bold uppercase text-[0.85rem] tracking-wider mb-4">Directrice générale</p>
              <div className="w-full h-px bg-[#E0D6C8]/60 mb-4" />
              <div className="text-[#223930] text-[0.9rem] font-medium leading-[1.6] space-y-3">
                <p>{t("Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants.", "She has experience in finance, risk management, wealth management and back & middle office operations acquired in demanding environments.")}</p>
                <p>{t("Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.", "She directly supervises the structuring of missions, team formation, validation of deliverables and the quality control system.")}</p>
                <p>{t("MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.", "MENUA CONSULTING relies on an agile organization, composed of an operational management in France and externalized collaborators or partners mobilized according to client needs.")}</p>
                <p>{t("Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français.", "Each mission is framed by monitoring, validation and control procedures, to guarantee a level of execution in line with client expectations and the standards of rigor expected on the French market.")}</p>
                <p className="font-semibold">{t("MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.", "MENUA CONSULTING operates on a four-eyes control principle and continuous supervision of operations to guarantee reliability, rigor and continuity of service.")}</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      <CallToAction />
    </main>
  );
}
