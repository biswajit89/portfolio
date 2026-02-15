/**
 * Detects whether the current browser supports WebGL rendering.
 * Attempts to create a WebGL context on an offscreen canvas.
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Heuristic check for low-power devices.
 * Considers hardware concurrency and mobile user agent patterns.
 */
export function isLowPowerDevice(): boolean {
  const concurrency = navigator.hardwareConcurrency ?? 0;
  const lowCores = concurrency > 0 && concurrency <= 4;

  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return lowCores || isMobile;
}
