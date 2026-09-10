import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CURATED_LISTS } from '@/services/curatedData';
import { getSiteUrl } from '@/lib/utils';

export const revalidate = 3600;

const CHUNK_SIZE = 1000;

// Fixed static public routes with explicit priority and frequencies
function getStaticRoutes(siteUrl: string): MetadataRoute.Sitemap {
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

interface SegmentCounts {
  staticCount: number;
  listsCount: number;
  profilesCount: number;
  placesCount: number;
  totalCount: number;
}

async function getSegmentCounts(): Promise<SegmentCounts> {
  const staticCount = 7;
  let listsCount = 0;
  let profilesCount = 0;
  let placesCount = 0;

  try {
    const supabase = await createClient();

    const [listsRes, profilesRes, placesRes] = await Promise.all([
      (supabase as any)
        .from('wander_lists')
        .select('id', { count: 'exact', head: true })
        .eq('is_public', true)
        .not('slug', 'is', null),
      (supabase as any)
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .not('username', 'is', null),
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

  const totalCount = staticCount + listsCount + profilesCount + placesCount;
  return { staticCount, listsCount, profilesCount, placesCount, totalCount };
}

/**
 * Next.js native sitemap index generator:
 * Dynamically computes the required chunk IDs based on actual database record counts.
 */
export async function generateSitemaps() {
  const { totalCount } = await getSegmentCounts();
  const numChunks = Math.max(1, Math.ceil(totalCount / CHUNK_SIZE));

  return Array.from({ length: numChunks }, (_, i) => ({ id: i }));
}

/**
 * Generates an individual sitemap chunk.
 * Respects strict pagination and zero duplicate/overlapping index boundaries.
 */
export default async function sitemap(props?: {
  id?: string | number | Promise<{ id: string | number }> | { id: string | number };
}): Promise<MetadataRoute.Sitemap> {
  const resolvedProps = await props;
  let rawId = resolvedProps?.id;
  if (rawId && typeof rawId === 'object' && 'id' in rawId) {
    rawId = (rawId as any).id;
  }
  const chunkId = Number(rawId) || 0;

  const siteUrl = getSiteUrl();
  const { staticCount, listsCount, profilesCount, placesCount } = await getSegmentCounts();

  const chunkStart = chunkId * CHUNK_SIZE;
  const chunkEnd = (chunkId + 1) * CHUNK_SIZE;

  const entries: MetadataRoute.Sitemap = [];

  // 1. Static Routes Segment: [0, staticCount)
  if (chunkStart < staticCount) {
    const staticRoutes = getStaticRoutes(siteUrl);
    const start = chunkStart;
    const end = Math.min(staticCount, chunkEnd);
    entries.push(...staticRoutes.slice(start, end));
  }

  // 2. Public WanderLists Segment: [staticCount, staticCount + listsCount)
  const listsStartGlobal = staticCount;
  const listsEndGlobal = staticCount + listsCount;
  if (chunkStart < listsEndGlobal && chunkEnd > listsStartGlobal) {
    const fetchStart = Math.max(0, chunkStart - listsStartGlobal);
    const fetchEnd = Math.min(listsCount, chunkEnd - listsStartGlobal) - 1;

    try {
      const supabase = await createClient();
      const { data: lists, error } = await (supabase as any)
        .from('wander_lists')
        .select('slug, updated_at')
        .eq('is_public', true)
        .not('slug', 'is', null)
        .order('updated_at', { ascending: false })
        .range(fetchStart, fetchEnd);

      if (!error && lists && lists.length > 0) {
        lists.forEach((l: any) => {
          if (l.slug) {
            entries.push({
              url: `${siteUrl}/l/${l.slug}`,
              lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        });
      } else if (chunkId === 0) {
        // Fallback to CURATED_LISTS
        CURATED_LISTS.forEach((l) => {
          entries.push({
            url: `${siteUrl}/l/${l.slug}`,
            lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      }
    } catch {
      if (chunkId === 0) {
        CURATED_LISTS.forEach((l) => {
          entries.push({
            url: `${siteUrl}/l/${l.slug}`,
            lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      }
    }
  }

  // 3. Public User Profiles Segment: [listsEndGlobal, listsEndGlobal + profilesCount)
  const profilesStartGlobal = listsEndGlobal;
  const profilesEndGlobal = listsEndGlobal + profilesCount;
  if (chunkStart < profilesEndGlobal && chunkEnd > profilesStartGlobal) {
    const fetchStart = Math.max(0, chunkStart - profilesStartGlobal);
    const fetchEnd = Math.min(profilesCount, chunkEnd - profilesStartGlobal) - 1;

    try {
      const supabase = await createClient();
      const { data: profiles, error } = await (supabase as any)
        .from('profiles')
        .select('username, updated_at')
        .not('username', 'is', null)
        .order('updated_at', { ascending: false })
        .range(fetchStart, fetchEnd);

      if (!error && profiles) {
        profiles.forEach((p: any) => {
          if (p.username && p.username.trim()) {
            entries.push({
              url: `${siteUrl}/u/${encodeURIComponent(p.username.trim())}`,
              lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        });
      }
    } catch {
      // Non-critical: continue without failing
    }
  }

  // 4. Public Places Segment: [profilesEndGlobal, profilesEndGlobal + placesCount)
  const placesStartGlobal = profilesEndGlobal;
  const placesEndGlobal = profilesEndGlobal + placesCount;
  if (chunkStart < placesEndGlobal && chunkEnd > placesStartGlobal) {
    const fetchStart = Math.max(0, chunkStart - placesStartGlobal);
    const fetchEnd = Math.min(placesCount, chunkEnd - placesStartGlobal) - 1;

    try {
      const supabase = await createClient();
      const { data: places, error } = await (supabase as any)
        .from('places')
        .select('slug, id, updated_at')
        .order('updated_at', { ascending: false })
        .range(fetchStart, fetchEnd);

      if (!error && places) {
        places.forEach((p: any) => {
          const identifier = p.slug || p.id;
          if (identifier) {
            entries.push({
              url: `${siteUrl}/place/${encodeURIComponent(identifier)}`,
              lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        });
      }
    } catch {
      // Non-critical: continue without failing
    }
  }

  return entries;
}
