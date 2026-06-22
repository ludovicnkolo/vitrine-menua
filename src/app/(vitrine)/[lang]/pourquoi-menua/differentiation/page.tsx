import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Differentiation – MENUA CONSULTING" : "Notre différenciation – MENUA CONSULTING",
  };
}

export default async function Differentiation({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Differentiation" : "Notre différenciation"}
        subtitle={isEn ? "Why choose us?" : "Pourquoi nous choisir ?"}
      />
      <section
        style={{
          padding: "6rem 2rem",
          background: "var(--beige-bg)",
          minHeight: "60vh"
        }}
      >
        <div className="container page-container">
          <SectionTitle>{isEn ? "Why choose us?" : "Pourquoi nous choisir ?"}</SectionTitle>
          <h2 className="page-title">
            {isEn ? "Our differentiation" : "Notre différenciation"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
              marginTop: "2rem",
            }}
          >
            <div>
              <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "1rem" }}>
                {isEn ? "Specialists in back and middle office, we do not stop at analysis: we execute." : "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons."}
              </p>
              <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
                {isEn ? "Our 100% operational approach, our integration into client organizations, and our ability to intervene in English as well as French allow us to operate in demanding, structured, and internationally open environments." : "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international."}
              </p>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                isEn ? "Back and middle office specialization" : "Spécialisation back et middle office",
                isEn ? "100% operational approach" : "Approche 100% opérationnelle",
                isEn ? "Integration into your organization" : "Intégration à votre organisation",
                isEn ? "Reliable and continuous execution" : "Exécution fiable et continue",
                isEn ? "Quality supervision of deliverables" : "Supervision qualité des livrables",
                isEn ? "Bilingual English / French intervention" : "Intervention bilingue français / anglais",
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingLeft: "1.25rem",
                    borderLeft: "3px solid var(--green-dark)",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "0.87rem", color: "var(--text-dark)", fontWeight: 500 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
