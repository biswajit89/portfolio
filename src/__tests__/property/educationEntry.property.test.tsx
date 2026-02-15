import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, within } from '@testing-library/react';

import EducationPage from '@/pages/EducationPage';
import { useUIStore } from '@/store/uiStore';
import type { Education } from '@/types/content';

/**
 * Property 14: Education Entry Contains All Required Fields
 *
 * For any valid education entry, the rendered output SHALL display
 * institution, degree, field, start date, end date, and highlights array.
 *
 * **Validates: Requirements 6.1**
 */

const NUM_RUNS = 100;

const safeStringArb = (min = 1, max = 40) =>
  fc.stringMatching(/^[A-Za-z][A-Za-z0-9]*$/, { minLength: min, maxLength: max });

const dateStringArb = fc
  .record({
    year: fc.integer({ min: 2000, max: 2025 }),
    month: fc.integer({ min: 1, max: 12 }),
  })
  .map(({ year, month }) => `${year}-${String(month).padStart(2, '0')}`);

const highlightArb = safeStringArb(3, 50);

const educationArb: fc.Arbitrary<Education> = fc.record({
  id: fc.uuid(),
  institution: safeStringArb(2, 40),
  degree: safeStringArb(2, 30),
  field: safeStringArb(2, 30),
  startDate: dateStringArb,
  endDate: dateStringArb,
  highlights: fc.array(highlightArb, { minLength: 0, maxLength: 5 }),
});

let mockEducation: Education[] = [];

vi.mock('@/utils/content', () => ({
  getEducation: () => mockEducation,
  sortEducationChronologically: (entries: Education[]) => entries,
}));

describe('Property 14: Education Entry Contains All Required Fields', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('each education entry displays institution, degree, field, and dates', () => {
    fc.assert(
      fc.property(educationArb, (entry) => {
        mockEducation = [entry];

        const { container, unmount } = render(<EducationPage />);

        const article = container.querySelector(`[data-testid="education-entry-${entry.id}"]`);
        expect(article).not.toBeNull();

        const scope = within(article as HTMLElement);

        expect(scope.getByTestId('education-institution').textContent).toBe(entry.institution);
        // degree element contains "degree, field" since field is nested inside
        const degreeEl = scope.getByTestId('education-degree');
        expect(degreeEl.textContent).toContain(entry.degree);
        expect(scope.getByTestId('education-field').textContent).toBe(entry.field);

        const datesText = scope.getByTestId('education-dates').textContent ?? '';
        expect(datesText.length).toBeGreaterThan(0);

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('entries with highlights display all highlight items', () => {
    const withHighlightsArb = fc.record({
      id: fc.uuid(),
      institution: safeStringArb(2, 40),
      degree: safeStringArb(2, 30),
      field: safeStringArb(2, 30),
      startDate: dateStringArb,
      endDate: dateStringArb,
      highlights: fc.array(highlightArb, { minLength: 1, maxLength: 5 }),
    });

    fc.assert(
      fc.property(withHighlightsArb, (entry) => {
        mockEducation = [entry];

        const { container, unmount } = render(<EducationPage />);

        const article = container.querySelector(`[data-testid="education-entry-${entry.id}"]`);
        expect(article).not.toBeNull();

        const scope = within(article as HTMLElement);
        const highlightsList = scope.getByTestId('education-highlights');
        const items = within(highlightsList).getAllByRole('listitem');
        expect(items).toHaveLength(entry.highlights.length);

        items.forEach((item, i) => {
          expect(item.textContent).toBe(entry.highlights[i]);
        });

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('entries with empty highlights do not render highlights list', () => {
    const noHighlightsArb = fc.record({
      id: fc.uuid(),
      institution: safeStringArb(2, 40),
      degree: safeStringArb(2, 30),
      field: safeStringArb(2, 30),
      startDate: dateStringArb,
      endDate: dateStringArb,
      highlights: fc.constant([] as string[]),
    });

    fc.assert(
      fc.property(noHighlightsArb, (entry) => {
        mockEducation = [entry];

        const { container, unmount } = render(<EducationPage />);

        const article = container.querySelector(`[data-testid="education-entry-${entry.id}"]`);
        expect(article).not.toBeNull();

        const highlightsList = (article as HTMLElement).querySelector(
          '[data-testid="education-highlights"]',
        );
        expect(highlightsList).toBeNull();

        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
