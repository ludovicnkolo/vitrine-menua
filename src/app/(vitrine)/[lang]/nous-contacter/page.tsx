import type { Metadata } from "next";
import Link from "next/link";
import { SiretToggle } from "@/components/SiretToggle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Contact Us – MENUA CONSULTING" : "Nous contacter – MENUA CONSULTING",
    description: isEn
      ? "Present your operational need to MENUA CONSULTING. Contact form, contact details and urgency levels."
      : "Présentez votre besoin opérationnel à MENUA CONSULTING. Formulaire de contact, coordonnées et niveaux d'urgence.",
  };
}

/* ─── Styles inline partagés ─── */
const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  background: "var(--beige-bg)",
  border: "1px solid var(--border-light)",
  borderRadius: "2px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.84rem",
  color: "var(--text-dark)",
  outline: "none",
  transition: "border-color 0.2s",
  appearance: "none" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "var(--text-mid)",
  marginBottom: "0.5rem",
};

const getTypesBesoin = (isEn: boolean) => [
  isEn ? "General contact" : "Contact général",
  isEn ? "Commercial request" : "Demande commerciale",
  isEn ? "Quote request" : "Demande de devis",
  isEn ? "Back / Middle office" : "Back / middle office",
  isEn ? "Accounting" : "Comptabilité",
  isEn ? "Compliance / KYC / AML" : "Conformité / KYC / AML",
  isEn ? "Reporting / Data" : "Reporting / data",
  isEn ? "Partnership" : "Partenariat",
  isEn ? "Other" : "Autre",
];

