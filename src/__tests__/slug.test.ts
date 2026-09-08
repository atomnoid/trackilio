import { describe, it, expect } from 'vitest';
import { generateSlug } from '@/services/lists';

describe('generateSlug', () => {
  it('converts a normal title to a slug', () => {
    expect(generateSlug('My Japan Trip')).toBe('my-japan-trip');
  });

  it('lowercases everything', () => {
    expect(generateSlug('KYOTO CAFÉS')).toBe('kyoto-cafs');
  });

  it('strips special characters', () => {
    expect(generateSlug('Paris! @#$% Guide')).toBe('paris-guide');
  });

  it('collapses multiple spaces', () => {
    expect(generateSlug('London   Hidden   Gems')).toBe('london-hidden-gems');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Tokyo -- Night -- Spots')).toBe('tokyo-night-spots');
  });

  it('strips leading and trailing hyphens', () => {
    expect(generateSlug('  -  City Guide -  ')).toBe('city-guide');
  });

  it('returns fallback for empty string', () => {
    expect(generateSlug('')).toBe('wanderlist');
  });

  it('returns fallback for whitespace-only string', () => {
    expect(generateSlug('   ')).toBe('wanderlist');
  });

  it('returns fallback for special-chars-only string', () => {
    expect(generateSlug('!@#$%^&*()')).toBe('wanderlist');
  });

  it('handles unicode characters by stripping them', () => {
    // Non-latin chars are stripped; latin chars survive
    expect(generateSlug('Café de Paris')).toBe('caf-de-paris');
  });

  it('handles single word', () => {
    expect(generateSlug('Tokyo')).toBe('tokyo');
  });

  it('preserves existing hyphens between words', () => {
    expect(generateSlug('must-visit spots')).toBe('must-visit-spots');
  });
});
