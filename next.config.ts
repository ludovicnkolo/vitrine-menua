import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser l'accès depuis l'autre appareil du réseau pour éviter le blocage du Javascript (menu)
  allowedDevOrigins: ['10.151.202.62', 'localhost'],
  /* config options here */
};

export default nextConfig;
