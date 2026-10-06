import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://menuaconsulting.com';
  // Chaque page a sa propre date de dernière modification significative.
  // Les pages éditoriales (actualités) utilisent la date de build/revalidation dynamique.
  // Les pages légales restent à leur date de publication réelle.
  const now = new Date();

  type RouteEntry = {
    path: string;
    priority: number;
    freq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    lastMod: Date;
  };

  // Pages FR avec préfixe /fr/ (URL canonique)
  const frRoutes: RouteEntry[] = [
    { path: '/fr', priority: 1.0, freq: 'weekly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/nous-connaitre', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/vos-besoins', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/nos-solutions', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/pourquoi-menua', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/actualites', priority: 0.9, freq: 'weekly', lastMod: now },
    { path: '/fr/nous-rejoindre', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/nous-contacter', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/fr/mentions-legales', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-01T00:00:00.000Z') },
    { path: '/fr/politique-de-confidentialite', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-01T00:00:00.000Z') },
  ];

  // Pages EN
  const enRoutes: RouteEntry[] = [
    { path: '/en', priority: 1.0, freq: 'weekly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/about-us', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/your-needs', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/our-solutions', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/why-choose-us', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/news', priority: 0.9, freq: 'weekly', lastMod: now },
    { path: '/en/join-us', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/contact-us', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-06T08:00:00.000Z') },
    { path: '/en/legal-notices', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-01T00:00:00.000Z') },
    { path: '/en/privacy-policy', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-01T00:00:00.000Z') },
  ];

  const baseSitemap = [...frRoutes, ...enRoutes].map(({ path, priority, freq, lastMod }) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastMod,
    changeFrequency: freq,
    priority,
  }));

  // Extraction dynamique des publications CMS publiées
  const articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:4000';
    const res = await fetch(`${backendUrl}/api/cms/public?type=ACTUALITE`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        for (const pub of data.data) {
          const modDate = pub.updatedAt
            ? new Date(pub.updatedAt)
            : pub.publishedAt
            ? new Date(pub.publishedAt)
            : now;
          articleRoutes.push({
            url: `${baseUrl}/fr/actualites/${pub.id}`,
            lastModified: modDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          });
          articleRoutes.push({
            url: `${baseUrl}/en/news/${pub.id}`,
            lastModified: modDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          });
        }
      }
    }
  } catch {
    // Si le backend n'est pas joignable pendant le build, le sitemap de base est retourné
  }

  return [...baseSitemap, ...articleRoutes];
}
