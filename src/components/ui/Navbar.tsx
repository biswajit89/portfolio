import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Home, User, Briefcase, FolderOpen, Wrench, GraduationCap, BookOpen, Mail,
  Menu, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import type { NavbarProps } from '@/types/ui';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const;

export function getHighlightedSection(
  currentSection: string,
  sections: string[],
): string {
  if (sections.length === 0) return '';
  const match = sections.find(
    (s) => s.toLowerCase() === currentSection.toLowerCase(),
  );
  return match ?? sections[0];
}

export function Navbar({ currentSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll(); // check on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const highlighted = getHighlightedSection(
    currentSection,
    NAV_ITEMS.map((n) => n.id) as unknown as string[],
  );

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop: floating bottom bar ── */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            role="navigation"
            aria-label="Main navigation"
          >
        <div className="relative rounded-2xl border border-white/[0.06] bg-surface-950/60 backdrop-blur-3xl shadow-2xl shadow-black/30 light-nav-bar">
          {/* Scroll progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] rounded-full"
            style={{ width: progressWidth, background: 'linear-gradient(90deg, #a855f7, #c084fc, rgba(251,191,36,0.5))' }}
          />
          {/* Inner top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" aria-hidden="true" />

          <div className="flex items-center gap-0.5 px-2 py-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = highlighted === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={cn(
                    'group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isActive
                      ? 'text-surface-50'
                      : 'text-surface-500 hover:text-surface-300',
                  )}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/[0.08]"
                      transition={isReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative w-4 h-4" />
                  {isActive && (
                    <motion.span
                      initial={isReducedMotion ? false : { opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="relative text-xs font-medium overflow-hidden whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </button>
              );
            })}

            {/* end of nav items */}
          </div>
        </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Mobile: bottom floating bar ── */}
      <AnimatePresence>
        {visible && (
      <motion.div
        initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="md:hidden fixed bottom-0 inset-x-0 z-50"
      >
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="mx-4 mb-2 rounded-2xl border border-white/[0.08] bg-surface-950/90 backdrop-blur-2xl overflow-hidden"
            >
              <ul className="grid grid-cols-4 gap-1 p-2" role="navigation" aria-label="Main navigation">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const isActive = highlighted === id;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => handleNavigate(id)}
                        className={cn(
                          'flex flex-col items-center gap-1 w-full rounded-xl py-2.5 text-[10px] transition-colors',
                          isActive ? 'text-primary-400 bg-white/[0.06]' : 'text-surface-500',
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating toggle */}
        <div className="flex justify-center pb-5 pt-2">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-surface-950/80 backdrop-blur-xl text-surface-400 transition-all',
              mobileOpen && 'bg-white/[0.06] text-surface-200',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
