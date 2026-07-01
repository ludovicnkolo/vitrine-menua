"use client";
import { Landmark, Target, GitMerge, FileCheck, ShieldCheck, ArrowRight, Globe, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import CallToAction from "@/components/layout/CallToAction";

export default function NousConnaitrePage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFDFD]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/nous_connaitre_hero.png"
            alt="Nous Connaître"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#122017] from-20% via-[#122017]/75 via-50% to-transparent to-70%" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="relative py-12 pl-10">
            <div className="absolute top-0 left-0 w-[85%] md:w-[65%] h-[1.5px] bg-[#D9B151]" />
            <div className="absolute top-0 left-0 w-[1.5px] h-full bg-[#D9B151]" />
            <div className="absolute bottom-0 left-0 w-[20%] md:w-[15%] h-[1.5px] bg-[#D9B151]" />
            <div className="relative">
              <p className="text-[#D9B151] text-[0.8rem] md:text-[0.95rem] font-bold tracking-[0.2em] uppercase mb-6">
                {t("Le cabinet", "The firm")}
              </p>
              <h1 className="text-white mb-8 text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] font-bold uppercase max-w-3xl tracking-tight">
                {t("Nous\nconnaître", "About\nUs").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h1>
              <div className="text-white/90 text-[1rem] md:text-[1.1rem] leading-[1.7] max-w-xl font-normal space-y-3">
                <p>
                  MENUA CONSULTING {t(
                    "accompagne les entreprises dans l'externalisation opérationnelle de fonctions",
                    "supports companies in the operational outsourcing of"
                  )}{" "}
                  <span className="text-[#D9B151] font-semibold">back & middle office.</span>
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

      {/* ══ 1. PRÉSENTATION DU CABINET — Fond vert foncé, image droite ══ */}
      <section id="presentation-du-cabinet" className="w-full bg-[#122017] py-12 lg:py-16 my-10 lg:my-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Text left */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("01 — Le cabinet", "01 — The firm")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6 tracking-tight">
              {t("Présentation\ndu cabinet", "Firm\nPresentation").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
            <div className="text-white/80 text-[0.95rem] leading-[1.8] space-y-4 font-normal">
              <p>
                MENUA CONSULTING {t("est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en", "is a firm specialized in operational outsourcing of back and middle office functions in")}{" "}
                <strong className="text-white font-bold">finance, comptabilité, conformité, de la gestion de patrimoine et data.</strong>
              </p>
              <p>
                {t("Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec", "We provide companies, firms and financial players with dedicated operational teams, capable of executing demanding missions with")}{" "}
                <strong className="text-[#D9B151]">rigueur, continuité et fiabilité.</strong>
              </p>
              <p>
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

          {/* Image right */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/office-lounge.jpg"
                alt="Cabinet Menua Consulting"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/meeting.jpg"; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. NOTRE APPROCHE — Fond crème, 3 piliers en cartes ══ */}
      <section id="notre-approche" className="w-full bg-[#F6F3F0] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start gap-16">

            {/* Left title block */}
            <div className="w-full lg:w-[38%] flex flex-col sticky top-24 self-start">
              <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
                {t("02 — Posture", "02 — Stance")}
              </p>
              <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
                {t("Notre\napproche", "Our\nApproach").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-12 h-[2px] bg-[#D9B151] mb-6" />
              <p className="text-[#122017] text-[0.95rem] font-semibold leading-relaxed mb-4">
                {t("Approche 100% opérationnelle", "100% operational approach")}
              </p>
              <p className="text-[#122017]/70 text-[0.9rem] leading-[1.7]">
                {t(
                  "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution.",
                  "MENUA CONSULTING adopts a resolutely operational stance: clients define needs, methods and priorities, we ensure execution."
                )}
              </p>
              <div className="mt-8 flex items-center gap-3 text-[#122017] font-bold text-[0.85rem] border border-[#122017]/20 bg-white px-4 py-3 rounded-lg w-fit">
                <Globe size={18} className="text-[#8B6240]" />
                {t("FR / EN — Bilingue", "FR / EN — Bilingual")}
              </div>
            </div>

            {/* Right: 3 pillar cards */}
            <div className="w-full lg:w-[62%] flex flex-col gap-6">
              {[
                { icon: CheckCircle, title: t("Continuité opérationnelle", "Operational continuity"), desc: t("Présence continue dans votre organisation. Nos équipes s'intègrent durablement pour garantir la fluidité des opérations sans interruption.", "Continuous presence in your organization. Our teams integrate durably to ensure smooth, uninterrupted operations."), bg: "#122017" },
                { icon: FileCheck, title: t("Traçabilité des actions", "Traceability of actions"), desc: t("Chaque action est documentée, suivie et validée. Un reporting structuré vous garantit une visibilité complète sur l'avancement et les livrables.", "Each action is documented, tracked and validated. Structured reporting guarantees you full visibility over progress and deliverables."), bg: "#5A3A1E" },
                { icon: ShieldCheck, title: t("Fiabilité des livrables", "Reliability of deliverables"), desc: t("Des livrables conformes aux standards du marché, contrôlés en interne selon le principe des quatre yeux avant chaque remise au client.", "Deliverables that meet market standards, internally controlled according to the four-eyes principle before each delivery."), bg: "#8B6240" },
              ].map((pillar, i) => (
                <div key={i} className="flex items-start gap-6 bg-white rounded-xl p-7 border border-[#E0D6C8]/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: pillar.bg }}>
                    <pillar.icon size={22} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[#122017] text-[1rem] font-bold mb-2 uppercase tracking-wide">{pillar.title}</h3>
                    <p className="text-[#122017]/70 text-[0.88rem] leading-[1.7]">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. NOTRE MÉTHODOLOGIE — Fond vert très foncé, timeline horizontale ══ */}
      <section id="notre-methodologie" className="w-full py-12 lg:py-16 mb-10 lg:mb-16 overflow-hidden" style={{
        background: "linear-gradient(160deg, #8B6240 0%, #5A3A1E 40%, #3E2510 100%)"
      }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-14">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("03 — Processus", "03 — Process")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-4">
              {t("Notre méthodologie", "Our Methodology")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151]" />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { num: "01", title: t("Découverte", "Discovery"), desc: t("Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.", "Analysis of your organization, processes and constraints to precisely define the scope of intervention.") },
              { num: "02", title: t("Vérifications préalables", "Preliminary checks"), desc: t("Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle afin de sécuriser l'entrée en relation.", "Verification of legal identity, administrative situation and operational coherence to secure the entry into relation.") },
              { num: "03", title: t("Analyse", "Analysis"), desc: t("Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.", "Construction of an operational proposal adapted to your needs, including profiles, organization mode and expected deliverables.") },
              { num: "04", title: t("Mise en œuvre & formation", "Implementation & training"), desc: t("Déploiement des équipes et intégration aux outils, process et standards de votre organisation.", "Deployment of teams and integration into your organization's tools, processes and standards.") },
              { num: "05", title: t("Suivi dans la durée", "Long-term follow-up"), desc: t("Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.", "Continuous mission management, regular adjustments and quality control of deliverables.") },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/15 hover:bg-white/15 transition-all">
                <span className="text-[#D9B151]/50 text-[2.5rem] font-bold leading-none mb-3 select-none">{step.num}</span>
                <h3 className="text-white text-[0.85rem] font-bold uppercase tracking-wide mb-3 leading-tight">{step.title}</h3>
                <p className="text-white/65 text-[0.78rem] leading-[1.7]">{step.desc}</p>
                {i < 4 && (
                  <div className="hidden xl:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={16} className="text-[#D9B151]" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. CERTIFICATIONS — Fond blanc, badges + texte ══ */}
      <section id="certifications" className="w-full bg-[#FDFDFD] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start gap-16">

            {/* Right: certs first on mobile, second on desktop */}
            <div className="w-full lg:w-[45%] order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-5">
                {[
                  { title: "AMF", sub: t("Certification AMF", "AMF Certification"), desc: t("Certification en tant qu'apporteur, garantissant la conformité des opérations dans les environnements réglementés.", "Certification as an introducer, guaranteeing compliance in regulated environments."), color: "#122017" },
                  { title: "CI", sub: t("Contrôle Interne", "Internal Control"), desc: t("Certification en Contrôle Interne et Gestion des Risques des institutions financières.", "Certification in Internal Control and Risk Management of financial institutions."), color: "#5A3A1E" },
                  { title: "RC", sub: t("Risques & Conformité", "Risks & Compliance"), desc: t("Maîtrise des environnements réglementés AMF, ACPR et réglementations internationales.", "Mastery of AMF, ACPR regulated environments and international regulations."), color: "#8B6240" },
                ].map((cert, i) => (
                  <div key={i} className="flex items-start gap-5 p-5 rounded-xl border border-[#E0D6C8]/60 bg-[#F6F3F0] hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[1rem] tracking-widest" style={{ backgroundColor: cert.color }}>
                      {cert.title}
                    </div>
                    <div>
                      <h3 className="text-[#122017] font-bold text-[0.9rem] uppercase tracking-wide mb-1">{cert.sub}</h3>
                      <p className="text-[#122017]/60 text-[0.8rem] leading-[1.6]">{cert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left: text */}
            <div className="w-full lg:w-[55%] order-1 lg:order-2 flex flex-col">
              <p className="text-[#8B6240] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
                {t("04 — Cadre réglementaire", "04 — Regulatory framework")}
              </p>
              <h2 className="text-[#122017] text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight mb-6">
                {t("Certifications &\ncadre d'intervention", "Certifications &\nintervention framework").split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
              </h2>
              <div className="w-12 h-[2px] bg-[#D9B151] mb-8" />
              <div className="text-[#122017]/75 text-[0.92rem] leading-[1.8] space-y-4">
                <p>{t("MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.", "MENUA CONSULTING operates in environments subject to high regulatory requirements.")}</p>
                <p>{t("La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.", "The CEO holds an AMF certification, a certification in Internal Control and Risk Management of financial institutions, and experience in financial, wealth and regulated environments.")}</p>
                <p>{t("Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).", "The firm works in coordination with the authorized teams of its clients (banks, firms, regulated structures).")}</p>
                <div className="mt-6 bg-[#122017] text-white rounded-xl p-6 text-[0.88rem] leading-[1.7] font-medium">
                  <p>{t("MENUA CONSULTING n'exerce pas d'activité réglementée en son nom propre. Le cabinet met à disposition des ressources opérationnelles spécialisées intégrées aux cadres d'agrément et de supervision de ses clients. Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.", "MENUA CONSULTING does not carry out regulated activities in its own name. The firm provides specialized operational resources integrated into its clients' approval and supervision frameworks. This system guarantees compliance, operational quality, and process security.")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. NOTRE ÉQUIPE — Fond vert foncé, grand portrait ══ */}
      <section id="notre-equipe" className="w-full bg-[#122017] py-12 lg:py-16 mb-10 lg:mb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

          <div className="flex flex-col items-center mb-14">
            <p className="text-[#D9B151] text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-4">
              {t("05 — Direction", "05 — Leadership")}
            </p>
            <h2 className="text-white text-[2rem] md:text-[2.6rem] font-bold uppercase leading-tight text-center mb-4">
              {t("Notre équipe", "Our Team")}
            </h2>
            <div className="w-12 h-[2px] bg-[#D9B151] mb-4" />
            <p className="text-white/60 text-[0.9rem] text-center max-w-md">
              {t("Une direction impliquée au plus près des opérations", "Management involved closely with operations")}
            </p>
          </div>

          {/* Director card */}
          <div className="flex flex-col lg:flex-row items-stretch gap-0 rounded-2xl overflow-hidden max-w-[960px] mx-auto border border-white/10">
            {/* Photo */}
            <div className="w-full lg:w-[38%] h-[320px] lg:h-auto relative shrink-0">
              <img
                src="/rosette.jpg"
                alt="Rosette Fouelefack"
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.currentTarget.style.background = "#1a2e24"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122017]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#122017]/60" />
            </div>

            {/* Bio */}
            <div className="w-full lg:w-[62%] bg-[#1a2e24] p-8 lg:p-10 flex flex-col justify-center">
              <h3 className="text-white text-[1.8rem] lg:text-[2rem] font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                Rosette Fouelefack
              </h3>
              <p className="text-[#D9B151] font-bold uppercase text-[0.8rem] tracking-widest mb-6">
                {t("Directrice générale", "Chief Executive Officer")}
              </p>
              <div className="w-10 h-[1px] bg-[#D9B151]/40 mb-6" />
              <div className="text-white/70 text-[0.88rem] leading-[1.8] space-y-3">
                <p>{t("Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants.", "She has experience in finance, risk management, wealth management and back & middle office operations acquired in demanding environments.")}</p>
                <p>{t("Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.", "She directly supervises the structuring of missions, team formation, validation of deliverables and the quality control system.")}</p>
                <p>{t("MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients.", "MENUA CONSULTING relies on an agile organization, composed of an operational management in France and externalized collaborators or partners mobilized according to client needs.")}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 text-white/50 text-[0.8rem] font-semibold leading-[1.6]">
                {t("MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service.", "MENUA CONSULTING operates on a four-eyes control principle and continuous supervision of operations to guarantee reliability, rigor and continuity of service.")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
