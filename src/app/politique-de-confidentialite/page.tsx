import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité – MENUA CONSULTING",
  description:
    "Politique de confidentialité et protection des données personnelles de MENUA CONSULTING – RGPD, droits des personnes, durées de conservation.",
};

function Article({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.25rem" }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--beige)",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--green-dark)",
            paddingBottom: "0.6rem",
            borderBottom: "1px solid var(--border-light)",
            flex: 1,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.85 }}>{children}</p>
  );
}

export default function PolitiqueConfidentialite() {
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
            Politique de confidentialité
          </h1>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          {/* Intro */}
          <Para>
            MENUA CONSULTING attache une importance particulière à la protection des données personnelles
            collectées via son site internet. La présente politique de confidentialité a pour objet
            d'informer les utilisateurs sur les données collectées, les finalités des traitements, les
            durées de conservation et les droits dont ils disposent.
          </Para>
          <div style={{ height: "2.5rem" }} />

          <Article num="1" title="Responsable du traitement">
            <Para>
              Le responsable du traitement est <strong style={{ color: "var(--text-dark)" }}>MENUA CONSULTING</strong>,
              dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris. Pour toute question
              relative à la protection des données personnelles, vous pouvez écrire à l'adresse suivante :{" "}
              <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                contact@menuaconsulting.com
              </a>
              .
            </Para>
          </Article>

          <Article num="2" title="Données collectées">
            <Para>
              Les données collectées via le site sont celles que vous communiquez volontairement dans les
              formulaires de contact et de recrutement. Elles peuvent inclure notamment : nom, société,
              fonction, adresse email, numéro de téléphone, type de besoin, niveau d'urgence, message,
              ainsi que les informations contenues dans une candidature et les documents transmis à cette
              occasion.
            </Para>
          </Article>

          <Article num="3" title="Finalités des traitements">
            <Para>
              Ces données sont utilisées pour répondre à vos demandes de contact, analyser votre besoin,
              traiter les candidatures reçues, organiser le suivi des échanges et, le cas échéant,
              poursuivre un échange professionnel en lien avec votre demande.
            </Para>
          </Article>

          <Article num="4" title="Base légale">
            <Para>
              Les traitements mis en œuvre reposent sur l'intérêt légitime de MENUA CONSULTING à répondre
              aux sollicitations reçues et à gérer ses échanges professionnels, ainsi que, lorsque cela est
              nécessaire, sur votre consentement.
            </Para>
          </Article>

          <Article num="5" title="Destinataires des données">
            <Para>
              Les données sont destinées exclusivement à MENUA CONSULTING et, lorsque cela est nécessaire,
              à ses prestataires techniques habilités, notamment pour l'hébergement du site, la gestion
              technique des formulaires ou l'acheminement sécurisé des messages.
            </Para>
          </Article>

          <Article num="6" title="Durée de conservation">
            <Para>
              Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au
              traitement de la demande et au suivi des échanges. Le cas échéant, elles peuvent être
              conservées pendant une durée maximale de 3 ans à compter du dernier échange.
            </Para>
            <Para>
              Les données relatives aux candidatures peuvent être conservées pendant la durée du processus
              de recrutement. Lorsqu'un candidat n'est pas retenu, son dossier peut être conservé jusqu'à
              2 ans après le dernier contact, sauf opposition de sa part ou accord exprès pour une durée
              différente.
            </Para>
            <Para>
              Au-delà, les données sont supprimées ou archivées conformément aux obligations légales
              applicables.
            </Para>
          </Article>

          <Article num="7" title="Droits des personnes">
            <Para>
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès,
              de rectification, d'effacement, de limitation du traitement, d'opposition et, lorsque cela est
              applicable, d'un droit à la portabilité de vos données.
            </Para>
            <Para>
              Vous pouvez également retirer votre consentement lorsque le traitement repose sur celui-ci.
            </Para>
          </Article>

          <Article num="8" title="Exercice des droits">
            <Para>
              Pour exercer vos droits ou poser une question relative à vos données personnelles, vous pouvez
              contacter MENUA CONSULTING à l'adresse suivante :{" "}
              <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                contact@menuaconsulting.com
              </a>
              .
            </Para>
            <Para>
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez
              introduire une réclamation auprès de la CNIL.
            </Para>
          </Article>

          <Article num="9" title="Sécurité des données">
            <Para>
              MENUA CONSULTING met en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger les données personnelles contre la perte, l'altération, l'accès non autorisé ou la
              divulgation non autorisée.
            </Para>
          </Article>

          <Article num="10" title="Cookies et traceurs">
            <Para>
              Le site peut utiliser des cookies ou traceurs nécessaires à son bon fonctionnement. Lorsque
              des cookies non strictement nécessaires sont utilisés, notamment à des fins de mesure
              d'audience ou de statistiques, le consentement de l'utilisateur est recueilli conformément
              à la réglementation applicable.
            </Para>
          </Article>

          <Article num="11" title="Mise à jour">
            <Para>
              La présente politique de confidentialité peut être modifiée à tout moment afin de tenir
              compte des évolutions légales, réglementaires ou techniques du site. La version publiée sur
              le site est celle en vigueur à la date de consultation.
            </Para>
          </Article>

          {/* Retour mentions légales */}
          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border-light)" }}>
            <Link
              href="/mentions-legales"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--green-dark)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ← Voir les mentions légales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
