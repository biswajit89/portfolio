import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  currentSection: string;
  isReducedMotion: boolean;
  scrollProgress: number;
  isDarkMode: boolean;

  setCurrentSection: (section: string) => void;
  setReducedMotion: (value: boolean) => void;
  setScrollProgress: (progress: number) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currentSection: 'home',
      isReducedMotion: false,
      scrollProgress: 0,
      isDarkMode: true,

      setCurrentSection: (section: string) => set({ currentSection: section }),
      setReducedMotion: (value: boolean) => set({ isReducedMotion: value }),
      setScrollProgress: (progress: number) =>
        set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (value: boolean) => set({ isDarkMode: value }),
    }),
    {
      name: 'portfolio-ui',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    },
  ),
);

export function initReducedMotionListener(): () => void {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  useUIStore.getState().setReducedMotion(mediaQuery.matches);

  const handler = (event: MediaQueryListEvent) => {
    useUIStore.getState().setReducedMotion(event.matches);
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}
