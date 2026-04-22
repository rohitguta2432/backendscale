import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

const nextConfig: NextConfig = {
  // i18n is handled via [locale] dynamic routing in App Router
  // No specific i18n config needed here
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:locale(en|hi|fr|de|ar)/blog',
        destination: '/:locale/notes',
        permanent: true,
      },
      {
        source: '/:locale(en|hi|fr|de|ar)/blog/:slug*',
        destination: '/:locale/notes/:slug*',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/en/notes',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/en/notes/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
