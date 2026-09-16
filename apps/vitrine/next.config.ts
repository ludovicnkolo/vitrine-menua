import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

// Charger le fichier .env universel depuis la racine (site_web)
loadEnvConfig(path.resolve(process.cwd(), '../../'));

// Fonction pour récupérer dynamiquement toutes les adresses IP locales de la machine
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips: string[] = ['localhost'];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const nextConfig: NextConfig = {
  // Autoriser automatiquement l'accès HMR depuis toutes les IP de la machine (évite le blocage sur réseau local)
  allowedDevOrigins: getLocalIPs(),
  output: "standalone",
  async redirects() {
    return [
      // Anciennes routes FR sans préfixe → /fr/ (SEO permanent 301)
      { source: '/', destination: '/fr', permanent: true },
      { source: '/nous-connaitre', destination: '/fr/nous-connaitre', permanent: true },
      { source: '/vos-besoins', destination: '/fr/vos-besoins', permanent: true },
      { source: '/nos-solutions', destination: '/fr/nos-solutions', permanent: true },
      { source: '/pourquoi-menua', destination: '/fr/pourquoi-menua', permanent: true },
      { source: '/actualites', destination: '/fr/actualites', permanent: true },
      { source: '/nous-rejoindre', destination: '/fr/nous-rejoindre', permanent: true },
      { source: '/nous-contacter', destination: '/fr/nous-contacter', permanent: true },
      { source: '/mentions-legales', destination: '/fr/mentions-legales', permanent: true },
      { source: '/politique-de-confidentialite', destination: '/fr/politique-de-confidentialite', permanent: true },
      // Anciens sous-chemins FR
      { source: '/actualites/nos-publications', destination: '/fr/actualites', permanent: true },
      { source: '/vos-besoins/finance-et-reporting', destination: '/fr/vos-besoins', permanent: true },
      { source: '/vos-besoins/gestion-de-patrimoine', destination: '/fr/vos-besoins', permanent: true },
      { source: '/vos-besoins/support-comptable-et-data', destination: '/fr/vos-besoins', permanent: true },
      { source: '/vos-besoins/risques-et-conformite', destination: '/fr/vos-besoins', permanent: true },
      { source: '/vos-besoins/autres-besoins', destination: '/fr/vos-besoins', permanent: true },
      { source: '/nos-solutions/langues', destination: '/fr/nos-solutions', permanent: true },
      { source: '/nos-solutions/mode-d-organisation', destination: '/fr/nos-solutions', permanent: true },
      { source: '/nos-solutions/mode-organisation', destination: '/fr/nos-solutions', permanent: true },
      { source: '/nos-solutions/urgence', destination: '/fr/nos-solutions', permanent: true },
      { source: '/nous-connaitre/notre-methodologie', destination: '/fr/nous-connaitre', permanent: true },
      { source: '/nous-connaitre/presentation-du-cabinet', destination: '/fr/nous-connaitre', permanent: true },
      { source: '/pourquoi-menua/nos-benefices', destination: '/fr/pourquoi-menua', permanent: true },
      // Redirections ajoutées suite aux erreurs 404 de la Search Console
      { source: '/nous-connaitre/accreditations', destination: '/fr/nous-connaitre', permanent: true },
      { source: '/nous-connaitre/notre-equipe', destination: '/fr/nous-connaitre', permanent: true },
      { source: '/nos-solutions/volume', destination: '/fr/nos-solutions', permanent: true },
      { source: '/nos-solutions/duree', destination: '/fr/nos-solutions', permanent: true },
      { source: '/actualites/a-la-une', destination: '/fr/actualites', permanent: true },
    ];
  },
  // Proxy les requêtes /api vers le backend pour éviter les 404 quand on accède via le port 3000
  // Et support transparent de /fr et /fr/* sans redirection
  async rewrites() {
    return [
      {
        source: '/fr',
        destination: '/',
      },
      {
        source: '/fr/:path*',
        destination: '/:path*',
      },
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' ? (process.env.BACKEND_URL || 'http://backend:4000') + '/api/:path*' : 'http://localhost:4000/api/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
