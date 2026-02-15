/**
 * Chip — reusable pill / badge / tag used for tech stacks, skill tags,
 * filter pills, and strength badges across the portfolio.
 *
 * Follows SRP: only responsible for chip chrome.
 */
import { cn } from '@/lib/utils';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: 'default' | 'active' | 'premium';
  /** Smaller text for inline tech badges */
  size?: 'xs' | 'sm';
}

export function Chip({
  variant = 'default',
  size = 'xs',
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-all duration-300',
        size === 'xs' && 'px-2.5 py-0.5 text-[11px]',
        size === 'sm' && 'px-3.5 py-1 text-xs',
        variant === 'default' &&
          'border border-white/[0.06] bg-white/[0.03] text-surface-400 shadow-sm shadow-black/15 hover:border-primary-500/15 hover:bg-white/[0.06]',
        variant === 'active' &&
          'bg-primary-500 text-white shadow-lg shadow-primary-500/20',
        variant === 'premium' &&
          'border border-primary-400/25 bg-primary-500/10 text-primary-300 shadow-lg shadow-primary-500/15 ring-1 ring-primary-400/20',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
