import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Risk & Compliance – MENUA CONSULTING" : "Risques & conformité – MENUA CONSULTING",
  };
}

export default async function Risques({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "KYC", "AML-CFT", "AML", "Documentary control", "Analysis and completeness of client files",
      "Verification of supporting documents", "Client onboarding", "Periodic review of files", "KYC remediation",
      "Processing of compliance alerts", "Analysis of unusual movements", "Support to risk and compliance teams",
      "Monitoring of internal procedures", "Preparation of files for validation by authorized teams"
    ] : [
      "KYC", "LCB-FT", "AML", "Contrôle documentaire", "Analyse et complétude des dossiers clients",
      "Vérification des pièces justificatives", "Entrée en relation client", "Revue périodique des dossiers", "Remédiation KYC",
      "Traitement des alertes de conformité", "Analyse des mouvements inhabituels", "Support aux équipes risques et conformité",
      "Suivi des procédures internes", "Préparation de dossiers pour validation par les équipes habilitées"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Risk & Compliance" : "Risques & conformité"}
        subtitle={isEn ? "Operational support to risk and compliance teams in processing, controlling, and ensuring the reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements." : "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Regulatory securing" : "Sécurisation réglementaire"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Risk & Compliance" : "Risques & conformité"}
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
