// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuration pour le build standalone
  output: "standalone",
};

export default nextConfig;
