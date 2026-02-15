import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';

import { CaseStudy } from '@/components/ui/CaseStudy';
import { useUIStore } from '@/store/uiStore';
import type { Project, ProjectCategory } from '@/types/content';

/**
 * Property 9: Case Study Contains All Required Sections
 *
 * For any valid project entry, the rendered case study SHALL contain non-empty
 * content for: overview (description), problem, solution, architecture,
 * results (impactMetrics), and tech stack.
 *
 * **Validates: Requirements 4.2, 4.3**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries                                                       */
/* ------------------------------------------------------------------ */

const nonEmptyStringArb = fc
  .stringMatching(/^[A-Za-z0-9 .,!]+$/)
  .filter((s) => s.trim().length > 0 && s.length <= 60);

const categoriesArb: fc.Arbitrary<ProjectCategory[]> = fc
  .subarray(
    ['frontend', 'fullstack', '3d', 'oss', 'ai', 'security'] as ProjectCategory[],
    { minLength: 1 },
  )
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
  impactMetrics: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 5 }),
  techStack: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 8 }),
  screenshots: fc.constant([] as string[]),
  highlights: fc.array(nonEmptyStringArb, { minLength: 1, maxLength: 5 }),
  categories: categoriesArb,
});

/* ------------------------------------------------------------------ */
/*  Required sections with their data-testid values                   */
/* ------------------------------------------------------------------ */

const REQUIRED_SECTIONS = [
  'section-overview',
  'section-problem',
  'section-solution',
  'section-architecture',
  'section-results',
  'section-learnings',
  'section-tech-stack',
] as const;

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Property 9: Case Study Contains All Required Sections', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('all required sections are present for any valid project', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container, unmount } = render(<CaseStudy project={project} />);

        for (const testId of REQUIRED_SECTIONS) {
          const section = container.querySelector(`[data-testid="${testId}"]`);
          expect(section, `section "${testId}" should be present`).not.toBeNull();
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('each required section contains non-empty text content', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container, unmount } = render(<CaseStudy project={project} />);

        for (const testId of REQUIRED_SECTIONS) {
          const section = container.querySelector(`[data-testid="${testId}"]`);
          expect(section).not.toBeNull();
          const text = section!.textContent?.trim() ?? '';
          expect(text.length, `section "${testId}" should have non-empty content`).toBeGreaterThan(0);
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('overview section renders the project description', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container, unmount } = render(<CaseStudy project={project} />);

        const overview = container.querySelector('[data-testid="section-overview"]');
        expect(overview).not.toBeNull();
        expect(overview!.textContent).toContain(project.description);

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('results section renders all impact metrics', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container, unmount } = render(<CaseStudy project={project} />);

        const results = container.querySelector('[data-testid="section-results"]');
        expect(results).not.toBeNull();

        for (const metric of project.impactMetrics) {
          expect(results!.textContent).toContain(metric);
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('tech stack section renders all tech stack tags', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { container, unmount } = render(<CaseStudy project={project} />);

        const techStack = container.querySelector('[data-testid="section-tech-stack"]');
        expect(techStack).not.toBeNull();

        for (const tech of project.techStack) {
          expect(techStack!.textContent).toContain(tech);
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
