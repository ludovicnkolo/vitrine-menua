import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Privacy Policy – MENUA CONSULTING" : "Politique de confidentialité – MENUA CONSULTING",
    description: isEn
      ? "Privacy policy and personal data protection of MENUA CONSULTING – GDPR, rights of individuals, retention periods."
      : "Politique de confidentialité et protection des données personnelles de MENUA CONSULTING – RGPD, droits des personnes, durées de conservation.",
  };
}

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

export default async function PolitiqueConfidentialite({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

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
            {isEn ? "Privacy Policy" : "Politique de confidentialité"}
          </h1>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section className="page-section">
        <div className="container" style={{ maxWidth: "860px" }}>
          {/* Intro */}
          <Para>
            {isEn
              ? "MENUA CONSULTING attaches particular importance to the protection of personal data collected via its website. The purpose of this privacy policy is to inform users about the data collected, the purposes of processing, retention periods, and the rights they hold."
              : "MENUA CONSULTING attache une importance particulière à la protection des données personnelles collectées via son site internet. La présente politique de confidentialité a pour objet d'informer les utilisateurs sur les données collectées, les finalités des traitements, les durées de conservation et les droits dont ils disposent."}
          </Para>
          <div style={{ height: "2.5rem" }} />

          <Article num="1" title={isEn ? "Data Controller" : "Responsable du traitement"}>
            <Para>
              {isEn ? (
                <>
                  The data controller is <strong style={{ color: "var(--text-dark)" }}>MENUA CONSULTING</strong>, whose registered office is located at 92 rue des Pyrénées – 75020 Paris. For any questions regarding the protection of personal data, you can write to the following address:{" "}
                  <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    contact@menuaconsulting.com
                  </a>
                  .
                </>
              ) : (
                <>
                  Le responsable du traitement est <strong style={{ color: "var(--text-dark)" }}>MENUA CONSULTING</strong>, dont le siège social est situé au 92 rue des Pyrénées – 75020 Paris. Pour toute question relative à la protection des données personnelles, vous pouvez écrire à l'adresse suivante :{" "}
                  <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    contact@menuaconsulting.com
                  </a>
                  .
                </>
              )}
            </Para>
          </Article>

          <Article num="2" title={isEn ? "Data Collected" : "Données collectées"}>
            <Para>
              {isEn
                ? "The data collected via the site are those that you voluntarily provide in the contact and recruitment forms. They may notably include: name, company, job title, email address, phone number, type of need, urgency level, message, as well as information contained in an application and documents transmitted on that occasion."
                : "Les données collectées via le site sont celles que vous communiquez volontairement dans les formulaires de contact et de recrutement. Elles peuvent inclure notamment : nom, société, fonction, adresse email, numéro de téléphone, type de besoin, niveau d'urgence, message, ainsi que les informations contenues dans une candidature et les documents transmis à cette occasion."}
            </Para>
          </Article>

          <Article num="3" title={isEn ? "Purposes of Processing" : "Finalités des traitements"}>
            <Para>
              {isEn
                ? "These data are used to respond to your contact requests, analyze your need, process received applications, organize the follow-up of exchanges, and, if necessary, pursue professional exchanges related to your request."
                : "Ces données sont utilisées pour répondre à vos demandes de contact, analyser votre besoin, traiter les candidatures reçues, organiser le suivi des échanges et, le cas échéant, poursuivre un échange professionnel en lien avec votre demande."}
            </Para>
          </Article>

          <Article num="4" title={isEn ? "Legal Basis" : "Base légale"}>
            <Para>
              {isEn
                ? "The implemented processes are based on MENUA CONSULTING's legitimate interest in responding to the inquiries received and managing its professional exchanges, as well as, when necessary, on your consent."
                : "Les traitements mis en œuvre reposent sur l'intérêt légitime de MENUA CONSULTING à répondre aux sollicitations reçues et à gérer ses échanges professionnels, ainsi que, lorsque cela est nécessaire, sur votre consentement."}
            </Para>
          </Article>

          <Article num="5" title={isEn ? "Data Recipients" : "Destinataires des données"}>
            <Para>
              {isEn
                ? "The data are intended exclusively for MENUA CONSULTING and, when necessary, its authorized technical service providers, notably for website hosting, technical management of forms, or secure routing of messages."
                : "Les données sont destinées exclusivement à MENUA CONSULTING et, lorsque cela est nécessaire, à ses prestataires techniques habilités, notamment pour l'hébergement du site, la gestion technique des formulaires ou l'acheminement sécurisé des messages."}
            </Para>
          </Article>

          <Article num="6" title={isEn ? "Retention Period" : "Durée de conservation"}>
            <Para>
              {isEn
                ? "Data from the contact form are kept for the duration necessary to process the request and follow up on exchanges. Where applicable, they may be kept for a maximum of 3 years from the last exchange."
                : "Les données issues du formulaire de contact sont conservées pendant la durée nécessaire au traitement de la demande et au suivi des échanges. Le cas échéant, elles peuvent être conservées pendant une durée maximale de 3 ans à compter du dernier échange."}
            </Para>
            <Para>
              {isEn
                ? "Data relating to applications may be kept for the duration of the recruitment process. When a candidate is not selected, their file may be kept for up to 2 years after the last contact, unless they object or explicitly agree to a different duration."
                : "Les données relatives aux candidatures peuvent être conservées pendant la durée du processus de recrutement. Lorsqu'un candidat n'est pas retenu, son dossier peut être conservé jusqu'à 2 ans après le dernier contact, sauf opposition de sa part ou accord exprès pour une durée différente."}
            </Para>
            <Para>
              {isEn
                ? "Beyond this, the data are deleted or archived in accordance with applicable legal obligations."
                : "Au-delà, les données sont supprimées ou archivées conformément aux obligations légales applicables."}
            </Para>
          </Article>

          <Article num="7" title={isEn ? "Rights of Individuals" : "Droits des personnes"}>
            <Para>
              {isEn
                ? "In accordance with the GDPR and the Data Protection Act, you have a right of access, rectification, erasure, limitation of processing, opposition and, where applicable, a right to the portability of your data."
                : "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition et, lorsque cela est applicable, d'un droit à la portabilité de vos données."}
            </Para>
            <Para>
              {isEn
                ? "You can also withdraw your consent when the processing is based on it."
                : "Vous pouvez également retirer votre consentement lorsque le traitement repose sur celui-ci."}
            </Para>
          </Article>

          <Article num="8" title={isEn ? "Exercise of Rights" : "Exercice des droits"}>
            <Para>
              {isEn ? (
                <>
                  To exercise your rights or ask a question relating to your personal data, you can contact MENUA CONSULTING at the following address:{" "}
                  <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    contact@menuaconsulting.com
                  </a>
                  .
                </>
              ) : (
                <>
                  Pour exercer vos droits ou poser une question relative à vos données personnelles, vous pouvez contacter MENUA CONSULTING à l'adresse suivante :{" "}
                  <a href="mailto:contact@menuaconsulting.com" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    contact@menuaconsulting.com
                  </a>
                  .
                </>
              )}
            </Para>
            <Para>
              {isEn
                ? "If you believe, after contacting us, that your rights are not being respected, you can file a complaint with the CNIL."
                : "Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL."}
            </Para>
          </Article>

          <Article num="9" title={isEn ? "Data Security" : "Sécurité des données"}>
            <Para>
              {isEn
                ? "MENUA CONSULTING implements appropriate technical and organizational measures to protect personal data against loss, alteration, unauthorized access, or unauthorized disclosure."
                : "MENUA CONSULTING met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte, l'altération, l'accès non autorisé ou la divulgation non autorisée."}
            </Para>
          </Article>

          <Article num="10" title={isEn ? "Cookies and Trackers" : "Cookies et traceurs"}>
            <Para>
              {isEn
                ? "The site may use cookies or trackers necessary for its proper functioning. When cookies not strictly necessary are used, particularly for audience measurement or statistical purposes, user consent is collected in accordance with applicable regulations."
                : "Le site peut utiliser des cookies ou traceurs nécessaires à son bon fonctionnement. Lorsque des cookies non strictement nécessaires sont utilisés, notamment à des fins de mesure d'audience ou de statistiques, le consentement de l'utilisateur est recueilli conformément à la réglementation applicable."}
            </Para>
          </Article>

          <Article num="11" title={isEn ? "Updates" : "Mise à jour"}>
            <Para>
              {isEn
                ? "This privacy policy may be modified at any time to take into account legal, regulatory, or technical changes to the site. The version published on the site is the one in force on the date of consultation."
                : "La présente politique de confidentialité peut être modifiée à tout moment afin de tenir compte des évolutions légales, réglementaires ou techniques du site. La version publiée sur le site est celle en vigueur à la date de consultation."}
            </Para>
          </Article>

          {/* Retour mentions légales */}
          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border-light)" }}>
            <Link
              href={`/${lang}/mentions-legales`}
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
              {isEn ? "← View Legal Notices" : "← Voir les mentions légales"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
