import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Team – MENUA CONSULTING" : "Notre équipe – MENUA CONSULTING",
  };
}

export default async function Equipe({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Team" : "Notre équipe"}
        subtitle={isEn ? "Management closely involved with operations." : "Une direction impliquée au plus près des opérations."}
      />
      <section className="page-section">
        <div className="container page-container">
          <SectionTitle>{isEn ? "Our Team" : "Notre équipe"}</SectionTitle>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              marginBottom: "0.5rem",
              lineHeight: 1.45,
            }}
          >
            {isEn ? "Management closely involved with operations" : "Une direction impliquée au plus près des opérations"}
          </h2>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              <strong style={{ color: "var(--text-dark)", fontWeight: 600 }}>Rosette Fouelefack</strong> {isEn ? "is the Managing Director of MENUA CONSULTING. She has experience in finance, risk management, wealth management, and back & middle office operations acquired in demanding environments. She directly supervises the structuring of missions, team composition, deliverable validation, and the quality control system." : "est directrice générale de MENUA CONSULTING. Elle dispose d'une expérience en finance, gestion des risques, gestion de patrimoine et opérations back & middle office acquise au sein d'environnements exigeants. Elle supervise directement la structuration des missions, la constitution des équipes, la validation des livrables et le dispositif de contrôle qualité."}
            </p>
            <div style={{ marginTop: "0.5rem" }}>
              <img src="/LogoSignature.jpeg" alt="Signature Rosette Fouelefack" style={{ height: "65px", objectFit: "contain", mixBlendMode: "multiply" }} />
            </div>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "MENUA CONSULTING relies on an agile organization, composed of operational management in France and outsourced employees or partners mobilized according to client needs." : "MENUA CONSULTING s'appuie sur une organisation agile, composée d'une direction opérationnelle en France et de collaborateurs ou partenaires externalisés mobilisés selon les besoins des clients."}
            </p>
            <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
              {isEn ? "Each mission is framed by tracking, validation, and control procedures to ensure an execution level that meets the client's expectations and the rigorous standards expected in the French market." : "Chaque mission est encadrée par des procédures de suivi, de validation et de contrôle, afin de garantir un niveau d'exécution conforme aux attentes du client et aux standards de rigueur attendus sur le marché français."}
            </p>
          </div>
          {/* Principe 4 yeux */}
          <div
            style={{
              marginTop: "3rem",
              borderLeft: "3px solid var(--gold)",
              paddingLeft: "1.75rem",
              paddingTop: "1rem",
              paddingBottom: "1rem",
              background: "var(--beige-bg)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                fontStyle: "italic",
                color: "var(--text-dark)",
                lineHeight: 1.75,
              }}
            >
              {isEn ? "MENUA CONSULTING relies on a four-eyes principle and continuous supervision of operations to guarantee reliability, rigor, and continuity of service." : "MENUA CONSULTING repose sur un principe de contrôle à quatre yeux et une supervision continue des opérations afin de garantir fiabilité, rigueur et continuité de service."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
