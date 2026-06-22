import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === "en";

  return (
    <main>

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section className="section-hero">
        {/* Background image — right portion */}
        <div className="absolute top-0 right-0 bottom-0 w-full md:w-[55%] z-0">
          <Image
            src="/finance-hero.png"
            alt="Bureau financier – Menua Consulting"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          {/* Fade left edge */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/80 md:via-white/20 to-transparent" />
        </div>

        {/* Left content */}
        <div className="container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <ScrollReveal direction="up" delay={100}>
          <div style={{ maxWidth: "520px", padding: "5rem 0" }}>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
              color: "#0d1e35",
              lineHeight: 1.2,
              fontWeight: 500,
              marginBottom: "1.5rem",
            }}>
              {isEn
                ? "Operational outsourcing of back & middle office functions"
                : "Externalisation opérationnelle des fonctions back & middle office"}
            </h1>

            <p style={{
              fontSize: "0.9rem",
              color: "#374151",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              maxWidth: "420px",
            }}>
              {isEn
                ? "We secure the execution of your back and middle office operations so your teams can focus on strategic decisions."
                : "Nous sécurisons l'exécution de vos opérations back et middle office afin de permettre à vos équipes de se concentrer sur les décisions stratégiques."}
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href={`/${lang}/nous-contacter`} className="btn-primary">
                {isEn ? "Submit a need" : "Présenter un besoin"} →
              </Link>
            </div>

            <p style={{
              marginTop: "2rem",
              fontSize: "0.75rem",
              color: "#6b7280",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              🌐 {isEn ? "Interventions in French and English – bilingual operational profiles" : "Interventions en français et en anglais – profils opérationnels bilingues"}
            </p>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ 2. MENUA CONSULTING — Intro + 4 pilliers ═══════════════════════ */}
      <section className="section-intro">
        <ScrollReveal>
          <div className="container" style={{ maxWidth: "1000px" }}>
            <p className="surtitle text-center">
              {isEn ? "ABOUT MENUA CONSULTING" : "À PROPOS DE MENUA CONSULTING"}
            </p>
            <h2 className="section-title text-center">
              {isEn ? "The partner for your demanding operational challenges" : "Le partenaire de vos enjeux opérationnels exigeants"}
            </h2>
            <p className="text-center" style={{ fontSize: "1.1rem", color: "#374151", lineHeight: 1.6, marginBottom: "2rem" }}>
              {isEn ? "We support financial institutions, specialized cabinets, and large companies by securing their back and middle office functions. Beyond consulting, we engage directly in the execution of your processes." : "Nous accompagnons les institutions financières, cabinets spécialisés et grandes entreprises en sécurisant leurs fonctions back et middle office. Au-delà du conseil, nous nous engageons directement dans l'exécution de vos processus."}
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link href={`/${lang}/nous-connaitre`} className="btn-secondary">
                {isEn ? "DISCOVER OUR APPROACH" : "DÉCOUVRIR NOTRE APPROCHE"}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══ 3. NOS EXPERTISES ═════════════════════════════════════════════ */}
      <section className="section-expertises">
        <div className="container">
          <ScrollReveal>
            <p className="surtitle">{isEn ? "OUR DOMAINS OF EXPERTISE" : "NOS DOMAINES D'INTERVENTION"}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
              <h2 className="section-title" style={{ margin: 0, maxWidth: "600px" }}>
                {isEn ? "Targeted solutions for each financial function" : "Des solutions ciblées pour chaque fonction financière"}
              </h2>
              <Link href={`/${lang}/vos-besoins`} className="btn-text">
                {isEn ? "SEE ALL OUR DOMAINS" : "VOIR TOUS NOS DOMAINES"} →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "Finance & Reporting",
                  desc: isEn ? "Production and reliability of financial reports, KPIs and performance analysis." : "Production et fiabilisation des reportings financiers, KPI et analyses de performance.",
                  href: `/${lang}/vos-besoins/finance`,
                  icon: "📈"
                },
                {
                  title: isEn ? "Management Control" : "Contrôle de Gestion",
                  desc: isEn ? "Budget tracking, cost analysis, and operational performance steering." : "Suivi budgétaire, analyse des coûts et pilotage de la performance opérationnelle.",
                  href: `/${lang}/vos-besoins/controle`,
                  icon: "⚙️"
                },
                {
                  title: isEn ? "Risks & Compliance" : "Risques & Conformité",
                  desc: isEn ? "KYC, AML/CFT, documentary control, and support for compliance missions." : "KYC, LCB-FT, contrôle documentaire et appui aux missions de conformité.",
                  href: `/${lang}/vos-besoins/risques`,
                  icon: "🛡️"
                },
                {
                  title: isEn ? "Accounting & Data Support" : "Support Comptable & Data",
                  desc: isEn ? "Accounting entry, reconciliations, data cleaning, and reporting preparation." : "Saisie comptable, rapprochements, data cleaning et préparation de reporting.",
                  href: `/${lang}/vos-besoins/comptable`,
                  icon: "📊"
                },
                {
                  title: isEn ? "Wealth Management & CGP Support" : "Gestion de Patrimoine & Support CGP",
                  desc: isEn ? "Preparation and tracking of client files for cabinets and family offices." : "Préparation et suivi des dossiers clients pour cabinets et family offices.",
                  href: `/${lang}/vos-besoins/patrimoine`,
                  icon: "🏛️"
                },
              ].map((card, idx) => (
                <ScrollReveal key={card.title} delay={idx * 150} direction="up" className="h-full">
                  <div className="card-expertise h-full">
                    <div className="card-expertise__icon">{card.icon}</div>
                    <h3 style={{
                      fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontWeight: 600,
                      color: "#0d1e35", textAlign: "center", lineHeight: 1.4,
                    }}>{card.title}</h3>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.6, textAlign: "center", flexGrow: 1 }}>
                      {card.desc}
                    </p>
                    <Link href={card.href} className="card-expertise__link mt-auto">
                      {isEn ? "Learn more" : "En savoir plus"} →
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
      </section>

      {/* ══ 4. NOTRE APPROCHE — image gauche + texte droite ═══════════════ */}
      <section className="section-approche">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <div style={{ position: "relative", height: "440px", borderRadius: "4px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
            <Image src="/team-meeting.png" alt="Notre approche – équipe en réunion" fill sizes="50vw" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>

          {/* Text */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <p className="surtitle surtitle--blue">
              {isEn ? "OUR APPROACH" : "NOTRE APPROCHE"}
            </p>
            <h2 className="section-title section-title--dark" style={{ marginBottom: "1.5rem" }}>
              {isEn
                ? "A rigorous, flexible execution perfectly integrated into your teams."
                : "Une exécution rigoureuse, flexible et parfaitement intégrée à vos équipes."}
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "0.75rem", alignSelf: "stretch" }}>
              {[
                isEn ? "Rapid and tailored intervention" : "Intervention rapide et sur-mesure",
                isEn ? "Dedicated and evolving teams" : "Équipes dédiées et évolutives",
                isEn ? "Proven methodology" : "Méthodologie éprouvée",
                isEn ? "Permanent quality control" : "Contrôle qualité permanent",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#374151" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <Link href={`/${lang}/nous-connaitre`} className="btn-primary">
              {isEn ? "Discover our solutions" : "Découvrir nos solutions"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. LA CONFIANCE AU CŒUR — dark navy ═══════════════════════════ */}
     <section className="section-engagements">
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <ScrollReveal direction="left">
            <p className="surtitle surtitle--light">
              {isEn ? "OUR COMMITMENTS" : "NOS ENGAGEMENTS"}
            </p>
            <h2 className="section-title section-title--light">
              {isEn ? "TRUST AT THE HEART OF OUR COMMITMENTS" : "LA CONFIANCE AU CŒUR DE NOS ENGAGEMENTS"}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                {
                  title: isEn ? "Integrity" : "Intégrité",
                  desc: isEn ? "Relations built on transparency and respect of your requirements." : "Des relations basées sur la transparence et le respect de vos exigences.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5b8cee" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: isEn ? "Excellence" : "Excellence",
                  desc: isEn ? "High standards for reliable and consistent deliverables." : "Des standards élevés pour des livrables fiables et conformes.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5b8cee" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  ),
                },
                {
                  title: isEn ? "Security" : "Sécurité",
                  desc: isEn ? "Data protection and respect of regulatory frameworks." : "Protection des données et respect des cadres réglementaires.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5b8cee" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                },
                {
                  title: isEn ? "Partnership" : "Partenariat",
                  desc: isEn ? "A lasting collaboration to support your ambitions." : "Une collaboration durable pour accompagner vos ambitions.",
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5b8cee" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 150} direction="up" className="h-full">
                  <div className="card-engagement h-full">
                    <div className="card-engagement__icon">
                      {item.icon}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "#ffffff", fontWeight: 600 }}>{item.title}</h3>
                    <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, textAlign: "center" }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
      </section>

      {/* ══ 6. CTA — VOUS AVEZ UN BESOIN (creative layout) ════════════════ */}
      <section className="section-cta">
        {/* Le fond bleu réduit en hauteur (effet superposé/overlapping) */}
        <div className="section-cta__bg"
             style={{ top: "10%", bottom: "10%" }} />

        <div className="container grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">

          {/* ── Top/Left: image (visible sur mobile en haut, à gauche sur md+) ── */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "380px" }}>
            {/* Decorative navy left-edge accent bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", background: "#b8952a", zIndex: 3 }} />

            {/* Decorative dots grid behind image (top-left corner) */}
            <div style={{
              position: "absolute", top: "-1rem", left: "1.5rem",
              width: "80px", height: "80px", zIndex: 2,
              backgroundImage: "radial-gradient(circle, rgba(184,149,42,0.35) 1.5px, transparent 1.5px)",
              backgroundSize: "10px 10px",
            }} />

            {/* Image container */}
            <div style={{
              position: "relative",
              height: "100%",
              minHeight: "380px",
              clipPath: "polygon(0 0, 92% 0, 100% 100%, 0 100%)",
              overflow: "hidden",
            }}>
              <Image
                src="/desk-laptop.png"
                alt="Présenter votre besoin – Menua Consulting"
                fill
                sizes="55vw"
                style={{ objectFit: "cover", objectPosition: "center 35%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, rgba(13,30,53,0.25) 0%, transparent 40%, rgba(13,30,53,0.1) 100%)",
              }} />
            </div>
          </div>

          {/* ── Right: white card with content ── */}
          <div className="section-cta__card">
            <ScrollReveal direction="left" delay={200}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                {/* Label */}
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#1a3a6b",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}>
                  {isEn ? "YOU HAVE A NEED?" : "VOUS AVEZ UN BESOIN ?"}
                </p>

                {/* Heading */}
                <h2 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                  color: "#0d1e35",
                  fontWeight: 500,
                  lineHeight: 1.35,
                  marginBottom: "2rem",
                  maxWidth: "420px",
                }}>
                  {isEn
                    ? "Present your need and receive an initial analysis within 24 working hours."
                    : "Présentez votre besoin et recevez une première analyse sous 24h ouvrées."}
                </h2>

                {/* Checkmarks */}
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "0.85rem", alignSelf: "stretch", maxWidth: "320px" }}>
                  {[
                    isEn ? "Response within 24 working hours" : "Réponse sous 24h ouvrées",
                    isEn ? "Personalised analysis" : "Analyse personnalisée",
                    isEn ? "No commitment" : "Sans engagement",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.86rem", color: "#374151" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" fill="#1a3a6b" />
                        <polyline points="8 12 11 15 16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={`/${lang}/nous-contacter`} className="btn-primary" style={{ padding: "1rem 2rem", justifyContent: "center" }}>
                  {isEn ? "Submit a need" : "Présenter un besoin"} →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </main>
  );
}
