import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/discover', '/place/*', '/l/*', '/u/*', '/blend/*', '/about', '/sitemap.xml', '/sitemap/*'],
      disallow: ['/dashboard', '/create', '/settings', '/auth/*', '/api/*', '/invite/*', '/l/invite/*', '/blend/invite/*'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

