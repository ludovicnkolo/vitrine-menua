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

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

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
            {isEn ? "Operational outsourcing of back & middle office functions" : "Externalisation opérationnelle des fonctions back & middle office"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginTop: "1rem", fontStyle: "italic" }}>
            {isEn ? "Interventions in English and French – bilingual operational profiles." : "Interventions en français et en anglais – profils opérationnels bilingues."}
          </p>
          <Link href={`/${lang}/nous-contacter`} style={{
            display: "inline-block", marginTop: "2rem",
            padding: "0.85rem 2rem",
            background: "var(--beige-bg)", color: "var(--green-dark)",
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
            transition: "background 0.25s"
          }}>
            {isEn ? "Submit a need" : "Présenter un besoin"}
          </Link>
        </div>
      </section>

      {/* ══ 2. INTRO ══════════════════════════════════════════════════════ */}
      <section className="expertise-section">
        <div className="container">
          <SectionLabel>{isEn ? "Our mission" : "Notre mission"}</SectionLabel>
          <p style={{ fontSize: "1.1rem", color: "var(--text-mid)", lineHeight: 1.8, maxWidth: "760px", fontWeight: 300 }}>
            {isEn ? "MENUA CONSULTING provides support to financial, accounting, wealth, data, and compliance teams to secure and strengthen the execution of back and middle office functions." : "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office."}
          </p>
        </div>
      </section>

      {/* ══ 3. NOS EXPERTISES ════════════════════════════════════════════ */}
      <section className="expertise-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionLabel>{isEn ? "Our expertise" : "Nos expertises"}</SectionLabel>
          <div className="cards-grid">
            {[
              {
                title: isEn ? "Finance & reporting" : "Finance & reporting",
                desc:  isEn ? "Production, structuring, and reliability of financial reports for performance steering and decision support." : "Production, structuration et fiabilisation de reportings financiers destinés au pilotage de la performance et à l'aide à la décision.",
                link:  `/${lang}/vos-besoins#finance`,
                cta:   isEn ? "Discover" : "Découvrir",
              },
              {
                title: isEn ? "Risk & compliance" : "Risques & conformité",
                desc:  isEn ? "Operational support for risk and compliance teams: KYC, AML/CFT, documentary control, and remediation." : "Appui opérationnel aux équipes risques et conformité : KYC, LCB-FT, AML, contrôle documentaire et remédiation.",
                link:  `/${lang}/vos-besoins#risques`,
                cta:   isEn ? "Discover" : "Découvrir",
              },
              {
                title: isEn ? "Wealth & PWM support" : "Support patrimoine & CGP",
                desc:  isEn ? "Administrative support for wealth management firms, family offices, and wealth structuring entities." : "Appui administratif aux cabinets de gestion de patrimoine, family offices et structures patrimoniales.",
                link:  `/${lang}/vos-besoins#patrimoine`,
                cta:   isEn ? "Discover" : "Découvrir",
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
          <SectionLabel light>{isEn ? "Our solutions" : "Nos solutions"}</SectionLabel>
          <div className="cards-grid">
            {[
              {
                title: isEn ? "Urgency – Immediate reaction" : "Urgence – Réaction immédiate",
                desc:  isEn ? "Rapid mobilization of operational resources to meet an immediate need or absorb an activity overload." : "Mobilisation rapide de ressources opérationnelles pour répondre à un besoin immédiat ou absorber une surcharge d'activité.",
                href:  `/${lang}/nos-solutions#urgence`,
                cta:   isEn ? "Learn more" : "En savoir plus",
              },
              {
                title: isEn ? "Duration – Contractual flexibility" : "Durée – Flexibilité contractuelle",
                desc:  isEn ? "Flexible setups adapted to processing a set number of cases as well as ongoing recurring management." : "Dispositifs flexibles adaptés au traitement d'un nombre défini de dossiers comme à la gestion récurrente dans la durée.",
                href:  `/${lang}/nos-solutions#duree`,
                cta:   isEn ? "Learn more" : "En savoir plus",
              },
              {
                title: isEn ? "Volume – Team sizing" : "Volume – Dimensionnement d'équipe",
                desc:  isEn ? "A dedicated resource, temporary reinforcement, or an operational team: we adapt to your volumes and priorities." : "Une ressource dédiée, un renfort ponctuel ou une équipe opérationnelle : nous adaptons selon vos volumes et priorités.",
                href:  `/${lang}/nos-solutions#volume`,
                cta:   isEn ? "Learn more" : "En savoir plus",
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
          <SectionLabel>{isEn ? "Your needs" : "Vos besoins"}</SectionLabel>
          <h2 className="split-heading" style={{ fontStyle: "normal" }}>
            {isEn ? "Secure, optimize, and strengthen your operations" : "Sécuriser, optimiser et renforcer vos opérations"}
          </h2>
          <p className="split-body">
            {isEn ? "MENUA CONSULTING acts in support of financial, accounting, wealth, and compliance teams to secure the execution of back and middle office functions." : "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales et réglementées pour sécuriser l'exécution des fonctions back et middle office."}
          </p>
          <ul className="besoins-list" style={{ marginTop: "1.5rem" }}>
            {[
              isEn ? "Finance & financial reporting" : "Finance & reporting financier",
              isEn ? "Management control & steering" : "Contrôle de gestion & pilotage",
              isEn ? "Risk, compliance & regulatory" : "Risques, conformité & réglementaire",
              isEn ? "Accounting & data support" : "Support comptable & data",
              isEn ? "Wealth management & PWM support" : "Gestion de patrimoine & support CGP",
            ].map((item) => (
              <li key={item} style={{ position: "relative", paddingLeft: "1rem" }}>
                <span style={{ position: "absolute", left: 0, top: "2px", color: "var(--green-dark)" }}>→</span>
                <Link href={`/${lang}/vos-besoins`} className="besoin-link" style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: "1.5rem", justifyContent: "flex-end", width: "100%" }}>
            <p className="cta-label" style={{ color: "#8a7d6d", letterSpacing: "0.05em" }}>{isEn ? "SUBMIT A NEED" : "PRÉSENTER UN BESOIN"}</p>
            <ArrowBtn href={`/${lang}/nous-contacter`} />
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: "#fff", padding: "6rem 2rem 4rem" }}>
        <div className="boxed-split">
          <div className="split-image split-image--gradient" style={{ order: 1 }}>
            <Image src="/hero-bg.png" alt="Notre approche" fill sizes="50vw"
              style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
          <div className="split-content split-content--beige-light" style={{ order: 2, backgroundColor: "#e6dfd5" }}>
            <h2 className="alliance-title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", textTransform: "uppercase", fontStyle: "normal", letterSpacing: 0 }}>
              {isEn ? "Our 100% operational approach" : "Notre approche 100% opérationnelle"}
            </h2>
            <p className="split-body" style={{ marginTop: "1.5rem" }}>
              {isEn ? "MENUA CONSULTING adopts a resolutely operational stance: clients define the needs, methods, and priorities; we handle the execution." : "MENUA CONSULTING adopte une posture résolument opérationnelle : les clients définissent les besoins, les méthodes et les priorités, nous assurons l'exécution."}
            </p>
            <p className="split-body" style={{ marginTop: "1rem" }}>
              {isEn ? (
                <>Our approach is based on three pillars: <strong>operational continuity</strong>, <strong>action traceability</strong>, and <strong>deliverable reliability</strong>.</>
              ) : (
                <>Notre approche repose sur trois piliers : <strong>continuité opérationnelle</strong>, <strong>traçabilité des actions</strong> et <strong>fiabilité des livrables</strong>.</>
              )}
            </p>
            <div className="cta-row" style={{ marginTop: "2rem" }}>
              <p className="cta-label">{isEn ? "ABOUT US" : "NOUS CONNAÎTRE"}</p>
              <ArrowBtn href={`/${lang}/nous-connaitre`} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. POURQUOI MENUA ════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#fff", padding: "4rem 2rem 8rem" }}>
        <div className="boxed-split">
          <div className="split-content split-content--green" style={{ order: 1 }}>
            <h2 className="alliance-title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", textTransform: "uppercase", fontStyle: "normal", letterSpacing: 0, color: "#fff" }}>
              {isEn ? "Why MENUA CONSULTING?" : "Pourquoi MENUA CONSULTING ?"}
            </h2>
            <p className="split-body" style={{ marginTop: "1.5rem", color: "rgba(255,255,255,0.85)" }}>
              {isEn ? "Specialists in back and middle office, we don't just analyze: we execute." : "Spécialistes du back et du middle office, nous n'analysons pas : nous exécutons."}
            </p>
            <ul className="split-body" style={{ marginTop: "1.5rem", listStyle: "none", paddingLeft: 0, color: "rgba(255,255,255,0.85)" }}>
              {[
                isEn ? "Back and middle office specialization" : "Spécialisation back et middle office",
                isEn ? "100% operational approach" : "Approche 100% opérationnelle",
                isEn ? "Integration into your organization" : "Intégration à votre organisation",
                isEn ? "Reliable and continuous execution" : "Exécution fiable et continue",
                isEn ? "Quality supervision of deliverables" : "Supervision qualité des livrables",
                isEn ? "Bilingual English / French intervention" : "Intervention bilingue français / anglais",
              ].map((item) => (
                <li key={item} style={{ position: "relative", paddingLeft: "1.2rem", marginBottom: "0.6rem" }}>
                  <span style={{ position: "absolute", left: 0, top: "2px", color: "var(--beige-light)" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="cta-row" style={{ marginTop: "2.5rem" }}>
              <p className="cta-label" style={{ color: "var(--beige-light)" }}>{isEn ? "WHY CHOOSE US" : "POURQUOI NOUS CHOISIR"}</p>
              <ArrowBtn href={`/${lang}/pourquoi-menua`} dark={true} />
            </div>
          </div>
          <div className="split-image" style={{ order: 2 }}>
            <Image src="/team-meeting.png" alt="Pourquoi Menua" fill sizes="50vw"
              style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
        </div>
      </section>

      {/* ══ 8. ACTUALITÉS ════════════════════════════════════════════════ */}
      <section className="news-section">
        <div className="container">
          <SectionLabel>{isEn ? "News" : "Actualités"}</SectionLabel>
          <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", marginBottom: "2rem", maxWidth: "600px" }}>
            {isEn ? "MENUA CONSULTING conducts regular watch on financial, accounting, wealth, and regulatory developments to enlighten its clients." : "MENUA CONSULTING assure une veille régulière sur les évolutions financières, comptables, patrimoniales et réglementaires afin d'éclairer ses clients."}
          </p>
          <div className="cta-row">
            <p className="cta-label">{isEn ? "ALL NEWS" : "TOUTES LES ACTUALITÉS"}</p>
            <ArrowBtn href={`/${lang}/actualites`} />
          </div>
        </div>
      </section>

      {/* ══ 9. CTA CONTACT ═══════════════════════════════════════════════ */}
      <section className="solutions-section">
        <div className="container" style={{ textAlign: "center" }}>
          <SectionLabel light>{isEn ? "Contact us" : "Nous contacter"}</SectionLabel>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            {isEn ? "Present your operational needs, and we will respond with an initial analysis and a tailored proposal." : "Présentez votre besoin opérationnel, nous vous répondons avec une première analyse et une proposition adaptée."}
          </p>
          <Link href={`/${lang}/nous-contacter`} style={{
            display: "inline-block", padding: "0.85rem 2.5rem",
            background: "var(--beige-bg)", color: "var(--green-dark)",
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
          }}>
            {isEn ? "Submit a need" : "Présenter un besoin"}
          </Link>
        </div>
      </section>
    </main>
  );
}
