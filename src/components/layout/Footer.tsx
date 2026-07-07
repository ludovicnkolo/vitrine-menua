import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#141824] text-white pt-20 pb-10 px-6 lg:px-12 w-full">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        {/* Colonne 1: Branding */}
        <div className="flex flex-col">
          <div className="flex flex-col mb-6">
             <span className="text-white leading-none text-[2rem] font-bold tracking-tight">
               MENUA
             </span>
             <span className="text-[#e8e1d7] uppercase tracking-[0.25em] text-[0.65rem] mt-1 font-semibold">
               Consulting
             </span>
          </div>
          <p className="text-[#a0aabf] text-[0.95rem] leading-relaxed max-w-[250px]">
            Externalisation opérationnelle des fonctions back et middle office.
          </p>
        </div>

        {/* Colonne 2: Navigation rapide */}
        <div className="flex flex-col">
          <h4 className="text-[1.1rem] font-bold mb-6 text-white">Navigation</h4>
          <ul className="flex flex-col space-y-4 text-[0.95rem] text-[#a0aabf]">
            <li><Link href="/nous-connaitre" className="hover:text-white transition-colors">Nous connaître</Link></li>
            <li><Link href="/vos-besoins" className="hover:text-white transition-colors">Vos besoins</Link></li>
            <li><Link href="/nos-solutions" className="hover:text-white transition-colors">Nos solutions</Link></li>
            <li><Link href="/pourquoi-menua" className="hover:text-white transition-colors">Pourquoi Menua ?</Link></li>
          </ul>
        </div>
        
        {/* Colonne 3: Contact Rapide (1.3 SECTION CONTACT RAPIDE) */}
        <div className="flex flex-col lg:col-span-2">
          <h4 className="text-[1.1rem] font-bold mb-6 text-white">Nous trouver</h4>
          <div className="flex flex-col space-y-4 text-[0.95rem] text-[#a0aabf]">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#e8e1d7] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">MENUA CONSULTING</p>
                <p>92 rue des Pyrénées</p>
                <p>75020 Paris</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-[#e8e1d7] shrink-0" />
              <a href="mailto:contact@menuaconsulting.com" className="hover:text-white transition-colors">
                contact@menuaconsulting.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-[#e8e1d7] shrink-0" />
              <a href="tel:+33686877914" className="hover:text-white transition-colors">
                +33 6 86 87 79 14
              </a>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bas de page Légal */}
      <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#e8e1d7]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[0.85rem] text-[#a0aabf]">
          © 2026 MENUA CONSULTING. Tous droits réservés.
        </p>
        <div className="flex items-center gap-6 text-[0.85rem] text-[#a0aabf]">
          <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
