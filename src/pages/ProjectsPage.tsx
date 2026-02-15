import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { cn } from '@/lib/utils';
import { getProjects, filterProjects, ALL_PROJECT_CATEGORIES, PROJECT_CATEGORY_LABELS } from '@/utils/content';
import type { ProjectCategory } from '@/types/content';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { CaseStudy } from '@/components/ui/CaseStudy';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Chip } from '@/components/ui/Chip';
import { useAchievementStore } from '@/store/achievementStore';
import { useFadeUp, useHoverTap } from '@/lib/motion';

export default function ProjectsPage() {
  useDocumentHead({ title: 'Projects', description: 'Featured projects and case studies.', path: '/projects' });
  const allProjects = getProjects();
  const trackProjectView = useAchievementStore((s) => s.trackProjectView);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const filteredProjects = filterProjects(allProjects, activeCategory);
  const selectedProject = selectedProjectId ? allProjects.find((p) => p.id === selectedProjectId) ?? null : null;

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    trackProjectView(projectId);
  }, [trackProjectView]);

  if (selectedProject) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="case-study-heading">
        <h1 id="case-study-heading" className="sr-only">{selectedProject.title} — Case Study</h1>
        <CaseStudy project={selectedProject} onBack={() => setSelectedProjectId(null)} />
      </section>
    );
  }

  const allTech = new Set(allProjects.flatMap((p) => p.techStack));

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="projects-heading">
      <FadeSlide><SectionHeading title="Projects" id="projects-heading" /></FadeSlide>

      <SummaryStats count={allProjects.length} techCount={allTech.size} />
      <FilterBar active={activeCategory} onSelect={setActiveCategory} />

      <div aria-live="polite">
        {filteredProjects.length === 0 ? (
          <FadeSlide delay={0.1}>
            <p className="py-16 text-center text-surface-500" role="status">No projects found for this category.</p>
          </FadeSlide>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={handleSelectProject} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SummaryStats({ count, techCount }: { count: number; techCount: number }) {
  const fade = useFadeUp(0.04);
  return (
    <motion.div {...fade} className="mb-8 flex items-center gap-6 text-sm text-surface-400">
      <span className="flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-surface-500" />
        <span className="text-surface-100 font-semibold">{count}</span> projects
      </span>
      <span><span className="text-surface-100 font-semibold">{techCount}</span> technologies</span>
    </motion.div>
  );
}

function FilterBar({ active, onSelect }: { active: ProjectCategory | null; onSelect: (c: ProjectCategory | null) => void }) {
  const fade = useFadeUp(0.08);
  const { whileHover, whileTap } = useHoverTap(1.06, -1);
  const categories = [
    { cat: null as ProjectCategory | null, label: 'All' },
    ...ALL_PROJECT_CATEGORIES.map((c) => ({ cat: c as ProjectCategory | null, label: PROJECT_CATEGORY_LABELS[c] })),
  ];

  return (
    <motion.div {...fade} className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      {categories.map(({ cat, label }) => (
        <motion.button
          key={label}
          type="button"
          onClick={() => onSelect(cat)}
          aria-pressed={active === cat}
          whileHover={whileHover}
          whileTap={whileTap}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Chip
            variant={active === cat ? 'active' : 'default'}
            size="sm"
            className={cn('px-4 py-1.5 text-sm font-medium cursor-pointer', active !== cat && 'hover:text-surface-200 hover:bg-white/[0.04]')}
          >
            {label}
          </Chip>
        </motion.button>
      ))}
    </motion.div>
  );
}
