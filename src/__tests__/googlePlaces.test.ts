import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractGooglePlaceId } from '@/services/places';
import {
  getGooglePlacePhotosMeta,
  getGooglePlacePhotoUri,
} from '@/services/googlePlaces';

describe('extractGooglePlaceId', () => {
  it('returns direct googlePlaceId if provided', () => {
    expect(
      extractGooglePlaceId(
        'https://maps.google.com/?q=Paris',
        'ChIJN1t_tDeuEmsRUsoyG83frY4'
      )
    ).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4');
  });

  it('extracts place_id from Google Maps URL parameter', () => {
    expect(
      extractGooglePlaceId(
        'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4'
      )
    ).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4');
  });

  it('extracts ChIJ pattern from Google Maps URL', () => {
    expect(
      extractGooglePlaceId(
        'https://maps.google.com/maps?cid=123&ftid=ChIJN1t_tDeuEmsRUsoyG83frY4'
      )
    ).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4');
  });

  it('returns null if no place ID is present or URL is invalid', () => {
    expect(extractGooglePlaceId('https://maps.google.com/?q=Paris')).toBeNull();
    expect(extractGooglePlaceId(null)).toBeNull();
  });
});

describe('googlePlaces service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns error result when GOOGLE_MAPS_API_KEY is missing', async () => {
    const originalKey = process.env.GOOGLE_MAPS_API_KEY;
    delete process.env.GOOGLE_MAPS_API_KEY;

    const res = await getGooglePlacePhotosMeta('ChIJN1t_tDeuEmsRUsoyG83frY4');
    expect(res.success).toBe(false);
    expect(res.error).toContain('GOOGLE_MAPS_API_KEY is not configured');

    const photoRes = await getGooglePlacePhotoUri('ChIJN1t_tDeuEmsRUsoyG83frY4', 0);
    expect(photoRes.photoUri).toBeNull();
    expect(photoRes.error).toContain('Missing GOOGLE_MAPS_API_KEY');

    process.env.GOOGLE_MAPS_API_KEY = originalKey;
  });

  it('parses photo metadata correctly with authorAttributions and caps at 3 photos', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

    const mockResponse = {
      id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      photos: [
        {
          name: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/1',
          widthPx: 1000,
          heightPx: 800,
          authorAttributions: [
            { displayName: 'Alice', uri: 'https://maps.google.com/contrib/1' },
          ],
        },
        {
          name: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/2',
          widthPx: 1200,
          heightPx: 900,
          authorAttributions: [{ displayName: 'Bob' }],
        },
        {
          name: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/3',
          widthPx: 800,
          heightPx: 600,
        },
        {
          name: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/4',
          widthPx: 500,
          heightPx: 500,
        },
      ],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const res = await getGooglePlacePhotosMeta('ChIJN1t_tDeuEmsRUsoyG83frY4');
    expect(res.success).toBe(true);
    expect(res.photos.length).toBe(3);
    expect(res.photos[0].authorAttributions[0].displayName).toBe('Alice');
    expect(res.photos[1].authorAttributions[0].displayName).toBe('Bob');
    expect(res.photos[2].authorAttributions.length).toBe(0);
  });

  it('handles Google Places API errors gracefully', async () => {
    process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({
        error: { code: 403, message: 'The provided API key is invalid.' },
      }),
    } as Response);

    const res = await getGooglePlacePhotosMeta('ChIJN1t_tDeuEmsRUsoyG83frY4');
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(403);
    expect(res.error).toBe('The provided API key is invalid.');
  });
});
