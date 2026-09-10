import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://trackilio.com').replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/discover', '/place/*', '/l/*', '/u/*', '/blend/*', '/about', '/sitemap.xml', '/sitemap/*'],
      disallow: ['/dashboard', '/create', '/settings', '/auth/*', '/api/*'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

