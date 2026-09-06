import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://menuaconsulting.com';

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

  const allRoutes = [...frRoutes, ...enRoutes];

  return allRoutes.map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));
}
