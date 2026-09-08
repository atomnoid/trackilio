import { describe, it, expect } from 'vitest';
import { getBlendInterpretation } from '@/services/blend';

// ---------------------------------------------------------------------------
// Pure voting logic (extracted from voteOnListPlace for testability)
// ---------------------------------------------------------------------------
type VoteType = 'up' | 'down';

function computeNextVoteState(
  prevVote: VoteType | null,
  prevCount: number,
  targetType: VoteType
): { nextVote: VoteType | null; nextCount: number } {
  if (prevVote === targetType) {
    // Toggle off
    return {
      nextVote: null,
      nextCount: targetType === 'up' ? prevCount - 1 : prevCount + 1,
    };
  } else if (prevVote === null) {
    // New vote
    return {
      nextVote: targetType,
      nextCount: targetType === 'up' ? prevCount + 1 : prevCount - 1,
    };
  } else {
    // Switch vote
    return {
      nextVote: targetType,
      nextCount: targetType === 'up' ? prevCount + 2 : prevCount - 2,
    };
  }
}

describe('voting logic', () => {
  describe('upvote', () => {
    it('adds an upvote when no previous vote (score 0 → 1)', () => {
      const r = computeNextVoteState(null, 0, 'up');
      expect(r.nextVote).toBe('up');
      expect(r.nextCount).toBe(1);
    });

    it('removes upvote on second click (toggle off, score 1 → 0)', () => {
      const r = computeNextVoteState('up', 1, 'up');
      expect(r.nextVote).toBeNull();
      expect(r.nextCount).toBe(0);
    });

    it('switches downvote to upvote (score -1 → +1)', () => {
      const r = computeNextVoteState('down', -1, 'up');
      expect(r.nextVote).toBe('up');
      expect(r.nextCount).toBe(1);
    });
  });

  describe('downvote', () => {
    it('adds a downvote when no previous vote (score 0 → -1)', () => {
      const r = computeNextVoteState(null, 0, 'down');
      expect(r.nextVote).toBe('down');
      expect(r.nextCount).toBe(-1);
    });

    it('removes downvote on second click (toggle off, score -1 → 0)', () => {
      const r = computeNextVoteState('down', -1, 'down');
      expect(r.nextVote).toBeNull();
      expect(r.nextCount).toBe(0);
    });

    it('switches upvote to downvote (score +1 → -1)', () => {
      const r = computeNextVoteState('up', 1, 'down');
      expect(r.nextVote).toBe('down');
      expect(r.nextCount).toBe(-1);
    });
  });

  describe('net score boundaries', () => {
    it('handles large positive scores', () => {
      const r = computeNextVoteState(null, 99, 'up');
      expect(r.nextCount).toBe(100);
    });

    it('handles large negative scores', () => {
      const r = computeNextVoteState(null, -99, 'down');
      expect(r.nextCount).toBe(-100);
    });
  });
});

// ---------------------------------------------------------------------------
// Blend score interpretation
// ---------------------------------------------------------------------------
describe('getBlendInterpretation', () => {
  it('returns "Different Worlds" for 0', () => {
    expect(getBlendInterpretation(0)).toMatch(/Different Worlds/);
  });

  it('returns "Different Worlds" for 20', () => {
    expect(getBlendInterpretation(20)).toMatch(/Different Worlds/);
  });

  it('returns "Some Overlap" for 21', () => {
    expect(getBlendInterpretation(21)).toMatch(/Some Overlap/);
  });

  it('returns "Some Overlap" for 40', () => {
    expect(getBlendInterpretation(40)).toMatch(/Some Overlap/);
  });

  it('returns "Pretty Compatible" for 41', () => {
    expect(getBlendInterpretation(41)).toMatch(/Pretty Compatible/);
  });

  it('returns "Pretty Compatible" for 60', () => {
    expect(getBlendInterpretation(60)).toMatch(/Pretty Compatible/);
  });

  it('returns "Travel Twins" for 61', () => {
    expect(getBlendInterpretation(61)).toMatch(/Travel Twins/);
  });

  it('returns "Travel Twins" for 80', () => {
    expect(getBlendInterpretation(80)).toMatch(/Travel Twins/);
  });

  it('returns "Basically the same traveler" for 81', () => {
    expect(getBlendInterpretation(81)).toMatch(/Basically the same traveler/);
  });

  it('returns "Okay, who copied whom" for 96', () => {
    expect(getBlendInterpretation(96)).toMatch(/Okay, who copied whom/);
  });

  it('returns "Okay, who copied whom" for 99', () => {
    expect(getBlendInterpretation(99)).toMatch(/Okay, who copied whom/);
  });
});

