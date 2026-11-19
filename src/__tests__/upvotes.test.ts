import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getLocalUpvotedPlaces,
  isPlaceUpvotedLocally,
  toggleLocalPlaceUpvote,
} from '@/lib/upvotes';

describe('Local Storage Upvotes Long Memory', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        store[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    };

    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('returns empty set when no places are stored', () => {
    const places = getLocalUpvotedPlaces();
    expect(places.size).toBe(0);
    expect(isPlaceUpvotedLocally('place-123')).toBe(false);
  });

  it('adds place to local storage on first upvote', () => {
    const nextState = toggleLocalPlaceUpvote('place-123', 'tokyo-cafe');
    expect(nextState).toBe(true);
    expect(isPlaceUpvotedLocally('place-123')).toBe(true);
    expect(isPlaceUpvotedLocally('tokyo-cafe')).toBe(true);
  });

  it('removes place from local storage on toggle off', () => {
    toggleLocalPlaceUpvote('place-123', 'tokyo-cafe');
    expect(isPlaceUpvotedLocally('place-123')).toBe(true);

    const toggledOff = toggleLocalPlaceUpvote('place-123', 'tokyo-cafe');
    expect(toggledOff).toBe(false);
    expect(isPlaceUpvotedLocally('place-123')).toBe(false);
    expect(isPlaceUpvotedLocally('tokyo-cafe')).toBe(false);
  });

  it('handles multiple places independently', () => {
    toggleLocalPlaceUpvote('place-a');
    toggleLocalPlaceUpvote('place-b');

    expect(isPlaceUpvotedLocally('place-a')).toBe(true);
    expect(isPlaceUpvotedLocally('place-b')).toBe(true);
    expect(isPlaceUpvotedLocally('place-c')).toBe(false);

    toggleLocalPlaceUpvote('place-a');
    expect(isPlaceUpvotedLocally('place-a')).toBe(false);
    expect(isPlaceUpvotedLocally('place-b')).toBe(true);
  });
});
