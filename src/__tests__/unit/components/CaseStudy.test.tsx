import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaseStudy } from '@/components/ui/CaseStudy';
import { useUIStore } from '@/store/uiStore';
import type { Project } from '@/types/content';

const baseProject: Project = {
  id: 'proj-case',
  title: 'Case Study Project',
  description: 'An overview of the project for testing.',
  role: 'Lead Engineer',
  duration: '8 months',
  problem: 'Legacy system was slow and hard to maintain.',
  solution: 'Rebuilt with modern stack and microservices.',
  architecture: 'React frontend, Node.js API, PostgreSQL database.',
  impactMetrics: ['3x faster page loads', '40% fewer bugs', '99.9% uptime'],
  techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  screenshots: ['/img/screen-1.png', '/img/screen-2.png', '/img/screen-3.png'],
  videoUrl: 'https://www.youtube.com/embed/test123',
  liveUrl: 'https://demo.example.com',
  repoUrl: 'https://github.com/test/repo',
  highlights: ['Learned event-driven architecture', 'Improved CI/CD pipeline'],
  categories: ['fullstack'],
};

describe('CaseStudy', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders all six required sections', () => {
    render(<CaseStudy project={baseProject} />);
    expect(screen.getByTestId('section-overview')).toBeInTheDocument();
    expect(screen.getByTestId('section-problem')).toBeInTheDocument();
    expect(screen.getByTestId('section-solution')).toBeInTheDocument();
    expect(screen.getByTestId('section-architecture')).toBeInTheDocument();
    expect(screen.getByTestId('section-results')).toBeInTheDocument();
    expect(screen.getByTestId('section-learnings')).toBeInTheDocument();
  });

  it('displays project title, role, and duration', () => {
    render(<CaseStudy project={baseProject} />);
    expect(screen.getByText('Case Study Project')).toBeInTheDocument();
    expect(screen.getByText(/Lead Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/8 months/)).toBeInTheDocument();
  });

  it('renders overview from description', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-overview');
    expect(section).toHaveTextContent('An overview of the project for testing.');
  });

  it('renders problem section content', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-problem');
    expect(section).toHaveTextContent('Legacy system was slow and hard to maintain.');
  });

  it('renders solution section content', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-solution');
    expect(section).toHaveTextContent('Rebuilt with modern stack and microservices.');
  });

  it('renders architecture section content', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-architecture');
    expect(section).toHaveTextContent('React frontend, Node.js API, PostgreSQL database.');
  });

  it('renders all impact metrics in results section', () => {
    render(<CaseStudy project={baseProject} />);
    expect(screen.getByText('3x faster page loads')).toBeInTheDocument();
    expect(screen.getByText('40% fewer bugs')).toBeInTheDocument();
    expect(screen.getByText('99.9% uptime')).toBeInTheDocument();
  });

  it('renders all highlights in learnings section', () => {
    render(<CaseStudy project={baseProject} />);
    expect(screen.getByText('Learned event-driven architecture')).toBeInTheDocument();
    expect(screen.getByText('Improved CI/CD pipeline')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-tech-stack');
    expect(section).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renders live demo and repo links', () => {
    render(<CaseStudy project={baseProject} />);
    const liveLink = screen.getByTestId('live-demo-link');
    expect(liveLink).toHaveAttribute('href', 'https://demo.example.com');
    expect(liveLink).toHaveAttribute('target', '_blank');

    const repoLink = screen.getByTestId('repo-link');
    expect(repoLink).toHaveAttribute('href', 'https://github.com/test/repo');
    expect(repoLink).toHaveAttribute('target', '_blank');
  });

  it('renders screenshots gallery', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-screenshots');
    expect(section).toBeInTheDocument();
    const thumbnails = screen.getByTestId('screenshot-thumbnails');
    expect(thumbnails.children).toHaveLength(3);
  });

  it('changes active screenshot on thumbnail click', () => {
    render(<CaseStudy project={baseProject} />);
    const thumbButtons = screen.getByTestId('screenshot-thumbnails').querySelectorAll('button');
    fireEvent.click(thumbButtons[1]);
    const mainImg = screen.getByAltText('Case Study Project screenshot 2');
    expect(mainImg).toBeInTheDocument();
  });

  it('renders video embed when videoUrl is provided', () => {
    render(<CaseStudy project={baseProject} />);
    const section = screen.getByTestId('section-video');
    expect(section).toBeInTheDocument();
    const iframe = section.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/test123');
  });

  it('does not render video section when videoUrl is absent', () => {
    const project = { ...baseProject, videoUrl: undefined };
    render(<CaseStudy project={project} />);
    expect(screen.queryByTestId('section-video')).not.toBeInTheDocument();
  });

  it('does not render links section when both URLs are absent', () => {
    const project = { ...baseProject, liveUrl: undefined, repoUrl: undefined };
    render(<CaseStudy project={project} />);
    expect(screen.queryByTestId('project-links')).not.toBeInTheDocument();
  });

  it('does not render screenshots section when screenshots is empty', () => {
    const project = { ...baseProject, screenshots: [] };
    render(<CaseStudy project={project} />);
    expect(screen.queryByTestId('section-screenshots')).not.toBeInTheDocument();
  });

  it('renders back button and calls onBack when clicked', () => {
    const onBack = vi.fn();
    render(<CaseStudy project={baseProject} onBack={onBack} />);
    const backBtn = screen.getByTestId('back-button');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('does not render back button when onBack is not provided', () => {
    render(<CaseStudy project={baseProject} />);
    expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
  });

  it('does not show screenshot thumbnails for a single screenshot', () => {
    const project = { ...baseProject, screenshots: ['/img/single.png'] };
    render(<CaseStudy project={project} />);
    expect(screen.getByTestId('section-screenshots')).toBeInTheDocument();
    expect(screen.queryByTestId('screenshot-thumbnails')).not.toBeInTheDocument();
  });
});
