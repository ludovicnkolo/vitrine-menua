import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-[#051014]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <Link href="/" className="flex items-center">
        <div className="mr-3 text-[#c89b53]">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80V20L50 60L80 20V80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 50L20 80" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-serif text-xl font-bold leading-none tracking-wide">Menua</span>
          <span className="text-[#c89b53] text-[0.55rem] uppercase tracking-[0.25em] font-sans mt-0.5">Consulting</span>
          <span className="text-gray-500 text-[0.45rem] tracking-[0.2em] uppercase font-light">Conseil · Performance · Confiance</span>
        </div>
      </Link>
      
      <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-300 font-medium">
        <div className="group relative">
          <Link href="/nous-connaitre" className="hover:text-white transition-colors py-2 flex items-center gap-1 whitespace-nowrap">
            Nous connaître
          </Link>
        </div>
        <div className="group relative">
          <Link href="/vos-besoins" className="hover:text-white transition-colors py-2 whitespace-nowrap">Vos besoins</Link>
        </div>
        <div className="group relative">
          <Link href="/nos-solutions" className="hover:text-white transition-colors py-2 whitespace-nowrap">Nos solutions</Link>
        </div>
        <div className="group relative">
          <Link href="/pourquoi-menua" className="hover:text-white transition-colors py-2 whitespace-nowrap">Pourquoi Menua ?</Link>
        </div>
        <Link href="/actualites" className="hover:text-white transition-colors whitespace-nowrap">Actualités</Link>
        
        <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
          <button className="text-white font-bold text-xs">FR</button>
          <span className="text-gray-600 text-xs">|</span>
          <button className="text-gray-500 hover:text-white transition-colors text-xs">EN</button>
        </div>
        <Link href="/nous-rejoindre" className="hover:text-white transition-colors whitespace-nowrap text-sm">Nous rejoindre</Link>
        <Link href="/nous-contacter" className="bg-[#c89b53] hover:bg-[#b38541] text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors whitespace-nowrap">
          Nous contacter
        </Link>
      </nav>
    </header>
  );
}
