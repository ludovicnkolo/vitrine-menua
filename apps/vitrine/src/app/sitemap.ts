import { MetadataRoute } from 'next';
import { generateSlug } from '@/utils/slug';
import { fetchPublishedNews } from '@/lib/cms';

export const revalidate = 1800; // Régénération toutes les 30 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://menuaconsulting.com';
  const now = new Date();

  // Extraction dynamique des publications CMS publiées
  const publications = await fetchPublishedNews();

  // Date de la dernière publication active ou date par défaut
  let latestPubDate = new Date('2026-10-08T09:00:00.000Z');
  if (publications.length > 0) {
    const dates = publications.map((p) =>
      p.updatedAt ? new Date(p.updatedAt).getTime() : (p.publishedAt ? new Date(p.publishedAt).getTime() : 0)
    );
    const maxTime = Math.max(...dates);
    if (maxTime > 0) {
      latestPubDate = new Date(maxTime);
    }
  }

  // Pages statiques avec dates réelles de modification significative
  type RouteEntry = {
    path: string;
    priority: number;
    freq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    lastMod: Date;
  };

  // Pages FR
  const frRoutes: RouteEntry[] = [
    { path: '/fr', priority: 1.0, freq: 'weekly', lastMod: latestPubDate },
    { path: '/fr/nous-connaitre', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-07T12:00:00.000Z') },
    { path: '/fr/vos-besoins', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/fr/nos-solutions', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/fr/pourquoi-menua', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/fr/actualites', priority: 0.9, freq: 'weekly', lastMod: latestPubDate },
    { path: '/fr/nous-rejoindre', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/fr/nous-contacter', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-07T10:00:00.000Z') },
    { path: '/fr/mentions-legales', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-07T10:00:00.000Z') },
    { path: '/fr/politique-de-confidentialite', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
  ];

  // Pages EN
  const enRoutes: RouteEntry[] = [
    { path: '/en', priority: 1.0, freq: 'weekly', lastMod: latestPubDate },
    { path: '/en/about-us', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-07T12:00:00.000Z') },
    { path: '/en/your-needs', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/en/our-solutions', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/en/why-choose-us', priority: 0.8, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/en/news', priority: 0.9, freq: 'weekly', lastMod: latestPubDate },
    { path: '/en/join-us', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
    { path: '/en/contact-us', priority: 0.7, freq: 'monthly', lastMod: new Date('2026-10-07T10:00:00.000Z') },
    { path: '/en/legal-notices', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-07T10:00:00.000Z') },
    { path: '/en/privacy-policy', priority: 0.3, freq: 'yearly', lastMod: new Date('2026-10-08T08:00:00.000Z') },
  ];

  const baseSitemap = [...frRoutes, ...enRoutes].map(({ path, priority, freq, lastMod }) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastMod,
    changeFrequency: freq,
    priority,
  }));

  // URL dynamiques des articles publiés avec slug canonique et ID fallback
  const articleRoutes: MetadataRoute.Sitemap = [];
  for (const pub of publications) {
    const modDate = pub.updatedAt
      ? new Date(pub.updatedAt)
      : (pub.publishedAt ? new Date(pub.publishedAt) : now);

    const slugFr = generateSlug(pub.title, pub.id);
    const slugEn = generateSlug(pub.title_en || pub.title, pub.id);

    // URL FR
    articleRoutes.push({
      url: `${baseUrl}/fr/actualites/${slugFr}`,
      lastModified: modDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });

    // URL EN
    articleRoutes.push({
      url: `${baseUrl}/en/news/${slugEn}`,
      lastModified: modDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });
  }

  return [...baseSitemap, ...articleRoutes];
}
