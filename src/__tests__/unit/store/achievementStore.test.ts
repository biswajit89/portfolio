import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAchievementStore } from '@/store/achievementStore';

// Mock the content utility so tests don't depend on portfolio.json
vi.mock('@/utils/content', () => ({
  getAchievements: () => [
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
  ],
}));

function resetStore() {
  useAchievementStore.setState({
    unlockedAchievements: [],
    viewedProjects: [],
    expandedExperiences: [],
    proofLinksClicked: 0,
    contactFormSubmitted: false,
  });
}

describe('achievementStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('initial state', () => {
    it('has correct default values', () => {
      const state = useAchievementStore.getState();
      expect(state.unlockedAchievements).toEqual([]);
      expect(state.viewedProjects).toEqual([]);
      expect(state.expandedExperiences).toEqual([]);
      expect(state.proofLinksClicked).toBe(0);
      expect(state.contactFormSubmitted).toBe(false);
    });
  });

  describe('unlockAchievement', () => {
    it('adds an achievement to the unlocked list', () => {
      useAchievementStore.getState().unlockAchievement('achievement-explorer');
      expect(useAchievementStore.getState().unlockedAchievements).toEqual(['achievement-explorer']);
    });

    it('does not add duplicate achievements', () => {
      const store = useAchievementStore.getState();
      store.unlockAchievement('achievement-explorer');
      store.unlockAchievement('achievement-explorer');
      expect(useAchievementStore.getState().unlockedAchievements).toEqual(['achievement-explorer']);
    });

    it('can unlock multiple different achievements', () => {
      const store = useAchievementStore.getState();
      store.unlockAchievement('achievement-explorer');
      store.unlockAchievement('achievement-connector');
      expect(useAchievementStore.getState().unlockedAchievements).toEqual([
        'achievement-explorer',
        'achievement-connector',
      ]);
    });
  });

  describe('trackProjectView', () => {
    it('adds a project to viewedProjects', () => {
      useAchievementStore.getState().trackProjectView('proj-1');
      expect(useAchievementStore.getState().viewedProjects).toEqual(['proj-1']);
    });

    it('does not add duplicate project views', () => {
      const store = useAchievementStore.getState();
      store.trackProjectView('proj-1');
      store.trackProjectView('proj-1');
      expect(useAchievementStore.getState().viewedProjects).toEqual(['proj-1']);
    });

    it('unlocks Explorer after viewing 3 unique projects', () => {
      const store = useAchievementStore.getState();
      store.trackProjectView('proj-1');
      store.trackProjectView('proj-2');
      expect(useAchievementStore.getState().unlockedAchievements).not.toContain('achievement-explorer');

      store.trackProjectView('proj-3');
      expect(useAchievementStore.getState().unlockedAchievements).toContain('achievement-explorer');
    });

    it('does not unlock Explorer with fewer than 3 unique projects', () => {
      const store = useAchievementStore.getState();
      store.trackProjectView('proj-1');
      store.trackProjectView('proj-2');
      expect(useAchievementStore.getState().unlockedAchievements).not.toContain('achievement-explorer');
    });
  });

  describe('trackExperienceExpand', () => {
    it('adds an experience to expandedExperiences', () => {
      useAchievementStore.getState().trackExperienceExpand('exp-1');
      expect(useAchievementStore.getState().expandedExperiences).toEqual(['exp-1']);
    });

    it('does not add duplicate experience expansions', () => {
      const store = useAchievementStore.getState();
      store.trackExperienceExpand('exp-1');
      store.trackExperienceExpand('exp-1');
      expect(useAchievementStore.getState().expandedExperiences).toEqual(['exp-1']);
    });

    it('unlocks Deep Diver after expanding 2 unique experiences', () => {
      const store = useAchievementStore.getState();
      store.trackExperienceExpand('exp-1');
      expect(useAchievementStore.getState().unlockedAchievements).not.toContain('achievement-deep-diver');

      store.trackExperienceExpand('exp-2');
      expect(useAchievementStore.getState().unlockedAchievements).toContain('achievement-deep-diver');
    });
  });

  describe('trackProofLinkClick', () => {
    it('increments proofLinksClicked', () => {
      useAchievementStore.getState().trackProofLinkClick();
      expect(useAchievementStore.getState().proofLinksClicked).toBe(1);
    });

    it('increments on each call', () => {
      const store = useAchievementStore.getState();
      store.trackProofLinkClick();
      store.trackProofLinkClick();
      store.trackProofLinkClick();
      expect(useAchievementStore.getState().proofLinksClicked).toBe(3);
    });

    it('unlocks Fact Checker on first proof link click', () => {
      useAchievementStore.getState().trackProofLinkClick();
      expect(useAchievementStore.getState().unlockedAchievements).toContain('achievement-fact-checker');
    });
  });

  describe('trackContactSubmit', () => {
    it('sets contactFormSubmitted to true', () => {
      useAchievementStore.getState().trackContactSubmit();
      expect(useAchievementStore.getState().contactFormSubmitted).toBe(true);
    });

    it('unlocks Connector on contact form submission', () => {
      useAchievementStore.getState().trackContactSubmit();
      expect(useAchievementStore.getState().unlockedAchievements).toContain('achievement-connector');
    });
  });

  describe('checkAndUnlockAchievements', () => {
    it('does not unlock achievements when no conditions are met', () => {
      useAchievementStore.getState().checkAndUnlockAchievements();
      expect(useAchievementStore.getState().unlockedAchievements).toEqual([]);
    });

    it('unlocks all achievements whose conditions are met', () => {
      useAchievementStore.setState({
        viewedProjects: ['p1', 'p2', 'p3'],
        expandedExperiences: ['e1', 'e2'],
        proofLinksClicked: 1,
        contactFormSubmitted: true,
      });

      useAchievementStore.getState().checkAndUnlockAchievements();

      const unlocked = useAchievementStore.getState().unlockedAchievements;
      expect(unlocked).toContain('achievement-explorer');
      expect(unlocked).toContain('achievement-deep-diver');
      expect(unlocked).toContain('achievement-fact-checker');
      expect(unlocked).toContain('achievement-connector');
    });

    it('does not re-unlock already unlocked achievements', () => {
      useAchievementStore.setState({
        unlockedAchievements: ['achievement-connector'],
        contactFormSubmitted: true,
      });

      useAchievementStore.getState().checkAndUnlockAchievements();

      const unlocked = useAchievementStore.getState().unlockedAchievements;
      // Should still be exactly one entry, not duplicated
      expect(unlocked.filter((id) => id === 'achievement-connector')).toHaveLength(1);
    });

    it('only unlocks achievements that meet the threshold', () => {
      useAchievementStore.setState({
        viewedProjects: ['p1', 'p2'], // 2 < 3 threshold
        expandedExperiences: ['e1', 'e2'], // 2 >= 2 threshold
        proofLinksClicked: 0, // 0 < 1 threshold
        contactFormSubmitted: false, // false < 1 threshold
      });

      useAchievementStore.getState().checkAndUnlockAchievements();

      const unlocked = useAchievementStore.getState().unlockedAchievements;
      expect(unlocked).not.toContain('achievement-explorer');
      expect(unlocked).toContain('achievement-deep-diver');
      expect(unlocked).not.toContain('achievement-fact-checker');
      expect(unlocked).not.toContain('achievement-connector');
    });
  });
});
