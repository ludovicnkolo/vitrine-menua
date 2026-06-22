import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Other operational needs – MENUA CONSULTING" : "Autres besoins opérationnels – MENUA CONSULTING",
  };
}

export default async function Autres({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Occasional operational reinforcement missions", "Financial administrative support", "Volume processing of files",
      "Filing, archiving, and document organization", "Preparation and updating of tracking files", "Support in managing cross-functional operations",
      "Assistance in formalizing internal procedures", "Help in structuring operational processes", "Preparation of administrative documents",
      "Tracking of internal or client requests", "Support during periods of activity overload", "Temporary replacement or team support",
      "Coordination between internal teams and outsourced providers", "Study of specific needs not listed in the previous sections"
    ] : [
      "Missions ponctuelles de renfort opérationnel", "Support administratif financier", "Traitement de dossiers en volume",
      "Classement, archivage et organisation documentaire", "Préparation et mise à jour de fichiers de suivi", "Support à la gestion d'opérations transverses",
      "Assistance à la formalisation de procédures internes", "Aide à la structuration de process opérationnels", "Préparation de documents administratifs",
      "Suivi de demandes internes ou clients", "Support en période de surcharge d'activité", "Remplacement ou appui temporaire d'équipe",
      "Coordination entre équipes internes et prestataires externalisés", "Étude de besoins spécifiques non listés dans les rubriques précédentes"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Other operational needs" : "Autres besoins opérationnels"}
        subtitle={isEn ? "Handling of specific, cross-functional, or occasional operational needs that do not exclusively fall under a financial, accounting, wealth, compliance, or data function." : "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "var(--beige-bg)", minHeight: "60vh" }}>
        <div className="container page-container">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Flexibility & agility" : "Flexibilité & agilité"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Other operational needs" : "Autres besoins opérationnels"}
              </h2>
            </div>
            <div style={{ border: "1px solid var(--border-light)", padding: "2.5rem", background: "#fff" }}>
              <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10">
                {items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                    <span style={{ color: "var(--green-dark)", flexShrink: 0, marginTop: "2px", fontSize: "0.75rem" }}>→</span>
                    <span style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{item}</span>
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
