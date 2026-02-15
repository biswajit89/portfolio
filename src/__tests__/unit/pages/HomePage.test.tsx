import { describe, it, expect } from 'vitest';
import { getAvailabilityConfig } from '@/pages/HomePage';

describe('getAvailabilityConfig', () => {
  it('returns green styling for "available"', () => {
    const result = getAvailabilityConfig('available');
    expect(result.text).toBe('Available for hire');
    expect(result.dotClass).toContain('green');
  });

  it('returns amber styling for "open"', () => {
    const result = getAvailabilityConfig('open');
    expect(result.text).toBe('Open to opportunities');
    expect(result.dotClass).toContain('amber');
  });

  it('returns slate styling for "not-looking"', () => {
    const result = getAvailabilityConfig('not-looking');
    expect(result.text).toBe('Not currently looking');
    expect(result.dotClass).toContain('slate');
  });

  it('returns the raw status text for unknown values', () => {
    const result = getAvailabilityConfig('freelance');
    expect(result.text).toBe('freelance');
    expect(result.dotClass).toContain('slate');
  });
});