export default async function NousContacter({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const typesBesoin = getTypesBesoin(isEn);

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
            {isEn ? "Contact us" : "Nous contacter"}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "620px", fontWeight: 300 }}>
            {isEn ? "Present your operational needs, and we will respond with an initial analysis and a tailored proposal." : "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée."}
          </p>
        </div>
      </section>

      {/* ── CORPS ── */}
      <section className="page-section">
        <div className="container page-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "5rem",
              alignItems: "start",
            }}
          >
            {/* ── Coordonnées ── */}
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
                <p className="section-lbl">{isEn ? "Find us" : "Nous trouver"}</p>
                <div className="section-lbl-line" />
              </div>
              <div
                style={{
                  background: "var(--green-dark)",
                  color: "#fff",
                  padding: "2.5rem",
                  borderRadius: "2px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.75rem",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--beige)", marginBottom: "0.75rem" }}>
                    MENUA CONSULTING
                  </p>
                  <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                    92 rue des Pyrénées<br />75020 Paris
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--beige)", marginBottom: "0.75rem" }}>
                    Email
                  </p>
                  <a
                    href="mailto:contact@menuaconsulting.com"
                    style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", wordBreak: "break-all" }}
                  >
                    contact@menuaconsulting.com
                  </a>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--beige)", marginBottom: "0.75rem" }}>
                    {isEn ? "Phone" : "Téléphone"}
                  </p>
                  <a
                    href="tel:+33686877914"
                    style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
                  >
                    +33 6 86 87 79 14
                  </a>
                </div>
              </div>
            </div>

            {/* ── Formulaire ── */}
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
                <p className="section-lbl">{isEn ? "Contact Form" : "Formulaire de contact"}</p>
                <div className="section-lbl-line" />
              </div>
              <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "rgba(20, 40, 30, 0.03)", borderLeft: "3px solid var(--green-dark)", borderRadius: "2px" }}>
                <p style={{ fontSize: "0.87rem", color: "var(--text-dark)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {isEn 
                    ? "In accordance with our data security framework, no attachments (specifications, financial documents) are required during this initial contact. Following the qualification of your needs, our team will provide a secure channel for transmitting your confidential materials." 
                    : "Dans une démarche de sécurisation des données, aucune pièce jointe (cahier des charges, documents financiers) n'est requise lors de cette première prise de contact. Notre équipe vous proposera un canal d'échange sécurisé pour la transmission de vos éléments confidentiels après qualification de votre besoin."}
                </p>
              </div>
              <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Statut Juridique & SIRET */}
                <SiretToggle isEn={isEn} labelStyle={labelStyle} fieldStyle={fieldStyle} />

                {/* Ligne 1 : Nom / Fonction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nom" style={labelStyle}>{isEn ? "Name *" : "Nom *"}</label>
                    <input id="nom" type="text" required style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="fonction" style={labelStyle}>{isEn ? "Job Title *" : "Fonction *"}</label>
                    <input id="fonction" type="text" required style={fieldStyle} />
                  </div>
                </div>

                {/* Ligne 2 : Email / Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" style={labelStyle}>{isEn ? "Email *" : "Email *"}</label>
                    <input id="email" type="email" required style={fieldStyle} />
                  </div>
                </div>

                {/* Ligne 3 : Téléphone / Urgence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="telephone" style={labelStyle}>{isEn ? "Phone" : "Téléphone"}</label>
                    <input id="telephone" type="tel" style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="urgence" style={labelStyle}>{isEn ? "Urgency Level *" : "Niveau d'urgence *"}</label>
                    <select id="urgence" required style={fieldStyle}>
                      <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                      <option value="immediate">{isEn ? "Immediate" : "Immédiate"}</option>
                      <option value="1_week">{isEn ? "Under 1 week" : "Sous 1 semaine"}</option>
                      <option value="1_month">{isEn ? "Under 1 month" : "Sous 1 mois"}</option>
                      <option value="not_urgent">{isEn ? "Not urgent" : "Non urgente"}</option>
                    </select>
                  </div>
                </div>

                {/* Type de besoin */}
                <div>
                  <p style={labelStyle}>{isEn ? "Type of need (multiple choices possible) *" : "Type de besoin (plusieurs choix possibles) *"}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {typesBesoin.map((besoin) => (
                      <label
                        key={besoin}
                        style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          value={besoin}
                          style={{ marginTop: "3px", accentColor: "var(--green-dark)", flexShrink: 0 }}
                        />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-mid)", lineHeight: 1.5 }}>
                          {besoin}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>{isEn ? "Describe your need *" : "Décrivez votre besoin *"}</label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    style={{ ...fieldStyle, resize: "vertical" }}
                  />
                </div>

                {/* RGPD */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <input
                    type="checkbox"
                    id="rgpd-contact"
                    required
                    style={{ marginTop: "3px", accentColor: "var(--green-dark)", flexShrink: 0 }}
                  />
                  <label htmlFor="rgpd-contact" style={{ fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.65, cursor: "pointer" }}>
                    {isEn ? "I agree that the information entered will be used by MENUA CONSULTING as part of my contact request and the commercial relationship that may result. *" : "J'accepte que les informations saisies soient exploitées par MENUA CONSULTING dans le cadre de ma demande de contact et de la relation commerciale qui peut en découler. *"}
                  </label>
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    style={{
                      padding: "0.9rem 2.5rem",
                      background: "var(--green-dark)",
                      color: "#fff",
                      border: "none",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: "2px",
                      transition: "background 0.25s",
                    }}
                  >
                    {isEn ? "Send request" : "Envoyer la demande"}
                  </button>
                </div>

                {/* Mention RGPD */}
                <p style={{ fontSize: "0.73rem", color: "var(--text-light)", lineHeight: 1.7, borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
                  {isEn ? (
                    <>
                      The information collected via this form is processed by MENUA CONSULTING to respond to your request and follow up on it. It may be kept for up to 3 years after the last exchange. You have rights over your personal data and can exercise them at: contact@menuaconsulting.com. For more information, consult our{" "}
                      <Link href={`/${lang}/politique-de-confidentialite`} style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                        Privacy Policy
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin de
                      répondre à votre demande et d'en assurer le suivi. Elles peuvent être conservées jusqu'à
                      3 ans après le dernier échange. Vous disposez de droits sur vos données personnelles et
                      pouvez les exercer à l'adresse : contact@menuaconsulting.com. Pour en savoir plus,
                      consultez notre{" "}
                      <Link href={`/${lang}/politique-de-confidentialite`} style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                        Politique de confidentialité
                      </Link>
                      .
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
