import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { getProfile } from '@/utils/content';
import { useUIStore } from '@/store/uiStore';
import { EASE } from '@/lib/motion';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GhostButton } from '@/components/ui/GhostButton';

export function getAvailabilityConfig(status: string) {
  switch (status) {
    case 'available':
      return { text: 'Available for hire', dotClass: 'bg-green-400' };
    case 'open':
      return { text: 'Open to opportunities', dotClass: 'bg-amber-400' };
    case 'not-looking':
      return { text: 'Not currently looking', dotClass: 'bg-slate-400' };
    default:
      return { text: status, dotClass: 'bg-slate-400' };
  }
}

const STAT_CONFIG: Record<string, { section: string }> = {
  calendar: { section: 'experience' },
  building: { section: 'experience' },
  shield: { section: 'skills' },
  zap: { section: 'skills' },
};

export default function HomePage() {
  const profile = getProfile();
  useDocumentHead({ title: profile.name, description: profile.summary, path: '/' });
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const availability = getAvailabilityConfig(profile.availability);

  const heroSkillNames = ['Java', 'Spring Boot', 'Microservices', 'Solr', 'Snowflake', 'React'];
  const premiumSkills = new Set(['Java', 'Snowflake', 'React']);
  const topSkills = heroSkillNames;

  const fadeUp = (delay: number) =>
    isReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <DecorativeBlob position="top-right" isReducedMotion={isReducedMotion} />
      <DecorativeBlob position="bottom-left" isReducedMotion={isReducedMotion} />

      <div className="w-full max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col items-center text-center">
          <AvatarSection profile={profile} fadeUp={fadeUp} />

          <motion.div {...fadeUp(0.06)} className="flex items-center gap-2 text-sm text-surface-400 mb-6">
            <AvailabilityDot dotClass={availability.dotClass} isReducedMotion={isReducedMotion} />
            {availability.text}
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1] bg-clip-text text-transparent"
            style={{
              fontFamily: '"Roboto", var(--font-heading)',
              letterSpacing: '-0.04em',
              backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #ffffff 100%)',
            }}
          >
            {profile.name}
          </motion.h1>

          <motion.p {...fadeUp(0.15)} className="mt-4 text-xl sm:text-2xl text-primary-400 font-medium">
            {profile.title}
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="flex flex-wrap justify-center gap-2 mt-6">
            {topSkills.map((name, i) => (
              <motion.span
                key={name}
                whileHover={isReducedMotion ? {} : { scale: 1.08, y: -2 }}
                initial={isReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              >
                <Chip size="sm" variant={premiumSkills.has(name) ? 'premium' : 'default'} className="cursor-default text-surface-300">{name}</Chip>
              </motion.span>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.26)} className="flex items-center gap-3 mt-10">
            <PrimaryButton as="a" href={profile.resumeURL} download>
              <Download className="w-4 h-4" /> Resume
            </PrimaryButton>
            <GhostButton as="a" href="#contact">
              Contact <ArrowRight className="w-4 h-4" />
            </GhostButton>
          </motion.div>

          <motion.div {...fadeUp(0.32)} className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mt-14 text-sm">
            {profile.stats.map((stat, i) => {
              const section = STAT_CONFIG[stat.icon]?.section ?? 'home';
              return (
                <motion.span key={stat.label} className="inline-flex items-center gap-x-5">
                  {i > 0 && <span className="text-surface-700 select-none" aria-hidden="true">·</span>}
                  <a
                    href={`#${section}`}
                    className="inline-flex items-baseline gap-1.5 text-surface-400 hover:text-surface-200 transition-colors duration-300"
                  >
                    <span className="text-lg font-bold text-surface-100 tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</span>
                    <span className="text-[11px] uppercase tracking-widest">{stat.label}</span>
                  </a>
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {!isReducedMotion && <ScrollIndicator />}
    </section>
  );
}

/* ── Sub-components (SRP) ───────────────────────────────────── */

function DecorativeBlob({ position, isReducedMotion }: { position: 'top-right' | 'bottom-left'; isReducedMotion: boolean }) {
  const isTop = position === 'top-right';
  return (
    <motion.div
      className={`absolute pointer-events-none ${isTop ? '-top-32 -right-32 w-[500px] h-[500px] opacity-30' : '-bottom-24 -left-24 w-[350px] h-[350px] opacity-20'}`}
      style={{
        background: isTop
          ? 'radial-gradient(ellipse at 40% 40%, rgba(147,51,234,0.4), rgba(168,85,247,0.15), transparent 70%)'
          : 'radial-gradient(ellipse at 60% 60%, rgba(124,58,237,0.35), rgba(192,132,252,0.1), transparent 70%)',
        filter: isTop ? 'blur(40px)' : 'blur(50px)',
      }}
      animate={isReducedMotion ? {} : {
        borderRadius: isTop
          ? ['42% 58% 62% 38% / 45% 55% 45% 55%', '55% 45% 38% 62% / 58% 42% 55% 45%', '38% 62% 55% 45% / 42% 58% 62% 38%', '62% 38% 45% 55% / 55% 45% 38% 62%', '42% 58% 62% 38% / 45% 55% 45% 55%']
          : ['58% 42% 48% 52% / 42% 58% 52% 48%', '48% 52% 58% 42% / 52% 48% 42% 58%', '42% 58% 42% 58% / 58% 42% 58% 42%', '52% 48% 52% 48% / 48% 52% 48% 52%', '58% 42% 48% 52% / 42% 58% 52% 48%'],
      }}
      transition={{ duration: isTop ? 14 : 18, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

function AvatarSection({ profile, fadeUp }: { profile: ReturnType<typeof getProfile>; fadeUp: (d: number) => Record<string, unknown> }) {
  return (
    <motion.div {...fadeUp(0)} className="relative mb-8">
      <div className="absolute -inset-6 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15), transparent 70%)', filter: 'blur(30px)' }} aria-hidden="true" />
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 amoeba-photo overflow-hidden" style={{ background: 'linear-gradient(135deg, #9333ea, #c084fc, #7c3aed)', padding: 3 }}>
        <div className="w-full h-full rounded-[inherit] overflow-hidden bg-surface-950">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover object-top" loading="eager" />
          ) : (
            <div className="w-full h-full bg-primary-500/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-400/50">{profile.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AvailabilityDot({ dotClass, isReducedMotion }: { dotClass: string; isReducedMotion: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`${isReducedMotion ? '' : 'animate-ping'} absolute inline-flex h-full w-full rounded-full ${dotClass} opacity-75`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} />
    </span>
  );
}

function ScrollIndicator() {
  return (
    <motion.a
      href="#about"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Scroll to about section"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-primary-400/60 group-hover:text-primary-300 transition-colors">Scroll</span>
      <div className="relative w-6 h-9 rounded-full border border-primary-500/30 group-hover:border-primary-400/50 flex items-start justify-center p-1.5 transition-all duration-300 shadow-[0_0_16px_3px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_24px_6px_rgba(168,85,247,0.25)]">
        <motion.div className="w-1.5 h-1.5 rounded-full bg-primary-400 shadow-[0_0_6px_2px_rgba(168,85,247,0.4)]" animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
    </motion.a>
  );
}
