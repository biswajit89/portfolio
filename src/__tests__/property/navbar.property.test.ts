import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getHighlightedSection } from '@/components/ui/Navbar';

/**
 * Property 11: Navbar Highlights Current Section
 *
 * For any valid section identifier, when that section is the current section,
 * the navbar SHALL visually highlight the corresponding navigation item and
 * no other items.
 *
 * **Validates: Requirements 8.1**
 */

const NUM_RUNS = 100;

/** Generates a non-empty array of unique, non-empty section names. */
const sectionsArb = fc
  .uniqueArray(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 })
  .filter((arr) => arr.every((s) => s.trim().length > 0));

describe('Property 11: Navbar Highlights Current Section', () => {
  it('returns the matching section when currentSection is in the array (case-insensitive)', () => {
    fc.assert(
      fc.property(sectionsArb, (sections) => {
        // Pick a random section from the array
        const idx = Math.floor(Math.random() * sections.length);
        const chosen = sections[idx];

        // Test exact match
        const result = getHighlightedSection(chosen, sections);
        expect(result.toLowerCase()).toBe(chosen.toLowerCase());
        expect(sections).toContain(result);

        // Test case-insensitive match (uppercase)
        const upper = getHighlightedSection(chosen.toUpperCase(), sections);
        expect(upper.toLowerCase()).toBe(chosen.toLowerCase());
        expect(sections).toContain(upper);

        // Test case-insensitive match (lowercase)
        const lower = getHighlightedSection(chosen.toLowerCase(), sections);
        expect(lower.toLowerCase()).toBe(chosen.toLowerCase());
        expect(sections).toContain(lower);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('returned value is always a member of the sections array (or empty string for empty array)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 30 }), fc.array(fc.string({ minLength: 0, maxLength: 20 }), { minLength: 0, maxLength: 10 }), (currentSection, sections) => {
        const result = getHighlightedSection(currentSection, sections);

        if (sections.length === 0) {
          expect(result).toBe('');
        } else {
          expect(sections).toContain(result);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('only one section is highlighted — the returned value matches exactly one section', () => {
    fc.assert(
      fc.property(sectionsArb, (sections) => {
        const idx = Math.floor(Math.random() * sections.length);
        const chosen = sections[idx];

        const highlighted = getHighlightedSection(chosen, sections);

        // Exactly one section should match the highlighted value
        const matchCount = sections.filter((s) => s === highlighted).length;
        expect(matchCount).toBe(1);

        // All other sections are NOT highlighted
        for (const section of sections) {
          if (section === highlighted) {
            expect(section).toBe(highlighted);
          } else {
            expect(section).not.toBe(highlighted);
          }
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('falls back to the first section when currentSection does not match any section', () => {
    fc.assert(
      fc.property(sectionsArb, (sections) => {
        // Use a value guaranteed not to be in the sections array
        const nonExistent = '\x00__NEVER_A_SECTION__\x00';
        const result = getHighlightedSection(nonExistent, sections);
        expect(result).toBe(sections[0]);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('returns empty string for an empty sections array', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 30 }), (currentSection) => {
        const result = getHighlightedSection(currentSection, []);
        expect(result).toBe('');
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
