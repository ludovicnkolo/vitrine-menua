import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Duration – MENUA CONSULTING" : "Durée – MENUA CONSULTING",
  };
}

export default async function Duree({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Short mission to address an identified need over a limited period",
      "Long mission to support the management of a portfolio of cases over time",
      "Continuous outsourcing to sustainably entrust all or part of your operational activities",
      "Occasional intervention on a volume of accounting, financial, wealth, or administrative files",
      "Adjustment of the setup according to the evolution of the workload and the client's priorities",
    ] : [
      "Mission courte pour traiter un besoin identifié sur une période limitée",
      "Mission longue pour accompagner la gestion d'un portefeuille de dossiers dans la durée",
      "Externalisation continue pour confier durablement tout ou partie de vos activités opérationnelles",
      "Intervention ponctuelle sur un volume de dossiers comptables, financiers, patrimoniaux ou administratifs",
      "Ajustement du dispositif selon l'évolution de la charge et des priorités du client",
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Duration" : "Durée"}
        subtitle={isEn ? "MENUA CONSULTING offers flexible outsourcing setups, adapted to processing a set number of cases as well as ongoing recurring management of a larger portfolio." : "MENUA CONSULTING propose des dispositifs d'externalisation flexibles, adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente d'un portefeuille plus important."}
      />
      <section className="page-section">
        <div className="container page-container">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "5rem", fontWeight: 400, color: "var(--beige-light)", lineHeight: 1, userSelect: "none" }}>
              02
            </span>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "0.75rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Contractual flexibility" : "Flexibilité contractuelle"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Duration" : "Durée"}
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "2.5rem" }}>
                {items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border-light)", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.7 }}>{item}</span>
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
