import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';

import { ExperienceCard, formatDateRange } from '@/components/ui/ExperienceCard';
import { useUIStore } from '@/store/uiStore';
import type { Experience, Artifact } from '@/types/content';

/**
 * Property 8: Experience Card Contains All Required Fields
 *
 * For any valid experience entry, the rendered experience card SHALL display
 * the company name, role, duration (start-end dates), tech stack tags, and
 * at least one achievement.
 *
 * **Validates: Requirements 3.1**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries                                                       */
/* ------------------------------------------------------------------ */

/** Generates a YYYY-MM date string. */
const dateStringArb = fc
  .record({
    year: fc.integer({ min: 2000, max: 2025 }),
    month: fc.integer({ min: 1, max: 12 }),
  })
  .map(({ year, month }) => `${year}-${String(month).padStart(2, '0')}`);

/** Generates a non-empty alphanumeric string (safe for DOM text matching). */
const safeStringArb = (min = 1, max = 40) =>
  fc.stringMatching(/^[A-Za-z0-9 ]+$/)
    .filter((s) => s.length >= min && s.length <= max);

const artifactArb: fc.Arbitrary<Artifact> = fc.record({
  type: fc.constantFrom('link', 'image', 'video') as fc.Arbitrary<'link' | 'image' | 'video'>,
  url: fc.webUrl(),
  title: safeStringArb(1, 30),
});

const experienceArb: fc.Arbitrary<Experience> = fc.record({
  id: fc.uuid(),
  company: safeStringArb(1, 30),
  role: safeStringArb(1, 40),
  startDate: dateStringArb,
  endDate: fc.oneof(dateStringArb, fc.constant(null)),
  location: safeStringArb(1, 30),
  isRemote: fc.boolean(),
  summary: fc.array(safeStringArb(5, 60), { minLength: 0, maxLength: 3 }),
  achievements: fc.array(safeStringArb(5, 60), { minLength: 1, maxLength: 5 }),
  techStack: fc.array(safeStringArb(1, 20), { minLength: 1, maxLength: 8 }),
  artifacts: fc.array(artifactArb, { minLength: 0, maxLength: 3 }),
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Property 8: Experience Card Contains All Required Fields', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders the company name for any valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        expect(container.textContent).toContain(experience.company);
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('renders the role for any valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        expect(container.textContent).toContain(experience.role);
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('renders the formatted duration (start — end/Present) for any valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        const expectedDuration = formatDateRange(experience.startDate, experience.endDate);
        const durationEl = container.querySelector('[data-testid="duration"]');
        expect(durationEl).not.toBeNull();
        expect(durationEl!.textContent).toContain(expectedDuration);

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('renders all tech stack tags for any valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        const techStackEl = container.querySelector('[data-testid="tech-stack"]');
        expect(techStackEl).not.toBeNull();
        expect(techStackEl!.children).toHaveLength(experience.techStack.length);

        for (const tech of experience.techStack) {
          expect(techStackEl!.textContent).toContain(tech);
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('renders at least one achievement in collapsed state for any valid experience', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        const previewEl = container.querySelector('[data-testid="achievements-preview"]');
        expect(previewEl).not.toBeNull();

        const items = previewEl!.querySelectorAll('li');
        expect(items.length).toBeGreaterThanOrEqual(1);
        expect(items.length).toBeLessThanOrEqual(2);

        // Each rendered achievement should match one from the input
        for (const item of items) {
          expect(experience.achievements).toContain(item.textContent);
        }

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
