import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { useAchievementStore } from '@/store/achievementStore';
import type { Achievement } from '@/types/content';

/**
 * Property 3: Achievement Unlock Threshold Consistency
 *
 * For any achievement with a threshold condition, when the user's tracked count
 * meets or exceeds the threshold, the achievement SHALL be marked as unlocked.
 * When the count is below the threshold, the achievement SHALL remain locked.
 *
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
 */

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'achievement-explorer',
    name: 'Explorer',
    description: 'Viewed 3 or more projects',
    icon: 'compass',
    unlockCondition: { type: 'projectViews', threshold: 3 },
  },
  {
    id: 'achievement-deep-diver',
    name: 'Deep Diver',
    description: 'Expanded 2 or more experiences',
    icon: 'layers',
    unlockCondition: { type: 'experienceExpands', threshold: 2 },
  },
  {
    id: 'achievement-fact-checker',
    name: 'Fact Checker',
    description: 'Clicked a proof link',
    icon: 'check-circle',
    unlockCondition: { type: 'proofClicks', threshold: 1 },
  },
  {
    id: 'achievement-connector',
    name: 'Connector',
    description: 'Submitted the contact form',
    icon: 'message-circle',
    unlockCondition: { type: 'contactSubmit', threshold: 1 },
  },
];

vi.mock('@/utils/content', () => ({
  getAchievements: () => ACHIEVEMENTS,
}));


/** Generates counts for each achievement condition type. */
const achievementCountsArb = fc.record({
  projectViewCount: fc.integer({ min: 0, max: 10 }),
  experienceExpandCount: fc.integer({ min: 0, max: 10 }),
  proofClickCount: fc.integer({ min: 0, max: 10 }),
  contactSubmitted: fc.boolean(),
});

const NUM_RUNS = 100;

function resetStore() {
  useAchievementStore.setState({
    unlockedAchievements: [],
    viewedProjects: [],
    expandedExperiences: [],
    proofLinksClicked: 0,
    contactFormSubmitted: false,
  });
}

describe('Property 3: Achievement Unlock Threshold Consistency', () => {
  beforeEach(() => {
    resetStore();
  });

  it('achievements are unlocked iff their threshold is met', () => {
    fc.assert(
      fc.property(achievementCountsArb, (counts) => {
        resetStore();

        // Build unique IDs for viewed projects and expanded experiences
        const viewedProjects = Array.from({ length: counts.projectViewCount }, (_, i) => `proj-${i}`);
        const expandedExperiences = Array.from({ length: counts.experienceExpandCount }, (_, i) => `exp-${i}`);

        // Set the store state directly with the generated counts
        useAchievementStore.setState({
          viewedProjects,
          expandedExperiences,
          proofLinksClicked: counts.proofClickCount,
          contactFormSubmitted: counts.contactSubmitted,
        });

        // Trigger achievement checking
        useAchievementStore.getState().checkAndUnlockAchievements();

        const unlocked = useAchievementStore.getState().unlockedAchievements;

        // Verify each achievement: unlocked iff threshold met
        for (const achievement of ACHIEVEMENTS) {
          const { type, threshold } = achievement.unlockCondition;
          let currentValue = 0;

          switch (type) {
            case 'projectViews':
              currentValue = counts.projectViewCount;
              break;
            case 'experienceExpands':
              currentValue = counts.experienceExpandCount;
              break;
            case 'proofClicks':
              currentValue = counts.proofClickCount;
              break;
            case 'contactSubmit':
              currentValue = counts.contactSubmitted ? 1 : 0;
              break;
          }

          if (currentValue >= threshold) {
            expect(unlocked).toContain(achievement.id);
          } else {
            expect(unlocked).not.toContain(achievement.id);
          }
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('unlocked achievements are never duplicated regardless of how many times check runs', () => {
    fc.assert(
      fc.property(
        achievementCountsArb,
        fc.integer({ min: 1, max: 5 }),
        (counts, checkRuns) => {
          resetStore();

          useAchievementStore.setState({
            viewedProjects: Array.from({ length: counts.projectViewCount }, (_, i) => `proj-${i}`),
            expandedExperiences: Array.from({ length: counts.experienceExpandCount }, (_, i) => `exp-${i}`),
            proofLinksClicked: counts.proofClickCount,
            contactFormSubmitted: counts.contactSubmitted,
          });

          // Call checkAndUnlockAchievements multiple times
          for (let i = 0; i < checkRuns; i++) {
            useAchievementStore.getState().checkAndUnlockAchievements();
          }

          const unlocked = useAchievementStore.getState().unlockedAchievements;

          // No duplicates
          const uniqueUnlocked = new Set(unlocked);
          expect(uniqueUnlocked.size).toBe(unlocked.length);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('number of unlocked achievements equals number of conditions met', () => {
    fc.assert(
      fc.property(achievementCountsArb, (counts) => {
        resetStore();

        useAchievementStore.setState({
          viewedProjects: Array.from({ length: counts.projectViewCount }, (_, i) => `proj-${i}`),
          expandedExperiences: Array.from({ length: counts.experienceExpandCount }, (_, i) => `exp-${i}`),
          proofLinksClicked: counts.proofClickCount,
          contactFormSubmitted: counts.contactSubmitted,
        });

        useAchievementStore.getState().checkAndUnlockAchievements();

        const unlocked = useAchievementStore.getState().unlockedAchievements;

        // Count how many thresholds are met
        let expectedCount = 0;
        if (counts.projectViewCount >= 3) expectedCount++;
        if (counts.experienceExpandCount >= 2) expectedCount++;
        if (counts.proofClickCount >= 1) expectedCount++;
        if (counts.contactSubmitted) expectedCount++;

        expect(unlocked.length).toBe(expectedCount);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
