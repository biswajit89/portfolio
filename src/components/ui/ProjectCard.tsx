import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { EASE } from '@/lib/motion';
import { Chip } from '@/components/ui/Chip';
import type { ProjectCardProps } from '@/types/ui';

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const thumbnail = project.screenshots[0] ?? null;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(project.id)}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl text-left',
        'border border-white/[0.06] bg-white/[0.02]',
        'hover:border-primary-500/20 hover:bg-white/[0.04]',
        'shadow-xl shadow-black/25 ring-1 ring-white/[0.03] hover:shadow-2xl hover:shadow-primary-500/10',
        'transition-all duration-500 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      )}
      aria-label={`View project: ${project.title}`}
      initial={isReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: EASE }}
      whileHover={isReducedMotion ? undefined : { y: -6, scale: 1.02 }}
      whileTap={isReducedMotion ? undefined : { scale: 0.98 }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent z-10" aria-hidden="true" />
      <Thumbnail title={project.title} src={thumbnail} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-surface-50 group-hover:text-primary-400 transition-colors duration-200">
            {project.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-surface-500 group-hover:text-primary-400 transition-colors shrink-0 mt-0.5" />
        </div>

        <p className="mt-0.5 text-xs text-surface-500">{project.role}</p>
        <p className="mt-3 line-clamp-2 text-sm text-surface-400 leading-relaxed">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5" data-testid="tech-stack">
          {project.techStack.slice(0, 4).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
          {project.techStack.length > 4 && (
            <Chip className="text-surface-500">+{project.techStack.length - 4}</Chip>
          )}
        </div>

        <LinksRow project={project} />
      </div>
    </motion.button>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function Thumbnail({ title, src }: { title: string; src: string | null }) {
  const inner = (
    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[11px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      View case study <ArrowUpRight className="w-3 h-3" />
    </div>
  );

  if (src) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-900/30" data-testid="thumbnail">
        <img src={src} alt={`${title} screenshot`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {inner}
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary-500/10 to-primary-700/5 flex items-center justify-center" data-testid="thumbnail">
      <span className="text-4xl font-bold text-primary-500/20">{title[0]}</span>
      {inner}
    </div>
  );
}

function LinksRow({ project }: { project: ProjectCardProps['project'] }) {
  if (!project.liveUrl && !project.repoUrl) return null;

  return (
    <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/[0.04]">
      {project.liveUrl && (
        <span className="inline-flex items-center gap-1 text-[11px] text-surface-500">
          <ExternalLink className="w-3 h-3" /> Live
        </span>
      )}
      {project.repoUrl && (
        <span className="inline-flex items-center gap-1 text-[11px] text-surface-500">
          <Github className="w-3 h-3" /> Source
        </span>
      )}
      {project.impactMetrics[0] && (
        <span className="ml-auto text-[11px] text-primary-400/70 truncate max-w-[140px]">
          {project.impactMetrics[0]}
        </span>
      )}
    </div>
  );
}
