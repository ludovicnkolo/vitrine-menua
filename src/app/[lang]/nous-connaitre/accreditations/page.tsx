import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Accreditations – MENUA CONSULTING" : "Accréditations – MENUA CONSULTING",
  };
}

export default async function Accreditations({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Accreditations" : "Accréditations"}
        subtitle={isEn ? "A demanding framework, certified skills." : "Un cadre exigeant, des compétences certifiées."}
      />
      <section style={{ padding: "6rem 2rem", background: "var(--green-dark)", color: "#fff", minHeight: "60vh" }}>
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
    </main>
  );
}
