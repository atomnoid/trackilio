import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CURATED_LISTS } from '@/services/curatedData';
import { getSiteUrl } from '@/lib/utils';
import {
  SITEMAP_CHUNK_SIZE,
  STATIC_COUNT,
  getStaticRoutes,
  getSegmentCounts,
  getSitemapChunkList,
} from '@/lib/sitemap-config';

export const revalidate = 3600;

/**
 * Next.js native sitemap chunk list generator.
 * Dynamically computes the required chunk IDs based on actual database record counts.
 * Generates child sitemaps: /sitemap/0.xml, /sitemap/1.xml, ...
 */
export async function generateSitemaps() {
  return getSitemapChunkList();
}

/**
 * Generates an individual sitemap chunk.
 * Called by Next.js with { id: number } matching one entry from generateSitemaps().
 *
 * Segment layout (global indices):
 *   [0,                           STATIC_COUNT)              → static routes
 *   [STATIC_COUNT,                STATIC_COUNT + listsCount) → public WanderLists
 *   [STATIC_COUNT + listsCount,   ... + profilesCount)       → public profiles
 *   [... + profilesCount,         ... + placesCount)         → public places
 */
export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const chunkId = Number(id) || 0;
  const siteUrl = getSiteUrl();

  const { listsCount, profilesCount, placesCount } = await getSegmentCounts();

  const chunkStart = chunkId * SITEMAP_CHUNK_SIZE;
  const chunkEnd = (chunkId + 1) * SITEMAP_CHUNK_SIZE; // exclusive upper bound

  const entries: MetadataRoute.Sitemap = [];

  // ── 1. Static routes: global [0, STATIC_COUNT) ──────────────────────────
  if (chunkStart < STATIC_COUNT) {
    const staticRoutes = getStaticRoutes(siteUrl);
    const start = chunkStart;
    const end = Math.min(STATIC_COUNT, chunkEnd);
    entries.push(...staticRoutes.slice(start, end));
  }

  // ── 2. Public WanderLists: global [STATIC_COUNT, STATIC_COUNT + listsCount) ──
  const listsStartGlobal = STATIC_COUNT;
  const listsEndGlobal = STATIC_COUNT + listsCount;
  if (chunkStart < listsEndGlobal && chunkEnd > listsStartGlobal) {
    // Convert global chunk window to local (0-indexed) list range
    const fetchStart = Math.max(0, chunkStart - listsStartGlobal);
    const fetchEnd = Math.min(listsCount, chunkEnd - listsStartGlobal) - 1; // inclusive

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
        // Fallback to curated lists when DB is unavailable
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

  // ── 3. Public Profiles: global [listsEndGlobal, listsEndGlobal + profilesCount) ──
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
      // Non-critical: continue
    }
  }

  // ── 4. Public Places: global [profilesEndGlobal, profilesEndGlobal + placesCount) ──
  // Count and fetch use the same filter: .not('slug', 'is', null)
  const placesStartGlobal = profilesEndGlobal;
  const placesEndGlobal = profilesEndGlobal + placesCount;
  if (chunkStart < placesEndGlobal && chunkEnd > placesStartGlobal) {
    const fetchStart = Math.max(0, chunkStart - placesStartGlobal);
    const fetchEnd = Math.min(placesCount, chunkEnd - placesStartGlobal) - 1;

    try {
      const supabase = await createClient();
      const { data: places, error } = await (supabase as any)
        .from('places')
        .select('slug, updated_at')
        .not('slug', 'is', null) // must match the count filter above
        .order('updated_at', { ascending: false })
        .range(fetchStart, fetchEnd);

      if (!error && places) {
        places.forEach((p: any) => {
          if (p.slug) {
            entries.push({
              url: `${siteUrl}/place/${p.slug}`,
              lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        });
      }
    } catch {
      // Non-critical: continue
    }
  }

  return entries;
}
