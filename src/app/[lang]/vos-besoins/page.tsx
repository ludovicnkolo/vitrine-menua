import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Your Needs – MENUA CONSULTING" : "Vos besoins – MENUA CONSULTING",
    description: isEn
      ? "Finance & reporting, management control, risks & compliance, accounting & data support, wealth management: discover how MENUA CONSULTING meets your operational needs."
      : "Finance & reporting, contrôle de gestion, risques & conformité, support comptable & data, gestion de patrimoine : découvrez comment MENUA CONSULTING répond à vos besoins opérationnels.",
  };
}

const getBesoins = (isEn: boolean) => [
  {
    id: "finance",
    title: isEn ? "Finance & reporting" : "Finance & reporting",
    role: isEn ? "Core business offering" : "Offre cœur métier",
    description: isEn
      ? "Production, structuring, and ensuring the reliability of financial reporting aimed at performance management, activity monitoring, and decision support."
      : "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
    items: isEn ? [
      "Financial reporting",
      "KPIs & Dashboards",
      "Performance analysis",
      "Financial department support",
      "Data consolidation",
      "Financial analysis",
      "Preparation of reports for the finance department",
      "Activity tracking",
      "Monthly / quarterly reporting",
      "Cash flow reporting",
      "Profitability reporting",
      "Indicator tracking",
    ] : [
      "Reporting financier",
      "KPI & Dashboard",
      "Analyse de performance",
      "Support direction financière",
      "Consolidation de données",
      "Analyse financière",
      "Préparation de reportings pour direction financière",
      "Suivi d'activité",
      "Reporting mensuel / trimestriel",
      "Reporting de trésorerie",
      "Reporting de rentabilité",
      "Suivi des indicateurs",
    ],
  },
  {
    id: "controle",
    title: isEn ? "Management control" : "Contrôle de gestion",
    role: isEn ? "Internal cost and performance optimization" : "Optimisation interne des coûts et performance",
    description: isEn
      ? "Operational support in budget tracking, variance analysis, and performance management to help organizations better control their costs, margins, and resources."
      : "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
    items: isEn ? [
      "Budget tracking",
      "Variance analysis between actuals, budget, and forecast",
      "Dashboards",
      "Performance management",
      "Tracking of costs, expenses, and margins",
      "Profitability analysis",
      "Tracking of operational indicators",
      "Preparation of management reports",
      "Tracking of turnover and objectives",
      "Updating management files",
      "Consolidation of management data",
      "Support to financial departments and operational managers",
    ] : [
      "Suivi budgétaire",
      "Analyse des écarts entre réalisé, budget et prévisionnel",
      "Tableaux de bord",
      "Pilotage de performance",
      "Suivi des coûts, charges et marges",
      "Analyse de rentabilité",
      "Suivi des indicateurs opérationnels",
      "Préparation de reportings de gestion",
      "Suivi du chiffre d'affaires et des objectifs",
      "Mise à jour de fichiers de pilotage",
      "Consolidation des données de gestion",
      "Support aux directions financières et responsables opérationnels",
    ],
  },
  {
    id: "risques",
    title: isEn ? "Risk & Compliance" : "Risques & conformité",
    role: isEn ? "Regulatory securing" : "Sécurisation réglementaire",
    description: isEn
      ? "Operational support to risk and compliance teams in processing, controlling, and ensuring the reliability of sensitive files, in compliance with internal procedures and applicable regulatory requirements."
      : "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
    items: isEn ? [
      "KYC",
      "AML-CFT",
      "AML",
      "Documentary control",
      "Analysis and completeness of client files",
      "Verification of supporting documents",
      "Client onboarding",
      "Periodic review of files",
      "KYC remediation",
      "Processing of compliance alerts",
      "Analysis of unusual movements",
      "Support to risk and compliance teams",
      "Monitoring of internal procedures",
      "Preparation of files for validation by authorized teams",
    ] : [
      "KYC",
      "LCB-FT",
      "AML",
      "Contrôle documentaire",
      "Analyse et complétude des dossiers clients",
      "Vérification des pièces justificatives",
      "Entrée en relation client",
      "Revue périodique des dossiers",
      "Remédiation KYC",
      "Traitement des alertes de conformité",
      "Analyse des mouvements inhabituels",
      "Support aux équipes risques et conformité",
      "Suivi des procédures internes",
      "Préparation de dossiers pour validation par les équipes habilitées",
    ],
  },
  {
    id: "comptable",
    title: isEn ? "Accounting & data support" : "Support comptable & data",
    role: isEn ? "Operational back-office" : "Back-office opérationnel",
    description: isEn
      ? "Operational support to accounting, administrative, and data teams in processing, ensuring reliability, and structuring information necessary for accounting production and reporting."
      : "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
    items: isEn ? [
      "Accounting entry",
      "Bank reconciliations",
      "Account lettering",
      "Control and filing of accounting documents",
      "Preparation of VAT returns",
      "Preparation of accounting elements for review",
      "Tracking of client and supplier invoices",
      "Administrative follow-ups for missing documents",
      "Data cleaning",
      "Structuring and updating databases",
      "Data consistency control",
      "Preparation of reporting files",
      "Consolidation of accounting and operational data",
      "Archiving and document organization",
    ] : [
      "Saisie comptable",
      "Rapprochements bancaires",
      "Lettrage des comptes",
      "Contrôle et classement des pièces comptables",
      "Préparation des déclarations de TVA",
      "Préparation des éléments comptables pour révision",
      "Suivi des factures clients et fournisseurs",
      "Relances administratives liées aux pièces manquantes",
      "Data cleaning",
      "Structuration et mise à jour de bases de données",
      "Contrôle de cohérence des données",
      "Préparation de fichiers de reporting",
      "Consolidation de données comptables et opérationnelles",
      "Archivage et organisation documentaire",
    ],
  },
  {
    id: "patrimoine",
    title: isEn ? "Wealth management & PWM support" : "Gestion de patrimoine & support CGP",
    role: isEn ? "Specialized assistance" : "Assistance spécialisée",
    description: isEn
      ? "Operational support to wealth management firms, family offices, and wealth structures in the processing, preparation, and administrative follow-up of client files."
      : "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
    items: isEn ? [
      "Preparation of onboarding files",
      "Collection and control of supporting documents",
      "Control of client file completeness",
      "Updating client information",
      "Preparation and pre-filling of forms",
      "Administrative support for subscriptions",
      "Support for arbitrations",
      "Support for partial or total redemptions",
      "Tracking of client requests",
      "Organization and document archiving",
      "Updating client databases",
      "Preparation of files for validation by authorized advisors",
      "Tracking of wealth operations in compliance with internal procedures",
    ] : [
      "Préparation des dossiers d'entrée en relation",
      "Collecte et contrôle des pièces justificatives",
      "Contrôle de complétude des dossiers clients",
      "Mise à jour des informations clients",
      "Préparation et pré remplissage de formulaires",
      "Support administratif aux souscriptions",
      "Support aux arbitrages",
      "Support aux rachats partiels ou totaux",
      "Suivi des demandes clients",
      "Organisation et archivage documentaire",
      "Mise à jour des bases clients",
      "Préparation de dossiers pour validation par les conseillers habilités",
      "Suivi des opérations patrimoniales dans le respect des procédures internes",
    ],
  },
  {
    id: "autres",
    title: isEn ? "Other operational needs" : "Autres besoins opérationnels",
    role: isEn ? "Flexibility & agility" : "Flexibilité & agilité",
    description: isEn
      ? "Handling of specific, cross-functional, or occasional operational needs that do not exclusively fall under a financial, accounting, wealth, compliance, or data function."
      : "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
    items: isEn ? [
      "Occasional operational reinforcement missions",
      "Financial administrative support",
      "Volume processing of files",
      "Filing, archiving, and document organization",
      "Preparation and updating of tracking files",
      "Support in managing cross-functional operations",
      "Assistance in formalizing internal procedures",
      "Help in structuring operational processes",
      "Preparation of administrative documents",
      "Tracking of internal or client requests",
      "Support during periods of activity overload",
      "Temporary replacement or team support",
      "Coordination between internal teams and outsourced providers",
      "Study of specific needs not listed in the previous sections",
    ] : [
      "Missions ponctuelles de renfort opérationnel",
      "Support administratif financier",
      "Traitement de dossiers en volume",
      "Classement, archivage et organisation documentaire",
      "Préparation et mise à jour de fichiers de suivi",
      "Support à la gestion d'opérations transverses",
      "Assistance à la formalisation de procédures internes",
      "Aide à la structuration de process opérationnels",
      "Préparation de documents administratifs",
      "Suivi de demandes internes ou clients",
      "Support en période de surcharge d'activité",
      "Remplacement ou appui temporaire d'équipe",
      "Coordination entre équipes internes et prestataires externalisés",
      "Étude de besoins spécifiques non listés dans les rubriques précédentes",
    ],
  },
];

