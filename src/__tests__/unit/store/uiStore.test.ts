import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useUIStore, initReducedMotionListener } from '@/store/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      currentSection: 'home',
      isReducedMotion: false,
      scrollProgress: 0,
      isDarkMode: true,
    });
  });

  describe('initial state', () => {
    it('has correct default values', () => {
      const state = useUIStore.getState();
      expect(state.currentSection).toBe('home');
      expect(state.isReducedMotion).toBe(false);
      expect(state.scrollProgress).toBe(0);
      expect(state.isDarkMode).toBe(true);
    });
  });

  describe('setCurrentSection', () => {
    it('updates the current section', () => {
      useUIStore.getState().setCurrentSection('experience');
      expect(useUIStore.getState().currentSection).toBe('experience');
    });

    it('allows setting to any string', () => {
      useUIStore.getState().setCurrentSection('projects');
      expect(useUIStore.getState().currentSection).toBe('projects');
      useUIStore.getState().setCurrentSection('contact');
      expect(useUIStore.getState().currentSection).toBe('contact');
    });
  });

  describe('toggleDarkMode', () => {
    it('toggles from true to false', () => {
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });

    it('toggles from false to true', () => {
      useUIStore.setState({ isDarkMode: false });
      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(true);
    });
  });

  describe('setDarkMode', () => {
    it('sets dark mode explicitly', () => {
      useUIStore.getState().setDarkMode(false);
      expect(useUIStore.getState().isDarkMode).toBe(false);
      useUIStore.getState().setDarkMode(true);
      expect(useUIStore.getState().isDarkMode).toBe(true);
    });
  });

  describe('setReducedMotion', () => {
    it('sets reduced motion to true', () => {
      useUIStore.getState().setReducedMotion(true);
      expect(useUIStore.getState().isReducedMotion).toBe(true);
    });

    it('sets reduced motion to false', () => {
      useUIStore.setState({ isReducedMotion: true });
      useUIStore.getState().setReducedMotion(false);
      expect(useUIStore.getState().isReducedMotion).toBe(false);
    });
  });

  describe('setScrollProgress', () => {
    it('sets scroll progress to a valid value', () => {
      useUIStore.getState().setScrollProgress(0.5);
      expect(useUIStore.getState().scrollProgress).toBe(0.5);
    });

    it('clamps to 0 when negative', () => {
      useUIStore.getState().setScrollProgress(-0.5);
      expect(useUIStore.getState().scrollProgress).toBe(0);
    });

    it('clamps to 1 when above 1', () => {
      useUIStore.getState().setScrollProgress(1.5);
      expect(useUIStore.getState().scrollProgress).toBe(1);
    });
  });
});

describe('initReducedMotionListener', () => {
  let addSpy: ReturnType<typeof vi.fn>;
  let removeSpy: ReturnType<typeof vi.fn>;
  let original: typeof window.matchMedia;

  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: false });
    addSpy = vi.fn();
    removeSpy = vi.fn();
    original = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = original;
    vi.restoreAllMocks();
  });

  function mock(matches: boolean) {
    window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: addSpy, removeEventListener: removeSpy });
  }

  it('reads initial value', () => {
    mock(true);
    initReducedMotionListener();
    expect(useUIStore.getState().isReducedMotion).toBe(true);
  });

  it('subscribes to changes', () => {
    mock(false);
    initReducedMotionListener();
    expect(addSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates on change event', () => {
    mock(false);
    initReducedMotionListener();
    addSpy.mock.calls[0][1]({ matches: true } as MediaQueryListEvent);
    expect(useUIStore.getState().isReducedMotion).toBe(true);
  });

  it('cleanup removes listener', () => {
    mock(false);
    const cleanup = initReducedMotionListener();
    cleanup();
    expect(removeSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
