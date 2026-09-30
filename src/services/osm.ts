/**
 * OpenStreetMap (Nominatim) Service for Trackilio
 * 
 * Used for place creation/ingestion into Trackilio's canonical database.
 * User queries operate against Trackilio's local PostgreSQL database.
 * Nominatim queries are throttled and cached to respect OSM tile & usage policies.
 */

export interface OSMPlaceResult {
  osm_id: string;
  osm_type: string;
  display_name: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

// In-memory server-side cache for OSM queries to prevent repeated calls
const osmCache = new Map<string, { data: OSMPlaceResult[]; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Search places via Nominatim API for ingestion/autocomplete when creating places
 */
export async function searchOpenStreetMap(query: string): Promise<OSMPlaceResult[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();
  const cached = osmCache.get(cleanQuery);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query.trim()
    )}&format=json&addressdetails=1&limit=5`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Trackilio/1.0 (contact@trackilio.com)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 86400 }, // 24 hour Next.js cache
    });

    if (!res.ok) return [];

    const items = await res.json();
    if (!Array.isArray(items)) return [];

    const results: OSMPlaceResult[] = items.map((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const city =
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.state ||
        '';

      return {
        osm_id: `${item.osm_type}/${item.osm_id}`,
        osm_type: item.osm_type,
        display_name: item.display_name,
        name: item.name || item.display_name.split(',')[0],
        lat,
        lng,
        category: item.class || item.type || 'place',
        address: {
          road: item.address?.road,
          city,
          state: item.address?.state,
          country: item.address?.country,
          postcode: item.address?.postcode,
        },
      };
    });

    osmCache.set(cleanQuery, { data: results, timestamp: Date.now() });
    return results;
  } catch (err) {
    console.warn('Error querying OpenStreetMap Nominatim:', err);
    return [];
  }
}

/**
 * Get OpenStreetMap view link with attribution
 */
export function getOSMAttributedUrl(params: {
  lat?: number | null;
  lng?: number | null;
  name: string;
}): string {
  if (params.lat != null && params.lng != null) {
    return `https://www.openstreetmap.org/?mlat=${params.lat}&mlon=${params.lng}#map=16/${params.lat}/${params.lng}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(params.name)}`;
}
