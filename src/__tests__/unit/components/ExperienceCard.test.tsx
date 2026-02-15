import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExperienceCard, formatDateRange } from '@/components/ui/ExperienceCard';
import { useUIStore } from '@/store/uiStore';
import type { Experience } from '@/types/content';

const baseExperience: Experience = {
  id: 'exp-test',
  company: 'TestCorp',
  role: 'Senior Engineer',
  startDate: '2022-03',
  endDate: null,
  location: 'Remote',
  isRemote: true,
  summary: ['Led frontend architecture.', 'Drove design system adoption.'],
  achievements: [
    'Reduced LCP from 4s to 1.8s',
    'Architected micro-frontend migration',
    'Mentored 4 junior engineers',
  ],
  techStack: ['React', 'TypeScript', 'GraphQL'],
  artifacts: [
    { type: 'link', url: 'https://example.com/case', title: 'Case Study' },
  ],
};

describe('formatDateRange', () => {
  it('formats start and end dates', () => {
    expect(formatDateRange('2019-06', '2022-02')).toBe('Jun 2019 – Feb 2022');
  });

  it('shows Present when endDate is null', () => {
    expect(formatDateRange('2022-03', null)).toBe('Mar 2022 – Present');
  });
});

describe('ExperienceCard', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: false });
  });

  it('renders company name, role, and duration in default mode', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    expect(screen.getByText('TestCorp')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByTestId('duration')).toHaveTextContent('Mar 2022 – Present');
  });

  it('hides company name in compact mode', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} compact />,
    );
    expect(screen.queryByText('TestCorp')).not.toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  });

  it('displays Remote indicator when isRemote is true', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    expect(screen.getByTestId('duration')).toHaveTextContent('Remote');
  });

  it('renders all tech stack tags', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    const techStack = screen.getByTestId('tech-stack');
    expect(techStack.children).toHaveLength(3);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
  });

  it('shows up to 2 achievements in collapsed state', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    const preview = screen.getByTestId('achievements-preview');
    expect(preview.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByText('Reduced LCP from 4s to 1.8s')).toBeInTheDocument();
    expect(screen.getByText('Architected micro-frontend migration')).toBeInTheDocument();
  });

  it('hides collapsed achievements preview when expanded', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={true} onToggle={() => {}} />,
    );
    expect(screen.queryByTestId('achievements-preview')).not.toBeInTheDocument();
  });

  it('shows all achievements in expanded state', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={true} onToggle={() => {}} />,
    );
    const full = screen.getByTestId('achievements-full');
    expect(full.querySelectorAll('li')).toHaveLength(3);
  });

  it('shows summary and artifacts when expanded', () => {
    render(
      <ExperienceCard experience={baseExperience} isExpanded={true} onToggle={() => {}} />,
    );
    expect(screen.getByText('Led frontend architecture.')).toBeInTheDocument();
    expect(screen.getByText('Case Study')).toBeInTheDocument();
  });

  it('calls onToggle when the header button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={onToggle} />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('sets aria-expanded correctly', () => {
    const { rerender } = render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <ExperienceCard experience={baseExperience} isExpanded={true} onToggle={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders without artifacts section when artifacts array is empty', () => {
    const exp = { ...baseExperience, artifacts: [] };
    render(<ExperienceCard experience={exp} isExpanded={true} onToggle={() => {}} />);
    expect(screen.queryByText('Artifacts')).not.toBeInTheDocument();
  });

  it('renders with reduced motion enabled', () => {
    useUIStore.setState({ isReducedMotion: true });
    render(
      <ExperienceCard experience={baseExperience} isExpanded={false} onToggle={() => {}} />,
    );
    expect(screen.getByText('TestCorp')).toBeInTheDocument();
  });
});
