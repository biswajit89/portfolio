/**
 * GlassCard — the single card primitive used across the entire portfolio.
 * Encapsulates the glass-morphism border, background, deep shadow, and hover lift.
 *
 * Follows SRP: only responsible for card chrome, not content layout.
 */
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Extra hover glow on border + shadow */
  hoverable?: boolean;
  /** Padding preset */
  padding?: 'sm' | 'md' | 'lg';
}

const PADDING = { sm: 'p-4', md: 'p-5', lg: 'p-6 sm:p-8' } as const;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ hoverable = true, padding = 'md', className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden',
        'shadow-xl shadow-black/25 ring-1 ring-white/[0.03]',
        hoverable && 'hover:border-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/8 hover:-translate-y-1.5 transition-all duration-500 ease-out',
        className,
      )}
      {...rest}
    >
      {/* Top gradient accent — thinner, more refined */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" aria-hidden="true" />
      {/* Inner ambient glow */}
      <div className="absolute top-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-b from-primary-500/[0.03] to-transparent" aria-hidden="true" />
      <div className={cn(PADDING[padding], 'relative')}>
        {children}
      </div>
    </div>
  ),
);

GlassCard.displayName = 'GlassCard';
