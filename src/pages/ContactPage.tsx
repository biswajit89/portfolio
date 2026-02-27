import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { ContactForm } from '@/components/ui/ContactForm';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { getProfile } from '@/utils/content';
import { useAchievementStore } from '@/store/achievementStore';
import { useUIStore } from '@/store/uiStore';
import { useFadeUp } from '@/lib/motion';
import type { ContactFormData } from '@/types/ui';

export default function ContactPage() {
  const profile = getProfile();
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  useDocumentHead({ title: 'Contact', description: 'Get in touch — send a message or connect.', path: '/contact' });
  const trackContactSubmit = useAchievementStore((s) => s.trackContactSubmit);

  const handleSubmit = useCallback(async (data: ContactFormData): Promise<void> => {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_email: 'biswajitnath.iit@gmail.com',
      },
      'YOUR_PUBLIC_KEY'
    );
    trackContactSubmit();
  }, [trackContactSubmit]);

  const socials = [
    profile.socials.linkedin ? { href: profile.socials.linkedin, label: 'LinkedIn', icon: Linkedin } : null,
    profile.socials.github ? { href: profile.socials.github, label: 'GitHub', icon: Github } : null,
    { href: `mailto:${profile.email}`, label: profile.email, icon: Mail },
  ].filter(Boolean) as { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[];

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" aria-labelledby="contact-heading">
      <FadeSlide><SectionHeading title="Get in Touch" id="contact-heading" /></FadeSlide>

      <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
        <ContactInfo profile={profile} socials={socials} isReducedMotion={isReducedMotion} />

        <motion.div {...useFadeUp(0.08)} className="lg:col-span-3">
          <GlassCard padding="lg" hoverable={false}>
            <ContactForm onSubmit={handleSubmit} />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function ContactInfo({ profile, socials, isReducedMotion }: {
  profile: ReturnType<typeof getProfile>;
  socials: { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[];
  isReducedMotion: boolean;
}) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <motion.p {...useFadeUp(0.04)} className="text-surface-400 leading-relaxed">
        Have a project in mind or want to collaborate? Drop me a message and I'll get back to you within 24 hours.
      </motion.p>

      <motion.div {...useFadeUp(0.08)} className="flex items-center gap-3 text-sm text-surface-400">
        <MapPin className="w-4 h-4 text-surface-500" /> {profile.location}
      </motion.div>

      <motion.div {...useFadeUp(0.12)} className="space-y-3">
        {socials.map(({ href, label, icon: Icon }) => (
          <SocialLink key={label} href={href} label={label} icon={Icon} isReducedMotion={isReducedMotion} />
        ))}
      </motion.div>

      <motion.div {...useFadeUp(0.16)} className="flex items-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className={`${isReducedMotion ? '' : 'animate-ping'} absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="text-surface-400">Open to opportunities</span>
      </motion.div>
    </div>
  );
}

function SocialLink({ href, label, icon: Icon, isReducedMotion }: {
  href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; isReducedMotion: boolean;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center gap-3 text-sm text-surface-400 hover:text-surface-100 transition-colors"
      whileHover={isReducedMotion ? {} : { x: 4 }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] shadow-lg shadow-black/15 group-hover:border-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/8 transition-all duration-400">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <span>{label}</span>
      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
}
