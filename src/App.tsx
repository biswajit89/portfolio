import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageSkeleton, SectionPageSkeleton } from "@/components/skeletons/PageSkeleton";
import { useUIStore } from "@/store/uiStore";

const FullPortfolio = lazy(() => import("@/pages/FullPortfolio"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const EducationPage = lazy(() => import("@/pages/EducationPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

function AppContent() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageSkeleton />}><FullPortfolio /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<SectionPageSkeleton />}><AboutPage /></Suspense>} />
          <Route path="/experience" element={<Suspense fallback={<SectionPageSkeleton />}><ExperiencePage /></Suspense>} />
          <Route path="/projects" element={<Suspense fallback={<SectionPageSkeleton />}><ProjectsPage /></Suspense>} />
          <Route path="/skills" element={<Suspense fallback={<SectionPageSkeleton />}><SkillsPage /></Suspense>} />
          <Route path="/education" element={<Suspense fallback={<SectionPageSkeleton />}><EducationPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<SectionPageSkeleton />}><ContactPage /></Suspense>} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
