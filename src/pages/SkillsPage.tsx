import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { cn } from '@/lib/utils';
import { getSkills } from '@/utils/content';
import { SkillMatrix } from '@/components/ui/SkillMatrix';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useAchievementStore } from '@/store/achievementStore';
import { useFadeUp } from '@/lib/motion';

export default function SkillsPage() {
  useDocumentHead({ title: 'Skills', description: 'Technical skills with proficiency levels and proof links.', path: '/skills' });
  const skills = getSkills();
  const navigate = useNavigate();
  const trackProofLinkClick = useAchievementStore((s) => s.trackProofLinkClick);
  const [proofMode, setProofMode] = useState(false);

  const handleProofClick = useCallback((skillId: string, proofLinkId: string) => {
    trackProofLinkClick();
    for (const category of skills) {
      const skill = category.skills.find((s) => s.id === skillId);
      if (skill) {
        const link = skill.proofLinks.find((pl) => pl.id === proofLinkId);
        if (link) {
          if (link.type === 'project') navigate('/projects', { state: { selectedProjectId: link.id } });
          else if (link.type === 'experience') navigate('/experience', { state: { expandExperienceId: link.id } });
        }
        break;
      }
    }
  }, [skills, trackProofLinkClick, navigate]);

  const totalSkills = skills.reduce((sum, cat) => sum + cat.skills.length, 0);
  const avgProficiency = (
    skills.reduce((sum, cat) => sum + cat.skills.reduce((s, sk) => s + sk.proficiency, 0), 0) / totalSkills
  ).toFixed(1);

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="skills-heading">
      <FadeSlide><SectionHeading title="Skills" id="skills-heading" /></FadeSlide>

      <SummaryBar totalSkills={totalSkills} categories={skills.length} avg={avgProficiency} proofMode={proofMode} onToggle={() => setProofMode((p) => !p)} />
      <SkillMatrix skills={skills} proofMode={proofMode} onProofClick={handleProofClick} />
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SummaryBar({ totalSkills, categories, avg, proofMode, onToggle }: {
  totalSkills: number; categories: number; avg: string; proofMode: boolean; onToggle: () => void;
}) {
  const fade = useFadeUp(0.04);

  return (
    <motion.div {...fade} className="mb-8 flex flex-wrap items-center gap-4 text-xs text-surface-500">
      <span>{totalSkills} skills · {categories} categories · {avg} avg</span>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={proofMode}
          aria-label="Toggle proof mode"
          onClick={onToggle}
          className={cn(
            'relative inline-flex h-5 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            proofMode ? 'bg-primary-500' : 'bg-white/10',
          )}
        >
          <span className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5',
            proofMode ? 'translate-x-3.5' : 'translate-x-0.5',
          )} />
        </button>
        <span className={cn('text-xs', proofMode ? 'text-primary-300' : 'text-surface-500')}>Proof</span>
      </div>
    </motion.div>
  );
}

