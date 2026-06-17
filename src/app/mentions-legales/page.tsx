import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales – MENUA CONSULTING",
  description:
    "Mentions légales de MENUA CONSULTING – SASU au capital de 15 000 €, RCS Paris 993 749 779, éditeur du site et informations légales obligatoires.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--green-dark)",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.85 }}>{children}</p>
  );
}

export default function MentionsLegales() {
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
            }}
          >
            Mentions légales
          </h1>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "860px" }}>

          <Section title="Éditeur du site">
            <Para>
              Le présent site est édité par <strong style={{ color: "var(--text-dark)" }}>MENUA CONSULTING</strong>,
              société par actions simplifiée unipersonnelle (SASU), au capital social de 15&nbsp;000&nbsp;€, dont le
              siège social est situé au 92 rue des Pyrénées – 75020 Paris, immatriculée au Registre du commerce
              et des sociétés de Paris sous le numéro 993&nbsp;749&nbsp;779 R.C.S. Paris.
            </Para>
            <Para>SIREN : 993&nbsp;749&nbsp;779</Para>
            <Para>SIRET : 993&nbsp;749&nbsp;779 00019</Para>
            <Para>TVA intracommunautaire : FR36993749779</Para>
          </Section>

          <Section title="Coordonnées">
            <Para>MENUA CONSULTING</Para>
            <Para>92 rue des Pyrénées – 75020 Paris</Para>
            <Para>
              Email :{" "}
              <a
                href="mailto:contact@menuaconsulting.com"
                style={{ color: "var(--green-dark)", textDecoration: "underline" }}
              >
                contact@menuaconsulting.com
              </a>
            </Para>
            <Para>
              Téléphone :{" "}
              <a
                href="tel:+33686877914"
                style={{ color: "var(--green-dark)", textDecoration: "underline" }}
              >
                +33 6 86 87 79 14
              </a>
            </Para>
          </Section>

          <Section title="Directeur de la publication">
            <Para>
              Directrice de la publication : <strong style={{ color: "var(--text-dark)" }}>Rosette Fouelefack</strong>,
              Présidente de MENUA CONSULTING.
            </Para>
          </Section>

          <Section title="Hébergement">
            <Para>
              Le site est hébergé par : <em style={{ color: "var(--text-light)" }}>(À compléter ultérieurement)</em>
            </Para>
          </Section>

          <Section title="Propriété intellectuelle">
            <Para>
              L'ensemble du contenu présent sur ce site, notamment les textes, éléments graphiques, logos, images,
              documents et éléments de structure, est protégé par les dispositions applicables en matière de
              propriété intellectuelle, sauf mention contraire.
            </Para>
            <Para>
              Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des
              éléments du site est interdite sans autorisation préalable de MENUA CONSULTING.
            </Para>
          </Section>

          <Section title="Responsabilité">
            <Para>
              MENUA CONSULTING s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur
              le site. Toutefois, la société ne peut garantir l'exhaustivité ou l'absence d'erreurs de l'ensemble
              des contenus publiés.
            </Para>
            <Para>
              Les informations présentes sur le site sont fournies à titre informatif. Elles ne constituent ni une
              prestation réglementée exercée en son nom propre, ni un conseil en investissement, ni un conseil
              patrimonial personnalisé, ni une recommandation financière.
            </Para>
            <Para>
              MENUA CONSULTING intervient exclusivement dans le cadre de prestations d'externalisation
              opérationnelle, de support back et middle office et de mise à disposition de ressources spécialisées,
              dans le respect du cadre, des procédures et de la supervision de ses clients.
            </Para>
          </Section>

          <Section title="Confidentialité">
            <Para>
              MENUA CONSULTING attache une importance particulière à la confidentialité des informations qui lui
              sont transmises dans le cadre de ses échanges, demandes de contact, candidatures ou relations
              professionnelles.
            </Para>
            <Para>
              Les informations communiquées via le site sont destinées exclusivement au traitement des demandes
              adressées à MENUA CONSULTING, sous réserve des précisions apportées dans la{" "}
              <Link href="/politique-de-confidentialite" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                Politique de confidentialité
              </Link>
              .
            </Para>
          </Section>

          <Section title="Contact">
            <Para>
              Pour toute question relative au site ou à son contenu, vous pouvez contacter MENUA CONSULTING à
              l'adresse suivante :{" "}
              <a
                href="mailto:contact@menuaconsulting.com"
                style={{ color: "var(--green-dark)", textDecoration: "underline" }}
              >
                contact@menuaconsulting.com
              </a>
            </Para>
          </Section>
        </div>
      </section>
    </main>
  );
}
