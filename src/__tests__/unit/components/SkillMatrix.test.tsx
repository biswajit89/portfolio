import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillMatrix } from '@/components/ui/SkillMatrix';
import { useUIStore } from '@/store/uiStore';
import type { SkillCategory } from '@/types/content';

const baseSkills: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      {
        id: 'skill-react',
        name: 'React',
        proficiency: 5,
        proofLinks: [
          { type: 'project', id: 'proj-1', description: 'Built widget system' },
          { type: 'experience', id: 'exp-1', description: 'Lead architect' },
        ],
      },
      {
        id: 'skill-ts',
        name: 'TypeScript',
        proficiency: 4,
        proofLinks: [],
      },
    ],
  },
  {
    name: 'Backend',
    skills: [
      {
        id: 'skill-node',
        name: 'Node.js',
        proficiency: 3,
        proofLinks: [
          { type: 'project', id: 'proj-2', description: 'CLI tool' },
        ],
      },
    ],
  },
];

describe('SkillMatrix', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders all category headings', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('renders category sections with correct data-testid', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.getByTestId('skill-category-Frontend')).toBeInTheDocument();
    expect(screen.getByTestId('skill-category-Backend')).toBeInTheDocument();
  });

  it('renders all skills within each category', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.getByTestId('skill-skill-react')).toBeInTheDocument();
    expect(screen.getByTestId('skill-skill-ts')).toBeInTheDocument();
    expect(screen.getByTestId('skill-skill-node')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders proficiency dots for each skill', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    const reactProf = screen.getByTestId('proficiency-skill-react');
    expect(reactProf).toBeInTheDocument();
    expect(reactProf).toHaveAttribute('role', 'meter');
    expect(reactProf).toHaveAttribute('aria-valuenow', '5');
    expect(reactProf).toHaveAttribute('aria-valuemax', '5');

    // 5 dots rendered
    expect(reactProf.children).toHaveLength(5);

    const nodeProf = screen.getByTestId('proficiency-skill-node');
    expect(nodeProf).toHaveAttribute('aria-valuenow', '3');
  });

  it('does not show proof links when proofMode is false', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.queryByTestId('proof-links-skill-react')).not.toBeInTheDocument();
    expect(screen.queryByText('Built widget system')).not.toBeInTheDocument();
  });

  it('shows proof links when proofMode is true', () => {
    render(
      <SkillMatrix skills={baseSkills} proofMode={true} onProofClick={() => {}} />,
    );
    expect(screen.getByText('Built widget system')).toBeInTheDocument();
    expect(screen.getByText('Lead architect')).toBeInTheDocument();
  });

  it('calls onProofClick with skillId and link id when proof link is clicked', () => {
    const onProofClick = vi.fn();
    render(
      <SkillMatrix skills={baseSkills} proofMode={true} onProofClick={onProofClick} />,
    );
    fireEvent.click(screen.getByText('Built widget system'));
    expect(onProofClick).toHaveBeenCalledOnce();
    expect(onProofClick).toHaveBeenCalledWith('skill-react', 'proj-1');
  });

  it('renders with empty skills array', () => {
    render(
      <SkillMatrix skills={[]} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('renders with reduced motion enabled', () => {
    useUIStore.setState({ isReducedMotion: true });
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders with reduced motion disabled', () => {
    useUIStore.setState({ isReducedMotion: false });
    render(
      <SkillMatrix skills={baseSkills} proofMode={false} onProofClick={() => {}} />,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
