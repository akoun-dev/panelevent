import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Autoriser les origines de développement pour la prévisualisation
  allowedDevOrigins: [
    'preview-chat-*.space.z.ai',
    'localhost:3000'
  ],
  // Configuration pour les environnements de prévisualisation
  output: 'standalone',
  // Améliorer la compatibilité avec les environnements de prévisualisation
  serverExternalPackages: [],
  // Configuration de compression pour améliorer les performances
  compress: true,
  // Configuration des en-têtes de sécurité
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
