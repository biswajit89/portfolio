import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsPage from '@/pages/ProjectsPage';
import { useAchievementStore } from '@/store/achievementStore';
import { useUIStore } from '@/store/uiStore';
import { getProjects } from '@/utils/content';

describe('ProjectsPage', () => {
  beforeEach(() => {
    useAchievementStore.setState({
      unlockedAchievements: [],
      viewedProjects: [],
      expandedExperiences: [],
      proofLinksClicked: 0,
      contactFormSubmitted: false,
    });
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders the Projects heading', () => {
    render(<ProjectsPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /projects/i }),
    ).toBeInTheDocument();
  });

  it('renders filter buttons for All and each category', () => {
    render(<ProjectsPage />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Full Stack' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OSS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Security' })).toBeInTheDocument();
  });

  it('shows all projects by default (All filter active)', () => {
    render(<ProjectsPage />);
    const projects = getProjects();
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    // "All" button should be pressed
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('filters projects when a category button is clicked', () => {
    render(<ProjectsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    // Frontend button should now be pressed
    expect(screen.getByRole('button', { name: 'Frontend' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    // All button should not be pressed
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('shows "No projects found" when filter returns empty results', () => {
    render(<ProjectsPage />);
    // Click Security — if no projects have that category, we should see the empty message
    // First check if any projects have 'security' category
    const projects = getProjects();
    const securityProjects = projects.filter((p) =>
      p.categories.includes('security'),
    );

    if (securityProjects.length === 0) {
      fireEvent.click(screen.getByRole('button', { name: 'Security' }));
      expect(
        screen.getByText(/no projects found/i),
      ).toBeInTheDocument();
    }
  });

  it('shows case study when a project is selected', () => {
    render(<ProjectsPage />);
    const projects = getProjects();
    const firstProject = projects[0];

    // Click the project card
    fireEvent.click(
      screen.getByRole('button', { name: `View project: ${firstProject.title}` }),
    );

    // Should show the case study back button
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    // Should show case study sections
    expect(screen.getByTestId('section-overview')).toBeInTheDocument();
    expect(screen.getByTestId('section-problem')).toBeInTheDocument();
    expect(screen.getByTestId('section-solution')).toBeInTheDocument();
  });

  it('returns to project grid when back button is clicked', () => {
    render(<ProjectsPage />);
    const projects = getProjects();
    const firstProject = projects[0];

    // Select a project
    fireEvent.click(
      screen.getByRole('button', { name: `View project: ${firstProject.title}` }),
    );
    expect(screen.getByTestId('back-button')).toBeInTheDocument();

    // Click back
    fireEvent.click(screen.getByTestId('back-button'));

    // Should be back on the grid
    expect(
      screen.getByRole('heading', { level: 1, name: /projects/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
  });

  it('tracks project view in achievement store when a project is selected', () => {
    render(<ProjectsPage />);
    const projects = getProjects();
    const firstProject = projects[0];

    fireEvent.click(
      screen.getByRole('button', { name: `View project: ${firstProject.title}` }),
    );

    const state = useAchievementStore.getState();
    expect(state.viewedProjects).toContain(firstProject.id);
  });

  it('unlocks Explorer achievement after viewing 3 projects', () => {
    const { unmount } = render(<ProjectsPage />);
    const projects = getProjects();

    // View first project, go back, view second, go back, view third
    for (let i = 0; i < 3 && i < projects.length; i++) {
      fireEvent.click(
        screen.getByRole('button', {
          name: `View project: ${projects[i].title}`,
        }),
      );
      fireEvent.click(screen.getByTestId('back-button'));
    }

    const state = useAchievementStore.getState();
    expect(state.viewedProjects.length).toBeGreaterThanOrEqual(3);
    expect(state.unlockedAchievements).toContain('achievement-explorer');

    unmount();
  });

  it('has accessible filter group with aria-label', () => {
    render(<ProjectsPage />);
    expect(
      screen.getByRole('group', { name: /filter projects by category/i }),
    ).toBeInTheDocument();
  });
});
