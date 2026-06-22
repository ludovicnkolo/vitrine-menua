import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Languages – MENUA CONSULTING" : "Langues – MENUA CONSULTING",
  };
}

export default async function Langues({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Languages" : "Langues"}
        subtitle={isEn ? "Bilingual English / French intervention." : "Intervention bilingue français / anglais."}
      />
      <section
        style={{ padding: "6rem 2rem", background: "var(--green-dark)", minHeight: "60vh" }}
      >
        <div className="container page-container">
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
                {isEn ? "Languages" : "Langues"}
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
                {isEn ? (
                  <>We intervene in <strong style={{ color: "#fff" }}>French</strong> and in <strong style={{ color: "#fff" }}>English</strong>.</>
                ) : (
                  <>Nous intervenons en <strong style={{ color: "#fff" }}>français</strong> et en <strong style={{ color: "#fff" }}>anglais</strong>.</>
                )}
              </p>
              <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                {isEn ? "Other languages can be considered according to the specific needs of your teams." : "D'autres langues peuvent être étudiées selon les besoins spécifiques de vos équipes."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
