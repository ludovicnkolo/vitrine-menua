import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Urgency – MENUA CONSULTING" : "Urgence – MENUA CONSULTING",
  };
}

export default async function Urgence({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Activity overload or peak in cases",
      "Temporary replacement of an absent employee",
      "Occasional reinforcement during closing or reporting periods",
      "Accelerated processing of late or pending cases",
      "Progressive provision of resources to secure scaling up",
    ] : [
      "Surcharge d'activité ou pic de dossiers",
      "Remplacement temporaire d'un collaborateur absent",
      "Renfort ponctuel en période de clôture ou de reporting",
      "Traitement accéléré de dossiers en retard ou en attente",
      "Mise à disposition progressive de ressources pour sécuriser la montée en charge",
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Urgency" : "Urgence"}
        subtitle={isEn ? "Rapid mobilization of operational resources to meet an immediate need, absorb an activity overload, and ensure the continuity of your service." : "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat, absorber une surcharge d'activité et assurer la continuité de votre service."}
      />
      <section style={{ padding: "6rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1, userSelect: "none" }}>
              01
            </span>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Reaction capability" : "Capacité de réaction"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Urgency" : "Urgence"}
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
