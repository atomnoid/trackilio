import { describe, it, expect } from 'vitest';
import { generatePlaceSlug } from '@/services/places';
import {
  getOpenStreetMapUrl,
  getOpenStreetMapEmbedUrl,
  getExternalMapUrl,
} from '@/lib/maps';

describe('generatePlaceSlug', () => {
  it('converts place name and location to clean slug', () => {
    expect(generatePlaceSlug('Flurys Bakery', 'Kolkata')).toBe('flurys-bakery-kolkata');
  });

  it('handles place name without location', () => {
    expect(generatePlaceSlug('Blue Tokai Coffee')).toBe('blue-tokai-coffee');
  });

  it('strips special characters and symbols', () => {
    expect(generatePlaceSlug('Café de L\'Ambre & Co.', 'Tokyo!')).toBe('caf-de-lambre-co-tokyo');
  });

  it('collapses multiple hyphens and whitespace', () => {
    expect(generatePlaceSlug('  The   Grand   Hotel  ', 'Paris')).toBe('the-grand-hotel-paris');
  });

  it('falls back to "place" if string is empty', () => {
    expect(generatePlaceSlug('')).toBe('place');
  });
});

describe('Map Provider Abstraction', () => {
  describe('getOpenStreetMapUrl', () => {
    it('generates coordinate URL when lat and lng are provided', () => {
      const url = getOpenStreetMapUrl({ lat: 22.5726, lng: 88.3639 });
      expect(url).toContain('mlat=22.5726');
      expect(url).toContain('mlon=88.3639');
    });

    it('generates query search URL when coordinates are absent', () => {
      const url = getOpenStreetMapUrl({ name: 'Indian Museum', city: 'Kolkata', country: 'India' });
      expect(url).toContain('https://www.openstreetmap.org/search?query=');
      expect(url).toContain('Indian%20Museum');
    });
  });

  describe('getOpenStreetMapEmbedUrl', () => {
    it('returns valid embed iframe URL with bounding box when coords provided', () => {
      const embed = getOpenStreetMapEmbedUrl({ lat: 22.55, lng: 88.35 });
      expect(embed).not.toBeNull();
      expect(embed).toContain('openstreetmap.org/export/embed.html');
      expect(embed).toContain('marker=22.55%2C88.35');
    });

    it('returns null when coords are missing', () => {
      expect(getOpenStreetMapEmbedUrl({})).toBeNull();
    });
  });

  describe('getExternalMapUrl', () => {
    it('preserves existing valid maps_url', () => {
      const url = getExternalMapUrl({
        maps_url: 'https://maps.apple.com/?q=Kyoto',
        name: 'Kyoto Spot',
      });
      expect(url).toBe('https://maps.apple.com/?q=Kyoto');
    });

    it('generates openstreetmap fallback when maps_url is null', () => {
      const url = getExternalMapUrl({
        name: 'Peter Cat',
        city: 'Kolkata',
      });
      expect(url).toContain('openstreetmap.org/search');
    });
  });
});
