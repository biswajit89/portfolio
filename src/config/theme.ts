/**
 * ═══════════════════════════════════════════════════════════════
 * CENTRALIZED THEME CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Change colors, fonts, spacing, shadows, and border radius here.
 * Every component reads from CSS custom properties set by this file.
 *
 * To change the entire look: edit the values below, that's it.
 */

// ─── Color Palette ─────────────────────────────────────────────
// Edit these to change the brand color across the entire app.
export const palette = {
  primary:      '#9333ea',
  primaryLight: '#a855f7',
  primaryDark:  '#7c3aed',
  accent:       '#c084fc',
  success:      '#22c55e',
  warning:      '#f59e0b',
  error:        '#ef4444',
} as const;

// ─── Fonts ─────────────────────────────────────────────────────
// Change these to swap the entire app's typography.
export const fonts = {
  sans:    '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono:    '"JetBrains Mono", ui-monospace, monospace',
  heading: '"Inter", ui-sans-serif, system-ui, sans-serif',
} as const;

// ─── Border Radius ─────────────────────────────────────────────
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
  button: '12px',
  card: '16px',
  input: '12px',
  tag: '8px',
  nav: '12px',
} as const;

// ─── Spacing (Tailwind classes) ────────────────────────────────
export const spacing = {
  sectionY: 'py-20 md:py-28',
  sectionX: 'px-6',
  cardPadding: 'p-8 md:p-10',
  gap: 'gap-8',
} as const;

// ─── Derived values (computed from palette) ────────────────────
// These are used by CSS and inline styles. They auto-update when
// you change the palette above.

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

const p  = hexToRgb(palette.primary);
const pl = hexToRgb(palette.primaryLight);
const pd = hexToRgb(palette.primaryDark);
const a  = hexToRgb(palette.accent);

export const rgb = { p, pl, pd, a } as const;

// ─── Gradients ─────────────────────────────────────────────────
export const gradients = {
  primary:     `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark}, ${palette.primaryLight})`,
  primarySoft: `linear-gradient(135deg, rgba(${p},0.8), rgba(${pd},0.6))`,
  accent:      `linear-gradient(135deg, rgba(${p},0.2), rgba(${pl},0.1))`,
  card:        `linear-gradient(145deg, rgba(${p},0.1), rgba(${pl},0.05))`,
  cardHover:   `linear-gradient(145deg, rgba(${p},0.15), rgba(${pl},0.08))`,
  text:        `linear-gradient(135deg, ${palette.primaryLight}, ${palette.primaryDark}, ${palette.accent})`,
  glow:        `radial-gradient(circle, rgba(${p},0.4), transparent 60%)`,
  timeline:    `linear-gradient(to bottom, rgba(${p},0.5), rgba(${a},0.3), transparent)`,
  underline:   `linear-gradient(90deg, rgba(${p},0.7), rgba(${a},0.6), rgba(${p},0.7))`,
  shimmer:     `linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(${p},0.9) 25%, rgba(${a},0.9) 50%, rgba(${p},0.9) 75%, rgba(255,255,255,0.7) 100%)`,
} as const;

// ─── Shadows ───────────────────────────────────────────────────
export const shadows = {
  sm:          `0 2px 8px rgba(0,0,0,0.12)`,
  md:          `0 4px 16px rgba(0,0,0,0.15)`,
  lg:          `0 8px 32px rgba(0,0,0,0.18)`,
  xl:          `0 12px 48px rgba(0,0,0,0.22)`,
  glow:        `0 0 20px rgba(${p},0.2)`,
  button:      `0 4px 16px rgba(${p},0.25)`,
  buttonHover: `0 8px 24px rgba(${p},0.35)`,
  card:        `0 4px 24px rgba(0,0,0,0.12)`,
  cardHover:   `0 8px 32px rgba(0,0,0,0.18)`,
  icon:        `0 4px 12px rgba(${p},0.3)`,
} as const;

// ─── Bubble config ─────────────────────────────────────────────
export const bubbles = {
  color:  `rgba(${p},0.12)`,
  border: `rgba(${pl},0.15)`,
  glow:   `rgba(${p},0.08)`,
} as const;

// ─── Legacy "theme" export for backward compat ─────────────────
export const theme = {
  colors: {
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,
    primaryMuted: `rgba(${p},0.15)`,
    accent: palette.accent,
    accentMuted: `rgba(${a},0.2)`,
    bgDark: '#000000',
    bgCard: 'rgba(255,255,255,0.95)',
    bgCardDark: `rgba(${p},0.08)`,
    bgSubtle: `rgba(${p},0.05)`,
    textWhite: '#ffffff',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDark: '#111827',
    textDarkSecondary: '#6b7280',
    success: palette.success,
    successMuted: 'rgba(34,197,94,0.15)',
    warning: palette.warning,
    error: palette.error,
    borderLight: `rgba(${pl},0.2)`,
    borderMedium: `rgba(${pl},0.3)`,
    borderSubtle: 'rgba(255,255,255,0.08)',
  },
  gradients,
  shadows,
  radius,
  spacing,
  fonts,
  bubbles,
} as const;

// ─── Helpers ───────────────────────────────────────────────────
export function themeGradient(key: keyof typeof gradients): string {
  return gradients[key];
}
export function themeShadow(key: keyof typeof shadows): string {
  return shadows[key];
}
export function themeColor(key: keyof typeof theme.colors): string {
  return theme.colors[key];
}
