import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Organizational Mode – MENUA CONSULTING" : "Mode d'organisation – MENUA CONSULTING",
  };
}

export default async function Organisation({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Dedicated setup for a clearly identified service or scope",
      "Mission-based intervention for a time-bound need or specific project",
      "Handling of recurring flows or processes",
      "Processing of files, memberships, or operations according to rules defined with your teams",
      "Structured follow-up with regular checkpoints",
    ] : [
      "Dispositif dédié pour un service ou un périmètre clairement identifié",
      "Intervention par mission pour un besoin borné dans le temps ou un projet spécifique",
      "Prise en charge de flux ou de process récurrents",
      "Traitement de dossiers, adhésions ou opérations selon des règles définies avec vos équipes",
      "Suivi structuré avec points de contrôle réguliers",
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Organizational Mode" : "Mode d'organisation"}
        subtitle={isEn ? "MENUA CONSULTING structures its interventions according to the most suitable format for your constraints: dedicated setup, mission-based operation, or handling of defined flows and processes." : "MENUA CONSULTING structure ses interventions selon le format le plus adapté à vos contraintes : dispositif dédié, fonctionnement par mission ou prise en charge de flux et de process définis."}
      />
      <section style={{ padding: "6rem 2rem", background: "var(--beige-bg)", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1, userSelect: "none" }}>
              04
            </span>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "How the work is executed" : "Comment le travail est exécuté"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Organizational Mode" : "Mode d'organisation"}
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "2.5rem" }}>
                {items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border-light)", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.7 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
