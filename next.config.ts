import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser l'accès depuis l'autre appareil du réseau pour éviter le blocage du Javascript (menu)
  allowedDevOrigins: ['10.151.202.62', 'localhost', '10.10.1.68', '192.168.1.0/24', '10.10.1.0/24'],
  output: "standalone",
  /* config options here */
};

export default nextConfig;
