import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Benefits – MENUA CONSULTING" : "Nos bénéfices – MENUA CONSULTING",
  };
}

export default async function Benefices({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Benefits" : "Nos bénéfices"}
        subtitle={isEn ? "Benefits for your organization." : "Bénéfices pour votre organisation."}
      />
      <section style={{ padding: "6rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <SectionTitle>{isEn ? "What you gain" : "Ce que vous gagnez"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            {isEn ? "Benefits for your organization" : "Bénéfices pour votre organisation"}
          </h2>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            {isEn ? "By outsourcing your back and middle office functions to MENUA CONSULTING, you save time, improve your productivity, enhance your reliability, and sustainably support your turnover." : "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires."}
          </p>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            {isEn ? "This organization allows you to reduce your internal costs, better absorb your business volumes, and sustainably retain your customer base." : "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle."}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { title: isEn ? "Time saving" : "Gain de temps", icon: "⏱" },
              { title: isEn ? "Reduction of internal costs" : "Réduction des charges internes", icon: "↘" },
              { title: isEn ? "Increased productivity" : "Productivité accrue", icon: "↑" },
              { title: isEn ? "Enhanced efficiency" : "Efficacité renforcée", icon: "◎" },
              { title: isEn ? "Reliability of operations" : "Fiabilité des opérations", icon: "✓" },
              { title: isEn ? "Customer loyalty" : "Fidélisation de la clientèle", icon: "♾" },
              { title: isEn ? "Supported turnover" : "Chiffre d'affaires soutenu", icon: "→" },
            ].map((b, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "box-shadow 0.3s",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--green-dark)",
                    flexShrink: 0,
                    width: "2rem",
                    textAlign: "center",
                  }}
                >
                  {b.icon}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {b.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
