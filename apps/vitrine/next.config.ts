import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser l'accès depuis l'autre appareil du réseau pour éviter le blocage du Javascript (menu)
  allowedDevOrigins: ['192.168.0.68', '10.223.2.62', '10.223.0.0/16', '10.151.202.62', 'localhost', '10.10.1.68', '192.168.1.0/24', '10.10.1.0/24', '192.168.0.0/16', '10.0.0.0/8', '172.16.0.0/12'],
  output: "standalone",
  /* config options here */
};

export default nextConfig;
