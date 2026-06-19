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
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://vercel.live https://vitals.vercel-insights.com https://www.google-analytics.com https://api.indexnow.org https://api.openai.com https://api.anthropic.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
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
