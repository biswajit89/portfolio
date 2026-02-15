import { Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import type { FooterProps } from '@/types/ui';
import portfolioData from '@/content/portfolio.json';

const SECTIONS = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'] as const;

const SOCIAL_LINKS = [
  { key: 'github', icon: Github, label: 'GitHub' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'twitter', icon: Twitter, label: 'Twitter' },
] as const;

export function Footer({ onNavigate }: FooterProps) {
  const { name, socials } = portfolioData.profile;

  return (
    <footer className="relative border-t border-white/[0.04] pb-28 md:pb-24" role="contentinfo">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-8">
        {/* Top row: name + back to top */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => onNavigate('home')}
            className="text-lg font-semibold text-surface-200 hover:text-surface-50 transition-colors"
          >
            {name.split(' ')[0]}
            <span className="text-primary-500">.</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2 text-sm text-surface-500 hover:text-surface-300 transition-colors"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Nav links — horizontal */}
        <nav aria-label="Footer navigation" className="mb-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((section) => (
              <li key={section}>
                <button
                  onClick={() => onNavigate(section.toLowerCase())}
                  className="text-sm text-surface-500 hover:text-surface-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom row: socials + copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/[0.04]">
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ key, icon: Icon, label }) => {
              const href = socials[key as keyof typeof socials];
              if (!href) return null;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-surface-500 hover:text-surface-200 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          <p className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} {name} · Last updated Feb 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
