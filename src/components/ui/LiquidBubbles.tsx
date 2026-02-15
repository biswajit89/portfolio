import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

/* ─── Amoeba blob config ──────────────────────────────────────── */
interface Blob {
  /** CSS size */
  size: number;
  x: string;
  y: string;
  /** Two gradient stops */
  color1: string;
  color2: string;
  blur: number;
  parallaxSpeed: number;
  /** Amoeba morph keyframes — 4 border-radius states */
  morph: string[];
  /** Drift path */
  drift: { x: number[]; y: number[] };
  driftDuration: number;
  morphDuration: number;
  delay: number;
}

const BLOBS: Blob[] = [
  {
    size: 600, x: '-8%', y: '-10%',
    color1: 'rgba(147,51,234,0.32)', color2: 'rgba(124,58,237,0.10)',
    blur: 50, parallaxSpeed: 0.12,
    morph: [
      '42% 58% 62% 38% / 45% 55% 45% 55%',
      '55% 45% 38% 62% / 58% 42% 55% 45%',
      '38% 62% 55% 45% / 42% 58% 62% 38%',
      '62% 38% 45% 55% / 55% 45% 38% 62%',
    ],
    drift: { x: [0, 50, -25, 0], y: [0, -35, 18, 0] },
    driftDuration: 24, morphDuration: 12, delay: 0,
  },
  {
    size: 500, x: '55%', y: '2%',
    color1: 'rgba(168,85,247,0.25)', color2: 'rgba(192,132,252,0.08)',
    blur: 55, parallaxSpeed: 0.22,
    morph: [
      '50% 50% 45% 55% / 55% 45% 50% 50%',
      '40% 60% 55% 45% / 45% 55% 40% 60%',
      '60% 40% 50% 50% / 50% 50% 55% 45%',
      '45% 55% 40% 60% / 60% 40% 45% 55%',
    ],
    drift: { x: [0, -40, 20, 0], y: [0, 25, -15, 0] },
    driftDuration: 28, morphDuration: 14, delay: 2,
  },
  {
    size: 450, x: '2%', y: '48%',
    color1: 'rgba(124,58,237,0.26)', color2: 'rgba(147,51,234,0.08)',
    blur: 45, parallaxSpeed: 0.08,
    morph: [
      '58% 42% 48% 52% / 42% 58% 52% 48%',
      '48% 52% 58% 42% / 52% 48% 42% 58%',
      '42% 58% 42% 58% / 58% 42% 58% 42%',
      '52% 48% 52% 48% / 48% 52% 48% 52%',
    ],
    drift: { x: [0, 35, -18, 0], y: [0, -28, 12, 0] },
    driftDuration: 22, morphDuration: 16, delay: 4,
  },
  {
    size: 380, x: '65%', y: '52%',
    color1: 'rgba(192,132,252,0.22)', color2: 'rgba(168,85,247,0.06)',
    blur: 60, parallaxSpeed: 0.28,
    morph: [
      '45% 55% 55% 45% / 50% 50% 45% 55%',
      '55% 45% 45% 55% / 45% 55% 55% 45%',
      '50% 50% 50% 50% / 55% 45% 50% 50%',
      '40% 60% 50% 50% / 50% 50% 60% 40%',
    ],
    drift: { x: [0, -30, 22, 0], y: [0, 20, -30, 0] },
    driftDuration: 26, morphDuration: 18, delay: 1,
  },
  {
    size: 280, x: '35%', y: '28%',
    color1: 'rgba(147,51,234,0.18)', color2: 'rgba(124,58,237,0.05)',
    blur: 40, parallaxSpeed: 0.18,
    morph: [
      '52% 48% 44% 56% / 56% 44% 48% 52%',
      '44% 56% 52% 48% / 48% 52% 56% 44%',
      '56% 44% 48% 52% / 52% 48% 44% 56%',
      '48% 52% 56% 44% / 44% 56% 52% 48%',
    ],
    drift: { x: [0, 25, -15, 0], y: [0, -20, 10, 0] },
    driftDuration: 20, morphDuration: 10, delay: 5,
  },
];

/* ─── Floating particle config ────────────────────────────────── */
interface Particle {
  x: string;
  y: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  parallaxSpeed: number;
}

function generateParticles(count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: 1.5 + Math.random() * 3,
      opacity: 0.15 + Math.random() * 0.3,
      duration: 18 + Math.random() * 22,
      delay: Math.random() * 12,
      parallaxSpeed: 0.04 + Math.random() * 0.25,
    });
  }
  return out;
}

/* ─── Amoeba blob component ───────────────────────────────────── */
function AmoebaBlob({ blob, scrollYProgress, isAnimated }: {
  blob: Blob;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  isAnimated: boolean;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -blob.parallaxSpeed * 400]);

  const baseStyle = {
    width: blob.size,
    height: blob.size,
    left: blob.x,
    top: blob.y,
    background: `radial-gradient(ellipse at 30% 30%, ${blob.color1}, ${blob.color2}, transparent 70%)`,
    filter: `blur(${blob.blur}px)`,
  };

  if (!isAnimated) {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ ...baseStyle, borderRadius: blob.morph[0] }}
      />
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...baseStyle, y }}
      animate={{
        borderRadius: blob.morph,
        x: blob.drift.x,
      }}
      transition={{
        borderRadius: { duration: blob.morphDuration, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
        x: { duration: blob.driftDuration, repeat: Infinity, ease: 'easeInOut', delay: blob.delay },
      }}
    />
  );
}

/* ─── Floating particle component ─────────────────────────────── */
function FloatingParticle({ particle, scrollYProgress, isAnimated }: {
  particle: Particle;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  isAnimated: boolean;
}) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -particle.parallaxSpeed * 250]);

  const style = {
    left: particle.x,
    top: particle.y,
    width: particle.size,
    height: particle.size,
  };

  if (!isAnimated) {
    return (
      <div
        className="absolute rounded-full bg-purple-300 pointer-events-none"
        style={{ ...style, opacity: particle.opacity }}
      />
    );
  }

  return (
    <motion.div
      className="absolute rounded-full bg-purple-300 pointer-events-none"
      style={{ ...style, y }}
      animate={{
        opacity: [particle.opacity, particle.opacity * 0.2, particle.opacity],
        scale: [1, 1.8, 1],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export function LiquidBubbles() {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const { scrollYProgress } = useScroll();
  const particles = useMemo(() => generateParticles(25), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Amoeba blobs with parallax + morph */}
      {BLOBS.map((blob, i) => (
        <AmoebaBlob key={i} blob={blob} scrollYProgress={scrollYProgress} isAnimated={!isReducedMotion} />
      ))}

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} particle={p} scrollYProgress={scrollYProgress} isAnimated={!isReducedMotion} />
      ))}

      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-72 pointer-events-none dark-vignette-top"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,8,0.85), transparent)' }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-72 pointer-events-none dark-vignette-bottom"
        style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.7), transparent)' }}
      />
    </div>
  );
}
