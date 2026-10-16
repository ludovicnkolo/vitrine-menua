import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Chemins à exclure de la redirection (API, statique, SEO, etc.)
const EXCLUDED_PREFIXES = [
  '/_next/',
  '/api/',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
];

const EXCLUDED_EXTENSIONS = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|css|js|json|map)$/;

// Dictionnaire des redirections permanentes (301) pour les anciennes routes et alias historiques
const LEGACY_ALIASES: Record<string, string> = {
  // Routes historiques sans préfixe vers les slugs FR officiels
  '/a-propos': '/fr/nous-connaitre',
  '/nous-connaitre': '/fr/nous-connaitre',
  '/vos-besoins': '/fr/vos-besoins',
  '/nos-solutions': '/fr/nos-solutions',
  '/pourquoi-menua': '/fr/pourquoi-menua',
  '/actualites': '/fr/actualites',
  '/actualite': '/fr/actualites',
  '/contact': '/fr/nous-contacter',
  '/nous-contacter': '/fr/nous-contacter',
  '/rejoindre': '/fr/nous-rejoindre',
  '/nous-rejoindre': '/fr/nous-rejoindre',
  '/mentions-legales': '/fr/mentions-legales',
  '/politique-de-confidentialite': '/fr/politique-de-confidentialite',

  // Sous-chemins et variantes /fr/ erronées
  '/fr/a-propos': '/fr/nous-connaitre',
  '/fr/contact': '/fr/nous-contacter',
  '/fr/rejoindre': '/fr/nous-rejoindre',
  '/fr/actualite': '/fr/actualites',

  // Sous-chemins historiques
  '/actualites/nos-publications': '/fr/actualites',
  '/vos-besoins/finance-et-reporting': '/fr/vos-besoins',
  '/vos-besoins/gestion-de-patrimoine': '/fr/vos-besoins',
  '/vos-besoins/support-comptable-et-data': '/fr/vos-besoins',
  '/vos-besoins/risques-et-conformite': '/fr/vos-besoins',
  '/vos-besoins/autres-besoins': '/fr/vos-besoins',
  '/nos-solutions/langues': '/fr/nos-solutions',
  '/nos-solutions/mode-d-organisation': '/fr/nos-solutions',
  '/nos-solutions/mode-organisation': '/fr/nos-solutions',
  '/nos-solutions/urgence': '/fr/nos-solutions',
  '/nous-connaitre/notre-methodologie': '/fr/nous-connaitre',
  '/nous-connaitre/presentation-du-cabinet': '/fr/nous-connaitre',
  '/pourquoi-menua/nos-benefices': '/fr/pourquoi-menua',
  '/nous-connaitre/accreditations': '/fr/nous-connaitre',
  '/nous-connaitre/notre-equipe': '/fr/nous-connaitre',
  '/nos-solutions/volume': '/fr/nos-solutions',
  '/nos-solutions/duree': '/fr/nos-solutions',
  '/actualites/a-la-une': '/fr/actualites',

  // Alias EN sans préfixe vers les slugs EN officiels
  '/about': '/en/about-us',
  '/about-us': '/en/about-us',
  '/contact-us': '/en/contact-us',
  '/join': '/en/join-us',
  '/join-us': '/en/join-us',
  '/solutions': '/en/our-solutions',
  '/our-solutions': '/en/our-solutions',
  '/your-needs': '/en/your-needs',
  '/why-choose-us': '/en/why-choose-us',
  '/news': '/en/news',

  // Variantes /en/
  '/en/about': '/en/about-us',
  '/en/contact': '/en/contact-us',
  '/en/join': '/en/join-us',
  '/en/solutions': '/en/our-solutions',
  '/en/needs': '/en/your-needs',
  '/en/why': '/en/why-choose-us',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les ressources statiques et les chemins exclus
  if (
    EXCLUDED_EXTENSIONS.test(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  // 1. Vérifier si le chemin correspond à un alias historique ou une route obsolète (301 Permanent)
  if (LEGACY_ALIASES[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = LEGACY_ALIASES[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const isFr = pathname === '/fr' || pathname.startsWith('/fr/');

  // 2. Si le chemin n'a pas de préfixe de langue, redirection 301 vers /fr/...
  if (!isEn && !isFr) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/fr' : `/fr${pathname}`;
    return NextResponse.redirect(url, { status: 301 });
  }

  // Définir les en-têtes de locale pour les composants serveur
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', isEn ? 'en' : 'fr');
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|css|js|json|map)$).*)'],
};
