import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { getEducation, sortEducationChronologically } from '@/utils/content';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BulletList } from '@/components/ui/BulletList';
import { Chip } from '@/components/ui/Chip';
import { useFadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

function formatRange(start: string, end: string): string {
  return `${start.split('-')[0]} – ${end.split('-')[0]}`;
}

function getDegreeIcon(degree: string) {
  if (/master/i.test(degree)) return Award;
  if (/bachelor/i.test(degree)) return GraduationCap;
  return BookOpen;
}

function getDegreeTag(degree: string): string | null {
  if (/master/i.test(degree)) return 'Masters';
  if (/bachelor/i.test(degree)) return 'Bachelors';
  return null;
}

export default function EducationPage() {
  useDocumentHead({
    title: 'Education',
    description: 'Educational background and academic highlights.',
    path: '/education',
  });
  const education = sortEducationChronologically(getEducation());

  return (
    <section
      className="mx-auto max-w-4xl px-6 py-24"
      aria-labelledby="education-heading"
    >
      <FadeSlide>
        <SectionHeading title="Education" id="education-heading" />
      </FadeSlide>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary-500/30 via-primary-500/10 to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-0">
          {education.map((entry, i) => (
            <EducationEntry
              key={entry.id}
              entry={entry}
              index={i}
              isFirst={i === 0}
              isLast={i === education.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationEntry({
  entry,
  index,
  isFirst,
  isLast,
}: {
  entry: ReturnType<typeof getEducation>[number];
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const fade = useFadeUp(0.06 + index * 0.1);
  const Icon = getDegreeIcon(entry.degree);
  const tag = getDegreeTag(entry.degree);
  const years = formatRange(entry.startDate, entry.endDate);
  const hasHighlights = entry.highlights.length > 0;

  return (
    <motion.article
      {...fade}
      data-testid={`education-entry-${entry.id}`}
      className={cn('relative pl-12 sm:pl-16', isLast ? 'pb-0' : 'pb-10')}
    >
      {/* Timeline node */}
      <div className="absolute left-2 sm:left-4 top-1" aria-hidden="true">
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border-2',
            isFirst
              ? 'border-primary-400 bg-primary-500/20 shadow-md shadow-primary-500/25'
              : 'border-white/[0.12] bg-surface-950',
          )}
        >
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isFirst ? 'bg-primary-400' : 'bg-surface-600',
            )}
          />
        </div>
      </div>

      {/* Year badge — floats left of the card on larger screens */}
      <div className="mb-2 flex items-center gap-2">
        <span
          data-testid="education-dates"
          className="text-xs font-medium text-surface-500 tabular-nums tracking-wide"
        >
          {years}
        </span>
        {tag && (
          <Chip variant="premium" size="xs">
            {tag}
          </Chip>
        )}
      </div>

      {/* Card */}
      <div
        className={cn(
          'relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden',
          'shadow-lg shadow-black/20',
          'hover:border-primary-500/15 hover:shadow-xl hover:shadow-primary-500/6',
          'transition-all duration-500 ease-out',
        )}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-400/25 to-transparent"
          aria-hidden="true"
        />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            {/* Icon */}
            <div
              className={cn(
                'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                'border border-white/[0.06] bg-white/[0.03]',
                'shadow-sm shadow-black/10',
              )}
            >
              <Icon className="w-4.5 h-4.5 text-primary-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h2
                data-testid="education-institution"
                className="text-base font-semibold text-surface-50 leading-snug"
              >
                {entry.institution}
              </h2>
              <p
                data-testid="education-degree"
                className="mt-1 text-sm text-surface-300"
              >
                {entry.degree},{' '}
                <span data-testid="education-field" className="text-surface-400">
                  {entry.field}
                </span>
              </p>
            </div>
          </div>

          {hasHighlights && (
            <div className="mt-4 ml-[3.375rem]" data-testid="education-highlights">
              <BulletList
                items={entry.highlights}
                dotColor="bg-primary-500/50"
                className="space-y-1.5"
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
