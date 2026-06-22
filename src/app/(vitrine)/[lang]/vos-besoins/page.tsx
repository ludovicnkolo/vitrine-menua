import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Your Needs – MENUA CONSULTING" : "Vos besoins – MENUA CONSULTING",
    description: isEn
      ? "Finance & reporting, management control, risks & compliance, accounting & data support, wealth management: discover how MENUA CONSULTING meets your operational needs."
      : "Finance & reporting, contrôle de gestion, risques & conformité, support comptable & data, gestion de patrimoine : découvrez comment MENUA CONSULTING répond à vos besoins opérationnels.",
  };
}

export default async function VosBesoinsHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const subpages = isEn ? [
    { title: "Finance & reporting", href: `/${lang}/vos-besoins/finance`, desc: "Core business offering" },
    { title: "Management control", href: `/${lang}/vos-besoins/controle`, desc: "Internal cost and performance optimization" },
    { title: "Risk & compliance", href: `/${lang}/vos-besoins/risques`, desc: "Regulatory securing" },
    { title: "Accounting & data support", href: `/${lang}/vos-besoins/comptable`, desc: "Operational back-office" },
    { title: "Wealth management", href: `/${lang}/vos-besoins/patrimoine`, desc: "Specialized assistance" },
    { title: "Other operational needs", href: `/${lang}/vos-besoins/autres`, desc: "Flexibility & agility" },
  ] : [
    { title: "Finance & reporting", href: `/${lang}/vos-besoins/finance`, desc: "Offre cœur métier" },
    { title: "Contrôle de gestion", href: `/${lang}/vos-besoins/controle`, desc: "Optimisation interne des coûts et performance" },
    { title: "Risques & conformité", href: `/${lang}/vos-besoins/risques`, desc: "Sécurisation réglementaire" },
    { title: "Support comptable & data", href: `/${lang}/vos-besoins/comptable`, desc: "Back-office opérationnel" },
    { title: "Gestion de patrimoine", href: `/${lang}/vos-besoins/patrimoine`, desc: "Assistance spécialisée" },
    { title: "Autres besoins opérationnels", href: `/${lang}/vos-besoins/autres`, desc: "Flexibilité & agilité" },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Your Needs" : "Vos besoins"}
        subtitle={isEn ? "MENUA CONSULTING operates in support of financial, accounting, wealth management, IT, and regulated teams on all back and middle office functions requiring rigor, continuity, and operational reliability." : "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle."}
        imageSrc="/vos_besoins_hero.png"
      />

      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container page-container">
          <SectionTitle>{isEn ? "Explore our services" : "Explorer nos services"}</SectionTitle>
          
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
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center", padding: "5rem 2rem" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl">{isEn ? "Submit a need" : "Présenter un besoin"}</p>
            <div className="section-lbl-line" />
          </div>
          <p
            style={{
              color: "var(--text-mid)",
              fontSize: "1rem",
              margin: "0 auto 2rem",
              maxWidth: "520px",
            }}
          >
            {isEn ? "Your need is not on this list? Contact us, we study any specific operational requirement." : "Votre besoin ne figure pas dans cette liste ? Contactez-nous, nous étudions tout besoin opérationnel spécifique."}
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
