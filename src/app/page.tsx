import Link from "next/link";
import Image from "next/image";

function ArrowBtn({ href, dark = false }: { href: string; dark?: boolean }) {
  return (
    <Link href={href} className={dark ? "arrow-btn arrow-btn--dark" : "arrow-btn"}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="section-label-wrap" style={{ marginBottom: "2.5rem" }}>
      <p className={light ? "section-lbl section-lbl--light" : "section-lbl"}>{children}</p>
      <div className="section-lbl-line" />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* ══ 1. HERO ══════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-image-wrap">
          <Image src="/hero-bg.png" alt="Vue aérienne" fill sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }} priority />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content animate-fade-up">
          <h1 className="hero-title">MENUA CONSULTING</h1>
          <p className="hero-subtitle">
            Externalisation opérationnelle des fonctions back &amp; middle office
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginTop: "1rem", fontStyle: "italic" }}>
            Interventions en français et en anglais – profils opérationnels bilingues.
          </p>
          <Link href="/nous-contacter" style={{
            display: "inline-block", marginTop: "2rem",
            padding: "0.85rem 2rem",
            background: "var(--beige-bg)", color: "var(--green-dark)",
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
            transition: "background 0.25s"
          }}>
            Présenter un besoin
          </Link>
        </div>
      </section>

      {/* ══ 2. INTRO ══════════════════════════════════════════════════════ */}
      <section className="expertise-section">
        <div className="container">
          <SectionLabel>Notre mission</SectionLabel>
          <p style={{ fontSize: "1.1rem", color: "var(--text-mid)", lineHeight: 1.8, maxWidth: "760px", fontWeight: 300 }}>
            MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales,
            data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office.
          </p>
        </div>
      </section>

      {/* ══ 3. NOS EXPERTISES ════════════════════════════════════════════ */}
      <section className="expertise-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionLabel>Nos expertises</SectionLabel>
          <div className="cards-grid">
            {[
              {
                title: "Finance & reporting",
                desc:  "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance et à l'aide à la décision.",
                link:  "/vos-besoins#finance",
                cta:   "Découvrir",
              },
              {
                title: "Risques & conformité",
                desc:  "Appui opérationnel aux équipes risques et conformité : KYC, LCB-FT, AML, contrôle documentaire et remédiation.",
                link:  "/vos-besoins#risques",
                cta:   "Découvrir",
              },
              {
                title: "Support patrimoine & CGP",
                desc:  "Appui administratif aux cabinets de gestion de patrimoine, family offices et structures patrimoniales.",
                link:  "/vos-besoins#patrimoine",
                cta:   "Découvrir",
              },
            ].map((card) => (
              <div key={card.title} className="exp-card">
                <h3 className="exp-card-title">{card.title}</h3>
                <p className="exp-card-body">{card.desc}</p>
                <div className="exp-card-footer" style={{ marginTop: "auto", alignItems: "flex-end", display: "flex", flexDirection: "column" }}>
                  <p className="exp-card-cta" style={{ textAlign: "right" }}>{card.cta}</p>
                  <ArrowBtn href={card.link} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. NOS SOLUTIONS ═════════════════════════════════════════════ */}
      <section className="solutions-section">
        <div className="container">
          <SectionLabel light>Nos solutions</SectionLabel>
          <div className="cards-grid">
            {[
              {
                title: "Urgence – Réaction immédiate",
                desc:  "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat ou absorber une surcharge d'activité.",
                href:  "/nos-solutions#urgence",
                cta:   "En savoir plus",
              },
              {
                title: "Durée – Flexibilité contractuelle",
                desc:  "Dispositifs flexibles adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente dans la durée.",
                href:  "/nos-solutions#duree",
                cta:   "En savoir plus",
              },
              {
                title: "Volume – Dimensionnement d'équipe",
                desc:  "Une ressource dédiée, un renfort ponctuel ou une équipe opérationnelle : nous adaptons selon vos volumes et priorités.",
                href:  "/nos-solutions#volume",
                cta:   "En savoir plus",
              },
            ].map((sol) => (
              <div key={sol.title} className="sol-card">
                <h3 className="sol-card-title">{sol.title}</h3>
                <p className="sol-card-body">{sol.desc}</p>
                <div className="sol-card-footer" style={{ marginTop: "auto", alignItems: "center", justifyContent: "flex-end", display: "flex" }}>
                  <p className="sol-card-cta" style={{ textAlign: "right" }}>{sol.cta}</p>
                  <ArrowBtn href={sol.href} dark />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. VOS BESOINS (split) ════════════════════════════════════════ */}
      <section className="split-grid" style={{ backgroundColor: "#fff" }}>
        <div className="split-image">
          <Image src="/team-meeting.png" alt="Équipe" fill sizes="50vw"
            style={{ objectFit: "cover", objectPosition: "center top" }} />
        </div>
        <div className="split-content split-content--beige" style={{ backgroundColor: "#f4efe9" }}>
          <SectionLabel>Vos besoins</SectionLabel>
          <h2 className="split-heading" style={{ fontStyle: "normal" }}>
            Sécuriser, optimiser et renforcer vos opérations
          </h2>
          <p className="split-body">
            MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales
            et réglementées pour sécuriser l'exécution des fonctions back et middle office.
          </p>
          <ul className="besoins-list" style={{ marginTop: "1.5rem" }}>
            {[
              "Finance & reporting financier",
              "Contrôle de gestion & pilotage",
              "Risques, conformité & réglementaire",
              "Support comptable & data",
              "Gestion de patrimoine & support CGP",
            ].map((item) => (
              <li key={item} style={{ position: "relative", paddingLeft: "1rem" }}>
                <span style={{ position: "absolute", left: 0, top: "2px", color: "var(--green-dark)" }}>→</span>
                <Link href="/vos-besoins" className="besoin-link" style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: "1.5rem", justifyContent: "flex-end", width: "100%" }}>
            <p className="cta-label" style={{ color: "#8a7d6d", letterSpacing: "0.05em" }}>PRÉSENTER UN BESOIN</p>
            <ArrowBtn href="/nous-contacter" />
          </div>
        </div>
      </section>

      {/* ══ 6. APPROCHE (split inverse) ══════════════════════════════════ */}
      <section className="split-grid" style={{ backgroundColor: "#fff" }}>
        <div className="split-image split-image--gradient" style={{ order: 1 }}>
          <Image src="/hero-bg.png" alt="Notre approche" fill sizes="50vw"
            style={{ objectFit: "cover", objectPosition: "center" }} />
        </div>
        <div className="split-content split-content--beige-light" style={{ order: 2, backgroundColor: "#e6dfd5" }}>
          <h2 className="alliance-title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", textTransform: "uppercase", fontStyle: "normal", letterSpacing: 0 }}>
            Notre approche 100% opérationnelle
          </h2>
          <p className="split-body" style={{ marginTop: "1.5rem" }}>
            MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent
            les besoins, les méthodes et les priorités, nous assurons l'exécution.
          </p>
          <p className="split-body" style={{ marginTop: "1rem" }}>
            Notre approche repose sur trois piliers : <strong>continuité opérationnelle</strong>,{" "}
            <strong>traçabilité des actions</strong> et <strong>fiabilité des livrables</strong>.
          </p>
          <div className="cta-row" style={{ marginTop: "2rem" }}>
            <p className="cta-label">NOUS CONNAÎTRE</p>
            <ArrowBtn href="/nous-connaitre" />
          </div>
        </div>
      </section>

      {/* ══ 7. POURQUOI MENUA ════════════════════════════════════════════ */}
      <section className="split-grid" style={{ backgroundColor: "#fff" }}>
        <div className="split-content" style={{ order: 1 }}>
          <h2 className="alliance-title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", textTransform: "uppercase", fontStyle: "normal", letterSpacing: 0 }}>
            Pourquoi MENUA CONSULTING ?
          </h2>
          <p className="split-body" style={{ marginTop: "1.5rem" }}>
            Spécialistes du back et du middle office, nous n'analysons pas : nous exécutons.
          </p>
          <ul className="split-body" style={{ marginTop: "1.5rem", listStyle: "none", paddingLeft: 0 }}>
            {[
              "Spécialisation back et middle office",
              "Approche 100% opérationnelle",
              "Intégration à votre organisation",
              "Exécution fiable et continue",
              "Supervision qualité des livrables",
              "Intervention bilingue français / anglais",
            ].map((item) => (
              <li key={item} style={{ position: "relative", paddingLeft: "1rem", marginBottom: "0.5rem" }}>
                <span style={{ position: "absolute", left: 0, top: "2px", color: "var(--green-dark)" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: "2rem" }}>
            <p className="cta-label">POURQUOI NOUS CHOISIR</p>
            <ArrowBtn href="/pourquoi-menua" />
          </div>
        </div>
        <div className="split-image" style={{ order: 2 }}>
          <Image src="/team-meeting.png" alt="Pourquoi Menua" fill sizes="50vw"
            style={{ objectFit: "cover", objectPosition: "center" }} />
        </div>
      </section>

      {/* ══ 8. ACTUALITÉS ════════════════════════════════════════════════ */}
      <section className="news-section">
        <div className="container">
          <SectionLabel>Actualités</SectionLabel>
          <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", marginBottom: "2rem", maxWidth: "600px" }}>
            MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables,
            patrimoniales et réglementaires afin d'éclairer ses clients.
          </p>
          <div className="cta-row">
            <p className="cta-label">TOUTES LES ACTUALITÉS</p>
            <ArrowBtn href="/actualites" />
          </div>
        </div>
      </section>

      {/* ══ 9. CTA CONTACT ═══════════════════════════════════════════════ */}
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center" }}>
          <SectionLabel light>Nous contacter</SectionLabel>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée.
          </p>
          <Link href="/nous-contacter" style={{
            display: "inline-block", padding: "0.85rem 2.5rem",
            background: "var(--beige-bg)", color: "var(--green-dark)",
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
          }}>
            Présenter un besoin
          </Link>
        </div>
      </section>
    </main>
  );
}
