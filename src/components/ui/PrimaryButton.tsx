/**
 * PrimaryButton — solid purple CTA button with shadow, hover lift, and tap press.
 * Used for Resume download, Live Demo, form submit, etc.
 */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHoverTap } from '@/lib/motion';

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as anchor instead of button */
  as?: 'button' | 'a';
  href?: string;
  download?: boolean;
  target?: string;
  rel?: string;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ as = 'button', className, children, disabled, ...rest }, ref) => {
    const { whileHover, whileTap } = useHoverTap(1.04, -2);
    const Tag = as === 'a' ? motion.a : motion.button;

    return (
      <Tag
        ref={ref as never}
        className={cn(
          'relative inline-flex items-center gap-2 rounded-xl px-6 py-3 overflow-hidden',
          'bg-gradient-to-b from-primary-400 to-primary-600',
          'text-sm font-semibold text-white tracking-wide',
          'shadow-xl shadow-primary-500/25',
          'hover:shadow-2xl hover:shadow-primary-500/35',
          'transition-all duration-400 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          disabled && 'opacity-60 cursor-not-allowed shadow-none',
          className,
        )}
        whileHover={disabled ? {} : whileHover}
        whileTap={disabled ? {} : whileTap}
        disabled={as === 'button' ? disabled : undefined}
        {...(rest as Record<string, unknown>)}
      >
        {/* Top shine line */}
        <span className="absolute top-0 inset-x-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />
        {/* Inner highlight */}
        <span className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none" aria-hidden="true" />
        <span className="relative flex items-center gap-2">{children}</span>
      </Tag>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';
