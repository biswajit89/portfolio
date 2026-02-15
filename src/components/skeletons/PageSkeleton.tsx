import { Skeleton } from '@/components/ui/skeleton';

/* ── Hero Section ───────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center text-center max-w-4xl w-full">
        {/* Avatar */}
        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-8" />
        {/* Availability */}
        <Skeleton className="h-4 w-40 rounded-full mb-6" />
        {/* Name */}
        <Skeleton className="h-12 sm:h-16 w-72 sm:w-96 rounded-2xl mb-4" />
        {/* Title */}
        <Skeleton className="h-6 w-56 rounded-xl mb-6" />
        {/* Skill chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-7 rounded-full" style={{ width: 60 + Math.random() * 40 }} />
          ))}
        </div>
        {/* CTA buttons */}
        <div className="flex gap-3 mb-14">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        {/* Stats */}
        <div className="flex gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section wrapper ────────────────────────────────────────── */
function SectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      {children}
    </div>
  );
}

function HeadingSkeleton({ width = 'w-40' }: { width?: string }) {
  return <Skeleton className={`h-8 ${width} rounded-xl mb-8`} />;
}

/* ── About Section ──────────────────────────────────────────── */
function AboutSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-28" />
      {/* Bio */}
      <div className="space-y-2 mb-16">
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
        <Skeleton className="h-4 w-5/6 max-w-xl rounded" />
        <Skeleton className="h-4 w-20 rounded mt-3" />
      </div>
      {/* Strengths */}
      <Skeleton className="h-3 w-32 rounded mb-4" />
      <div className="flex flex-wrap gap-2 mb-16">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      {/* Timeline */}
      <Skeleton className="h-3 w-24 rounded mb-6" />
      <div className="pl-8 space-y-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-48 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
              <Skeleton className="h-2.5 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ── Experience Section ─────────────────────────────────────── */
function ExperienceSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-40" />
      <div className="pl-9 sm:pl-12 space-y-10">
        {Array.from({ length: 3 }, (_, gi) => (
          <div key={gi} className="space-y-3">
            {/* Company header */}
            <div className="mb-3">
              <Skeleton className="h-5 w-48 rounded mb-1.5" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
            {/* Roles */}
            {Array.from({ length: gi === 0 ? 2 : 1 }, (_, ri) => (
              <div key={ri} className="rounded-xl p-4 space-y-2">
                <Skeleton className="h-4 w-44 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
                <div className="flex gap-1.5 mt-2">
                  {Array.from({ length: 4 }, (_, ti) => (
                    <Skeleton key={ti} className="h-5 w-14 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ── Projects Section ───────────────────────────────────────── */
function ProjectsSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-32" />
      {/* Stats */}
      <Skeleton className="h-4 w-48 rounded mb-8" />
      {/* Filter bar */}
      <div className="flex gap-2 mb-10">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {/* Cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-0 overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
              <div className="flex gap-1.5 pt-2">
                {Array.from({ length: 3 }, (_, ti) => (
                  <Skeleton key={ti} className="h-5 w-14 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ── Skills Section ─────────────────────────────────────────── */
function SkillsSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-24" />
      <Skeleton className="h-4 w-56 rounded mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, ci) => (
          <div key={ci} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <Skeleton className="h-3 w-24 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, si) => (
                <div key={si} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, di) => (
                      <Skeleton key={di} className="w-1.5 h-1.5 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ── Education Section ──────────────────────────────────────── */
function EducationSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-36" />
      <div className="space-y-6">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-56 rounded" />
                <Skeleton className="h-3.5 w-40 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
                <div className="space-y-1.5 pt-2">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-5/6 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionSkeleton>
  );
}

/* ── Contact Section ────────────────────────────────────────── */
function ContactSkeleton() {
  return (
    <SectionSkeleton>
      <HeadingSkeleton width="w-36" />
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Info side */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-24 rounded mt-4" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Form side */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </SectionSkeleton>
  );
}

/* ── Full-page skeleton (matches FullPortfolio layout) ──────── */
export function PageSkeleton() {
  return (
    <div className="relative z-10" aria-busy="true" aria-label="Loading content">
      <HeroSkeleton />
      <AboutSkeleton />
      <ExperienceSkeleton />
      <ProjectsSkeleton />
      <SkillsSkeleton />
      <EducationSkeleton />
      <ContactSkeleton />
    </div>
  );
}

/* ── Single-section skeleton (for individual route fallbacks) ─ */
export function SectionPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 space-y-8" aria-busy="true" aria-label="Loading section">
      <Skeleton className="h-10 w-64 rounded-2xl" />
      <Skeleton className="h-5 w-96 max-w-full rounded-xl" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="h-4 w-5/6 rounded-xl" />
        <Skeleton className="h-4 w-4/6 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
