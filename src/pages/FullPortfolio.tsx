import { lazy, Suspense, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { SectionPageSkeleton } from '@/components/skeletons/PageSkeleton';
import { LiquidBubbles } from '@/components/ui/LiquidBubbles';
import { CursorGlow } from '@/components/ui/CursorGlow';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const EducationPage = lazy(() => import('@/pages/EducationPage'));
const PublicationsPage = lazy(() => import('@/pages/PublicationsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'publications', 'contact'];

export default function FullPortfolio() {
  const currentSection = useUIStore((s) => s.currentSection);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const scrollToSection = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [setCurrentSection]);

  return (
    <>
      <LiquidBubbles />
      <CursorGlow />
      <Navbar currentSection={currentSection} onNavigate={scrollToSection} />

      {/* Theme toggle — fixed top right */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-surface-950/60 backdrop-blur-2xl text-surface-400 hover:text-surface-200 hover:border-white/[0.12] shadow-xl shadow-black/25 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <main className="relative z-10">
        <section id="home">
          <Suspense fallback={<SectionPageSkeleton />}><HomePage /></Suspense>
        </section>

        <section id="about">
          <Suspense fallback={<SectionPageSkeleton />}><AboutPage /></Suspense>
        </section>

        <section id="experience">
          <Suspense fallback={<SectionPageSkeleton />}><ExperiencePage /></Suspense>
        </section>

        <section id="projects">
          <Suspense fallback={<SectionPageSkeleton />}><ProjectsPage /></Suspense>
        </section>

        <section id="skills">
          <Suspense fallback={<SectionPageSkeleton />}><SkillsPage /></Suspense>
        </section>

        <section id="education">
          <Suspense fallback={<SectionPageSkeleton />}><EducationPage /></Suspense>
        </section>

        <section id="publications">
          <Suspense fallback={<SectionPageSkeleton />}><PublicationsPage /></Suspense>
        </section>

        <section id="contact">
          <Suspense fallback={<SectionPageSkeleton />}><ContactPage /></Suspense>
        </section>

        <Footer onNavigate={scrollToSection} />
      </main>
    </>
  );
}
