import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Firm – MENUA CONSULTING" : "Présentation du cabinet – MENUA CONSULTING",
  };
}

export default async function Presentation({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Firm" : "Présentation du cabinet"}
        subtitle={isEn ? "MENUA CONSULTING is a firm dedicated to operational execution." : "Un cabinet dédié à l'exécution opérationnelle."}
      />
      <section style={{ padding: "6rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>{isEn ? "Our Firm" : "Présentation du cabinet"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "2rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "A firm dedicated to operational execution" : "Un cabinet dédié à l'exécution opérationnelle"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              isEn ? "MENUA CONSULTING is a firm specializing in the operational outsourcing of back and middle office functions in finance, accounting, compliance, wealth management, and data." : "MENUA CONSULTING est un cabinet spécialisé dans l'externalisation opérationnelle des fonctions back et middle office en finance, comptabilité, conformité, gestion de patrimoine et data.",
              isEn ? "We provide companies, firms, and financial players with dedicated operational teams capable of executing demanding missions with rigor, continuity, and reliability." : "Nous mettons à disposition des entreprises, cabinets et acteurs financiers des équipes opérationnelles dédiées, capables d'exécuter des missions exigeantes avec rigueur, continuité et fiabilité.",
              isEn ? "Our employees integrate with client organizations to take charge of operational execution, optimize internal workloads, and secure the continuity of operations." : "Nos collaborateurs s'intègrent aux organisations clientes afin de prendre en charge l'exécution opérationnelle, d'optimiser les charges internes et de sécuriser la continuité des opérations.",
              isEn ? "This organization allows clients to focus on their core business while guaranteeing controlled, fluid, and sustainable processes." : "Cette organisation permet aux clients de se concentrer sur leur cœur de métier, tout en garantissant des processus maîtrisés, fluides et pérennes.",
            ].map((p, index) => (
              <p
                key={index}
                style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
