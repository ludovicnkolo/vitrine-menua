import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FDFDFD] pt-24 lg:pt-32 pb-12 lg:pb-16 px-8 text-[#272A2C] w-full border-t border-[#272A2C]/10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 lg:mb-32">
        
        {/* Colonne 1: Branding */}
        <div className="flex flex-col">
          <div className="flex flex-col mb-4">
             <span className="text-[#272A2C] leading-none" style={{ fontFamily: "var(--font-playfair)", fontSize: "2.2rem", fontWeight: 400 }}>
               MENUA
             </span>
             <span className="text-[#272A2C] uppercase tracking-[0.25em] text-[0.65rem] mt-1 font-normal">
               Consulting
             </span>
          </div>
          <p className="text-[#272A2C]/80 text-[0.8rem] leading-relaxed max-w-[250px]">
            Externalisation opérationnelle des fonctions back & middle office.
          </p>
        </div>

        {/* Colonne 2: Expertises */}
        <div className="flex flex-col">
          <h4 className="uppercase text-[0.8rem] font-bold tracking-[0.1em] mb-6 text-[#272A2C]">Expertises</h4>
          <ul className="flex flex-col space-y-3 text-[0.85rem] text-[#272A2C]/80 font-medium">
            <li><Link href="/vos-besoins#finance-reporting" className="hover:text-[#D9B151] transition-colors">Finance & reporting</Link></li>
            <li><Link href="/vos-besoins#controle-de-gestion" className="hover:text-[#D9B151] transition-colors">Contrôle de gestion</Link></li>
            <li><Link href="/vos-besoins#risques-conformite" className="hover:text-[#D9B151] transition-colors">Risques & conformité</Link></li>
            <li><Link href="/vos-besoins#support-comptable-data" className="hover:text-[#D9B151] transition-colors">Support comptable & data</Link></li>
            <li><Link href="/vos-besoins#gestion-patrimoine" className="hover:text-[#D9B151] transition-colors">Gestion de patrimoine</Link></li>
            <li><Link href="/vos-besoins#autres-besoins" className="hover:text-[#D9B151] transition-colors">Autres besoins</Link></li>
          </ul>
        </div>

        {/* Colonne 3: Nos Solutions */}
        <div className="flex flex-col">
          <h4 className="uppercase text-[0.8rem] font-bold tracking-[0.1em] mb-6 text-[#272A2C]">Nos solutions</h4>
          <ul className="flex flex-col space-y-3 text-[0.85rem] text-[#272A2C]/80 font-medium">
            <li><Link href="/nos-solutions#urgence" className="hover:text-[#D9B151] transition-colors">Urgence</Link></li>
            <li><Link href="/nos-solutions#duree" className="hover:text-[#D9B151] transition-colors">Durée</Link></li>
            <li><Link href="/nos-solutions#volume" className="hover:text-[#D9B151] transition-colors">Volume</Link></li>
            <li><Link href="/nos-solutions#organisation" className="hover:text-[#D9B151] transition-colors">Organisation</Link></li>
          </ul>
        </div>
        
        {/* Colonne 4: Contact & Légal */}
        <div className="flex flex-col">
          <h4 className="uppercase text-[0.8rem] font-bold tracking-[0.1em] mb-6 text-[#272A2C]">Contact & Légal</h4>
          <ul className="flex flex-col space-y-3 text-[0.85rem] text-[#272A2C]/80 font-medium mb-6">
            <li><Link href="/nous-contacter" className="hover:text-[#D9B151] transition-colors">Nous contacter</Link></li>
            <li><Link href="/nous-rejoindre" className="hover:text-[#D9B151] transition-colors">Nous rejoindre</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-[#D9B151] transition-colors">Mentions légales</Link></li>
            <li><Link href="/politique-de-confidentialite" className="hover:text-[#D9B151] transition-colors">Politique de confidentialité</Link></li>
          </ul>
          
          <div className="flex items-center">
            <a 
              href="https://www.linkedin.com/company/menua-consulting/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-[#272A2C] flex items-center justify-center hover:bg-[#272A2C] hover:text-white transition-all text-[#272A2C]" 
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

      </div>
      
      {/* Bas de page */}
      <div className="max-w-[1280px] mx-auto pt-6 border-t border-[#272A2C]/10 flex flex-col items-center">
        <p className="text-[0.75rem] text-[#272A2C]/60 font-medium">
          © 2024 Menua Consulting – Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
