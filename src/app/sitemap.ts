import { MetadataRoute } from 'next';
import { getPublicWanderLists } from '@/services/lists';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const publicLists = await getPublicWanderLists({ limit: 1000 });

  const listEntries: MetadataRoute.Sitemap = publicLists.map((list) => ({
    url: `${siteUrl}/l/${list.slug}`,
    lastModified: new Date(list.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all public profiles that have a username set
  let profileEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: profiles } = await (supabase as any)
      .from('profiles')
      .select('username, updated_at')
      .not('username', 'is', null);

    if (profiles) {
      profileEntries = profiles
        .filter((p: any) => p.username)
        .map((p: any) => ({
          url: `${siteUrl}/u/${p.username}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch {
    // Non-critical — continue without profile entries
  }

  // Fetch all public places
  let placeEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: places } = await (supabase as any)
      .from('places')
      .select('id, slug, updated_at')
      .limit(1000);

    if (places) {
      placeEntries = places.map((p: any) => ({
        url: `${siteUrl}/place/${p.slug || p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Non-critical — continue without place entries
  }

  return [
    {
      url: siteUrl,
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
    ...listEntries,
    ...profileEntries,
    ...placeEntries,
  ];
}


