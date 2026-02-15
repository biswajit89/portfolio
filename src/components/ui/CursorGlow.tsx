import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);

  useEffect(() => {
    if (isReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let x = 0, y = 0;
    let raf: number;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const tick = () => {
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[1] will-change-transform"
      style={{ transform: 'translate(-9999px, -9999px)' }}
      aria-hidden="true"
    >
      <div
        className="rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, rgba(124,58,237,0.05) 35%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
}
