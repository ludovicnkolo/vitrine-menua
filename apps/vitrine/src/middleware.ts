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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les ressources statiques et les chemins exclus
  if (
    EXCLUDED_EXTENSIONS.test(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const isFr = pathname === '/fr' || pathname.startsWith('/fr/');

  // Si le chemin n'a pas de préfixe de langue, rediriger vers /fr/...
  if (!isEn && !isFr) {
    const url = request.nextUrl.clone();
    // "/" → "/fr", "/nous-rejoindre" → "/fr/nous-rejoindre"
    url.pathname = pathname === '/' ? '/fr' : `/fr${pathname}`;
    return NextResponse.redirect(url, { status: 308 });
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
