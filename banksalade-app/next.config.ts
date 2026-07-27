import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental 밖으로 꺼내서 작성
  allowedDevOrigins: ["192.168.219.111", "localhost:8080", "112.158.50.39", "112.158.50.39:8080", "banksalade-card.kro.kr"],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  experimental: {
    // 다른 실험적 옵션들...
  },
};

export default nextConfig;
