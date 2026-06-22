import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Methodology – MENUA CONSULTING" : "Notre méthodologie – MENUA CONSULTING",
  };
}

export default async function Methodologie({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Methodology" : "Notre méthodologie"}
        subtitle={isEn ? "A structured five-step process." : "Un processus structuré en cinq étapes."}
      />
      <section className="page-section">
        <div className="container page-container">
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
    </main>
  );
}