export default async function VosBesoins({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const besoins = getBesoins(isEn);

  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section
        style={{
          paddingTop: "9rem",
          paddingBottom: "5rem",
          background: "var(--beige-bg)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="section-lbl">MENUA CONSULTING</p>
            <div className="section-lbl-line" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "var(--text-dark)",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            {isEn ? "Your Needs" : "Vos besoins"}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-mid)",
              lineHeight: 1.85,
              maxWidth: "680px",
              fontWeight: 300,
            }}
          >
            {isEn ? "MENUA CONSULTING operates in support of financial, accounting, wealth management, IT, and regulated teams on all back and middle office functions requiring rigor, continuity, and operational reliability." : "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur, continuité et fiabilité opérationnelle."}
          </p>
        </div>
      </section>

      {/* ── LISTE DES BESOINS ── */}
      {besoins.map((besoin, idx) => (
        <section
          key={besoin.id}
          id={besoin.id}
          style={{
            padding: "5.5rem 2rem",
            background: idx % 2 === 0 ? "#fff" : "var(--beige-bg)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <div className="container" style={{ maxWidth: "1100px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "5rem",
                alignItems: "start",
              }}
            >
              {/* Colonne gauche – titre & description */}
              <div style={{ position: "sticky", top: "5rem" }}>
                <div className="section-label-wrap" style={{ marginBottom: "1rem" }}>
                  <p className="section-lbl" style={{ color: "var(--gold)" }}>{besoin.role}</p>
                  <div className="section-lbl-line" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: "var(--text-dark)",
                    lineHeight: 1.4,
                    marginBottom: "1.25rem",
                  }}
                >
                  {besoin.title}
                </h2>
                <p
                  style={{
                    fontSize: "0.87rem",
                    color: "var(--text-mid)",
                    lineHeight: 1.85,
                  }}
                >
                  {besoin.description}
                </p>
              </div>

              {/* Colonne droite – liste des items */}
              <div
                style={{
                  border: "1px solid var(--border-light)",
                  padding: "2.5rem",
                  background: "#fff",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.85rem 2.5rem",
                  }}
                >
                  {besoin.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.65rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--green-dark)",
                          flexShrink: 0,
                          marginTop: "2px",
                          fontSize: "0.75rem",
                        }}
                      >
                        →
                      </span>
                      <span style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.6 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl section-lbl--light">{isEn ? "Submit a need" : "Présenter un besoin"}</p>
            <div className="section-lbl-line" />
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "1rem",
              margin: "0 auto 2rem",
              maxWidth: "520px",
            }}
          >
            {isEn ? "Your need is not on this list? Contact us, we study any specific operational requirement." : "Votre besoin ne figure pas dans cette liste ? Contactez-nous, nous étudions tout besoin opérationnel spécifique."}
          </p>
          <Link
            href={`/${lang}/nous-contacter`}
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              background: "var(--beige-bg)",
              color: "var(--green-dark)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            {isEn ? "Contact us" : "Nous contacter"}
          </Link>
        </div>
      </section>
    </main>
  );
}
