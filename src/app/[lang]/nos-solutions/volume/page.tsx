import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Volume – MENUA CONSULTING" : "Volume – MENUA CONSULTING",
  };
}

export default async function Volume({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "A dedicated resource on a specific scope",
      "A temporary reinforcement to absorb an activity overload",
      "An operational team to manage a large volume or multiple simultaneous flows",
      "A scalable setup adjusted according to the workload, priorities, and client requirements",
      "An organization allowing to ensure continuity of processing in case of absence or activity variation",
    ] : [
      "Une ressource dédiée sur un périmètre précis",
      "Un renfort ponctuel pour absorber une surcharge d'activité",
      "Une équipe opérationnelle pour gérer un volume important ou plusieurs flux simultanés",
      "Un dispositif évolutif ajusté selon la charge, les priorités et les exigences du client",
      "Une organisation permettant d'assurer la continuité du traitement en cas d'absence ou de variation d'activité",
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Volume" : "Volume"}
        subtitle={isEn ? "MENUA CONSULTING adapts the sizing of its resources to the volume of files, flows, or operations to be processed, while ensuring the continuity and security of execution." : "MENUA CONSULTING adapte le dimensionnement de ses ressources au volume de dossiers, de flux ou d'opérations à traiter, tout en veillant à la continuité et à la sécurisation de l'exécution."}
      />
      <section style={{ padding: "6rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4rem", alignItems: "start" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1, userSelect: "none" }}>
              03
            </span>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Team sizing" : "Dimensionnement de l'équipe"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Volume" : "Volume"}
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
