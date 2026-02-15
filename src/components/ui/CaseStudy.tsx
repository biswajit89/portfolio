import { ArrowLeft, ExternalLink, Github, TrendingUp, Lightbulb, AlertCircle, Wrench, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFadeUp } from '@/lib/motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';
import { BulletList } from '@/components/ui/BulletList';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GhostButton } from '@/components/ui/GhostButton';
import type { Project } from '@/types/content';

export interface CaseStudyProps {
  project: Project;
  onBack?: () => void;
}

export function CaseStudy({ project, onBack }: CaseStudyProps) {
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {onBack && <BackButton onBack={onBack} />}
      <CaseHeader project={project} />
      <CaseLinks project={project} />
      <TechPills techStack={project.techStack} />

      <div className="grid gap-6 sm:grid-cols-2">
        <InfoSection delay={0.14} testId="section-problem" icon={<AlertCircle className="w-4 h-4 text-error-400" />} title="Problem">
          <p className="text-sm leading-relaxed text-surface-300">{project.problem}</p>
        </InfoSection>
        <InfoSection delay={0.18} testId="section-solution" icon={<Lightbulb className="w-4 h-4 text-warning-400" />} title="Solution">
          <p className="text-sm leading-relaxed text-surface-300">{project.solution}</p>
        </InfoSection>
      </div>

      <InfoSection delay={0.22} testId="section-architecture" icon={<LayoutDashboard className="w-4 h-4 text-primary-400" />} title="Architecture">
        <p className="text-sm leading-relaxed text-surface-300">{project.architecture}</p>
      </InfoSection>

      {project.screenshots.length > 0 && (
        <ScreenshotGallery project={project} active={activeScreenshot} onSelect={setActiveScreenshot} />
      )}

      {project.videoUrl && <VideoSection project={project} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <InfoSection delay={0.34} testId="section-results" icon={<TrendingUp className="w-4 h-4 text-success-400" />} title="Results">
          <BulletList items={project.impactMetrics} dotColor="bg-success-400" />
        </InfoSection>
        <InfoSection delay={0.38} testId="section-learnings" icon={<Wrench className="w-4 h-4 text-primary-400" />} title="Highlights">
          <BulletList items={project.highlights} dotColor="bg-primary-400" />
        </InfoSection>
      </div>
    </article>
  );
}

/* ── Small sub-components (SRP) ─────────────────────────────── */

function BackButton({ onBack }: { onBack: () => void }) {
  const fade = useFadeUp(0);
  return (
    <motion.button
      {...fade}
      type="button"
      onClick={onBack}
      data-testid="back-button"
      className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to projects
    </motion.button>
  );
}

function CaseHeader({ project }: { project: Project }) {
  const fade = useFadeUp(0.04);
  return (
    <motion.header {...fade} data-testid="section-overview">
      <h1 className="text-3xl sm:text-4xl font-bold text-surface-50 tracking-tight">{project.title}</h1>
      <p className="mt-2 text-sm text-surface-500">{project.role} · {project.duration}</p>
      <p className="mt-4 text-base text-surface-300 leading-relaxed max-w-2xl">{project.description}</p>
    </motion.header>
  );
}


function CaseLinks({ project }: { project: Project }) {
  const fade = useFadeUp(0.08);
  return (
    <motion.div {...fade} className="flex flex-wrap items-center gap-3">
      {project.liveUrl && (
        <PrimaryButton as="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-testid="live-demo-link" className="px-4 py-2 text-sm font-medium">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Live Demo
        </PrimaryButton>
      )}
      {project.repoUrl && (
        <GhostButton as="a" href={project.repoUrl} target="_blank" rel="noopener noreferrer" data-testid="repo-link" className="px-4 py-2 text-sm font-medium text-surface-300">
          <Github className="h-3.5 w-3.5" aria-hidden="true" /> Source
        </GhostButton>
      )}
    </motion.div>
  );
}

function TechPills({ techStack }: { techStack: string[] }) {
  const fade = useFadeUp(0.1);
  return (
    <motion.div {...fade} data-testid="section-tech-stack">
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Chip key={tech} size="sm">{tech}</Chip>
        ))}
      </div>
    </motion.div>
  );
}

function InfoSection({
  delay,
  testId,
  icon,
  title,
  children,
}: {
  delay: number;
  testId: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const fade = useFadeUp(delay);
  return (
    <motion.section {...fade} data-testid={testId}>
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400">{title}</h2>
        </div>
        {children}
      </GlassCard>
    </motion.section>
  );
}

function ScreenshotGallery({
  project,
  active,
  onSelect,
}: {
  project: Project;
  active: number;
  onSelect: (i: number) => void;
}) {
  const fade = useFadeUp(0.26);
  return (
    <motion.section {...fade} data-testid="section-screenshots">
      <GlassCard>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-4">Screenshots</h2>
        <div className="overflow-hidden rounded-lg">
          <img
            src={project.screenshots[active]}
            alt={`${project.title} screenshot ${active + 1}`}
            className="w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        {project.screenshots.length > 1 && (
          <div className="mt-3 flex gap-2" data-testid="screenshot-thumbnails">
            {project.screenshots.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onSelect(i)}
                className={cn(
                  'h-14 w-20 overflow-hidden rounded-lg border transition-all',
                  i === active
                    ? 'border-primary-500/50 ring-1 ring-primary-500/20'
                    : 'border-white/[0.06] hover:border-white/[0.12]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                )}
                aria-label={`View screenshot ${i + 1}`}
              >
                <img src={src} alt={`${project.title} thumbnail ${i + 1}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.section>
  );
}

function VideoSection({ project }: { project: Project }) {
  const fade = useFadeUp(0.3);
  return (
    <motion.section {...fade} data-testid="section-video">
      <GlassCard>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-4">Video</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <iframe
            src={project.videoUrl}
            title={`${project.title} video`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </GlassCard>
    </motion.section>
  );
}
