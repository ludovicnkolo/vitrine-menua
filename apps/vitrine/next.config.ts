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
      { source: '/actualites/nos-publications', destination: '/actualites', permanent: true },
      { source: '/vos-besoins/finance-et-reporting', destination: '/vos-besoins', permanent: true },
      { source: '/vos-besoins/gestion-de-patrimoine', destination: '/vos-besoins', permanent: true },
      { source: '/vos-besoins/support-comptable-et-data', destination: '/vos-besoins', permanent: true },
      { source: '/vos-besoins/risques-et-conformite', destination: '/vos-besoins', permanent: true },
      { source: '/vos-besoins/autres-besoins', destination: '/vos-besoins', permanent: true },
      { source: '/nos-solutions/langues', destination: '/nos-solutions', permanent: true },
      { source: '/nos-solutions/mode-d-organisation', destination: '/nos-solutions', permanent: true },
      { source: '/nos-solutions/mode-organisation', destination: '/nos-solutions', permanent: true },
      { source: '/nos-solutions/urgence', destination: '/nos-solutions', permanent: true },
      { source: '/nous-connaitre/notre-methodologie', destination: '/nous-connaitre', permanent: true },
      { source: '/nous-connaitre/presentation-du-cabinet', destination: '/nous-connaitre', permanent: true },
      { source: '/pourquoi-menua/nos-benefices', destination: '/pourquoi-menua', permanent: true },
      { source: '/fr', destination: '/', permanent: true },
      { source: '/fr/:path*', destination: '/:path*', permanent: true }
    ];
  },
  // Proxy les requêtes /api vers le backend pour éviter les 404 quand on accède via le port 3000
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' ? (process.env.BACKEND_URL || 'http://backend:4000') + '/api/:path*' : 'http://localhost:4000/api/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
