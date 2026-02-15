import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getAvailabilityConfig } from '@/pages/HomePage';

/**
 * Property 15: Availability Badge Reflects Profile Status
 *
 * For any valid availability status ('available', 'open', 'not-looking'),
 * the availability badge SHALL render with the correct status text and
 * appropriate visual styling.
 *
 * **Validates: Requirements 1.3**
 */

const NUM_RUNS = 100;

const VALID_STATUSES = ['available', 'open', 'not-looking'] as const;

const validStatusArb = fc.constantFrom(...VALID_STATUSES);

const unknownStatusArb = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => !(VALID_STATUSES as readonly string[]).includes(s));

describe('Property 15: Availability Badge Reflects Profile Status', () => {
  it('for any valid status, returns non-empty text and dotClass', () => {
    fc.assert(
      fc.property(validStatusArb, (status) => {
        const config = getAvailabilityConfig(status);
        expect(config.text).toBeTruthy();
        expect(config.text.length).toBeGreaterThan(0);
        expect(config.dotClass).toBeTruthy();
        expect(config.dotClass.length).toBeGreaterThan(0);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('each valid status maps to a distinct text', () => {
    const texts = VALID_STATUSES.map((s) => getAvailabilityConfig(s).text);
    const uniqueTexts = new Set(texts);
    expect(uniqueTexts.size).toBe(VALID_STATUSES.length);
  });

  it('each valid status maps to a distinct dotClass', () => {
    const dotClasses = VALID_STATUSES.map((s) => getAvailabilityConfig(s).dotClass);
    const uniqueDotClasses = new Set(dotClasses);
    expect(uniqueDotClasses.size).toBe(VALID_STATUSES.length);
  });

  it('unknown statuses return the raw status as text', () => {
    fc.assert(
      fc.property(unknownStatusArb, (status) => {
        const config = getAvailabilityConfig(status);
        expect(config.text).toBe(status);
        expect(config.dotClass).toBeTruthy();
        expect(config.dotClass.length).toBeGreaterThan(0);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
