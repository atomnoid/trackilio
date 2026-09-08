/**
 * Pure utility functions for Blend score calculation.
 * These have NO server-side dependencies and can be imported in tests.
 */

export function getBlendInterpretation(score: number): string {
  if (score >= 96) return 'Okay, who copied whom? 🤨';
  if (score >= 81) return 'Basically the same traveler 😂';
  if (score >= 61) return 'Travel Twins 😎';
  if (score >= 41) return 'Pretty Compatible ✈️';
  if (score >= 21) return 'Some Overlap 👀';
  return 'Different Worlds 🌎';
}

export function calculateRawBlendScore(params: {
  sharedPlacesCount: number;
  sharedDestinationsCount: number;
  sharedCategoriesCount: number;
}): number {
  let score = 25; // Baseline interest score
  score += Math.min(params.sharedPlacesCount * 15, 40);
  score += Math.min(params.sharedDestinationsCount * 10, 20);
  score += Math.min(params.sharedCategoriesCount * 5, 15);
  return Math.min(Math.max(score, 10), 99);
}
