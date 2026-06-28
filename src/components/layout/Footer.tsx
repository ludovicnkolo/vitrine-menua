import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#E2DFD8] pt-20 pb-12 px-8 text-[#222222] footer-text">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
        
        {/* Colonne 1: Branding & Navigation */}
        <div className="flex flex-col gap-10">
          {/* Logo Menua Consulting */}
          <div className="flex flex-col">
             <span className="text-[#222222] leading-none" style={{ fontFamily: "var(--font-operetta)", fontSize: "3rem", fontWeight: 400 }}>
               Menua
             </span>
             <span className="text-[#222222] uppercase tracking-[0.2em] text-[0.65rem] mt-2 font-bold">
               Consulting
             </span>
          </div>
          
          <ul className="flex flex-col space-y-3">
            <li><Link href="/nous-connaitre" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Nous connaître</Link></li>
            <li><Link href="/vos-besoins" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Vos besoins</Link></li>
            <li><Link href="/nos-solutions" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Nos solutions</Link></li>
            <li><Link href="/pourquoi-menua" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Pourquoi Menua ?</Link></li>
            <li><Link href="/actualites" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Actualités</Link></li>
            <li><Link href="/nous-rejoindre" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium">Nous rejoindre</Link></li>
          </ul>
        </div>

        {/* Colonne 2: NOUS TROUVER */}
        <div className="flex flex-col mt-4 md:mt-0">
          <h4 className="uppercase text-xl mb-8 tracking-wide" style={{ fontFamily: "var(--font-optima)", fontWeight: 500 }}>Nous trouver</h4>
          
          <div className="flex flex-col space-y-1 mb-8 text-[0.9rem]">
            <span className="uppercase">92 Rue des Pyrénées</span>
            <span className="uppercase">75020 Paris</span>
            <span className="mt-1">+33 6 86 87 79 14</span>
          </div>
        </div>

        {/* Colonne 3: NOUS CONTACTER */}
        <div className="flex flex-col mt-4 md:mt-0">
          <h4 className="uppercase text-xl mb-8 tracking-wide" style={{ fontFamily: "var(--font-optima)", fontWeight: 500 }}>Nous contacter</h4>
          
          <Link href="/nous-contacter" className="uppercase hover:text-[#1B3680] transition-colors tracking-widest text-[0.8rem] font-medium mb-10">
            Nous écrire
          </Link>
          
          <h5 className="text-[1.1rem] mb-4" style={{ fontFamily: "var(--font-optima)", fontWeight: 500 }}>Contact direct</h5>
          <a href="mailto:contact@menuaconsulting.com" className="hover:text-[#1B3680] transition-colors text-[0.9rem] mb-12">
            contact@menuaconsulting.com
          </a>

          <div className="flex items-center gap-3 mt-auto">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-[#E2DFD8] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-[#E2DFD8] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-[#E2DFD8] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-[#E2DFD8] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

      </div>
      
      {/* Bas de page */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col items-center gap-5">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.65rem] uppercase tracking-widest text-[#222222]/80 font-medium">
          <li><Link href="/mentions-legales" className="hover:text-[#222222] transition-colors">Mentions légales</Link></li>
          <li><Link href="/politique-de-confidentialite" className="hover:text-[#222222] transition-colors">Politique de confidentialité</Link></li>
          <li><Link href="#" className="hover:text-[#222222] transition-colors">Plan du site</Link></li>
        </ul>
        <p className="text-[0.65rem] uppercase tracking-widest text-[#222222]/60 font-medium">
          © {new Date().getFullYear()} MENUA CONSULTING. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
