import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-white">
      {/* Top bar vert */}
      <div className="footer-top-bar">
        <div className="container" style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="cta-row">
            <p className="cta-label" style={{ color: "#fff", fontSize: "0.8rem" }}>
              NOUS CONTACTER
            </p>
            <Link href="/nous-contacter" className="arrow-btn arrow-btn--dark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="footer-main container">
        {/* Colonne 1 – Logo + navigation */}
        <div className="footer-col">
          <Link href="/" className="footer-logo-dark">Menua</Link>
          <ul className="footer-nav">
            <li><Link href="/nous-connaitre">NOUS CONNAÎTRE</Link></li>
            <li><Link href="/vos-besoins">VOS BESOINS</Link></li>
            <li><Link href="/nos-solutions">NOS SOLUTIONS</Link></li>
            <li><Link href="/pourquoi-menua">POURQUOI MENUA ?</Link></li>
            <li><Link href="/actualites">ACTUALITÉS</Link></li>
            <li><Link href="/nous-rejoindre">NOUS REJOINDRE</Link></li>
            <li><Link href="/nous-contacter">NOUS CONTACTER</Link></li>
          </ul>
        </div>

        {/* Colonne 2 – Nous trouver */}
        <div className="footer-col">
          <h3 className="footer-heading">Nous trouver</h3>
          <div className="footer-address">
            <p>92 rue des Pyrénées</p>
            <p>75020 <strong>PARIS</strong></p>
          </div>
          <div className="footer-address">
            <p>
              <a href="mailto:contact@menuaconsulting.com" style={{ color: "inherit", textDecoration: "none" }}>
                contact@menuaconsulting.com
              </a>
            </p>
            <p>
              <a href="tel:+33686877914" style={{ color: "inherit", textDecoration: "none" }}>
                +33 6 86 87 79 14
              </a>
            </p>
          </div>
          {/* LinkedIn */}
          <div className="footer-implantations-links">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LINKEDIN →
            </a>
          </div>
        </div>

        {/* Colonne 3 – Présenter un besoin */}
        <div className="footer-col">
          <h3 className="footer-heading">Présenter un besoin</h3>
          <p style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.75, marginBottom: "2rem" }}>
            Présentez votre besoin opérationnel, nous vous répondons avec une première analyse
            et une proposition adaptée.
          </p>
          <Link
            href="/nous-contacter"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.75rem",
              background: "var(--green-dark)",
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              marginBottom: "2.5rem",
            }}
          >
            Nous contacter
          </Link>

          {/* Réseaux sociaux */}
          <div className="footer-social-icons">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.981 1.981 0 0 1-1.977-1.98 1.981 1.981 0 1 1 3.96 0 1.981 1.981 0 0 1-1.983 1.98zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Barre de bas */}
      <div className="footer-bottom-bar container">
        <span style={{ fontSize: "0.65rem", color: "var(--text-light)", letterSpacing: "0.05em" }}>
          © {new Date().getFullYear()} MENUA CONSULTING — SASU au capital de 15&nbsp;000&nbsp;€ — RCS Paris 993&nbsp;749&nbsp;779
        </span>
        <Link href="/mentions-legales">MENTIONS LÉGALES</Link>
        <Link href="/politique-de-confidentialite">POLITIQUE DE CONFIDENTIALITÉ</Link>
      </div>
    </footer>
  );
}
