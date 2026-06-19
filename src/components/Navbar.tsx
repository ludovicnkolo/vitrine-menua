"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/* ─── DATA ─────────────────────────────────────────────────────── */
interface MegaLink { label: string; href: string }
interface MegaCol  { heading: string; headingHref: string; links: MegaLink[] }
interface Featured { title: string; body: string; cta: string; ctaHref: string; accent: string }
interface NavItem  { label: string; href: string; mega?: { columns: MegaCol[]; featured?: Featured } }

export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname();
  
  // Helper to switch language
  const switchLangHref = (newLang: string) => {
    if (!pathname) return `/${newLang}`;
    const segments = pathname.split('/');
    segments[1] = newLang; // Replace 'fr' or 'en'
    return segments.join('/');
  };

  const navItems: NavItem[] = lang === 'en' ? [
    {
      label: "About us",
      href:  "/en/nous-connaitre",
      mega: {
        columns: [
          {
            heading: "About us", headingHref: "/en/nous-connaitre",
            links: [
              { label: "Our firm",                 href: "/en/nous-connaitre#presentation" },
              { label: "Our approach",             href: "/en/nous-connaitre#approche" },
              { label: "Our methodology",          href: "/en/nous-connaitre#methodologie" },
              { label: "Accreditations",           href: "/en/nous-connaitre#accreditations" },
              { label: "Our team",                 href: "/en/nous-connaitre#equipe" },
            ],
          },
          {
            heading: "Why choose us?", headingHref: "/en/pourquoi-menua",
            links: [
              { label: "Our benefits",             href: "/en/pourquoi-menua#benefices" },
              { label: "Our differentiation",      href: "/en/pourquoi-menua#differentiation" },
              { label: "Our commitments",          href: "/en/pourquoi-menua#engagements" },
            ],
          },
        ],
        featured: {
          title: "Join us",
          body:  "Autonomous operational profile? Join the Menua Consulting network.",
          cta:   "See opportunities",
          ctaHref: "/en/nous-rejoindre",
          accent: "#b8952a",
        },
      },
    },
    {
      label: "Your needs",
      href:  "/en/vos-besoins",
      mega: {
        columns: [
          {
            heading: "Financial functions", headingHref: "/en/vos-besoins",
            links: [
              { label: "Finance & reporting",      href: "/en/vos-besoins#finance" },
              { label: "Management control",       href: "/en/vos-besoins#controle" },
              { label: "Risk & compliance",        href: "/en/vos-besoins#risques" },
            ],
          },
          {
            heading: "Back & Middle Office", headingHref: "/en/vos-besoins",
            links: [
              { label: "Accounting & data support", href: "/en/vos-besoins#comptable" },
              { label: "Wealth management",         href: "/en/vos-besoins#patrimoine" },
              { label: "Other operational needs",   href: "/en/vos-besoins#autres" },
            ],
          },
        ],
        featured: {
          title: "Your needs",
          body:  "Tailor-made operational resources, integrated into your organization.",
          cta:   "Explore our domains",
          ctaHref: "/en/vos-besoins",
          accent: "#2c4a3e",
        },
      },
    },
    {
      label: "Our solutions",
      href:  "/en/nos-solutions",
      mega: {
        columns: [
          {
            heading: "Flexibility", headingHref: "/en/nos-solutions",
            links: [
              { label: "Urgency – Rapid mobilization", href: "/en/nos-solutions#urgence" },
              { label: "Duration – Short & long missions", href: "/en/nos-solutions#duree" },
              { label: "Volume – Team sizing",         href: "/en/nos-solutions#volume" },
            ],
          },
          {
            heading: "Organization", headingHref: "/en/nos-solutions",
            links: [
              { label: "Organization mode",            href: "/en/nos-solutions#organisation" },
              { label: "Bilingual intervention EN/FR", href: "/en/nos-solutions#langues" },
            ],
          },
        ],
        featured: {
          title: "Tailored solutions",
          body:  "Urgency, duration, volume: we adapt each system to your reality.",
          cta:   "Discover our formulas",
          ctaHref: "/en/nos-solutions",
          accent: "#b8952a",
        },
      },
    },
    { label: "Why Menua?", href: "/en/pourquoi-menua" },
    { label: "News",       href: "/en/actualites" },
  ] : [
    {
      label: "Nous connaître",
      href:  "/fr/nous-connaitre",
      mega: {
        columns: [
          {
            heading: "Nous connaître", headingHref: "/fr/nous-connaitre",
            links: [
              { label: "Présentation du cabinet",         href: "/fr/nous-connaitre#presentation" },
              { label: "Notre approche",                  href: "/fr/nous-connaitre#approche" },
              { label: "Notre méthodologie",              href: "/fr/nous-connaitre#methodologie" },
              { label: "Accréditations & certifications", href: "/fr/nous-connaitre#accreditations" },
              { label: "Notre équipe",                    href: "/fr/nous-connaitre#equipe" },
            ],
          },
          {
            heading: "Pourquoi nous choisir ?", headingHref: "/fr/pourquoi-menua",
            links: [
              { label: "Nos bénéfices",           href: "/fr/pourquoi-menua#benefices" },
              { label: "Notre différenciation",   href: "/fr/pourquoi-menua#differentiation" },
              { label: "Nos engagements",         href: "/fr/pourquoi-menua#engagements" },
            ],
          },
        ],
        featured: {
          title: "Nous rejoindre",
          body:  "Profil opérationnel autonome ? Intégrez le réseau Menua Consulting.",
          cta:   "Voir les opportunités",
          ctaHref: "/fr/nous-rejoindre",
          accent: "#b8952a",
        },
      },
    },
    {
      label: "Vos besoins",
      href:  "/fr/vos-besoins",
      mega: {
        columns: [
          {
            heading: "Fonctions financières", headingHref: "/fr/vos-besoins",
            links: [
              { label: "Finance & reporting",    href: "/fr/vos-besoins#finance" },
              { label: "Contrôle de gestion",    href: "/fr/vos-besoins#controle" },
              { label: "Risques & conformité",   href: "/fr/vos-besoins#risques" },
            ],
          },
          {
            heading: "Back & Middle Office", headingHref: "/fr/vos-besoins",
            links: [
              { label: "Support comptable & data",     href: "/fr/vos-besoins#comptable" },
              { label: "Gestion de patrimoine & CGP",  href: "/fr/vos-besoins#patrimoine" },
              { label: "Autres besoins opérationnels", href: "/fr/vos-besoins#autres" },
            ],
          },
        ],
        featured: {
          title: "Vos besoins",
          body:  "Des ressources opérationnelles sur mesure, intégrées à votre organisation.",
          cta:   "Explorer nos domaines",
          ctaHref: "/fr/vos-besoins",
          accent: "#2c4a3e",
        },
      },
    },
    {
      label: "Nos solutions",
      href:  "/fr/nos-solutions",
      mega: {
        columns: [
          {
            heading: "Flexibilité", headingHref: "/fr/nos-solutions",
            links: [
              { label: "Urgence – Mobilisation rapide",      href: "/fr/nos-solutions#urgence" },
              { label: "Durée – Missions courtes & longues", href: "/fr/nos-solutions#duree" },
              { label: "Volume – Dimensionnement d'équipe",  href: "/fr/nos-solutions#volume" },
            ],
          },
          {
            heading: "Organisation", headingHref: "/fr/nos-solutions",
            links: [
              { label: "Mode d'organisation",           href: "/fr/nos-solutions#organisation" },
              { label: "Intervention bilingue FR / EN", href: "/fr/nos-solutions#langues" },
            ],
          },
        ],
        featured: {
          title: "Solutions sur mesure",
          body:  "Urgence, durée, volume : nous adaptons chaque dispositif à votre réalité.",
          cta:   "Découvrir nos formules",
          ctaHref: "/fr/nos-solutions",
          accent: "#b8952a",
        },
      },
    },
    { label: "Pourquoi Menua ?", href: "/fr/pourquoi-menua" },
    { label: "Actualités",       href: "/fr/actualites" },
  ];


