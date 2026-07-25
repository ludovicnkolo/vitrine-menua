"use client";
import Link from "@/components/Link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );

  const { t } = useLanguage();

  return (
    <footer className="bg-white text-[#141824] pt-32 pb-16 px-6 lg:px-12 w-full">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-12 mb-24">
        
        {/* Colonne 1: Branding */}
        <div className="flex flex-col md:w-1/3">
          <div className="flex flex-col mb-6">
             <span className="text-[#141824] leading-none text-[2rem] font-bold tracking-tight">
               MENUA
             </span>
             <span className="text-[#141824]/80 uppercase tracking-[0.25em] text-[0.65rem] mt-1 font-semibold">
               Consulting
             </span>
          </div>
          <p className="text-[#6e7891] text-[0.95rem] leading-relaxed max-w-[250px] mb-6">
            {t("Externalisation opérationnelle des fonctions back et middle office.", "Operational outsourcing of back and middle office functions.")}
          </p>
          <div className="flex items-center gap-4 mt-auto">
            <a href="https://www.linkedin.com/company/menua-consulting" target="_blank" rel="noopener noreferrer" title="Suivez Menua Consulting sur LinkedIn" className="w-10 h-10 rounded-full bg-[#141824]/5 flex items-center justify-center text-[#141824] hover:bg-[#141824] hover:text-white transition-all duration-300" aria-label="Page LinkedIn de Menua Consulting">
              <LinkedinIcon size={18} />
            </a>
          </div>
        </div>

        {/* Colonne 2: Navigation rapide */}
        <div className="flex flex-col md:w-1/3 md:items-center">
          <div className="w-fit">
            <h4 className="text-[1.1rem] font-bold mb-6 text-[#141824]">{t("Navigation", "Navigation")}</h4>
            <ul className="flex flex-col space-y-4 text-[0.95rem] text-[#6e7891]">
              <li><Link href="/nous-connaitre" className="hover:text-[#141824] transition-colors">{t("Nous connaître", "About Us")}</Link></li>
              <li><Link href="/vos-besoins" className="hover:text-[#141824] transition-colors">{t("Vos besoins", "Your Needs")}</Link></li>
              <li><Link href="/nos-solutions" className="hover:text-[#141824] transition-colors">{t("Nos solutions", "Our Solutions")}</Link></li>
              <li><Link href="/pourquoi-menua" className="hover:text-[#141824] transition-colors">{t("Pourquoi nous ?", "Why us?")}</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Colonne 3: Contact Rapide (1.2 SECTION CONTACT RAPIDE) */}
        <div className="flex flex-col md:w-1/3 md:items-end">
          <div className="w-fit">
            <h4 className="text-[1.1rem] font-bold mb-6 text-[#141824]">{t("Nous trouver", "Find us")}</h4>
            <div className="flex flex-col space-y-4 text-[0.95rem] text-[#6e7891]">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#141824] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#141824] mb-1">{t("MENUA CONSULTING", "MENUA CONSULTING")}</p>
                  <p>{t("92 rue des Pyrénées – 75020 Paris", "92 rue des Pyrénées – 75020 Paris")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[#141824] shrink-0" />
                <a href="mailto:contact@menuaconsulting.com" className="hover:text-[#141824] transition-colors">
                  contact@menuaconsulting.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#141824] shrink-0" />
                <a href="tel:+33686877914" className="hover:text-[#141824] transition-colors">
                  +33 6 86 87 79 14
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bas de page Légal */}
      <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#141824]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[0.85rem] text-[#6e7891]">
          {t("© 2026 MENUA CONSULTING. Tous droits réservés.", "© 2026 MENUA CONSULTING. All rights reserved.")}
        </p>
        <div className="flex items-center gap-6 text-[0.85rem] text-[#6e7891]">
          <Link href="/mentions-legales" className="hover:text-[#141824] transition-colors">{t("Mentions légales", "Legal Notice")}</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-[#141824] transition-colors">{t("Politique de confidentialité", "Privacy Policy")}</Link>
        </div>
      </div>
    </footer>
  );
}
