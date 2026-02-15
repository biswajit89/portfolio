/**
 * Shared animation presets — single source of truth for all motion config.
 * Eliminates the repeated `fadeUp` helper across 10+ files.
 */
import { useUIStore } from '@/store/uiStore';

/** Standard easing curve used across the portfolio */
export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Spring config for interactive elements */
export const SPRING = { type: 'spring' as const, stiffness: 300, damping: 25 };

/**
 * Returns framer-motion props for a fade-up-on-scroll animation.
 * Respects reduced motion preference automatically.
 *
 * Usage: `<motion.div {...useFadeUp(0.1)}>`
 */
export function useFadeUp(delay = 0, y = 20) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  if (isReducedMotion) return {};
  return {
    initial: { opacity: 0, y } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: '-60px' as const },
    transition: { duration: 0.45, delay, ease: EASE },
  };
}

/**
 * Hover + tap variants for buttons and interactive cards.
 * Returns empty objects when reduced motion is on.
 */
export function useHoverTap(scale = 1.04, yOffset = -2) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  if (isReducedMotion) return { whileHover: {}, whileTap: {} };
  return {
    whileHover: { scale, y: yOffset },
    whileTap: { scale: scale - 0.06 },
  };
}
