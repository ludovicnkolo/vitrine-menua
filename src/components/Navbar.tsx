"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ─────────────────────────────────────────────────────── */
interface MegaLink { label: string; href: string }
interface MegaCol  { heading: string; headingHref: string; links: MegaLink[] }
interface Featured { title: string; body: string; cta: string; ctaHref: string; accent: string }
interface NavItem  { label: string; href: string; mega?: { columns: MegaCol[]; featured?: Featured } }

const navItems: NavItem[] = [
  {
    label: "Nous connaître",
    href:  "/nous-connaitre",
    mega: {
      columns: [
        {
          heading: "Nous connaître", headingHref: "/nous-connaitre",
          links: [
            { label: "Présentation du cabinet",         href: "/nous-connaitre#presentation" },
            { label: "Notre approche",                  href: "/nous-connaitre#approche" },
            { label: "Notre méthodologie",              href: "/nous-connaitre#methodologie" },
            { label: "Accréditations & certifications", href: "/nous-connaitre#accreditations" },
            { label: "Notre équipe",                    href: "/nous-connaitre#equipe" },
          ],
        },
        {
          heading: "Pourquoi nous choisir ?", headingHref: "/pourquoi-menua",
          links: [
            { label: "Nos bénéfices",           href: "/pourquoi-menua#benefices" },
            { label: "Notre différenciation",   href: "/pourquoi-menua#differentiation" },
            { label: "Nos engagements",         href: "/pourquoi-menua#engagements" },
          ],
        },
      ],
      featured: {
        title: "Nous rejoindre",
        body:  "Profil opérationnel autonome ? Intégrez le réseau Menua Consulting.",
        cta:   "Voir les opportunités",
        ctaHref: "/nous-rejoindre",
        accent: "#b8952a",
      },
    },
  },
  {
    label: "Vos besoins",
    href:  "/vos-besoins",
    mega: {
      columns: [
        {
          heading: "Fonctions financières", headingHref: "/vos-besoins",
          links: [
            { label: "Finance & reporting",    href: "/vos-besoins#finance" },
            { label: "Contrôle de gestion",    href: "/vos-besoins#controle" },
            { label: "Risques & conformité",   href: "/vos-besoins#risques" },
          ],
        },
        {
          heading: "Back & Middle Office", headingHref: "/vos-besoins",
          links: [
            { label: "Support comptable & data",     href: "/vos-besoins#comptable" },
            { label: "Gestion de patrimoine & CGP",  href: "/vos-besoins#patrimoine" },
            { label: "Autres besoins opérationnels", href: "/vos-besoins#autres" },
          ],
        },
      ],
      featured: {
        title: "Vos besoins",
        body:  "Des ressources opérationnelles sur mesure, intégrées à votre organisation.",
        cta:   "Explorer nos domaines",
        ctaHref: "/vos-besoins",
        accent: "#2c4a3e",
      },
    },
  },
  {
    label: "Nos solutions",
    href:  "/nos-solutions",
    mega: {
      columns: [
        {
          heading: "Flexibilité", headingHref: "/nos-solutions",
          links: [
            { label: "Urgence – Mobilisation rapide",      href: "/nos-solutions#urgence" },
            { label: "Durée – Missions courtes & longues", href: "/nos-solutions#duree" },
            { label: "Volume – Dimensionnement d'équipe",  href: "/nos-solutions#volume" },
          ],
        },
        {
          heading: "Organisation", headingHref: "/nos-solutions",
          links: [
            { label: "Mode d'organisation",           href: "/nos-solutions#organisation" },
            { label: "Intervention bilingue FR / EN", href: "/nos-solutions#langues" },
          ],
        },
      ],
      featured: {
        title: "Solutions sur mesure",
        body:  "Urgence, durée, volume : nous adaptons chaque dispositif à votre réalité.",
        cta:   "Découvrir nos formules",
        ctaHref: "/nos-solutions",
        accent: "#2c4a3e",
      },
    },
  },
  {
    label: "Pourquoi Menua ?",
    href:  "/pourquoi-menua",
    mega: {
      columns: [
        {
          heading: "Nos atouts", headingHref: "/pourquoi-menua",
          links: [
            { label: "Bénéfices pour votre organisation", href: "/pourquoi-menua#benefices" },
            { label: "Notre différenciation",              href: "/pourquoi-menua#differentiation" },
            { label: "Nos engagements qualité",           href: "/pourquoi-menua#engagements" },
          ],
        },
        {
          heading: "Rejoindre l'équipe", headingHref: "/nous-rejoindre",
          links: [
            { label: "Profils recherchés",        href: "/nous-rejoindre#profils" },
            { label: "Formulaire de candidature", href: "/nous-rejoindre#formulaire" },
          ],
        },
      ],
      featured: {
        title: "Pourquoi Menua ?",
        body:  "Spécialistes du back & middle office, nous n'analysons pas : nous exécutons.",
        cta:   "Découvrir nos engagements",
        ctaHref: "/pourquoi-menua",
        accent: "#b8952a",
      },
    },
  },
  {
    label: "Actualités",
    href:  "/actualites",
    mega: {
      columns: [
        {
          heading: "Publications", headingHref: "/actualites",
          links: [
            { label: "À la une",                                href: "/actualites#une" },
            { label: "Actualités financières & réglementaires", href: "/actualites#financieres" },
            { label: "Nos publications",                        href: "/actualites#publications" },
          ],
        },
        {
          heading: "Thématiques", headingHref: "/actualites",
          links: [
            { label: "Finance",        href: "/actualites#finance" },
            { label: "Réglementation", href: "/actualites#reglementation" },
            { label: "Opérationnel",   href: "/actualites#operationnel" },
          ],
        },
      ],
      featured: {
        title: "Veille sectorielle",
        body:  "Évolutions financières, comptables et réglementaires impactant vos activités.",
        cta:   "Voir toutes les actualités",
        ctaHref: "/actualites",
        accent: "#b8952a",
      },
    },
  },
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

/* ─── NAVBAR ──────────────────────────────────────────────────── */
export default function Navbar() {
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
          <Link href="/" className="nav-logo">Menua</Link>

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
              <button className="nav-lang-btn nav-lang-btn--active" aria-label="Version française">FR</button>
              <span className="nav-lang-sep">|</span>
              <button className="nav-lang-btn" aria-label="English version">EN</button>
            </div>

            {/* CTAs */}
            <div className="nav-cta-wrap">
              <Link href="/nous-rejoindre" className="nav-cta nav-cta--outline">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Nous rejoindre
              </Link>
              <Link href="/nous-contacter" className="nav-cta nav-cta--solid">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Nous contacter
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
              <button className="nav-lang-btn nav-lang-btn--active">FR</button>
              <span className="nav-lang-sep">|</span>
              <button className="nav-lang-btn">EN</button>
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
              <Link href="/nous-rejoindre" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Nous rejoindre</Link>
            </div>
            <div className="mobile-item">
              <Link href="/nous-contacter" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Nous contacter</Link>
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
