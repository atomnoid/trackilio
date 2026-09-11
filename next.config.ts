import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['framer-motion', '@supabase/supabase-js'],
  },

  // Compress responses
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  async redirects() {
    return [
      // 1. Permanent redirect www.trackilio.com -> https://trackilio.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.trackilio.com',
          },
        ],
        destination: 'https://trackilio.com/:path*',
        permanent: true,
      },
      // 2. Stale /explore route redirect -> /discover
      {
        source: '/explore',
        destination: '/discover',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // Route /sitemap.xml to the dedicated sitemap index route handler
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap-index',
      },
    ];
  },

  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
