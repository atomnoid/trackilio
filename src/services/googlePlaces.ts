import {
  GooglePlaceDetailsResponse,
  GooglePlacePhotosMetaResult,
  GooglePhotoMeta,
} from '@/types/googlePlaces';

/**
 * Server-side service for Google Places API (New) integration.
 * NEVER exposes GOOGLE_MAPS_API_KEY to the client.
 * NEVER stores photo resource names or photo files in Supabase.
 */

function getApiKey(): string | null {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key.trim().length === 0) {
    return null;
  }
  return key.trim();
}

/**
 * Fetch Google Place photos metadata (at most 3) for a given googlePlaceId.
 * Uses Places API (New) Place Details endpoint with explicit field mask "id,photos".
 */
export async function getGooglePlacePhotosMeta(
  googlePlaceId: string
): Promise<GooglePlacePhotosMetaResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      googlePlaceId,
      photos: [],
      error: 'GOOGLE_MAPS_API_KEY is not configured on the server',
      statusCode: 500,
    };
  }

  if (!googlePlaceId || googlePlaceId.trim().length === 0) {
    return {
      success: false,
      googlePlaceId: '',
      photos: [],
      error: 'Missing googlePlaceId',
      statusCode: 400,
    };
  }

  const cleanId = googlePlaceId.trim();
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanId)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,photos',
      },
      // Ensure photo resource names are retrieved fresh and not cached permanently by Next.js
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMsg = `Google Places API error (Status ${response.status})`;
      try {
        const errJson = (await response.json()) as GooglePlaceDetailsResponse;
        if (errJson.error?.message) {
          errorMsg = errJson.error.message;
        }
      } catch {
        // ignore parse error
      }
      return {
        success: false,
        googlePlaceId: cleanId,
        photos: [],
        error: errorMsg,
        statusCode: response.status,
      };
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse;
    const rawPhotos = data.photos ?? [];
    const sliced = rawPhotos.slice(0, 3);

    const photos: GooglePhotoMeta[] = sliced.map((p, idx) => ({
      index: idx,
      widthPx: p.widthPx,
      heightPx: p.heightPx,
      authorAttributions: (p.authorAttributions ?? []).map((attr) => ({
        displayName: attr.displayName || 'Google User',
        uri: attr.uri || undefined,
        photoUri: attr.photoUri || undefined,
      })),
    }));

    return {
      success: true,
      googlePlaceId: cleanId,
      photos,
    };
  } catch (err: any) {
    return {
      success: false,
      googlePlaceId: cleanId,
      photos: [],
      error: err?.message || 'Failed to fetch Google Place details',
      statusCode: 500,
    };
  }
}

/**
 * Resolves a Google Place ID by text query (e.g. place name or address) using Google Places API (New) Text Search.
 */
export async function searchGooglePlaceId(query: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey || !query || query.trim().length === 0) return null;

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName',
      },
      body: JSON.stringify({ textQuery: query.trim() }),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { places?: Array<{ id?: string }> };
    if (data.places && data.places.length > 0 && data.places[0].id) {
      return data.places[0].id;
    }
  } catch {
    // ignore fetch error
  }
  return null;
}

/**
 * Fetch a fresh photo URI for a given googlePlaceId and photo index (0, 1, or 2).
 * Obtains the temporary photo resource name from Google Place Details (New),
 * then requests the media URI from Google Places API (New) Photos Media endpoint.
 */
export async function getGooglePlacePhotoUri(
  googlePlaceId: string,
  photoIndex: number,
  maxWidthPx: number = 1200
): Promise<{ photoUri: string | null; error?: string; statusCode?: number }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { photoUri: null, error: 'Missing GOOGLE_MAPS_API_KEY', statusCode: 500 };
  }

  if (photoIndex < 0 || photoIndex > 2) {
    return { photoUri: null, error: 'Invalid photo index (must be 0-2)', statusCode: 400 };
  }

  let cleanId = googlePlaceId ? googlePlaceId.trim() : '';

  if (cleanId.startsWith('query:')) {
    const queryText = cleanId.replace(/^query:/, '');
    const foundId = await searchGooglePlaceId(queryText);
    if (!foundId) {
      return { photoUri: null, error: 'Could not resolve place ID from query', statusCode: 404 };
    }
    cleanId = foundId;
  }

  const placeUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanId)}`;

  try {
    // Step 1: Fetch fresh Place Details for photo name
    const detailsRes = await fetch(placeUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,photos',
      },
      cache: 'no-store',
    });

    if (!detailsRes.ok) {
      return { photoUri: null, error: 'Place details fetch failed', statusCode: detailsRes.status };
    }

    const detailsData = (await detailsRes.json()) as GooglePlaceDetailsResponse;
    const rawPhotos = detailsData.photos ?? [];

    if (!rawPhotos[photoIndex] || !rawPhotos[photoIndex].name) {
      return { photoUri: null, error: 'Photo not found for this place index', statusCode: 404 };
    }

    const photoName = rawPhotos[photoIndex].name; // format: "places/{place_id}/photos/{photo_id}"
    const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&skipHttpRedirect=true&key=${apiKey}`;

    // Step 2: Call Google Places Photos (New) endpoint
    const mediaRes = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
      cache: 'no-store',
    });

    if (!mediaRes.ok) {
      return { photoUri: null, error: 'Photo media fetch failed', statusCode: mediaRes.status };
    }

    const mediaData = (await mediaRes.json()) as { photoUri?: string; name?: string };
    if (!mediaData.photoUri) {
      return { photoUri: null, error: 'photoUri missing from Google response', statusCode: 500 };
    }

    return { photoUri: mediaData.photoUri };
  } catch (err: any) {
    return { photoUri: null, error: err?.message || 'Network error fetching photo media', statusCode: 500 };
  }
}

/**
 * Fetch fresh Google photo media binary buffer server-side.
 * Allows Trackilio API route to serve image bytes directly with image/* Content-Type.
 */
export async function getGooglePlacePhotoBuffer(
  googlePlaceId: string,
  photoIndex: number,
  maxWidthPx: number = 1200
): Promise<{ buffer: ArrayBuffer | null; contentType: string; error?: string; statusCode?: number }> {
  const uriResult = await getGooglePlacePhotoUri(googlePlaceId, photoIndex, maxWidthPx);
  if (!uriResult.photoUri) {
    return {
      buffer: null,
      contentType: 'application/json',
      error: uriResult.error || 'Photo URI not found',
      statusCode: uriResult.statusCode || 404,
    };
  }

  try {
    const cdnRes = await fetch(uriResult.photoUri, { cache: 'no-store' });
    if (!cdnRes.ok) {
      return {
        buffer: null,
        contentType: 'application/json',
        error: 'Failed to fetch image binary from Google CDN',
        statusCode: cdnRes.status,
      };
    }

    const contentType = cdnRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await cdnRes.arrayBuffer();

    return {
      buffer,
      contentType,
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      buffer: null,
      contentType: 'application/json',
      error: err?.message || 'Error downloading image buffer',
      statusCode: 500,
    };
  }
}
