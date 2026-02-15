/**
 * GhostButton — outlined / transparent button with border, shadow, hover lift.
 * Used for Contact CTA, Source links, filter pills (inactive state), etc.
 */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHoverTap } from '@/lib/motion';

export interface GhostButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ as = 'button', className, children, ...rest }, ref) => {
    const { whileHover, whileTap } = useHoverTap(1.04, -2);
    const Tag = as === 'a' ? motion.a : motion.button;

    return (
      <Tag
        ref={ref as never}
        className={cn(
          'relative inline-flex items-center gap-2 rounded-xl overflow-hidden',
          'border border-white/[0.08] px-6 py-3',
          'text-sm font-semibold text-surface-200 tracking-wide',
          'shadow-lg shadow-black/20',
          'hover:border-white/[0.15] hover:bg-white/[0.03] hover:shadow-xl hover:shadow-black/25',
          'transition-all duration-400 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className,
        )}
        whileHover={whileHover}
        whileTap={whileTap}
        {...(rest as Record<string, unknown>)}
      >
        {/* Top gradient shine */}
        <span className="absolute top-0 inset-x-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" aria-hidden="true" />
        <span className="relative flex items-center gap-2">{children}</span>
      </Tag>
    );
  },
);

GhostButton.displayName = 'GhostButton';
