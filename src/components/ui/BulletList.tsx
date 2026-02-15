/**
 * BulletList — reusable list with colored dot indicators.
 * Used in ExperienceCard achievements, CaseStudy results/highlights,
 * and EducationPage highlights.
 */
import { cn } from '@/lib/utils';

export interface BulletListProps {
  items: string[];
  /** Tailwind color class for the dot, e.g. 'bg-primary-500' */
  dotColor?: string;
  className?: string;
  'data-testid'?: string;
}

export function BulletList({
  items,
  dotColor = 'bg-primary-500',
  className,
  ...rest
}: BulletListProps) {
  return (
    <ul className={cn('space-y-1.5', className)} {...rest}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-surface-300">
          <span
            className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', dotColor)}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
