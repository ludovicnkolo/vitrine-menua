import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Join Us – MENUA CONSULTING" : "Nous rejoindre – MENUA CONSULTING",
    description: isEn
      ? "MENUA CONSULTING is recruiting operational profiles in back & middle office, accounting, compliance, wealth management. Apply via our recruitment form."
      : "MENUA CONSULTING recrute des profils opérationnels back & middle office, comptabilité, conformité, CGP. Postulez via notre formulaire de recrutement.",
  };
}

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

const getProfils = (isEn: boolean) => [
  isEn ? "Back and middle office" : "Back et middle office",
  isEn ? "Accounting and administrative support" : "Comptabilité et support administratif",
  isEn ? "Reporting, data, and management control" : "Reporting, data et contrôle de gestion",
  isEn ? "Risk, compliance, KYC / AML" : "Risques, conformité, KYC / AML",
  isEn ? "Operational support for wealth management / PWM" : "Support opérationnel aux acteurs de la gestion de patrimoine / CGP",
  isEn ? "Bilingual French / English profiles" : "Profils bilingues français / anglais",
  isEn ? "Other languages appreciated" : "Autres langues appréciées",
  isEn ? "Profiles available for occasional or recurring missions" : "Profils disponibles pour des missions ponctuelles ou récurrentes",
];

