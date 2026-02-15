import { motion } from 'framer-motion';
import { MapPin, Coffee, Rocket, Users, Code2, BookOpen, Gamepad2 } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { getProfile } from '@/utils/content';
import { useUIStore } from '@/store/uiStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { Chip } from '@/components/ui/Chip';
import { useFadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const STRENGTHS = [
  { title: 'Performance', icon: '⚡' },
  { title: 'UI Systems', icon: '🧩' },
  { title: 'Security', icon: '🔒' },
  { title: 'Observability', icon: '📊' },
  { title: 'DX', icon: '🛠️' },
];

const WORK_STYLE = [
  { icon: Code2, text: 'Ship clean, readable code over clever code' },
  { icon: Users, text: 'Async-first communication, docs over meetings' },
  { icon: Rocket, text: 'Prototype fast, iterate with real feedback' },
  { icon: Coffee, text: 'Deep work blocks — no context switching' },
];

const CURRENTLY_INTO = [
  'LLM-powered dev tools',
  'Snowflake optimization',
  'System design patterns',
  'Open source contributions',
];

const OUTSIDE_WORK = [
  { icon: BookOpen, text: 'Reading tech blogs & research papers' },
  { icon: Gamepad2, text: 'Strategy games & puzzles' },
];

export default function AboutPage() {
  const profile = getProfile();
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  useDocumentHead({ title: 'About', description: `Learn about ${profile.name}'s approach and background.`, path: '/about' });

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24" aria-labelledby="about-heading">
      <FadeSlide><SectionHeading title="About" id="about-heading" /></FadeSlide>

      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-3">
          <BioSection profile={profile} />
          <StrengthsSection isReducedMotion={isReducedMotion} />
        </div>

        <div className="lg:col-span-2">
          <Sidebar />
        </div>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function BioSection({ profile }: { profile: ReturnType<typeof getProfile> }) {
  const bioFade = useFadeUp(0.06);
  const locFade = useFadeUp(0.1);

  return (
    <div className="mb-12">
      <motion.p {...bioFade} className="text-lg text-surface-200 leading-relaxed mb-4" data-testid="narrative">
        {profile.summary}
      </motion.p>
      <motion.div {...locFade} className="flex items-center gap-2 text-sm text-surface-400">
        <MapPin className="w-3.5 h-3.5" /> {profile.location}
      </motion.div>
    </div>
  );
}

function StrengthsSection({ isReducedMotion }: { isReducedMotion: boolean }) {
  const fade = useFadeUp(0.14);

  return (
    <motion.div {...fade} data-testid="strengths-grid">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-4">What I focus on</h2>
      <div className="flex flex-wrap gap-2">
        {STRENGTHS.map((s, i) => (
          <motion.span
            key={s.title}
            data-testid={`strength-card-${s.title.toLowerCase().replace(/\s+/g, '-')}`}
            whileHover={isReducedMotion ? {} : { scale: 1.06, y: -2 }}
            initial={isReducedMotion ? {} : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.14 + i * 0.05 }}
          >
            <Chip size="sm" className="px-4 py-2 text-sm text-surface-200 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-primary-500/8 cursor-default">
              <span aria-hidden="true">{s.icon}</span> {s.title}
            </Chip>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

function Sidebar() {
  const fade = useFadeUp(0.18);

  return (
    <motion.div {...fade} data-testid="sidebar" className="space-y-8">
      {/* How I work */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-4">How I work</h2>
        <div className="space-y-3">
          {WORK_STYLE.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className={cn(
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                'border border-white/[0.06] bg-white/[0.02]',
              )}>
                <Icon className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <p className="text-[13px] text-surface-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Currently into */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-3">Currently exploring</h2>
        <div className="flex flex-wrap gap-1.5">
          {CURRENTLY_INTO.map((item) => (
            <Chip key={item} size="xs" className="text-surface-300">{item}</Chip>
          ))}
        </div>
      </div>

      {/* Outside work */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-3">Outside work</h2>
        <div className="space-y-2.5">
          {OUTSIDE_WORK.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <Icon className="w-3.5 h-3.5 text-surface-500" />
              <span className="text-[13px] text-surface-300">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
