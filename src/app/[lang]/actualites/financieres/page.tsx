import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Financial News – MENUA CONSULTING" : "Actualités financières – MENUA CONSULTING",
  };
}

export default async function Financieres({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Financial & Regulatory News" : "Actualités financières & réglementaires"}
        subtitle={isEn ? "Stay informed on the latest regulatory and financial updates." : "Restez informé des dernières évolutions réglementaires et financières."}
      />
      <section style={{ padding: "6rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <SectionTitle>{isEn ? "Financial News" : "Actualités financières"}</SectionTitle>
          <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.85, fontWeight: 300 }}>
            {isEn 
              ? "This section will soon contain targeted articles on financial and regulatory updates that impact the operational execution of your back and middle office functions." 
              : "Cette section contiendra prochainement des articles ciblés sur l'actualité financière et réglementaire qui impacte l'exécution opérationnelle de vos fonctions back et middle office."}
          </p>
        </div>
      </section>
    </main>
  );
}
