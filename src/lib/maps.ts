/**
 * Open-Source Map Provider Abstraction
 * 
 * Provides map utilities, OpenStreetMap embed URLs, and navigation links
 * without creating a hard dependency on Google Maps API.
 */

export interface MapCoordinates {
  lat: number;
  lng: number;
}

/**
 * Generate an OpenStreetMap search/view URL
 */
export function getOpenStreetMapUrl(params: {
  lat?: number | null;
  lng?: number | null;
  name?: string;
  location?: string | null;
  city?: string | null;
  country?: string | null;
}): string {
  if (params.lat != null && params.lng != null) {
    return `https://www.openstreetmap.org/?mlat=${params.lat}&mlon=${params.lng}#map=16/${params.lat}/${params.lng}`;
  }

  const queryParts = [params.name, params.location, params.city, params.country].filter(Boolean);
  const q = encodeURIComponent(queryParts.join(', '));
  return `https://www.openstreetmap.org/search?query=${q}`;
}

/**
 * Generate an external map link (prefers existing maps_url if valid, or falls back to OpenStreetMap / Google Search)
 */
export function getExternalMapUrl(place: {
  maps_url?: string | null;
  name: string;
  location?: string | null;
  city?: string | null;
  country?: string | null;
  lat?: number | null;
  lng?: number | null;
}): string {
  if (place.maps_url && /^https?:\/\//i.test(place.maps_url)) {
    return place.maps_url;
  }

  return getOpenStreetMapUrl({
    lat: place.lat,
    lng: place.lng,
    name: place.name,
    location: place.location,
    city: place.city,
    country: place.country,
  });
}

/**
 * Generate an OpenStreetMap embed iframe URL for place detail previews
 */
export function getOpenStreetMapEmbedUrl(params: {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
}): string | null {
  if (params.lat == null || params.lng == null) return null;

  const lat = params.lat;
  const lng = params.lng;
  const delta = 0.008; // ~800m bounding box
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
