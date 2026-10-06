import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://menuaconsulting.com';
  const baseDate = new Date('2026-10-06T08:00:00.000Z');

  // Pages FR avec préfixe /fr/ (URL canonique)
  const frRoutes = [
    { path: '/fr', priority: 1.0, freq: 'weekly' as const },
    { path: '/fr/nous-connaitre', priority: 0.8, freq: 'monthly' as const },
    { path: '/fr/vos-besoins', priority: 0.8, freq: 'monthly' as const },
    { path: '/fr/nos-solutions', priority: 0.8, freq: 'monthly' as const },
    { path: '/fr/pourquoi-menua', priority: 0.8, freq: 'monthly' as const },
    { path: '/fr/actualites', priority: 0.9, freq: 'weekly' as const },
    { path: '/fr/nous-rejoindre', priority: 0.7, freq: 'monthly' as const },
    { path: '/fr/nous-contacter', priority: 0.7, freq: 'monthly' as const },
    { path: '/fr/mentions-legales', priority: 0.3, freq: 'yearly' as const },
    { path: '/fr/politique-de-confidentialite', priority: 0.3, freq: 'yearly' as const },
  ];

  // Pages EN
  const enRoutes = [
    { path: '/en', priority: 1.0, freq: 'weekly' as const },
    { path: '/en/about-us', priority: 0.8, freq: 'monthly' as const },
    { path: '/en/your-needs', priority: 0.8, freq: 'monthly' as const },
    { path: '/en/our-solutions', priority: 0.8, freq: 'monthly' as const },
    { path: '/en/why-choose-us', priority: 0.8, freq: 'monthly' as const },
    { path: '/en/news', priority: 0.9, freq: 'weekly' as const },
    { path: '/en/join-us', priority: 0.7, freq: 'monthly' as const },
    { path: '/en/contact-us', priority: 0.7, freq: 'monthly' as const },
    { path: '/en/legal-notices', priority: 0.3, freq: 'yearly' as const },
    { path: '/en/privacy-policy', priority: 0.3, freq: 'yearly' as const },
  ];

  const baseSitemap = [...frRoutes, ...enRoutes].map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: baseDate,
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
            : baseDate;
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
