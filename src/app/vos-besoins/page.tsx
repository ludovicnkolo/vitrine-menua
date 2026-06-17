import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vos besoins – MENUA CONSULTING",
  description:
    "Finance & reporting, contrôle de gestion, risques & conformité, support comptable & data, gestion de patrimoine : découvrez comment MENUA CONSULTING répond à vos besoins opérationnels.",
};

const besoins = [
  {
    id: "finance",
    title: "Finance & reporting",
    role: "Offre cœur métier",
    description:
      "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance, au suivi de l'activité et à l'aide à la décision.",
    items: [
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
    title: "Contrôle de gestion",
    role: "Optimisation interne des coûts et performance",
    description:
      "Appui opérationnel au suivi budgétaire, à l'analyse des écarts et au pilotage de la performance afin d'aider les organisations à mieux maîtriser leurs coûts, leurs marges et leurs ressources.",
    items: [
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
    title: "Risques & conformité",
    role: "Sécurisation réglementaire",
    description:
      "Appui opérationnel aux équipes risques et conformité dans le traitement, le contrôle et la fiabilisation des dossiers sensibles, dans le respect des procédures internes et des exigences réglementaires applicables.",
    items: [
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
    title: "Support comptable & data",
    role: "Back-office opérationnel",
    description:
      "Appui opérationnel aux équipes comptables, administratives et data dans le traitement, la fiabilisation et la structuration des informations nécessaires à la production comptable et au reporting.",
    items: [
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
    title: "Gestion de patrimoine & support CGP",
    role: "Assistance spécialisée",
    description:
      "Appui opérationnel aux cabinets de gestion de patrimoine, family offices et structures patrimoniales dans le traitement, la préparation et le suivi administratif des dossiers clients.",
    items: [
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
    title: "Autres besoins opérationnels",
    role: "Flexibilité & agilité",
    description:
      "Prise en charge de besoins opérationnels ponctuels, transverses ou spécifiques ne relevant pas exclusivement d'une fonction financière, comptable, patrimoniale, conformité ou data.",
    items: [
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

export default function VosBesoins() {
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
            Vos besoins
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
            MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales,
            IT et réglementées sur l'ensemble des fonctions back et middle office nécessitant rigueur,
            continuité et fiabilité opérationnelle.
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
            <p className="section-lbl section-lbl--light">Présenter un besoin</p>
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
            Votre besoin ne figure pas dans cette liste ? Contactez-nous, nous étudions tout besoin
            opérationnel spécifique.
          </p>
          <Link
            href="/nous-contacter"
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
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}
