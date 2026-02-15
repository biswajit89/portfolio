import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import type { FadeSlideProps } from '@/types/ui';

const offsets: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
};

export function FadeSlide({
  children,
  direction = 'up',
  delay = 0,
  stagger = 0,
}: FadeSlideProps) {
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);

  if (isReducedMotion) {
    return <>{children}</>;
  }

  const { x, y } = offsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: delay + stagger,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
