import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useFadeUp } from '@/lib/motion';
import type { SkillMatrixProps } from '@/types/ui';

function Dots({ level, id }: { level: number; id: string }) {
  return (
    <div
      className="flex gap-1"
      role="meter"
      aria-label={`Proficiency: ${level} out of 5`}
      aria-valuenow={level}
      aria-valuemin={1}
      aria-valuemax={5}
      data-testid={`proficiency-${id}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-colors',
            i < level
              ? level >= 5 ? 'bg-primary-400 shadow-sm shadow-primary-400/50' : 'bg-primary-400/70'
              : 'bg-white/[0.06]',
          )}
        />
      ))}
    </div>
  );
}

export function SkillMatrix({ skills, proofMode, onProofClick }: SkillMatrixProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((category, i) => (
        <CategoryCard
          key={category.name}
          category={category}
          index={i}
          proofMode={proofMode}
          onProofClick={onProofClick}
        />
      ))}
    </div>
  );
}

function CategoryCard({
  category,
  index,
  proofMode,
  onProofClick,
}: {
  category: SkillMatrixProps['skills'][number];
  index: number;
  proofMode: boolean;
  onProofClick: SkillMatrixProps['onProofClick'];
}) {
  const fade = useFadeUp(index * 0.08);
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);

  return (
    <motion.div
      {...fade}
      data-testid={`skill-category-${category.name}`}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-xl shadow-black/20 overflow-hidden hover:border-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/8 hover:-translate-y-1.5 transition-all duration-500 ease-out"
    >
      {/* Top gradient accent border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 h-12 pointer-events-none bg-gradient-to-b from-primary-500/[0.03] to-transparent" aria-hidden="true" />

      <div className="p-5 pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-surface-500 mb-4">
          {category.name}
        </h3>

        <div className="space-y-3.5">
          {category.skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              data-testid={`skill-${skill.id}`}
              className="flex items-center justify-between rounded-lg px-2 py-1 -mx-2 hover:bg-white/[0.03] transition-colors"
              initial={isReducedMotion ? {} : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 + i * 0.04 }}
            >
              <span className={cn(
                'text-[13px]',
                skill.proficiency >= 5 ? 'text-primary-300 font-semibold' : 'text-surface-200',
              )}>
                {skill.name}
              </span>
              <Dots level={skill.proficiency} id={skill.id} />
            </motion.div>
          ))}
        </div>

        {proofMode && (
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap gap-1.5">
            {category.skills.flatMap((skill) =>
              skill.proofLinks.map((link) => (
                <button
                  key={`${skill.id}-${link.type}-${link.id}`}
                  type="button"
                  onClick={() => onProofClick(skill.id, link.id)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]',
                    'bg-primary-500/10 text-primary-300/80 hover:bg-primary-500/20 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  )}
                  data-testid={`proof-links-${skill.id}`}
                >
                  <span className="opacity-50">{link.type === 'project' ? '↗' : '◆'}</span>
                  {link.description}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
