import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isWebGLSupported, isLowPowerDevice } from '@/utils/webgl';

describe('isWebGLSupported', () => {
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it('returns true when WebGL context is available', () => {
    document.createElement = vi.fn().mockReturnValue({
      getContext: vi.fn().mockReturnValue({}),
    }) as unknown as typeof document.createElement;

    expect(isWebGLSupported()).toBe(true);
  });

  it('returns false when no WebGL context is available', () => {
    document.createElement = vi.fn().mockReturnValue({
      getContext: vi.fn().mockReturnValue(null),
    }) as unknown as typeof document.createElement;

    expect(isWebGLSupported()).toBe(false);
  });

  it('returns false when canvas creation throws', () => {
    document.createElement = vi.fn().mockImplementation(() => {
      throw new Error('Canvas not supported');
    }) as unknown as typeof document.createElement;

    expect(isWebGLSupported()).toBe(false);
  });
});

describe('isLowPowerDevice', () => {
  const originalNavigator = { ...navigator };

  afterEach(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: originalNavigator.hardwareConcurrency,
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: originalNavigator.userAgent,
      configurable: true,
    });
  });

  it('returns true when hardwareConcurrency <= 4', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120',
      configurable: true,
    });

    expect(isLowPowerDevice()).toBe(true);
  });

  it('returns true for mobile user agent', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 8,
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      configurable: true,
    });

    expect(isLowPowerDevice()).toBe(true);
  });

  it('returns false for high-power desktop', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 16,
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120',
      configurable: true,
    });

    expect(isLowPowerDevice()).toBe(false);
  });
});
