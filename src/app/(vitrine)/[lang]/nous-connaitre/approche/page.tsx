import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Approach – MENUA CONSULTING" : "Notre approche – MENUA CONSULTING",
  };
}

export default async function Approche({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Approach" : "Notre approche"}
        subtitle={isEn ? "A resolutely operational stance." : "Une posture résolument opérationnelle."}
      />
      <section className="page-section">
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
    </main>
  );
}
