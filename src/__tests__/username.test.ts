import { describe, it, expect } from 'vitest';
import { sanitizeUsername, validateUsernameFormat, RESERVED_USERNAMES } from '@/lib/username';

describe('Username Utilities (Instagram Rules)', () => {
  describe('sanitizeUsername', () => {
    it('strips leading @ symbols', () => {
      expect(sanitizeUsername('@elena_travels')).toBe('elena_travels');
      expect(sanitizeUsername('@@@wanderer')).toBe('wanderer');
    });

    it('trims whitespace and converts to lowercase', () => {
      expect(sanitizeUsername('  Elena.Rostova  ')).toBe('elena.rostova');
      expect(sanitizeUsername('USER_123')).toBe('user_123');
    });

    it('handles empty input gracefully', () => {
      expect(sanitizeUsername('')).toBe('');
      expect(sanitizeUsername('   ')).toBe('');
    });
  });

  describe('validateUsernameFormat', () => {
    it('accepts valid usernames', () => {
      const validCases = [
        'elena',
        'elena_travels',
        'elena.rostova',
        'elena-wander',
        'user123',
        'a.b.c',
        'travel_twin_99',
        'x_1',
      ];

      for (const u of validCases) {
        const result = validateUsernameFormat(u);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
        expect(result.cleanUsername).toBe(u);
      }
    });

    it('rejects usernames that are too short (< 3 chars)', () => {
      const result = validateUsernameFormat('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('rejects usernames that are too long (> 30 chars)', () => {
      const longName = 'a'.repeat(31);
      const result = validateUsernameFormat(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot exceed 30 characters');
    });

    it('rejects special characters not allowed in Instagram rules', () => {
      const invalidChars = ['elena!travel', 'user@domain', 'travel#tag', 'wander$lust', 'space name'];
      for (const u of invalidChars) {
        const result = validateUsernameFormat(u);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it('rejects starting with period, underscore, or hyphen', () => {
      expect(validateUsernameFormat('.elena').valid).toBe(false);
      expect(validateUsernameFormat('_elena').valid).toBe(false);
      expect(validateUsernameFormat('-elena').valid).toBe(false);
    });

    it('rejects ending with period, underscore, or hyphen', () => {
      expect(validateUsernameFormat('elena.').valid).toBe(false);
      expect(validateUsernameFormat('elena_').valid).toBe(false);
      expect(validateUsernameFormat('elena-').valid).toBe(false);
    });

    it('rejects consecutive periods', () => {
      const result = validateUsernameFormat('elena..rostova');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('consecutive periods');
    });

    it('rejects reserved system keywords', () => {
      const reserved = ['admin', 'api', 'auth', 'blend', 'dashboard', 'settings', 'trackilio'];
      for (const r of reserved) {
        const result = validateUsernameFormat(r);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('reserved');
      }
    });
  });
});
