// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuration pour le build standalone (seulement en production)
  output: process.env.NODE_ENV === 'production' ? "standalone" : undefined,
};

export default nextConfig;
