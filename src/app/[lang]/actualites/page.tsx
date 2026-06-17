import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "News – MENUA CONSULTING" : "Actualités – MENUA CONSULTING",
    description: isEn
      ? "Follow the news of MENUA CONSULTING: our latest posts, our analyses and our advice in operational outsourcing."
      : "Veille financière, comptable, réglementaire et opérationnelle de MENUA CONSULTING. Actualités financières, publications et analyses sectorielles.",
  };
}

/* Articles exemple — à remplacer par des données CMS */
const getArticles = (isEn: boolean) => [
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

const getCategories = (isEn: boolean) => [
  { label: isEn ? "Featured" : "À la une", id: "une" },
  { label: isEn ? "Financial & Regulatory News" : "Actualités financières & réglementaires", id: "financieres" },
  { label: isEn ? "Our Publications" : "Nos publications", id: "publications" },
];

export default async function Actualites({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const articles = getArticles(isEn);
  const categories = getCategories(isEn);

  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section
        style={{
          paddingTop: "9rem",
          paddingBottom: "5rem",
          background: "var(--beige-bg)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="section-lbl">MENUA CONSULTING</p>
            <div className="section-lbl-line" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "var(--text-dark)",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            {isEn ? "News" : "Actualités"}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "680px", fontWeight: 300 }}>
            {isEn ? "MENUA CONSULTING provides regular monitoring of financial, accounting, wealth, regulatory, and operational developments to enlighten its clients on issues impacting their activities." : "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d'éclairer ses clients sur les enjeux qui impactent leurs activités."}
          </p>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section style={{ padding: "3rem 2rem", background: "#fff", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <nav style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-mid)",
                  textDecoration: "none",
                  paddingBottom: "0.35rem",
                  borderBottom: "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── À LA UNE ── */}
      <section id="une" style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div className="container">
          <div className="section-label-wrap" style={{ marginBottom: "2.5rem" }}>
            <p className="section-lbl">{isEn ? "Featured" : "À la une"}</p>
            <div className="section-lbl-line" />
          </div>
          <div className="news-grid">
            {articles.map((article) => (
              <article key={article.id} className="news-card">
                {/* Placeholder image */}
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

      {/* ── NOS PUBLICATIONS ── */}
      <section id="publications" style={{ padding: "5rem 2rem", background: "var(--beige-bg)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl">{isEn ? "Our Publications" : "Nos publications"}</p>
            <div className="section-lbl-line" />
          </div>
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
