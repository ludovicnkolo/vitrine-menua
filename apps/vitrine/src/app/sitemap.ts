import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://menuaconsulting.com';

  // Liste des routes principales du site (FR et EN)
  const routes = [
    '',
    '/nous-connaitre',
    '/vos-besoins',
    '/nos-solutions',
    '/pourquoi-menua',
    '/actualites',
    '/nous-rejoindre',
    '/nous-contacter',
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/en',
    '/en/about-us',
    '/en/your-needs',
    '/en/our-solutions',
    '/en/why-choose-us',
    '/en/news',
    '/en/join-us',
    '/en/contact-us',
    '/en/legal-notices',
    '/en/privacy-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/en' || route === '/actualites' || route === '/en/news' ? 'weekly' : 'monthly',
    priority: route === '' || route === '/en' ? 1 : 0.8,
  }));
}
