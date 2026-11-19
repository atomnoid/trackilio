/**
 * Local Storage persistent memory for upvoted places.
 * Enables any user on the internet without an account to upvote places and
 * keep their upvote state remembered across sessions, reloads, and visits.
 */

const STORAGE_KEY = 'trackilio_upvoted_places_v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage;
  }
  return null;
}

export function getLocalUpvotedPlaces(): Set<string> {
  const storage = getStorage();
  if (!storage) return new Set();

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter(Boolean));
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return new Set(Object.keys(parsed).filter((k) => Boolean((parsed as Record<string, boolean>)[k])));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

export function isPlaceUpvotedLocally(placeIdOrSlug?: string | null): boolean {
  if (!placeIdOrSlug) return false;
  const set = getLocalUpvotedPlaces();
  return set.has(placeIdOrSlug);
}

export function toggleLocalPlaceUpvote(placeId: string, alternateIdOrSlug?: string | null): boolean {
  if (!placeId) return false;
  const storage = getStorage();
  if (!storage) return false;

  try {
    const set = getLocalUpvotedPlaces();
    const isCurrentlyUpvoted = set.has(placeId) || (alternateIdOrSlug ? set.has(alternateIdOrSlug) : false);
    const nextState = !isCurrentlyUpvoted;

    if (nextState) {
      set.add(placeId);
      if (alternateIdOrSlug) set.add(alternateIdOrSlug);
    } else {
      set.delete(placeId);
      if (alternateIdOrSlug) set.delete(alternateIdOrSlug);
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));

    // Synchronize all mounted cards across the page in real-time
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(
          new CustomEvent('trackilio_upvote_changed', {
            detail: { placeId, alternateIdOrSlug, upvoted: nextState },
          })
        );
      } catch {
        // CustomEvent might not be supported in some environments
      }
    }

    return nextState;
  } catch (err) {
    console.warn('Could not persist upvote to localStorage:', err);
    return false;
  }
}
