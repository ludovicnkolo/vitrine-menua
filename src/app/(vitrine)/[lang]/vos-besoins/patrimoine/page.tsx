import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Wealth management & PWM support – MENUA CONSULTING" : "Gestion de patrimoine & support CGP – MENUA CONSULTING",
  };
}

export default async function Patrimoine({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  const items = isEn ? [
      "Preparation of onboarding files", "Collection and control of supporting documents", "Control of client file completeness",
      "Updating client information", "Preparation and pre-filling of forms", "Administrative support for subscriptions",
      "Support for arbitrations", "Support for partial or total redemptions", "Tracking of client requests",
      "Organization and document archiving", "Updating client databases", "Preparation of files for validation by authorized advisors", "Tracking of wealth operations in compliance with internal procedures"
    ] : [
      "Préparation des dossiers d'entrée en relation", "Collecte et contrôle des pièces justificatives", "Contrôle de complétude des dossiers clients",
      "Mise à jour des informations clients", "Préparation et pré remplissage de formulaires", "Support administratif aux souscriptions",
      "Support aux arbitrages", "Support aux rachats partiels ou totaux", "Suivi des demandes clients",
      "Organisation et archivage documentaire", "Mise à jour des bases clients", "Préparation de dossiers pour validation par les conseillers habilités", "Suivi des opérations patrimoniales dans le respect des procédures internes"
    ];

  return (
    <main>
      <PageHeader
        title={isEn ? "Wealth management & PWM support" : "Gestion de patrimoine & support CGP"}
        subtitle={isEn ? "Operational support to wealth management firms, family offices, and wealth structures in the processing, preparation, and administrative follow-up of client files." : "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients."}
      />
      <section style={{ padding: "5.5rem 2rem", background: "#fff", minHeight: "60vh" }}>
        <div className="container page-container">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 items-start">
            <div style={{ position: "sticky", top: "5rem" }}>
              <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                <p className="section-lbl" style={{ color: "var(--gold)" }}>{isEn ? "Specialized assistance" : "Assistance spécialisée"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 600, fontStyle: "italic", color: "var(--text-dark)", lineHeight: 1.4, marginBottom: "1.25rem" }}>
                {isEn ? "Wealth management & PWM support" : "Gestion de patrimoine & support CGP"}
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
