import { describe, it, expect } from 'vitest';
import {
  normalizeQuery,
  extractNumber,
  detectCategory,
  detectLocation,
  detectRankingIntent,
  extractMeaningfulTerms,
  parseSearchIntent,
} from '@/services/search.utils';

describe('search.utils - pure search logic', () => {
  describe('normalizeQuery', () => {
    it('lowercases and trims extra whitespace', () => {
      expect(normalizeQuery('  Best   Cafes in   Kolkata  ')).toBe('best cafes in kolkata');
    });
  });

  describe('extractNumber', () => {
    it('extracts numeric digits', () => {
      expect(extractNumber('top 10 cafes')).toBe(10);
      expect(extractNumber('top 5 places in Goa')).toBe(5);
    });

    it('extracts word numbers', () => {
      expect(extractNumber('top ten best cafes')).toBe(10);
      expect(extractNumber('top three restaurants')).toBe(3);
    });

    it('returns null when no number is present', () => {
      expect(extractNumber('best cafes in goa')).toBeNull();
    });
  });

  describe('detectCategory', () => {
    it('detects cafe category synonyms', () => {
      expect(detectCategory('best cafe in park street')).toBe('cafe');
      expect(detectCategory('specialty coffee spots')).toBe('cafe');
      expect(detectCategory('top cafes in tokyo')).toBe('cafe');
      expect(detectCategory('matcha latte bakery')).toBe('cafe');
    });

    it('detects restaurant / food categories', () => {
      expect(detectCategory('great pizza restaurants')).toBe('restaurant');
      expect(detectCategory('fine dining and bistro')).toBe('restaurant');
      expect(detectCategory('street food eateries')).toBe('restaurant');
    });

    it('detects hidden gems', () => {
      expect(detectCategory('secret spots and hidden gems')).toBe('hidden gem');
    });

    it('detects nightlife & bars', () => {
      expect(detectCategory('cocktails at pub or rooftop bar')).toBe('bar');
    });

    it('detects sightseeing and nature', () => {
      expect(detectCategory('historical museum and monuments')).toBe('sightseeing');
      expect(detectCategory('scenic hiking trail and waterfalls')).toBe('hiking');
    });
  });

  describe('detectLocation', () => {
    it('detects "in <city>" patterns', () => {
      expect(detectLocation('top cafes in kolkata')).toBe('kolkata');
      expect(detectLocation('sunset spots in goa')).toBe('goa');
      expect(detectLocation('ramen bars in tokyo')).toBe('tokyo');
    });

    it('detects direct city mentions from popular cities', () => {
      expect(detectLocation('kolkata best biryani')).toBe('kolkata');
      expect(detectLocation('paris romantic dining')).toBe('paris');
    });
  });

  describe('detectRankingIntent', () => {
    it('detects "top" ranking as popular', () => {
      expect(detectRankingIntent('top 10 cafes')).toBe('popular');
    });

    it('detects "best" ranking as popular', () => {
      expect(detectRankingIntent('best coffee in town')).toBe('popular');
    });

    it('detects "trending" and "latest"', () => {
      expect(detectRankingIntent('trending places')).toBe('trending');
      expect(detectRankingIntent('latest new lists')).toBe('trending');
    });
  });

  describe('extractMeaningfulTerms', () => {
    it('removes stopwords and structural search words', () => {
      const terms = extractMeaningfulTerms('top ten best cafes in kolkata with great wifi');
      expect(terms).toContain('wifi');
      expect(terms).not.toContain('in');
      expect(terms).not.toContain('with');
    });
  });

  describe('parseSearchIntent (integration)', () => {
    it('correctly parses "top ten best cafes in kolkata"', () => {
      const intent = parseSearchIntent('top ten best cafes in kolkata');
      expect(intent.rawQuery).toBe('top ten best cafes in kolkata');
      expect(intent.category).toBe('cafe');
      expect(intent.location?.toLowerCase()).toBe('kolkata');
      expect(intent.rankingIntent).toBe('popular');
      expect(intent.limit).toBe(10);
    });

    it('correctly parses "hidden gems in goa"', () => {
      const intent = parseSearchIntent('hidden gems in goa');
      expect(intent.category).toBe('hidden gem');
      expect(intent.location?.toLowerCase()).toBe('goa');
    });

    it('handles traveler usernames without corrupting', () => {
      const intent = parseSearchIntent('@alex_wanderer');
      expect(intent.rawQuery).toBe('@alex_wanderer');
    });
  });
});
