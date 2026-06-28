"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type MenuKey = "nous-connaitre" | "vos-besoins" | "nos-solutions" | "pourquoi-menua" | "actualites";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
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
        { label: t("Présentation du cabinet", "Firm Presentation"), href: "/nous-connaitre/presentation-du-cabinet" },
        { label: t("Notre approche", "Our Approach"), href: "/nous-connaitre/notre-approche" },
        { label: t("Notre méthodologie", "Our Methodology"), href: "/nous-connaitre/notre-methodologie" },
        { label: t("Accréditations & certifications", "Accreditations & Certifications"), href: "/nous-connaitre/accreditations" },
        { label: t("Notre équipe", "Our Team"), href: "/nous-connaitre/notre-equipe" },
        { label: t("Nos implantations", "Our Locations"), href: "/nous-connaitre/nos-implantations" },
        { label: t("L'interprofessionnalité", "Interprofessionalism"), href: "/nous-connaitre/interprofessionnalite" },
      ],
    },
    "vos-besoins": {
      label: t("Vos besoins", "Your Needs"),
      href: "/vos-besoins",
      links: [
        { label: t("Finance & reporting", "Finance & Reporting"), href: "/vos-besoins/finance-reporting" },
        { label: t("Risques & conformité", "Risk & Compliance"), href: "/vos-besoins/risques-conformite" },
        { label: t("Support comptable & data", "Accounting & Data Support"), href: "/vos-besoins/support-comptable-data" },
        { label: t("Gestion de patrimoine & CGP", "Wealth Management"), href: "/vos-besoins/gestion-patrimoine-cgp" },
        { label: t("Autres besoins opérationnels", "Other Operational Needs"), href: "/vos-besoins/autres-besoins-operationnels" },
      ],
    },
    "nos-solutions": {
      label: t("Nos solutions", "Our Solutions"),
      href: "/nos-solutions",
      links: [
        { label: t("Urgence – Réactivité opérationnelle", "Emergency – Operational reactivity"), href: "/nos-solutions/urgence" },
        { label: t("Durée – Flexibilité contractuelle", "Duration – Contractual flexibility"), href: "/nos-solutions/duree" },
        { label: t("Volume – Dimensionnement d'équipe", "Volume – Team sizing"), href: "/nos-solutions/volume" },
        { label: t("Mode d'organisation", "Organisation mode"), href: "/nos-solutions/mode-organisation" },
        { label: t("Langues – FR / EN", "Languages – FR / EN"), href: "/nos-solutions/langues" },
      ],
    },
    "pourquoi-menua": {
      label: t("Pourquoi Menua ?", "Why Menua?"),
      href: "/pourquoi-menua",
      links: [
        { label: t("Nos bénéfices", "Our Benefits"), href: "/pourquoi-menua/nos-benefices" },
        { label: t("Notre différenciation", "Our Differentiation"), href: "/pourquoi-menua/notre-differenciation" },
        { label: t("Nos engagements", "Our Commitments"), href: "/pourquoi-menua/nos-engagements" },
      ],
    },
    "actualites": {
      label: t("Actualités", "News"),
      href: "/actualites",
      links: [
        { label: t("KYC & LCB-FT – Nouvelles obligations", "KYC & AML – New Obligations"), href: "/actualites/kyc-lcft-nouvelles-obligations" },
        { label: t("Externalisation back office", "Back office outsourcing"), href: "/actualites/externalisation-securiser-continuite" },
        { label: t("Reporting financier", "Financial reporting"), href: "/actualites/reporting-erreurs-frequentes" },
      ],
    },
  });

  const menus = getMenus();

  const FlagFR = () => (
    <svg width="16" height="12" viewBox="0 0 3 2" className="rounded-sm overflow-hidden shadow-sm">
      <rect width="1" height="2" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );

  const FlagEN = () => (
    <svg width="16" height="12" viewBox="0 0 60 30" className="rounded-sm overflow-hidden shadow-sm">
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
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-[#D8DCE8]"
          : "bg-white/98 backdrop-blur-sm border-b border-[#D8DCE8]/60"
      }`}
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-6 lg:px-10 h-16 lg:h-[70px] max-w-[1440px] mx-auto">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center shrink-0 z-50"
          onClick={() => { setOpenMenu(null); setIsMobileMenuOpen(false); }}
        >
          <img
            src="/logoSlogan.png"
            alt="MENUA Consulting"
            className="h-9 lg:h-11 w-auto object-contain"
          />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="lg:hidden text-[#1B3680] z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {(Object.keys(menus) as MenuKey[]).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setOpenMenu(key)}
            >
              <Link
                href={menus[key].href}
                className={`flex items-center gap-1 px-2 py-2 transition-colors whitespace-nowrap text-[1.05rem] font-semibold ${
                  openMenu === key
                    ? "text-[#1C40C2]"
                    : "text-[#1B3680] hover:text-[#1C40C2]"
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
                  <div className="bg-white border border-[#D8DCE8] shadow-xl min-w-[280px] py-3">
                    <div className="px-5 py-2 border-b border-[#D8DCE8] mb-2">
                      <span className="text-[#1B3680] text-[1.25rem] leading-[1.65rem] font-bold">
                        {menus[key].label}
                      </span>
                    </div>
                    <ul>
                      {menus[key].links.map((link, j) => (
                        <li key={j}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 px-5 py-2.5 text-[#3A4660] hover:text-[#1B3680] hover:bg-[#DAF0F7]/40 text-[14px] leading-[1rem] transition-colors group"
                          >
                            <span className="w-4 h-px bg-[#D8DCE8] group-hover:bg-[#1C40C2] transition-colors shrink-0" />
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

          {/* LANG SWITCHER */}
          <div className="flex items-center gap-2 border-l border-[#D8DCE8] pl-5 ml-3">
            <button
              onClick={() => setLang("FR")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                lang === "FR" ? "text-[#1B3680] opacity-100" : "text-[#6B7794] opacity-50 hover:opacity-80"
              }`}
            >
              <FlagFR /> FR
            </button>
            <span className="text-[#D8DCE8] text-xs">|</span>
            <button
              onClick={() => setLang("EN")}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                lang === "EN" ? "text-[#1B3680] opacity-100" : "text-[#6B7794] opacity-50 hover:opacity-80"
              }`}
            >
              <FlagEN /> EN
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Link
              href="/nous-rejoindre"
              className="px-3 py-1 bg-[#1C40C2] text-white border border-[#1C40C2] hover:bg-white hover:text-[#1C40C2] rounded-full text-[0.65rem] font-bold tracking-wider uppercase transition-all duration-300"
              onMouseEnter={() => setOpenMenu(null)}
            >
              {t("Nous rejoindre", "Join Us")}
            </Link>
            <Link
              href="/nous-contacter"
              className="px-3 py-1 bg-[#1C40C2] text-white border border-[#1C40C2] hover:bg-white hover:text-[#1C40C2] rounded-full text-[0.65rem] font-bold tracking-wider uppercase transition-all duration-300"
              onMouseEnter={() => setOpenMenu(null)}
            >
              {t("Nous contacter", "Contact Us")}
            </Link>
          </div>
        </nav>
      </div>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white overflow-y-auto pb-16 z-40 border-t border-[#D8DCE8]">
          <div className="flex flex-col p-6 space-y-1">

            {/* Lang Switcher Mobile */}
            <div className="flex items-center gap-4 py-4 border-b border-[#D8DCE8] mb-4">
              <span className="text-[#6B7794] text-[0.65rem] font-bold tracking-widest uppercase">
                {t("Langue :", "Language:")}
              </span>
              <button
                onClick={() => setLang("FR")}
                className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-bold transition-all ${
                  lang === "FR" ? "border-[#1B3680] text-[#1B3680]" : "border-[#D8DCE8] text-[#6B7794]"
                }`}
              >
                <FlagFR /> FR
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-bold transition-all ${
                  lang === "EN" ? "border-[#1B3680] text-[#1B3680]" : "border-[#D8DCE8] text-[#6B7794]"
                }`}
              >
                <FlagEN /> EN
              </button>
            </div>

            {/* Nav Links Mobile */}
            {(Object.keys(menus) as MenuKey[]).map((key) => (
              <div key={key} className="border-b border-[#D8DCE8]/60 pb-4 mb-2">
                <Link
                  href={menus[key].href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[1.25rem] leading-[1.65rem] font-bold text-[#1B3680] mb-3 block"
                  
                >
                  {menus[key].label}
                </Link>
                <div className="pl-4 flex flex-col gap-2 border-l-2 border-[#1C40C2]/20">
                  {menus[key].links.map((link, j) => (
                    <Link
                      key={j}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[#4A4E5A] text-[14px] leading-[1rem] hover:text-[#1C40C2] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/nous-rejoindre"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#1C40C2] text-white text-center px-4 py-2 text-[0.7rem] font-bold tracking-wider uppercase w-full rounded-full border border-[#1C40C2] transition-all hover:bg-white hover:text-[#1C40C2]"
              >
                {t("Nous rejoindre", "Join Us")}
              </Link>
              <Link
                href="/nous-contacter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#1C40C2] text-white text-center px-4 py-2 text-[0.7rem] font-bold tracking-wider uppercase w-full rounded-full border border-[#1C40C2] transition-all hover:bg-white hover:text-[#1C40C2]"
              >
                {t("Nous contacter", "Contact Us")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
