/**
 * search.utils.ts
 * Pure deterministic search intent parser — NO Supabase dependencies.
 * All functions are unit-testable in isolation.
 */

import type { ParsedSearchIntent } from '@/types/database';

// ---------------------------------------------------------------------------
// Stop words — removed before extracting meaning
// ---------------------------------------------------------------------------
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'at', 'on', 'near', 'by', 'around',
  'for', 'to', 'of', 'and', 'or', 'with', 'is', 'are', 'was',
  'me', 'my', 'i', 'us', 'we', 'you', 'it', 'its',
  'things', 'places', 'spots', 'location', 'area', 'city',
  'visit', 'go', 'see', 'find', 'search', 'show', 'tell',
]);

// ---------------------------------------------------------------------------
// Ranking intent keywords → signal
// ---------------------------------------------------------------------------
const RANKING_KEYWORDS: Record<string, 'popular' | 'trending' | 'rated'> = {
  best: 'popular',
  top: 'popular',
  popular: 'popular',
  famous: 'popular',
  recommended: 'popular',
  loved: 'popular',
  'must visit': 'popular',
  'worth visiting': 'popular',
  'must see': 'popular',
  good: 'rated',
  great: 'rated',
  'highly rated': 'rated',
  'well rated': 'rated',
  trending: 'trending',
  hot: 'trending',
  viral: 'trending',
  latest: 'trending',
  new: 'trending',
  recent: 'trending',
};

// ---------------------------------------------------------------------------
// Number words → integers
// ---------------------------------------------------------------------------
const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  thirty: 30, fifty: 50, hundred: 100,
};

// ---------------------------------------------------------------------------
// Category synonym map → canonical internal category value
// ---------------------------------------------------------------------------
const CATEGORY_SYNONYMS: Record<string, string> = {
  // Café
  cafe: 'cafe', cafes: 'cafe', café: 'cafe', cafés: 'cafe',
  coffee: 'cafe', 'coffee shop': 'cafe', 'coffee shops': 'cafe',
  espresso: 'cafe', latte: 'cafe', 'tea shop': 'cafe',

  // Restaurant
  restaurant: 'restaurant', restaurants: 'restaurant',
  dining: 'restaurant', dine: 'restaurant',
  eatery: 'restaurant', eateries: 'restaurant',
  food: 'restaurant', eat: 'restaurant', lunch: 'restaurant',
  dinner: 'restaurant', brunch: 'restaurant',

  // Bar & Nightlife
  bar: 'bar', bars: 'bar', pub: 'bar', pubs: 'bar',
  nightlife: 'bar', club: 'bar', clubs: 'bar',
  cocktail: 'bar', cocktails: 'bar', drinks: 'bar',

  // Date spots
  date: 'date spot', 'date spot': 'date spot', 'date spots': 'date spot',
  romantic: 'date spot', romance: 'date spot',

  // Nature & Parks
  nature: 'nature', park: 'nature', parks: 'nature',
  garden: 'nature', gardens: 'nature', forest: 'nature',
  outdoor: 'nature', outdoors: 'nature', lake: 'nature',
  beach: 'nature', beaches: 'nature',

  // Hiking
  hike: 'hiking', hiking: 'hiking', trek: 'hiking', trekking: 'hiking',
  trail: 'hiking', trails: 'hiking', mountain: 'hiking',

  // Sightseeing
  sightseeing: 'sightseeing', sights: 'sightseeing',
  tourist: 'sightseeing', tourism: 'sightseeing',
  landmark: 'sightseeing', landmarks: 'sightseeing',
  monument: 'sightseeing', monuments: 'sightseeing',
  historical: 'sightseeing', heritage: 'sightseeing',
  museum: 'sightseeing', museums: 'sightseeing',
  temple: 'sightseeing', temples: 'sightseeing',

  // Shopping
  shopping: 'shopping', shop: 'shopping', shops: 'shopping',
  market: 'shopping', markets: 'shopping', mall: 'shopping',
  boutique: 'shopping', boutiques: 'shopping',

  // Weekend trips
  'weekend trip': 'weekend trip', 'weekend trips': 'weekend trip',
  'day trip': 'weekend trip', 'day trips': 'weekend trip',
  getaway: 'weekend trip', getaways: 'weekend trip',

  // Hidden gems
  'hidden gem': 'hidden gem', 'hidden gems': 'hidden gem',
  underrated: 'hidden gem', secret: 'hidden gem',
  offbeat: 'hidden gem', 'off beat': 'hidden gem',
};

