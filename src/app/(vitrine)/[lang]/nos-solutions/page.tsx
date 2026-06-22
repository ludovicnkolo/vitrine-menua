import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Solutions – MENUA CONSULTING" : "Nos solutions – MENUA CONSULTING",
    description: isEn
      ? "Discover the operational outsourcing solutions of MENUA CONSULTING: from the provision of resources to the complete taking over of processes."
      : "Urgence, durée, volume, mode d'organisation, langues : MENUA CONSULTING adapte ses dispositifs d'externalisation opérationnelle à vos contraintes.",
  };
}

export default async function NosSolutionsHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const subpages = isEn ? [
    { title: "Urgency", href: `/${lang}/nos-solutions/urgence`, desc: "Reaction capability" },
    { title: "Duration", href: `/${lang}/nos-solutions/duree`, desc: "Contractual flexibility" },
    { title: "Volume", href: `/${lang}/nos-solutions/volume`, desc: "Team sizing" },
    { title: "Organizational Mode", href: `/${lang}/nos-solutions/organisation`, desc: "How the work is executed" },
    { title: "Languages", href: `/${lang}/nos-solutions/langues`, desc: "Bilingual English / French intervention" },
  ] : [
    { title: "Urgence", href: `/${lang}/nos-solutions/urgence`, desc: "Capacité de réaction" },
    { title: "Durée", href: `/${lang}/nos-solutions/duree`, desc: "Flexibilité contractuelle" },
    { title: "Volume", href: `/${lang}/nos-solutions/volume`, desc: "Dimensionnement de l'équipe" },
    { title: "Mode d'organisation", href: `/${lang}/nos-solutions/organisation`, desc: "Comment le travail est exécuté" },
    { title: "Langues", href: `/${lang}/nos-solutions/langues`, desc: "Intervention bilingue français / anglais" },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Solutions" : "Nos solutions"}
        subtitle={isEn ? "We design tailor-made outsourcing setups adapted to your operational constraints regarding urgency, duration, volume, and organization." : "Nous concevons des dispositifs d'externalisation sur mesure, adaptés à vos contraintes opérationnelles d'urgence, de durée, de volume et d'organisation."}
        imageSrc="/nos_solutions_hero.png"
      />

      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container page-container">
          <SectionTitle>{isEn ? "Explore our setups" : "Explorer nos dispositifs"}</SectionTitle>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            {subpages.map((page, idx) => (
              <Link key={idx} href={page.href} style={{ textDecoration: "none" }}>
                <div className="hub-card" style={{
                  padding: "2rem",
                  border: "1px solid var(--border-light)",
                  borderRadius: "8px",
                  background: "var(--beige-bg)",
                  height: "100%",
                }}>
                  <h3 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    marginBottom: "0.5rem"
                  }}>
                    {page.title} &rarr;
                  </h3>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--text-mid)",
                    lineHeight: 1.6
                  }}>
                    {page.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ── CTA ── */}
      <section style={{ padding: "5rem 2rem", background: "#fff", borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl">{isEn ? "Submit a need" : "Présenter un besoin"}</p>
            <div className="section-lbl-line" />
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-mid)",
              lineHeight: 1.8,
              margin: "0 auto 2rem",
              maxWidth: "520px",
            }}
          >
            {isEn ? "Present your operational needs, and we will respond with an initial analysis and a tailored proposal." : "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée."}
          </p>
          <Link
            href={`/${lang}/nous-contacter`}
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              background: "var(--green-dark)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            {isEn ? "Contact us" : "Nous contacter"}
          </Link>
        </div>
      </section>
    </main>
  );
}
