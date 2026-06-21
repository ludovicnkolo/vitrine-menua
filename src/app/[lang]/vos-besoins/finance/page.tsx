import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Finance & reporting – MENUA CONSULTING" : "Finance & reporting – MENUA CONSULTING",
  };
}

export default async function Finance({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Financial reporting", "KPIs & Dashboards", "Performance analysis", "Financial department support",
      "Data consolidation", "Financial analysis", "Preparation of reports for the finance department",
      "Activity tracking", "Monthly / quarterly reporting", "Cash flow reporting",
      "Profitability reporting", "Indicator tracking"
    ] : [
      "Reporting financier", "KPI & Dashboard", "Analyse de performance", "Support direction financière",
      "Consolidation de données", "Analyse financière", "Préparation de reportings pour direction financière",
      "Suivi d'activité", "Reporting mensuel / trimestriel", "Reporting de trésorerie",
      "Reporting de rentabilité", "Suivi des indicateurs"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Finance & reporting" : "Finance & reporting"}
        subtitle={isEn ? "Production, structuring, and ensuring the reliability of financial reporting aimed at performance management, activity monitoring, and decision support." : "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Core business offering" : "Offre cœur métier"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Finance & reporting" : "Finance & reporting"}
              </h2>
            </div>
            <div style={{ border: "1px solid var(--border-light)", padding: "2.5rem", background: "#fff" }}>
              <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10">
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