// ---------------------------------------------------------------------------
// Known location dictionary (cities, countries, regions)
// Grows dynamically via DB — this is the static seed set for MVP
// ---------------------------------------------------------------------------
const KNOWN_LOCATIONS = new Set([
  // India
  'kolkata', 'calcutta', 'mumbai', 'bombay', 'delhi', 'new delhi',
  'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'madras',
  'goa', 'jaipur', 'agra', 'varanasi', 'pune', 'ahmedabad',
  'kochi', 'cochin', 'mysore', 'mysuru', 'chandigarh',
  'pondicherry', 'puducherry', 'shimla', 'manali', 'ladakh',
  'darjeeling', 'gangtok', 'ooty', 'kodaikanal', 'munnar',
  'india',
  // Japan
  'tokyo', 'kyoto', 'osaka', 'hiroshima', 'nara', 'sapporo',
  'fukuoka', 'yokohama', 'nagoya', 'japan',
  // Europe
  'paris', 'london', 'rome', 'amsterdam', 'barcelona', 'madrid',
  'berlin', 'prague', 'vienna', 'lisbon', 'athens', 'zurich',
  'brussels', 'stockholm', 'copenhagen', 'milan',
  // SE Asia / Asia
  'bali', 'ubud', 'bangkok', 'singapore', 'hongkong', 'hong kong',
  'seoul', 'busan', 'taipei', 'shanghai', 'beijing', 'hanoi',
  'ho chi minh', 'saigon', 'phuket', 'chiang mai', 'kuala lumpur',
  'cambodia', 'phnom penh', 'siem reap', 'yangon', 'mandalay',
  'indonesia', 'thailand', 'vietnam', 'cambodia', 'malaysia',
  'philippines', 'manila', 'china', 'korea',
  // Americas
  'new york', 'nyc', 'los angeles', 'la', 'san francisco', 'sf',
  'chicago', 'miami', 'boston', 'seattle', 'portland', 'denver',
  'mexico city', 'cancun', 'toronto', 'montreal', 'vancouver',
  'buenos aires', 'rio de janeiro', 'sao paulo',
  // Middle East / Africa
  'dubai', 'abu dhabi', 'istanbul', 'cairo', 'cape town',
  // Countries
  'france', 'italy', 'spain', 'germany', 'uk', 'usa', 'america',
  'australia', 'canada', 'brazil', 'nepal', 'sri lanka',
  'portugal', 'turkey', 'egypt', 'uae',
]);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a raw query: lowercase, trim, collapse spaces, strip non-semantic punctuation
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[!?.,;:'"()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract a numeric limit from query text.
 * Handles "top 10", "best 5", "top ten", "10 best", etc.
 */
export function extractNumber(normalized: string): number | null {
  // Try numeric digits first
  const digitMatch = normalized.match(/\b(\d+)\b/);
  if (digitMatch) {
    const n = parseInt(digitMatch[1], 10);
    if (n > 0 && n <= 200) return n;
  }
  // Try number words
  for (const [word, num] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(normalized)) {
      return num;
    }
  }
  return null;
}

/**
 * Detect a canonical category from query tokens.
 * Returns null if no category is detected.
 */