export default async function NousRejoindre({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';
  const profils = getProfils(isEn);

  return (
    <main>
      {/* ── EN-TÊTE ── */}
      <section
        style={{
          paddingTop: "9rem",
          paddingBottom: "5rem",
          background: "var(--green-dark)",
        }}
      >
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="section-lbl section-lbl--light">MENUA CONSULTING</p>
            <div className="section-lbl-line" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.3,
              marginBottom: "1.5rem",
            }}
          >
            {isEn ? "Join Us" : "Nous rejoindre"}
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "680px", fontWeight: 300 }}>
            {isEn ? "MENUA CONSULTING is recruiting autonomous, rigorous, reliable, and organized operational profiles, capable of working remotely on back and middle office functions, in France and internationally." : "MENUA CONSULTING recrute des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, en France comme à l'international."}
          </p>
        </div>
      </section>

      {/* ── PROFILS RECHERCHÉS ── */}
      <section style={{ padding: "6rem 2rem", background: "var(--beige-bg)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
            <div>
              <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
                <p className="section-lbl">{isEn ? "Profiles Sought" : "Profils recherchés"}</p>
                <div className="section-lbl-line" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                  lineHeight: 1.45,
                  marginBottom: "1.5rem",
                }}
              >
                {isEn ? "Execution-oriented profiles" : "Des profils orientés exécution"}
              </h2>
              <p style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "1rem" }}>
                {isEn ? "MENUA CONSULTING is looking for autonomous, rigorous, reliable, and organized operational profiles, capable of working remotely on back and middle office functions, mainly in an international setting." : "MENUA CONSULTING recherche des profils opérationnels autonomes, rigoureux, fiables et organisés, capables d'intervenir à distance sur des fonctions back et middle office, principalement dans un cadre international."}
              </p>
              <p style={{ fontSize: "0.87rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
                {isEn ? "The profiles sought must be execution-oriented, comfortable with remote work, and able to comply with procedures, deadlines, and high quality standards." : "Les profils recherchés doivent être orientés exécution, à l'aise avec le travail à distance et capables de respecter des procédures, des délais et des standards de qualité élevés."}
              </p>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {profils.map((p) => (
                <li
                  key={p}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.85rem",
                    padding: "1rem 1.25rem",
                    background: "#fff",
                    border: "1px solid var(--border-light)",
                    borderLeft: "3px solid var(--green-dark)",
                    borderRadius: "0 2px 2px 0",
                  }}
                >
                  <span style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ── */}
      <section id="formulaire" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl">{isEn ? "Recruitment Form" : "Formulaire de recrutement"}</p>
            <div className="section-lbl-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              lineHeight: 1.45,
              marginBottom: "2.5rem",
            }}
          >
            {isEn ? "Submit your application" : "Déposez votre candidature"}
          </h2>
          <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Nom / Prénom */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label htmlFor="rec-nom" style={labelStyle}>{isEn ? "First & Last Name *" : "Nom & Prénom *"}</label>
                <input id="rec-nom" type="text" required style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="rec-email" style={labelStyle}>Email *</label>
                <input id="rec-email" type="email" required style={fieldStyle} />
              </div>
            </div>

            {/* Téléphone / Pays */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label htmlFor="rec-tel" style={labelStyle}>{isEn ? "Phone *" : "Téléphone *"}</label>
                <input id="rec-tel" type="tel" required style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="rec-pays" style={labelStyle}>{isEn ? "Country of residence *" : "Pays de résidence *"}</label>
                <input id="rec-pays" type="text" required style={fieldStyle} />
              </div>
            </div>

            {/* Type de contrat */}
            <div>
              <label htmlFor="rec-contrat" style={labelStyle}>{isEn ? "Desired type of collaboration *" : "Type de collaboration souhaitée *"}</label>
              <select id="rec-contrat" required style={fieldStyle}>
                <option value="">{isEn ? "Select" : "Sélectionnez"}</option>
                <option value="freelance">Freelance / Indépendant</option>
                <option value="ponctuel">{isEn ? "Occasional mission" : "Mission ponctuelle"}</option>
                <option value="recurrent">{isEn ? "Recurring mission" : "Mission récurrente"}</option>
                <option value="autre">{isEn ? "Other" : "Autre"}</option>
              </select>
            </div>

            {/* Domaines */}
            <div>
              <label htmlFor="rec-domaines" style={labelStyle}>{isEn ? "Areas of expertise *" : "Domaines d'expertise *"}</label>
              <input
                id="rec-domaines"
                type="text"
                placeholder={isEn ? "Ex: Finance, KYC Compliance, Data..." : "Ex : Finance, Conformité KYC, Data…"}
                required
                style={fieldStyle}
              />
            </div>

            {/* Langues */}
            <div>
              <label htmlFor="rec-langues" style={labelStyle}>{isEn ? "Languages spoken *" : "Langues maîtrisées *"}</label>
              <input
                id="rec-langues"
                type="text"
                placeholder={isEn ? "Ex: French (native), English (fluent)" : "Ex : Français (natif), Anglais (courant)"}
                required
                style={fieldStyle}
              />
            </div>

            {/* CV */}
            <div>
              <label htmlFor="rec-cv" style={labelStyle}>{isEn ? "Resume (link or text) *" : "CV (lien ou texte) *"}</label>
              <input
                id="rec-cv"
                type="text"
                placeholder={isEn ? "Link to your resume or LinkedIn profile" : "Lien vers votre CV ou profil LinkedIn"}
                required
                style={fieldStyle}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="rec-message" style={labelStyle}>Message *</label>
              <textarea
                id="rec-message"
                rows={4}
                required
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </div>

            {/* RGPD */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <input
                type="checkbox"
                id="rgpd-recrutement"
                required
                style={{ marginTop: "3px", accentColor: "var(--green-dark)", flexShrink: 0 }}
              />
              <label htmlFor="rgpd-recrutement" style={{ fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.65, cursor: "pointer" }}>
                {isEn ? "I agree that the information entered will be used by MENUA CONSULTING as part of the review of my application and the monitoring of my request. *" : "J'accepte que les informations saisies soient exploitées par MENUA CONSULTING dans le cadre de l'étude de ma candidature et du suivi de ma demande. *"}
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
                }}
              >
                {isEn ? "Send my application" : "Envoyer ma candidature"}
              </button>
            </div>

            {/* Mention RGPD */}
            <p style={{ fontSize: "0.73rem", color: "var(--text-light)", lineHeight: 1.7, borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
              {isEn ? (
                <>
                  The information collected via this form is processed by MENUA CONSULTING to review your application and follow up on it. Your file may be kept for up to 2 years after the last contact, unless you object. You have rights over your personal data at the address: contact@menuaconsulting.com. For more information, consult our{" "}
                  <Link href={`/${lang}/politique-de-confidentialite`} style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    Privacy Policy
                  </Link>
                  .
                </>
              ) : (
                <>
                  Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin
                  d'étudier votre candidature et d'en assurer le suivi. Votre dossier peut être conservé
                  jusqu'à 2 ans après le dernier contact, sauf opposition de votre part. Vous disposez
                  de droits sur vos données personnelles à l'adresse : contact@menuaconsulting.com.
                  Pour en savoir plus, consultez notre{" "}
                  <Link href={`/${lang}/politique-de-confidentialite`} style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    Politique de confidentialité
                  </Link>
                  .
                </>
              )}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
