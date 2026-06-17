import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nous connaître – MENUA CONSULTING",
  description:
    "Découvrez MENUA CONSULTING, cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité et gestion de patrimoine.",
};

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

export default function NousConnaitre() {
  return (
    <main>
      {/* ── HERO ── */}
      <PageHeader
        title="Nous connaître"
        subtitle="MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office. Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation."
      />

      {/* ── PRÉSENTATION DU CABINET ── */}
      <section id="presentation" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>Présentation du cabinet</SectionTitle>
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
            Un cabinet dédié à l'exécution opérationnelle
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              "MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
              "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
              "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
              "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
            ].map((p) => (
              <p
                key={p.slice(0, 30)}
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
          <SectionTitle>Notre approche</SectionTitle>
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
            Une posture résolument opérationnelle
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent
              les besoins, les méthodes et les priorités, nous assurons l'exécution.
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              Nous intervenons dans des environnements financiers, comptables, patrimoniaux et réglementés,
              en respectant strictement les procédures internes, les circuits de validation et les exigences
              de qualité propres à chaque organisation.
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              Nos équipes peuvent intervenir en français et en anglais, garantissant une gestion fluide
              des échanges, des reportings et des opérations dans un contexte international.
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
              { label: "Continuité opérationnelle" },
              { label: "Traçabilité des actions" },
              { label: "Fiabilité des livrables" },
            ].map((pilier) => (
              <div
                key={pilier.label}
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
          <SectionTitle>Notre méthodologie</SectionTitle>
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
            Un processus structuré en cinq étapes
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
                title: "Découverte",
                body: "Analyse de votre organisation, de vos processus et de vos contraintes afin de définir précisément le périmètre d'intervention.",
              },
              {
                num: "02",
                title: "Vérifications préalables",
                body: "Vérification de l'identité juridique, de la situation administrative et de la cohérence opérationnelle afin de sécuriser l'entrée en relation.",
              },
              {
                num: "03",
                title: "Analyse",
                body: "Construction d'une proposition opérationnelle adaptée à vos besoins, incluant les profils, le mode d'organisation et les livrables attendus.",
              },
              {
                num: "04",
                title: "Mise en œuvre & formation",
                body: "Déploiement des équipes et intégration aux outils, process et standards de votre organisation.",
              },
              {
                num: "05",
                title: "Suivi dans la durée",
                body: "Pilotage continu de la mission, ajustements réguliers et contrôle qualité des livrables.",
              },
            ].map((step) => (
              <div
                key={step.num}
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
          <SectionTitle light>Accréditations, certifications &amp; cadre d'intervention</SectionTitle>
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
            Un cadre exigeant, des compétences certifiées
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
            {[
              "MENUA CONSULTING intervient dans des environnements soumis à des exigences réglementaires élevées.",
              "La dirigeante dispose notamment de la certification AMF, d'une certification en Contrôle Interne et Gestion des Risques des institutions financières, ainsi que d'une expérience acquise au sein d'environnements financiers, patrimoniaux et réglementés.",
              "Le cabinet intervient en coordination avec les équipes habilitées de ses clients (banques, cabinets, structures réglementées).",
              "Ce dispositif garantit la conformité, la qualité des opérations et la sécurité des processus.",
            ].map((p) => (
              <p
                key={p.slice(0, 30)}
                style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
          </div>
          {/* Badges */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {[
              { label: "Certification AMF", desc: "Autorité des marchés financiers" },
              { label: "Contrôle Interne & Risques", desc: "Institutions financières" },
              { label: "Ressources opérationnelles", desc: "Sous supervision client" },
              { label: "Non réglementé en propre", desc: "Exécution dans le cadre client" },
            ].map((badge) => (
              <div
                key={badge.label}
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
          <SectionTitle>Notre équipe</SectionTitle>
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
            Une direction impliquée au plus près des opérations
          </h2>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              <strong style={{ color: "var(--text-dark)", fontWeight: 600 }}>Rosette Fouelefack</strong> est
              directrice générale de MENUA CONSULTING. Elle dispose d'une expérience en finance, gestion des
              risques, gestion de patrimoine et opérations back &amp; middle office acquise au sein
              d'environnements exigeants. Elle supervise directement la structuration des missions, la
              constitution des équipes, la validation des livrables et le dispositif de contrôle qualité.
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle
              en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des
              clients.
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin
              de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur
              attendus sur le marché français.
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
              MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue
              des opérations afin de garantir fiabilité, rigueur et continuité de service.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BAS DE PAGE ── */}
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl section-lbl--light">Nous contacter</p>
            <div className="section-lbl-line" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.
          </p>
          <Link
            href="/nous-contacter"
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
            Présenter un besoin
          </Link>
        </div>
      </section>
    </main>
  );
}
