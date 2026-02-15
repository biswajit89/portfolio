import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2 } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { getExperiences, sortExperiencesChronologically } from '@/utils/content';
import { useAchievementStore } from '@/store/achievementStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { useFadeUp, SPRING } from '@/lib/motion';
import { Chip } from '@/components/ui/Chip';
import { BulletList } from '@/components/ui/BulletList';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { formatDateRange } from '@/components/ui/ExperienceCard';
import type { Experience } from '@/types/content';

interface CompanyGroup {
  company: string;
  location: string;
  overallStart: string;
  overallEnd: string | null;
  roles: Experience[];
}

function groupByCompany(experiences: Experience[]): CompanyGroup[] {
  const sorted = sortExperiencesChronologically(experiences);
  const map = new Map<string, Experience[]>();
  for (const exp of sorted) {
    const list = map.get(exp.company) ?? [];
    list.push(exp);
    map.set(exp.company, list);
  }
  const groups: CompanyGroup[] = [];
  for (const [company, roles] of map) {
    const starts = roles.map((r) => r.startDate).sort();
    const ends = roles.map((r) => r.endDate);
    const overallEnd = ends.includes(null) ? null : (ends.filter(Boolean) as string[]).sort().pop() ?? null;
    groups.push({ company, location: roles[0].location, overallStart: starts[0], overallEnd, roles });
  }
  return groups;
}

export default function ExperiencePage() {
  useDocumentHead({
    title: 'Experience',
    description: 'Professional work history with achievements and tech stacks.',
    path: '/experience',
  });
  const experiences = getExperiences();
  const trackExperienceExpand = useAchievementStore((s) => s.trackExperienceExpand);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const groups = useMemo(() => groupByCompany(experiences), [experiences]);

  const handleToggle = useCallback(
    (id: string) => {
      const isExpanding = expandedId !== id;
      setExpandedId(isExpanding ? id : null);
      if (isExpanding) trackExperienceExpand(id);
    },
    [expandedId, trackExperienceExpand],
  );

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="experience-heading">
      <FadeSlide>
        <SectionHeading title="Experience" id="experience-heading" />
      </FadeSlide>

      {/* Main timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/25 via-primary-500/8 to-transparent" aria-hidden="true" />

        <div className="space-y-10">
          {groups.map((group, gi) => (
            <CompanyBlock
              key={group.company}
              group={group}
              index={gi}
              expandedId={expandedId}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyBlock({ group, index, expandedId, onToggle }: {
  group: CompanyGroup;
  index: number;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const fade = useFadeUp(index * 0.1);
  const duration = formatDateRange(group.overallStart, group.overallEnd);
  const isCurrent = group.overallEnd === null;

  return (
    <motion.div {...fade} className="relative pl-9 sm:pl-12">
      {/* Company dot on timeline */}
      <div className="absolute left-1 sm:left-3 top-1.5" aria-hidden="true">
        <div className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
          isCurrent
            ? 'border-primary-400 bg-primary-500/15 shadow-lg shadow-primary-500/25'
            : 'border-white/[0.12] bg-surface-950',
        )}>
          <Building2 className={cn('w-2.5 h-2.5', isCurrent ? 'text-primary-400' : 'text-surface-500')} />
        </div>
      </div>

      {/* Company header */}
      <div className="mb-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-surface-50">{group.company}</h3>
          {isCurrent && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
        </div>
        <p className="text-xs text-surface-500 mt-0.5">{group.location} · {duration}</p>
      </div>

      {/* Roles within company */}
      <div className="relative space-y-3">
        {/* Inner role connector line */}
        {group.roles.length > 1 && (
          <div className="absolute left-2.5 top-3 bottom-3 w-px bg-white/[0.06]" aria-hidden="true" />
        )}

        {group.roles.map((role, ri) => (
          <RoleCard
            key={role.id}
            role={role}
            isFirst={ri === 0}
            hasMultiple={group.roles.length > 1}
            isExpanded={expandedId === role.id}
            onToggle={() => onToggle(role.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RoleCard({ role, isFirst, hasMultiple, isExpanded, onToggle }: {
  role: Experience;
  isFirst: boolean;
  hasMultiple: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const duration = formatDateRange(role.startDate, role.endDate);

  return (
    <div className={cn(
      'relative rounded-xl transition-all duration-300',
      hasMultiple ? 'pl-7' : 'pl-0',
      isExpanded ? 'bg-white/[0.025] border border-white/[0.06] shadow-lg shadow-black/15' : 'hover:bg-white/[0.015]',
    )}>
      {/* Role dot */}
      {hasMultiple && (
        <div className={cn(
          'absolute left-1 top-4 w-[7px] h-[7px] rounded-full',
          isFirst ? 'bg-primary-400 shadow-sm shadow-primary-400/40' : 'bg-surface-600 border border-surface-500',
        )} aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={cn('text-sm font-semibold', isFirst ? 'text-surface-50' : 'text-surface-200')}>
              {role.role}
            </p>
            {isFirst && role.endDate === null && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-label="Current role" />
            )}
          </div>
          <p className="text-xs text-surface-500 mt-0.5">{duration}</p>

          {!isExpanded && (
            <div className="mt-2 flex flex-wrap gap-1" data-testid="tech-stack">
              {role.techStack.slice(0, 5).map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
              {role.techStack.length > 5 && (
                <Chip className="text-surface-500">+{role.techStack.length - 5}</Chip>
              )}
            </div>
          )}
        </div>

        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={isReducedMotion ? { duration: 0 } : SPRING}
          className="mt-1 shrink-0 text-surface-500"
          aria-hidden="true"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="details"
            initial={isReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={isReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={isReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <div className="flex flex-wrap gap-1.5" data-testid="tech-stack">
                {role.techStack.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>

              {role.summary.length > 0 && (
                <div className="space-y-1">
                  {role.summary.map((s) => (
                    <p key={s} className="text-sm text-surface-300 leading-relaxed">{s}</p>
                  ))}
                </div>
              )}

              {role.achievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Achievements</h4>
                  <BulletList items={role.achievements} dotColor="bg-primary-500/50" data-testid="achievements-full" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
