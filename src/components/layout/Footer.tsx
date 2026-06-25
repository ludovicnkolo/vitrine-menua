import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#051014] pt-16 pb-8 px-8 border-t border-gray-800 text-white font-sans text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            {/* Mc Cursive */}
            <div className="text-[#c89b53] font-serif italic text-4xl pr-4 border-r border-[#c89b53]/40" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Mc
            </div>
            
            {/* Text part */}
            <div className="flex flex-col items-center pl-2">
              <span className="text-white font-serif text-2xl font-medium leading-none tracking-[0.2em] ml-1">MENUA</span>
              <span className="text-[#c89b53] text-[0.6rem] uppercase tracking-[0.4em] font-sans mt-1 ml-1">Consulting</span>
              
              <div className="flex flex-col items-center mt-2">
                <div className="flex items-center gap-2 opacity-80">
                  <span className="w-4 h-[0.5px] bg-[#c89b53]"></span>
                  <span className="text-[#c89b53] text-[0.5rem] tracking-wider font-serif italic">Vos opérations, Notre expertise.</span>
                  <span className="w-4 h-[0.5px] bg-[#c89b53]"></span>
                </div>
                <div className="text-[#c89b53] text-[0.4rem] mt-0.5 opacity-80">✧</div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-4">
            Externalisation opérationnelle des fonctions back & middle office.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#c89b53] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-[#c89b53] font-bold tracking-wider uppercase mb-6 text-[0.65rem]">Nous trouver</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin className="text-[#c89b53] shrink-0 mt-0.5" size={15} />
              <p className="text-gray-400 text-xs leading-relaxed">MENUA CONSULTING<br/>92 rue des Pyrénées – 75020 Paris</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#c89b53] shrink-0" size={15} />
              <a href="mailto:contact@menuaconsulting.com" className="text-gray-400 text-xs hover:text-white transition-colors">contact@menuaconsulting.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-[#c89b53] shrink-0" size={15} />
              <a href="tel:+33686877914" className="text-gray-400 text-xs hover:text-white transition-colors">+33 6 86 87 79 14</a>
            </div>
          </div>
        </div>

        {/* LIENS UTILES */}
        <div>
          <h4 className="text-[#c89b53] font-bold tracking-wider uppercase mb-6 text-[0.65rem]">Liens utiles</h4>
          <ul className="space-y-3">
            <li><Link href="/nous-connaitre" className="text-gray-400 text-xs hover:text-white transition-colors">Nous connaître</Link></li>
            <li><Link href="/vos-besoins" className="text-gray-400 text-xs hover:text-white transition-colors">Vos besoins</Link></li>
            <li><Link href="/nos-solutions" className="text-gray-400 text-xs hover:text-white transition-colors">Nos solutions</Link></li>
            <li><Link href="/pourquoi-menua" className="text-gray-400 text-xs hover:text-white transition-colors">Pourquoi Menua ?</Link></li>
            <li><Link href="/actualites" className="text-gray-400 text-xs hover:text-white transition-colors">Actualités</Link></li>
            <li><Link href="/nous-rejoindre" className="text-gray-400 text-xs hover:text-white transition-colors">Nous rejoindre</Link></li>
            <li><Link href="/nous-contacter" className="text-gray-400 text-xs hover:text-white transition-colors">Nous contacter</Link></li>
          </ul>
        </div>

        {/* INFORMATIONS */}
        <div>
          <h4 className="text-[#c89b53] font-bold tracking-wider uppercase mb-6 text-[0.65rem]">Informations</h4>
          <ul className="space-y-3">
            <li><Link href="/mentions-legales" className="text-gray-400 text-xs hover:text-white transition-colors">Mentions légales</Link></li>
            <li><Link href="/politique-de-confidentialite" className="text-gray-400 text-xs hover:text-white transition-colors">Politique de confidentialité</Link></li>
            <li><Link href="#" className="text-gray-400 text-xs hover:text-white transition-colors">Plan du site</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs">
          © Menua Consulting 2026 – Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
