import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Why Menua – MENUA CONSULTING" : "Pourquoi MENUA CONSULTING ? – Bénéfices, différenciation, engagements",
    description: isEn
      ? "Why choose MENUA CONSULTING? Discover our commitments, our methodology and our values to support you in your operational challenges."
      : "Découvrez pourquoi choisir MENUA CONSULTING : gain de temps, réduction des charges internes, approche 100% opérationnelle, contrôle à quatre yeux et intervention bilingue.",
  };
}

export default async function PourquoiMenuaHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const subpages = isEn ? [
    { title: "Our Benefits", href: `/${lang}/pourquoi-menua/benefices`, desc: "Benefits for your organization." },
    { title: "Our Differentiation", href: `/${lang}/pourquoi-menua/differentiation`, desc: "Why choose us?" },
    { title: "Our Commitments", href: `/${lang}/pourquoi-menua/engagements`, desc: "Our promise for your demanding challenges." },
  ] : [
    { title: "Nos bénéfices", href: `/${lang}/pourquoi-menua/benefices`, desc: "Ce que vous gagnez en externalisant vos fonctions avec nous." },
    { title: "Notre différenciation", href: `/${lang}/pourquoi-menua/differentiation`, desc: "Pourquoi nous choisir ?" },
    { title: "Nos engagements", href: `/${lang}/pourquoi-menua/engagements`, desc: "Notre promesse pour vos enjeux exigeants." },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Why MENUA CONSULTING?" : "Pourquoi MENUA CONSULTING ?"}
        subtitle={isEn ? "MENUA CONSULTING supports organizations facing demanding operational execution challenges." : "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants."}
        imageSrc="/building-hero.png"
      />

      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container page-container">
          <SectionTitle>{isEn ? "Explore our commitments" : "Explorer nos engagements"}</SectionTitle>
          
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
