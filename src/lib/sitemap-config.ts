import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CURATED_LISTS } from '@/services/curatedData';

export const SITEMAP_CHUNK_SIZE = 1000;

export const STATIC_COUNT = 7;

export function getStaticRoutes(siteUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blend`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}

export interface SegmentCounts {
  listsCount: number;
  profilesCount: number;
  placesCount: number;
  totalCount: number;
}

export async function getSegmentCounts(): Promise<SegmentCounts> {
  let listsCount = 0;
  let profilesCount = 0;
  let placesCount = 0;

  try {
    const supabase = await createClient();

    const [listsRes, profilesRes, placesRes] = await Promise.all([
      // Count: public lists with non-null slugs
      (supabase as any)
        .from('wander_lists')
        .select('id', { count: 'exact', head: true })
        .eq('is_public', true)
        .not('slug', 'is', null),
      // Count: profiles with non-null usernames
      (supabase as any)
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .not('username', 'is', null),
      // Count: places with non-null slugs (must match fetch filter)
      (supabase as any)
        .from('places')
        .select('id', { count: 'exact', head: true })
        .not('slug', 'is', null),
    ]);

    listsCount = listsRes.count ?? CURATED_LISTS.length;
    profilesCount = profilesRes.count ?? 0;
    placesCount = placesRes.count ?? 0;
  } catch {
    listsCount = CURATED_LISTS.length;
  }

  const totalCount = STATIC_COUNT + listsCount + profilesCount + placesCount;
  return { listsCount, profilesCount, placesCount, totalCount };
}

export async function getSitemapChunkList(): Promise<Array<{ id: number }>> {
  const { totalCount } = await getSegmentCounts();
  const numChunks = Math.max(1, Math.ceil(totalCount / SITEMAP_CHUNK_SIZE));
  return Array.from({ length: numChunks }, (_, i) => ({ id: i }));
}
