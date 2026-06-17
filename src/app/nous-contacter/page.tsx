import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nous contacter – MENUA CONSULTING",
  description:
    "Présentez votre besoin opérationnel à MENUA CONSULTING. Formulaire de contact, coordonnées et niveaux d'urgence.",
};

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

const typesBesoin = [
  "Renfort opérationnel",
  "Externalisation back office",
  "Externalisation middle office",
  "Finance & reporting",
  "Contrôle de gestion",
  "Risques & conformité",
  "Support comptable & data",
  "Support opérationnel CGP / gestion de patrimoine",
  "Autre besoin opérationnel",
];

export default function NousContacter() {
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
            Nous contacter
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "620px", fontWeight: 300 }}>
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse
            et une proposition adaptée.
          </p>
        </div>
      </section>

      {/* ── CORPS ── */}
      <section style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
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
                <p className="section-lbl">Nous trouver</p>
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
                    Téléphone
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
                <p className="section-lbl">Formulaire de contact</p>
                <div className="section-lbl-line" />
              </div>
              <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Ligne 1 : Nom / Société */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label htmlFor="nom" style={labelStyle}>Nom *</label>
                    <input id="nom" type="text" required style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="societe" style={labelStyle}>Société *</label>
                    <input id="societe" type="text" required style={fieldStyle} />
                  </div>
                </div>

                {/* Ligne 2 : Fonction / Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label htmlFor="fonction" style={labelStyle}>Fonction *</label>
                    <input id="fonction" type="text" required style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email professionnel *</label>
                    <input id="email" type="email" required style={fieldStyle} />
                  </div>
                </div>

                {/* Ligne 3 : Téléphone / Urgence */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label htmlFor="telephone" style={labelStyle}>Téléphone</label>
                    <input id="telephone" type="tel" style={fieldStyle} />
                  </div>
                  <div>
                    <label htmlFor="urgence" style={labelStyle}>Niveau d'urgence *</label>
                    <select id="urgence" required style={fieldStyle}>
                      <option value="">Sélectionnez</option>
                      <option value="immediat">Immédiat</option>
                      <option value="quelques-jours">Sous quelques jours</option>
                      <option value="quelques-semaines">Sous quelques semaines</option>
                      <option value="a-planifier">À planifier</option>
                    </select>
                  </div>
                </div>

                {/* Type de besoin */}
                <div>
                  <p style={labelStyle}>Type de besoin (plusieurs choix possibles) *</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem 1.5rem" }}>
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
                  <label htmlFor="message" style={labelStyle}>Décrivez votre besoin *</label>
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
                    J'accepte que les informations saisies soient exploitées par MENUA CONSULTING dans le cadre de ma demande de contact et de la relation commerciale qui peut en découler. *
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
                    Envoyer la demande
                  </button>
                </div>

                {/* Mention RGPD */}
                <p style={{ fontSize: "0.73rem", color: "var(--text-light)", lineHeight: 1.7, borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
                  Les informations recueillies via ce formulaire sont traitées par MENUA CONSULTING afin de
                  répondre à votre demande et d'en assurer le suivi. Elles peuvent être conservées jusqu'à
                  3 ans après le dernier échange. Vous disposez de droits sur vos données personnelles et
                  pouvez les exercer à l'adresse : contact@menuaconsulting.com. Pour en savoir plus,
                  consultez notre{" "}
                  <Link href="/politique-de-confidentialite" style={{ color: "var(--green-dark)", textDecoration: "underline" }}>
                    Politique de confidentialité
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
