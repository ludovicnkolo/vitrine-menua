import type { NextConfig } from "next";
import os from "os";
import path from "path";
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
  // Proxy les requêtes /api vers le backend pour éviter les 404 quand on accède via le port 3000
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' ? 'http://backend:4000/api/:path*' : 'http://localhost:4000/api/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
