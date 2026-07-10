import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://menuaconsulting.com';

  // Liste des routes principales du site
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
    '/politique-de-confidentialite'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/actualites' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
