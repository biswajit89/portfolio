import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { SPRING } from '@/lib/motion';
import { Chip } from '@/components/ui/Chip';
import { BulletList } from '@/components/ui/BulletList';
import type { ExperienceCardProps } from '@/types/ui';

export function formatDateRange(startDate: string, endDate: string | null): string {
  const format = (d: string) => {
    const [year, month] = d.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return `${format(startDate)} – ${endDate ? format(endDate) : 'Present'}`;
}

interface Props extends ExperienceCardProps {
  /** When true, renders without its own card chrome (used inside company group) */
  compact?: boolean;
}

export function ExperienceCard({ experience, isExpanded, onToggle, compact }: Props) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const duration = formatDateRange(experience.startDate, experience.endDate);

  return (
    <div className={cn(
      'transition-all duration-300',
      !compact && 'relative rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/[0.04]',
      !compact && isExpanded && 'border-primary-500/25 shadow-2xl shadow-primary-500/10',
      compact && 'rounded-lg',
      compact && isExpanded && 'bg-white/[0.02]',
    )}>
      {!compact && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={cn(
          'flex w-full items-start justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          compact ? 'px-3 py-3' : 'p-5',
        )}
      >
        <div className="min-w-0 flex-1">
          {!compact && <h3 className="text-base font-semibold text-surface-50">{experience.company}</h3>}
          <p className={cn(compact ? 'text-sm font-semibold text-surface-100' : 'text-sm text-primary-400')}>
            {experience.role}
          </p>
          <p className="mt-0.5 text-xs text-surface-500" data-testid="duration">
            {duration}{experience.isRemote && ' · Remote'}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5" data-testid="tech-stack">
            {experience.techStack.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>

          {!isExpanded && experience.achievements.length > 0 && (
            <BulletList
              items={experience.achievements.slice(0, 2)}
              dotColor="bg-primary-500/40"
              className="mt-2"
              data-testid="achievements-preview"
            />
          )}
        </div>

        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={isReducedMotion ? { duration: 0 } : SPRING}
          className="mt-1 shrink-0 text-surface-500"
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="details"
            initial={isReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={isReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={isReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={cn(
              'border-t border-white/[0.04] pt-3 pb-4 space-y-3',
              compact ? 'px-3' : 'px-5',
            )}>
              {experience.summary.length > 0 && (
                <div>{experience.summary.map((s) => (
                  <p key={s} className="text-sm text-surface-300 leading-relaxed">{s}</p>
                ))}</div>
              )}

              <div>
                <h4 className="mb-2 text-sm font-semibold text-surface-200">Key Achievements</h4>
                <BulletList items={experience.achievements} data-testid="achievements-full" />
              </div>

              {experience.artifacts.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-surface-200">Artifacts</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.artifacts.map((artifact) => (
                      <a
                        key={artifact.url}
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-primary-400 hover:border-primary-500/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {artifact.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
