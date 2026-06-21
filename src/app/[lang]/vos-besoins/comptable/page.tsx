import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Accounting & data support – MENUA CONSULTING" : "Support comptable & data – MENUA CONSULTING",
  };
}

export default async function Comptable({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Accounting entry", "Bank reconciliations", "Account lettering", "Control and filing of accounting documents",
      "Preparation of VAT returns", "Preparation of accounting elements for review", "Tracking of client and supplier invoices",
      "Administrative follow-ups for missing documents", "Data cleaning", "Structuring and updating databases",
      "Data consistency control", "Preparation of reporting files", "Consolidation of accounting and operational data", "Archiving and document organization"
    ] : [
      "Saisie comptable", "Rapprochements bancaires", "Lettrage des comptes", "Contrôle et classement des pièces comptables",
      "Préparation des déclarations de TVA", "Préparation des éléments comptables pour révision", "Suivi des factures clients et fournisseurs",
      "Relances administratives liées aux pièces manquantes", "Data cleaning", "Structuration et mise à jour de bases de données",
      "Contrôle de cohérence des données", "Préparation de fichiers de reporting", "Consolidation de données comptables et opérationnelles", "Archivage et organisation documentaire"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Accounting & data support" : "Support comptable & data"}
        subtitle={isEn ? "Operational support to accounting, administrative, and data teams in processing, ensuring reliability, and structuring information necessary for accounting production and reporting." : "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "var(--beige-bg)", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Operational back-office" : "Back-office opérationnel"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Accounting & data support" : "Support comptable & data"}
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
