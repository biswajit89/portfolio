import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';

import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { useUIStore } from '@/store/uiStore';
import type { Experience, Artifact } from '@/types/content';

/**
 * Property 16: Experience Expand Toggle State
 *
 * For any experience card, clicking the expand button SHALL toggle the
 * isExpanded state. When expanded, detailed content SHALL be visible.
 * When collapsed, detailed content SHALL be hidden.
 *
 * **Validates: Requirements 3.2**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries (reused from experienceCard.property.test.tsx)        */
/* ------------------------------------------------------------------ */

const dateStringArb = fc
  .record({
    year: fc.integer({ min: 2000, max: 2025 }),
    month: fc.integer({ min: 1, max: 12 }),
  })
  .map(({ year, month }) => `${year}-${String(month).padStart(2, '0')}`);

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

describe('Property 16: Experience Expand Toggle State', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('clicking the toggle button invokes onToggle callback', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        let toggleCount = 0;
        const onToggle = () => { toggleCount += 1; };

        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={onToggle} />,
        );

        const button = container.querySelector('button[aria-expanded]');
        expect(button).not.toBeNull();
        fireEvent.click(button!);
        expect(toggleCount).toBe(1);

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('aria-expanded reflects the isExpanded prop accurately', () => {
    fc.assert(
      fc.property(experienceArb, fc.boolean(), (experience, expanded) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={expanded} onToggle={() => {}} />,
        );

        const button = container.querySelector('button[aria-expanded]');
        expect(button).not.toBeNull();
        expect(button!.getAttribute('aria-expanded')).toBe(String(expanded));

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('collapsed state shows achievements-preview and hides achievements-full', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={false} onToggle={() => {}} />,
        );

        const preview = container.querySelector('[data-testid="achievements-preview"]');
        const full = container.querySelector('[data-testid="achievements-full"]');

        expect(preview).not.toBeNull();
        expect(full).toBeNull();

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('expanded state shows achievements-full and hides achievements-preview', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        const { container, unmount } = render(
          <ExperienceCard experience={experience} isExpanded={true} onToggle={() => {}} />,
        );

        const preview = container.querySelector('[data-testid="achievements-preview"]');
        const full = container.querySelector('[data-testid="achievements-full"]');

        expect(full).not.toBeNull();
        expect(preview).toBeNull();

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
