import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Get to Know Us – MENUA CONSULTING" : "Nous connaître – MENUA CONSULTING",
    description: isEn
      ? "Discover MENUA CONSULTING, your partner in operational outsourcing and specialized support for your back and middle office functions."
      : "Découvrez MENUA CONSULTING, cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité et gestion de patrimoine.",
  };
}

/* ── Composants locaux réutilisables ── */
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section
      style={{
        paddingTop: "9rem",
        paddingBottom: "5rem",
        background: "var(--beige-bg)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
          <p className="section-lbl">MENUA CONSULTING</p>
          <div className="section-lbl-line" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "var(--text-dark)",
            lineHeight: 1.3,
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-mid)",
            lineHeight: 1.85,
            maxWidth: "680px",
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}

function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
      <p className={light ? "section-lbl section-lbl--light" : "section-lbl"}>{children}</p>
      <div className="section-lbl-line" />
    </div>
  );
}

export default async function NousConnaitre({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      {/* ── HERO ── */}
      <PageHeader
        title={isEn ? "About Us" : "Nous connaître"}
        subtitle={isEn ? "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions. We intervene to support internal teams within a structured framework, defined by the methods, priorities, and requirements of each organization." : "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office. Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation."}
      />

      {/* ── PRÉSENTATION DU CABINET ── */}
      <section id="presentation" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>{isEn ? "Our Firm" : "Présentation du cabinet"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "2rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "A firm dedicated to operational execution" : "Un cabinet dédié à l'exécution opérationnelle"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              isEn ? "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management, and data." : "MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
              isEn ? "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability." : "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
              isEn ? "Our employees integrate with client organizations to take charge of operational execution, optimize internal workloads, and secure the continuity of operations." : "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
              isEn ? "This organization allows clients to focus on their core business while guaranteeing controlled, fluid, and sustainable processes." : "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
            ].map((p, index) => (
              <p
                key={index}
                style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE APPROCHE ── */}
      <section
        id="approche"
        style={{ padding: "6rem 2rem", background: "var(--beige-bg)", borderTop: "1px solid var(--border-light)" }}
      >
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>{isEn ? "Our Approach" : "Notre approche"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "2rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "A resolutely operational stance" : "Une posture résolument opérationnelle"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "MENUA CONSULTING adopts a resolutely operational stance: clients define the needs, methods, and priorities; we handle the execution." : "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution."}
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "We operate in financial, accounting, wealth, and regulated environments, strictly adhering to internal procedures, validation circuits, and quality requirements specific to each organization." : "Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés, en respectant strictement les procédures internes, les circuits de validation et les exigences de qualité propres à chaque organisation."}
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "Our teams can intervene in English and French, guaranteeing fluid management of exchanges, reporting, and operations in an international context." : "Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide des échanges, des reportings et des opérations dans un contexte international."}
            </p>
          </div>
          {/* Trois piliers */}
          <div
            style={{
              marginTop: "3rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { label: isEn ? "Operational Continuity" : "Continuité opérationnelle" },
              { label: isEn ? "Action Traceability" : "Traçabilité des actions" },
              { label: isEn ? "Deliverable Reliability" : "Fiabilité des livrables" },
            ].map((pilier, idx) => (
              <div
                key={idx}
                style={{
                  borderLeft: "3px solid var(--gold)",
                  paddingLeft: "1.25rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--green-dark)",
                  }}
                >
                  {pilier.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODOLOGIE ── */}
      <section id="methodologie" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <SectionTitle>{isEn ? "Our Methodology" : "Notre méthodologie"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "3.5rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "A structured five-step process" : "Un processus structuré en cinq étapes"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                num: "01",
                title: isEn ? "Discovery" : "Découverte",
                body: isEn ? "Analysis of your organization, processes, and constraints to precisely define the scope of intervention." : "Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.",
              },
              {
                num: "02",
                title: isEn ? "Prior Checks" : "Vérifications préalables",
                body: isEn ? "Verification of legal identity, administrative status, and operational consistency to secure the entry into a relationship." : "Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle afin de sécuriser l'entrée en relation.",
              },
              {
                num: "03",
                title: isEn ? "Analysis" : "Analyse",
                body: isEn ? "Construction of an operational proposal adapted to your needs, including profiles, organizational mode, and expected deliverables." : "Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.",
              },
              {
                num: "04",
                title: isEn ? "Implementation & Training" : "Mise en œuvre & formation",
                body: isEn ? "Deployment of teams and integration into your organization's tools, processes, and standards." : "Déploiement des équipes et intégration aux outils, process et standards de votre organisation.",
              },
              {
                num: "05",
                title: isEn ? "Long-term Follow-up" : "Suivi dans la durée",
                body: isEn ? "Continuous monitoring of the mission, regular adjustments, and quality control of deliverables." : "Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "2px",
                  padding: "2rem 1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  transition: "box-shadow 0.3s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--beige)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--text-dark)",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.75 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCRÉDITATIONS ── */}
      <section
        id="accreditations"
        style={{ padding: "6rem 2rem", background: "var(--green-dark)", color: "#fff" }}
      >
        <div className="container" style={{ maxWidth: "1100px" }}>
          <SectionTitle light>{isEn ? "Accreditations, certifications & framework" : "Accréditations, certifications & cadre d'intervention"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "2.5rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "A demanding framework, certified skills" : "Un cadre exigeant, des compétences certifiées"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
            {[
              isEn ? "MENUA CONSULTING operates in environments subject to high regulatory requirements." : "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
              isEn ? "The director notably holds AMF certification, certification in Internal Control and Risk Management of financial institutions, as well as experience acquired in financial, wealth, and regulated environments." : "La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.",
              isEn ? "The firm acts in coordination with the authorized teams of its clients (banks, firms, regulated structures)." : "Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).",
              isEn ? "This system guarantees compliance, the quality of operations, and the security of processes." : "Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
            ].map((p, index) => (
              <p
                key={index}
                style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
          </div>
          {/* Badges */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {[
              { label: isEn ? "AMF Certification" : "Certification AMF", desc: isEn ? "Financial Markets Authority" : "Autorité des marchés financiers" },
              { label: isEn ? "Internal Control & Risks" : "Contrôle Interne & Risques", desc: isEn ? "Financial Institutions" : "Institutions financières" },
              { label: isEn ? "Operational Resources" : "Ressources opérationnelles", desc: isEn ? "Under client supervision" : "Sous supervision client" },
              { label: isEn ? "Not inherently regulated" : "Non réglementé en propre", desc: isEn ? "Execution within client framework" : "Exécution dans le cadre client" },
            ].map((badge, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderTop: "3px solid var(--gold)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {badge.label}
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ── */}
      <section id="equipe" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <SectionTitle>{isEn ? "Our Team" : "Notre équipe"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "0.5rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "Management closely involved with operations" : "Une direction impliquée au plus près des opérations"}
          </h2>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              <strong style={{ color: "var(--text-dark)", fontWeight: 600 }}>Rosette Fouelefack</strong> {isEn ? "is the Managing Director of MENUA CONSULTING. She has experience in finance, risk management, wealth management, and back & middle office operations acquired in demanding environments. She directly supervises the structuring of missions, team composition, deliverable validation, and the quality control system." : "est directrice générale de MENUA CONSULTING. Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants. Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité."}
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced employees or partners mobilized according to client needs." : "MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients."}
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "Each mission is framed by tracking, validation, and control procedures to ensure an execution level that meets the client's expectations and the rigorous standards expected in the French market." : "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français."}
            </p>
          </div>
          {/* Principe 4 yeux */}
          <div
            style={{
              marginTop: "3rem",
              borderLeft: "3px solid var(--gold)",
              paddingLeft: "1.75rem",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              background: "var(--beige-bg)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                fontStyle: "italic",
                color: "var(--text-dark)",
                lineHeight: 1.75,
              }}
            >
              {isEn ? "MENUA CONSULTING relies on a four-eyes principle and continuous supervision of operations to guarantee reliability, rigor, and continuity of service." : "MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service."}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BAS DE PAGE ── */}
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl section-lbl--light">{isEn ? "Contact us" : "Nous contacter"}</p>
            <div className="section-lbl-line" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            {isEn ? "Present your operational needs, and we will respond with an initial analysis and a tailored proposal." : "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée."}
          </p>
          <Link
            href={`/${lang}/nous-contacter`}
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              background: "var(--beige-bg)",
              color: "var(--green-dark)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            {isEn ? "Submit a need" : "Présenter un besoin"}
          </Link>
        </div>
      </section>
    </main>
  );
}