/* ─── MEGA PANEL ──────────────────────────────────────────────── */
function MegaPanel({ item, visible }: { item: NavItem; visible: boolean }) {
  if (!item.mega) return null;
  const { columns, featured } = item.mega;
  return (
    <div className={`mega-panel${visible ? " mega-panel--visible" : ""}`}>
      <div className="mega-inner">
        <div className="mega-cols">
          {columns.map((col) => (
            <div key={col.heading} className="mega-col">
              <Link href={col.headingHref} className="mega-col-heading">
                {col.heading}
                <svg className="mega-col-heading-arrow" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <ul className="mega-col-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="mega-col-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {featured && (
          <div className="mega-featured" style={{ "--featured-accent": featured.accent } as React.CSSProperties}>
            <div className="mega-featured-accent" />
            <p className="mega-featured-title">{featured.title}</p>
            <p className="mega-featured-body">{featured.body}</p>
            <Link href={featured.ctaHref} className="mega-featured-cta">
              {featured.cta}
              <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── RENDER ──────────────────────────────────────────────────── */
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeItem,     setActiveItem]     = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveItem(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveItem(null), 150);
  }, []);

  return (
    <>
      {/* ── Header bar ── */}
      <header className={scrolled ? "nav-header nav-header--scrolled" : "nav-header"}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href={`/${lang}`} className="nav-logo" style={{ display: "flex", alignItems: "center" }}>
            <img src="/LogoAvecSlogan.jpeg" alt="Menua Consulting" style={{ height: "48px", objectFit: "contain" }} />
          </Link>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Navigation principale">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="nav-item-wrap"
                onMouseEnter={() => item.mega && openMenu(item.label)}
                onMouseLeave={item.mega ? scheduleClose : undefined}
              >
                <Link
                  href={item.href}
                  className={`nav-link${activeItem === item.label ? " nav-link--active" : ""}`}
                >
                  {item.label}
                  {item.mega && (
                    <svg
                      className={`nav-link-chevron${activeItem === item.label ? " nav-link-chevron--open" : ""}`}
                      viewBox="0 0 20 20" fill="none" width="11" height="11"
                    >
                      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right side: Lang switch + CTAs */}
          <div className="nav-right">
            {/* FR | EN switch */}
            <div className="nav-lang">
              <Link href={switchLangHref('fr')} className={`nav-lang-btn ${lang === 'fr' ? 'nav-lang-btn--active' : ''}`} aria-label="Version française">FR</Link>
              <span className="nav-lang-sep">|</span>
              <Link href={switchLangHref('en')} className={`nav-lang-btn ${lang === 'en' ? 'nav-lang-btn--active' : ''}`} aria-label="English version">EN</Link>
            </div>

            {/* CTAs */}
            <div className="nav-cta-wrap">
              <Link href={`/${lang}/nous-rejoindre`} className="nav-cta nav-cta--outline">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {lang === 'en' ? "Join us" : "Nous rejoindre"}
              </Link>
              <Link href={`/${lang}/nous-contacter`} className="nav-cta nav-cta--solid">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {lang === 'en' ? "Contact us" : "Nous contacter"}
              </Link>
            </div>
          </div>

          {/* Burger */}
          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path d="M18 6L6 18M6 6l12 12"/>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            {/* Lang switch mobile */}
            <div className="mobile-lang">
              <Link href={switchLangHref('fr')} className={`nav-lang-btn ${lang === 'fr' ? 'nav-lang-btn--active' : ''}`} onClick={() => setMenuOpen(false)}>FR</Link>
              <span className="nav-lang-sep">|</span>
              <Link href={switchLangHref('en')} className={`nav-lang-btn ${lang === 'en' ? 'nav-lang-btn--active' : ''}`} onClick={() => setMenuOpen(false)}>EN</Link>
            </div>

            {navItems.map((item) => (
              <div key={item.label} className="mobile-item">
                <div className="mobile-item-header">
                  <Link href={item.href} className="nav-mobile-link" onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}>
                    {item.label}
                  </Link>
                  {item.mega && (
                    <button
                      className="mobile-chevron-btn"
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      aria-label={`Ouvrir ${item.label}`}
                    >
                      <svg viewBox="0 0 20 20" fill="none" width="14" height="14"
                        style={{ transform: mobileExpanded === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                {item.mega && mobileExpanded === item.label && (
                  <div className="mobile-submenu">
                    {item.mega.columns.map((col) => (
                      <div key={col.heading} className="mobile-submenu-col">
                        <p className="mobile-submenu-heading">{col.heading}</p>
                        {col.links.map((link) => (
                          <Link key={link.label} href={link.href} className="mobile-submenu-link"
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile direct links */}
            <div className="mobile-item">
              <Link href={`/${lang}/nous-rejoindre`} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                {lang === 'en' ? "Join us" : "Nous rejoindre"}
              </Link>
            </div>
            <div className="mobile-item">
              <Link href={`/${lang}/nous-contacter`} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                {lang === 'en' ? "Contact us" : "Nous contacter"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Mega panels host — OUTSIDE header, position: fixed ── */}
      <div
        className="mega-panels-host"
        onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
        onMouseLeave={scheduleClose}
      >
        {navItems.map((item) =>
          item.mega ? <MegaPanel key={item.label} item={item} visible={activeItem === item.label} /> : null
        )}
      </div>

      {/* Backdrop */}
      {activeItem && <div className="mega-backdrop" onClick={() => setActiveItem(null)} />}
    </>
  );
}
