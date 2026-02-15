import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { sortExperiencesChronologically } from '@/utils/content';
import type { Experience } from '@/types/content';

/**
 * Property 1: Chronological Sorting Preserves All Items
 *
 * For any array of dated items (experiences or education entries), sorting
 * chronologically with most recent first SHALL produce an array of the same
 * length where each item's date is greater than or equal to the next item's date.
 *
 * **Validates: Requirements 3.3, 6.3**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries                                                       */
/* ------------------------------------------------------------------ */

const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0);

const dateStringArb = fc
  .record({
    year: fc.integer({ min: 2000, max: 2025 }),
    month: fc.integer({ min: 1, max: 12 }),
  })
  .map(({ year, month }) => `${year}-${String(month).padStart(2, '0')}`);

const artifactArb = fc.record({
  type: fc.constantFrom('link' as const, 'image' as const, 'video' as const),
  url: nonEmptyStringArb,
  title: nonEmptyStringArb,
});

const experienceArb: fc.Arbitrary<Experience> = fc.record({
  id: fc.uuid(),
  company: nonEmptyStringArb,
  role: nonEmptyStringArb,
  startDate: dateStringArb,
  endDate: fc.oneof(dateStringArb, fc.constant(null)),
  location: nonEmptyStringArb,
  isRemote: fc.boolean(),
  summary: fc.array(fc.string(), { minLength: 0, maxLength: 3 }),
  achievements: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  techStack: fc.array(fc.string(), { minLength: 0, maxLength: 8 }),
  artifacts: fc.array(artifactArb, { minLength: 0, maxLength: 3 }),
});

const experienceListArb = fc.array(experienceArb, { minLength: 0, maxLength: 15 });

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Returns the effective sort key for endDate (null = current job = most recent). */
function effectiveEndDate(exp: Experience): string {
  return exp.endDate ?? '\uffff';
}

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Property 1: Chronological Sorting Preserves All Items', () => {
  it('sorted output has the same length as input (no items lost or added)', () => {
    fc.assert(
      fc.property(experienceListArb, (experiences) => {
        const sorted = sortExperiencesChronologically(experiences);
        expect(sorted).toHaveLength(experiences.length);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('sorted output contains exactly the same items as input (set equality by id)', () => {
    fc.assert(
      fc.property(experienceListArb, (experiences) => {
        const sorted = sortExperiencesChronologically(experiences);

        const inputIds = experiences.map((e) => e.id).sort();
        const outputIds = sorted.map((e) => e.id).sort();
        expect(outputIds).toEqual(inputIds);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('sorted output is in correct chronological order (most recent first)', () => {
    fc.assert(
      fc.property(experienceListArb, (experiences) => {
        const sorted = sortExperiencesChronologically(experiences);

        for (let i = 0; i < sorted.length - 1; i++) {
          const currentEnd = effectiveEndDate(sorted[i]);
          const nextEnd = effectiveEndDate(sorted[i + 1]);

          // Primary: endDate descending — current must be >= next
          if (currentEnd !== nextEnd) {
            expect(currentEnd.localeCompare(nextEnd)).toBeGreaterThanOrEqual(0);
          } else {
            // Tiebreaker: startDate descending
            expect(
              sorted[i].startDate.localeCompare(sorted[i + 1].startDate),
            ).toBeGreaterThanOrEqual(0);
          }
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('sorting does not mutate the original array', () => {
    fc.assert(
      fc.property(experienceListArb, (experiences) => {
        const originalCopy = [...experiences];
        sortExperiencesChronologically(experiences);

        expect(experiences).toEqual(originalCopy);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
