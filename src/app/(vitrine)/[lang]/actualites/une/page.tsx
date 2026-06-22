import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Featured – MENUA CONSULTING" : "À la une – MENUA CONSULTING",
  };
}

export default async function Une({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const articles = [
    {
      id: 1,
      category: isEn ? "Regulation" : "Réglementation",
      date: isEn ? "June 2026" : "Juin 2026",
      title: isEn ? "KYC / AML evolutions: what changes for financial players" : "Évolutions KYC / AML : ce qui change pour les acteurs financiers",
      excerpt: isEn
        ? "Compliance requirements continue to intensify for financial institutions. Analysis of the main regulatory changes to anticipate."
        : "Les exigences en matière de conformité continuent de s'intensifier pour les établissements financiers. Analyse des principaux changements réglementaires à anticiper.",
      href: "#",
    },
    {
      id: 2,
      category: isEn ? "Finance" : "Finance",
      date: isEn ? "June 2026" : "Juin 2026",
      title: isEn ? "Financial reporting: best practices for outsourcing" : "Reporting financier : les bonnes pratiques d'externalisation",
      excerpt: isEn
        ? "How to structure the outsourcing of your reporting functions to guarantee reliability, traceability, and continuity? A look back at the market's operational standards."
        : "Comment structurer l'externalisation de vos fonctions reporting pour garantir fiabilité, traçabilité et continuité ? Retour sur les standards opérationnels du marché.",
      href: "#",
    },
    {
      id: 3,
      category: isEn ? "Operational" : "Opérationnel",
      date: isEn ? "May 2026" : "Mai 2026",
      title: isEn ? "Wealth management: strengthening the administrative back-office" : "Gestion de patrimoine : renforcer le back-office administratif",
      excerpt: isEn
        ? "PWM firms face an increasing administrative burden. Operational outsourcing solutions secure execution without increasing headcount."
        : "Les cabinets CGP font face à une charge administrative croissante. Les solutions d'externalisation opérationnelle permettent de sécuriser l'exécution sans alourdir les effectifs.",
      href: "#",
    },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Featured" : "À la une"}
        subtitle={isEn ? "Our latest articles and insights." : "Nos derniers articles et analyses."}
      />
      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container">
          <SectionTitle>{isEn ? "Featured" : "À la une"}</SectionTitle>
          <div className="news-grid" style={{ marginTop: "2rem" }}>
            {articles.map((article) => (
              <article key={article.id} className="news-card">
                <div
                  className="news-img"
                  style={{
                    background: "var(--green-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    Menua Consulting
                  </span>
                </div>
                <div className="news-content">
                  <p className="news-date">
                    <span
                      style={{
                        background: "var(--beige-bg)",
                        color: "var(--text-mid)",
                        padding: "0.15rem 0.6rem",
                        borderRadius: "2px",
                        marginRight: "0.5rem",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {article.category}
                    </span>
                    {article.date}
                  </p>
                  <h2 className="news-title">{article.title}</h2>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <div className="cta-row">
                    <p className="cta-label" style={{ fontSize: "0.65rem" }}>{isEn ? "READ" : "LIRE"}</p>
                    <Link href={article.href} className="arrow-btn" style={{ width: "2.2rem", height: "2.2rem" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
