import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Get to Know Us – MENUA CONSULTING" : "Nous connaître – MENUA CONSULTING",
    description: isEn
      ? "Discover MENUA CONSULTING, your partner in operational outsourcing and specialized support for your back and middle office functions."
      : "Découvrez MENUA CONSULTING, cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité et gestion de patrimoine.",
  };
}

export default async function NousConnaitreHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const subpages = isEn ? [
    { title: "Our Firm", href: `/${lang}/nous-connaitre/presentation`, desc: "A firm dedicated to operational execution." },
    { title: "Our Approach", href: `/${lang}/nous-connaitre/approche`, desc: "A resolutely operational stance." },
    { title: "Our Methodology", href: `/${lang}/nous-connaitre/methodologie`, desc: "A structured five-step process." },
    { title: "Accreditations", href: `/${lang}/nous-connaitre/accreditations`, desc: "A demanding framework, certified skills." },
    { title: "Our Team", href: `/${lang}/nous-connaitre/equipe`, desc: "Management closely involved with operations." },
  ] : [
    { title: "Présentation du cabinet", href: `/${lang}/nous-connaitre/presentation`, desc: "Un cabinet dédié à l'exécution opérationnelle." },
    { title: "Notre approche", href: `/${lang}/nous-connaitre/approche`, desc: "Une posture résolument opérationnelle." },
    { title: "Notre méthodologie", href: `/${lang}/nous-connaitre/methodologie`, desc: "Un processus structuré en cinq étapes." },
    { title: "Accréditations & certifications", href: `/${lang}/nous-connaitre/accreditations`, desc: "Un cadre exigeant, des compétences certifiées." },
    { title: "Notre équipe", href: `/${lang}/nous-connaitre/equipe`, desc: "Une direction impliquée au plus près des opérations." },
  ];

  return (
    <main>
      <PageHeader
        title={isEn ? "About Us" : "Nous connaître"}
        subtitle={isEn ? "MENUA CONSULTING supports companies in the operational outsourcing of back and middle office functions. We intervene to support internal teams within a structured framework, defined by the methods, priorities, and requirements of each organization." : "MENUA CONSULTING accompagne les entreprises dans l'externalisation opérationnelle de fonctions back et middle office. Nous intervenons en support des équipes internes dans un cadre structuré, défini par les méthodes, les priorités et les exigences de chaque organisation."}
      />

      <section style={{ padding: "5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container page-container">
          <SectionTitle>{isEn ? "Explore our sections" : "Explorer nos sections"}</SectionTitle>
          
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
