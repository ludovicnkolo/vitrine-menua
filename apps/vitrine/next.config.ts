import type { NextConfig } from "next";
import os from "os";

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
  /* config options here */
};

export default nextConfig;
