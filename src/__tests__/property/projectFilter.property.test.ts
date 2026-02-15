import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { filterProjects, ALL_PROJECT_CATEGORIES } from '@/utils/content';
import type { Project, ProjectCategory } from '@/types/content';

/**
 * Property 2: Project Filter Returns Only Matching Categories
 *
 * For any project list and any selected category filter, all projects in the
 * filtered result SHALL contain the selected category in their categories array.
 *
 * **Validates: Requirements 4.5**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries                                                       */
/* ------------------------------------------------------------------ */

const nonEmptyStringArb = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0);

const categoryArb: fc.Arbitrary<ProjectCategory> = fc.constantFrom(
  ...ALL_PROJECT_CATEGORIES,
);

const categoriesArb: fc.Arbitrary<ProjectCategory[]> = fc
  .subarray(ALL_PROJECT_CATEGORIES, { minLength: 1 })
  .map((arr) => [...arr]);

const projectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.uuid(),
  title: nonEmptyStringArb,
  description: nonEmptyStringArb,
  role: nonEmptyStringArb,
  duration: nonEmptyStringArb,
  problem: nonEmptyStringArb,
  solution: nonEmptyStringArb,
  architecture: nonEmptyStringArb,
  impactMetrics: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
  techStack: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 5 }),
  screenshots: fc.array(nonEmptyStringArb, { minLength: 0, maxLength: 2 }),
  highlights: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 3 }),
  categories: categoriesArb,
});

const projectListArb = fc.array(projectArb, { minLength: 0, maxLength: 20 });

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Property 2: Project Filter Returns Only Matching Categories', () => {
  it('all items in filtered result contain the selected category', () => {
    fc.assert(
      fc.property(projectListArb, categoryArb, (projects, category) => {
        const filtered = filterProjects(projects, category);

        for (const project of filtered) {
          expect(project.categories).toContain(category);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('no matching projects from the original list are missing from the result', () => {
    fc.assert(
      fc.property(projectListArb, categoryArb, (projects, category) => {
        const filtered = filterProjects(projects, category);
        const expected = projects.filter((p) => p.categories.includes(category));

        expect(filtered).toHaveLength(expected.length);
        for (const project of expected) {
          expect(filtered.some((f) => f.id === project.id)).toBe(true);
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('filtering with null returns all items', () => {
    fc.assert(
      fc.property(projectListArb, (projects) => {
        const filtered = filterProjects(projects, null);

        expect(filtered).toHaveLength(projects.length);
        expect(filtered).toEqual(projects);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
