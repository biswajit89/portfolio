import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { getPublications } from '@/utils/content';
import { useFadeUp } from '@/lib/motion';
import type { Publication } from '@/types/content';

export default function PublicationsPage() {
  const publications = getPublications();
  useDocumentHead({ 
    title: 'Publications', 
    description: 'Research publications and academic contributions by Biswajit Nath.', 
    path: '/publications' 
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="publications-heading">
      <FadeSlide><SectionHeading title="Publications" id="publications-heading" /></FadeSlide>

      {publications.length === 0 ? (
        <motion.div {...useFadeUp(0.04)} className="text-center py-16">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10">
            <BookOpen className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-surface-100 mb-2">Coming Soon</h3>
          <p className="text-surface-400">Publications will be added here soon.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {publications.map((pub, idx) => (
            <PublicationCard key={pub.id} publication={pub} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
}

function PublicationCard({ publication, index }: { publication: Publication; index: number }) {
  return (
    <motion.div {...useFadeUp(0.04 * (index + 1))}>
      <GlassCard padding="lg" hoverable>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-surface-50 mb-2">{publication.title}</h3>
            <p className="text-sm text-surface-400 mb-2">{publication.authors.join(', ')}</p>
            <p className="text-sm text-surface-500 mb-3">
              {publication.venue} • {publication.year} • {publication.type}
            </p>
            {publication.abstract && (
              <p className="text-sm text-surface-400 leading-relaxed">{publication.abstract}</p>
            )}
          </div>
          {(publication.url || publication.doi) && (
            <a
              href={publication.url || `https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-primary-500/25 hover:bg-primary-500/5 transition-all"
              aria-label="View publication"
            >
              <ExternalLink className="w-4 h-4 text-surface-400" />
            </a>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
