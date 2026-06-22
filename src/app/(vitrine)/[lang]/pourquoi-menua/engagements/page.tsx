import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Commitments – MENUA CONSULTING" : "Nos engagements – MENUA CONSULTING",
  };
}

export default async function Engagements({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Commitments" : "Nos engagements"}
        subtitle={isEn ? "Our promise for your demanding challenges." : "Notre promesse pour vos enjeux exigeants."}
      />
      <section
        style={{ padding: "6rem 2rem", background: "var(--green-dark)", minHeight: "60vh" }}
      >
        <div className="container page-container">
          <SectionTitle light>{isEn ? "Our Promise" : "Notre promesse"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            {isEn ? "Our Commitments" : "Nos engagements"}
          </h2>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            {isEn ? "MENUA CONSULTING commits to the essential: the quality of deliverables, respect for deadlines, traceability of operations, and clear communication with your teams." : "MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes."}
          </p>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            {isEn ? "Our interventions rely on four-eyes control, structured working methods, training of mobilized resources, and adherence to your operational, quality, and regulatory requirements." : "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires."}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              isEn ? "Quality of deliverables" : "Qualité des livrables",
              isEn ? "Respect for deadlines" : "Respect des délais",
              isEn ? "Traceability of operations" : "Traçabilité des opérations",
              isEn ? "Four-eyes control" : "Contrôle à quatre yeux",
              isEn ? "Clear and regular communication" : "Communication claire et régulière",
              isEn ? "Training of mobilized resources" : "Formation des ressources mobilisées",
              isEn ? "Adherence to your operational, quality, and regulatory requirements" : "Respect de vos exigences opérationnelles, qualité et réglementaires",
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                }}
              >
                <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
