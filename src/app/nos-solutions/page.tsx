import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nos solutions – MENUA CONSULTING",
  description:
    "Urgence, durée, volume, mode d'organisation, langues : MENUA CONSULTING adapte ses dispositifs d'externalisation opérationnelle à vos contraintes.",
};

const solutions = [
  {
    id: "urgence",
    num: "01",
    title: "Urgence",
    role: "Capacité de réaction",
    description:
      "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service.",
    items: [
      "Surcharge d'activité ou pic de dossiers",
      "Remplacement temporaire d'un collaborateur absent",
      "Renfort ponctuel en période de clôture ou de reporting",
      "Traitement accéléré de dossiers en retard ou en attente",
      "Mise à disposition progressive de ressources pour sécuriser la montée en charge",
    ],
  },
  {
    id: "duree",
    num: "02",
    title: "Durée",
    role: "Flexibilité contractuelle",
    description:
      "MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important.",
    items: [
      "Mission courte pour traiter un besoin identifié sur une période limitée",
      "Mission longue pour accompagner la gestion d'un portefeuille de dossiers dans la durée",
      "Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles",
      "Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs",
      "Ajustement du dispositif selon l'évolution de la charge et des priorités du client",
    ],
  },
  {
    id: "volume",
    num: "03",
    title: "Volume",
    role: "Dimensionnement de l'équipe",
    description:
      "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution.",
    items: [
      "Une ressource dédiée sur un périmètre précis",
      "Un renfort ponctuel pour absorber une surcharge d'activité",
      "Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés",
      "Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client",
      "Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité",
    ],
  },
  {
    id: "organisation",
    num: "04",
    title: "Mode d'organisation",
    role: "Comment le travail est exécuté",
    description:
      "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis.",
    items: [
      "Dispositif dédié pour un service ou un périmètre clairement identifié",
      "Intervention par mission pour un besoin borné dans le temps ou un projet spécifique",
      "Prise en charge de flux ou de process récurrents",
      "Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes",
      "Suivi structuré avec points de contrôle réguliers",
    ],
  },
];

export default function NosSolutions() {
  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section
        style={{
          paddingTop: "9rem",
          paddingBottom: "5rem",
          background: "var(--green-dark)",
        }}
      >
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="section-lbl section-lbl--light">MENUA CONSULTING</p>
            <div className="section-lbl-line" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            Nos solutions
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.85,
              maxWidth: "680px",
              fontWeight: 300,
            }}
          >
            Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes
            opérationnelles d'urgence, de durée, de volume et d'organisation.
          </p>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      {solutions.map((sol, idx) => (
        <section
          key={sol.id}
          id={sol.id}
          style={{
            padding: "6rem 2rem",
            background: idx % 2 === 0 ? "#fff" : "var(--beige-bg)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <div className="container" style={{ maxWidth: "1100px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "4rem",
                alignItems: "start",
              }}
            >
              {/* Numéro */}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "5rem",
                  fontWeight: 400,
                  color: "var(--beige-light)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {sol.num}
              </span>
              {/* Contenu */}
              <div>
                <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                  <p className="section-lbl" style={{ color: "var(--gold)" }}>{sol.role}</p>
                  <div className="section-lbl-line" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: "var(--text-dark)",
                    lineHeight: 1.4,
                    marginBottom: "1.25rem",
                  }}
                >
                  {sol.title}
                </h2>
                <p
                  style={{
                    fontSize: "0.93rem",
                    color: "var(--text-mid)",
                    lineHeight: 1.85,
                    maxWidth: "640px",
                    marginBottom: "2.5rem",
                  }}
                >
                  {sol.description}
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {sol.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        paddingLeft: "1rem",
                        borderLeft: "2px solid var(--border-light)",
                        paddingTop: "0.25rem",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      <span style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.7 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── LANGUES ── */}
      <section
        id="langues"
        style={{ padding: "6rem 2rem", background: "var(--green-dark)" }}
      >
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "5rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.15)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              05
            </span>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                <p className="section-lbl section-lbl--light">International</p>
                <div className="section-lbl-line" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "#fff",
                  lineHeight: 1.4,
                  marginBottom: "1.25rem",
                }}
              >
                Langues
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.85,
                  maxWidth: "540px",
                  marginBottom: "1rem",
                }}
              >
                Nous intervenons en <strong style={{ color: "#fff" }}>français</strong> et en{" "}
                <strong style={{ color: "#fff" }}>anglais</strong>.
              </p>
              <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl">Présenter un besoin</p>
            <div className="section-lbl-line" />
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-mid)",
              lineHeight: 1.8,
              margin: "0 auto 2rem",
              maxWidth: "520px",
            }}
          >
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une
            proposition adaptée.
          </p>
          <Link
            href="/nous-contacter"
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              background: "var(--green-dark)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}
