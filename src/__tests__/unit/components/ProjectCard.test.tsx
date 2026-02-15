import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { useUIStore } from '@/store/uiStore';
import type { Project } from '@/types/content';

const baseProject: Project = {
  id: 'proj-test',
  title: 'Test Project',
  description: 'A test project for unit testing the ProjectCard component.',
  role: 'Lead Developer',
  duration: '6 months',
  problem: 'Testing was hard.',
  solution: 'Built a testing framework.',
  architecture: 'React + Vitest',
  impactMetrics: ['50% faster tests'],
  techStack: ['React', 'TypeScript', 'Vitest'],
  screenshots: ['/images/test-1.png', '/images/test-2.png'],
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/test',
  highlights: ['Fast', 'Reliable'],
  categories: ['frontend'],
};

describe('ProjectCard', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: false });
  });

  it('renders project title and description', () => {
    render(<ProjectCard project={baseProject} onSelect={() => {}} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText(baseProject.description)).toBeInTheDocument();
  });

  it('renders tech stack tags (up to 4)', () => {
    render(<ProjectCard project={baseProject} onSelect={() => {}} />);
    const techStack = screen.getByTestId('tech-stack');
    expect(techStack.children).toHaveLength(3);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vitest')).toBeInTheDocument();
  });

  it('shows thumbnail image from first screenshot', () => {
    render(<ProjectCard project={baseProject} onSelect={() => {}} />);
    const thumbnail = screen.getByTestId('thumbnail');
    const img = thumbnail.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/test-1.png');
    expect(img).toHaveAttribute('alt', 'Test Project screenshot');
  });

  it('renders placeholder thumbnail when screenshots is empty', () => {
    const project = { ...baseProject, screenshots: [] };
    render(<ProjectCard project={project} onSelect={() => {}} />);
    // Thumbnail still renders with a placeholder
    const thumbnail = screen.getByTestId('thumbnail');
    expect(thumbnail).toBeInTheDocument();
    // No img tag in placeholder mode
    expect(thumbnail.querySelector('img')).not.toBeInTheDocument();
  });

  it('calls onSelect with project id when clicked', () => {
    const onSelect = vi.fn();
    render(<ProjectCard project={baseProject} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith('proj-test');
  });

  it('has accessible aria-label on the button', () => {
    render(<ProjectCard project={baseProject} onSelect={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'View project: Test Project',
    );
  });

  it('renders with reduced motion enabled', () => {
    useUIStore.setState({ isReducedMotion: true });
    render(<ProjectCard project={baseProject} onSelect={() => {}} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders with no optional URLs', () => {
    const project: Project = {
      ...baseProject,
      liveUrl: undefined,
      repoUrl: undefined,
      videoUrl: undefined,
    };
    render(<ProjectCard project={project} onSelect={() => {}} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
});
