import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
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
          <p className="text-[#6e7891] text-[0.95rem] leading-relaxed max-w-[250px]">
            Externalisation opérationnelle des fonctions back et middle office.
          </p>
        </div>

        {/* Colonne 2: Navigation rapide */}
        <div className="flex flex-col md:w-1/3 md:items-center">
          <div className="w-fit">
            <h4 className="text-[1.1rem] font-bold mb-6 text-[#141824]">Navigation</h4>
            <ul className="flex flex-col space-y-4 text-[0.95rem] text-[#6e7891]">
              <li><Link href="/nous-connaitre" className="hover:text-[#141824] transition-colors">Nous connaître</Link></li>
              <li><Link href="/vos-besoins" className="hover:text-[#141824] transition-colors">Vos besoins</Link></li>
              <li><Link href="/nos-solutions" className="hover:text-[#141824] transition-colors">Nos solutions</Link></li>
              <li><Link href="/pourquoi-menua" className="hover:text-[#141824] transition-colors">Pourquoi nous ?</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Colonne 3: Contact Rapide (1.3 SECTION CONTACT RAPIDE) */}
        <div className="flex flex-col md:w-1/3 md:items-end">
          <div className="w-fit">
            <h4 className="text-[1.1rem] font-bold mb-6 text-[#141824]">Nous trouver</h4>
            <div className="flex flex-col space-y-4 text-[0.95rem] text-[#6e7891]">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[#141824] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#141824] mb-1">MENUA CONSULTING</p>
                  <p>92 rue des Pyrénées</p>
                  <p>75020 Paris</p>
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
          © 2026 MENUA CONSULTING. Tous droits réservés.
        </p>
        <div className="flex items-center gap-6 text-[0.85rem] text-[#6e7891]">
          <Link href="/mentions-legales" className="hover:text-[#141824] transition-colors">Mentions légales</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-[#141824] transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
