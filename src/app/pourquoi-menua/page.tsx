import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pourquoi MENUA CONSULTING ? – Bénéfices, différenciation, engagements",
  description:
    "Découvrez pourquoi choisir MENUA CONSULTING : gain de temps, réduction des charges internes, approche 100% opérationnelle, contrôle à quatre yeux et intervention bilingue.",
};

export default function PourquoiMenua() {
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
            Pourquoi MENUA CONSULTING ?
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
            MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution
            opérationnelle exigeants.
          </p>
        </div>
      </section>

      {/* ── BÉNÉFICES ── */}
      <section id="benefices" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl">Ce que vous gagnez</p>
            <div className="section-lbl-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            Bénéfices pour votre organisation
          </h2>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps,
            améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre
            d'affaires.
          </p>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes
            d'activité et de fidéliser durablement votre clientèle.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { title: "Gain de temps", icon: "⏱" },
              { title: "Réduction des charges internes", icon: "↘" },
              { title: "Productivité accrue", icon: "↑" },
              { title: "Efficacité renforcée", icon: "◎" },
              { title: "Fiabilité des opérations", icon: "✓" },
              { title: "Fidélisation de la clientèle", icon: "♾" },
              { title: "Chiffre d'affaires soutenu", icon: "→" },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "box-shadow 0.3s",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--green-dark)",
                    flexShrink: 0,
                    width: "2rem",
                    textAlign: "center",
                  }}
                >
                  {b.icon}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {b.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFÉRENCIATION ── */}
      <section
        id="differentiation"
        style={{
          padding: "6rem 2rem",
          background: "var(--beige-bg)",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl">Pourquoi nous choisir ?</p>
            <div className="section-lbl-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--text-dark)",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            Notre différenciation
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
              marginTop: "2rem",
            }}
          >
            <div>
              <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, marginBottom: "1rem" }}>
                Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons.
              </p>
              <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
                Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre
                capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des
                environnements exigeants, structurés et ouverts à l'international.
              </p>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                "Spécialisation back et middle office",
                "Approche 100% opérationnelle",
                "Intégration à votre organisation",
                "Exécution fiable et continue",
                "Supervision qualité des livrables",
                "Intervention bilingue français / anglais",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingLeft: "1.25rem",
                    borderLeft: "3px solid var(--green-dark)",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "0.87rem", color: "var(--text-dark)", fontWeight: 500 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section
        id="engagements"
        style={{ padding: "6rem 2rem", background: "var(--green-dark)" }}
      >
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl section-lbl--light">Notre promesse</p>
            <div className="section-lbl-line" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.45,
              marginBottom: "1.25rem",
            }}
          >
            Nos engagements
          </h2>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais,
            la traçabilité des opérations et une communication claire avec vos équipes.
          </p>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées,
            la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité
            et réglementaires.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              "Qualité des livrables",
              "Respect des délais",
              "Traçabilité des opérations",
              "Contrôle à quatre yeux",
              "Communication claire et régulière",
              "Formation des ressources mobilisées",
              "Respect de vos exigences opérationnelles, qualité et réglementaires",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                }}
              >
                <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label-wrap" style={{ marginBottom: "1.5rem", justifyContent: "center" }}>
            <p className="section-lbl">Présenter un besoin</p>
            <div className="section-lbl-line" />
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-mid)",
              lineHeight: 1.8,
              margin: "0 auto 2rem",
              maxWidth: "520px",
            }}
          >
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une
            proposition adaptée.
          </p>
          <Link
            href="/nous-contacter"
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              background: "var(--green-dark)",
              color: "#fff",
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
