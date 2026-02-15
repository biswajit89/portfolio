import { create } from 'zustand';
import { getAchievements } from '@/utils/content';

export interface AchievementState {
  unlockedAchievements: string[];
  viewedProjects: string[];
  expandedExperiences: string[];
  proofLinksClicked: number;
  contactFormSubmitted: boolean;

  unlockAchievement: (id: string) => void;
  trackProjectView: (projectId: string) => void;
  trackExperienceExpand: (experienceId: string) => void;
  trackProofLinkClick: () => void;
  trackContactSubmit: () => void;
  checkAndUnlockAchievements: () => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedAchievements: [],
  viewedProjects: [],
  expandedExperiences: [],
  proofLinksClicked: 0,
  contactFormSubmitted: false,

  unlockAchievement: (id: string) => {
    const { unlockedAchievements } = get();
    if (!unlockedAchievements.includes(id)) {
      set({ unlockedAchievements: [...unlockedAchievements, id] });
    }
  },

  trackProjectView: (projectId: string) => {
    const { viewedProjects } = get();
    if (!viewedProjects.includes(projectId)) {
      set({ viewedProjects: [...viewedProjects, projectId] });
    }
    get().checkAndUnlockAchievements();
  },

  trackExperienceExpand: (experienceId: string) => {
    const { expandedExperiences } = get();
    if (!expandedExperiences.includes(experienceId)) {
      set({ expandedExperiences: [...expandedExperiences, experienceId] });
    }
    get().checkAndUnlockAchievements();
  },

  trackProofLinkClick: () => {
    set((state) => ({ proofLinksClicked: state.proofLinksClicked + 1 }));
    get().checkAndUnlockAchievements();
  },

  trackContactSubmit: () => {
    set({ contactFormSubmitted: true });
    get().checkAndUnlockAchievements();
  },

  checkAndUnlockAchievements: () => {
    const state = get();
    const achievements = getAchievements();

    for (const achievement of achievements) {
      if (state.unlockedAchievements.includes(achievement.id)) {
        continue;
      }

      const { type, threshold } = achievement.unlockCondition;
      let currentValue = 0;

      switch (type) {
        case 'projectViews':
          currentValue = state.viewedProjects.length;
          break;
        case 'experienceExpands':
          currentValue = state.expandedExperiences.length;
          break;
        case 'proofClicks':
          currentValue = state.proofLinksClicked;
          break;
        case 'contactSubmit':
          currentValue = state.contactFormSubmitted ? 1 : 0;
          break;
      }

      if (currentValue >= threshold) {
        state.unlockAchievement(achievement.id);
      }
    }
  },
}));
