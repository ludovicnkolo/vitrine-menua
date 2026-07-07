"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type MenuKey = "nous-connaitre" | "vos-besoins" | "nos-solutions" | "pourquoi-menua" | "actualites";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const getMenus = () => ({
    "nous-connaitre": {
      label: t("Nous connaître", "About Us"),
      href: "/nous-connaitre",
      links: [
        { label: t("Présentation du cabinet", "Firm Presentation"), href: "/nous-connaitre#presentation-du-cabinet" },
        { label: t("Notre approche", "Our Approach"), href: "/nous-connaitre#notre-approche" },
        { label: t("Notre méthodologie", "Our Methodology"), href: "/nous-connaitre#notre-methodologie" },
        { label: t("Certifications et cadre", "Certifications and framework"), href: "/nous-connaitre#certifications" },
        { label: t("Notre équipe", "Our Team"), href: "/nous-connaitre#notre-equipe" },
      ],
    },
    "vos-besoins": {
      label: t("Vos besoins", "Your Needs"),
      href: "/vos-besoins",
      links: [
        { label: t("Finance et reporting", "Finance and Reporting"), href: "/vos-besoins#finance-reporting" },
        { label: t("Contrôle de gestion", "Management Control"), href: "/vos-besoins#controle-de-gestion" },
        { label: t("Risques et conformité", "Risk and Compliance"), href: "/vos-besoins#risques-conformite" },
        { label: t("Support comptable et data", "Accounting and Data Support"), href: "/vos-besoins#support-comptable-data" },
        { label: t("Gestion de patrimoine et CGP", "Wealth Management"), href: "/vos-besoins#gestion-patrimoine" },
        { label: t("Autres besoins opérationnels", "Other Operational Needs"), href: "/vos-besoins#autres-besoins" },
      ],
    },
    "nos-solutions": {
      label: t("Nos solutions", "Our Solutions"),
      href: "/nos-solutions",
      links: [
        { label: t("Urgence – Réactivité opérationnelle", "Emergency – Operational reactivity"), href: "/nos-solutions#urgence" },
        { label: t("Durée – Flexibilité contractuelle", "Duration – Contractual flexibility"), href: "/nos-solutions#duree" },
        { label: t("Volume – Dimensionnement d'équipe", "Volume – Team sizing"), href: "/nos-solutions#volume" },
        { label: t("Mode d'organisation", "Organisation mode"), href: "/nos-solutions#organisation" },
        { label: t("Langues – FR / EN", "Languages – FR / EN"), href: "/nos-solutions#langues" },
      ],
    },
    "pourquoi-menua": {
      label: t("Pourquoi Menua ?", "Why Menua?"),
      href: "/pourquoi-menua",
      links: [
        { label: t("Nos bénéfices", "Our Benefits"), href: "/pourquoi-menua#nos-benefices" },
        { label: t("Notre différenciation", "Our Differentiation"), href: "/pourquoi-menua#notre-differenciation" },
        { label: t("Nos engagements", "Our Commitments"), href: "/pourquoi-menua#nos-engagements" },
      ],
    },
    "actualites": {
      label: t("Actualités", "News"),
      href: "/actualites",
      links: [
        { label: t("À la une", "Featured articles"), href: "/actualites#articles" },
        { label: t("Toutes les actualités", "All news"), href: "/actualites#articles" },
        { label: t("Nos publications LinkedIn", "Our LinkedIn publications"), href: "/actualites#linkedin" },
      ],
    },
  });

  const menus = getMenus();

  const FlagFR = () => (
    <svg width="16" height="12" viewBox="0 0 3 2" className="rounded-sm overflow-hidden">
      <rect width="1" height="2" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );

  const FlagEN = () => (
    <svg width="16" height="12" viewBox="0 0 60 30" className="rounded-sm overflow-hidden">
      <clipPath id="hs"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="ht"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#hs)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#ht)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[9998] transition-colors duration-300 border-b ${scrolled ? "bg-[#141824]/95 backdrop-blur-md border-[#e8e1d7]/10 shadow-2xl" : "bg-[#141824] border-transparent"}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-6 lg:px-10 h-20 lg:h-[80px] max-w-[1440px] mx-auto relative">

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="lg:hidden text-white hover:text-[#e8e1d7] transition-colors relative z-[9999] p-4 -ml-4 min-w-[48px] min-h-[48px] flex items-center justify-center"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          onTouchEnd={(e) => { e.preventDefault(); setIsMobileMenuOpen(prev => !prev); }}
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center z-50 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 shrink-0 lg:-ml-6"
          onClick={() => { setOpenMenu(null); setIsMobileMenuOpen(false); }}
        >
          <img
            src="/logoSlogan.png"
            alt="MENUA Consulting"
            className="h-[60px] lg:h-[90px] max-w-[200px] lg:max-w-none w-auto object-contain brightness-0 invert"
          />
        </Link>

        <div className="w-10 lg:hidden" />

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-0.5 lg:ml-auto">
          {(Object.keys(menus) as MenuKey[]).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setOpenMenu(key)}
            >
              <Link
                href={menus[key].href}
                className={`flex items-center gap-1 px-2 py-2 transition-colors whitespace-nowrap text-[17px] leading-[25px] font-bold ${
                  openMenu === key
                    ? "text-[#e8e1d7]"
                    : "text-white hover:text-[#e8e1d7]"
                }`}
              >
                {menus[key].label}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${openMenu === key ? "rotate-180" : ""}`}
                />
              </Link>

              {/* DROPDOWN */}
              {openMenu === key && (
                <div className="absolute left-0 top-full pt-0">
                  <div className="bg-[#e8e1d7] border-t-4 border-[#141824] shadow-xl min-w-[280px] py-3">
                    <div className="px-5 py-2 border-b border-[#141824]/10 mb-2">
                      <span className="text-[#141824] text-[1.1rem] leading-[1.5rem] font-bold">
                        {menus[key].label}
                      </span>
                    </div>
                    <ul>
                      {menus[key].links.map((link, j) => (
                        <li key={j}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 px-5 py-2.5 text-[#141824]/80 hover:text-[#141824] hover:bg-white/40 text-[13px] leading-[1rem] transition-colors group"
                          >
                            <span className="w-4 h-px bg-[#141824] shrink-0" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* LANG SWITCHER — placed right after Actualités */}
          <div className="flex items-center gap-2 border-l border-[#e8e1d7]/30 pl-4 ml-2 mr-2" onMouseEnter={() => setOpenMenu(null)}>
            <button
              onClick={() => setLang("FR")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                lang === "FR" ? "text-white opacity-100" : "text-white/50 hover:text-white"
              }`}
            >
              <FlagFR /> FR
            </button>
            <span className="text-[#D8DCE8] text-xs">|</span>
            <button
              onClick={() => setLang("EN")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                lang === "EN" ? "text-white opacity-100" : "text-white/50 hover:text-white"
              }`}
            >
              <FlagEN /> EN
            </button>
          </div>

          {/* "Nous rejoindre" & "Nous contacter" as plain nav links */}
          <Link
            href="/nous-rejoindre"
            className="flex items-center gap-1 px-3 py-1 transition-all whitespace-nowrap text-[10px] font-bold tracking-wide uppercase text-[#e8e1d7] hover:text-[#141824] hover:bg-[#e8e1d7] rounded-full"
            style={{ border: "1px solid #e8e1d7" }}
            onMouseEnter={() => setOpenMenu(null)}
          >
            {t("Nous rejoindre", "Join Us")}
          </Link>
          <Link
            href="/nous-contacter"
            className="flex items-center gap-1 px-3 py-1 transition-all whitespace-nowrap text-[10px] font-bold tracking-wide uppercase text-[#141824] bg-[#e8e1d7] hover:bg-white rounded-full ml-1"
            onMouseEnter={() => setOpenMenu(null)}
          >
            {t("Nous contacter", "Contact Us")}
          </Link>
        </nav>
      </div>

      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 z-[9990] backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ touchAction: 'manipulation' }}
          />
          {/* Menu Box */}
          <div className="lg:hidden fixed left-1/2 -translate-x-1/2 top-[85px] w-[92%] max-w-[400px] max-h-[calc(100vh-110px)] bg-white z-[9995] border border-[#e8e1d7] rounded-xl shadow-2xl flex flex-col overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          
          <nav className="flex-1 flex flex-col px-6 py-4 gap-2">
            {/* Accueil */}
            <div className="border-b border-[#e8e1d7]/50">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex py-3 text-[1.2rem] font-bold text-[#141824] hover:text-[#6e7891] transition-colors">
                {t("Accueil", "Home")}
              </Link>
            </div>

            {(Object.keys(menus) as MenuKey[]).map((key) => (
              <div key={key} className="flex flex-col border-b border-[#e8e1d7]/50">
                <button
                  onClick={() => setOpenMobileSubmenu(openMobileSubmenu === key ? null : key)}
                  className="flex items-center justify-between py-3 text-[1.2rem] font-bold text-[#141824] hover:text-[#6e7891] transition-colors text-left"
                >
                  <span>{menus[key].label}</span>
                  <ChevronDown size={18} className={`text-[#141824] transition-transform ${openMobileSubmenu === key ? "rotate-180" : ""}`} />
                </button>
                
                {openMobileSubmenu === key && (
                  <div className="flex flex-col gap-3 pb-4 pl-4 border-l-2 border-[#141824]/20 mt-1">
                    <Link
                      href={menus[key].href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[#141824] text-[0.95rem] font-bold mb-1"
                    >
                      {t("Vue d'ensemble", "Overview")}
                    </Link>
                    {menus[key].links.map((link, j) => (
                      <Link
                        key={j}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#6e7891] text-[0.9rem] hover:text-[#141824] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="border-b border-[#e8e1d7]/50">
              <Link href="/nous-rejoindre" onClick={() => setIsMobileMenuOpen(false)} className="flex py-3 text-[1.1rem] font-bold text-[#141824] hover:text-[#6e7891] transition-colors">
                {t("Nous rejoindre", "Join Us")}
              </Link>
            </div>
            <div className="border-b border-[#e8e1d7]/50">
              <Link href="/nous-contacter" onClick={() => setIsMobileMenuOpen(false)} className="flex py-3 text-[1.1rem] font-bold text-[#141824] hover:text-[#6e7891] transition-colors">
                {t("Nous contacter", "Contact Us")}
              </Link>
            </div>
          </nav>

          {/* Bottom: Lang */}
          <div className="px-6 pb-6 pt-3 border-t border-[#e8e1d7]/50 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang("FR")}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition-all ${
                  lang === "FR" ? "border-[#141824] text-[#141824]" : "border-[#e8e1d7] text-[#6e7891]"
                }`}
              >
                <FlagFR /> FR
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition-all ${
                  lang === "EN" ? "border-[#141824] text-[#141824]" : "border-[#e8e1d7] text-[#6e7891]"
                }`}
              >
                <FlagEN /> EN
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
}
