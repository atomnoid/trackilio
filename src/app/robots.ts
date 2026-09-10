import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/discover', '/explore', '/place/*', '/l/*', '/u/*', '/blend/*', '/about'],
      disallow: ['/dashboard', '/create', '/settings', '/auth/*', '/api/*'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

