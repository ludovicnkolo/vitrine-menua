import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Management control – MENUA CONSULTING" : "Contrôle de gestion – MENUA CONSULTING",
  };
}

export default async function Controle({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Budget tracking", "Variance analysis between actuals, budget, and forecast", "Dashboards",
      "Performance management", "Tracking of costs, expenses, and margins", "Profitability analysis",
      "Tracking of operational indicators", "Preparation of management reports", "Tracking of turnover and objectives",
      "Updating management files", "Consolidation of management data", "Support to financial departments and operational managers"
    ] : [
      "Suivi budgétaire", "Analyse des écarts entre réalisé, budget et prévisionnel", "Tableaux de bord",
      "Pilotage de performance", "Suivi des coûts, charges et marges", "Analyse de rentabilité",
      "Suivi des indicateurs opérationnels", "Préparation de reportings de gestion", "Suivi du chiffre d'affaires et des objectifs",
      "Mise à jour de fichiers de pilotage", "Consolidation des données de gestion", "Support aux directions financières et responsables opérationnels"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Management control" : "Contrôle de gestion"}
        subtitle={isEn ? "Operational support in budget tracking, variance analysis, and performance management to help organizations better control their costs, margins, and resources." : "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "var(--beige-bg)", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "5rem", alignItems: "start" }}>
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Internal cost and performance optimization" : "Optimisation interne des coûts et performance"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Management control" : "Contrôle de gestion"}
              </h2>
            </div>
            <div style={{ border: "1px solid var(--border-light)", padding: "2.5rem", background: "#fff" }}>
              <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem 2.5rem" }}>
                {items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                    <span style={{ color: "var(--green-dark)", flexShrink: 0, marginTop: "2px", fontSize: "0.75rem" }}>→</span>
                    <span style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
