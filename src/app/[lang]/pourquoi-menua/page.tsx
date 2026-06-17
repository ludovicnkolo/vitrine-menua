import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Why Menua – MENUA CONSULTING" : "Pourquoi MENUA CONSULTING ? – Bénéfices, différenciation, engagements",
    description: isEn
      ? "Why choose MENUA CONSULTING? Discover our commitments, our methodology and our values to support you in your operational challenges."
      : "Découvrez pourquoi choisir MENUA CONSULTING : gain de temps, réduction des charges internes, approche 100% opérationnelle, contrôle à quatre yeux et intervention bilingue.",
  };
}

export default async function PourquoiMenua({ params }: { params: Promise<{ lang: string }> }) {
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
              marginBottom: "1.5rem",
            }}
          >
            {isEn ? "Why MENUA CONSULTING?" : "Pourquoi MENUA CONSULTING ?"}
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
            {isEn ? "MENUA CONSULTING supports organizations facing demanding operational execution challenges." : "MENUA CONSULTING accompagne les organisations confrontées à des enjeux d'exécution opérationnelle exigeants."}
          </p>
        </div>
      </section>

      {/* ── BÉNÉFICES ── */}
      <section id="benefices" style={{ padding: "6rem 2rem", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="section-label-wrap" style={{ marginBottom: "2rem" }}>
            <p className="section-lbl">{isEn ? "What you gain" : "Ce que vous gagnez"}</p>
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
            {isEn ? "Benefits for your organization" : "Bénéfices pour votre organisation"}
          </h2>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            {isEn ? "By outsourcing your back and middle office functions to MENUA CONSULTING, you save time, improve your productivity, enhance your reliability, and sustainably support your turnover." : "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires."}
          </p>
          <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            {isEn ? "This organization allows you to reduce your internal costs, better absorb your business volumes, and sustainably retain your customer base." : "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle."}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              { title: isEn ? "Time saving" : "Gain de temps", icon: "⏱" },
              { title: isEn ? "Reduction of internal costs" : "Réduction des charges internes", icon: "↘" },
              { title: isEn ? "Increased productivity" : "Productivité accrue", icon: "↑" },
              { title: isEn ? "Enhanced efficiency" : "Efficacité renforcée", icon: "◎" },
              { title: isEn ? "Reliability of operations" : "Fiabilité des opérations", icon: "✓" },
              { title: isEn ? "Customer loyalty" : "Fidélisation de la clientèle", icon: "♾" },
              { title: isEn ? "Supported turnover" : "Chiffre d'affaires soutenu", icon: "→" },
            ].map((b, idx) => (
              <div
                key={idx}
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
            <p className="section-lbl">{isEn ? "Why choose us?" : "Pourquoi nous choisir ?"}</p>
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
            {isEn ? "Our differentiation" : "Notre différenciation"}
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
                {isEn ? "Specialists in back and middle office, we do not stop at analysis: we execute." : "Spécialistes du back et du middle office, nous ne nous arrêtons pas à l'analyse : nous exécutons."}
              </p>
              <p style={{ fontSize: "0.93rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
                {isEn ? "Our 100% operational approach, our integration into client organizations, and our ability to intervene in English as well as French allow us to operate in demanding, structured, and internationally open environments." : "Notre approche 100% opérationnelle, notre intégration aux organisations clientes et notre capacité d'intervention en français comme en anglais nous permettent d'intervenir dans des environnements exigeants, structurés et ouverts à l'international."}
              </p>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                isEn ? "Back and middle office specialization" : "Spécialisation back et middle office",
                isEn ? "100% operational approach" : "Approche 100% opérationnelle",
                isEn ? "Integration into your organization" : "Intégration à votre organisation",
                isEn ? "Reliable and continuous execution" : "Exécution fiable et continue",
                isEn ? "Quality supervision of deliverables" : "Supervision qualité des livrables",
                isEn ? "Bilingual English / French intervention" : "Intervention bilingue français / anglais",
              ].map((item, idx) => (
                <li
                  key={idx}
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
            <p className="section-lbl section-lbl--light">{isEn ? "Our Promise" : "Notre promesse"}</p>
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
            {isEn ? "Our Commitments" : "Nos engagements"}
          </h2>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "0.75rem" }}>
            {isEn ? "MENUA CONSULTING commits to the essential: the quality of deliverables, respect for deadlines, traceability of operations, and clear communication with your teams." : "MENUA CONSULTING s'engage sur l'essentiel : la qualité des livrables, le respect des délais, la traçabilité des opérations et une communication claire avec vos équipes."}
          </p>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, maxWidth: "720px", marginBottom: "3rem" }}>
            {isEn ? "Our interventions rely on four-eyes control, structured working methods, training of mobilized resources, and adherence to your operational, quality, and regulatory requirements." : "Nos interventions s'appuient sur un contrôle à quatre yeux, des méthodes de travail structurées, la formation des ressources mobilisées et le respect de vos exigences opérationnelles, qualité et réglementaires."}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              isEn ? "Quality of deliverables" : "Qualité des livrables",
              isEn ? "Respect for deadlines" : "Respect des délais",
              isEn ? "Traceability of operations" : "Traçabilité des opérations",
              isEn ? "Four-eyes control" : "Contrôle à quatre yeux",
              isEn ? "Clear and regular communication" : "Communication claire et régulière",
              isEn ? "Training of mobilized resources" : "Formation des ressources mobilisées",
              isEn ? "Adherence to your operational, quality, and regulatory requirements" : "Respect de vos exigences opérationnelles, qualité et réglementaires",
            ].map((item, idx) => (
              <div
                key={idx}
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
            <p className="section-lbl">{isEn ? "Submit a need" : "Présenter un besoin"}</p>
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
            {isEn ? "Present your operational needs, and we will respond with an initial analysis and a tailored proposal." : "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée."}
          </p>
          <Link
            href={`/${lang}/nous-contacter`}
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
            {isEn ? "Contact us" : "Nous contacter"}
          </Link>
        </div>
      </section>
    </main>
  );
}
