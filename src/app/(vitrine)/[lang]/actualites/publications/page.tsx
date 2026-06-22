import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Publications – MENUA CONSULTING" : "Nos publications – MENUA CONSULTING",
  };
}

export default async function Publications({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Publications" : "Nos publications"}
        subtitle={isEn ? "Find our insights on LinkedIn." : "Retrouvez nos prises de parole sur LinkedIn."}
      />
      <section style={{ padding: "5rem 2rem", background: "var(--beige-bg)", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>{isEn ? "Our Publications" : "Nos publications"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            {isEn ? "Find our insights on LinkedIn" : "Retrouvez nos prises de parole sur LinkedIn"}
          </h2>
          <p style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "2rem" }}>
            {isEn ? "Find the insights, analyses, and content published by MENUA CONSULTING on operational, regulatory, and sector-specific issues." : "Retrouvez les prises de parole, analyses et contenus publiés par MENUA CONSULTING sur les enjeux opérationnels, réglementaires et sectoriels."}
          </p>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 2rem",
              background: "var(--green-dark)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.981 1.981 0 0 1-1.977-1.98 1.981 1.981 0 1 1 3.96 0 1.981 1.981 0 0 1-1.983 1.98zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {isEn ? "Follow MENUA CONSULTING on LinkedIn" : "Suivre MENUA CONSULTING sur LinkedIn"}
          </a>
          <p style={{ fontSize: "0.73rem", color: "var(--text-light)", marginTop: "1rem", fontStyle: "italic" }}>
            {isEn ? "The link to the official MENUA CONSULTING LinkedIn page will be integrated once created." : "Le lien vers la page LinkedIn officielle de MENUA CONSULTING sera intégré dès sa création."}
          </p>
        </div>
      </section>
    </main>
  );
}
