import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

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

export default async function ActualitesHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const subpages = isEn ? [
    { title: "Featured", href: `/${lang}/actualites/une`, desc: "Our latest articles and insights." },
    { title: "Financial News", href: `/${lang}/actualites/financieres`, desc: "Stay informed on the latest regulatory and financial updates." },
    { title: "Our Publications", href: `/${lang}/actualites/publications`, desc: "Find our insights on LinkedIn." },
  ] : [
    { title: "À la une", href: `/${lang}/actualites/une`, desc: "Nos derniers articles et analyses." },
    { title: "Actualités financières", href: `/${lang}/actualites/financieres`, desc: "Restez informé des dernières évolutions réglementaires et financières." },
    { title: "Nos publications", href: `/${lang}/actualites/publications`, desc: "Retrouvez nos prises de parole sur LinkedIn." },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "News" : "Actualités"}
        subtitle={isEn ? "MENUA CONSULTING provides regular monitoring of financial, accounting, wealth, regulatory, and operational developments to enlighten its clients on issues impacting their activities." : "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales, réglementaires et opérationnelles afin d'éclairer ses clients sur les enjeux qui impactent leurs activités."}
        imageSrc="/paris-hero.jpg"
      />

      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <SectionTitle>{isEn ? "Explore our categories" : "Explorer nos catégories"}</SectionTitle>
          
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
    </main>
  );
}
