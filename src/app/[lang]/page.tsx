import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === "en";

  return (
    <main>

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingTop: "72px",
        overflow: "hidden",
      }}>
        {/* Background image — right portion */}
        <div style={{
          position: "absolute",
          top: 0, right: 0, bottom: 0,
          width: "55%",
          zIndex: 0,
        }}>
          <Image
            src="/building-hero.png"
            alt="Immeuble moderne – Menua Consulting"
            fill
            sizes="55vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          {/* Fade left edge */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.2) 30%, transparent 60%)",
          }} />
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
              <Link href={`/${lang}/nous-contacter`} style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: "#1a3a6b", color: "#ffffff",
                padding: "0.85rem 1.75rem",
                fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", textDecoration: "none",
              }}>
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
      <section style={{ backgroundColor: "#ffffff", padding: "6rem 0", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <ScrollReveal direction="up">
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.2em", color: "#1a3a6b", textTransform: "uppercase", marginBottom: "0.5rem",
          }}>
            MENUA CONSULTING
          </p>
          <div style={{ marginBottom: "2.5rem" }}>
            <img src="/LogoSansSlogan.jpeg" alt="Menua Consulting" style={{ height: "60px", objectFit: "contain" }} />
          </div>
          <p style={{
            fontSize: "0.92rem", color: "#374151", lineHeight: 1.85,
            maxWidth: "680px", margin: "0 auto 4rem",
          }}>
            {isEn
              ? "MENUA CONSULTING intervenes in support of financial, accounting, wealth management, data, and regulated teams to secure and strengthen the execution of back and middle office functions."
              : "MENUA CONSULTING intervient en appui des équipes financières, comptables, patrimoniales, data et réglementées pour sécuriser et renforcer l'exécution des fonctions back et middle office."}
          </p>

          {/* 4 pilliers */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem", borderTop: "1px solid #e2e8f0", paddingTop: "3rem",
          }}>
            {[
              {
                val: "100%",
                label: isEn ? "Operational approach" : "Approche opérationnelle",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="5" /><path d="M3 21v-2a7 7 0 0 1 14 0v2" />
                    <path d="M16 11l2 2 4-4" />
                  </svg>
                ),
              },
              {
                val: isEn ? "Dedicated teams" : "Équipes dédiées",
                label: isEn ? "integrated to your processes" : "intégrées à vos processus",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                val: isEn ? "Reliability & traceability" : "Fiabilité & traçabilité",
                label: isEn ? "of daily operations" : "des opérations au quotidien",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
              },
              {
                val: "Bilingue FR / EN",
                label: isEn ? "for international environments" : "pour des environnements internationaux",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1.5rem 1rem" }}>
                <div>{item.icon}</div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 600, color: "#0d1e35", textAlign: "center" }}>{item.val}</p>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center", lineHeight: 1.5 }}>{item.label}</p>
              </div>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ 3. NOS EXPERTISES ═════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#f5f7fa", padding: "6rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.18em", color: "#1a3a6b", textTransform: "uppercase", marginBottom: "0.5rem",
          }}>
            {isEn ? "OUR EXPERTISE" : "NOS EXPERTISES"}
          </p>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            color: "#0d1e35", fontWeight: 500, marginBottom: "3.5rem",
          }}>
            {isEn ? "NOS EXPERTISES AU SERVICE DE VOS ENJEUX" : "NOS EXPERTISES AU SERVICE DE VOS ENJEUX"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
            {[
              {
                title: "Finance & Reporting",
                desc: isEn ? "Production and reliability of financial reports, KPIs and performance analysis." : "Production et fiabilisation des reportings financiers, KPI et analyses de performance.",
                href: `/${lang}/vos-besoins#finance`,
                icon: (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" /><polyline points="2 12 6 8 12 14 22 4" />
                  </svg>
                ),
              },
              {
                title: "Contrôle de Gestion",
                desc: isEn ? "Budgeting, cost analysis and steering of operational performance." : "Suivi budgétaire, analyse des coûts et pilotage de la performance opérationnelle.",
                href: `/${lang}/vos-besoins#controle`,
                icon: (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
              {
                title: "Risques & Conformité",
                desc: isEn ? "KYC, AML/CFT, documentary control and support on compliance missions." : "KYC, LCB-FT, contrôle documentaire et appui aux missions de conformité.",
                href: `/${lang}/vos-besoins#risques`,
                icon: (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
              },
              {
                title: "Support Comptable & Data",
                desc: isEn ? "Accounting support, reconciliations, data cleaning and reporting preparation." : "Saisie comptable, rapprochements, data cleaning et préparation de reporting.",
                href: `/${lang}/vos-besoins#comptable`,
                icon: (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                ),
              },
              {
                title: "Gestion de Patrimoine & Support CGP",
                desc: isEn ? "Preparation and tracking of client files for wealth managers and family offices." : "Préparation et suivi des dossiers clients pour cabinets et family offices.",
                href: `/${lang}/vos-besoins#patrimoine`,
                icon: (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><polyline points="8 21 12 17 16 21" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div key={card.title} style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "2rem 1.5rem",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
                transition: "box-shadow 0.3s",
                cursor: "pointer",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  backgroundColor: "#eef2fb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontWeight: 600,
                  color: "#0d1e35", textAlign: "center", lineHeight: 1.4,
                }}>{card.title}</h3>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.6, textAlign: "center", flexGrow: 1 }}>
                  {card.desc}
                </p>
                <Link href={card.href} style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "50%",
                  border: "1.5px solid #1a3a6b", color: "#1a3a6b", textDecoration: "none",
                  fontSize: "0.85rem", transition: "all 0.2s",
                }}>
                  →
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <Link href={`/${lang}/vos-besoins`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              backgroundColor: "#1a3a6b", color: "#ffffff",
              padding: "0.85rem 2rem",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              {isEn ? "Discover all our services" : "Découvrir tous nos services"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. NOTRE APPROCHE — image gauche + texte droite ═══════════════ */}
      <section style={{ backgroundColor: "#ffffff", padding: "6rem 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "5rem", alignItems: "center" }}>
          {/* Image */}
          <div style={{ position: "relative", height: "440px", borderRadius: "4px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}>
            <Image src="/team-meeting.png" alt="Notre approche – équipe en réunion" fill sizes="50vw" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>

          {/* Text */}
          <div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.18em", color: "#1a3a6b", textTransform: "uppercase", marginBottom: "0.75rem",
            }}>
              {isEn ? "OUR APPROACH" : "NOTRE APPROCHE"}
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
              color: "#0d1e35", fontWeight: 500, lineHeight: 1.3, marginBottom: "1.5rem",
            }}>
              {isEn
                ? "A rigorous, flexible execution perfectly integrated into your teams."
                : "Une exécution rigoureuse, flexible et parfaitement intégrée à vos équipes."}
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                isEn ? "Rapid and tailored intervention" : "Intervention rapide et sur-mesure",
                isEn ? "Dedicated and evolving teams" : "Équipes dédiées et évolutives",
                isEn ? "Proven methodology" : "Méthodologie éprouvée",
                isEn ? "Permanent quality control" : "Contrôle qualité permanent",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#374151" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <Link href={`/${lang}/nous-connaitre`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              backgroundColor: "#1a3a6b", color: "#ffffff",
              padding: "0.85rem 1.75rem",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              {isEn ? "Discover our solutions" : "Découvrir nos solutions"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. LA CONFIANCE AU CŒUR — dark navy ═══════════════════════════ */}
     <section style={{ backgroundColor: "#06101e", padding: "6rem 0", width: "85%", margin: "0 auto", borderRadius: "16px" }}>

        <div className="container" style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            {isEn ? "OUR COMMITMENTS" : "NOS ENGAGEMENTS"}
          </p>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            color: "#ffffff", fontWeight: 500, marginBottom: "4rem",
          }}>
            {isEn ? "TRUST AT THE HEART OF OUR COMMITMENTS" : "LA CONFIANCE AU CŒUR DE NOS ENGAGEMENTS"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
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
              <div key={idx} style={{
                padding: "2.5rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
                backgroundColor: "rgba(255,255,255,0.03)",
              }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  border: "1px solid rgba(91,140,238,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "#ffffff", fontWeight: 600 }}>{item.title}</h3>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, textAlign: "center" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CTA — VOUS AVEZ UN BESOIN (creative layout) ════════════════ */}
      <section style={{
        position: "relative",
        width: "90%",
        maxWidth: "1400px",
        margin: "5rem auto",
        padding: "0",
      }}>
        {/* Le fond bleu réduit en hauteur (effet superposé/overlapping) */}
        <div style={{
          position: "absolute",
          top: "15%",       /* Décale le haut vers le bas pour réduire la hauteur */
          bottom: "15%",    /* Remonte le bas pour réduire la hauteur */
          left: 0,
          right: 0,
          backgroundColor: "#0d1e35",
          borderTop: "6px solid #1a3a6b",
          borderBottom: "6px solid #1a3a6b",
          borderRadius: "16px",
          zIndex: -1,
        }} />

        <div className="container" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "0", alignItems: "stretch", minHeight: "420px" }}>

          {/* ── Left: framed image with diagonal right edge ── */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* Decorative navy left-edge accent bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6px", background: "#b8952a", zIndex: 3 }} />

            {/* Decorative dots grid behind image (top-left corner) */}
            <div style={{
              position: "absolute", top: "-1rem", left: "1.5rem",
              width: "80px", height: "80px", zIndex: 2,
              backgroundImage: "radial-gradient(circle, rgba(184,149,42,0.35) 1.5px, transparent 1.5px)",
              backgroundSize: "10px 10px",
            }} />

            {/* Image container — NOT full width, with padding top & bottom */}
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
              {/* Dark vignette at edges */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, rgba(13,30,53,0.25) 0%, transparent 40%, rgba(13,30,53,0.1) 100%)",
              }} />
            </div>
          </div>

          {/* ── Right: white card with content ── */}
          <div style={{
            background: "#ffffff",
            padding: "3.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}>
            {/* Decorative gold top-border strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#b8952a" }} />

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
            }}>
              {isEn
                ? "Present your need and receive an initial analysis within 24 working hours."
                : "Présentez votre besoin et recevez une première analyse sous 24h ouvrées."}
            </h2>

            {/* Checkmarks */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                isEn ? "Response within 24 working hours" : "Réponse sous 24h ouvrées",
                isEn ? "Personalised analysis" : "Analyse personnalisée",
                isEn ? "No commitment" : "Sans engagement",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.86rem", color: "#374151" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#1a3a6b" />
                    <polyline points="8 12 11 15 16 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={`/${lang}/nous-contacter`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                backgroundColor: "#1a3a6b",
                color: "#ffffff",
                padding: "1rem 2rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {isEn ? "Submit a need" : "Présenter un besoin"} →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