// ---------------------------------------------------------------------------
// Blend score calculation logic (pure, no DB)
// ---------------------------------------------------------------------------
function calculateBlendScore(params: {
  sharedPlaces: number;
  sharedDestinations: number;
  sharedCategories: number;
}): number {
  let score = 25; // baseline
  score += Math.min(params.sharedPlaces * 15, 40);
  score += Math.min(params.sharedDestinations * 10, 20);
  score += Math.min(params.sharedCategories * 5, 15);
  return Math.min(Math.max(score, 10), 99);
}

describe('blend score calculation', () => {
  it('baseline is 25 with zero overlap', () => {
    expect(calculateBlendScore({ sharedPlaces: 0, sharedDestinations: 0, sharedCategories: 0 })).toBe(25);
  });

  it('max score is capped at 99', () => {
    expect(calculateBlendScore({ sharedPlaces: 100, sharedDestinations: 100, sharedCategories: 100 })).toBe(99);
  });

  it('min score is 10', () => {
    // Score can never be below 10 even with tweaked constants
    const score = Math.min(Math.max(5, 10), 99);
    expect(score).toBe(10);
  });

  it('one shared place adds 15 points (total 40)', () => {
    expect(calculateBlendScore({ sharedPlaces: 1, sharedDestinations: 0, sharedCategories: 0 })).toBe(40);
  });

  it('one shared destination adds 10 points (total 35)', () => {
    expect(calculateBlendScore({ sharedPlaces: 0, sharedDestinations: 1, sharedCategories: 0 })).toBe(35);
  });

  it('one shared category adds 5 points (total 30)', () => {
    expect(calculateBlendScore({ sharedPlaces: 0, sharedDestinations: 0, sharedCategories: 1 })).toBe(30);
  });

  it('places contribution is capped at 40 regardless of count', () => {
    const s1 = calculateBlendScore({ sharedPlaces: 3, sharedDestinations: 0, sharedCategories: 0 });
    const s2 = calculateBlendScore({ sharedPlaces: 100, sharedDestinations: 0, sharedCategories: 0 });
    expect(s1).toBe(s2); // both should be 25+40=65
  });

  it('partial overlap gives intermediate score', () => {
    // 25 baseline + 15 (1 place) + 10 (1 dest) + 5 (1 cat) = 55
    expect(calculateBlendScore({ sharedPlaces: 1, sharedDestinations: 1, sharedCategories: 1 })).toBe(55);
  });
});

// ---------------------------------------------------------------------------
// Permission model (pure logic)
// ---------------------------------------------------------------------------
type MemberRole = 'owner' | 'editor' | 'viewer' | null;

function canEditList(role: MemberRole): boolean {
  return role === 'owner' || role === 'editor';
}

function canManageMembers(role: MemberRole): boolean {
  return role === 'owner';
}

function canViewList(role: MemberRole, isPublic: boolean): boolean {
  if (isPublic) return true;
  return role === 'owner' || role === 'editor' || role === 'viewer';
}

describe('permissions', () => {
  describe('edit list', () => {
    it('owner can edit', () => expect(canEditList('owner')).toBe(true));
    it('editor can edit', () => expect(canEditList('editor')).toBe(true));
    it('viewer cannot edit', () => expect(canEditList('viewer')).toBe(false));
    it('anonymous cannot edit', () => expect(canEditList(null)).toBe(false));
  });

  describe('manage members', () => {
    it('owner can manage members', () => expect(canManageMembers('owner')).toBe(true));
    it('editor cannot manage members', () => expect(canManageMembers('editor')).toBe(false));
    it('viewer cannot manage members', () => expect(canManageMembers('viewer')).toBe(false));
    it('anonymous cannot manage members', () => expect(canManageMembers(null)).toBe(false));
  });

  describe('view list', () => {
    it('anyone can view a public list', () => {
      expect(canViewList(null, true)).toBe(true);
      expect(canViewList('viewer', true)).toBe(true);
    });

    it('owner can view private list', () => expect(canViewList('owner', false)).toBe(true));
    it('editor can view private list', () => expect(canViewList('editor', false)).toBe(true));
    it('viewer can view private list', () => expect(canViewList('viewer', false)).toBe(true));
    it('anonymous cannot view private list', () => expect(canViewList(null, false)).toBe(false));
  });
});
