import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-[#0F2B45] pt-16 pb-8 px-8 border-t border-white/10 text-[#CFD8E3] font-sans text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Colonne 1: Branding & Contact */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            {/* Mc Cursive (Logo sans slogan) */}
            <div className="text-[#C89B5E] font-serif italic text-4xl pr-4 border-r border-white/20" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Mc
            </div>
            <span className="text-white font-serif text-xl font-bold tracking-widest uppercase">
              MENUA CONSULTING
            </span>
          </div>
          <div className="space-y-2 mt-6">
            <p className="text-[#CFD8E3] text-sm">92 rue des Pyrénées – 75020 Paris</p>
            <p>
              <a href="mailto:contact@menuaconsulting.com" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">
                contact@menuaconsulting.com
              </a>
            </p>
            <p>
              <a href="tel:+33686877914" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">
                +33 6 86 87 79 14
              </a>
            </p>
          </div>
        </div>

        {/* Colonne 2: Navigation */}
        <div>
          <h4 className="text-white font-bold tracking-wider uppercase mb-6 text-sm">Navigation</h4>
          <ul className="space-y-3">
            <li><Link href="/nous-connaitre" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Nous connaître</Link></li>
            <li><Link href="/vos-besoins" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Vos besoins</Link></li>
            <li><Link href="/nos-solutions" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Nos solutions</Link></li>
            <li><Link href="/pourquoi-menua" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Pourquoi Menua ?</Link></li>
            <li><Link href="/actualites" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Actualités</Link></li>
            <li><Link href="/nous-rejoindre" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Nous rejoindre</Link></li>
            <li><Link href="/nous-contacter" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Nous contacter</Link></li>
          </ul>
        </div>

        {/* Colonne 3: Informations & Réseaux */}
        <div>
          <h4 className="text-white font-bold tracking-wider uppercase mb-6 text-sm">Informations</h4>
          <ul className="space-y-3 mb-6">
            <li><Link href="/mentions-legales" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Mentions légales</Link></li>
            <li><Link href="/politique-de-confidentialite" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Politique de confidentialité</Link></li>
            <li><Link href="#" className="text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">Plan du site</Link></li>
          </ul>
          
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#CFD8E3] hover:text-[#C89B5E] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 text-center">
        <p className="text-[#CFD8E3] text-xs">
          © 2026 MENUA CONSULTING. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
