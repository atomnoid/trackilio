import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

export default nextConfig;
