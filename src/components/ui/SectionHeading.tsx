import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

export function SectionHeading({ title, subtitle, id, align = 'left', children }: SectionHeadingProps) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const centered = align === 'center';

  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h1
        id={id}
        className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-surface-50"
        style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em' }}
      >
        {title}
      </h1>
      {children}

      {/* Accent underline — refined gradient with gold hint */}
      {isReducedMotion ? (
        <div className={`mt-5 h-[2px] w-16 rounded-full ${centered ? 'mx-auto' : ''}`} style={{ background: 'linear-gradient(90deg, #a855f7, #c084fc, rgba(251,191,36,0.4))' }} />
      ) : (
        <motion.div
          className={`mt-5 h-[2px] rounded-full ${centered ? 'mx-auto' : ''}`}
          style={{ background: 'linear-gradient(90deg, #a855f7, #c084fc, rgba(251,191,36,0.4))' }}
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 64, opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      )}

      {subtitle && (
        <p className={`mt-5 text-lg text-surface-300 max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
