import { MetadataRoute } from 'next';
import { getPublicWanderLists } from '@/services/lists';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const publicLists = await getPublicWanderLists({ limit: 1000 });

  const listEntries: MetadataRoute.Sitemap = publicLists.map((list) => ({
    url: `${siteUrl}/l/${list.slug}`,
    lastModified: new Date(list.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...listEntries,
  ];
}
