"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type MenuKey = "nous-connaitre" | "vos-besoins" | "nos-solutions" | "pourquoi-menua" | "actualites";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const getMenus = () => ({
    "nous-connaitre": {
      label: t("Nous connaître", "About Us"),
      href: "/nous-connaitre",
      sections: [
        {
          title: t("Nous connaître", "About Us"),
          links: [
            { label: t("Présentation du cabinet", "Firm Presentation"), href: "/nous-connaitre#presentation-du-cabinet" },
            { label: t("Notre approche", "Our Approach"), href: "/nous-connaitre#notre-approche" },
            { label: t("Notre méthodologie", "Our Methodology"), href: "/nous-connaitre#notre-methodologie" },
            { label: t("Accréditations & certifications", "Accreditations & Certifications"), href: "/nous-connaitre#accreditations" },
            { label: t("Notre équipe", "Our Team"), href: "/nous-connaitre#notre-equipe" },
            { label: t("Nos implantations", "Our Locations"), href: "/nous-connaitre#nos-implantations" },
            { label: t("L'interprofessionnalité", "Interprofessionalism"), href: "/nous-connaitre#interprofessionnalite" },
          ],
        },
      ],
    },
    "vos-besoins": {
      label: t("Vos besoins", "Your Needs"),
      href: "/vos-besoins",
      sections: [
        {
          title: t("Vos besoins", "Your Needs"),
          links: [
            { label: t("Finance & reporting", "Finance & Reporting"), href: "/vos-besoins#finance-reporting" },
            { label: t("Contrôle de gestion", "Management Control"), href: "/vos-besoins#controle-gestion" },
            { label: t("Risques & conformité", "Risk & Compliance"), href: "/vos-besoins#risques-conformite" },
            { label: t("Support comptable & data", "Accounting & Data Support"), href: "/vos-besoins#support-comptable" },
            { label: t("Gestion de patrimoine & CGP", "Wealth Management"), href: "/vos-besoins#gestion-patrimoine" },
            { label: t("Autres besoins opérationnels", "Other Operational Needs"), href: "/vos-besoins#autres-besoins" },
          ],
        },
      ],
    },
    "nos-solutions": {
      label: t("Nos solutions", "Our Solutions"),
      href: "/nos-solutions",
      sections: [
        {
          title: t("Nos solutions", "Our Solutions"),
          links: [
            { label: t("Urgence – Capacité de réaction", "Emergency – Response Capacity"), href: "/nos-solutions#urgence" },
            { label: t("Durée – Flexibilité contractuelle", "Duration – Contractual Flexibility"), href: "/nos-solutions#duree" },
            { label: t("Volume – Dimensionnement d'équipe", "Volume – Team Sizing"), href: "/nos-solutions#volume" },
            { label: t("Mode d'organisation", "Organization Mode"), href: "/nos-solutions#organisation" },
            { label: t("Langues – FR / EN et autres", "Languages – EN / FR and others"), href: "/nos-solutions#langues" },
          ],
        },
      ],
    },
    "pourquoi-menua": {
      label: t("Pourquoi Menua ?", "Why Menua?"),
      href: "/pourquoi-menua",
      sections: [
        {
          title: t("Pourquoi Menua ?", "Why Menua?"),
          links: [
            { label: t("Nos bénéfices", "Our Benefits"), href: "/pourquoi-menua#benefices" },
            { label: t("Notre différenciation", "Our Differentiation"), href: "/pourquoi-menua#differenciation" },
            { label: t("Nos engagements", "Our Commitments"), href: "/pourquoi-menua#engagements" },
          ],
        },
      ],
    },
    "actualites": {
      label: t("Actualités", "News"),
      href: "/actualites",
      sections: [
        {
          title: t("Actualités", "News"),
          links: [
            { label: t("À la une", "Featured"), href: "/actualites#a-la-une" },
            { label: t("Actualités financières", "Financial News"), href: "/actualites#actualites-financieres" },
            { label: t("Nos publications", "Our Publications"), href: "/actualites#nos-publications" },
          ],
        },
      ],
    },
  });

  const menus = getMenus();

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const FlagFR = () => (
    <svg width="16" height="12" viewBox="0 0 3 2" className="rounded-sm overflow-hidden shadow-sm">
      <rect width="1" height="2" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );

  const FlagEN = () => (
    <svg width="16" height="12" viewBox="0 0 60 30" className="rounded-sm overflow-hidden shadow-sm">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z"/>
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );

  return (
    <header
      className="fixed top-0 w-full z-50 bg-[#0F2B45]/97 backdrop-blur-md border-b border-white/10"
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-1.5 lg:py-2">
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0 group z-50" onClick={() => { setOpenMenu(null); setIsMobileMenuOpen(false); }}>
          <img
            src="/logoSlogan.png"
            alt="MENUA Consulting"
            className="h-10 lg:h-12 w-auto object-contain"
          />
        </Link>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="lg:hidden text-white z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 text-sm text-gray-300 font-medium">
          {(Object.keys(menus) as MenuKey[]).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setOpenMenu(key)}
            >
              <Link
                href={menus[key].href}
                className={`px-4 py-2 rounded transition-colors whitespace-nowrap hover:text-white ${openMenu === key ? "text-[#C89B5E]" : "text-gray-300"}`}
              >
                {menus[key].label}
              </Link>

              {/* DESKTOP DROPDOWN (CENTERED) */}
              {openMenu === key && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4">
                  <div className="bg-[#1A2D4A] border border-[#D1D6DC]/10 shadow-2xl rounded-xl p-8 min-w-[320px] max-w-[400px]">
                    {menus[key].sections.map((section, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-[#C89B5E] text-xs font-bold tracking-widest uppercase">{section.title}</h3>
                          <Link href={menus[key].href} className="text-[#C89B5E] hover:text-white transition-colors" onClick={() => setOpenMenu(null)}>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                        <ul className="space-y-4">
                          {section.links.map((link, j) => (
                            <li key={j}>
                              <Link
                                href={link.href}
                                onClick={() => setOpenMenu(null)}
                                className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-3 group"
                              >
                                <span className="w-5 h-px bg-gray-700 group-hover:bg-[#C89B5E] transition-colors shrink-0"></span>
                                <span className="leading-snug">{link.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* LANG SWITCHER DESKTOP */}
          <div className="flex items-center gap-3 border-l border-gray-700 pl-5 ml-2">
            <button 
              onClick={() => setLang("FR")}
              className={`flex items-center gap-1.5 transition-all ${lang === "FR" ? "opacity-100 scale-105" : "opacity-40 hover:opacity-80 grayscale hover:grayscale-0"}`}
            >
              <FlagFR />
              <span className="text-xs font-bold text-white hidden xl:block">FR</span>
            </button>
            <button 
              onClick={() => setLang("EN")}
              className={`flex items-center gap-1.5 transition-all ${lang === "EN" ? "opacity-100 scale-105" : "opacity-40 hover:opacity-80 grayscale hover:grayscale-0"}`}
            >
              <FlagEN />
              <span className="text-xs font-bold text-white hidden xl:block">EN</span>
            </button>
          </div>

          <div className="flex items-center ml-4 border border-[#4A8C7A] rounded-md p-1 gap-1">
            <Link
              href="/nous-rejoindre"
              className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap text-sm font-medium"
              onMouseEnter={() => setOpenMenu(null)}
            >
              {t("Nous rejoindre", "Join Us")}
            </Link>
            <Link
              href="/nous-contacter"
              className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap text-sm font-medium"
              onMouseEnter={() => setOpenMenu(null)}
            >
              {t("Nous contacter", "Contact Us")}
            </Link>
          </div>
        </nav>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[56px] bg-[#0F2B45] overflow-y-auto pb-32 z-40 border-t border-[#1A2D4A]">
          <div className="flex flex-col p-6 space-y-6">
            
            {/* Lang Switcher Mobile */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">{t("Langue :", "Language:")}</span>
              <button onClick={() => setLang("FR")} className={`flex items-center gap-2 px-3 py-1.5 rounded border ${lang === "FR" ? "bg-[#C89B5E]/10 border-[#C89B5E]" : "border-gray-800 opacity-50"}`}>
                <FlagFR /> <span className="text-xs font-bold text-white">FR</span>
              </button>
              <button onClick={() => setLang("EN")} className={`flex items-center gap-2 px-3 py-1.5 rounded border ${lang === "EN" ? "bg-[#C89B5E]/10 border-[#C89B5E]" : "border-gray-800 opacity-50"}`}>
                <FlagEN /> <span className="text-xs font-bold text-white">EN</span>
              </button>
            </div>

            {/* Nav Links Mobile */}
            <nav className="flex flex-col space-y-2">
              {(Object.keys(menus) as MenuKey[]).map((key) => (
                <div key={key} className="border-b border-gray-800/50 pb-4 mb-2">
                  <Link
                    href={menus[key].href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-serif font-bold text-white mb-4 block"
                  >
                    {menus[key].label}
                  </Link>
                  <div className="pl-4 flex flex-col space-y-3 border-l-2 border-[#C89B5E]/20">
                    {menus[key].sections[0].links.map((link, j) => (
                      <Link
                        key={j}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-400 text-sm hover:text-[#C89B5E] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-6 mt-4">
                <div className="flex flex-col gap-2 border border-[#4A8C7A] rounded-xl p-2">
                  <Link
                    href="/nous-rejoindre"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:bg-white/10 text-center px-5 py-3 rounded-lg text-sm font-bold tracking-widest uppercase w-full transition-all"
                  >
                    {t("Nous rejoindre", "Join Us")}
                  </Link>
                  <Link
                    href="/nous-contacter"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:bg-white/10 text-center px-5 py-3 rounded-lg text-sm font-bold tracking-widest uppercase w-full transition-all"
                  >
                    {t("Nous contacter", "Contact Us")}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