export function detectCategory(normalized: string): string | null {
  // Try multi-word phrases first (longest match wins)
  const multiWordPhrases = Object.keys(CATEGORY_SYNONYMS)
    .filter((k) => k.includes(' '))
    .sort((a, b) => b.length - a.length);

  for (const phrase of multiWordPhrases) {
    if (normalized.includes(phrase)) {
      return CATEGORY_SYNONYMS[phrase];
    }
  }

  // Try single word tokens
  const tokens = normalized.split(/\s+/);
  for (const token of tokens) {
    if (CATEGORY_SYNONYMS[token]) {
      return CATEGORY_SYNONYMS[token];
    }
  }

  return null;
}

/**
 * Detect a location from the normalized query.
 * Returns the raw detected location string (not canonical) for use in DB queries.
 */
export function detectLocation(normalized: string): string | null {
  // Try multi-word locations first
  const multiWord = Array.from(KNOWN_LOCATIONS)
    .filter((loc) => loc.includes(' '))
    .sort((a, b) => b.length - a.length);

  for (const loc of multiWord) {
    if (normalized.includes(loc)) return loc;
  }

  // Single word locations
  const tokens = normalized.split(/\s+/);
  for (const token of tokens) {
    if (KNOWN_LOCATIONS.has(token)) return token;
  }

  return null;
}

/**
 * Detect ranking intent from a normalized query.
 */
export function detectRankingIntent(
  normalized: string
): 'popular' | 'trending' | 'rated' | null {
  // Multi-word ranking phrases
  const multiPhrases = Object.keys(RANKING_KEYWORDS).filter((k) => k.includes(' '));
  for (const phrase of multiPhrases) {
    if (normalized.includes(phrase)) return RANKING_KEYWORDS[phrase];
  }
  // Single word
  const tokens = normalized.split(/\s+/);
  for (const token of tokens) {
    if (RANKING_KEYWORDS[token]) return RANKING_KEYWORDS[token];
  }
  return null;
}

/**
 * Remove stop words AND ranking/number words from token list,
 * leaving only the semantically meaningful search terms.
 */
export function extractMeaningfulTerms(normalized: string): string[] {
  const rankingWords = new Set(
    Object.keys(RANKING_KEYWORDS).flatMap((k) => k.split(' '))
  );
  const numberWords = new Set(Object.keys(NUMBER_WORDS));
  const allStopWords = new Set([
    ...STOP_WORDS,
    ...rankingWords,
    ...numberWords,
    // Generic location prepositions
    'hidden', 'gem', 'gems',
  ]);

  const tokens = normalized.split(/\s+/);
  return tokens.filter((t) => t.length > 1 && !allStopWords.has(t));
}

/**
 * Main entry point: parse a raw user query into a structured search intent.
 */
export function parseSearchIntent(raw: string): ParsedSearchIntent {
  if (!raw || !raw.trim()) {
    return {
      terms: [],
      category: null,
      location: null,
      rankingIntent: null,
      limit: null,
      rawQuery: '',
    };
  }

  const normalized = normalizeQuery(raw);
  const category = detectCategory(normalized);
  const location = detectLocation(normalized);
  const rankingIntent = detectRankingIntent(normalized);
  const limit = extractNumber(normalized);

  // Build meaningful terms — exclude detected location and category words
  // so they don't pollute the free-text search
  const locationTokens = location ? location.split(' ') : [];
  const categoryTokens = category
    ? Object.entries(CATEGORY_SYNONYMS)
        .filter(([, v]) => v === category)
        .flatMap(([k]) => k.split(' '))
    : [];

  const stopSet = new Set([
    ...Array.from(STOP_WORDS),
    ...locationTokens,
    ...categoryTokens,
    ...Object.keys(RANKING_KEYWORDS).flatMap((k) => k.split(' ')),
    ...Object.keys(NUMBER_WORDS),
  ]);

  const terms = normalized
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopSet.has(t));

  return {
    terms,
    category,
    location,
    rankingIntent,
    limit,
    rawQuery: normalized,
  };
}
