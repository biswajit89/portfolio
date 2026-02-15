import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { SkillMatrix } from '@/components/ui/SkillMatrix';
import { useUIStore } from '@/store/uiStore';
import type { SkillCategory, ProofLink } from '@/types/content';

const NUM_RUNS = 50;

const safeStr = fc.string({ minLength: 1, maxLength: 20 }).map(
  (s) => s.replace(/[^A-Za-z0-9 ]/g, 'a') || 'a',
);

const plArb: fc.Arbitrary<ProofLink> = fc.record({
  type: fc.constantFrom('project', 'experience') as fc.Arbitrary<'project' | 'experience'>,
  id: fc.uuid(),
  description: safeStr,
});

const skArb = fc.record({
  id: fc.uuid(),
  name: safeStr,
  proficiency: fc.constantFrom(1, 2, 3, 4, 5) as fc.Arbitrary<1 | 2 | 3 | 4 | 5>,
  proofLinks: fc.array(plArb, { minLength: 0, maxLength: 3 }),
});

const catArb: fc.Arbitrary<SkillCategory> = fc.record({
  name: safeStr,
  skills: fc.array(skArb, { minLength: 1, maxLength: 5 }),
});

const catsArb = fc
  .array(catArb, { minLength: 1, maxLength: 4 })
  .filter((c) => new Set(c.map((x) => x.name)).size === c.length);

describe('Property 10: Skill Matrix', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders all categories', () => {
    fc.assert(
      fc.property(catsArb, (cats) => {
        const { unmount, container } = render(
          <SkillMatrix skills={cats} proofMode={false} onProofClick={() => {}} />,
        );
        expect(
          container.querySelectorAll('[data-testid^="skill-category-"]').length,
        ).toBe(cats.length);
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('renders all skills', () => {
    fc.assert(
      fc.property(catsArb, (cats) => {
        const { unmount, container } = render(
          <SkillMatrix skills={cats} proofMode={false} onProofClick={() => {}} />,
        );
        for (const c of cats) {
          for (const s of c.skills) {
            expect(
              container.querySelector(`[data-testid="skill-${s.id}"]`),
            ).not.toBeNull();
          }
        }
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('proficiency meters have correct aria values', () => {
    fc.assert(
      fc.property(catsArb, (cats) => {
        const { unmount, container } = render(
          <SkillMatrix skills={cats} proofMode={false} onProofClick={() => {}} />,
        );
        for (const c of cats) {
          for (const s of c.skills) {
            const m = container.querySelector(
              `[data-testid="proficiency-${s.id}"]`,
            );
            expect(m).not.toBeNull();
            expect(m!.getAttribute('aria-valuenow')).toBe(
              String(s.proficiency),
            );
          }
        }
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('proof mode shows correct number of proof buttons', () => {
    fc.assert(
      fc.property(catsArb, (cats) => {
        const { unmount, container } = render(
          <SkillMatrix skills={cats} proofMode={true} onProofClick={() => {}} />,
        );
        const total = cats.reduce(
          (sum, c) =>
            sum + c.skills.reduce((a, sk) => a + sk.proofLinks.length, 0),
          0,
        );
        const buttons = container.querySelectorAll(
          'button[data-testid^="proof-links-"]',
        );
        expect(buttons.length).toBe(total);
        unmount();
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
