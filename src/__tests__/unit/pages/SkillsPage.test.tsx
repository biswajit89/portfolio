import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SkillsPage from '@/pages/SkillsPage';
import { useAchievementStore } from '@/store/achievementStore';
import { useUIStore } from '@/store/uiStore';
import { getSkills } from '@/utils/content';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <SkillsPage />
    </MemoryRouter>,
  );
}

describe('SkillsPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useAchievementStore.setState({
      unlockedAchievements: [],
      viewedProjects: [],
      expandedExperiences: [],
      proofLinksClicked: 0,
      contactFormSubmitted: false,
    });
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders the Skills heading', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: /skills/i }),
    ).toBeInTheDocument();
  });

  it('renders all skill categories', () => {
    renderPage();
    const skills = getSkills();
    for (const category of skills) {
      expect(
        screen.getByTestId(`skill-category-${category.name}`),
      ).toBeInTheDocument();
    }
  });

  it('renders proof mode toggle switch', () => {
    renderPage();
    const toggle = screen.getByRole('switch', { name: /toggle proof mode/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles proof mode on when switch is clicked', () => {
    renderPage();
    const toggle = screen.getByRole('switch', { name: /toggle proof mode/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('does not show proof links when proof mode is off', () => {
    renderPage();
    const skills = getSkills();
    const skillWithProof = skills
      .flatMap((c) => c.skills)
      .find((s) => s.proofLinks.length > 0);

    if (skillWithProof) {
      expect(
        screen.queryAllByTestId(`proof-links-${skillWithProof.id}`),
      ).toHaveLength(0);
    }
  });

  it('shows proof links when proof mode is enabled', () => {
    renderPage();
    const toggle = screen.getByRole('switch', { name: /toggle proof mode/i });
    fireEvent.click(toggle);

    const skills = getSkills();
    const skillWithProof = skills
      .flatMap((c) => c.skills)
      .find((s) => s.proofLinks.length > 0);

    if (skillWithProof) {
      expect(
        screen.getAllByTestId(`proof-links-${skillWithProof.id}`).length,
      ).toBe(skillWithProof.proofLinks.length);
    }
  });

  it('navigates to projects page when a project proof link is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('switch', { name: /toggle proof mode/i }));

    const skills = getSkills();
    const skillWithProjectProof = skills
      .flatMap((c) => c.skills)
      .find((s) => s.proofLinks.some((pl) => pl.type === 'project'));

    if (skillWithProjectProof) {
      const projectLink = skillWithProjectProof.proofLinks.find(
        (pl) => pl.type === 'project',
      )!;
      fireEvent.click(screen.getByText(projectLink.description));

      expect(mockNavigate).toHaveBeenCalledWith('/projects', {
        state: { selectedProjectId: projectLink.id },
      });
    }
  });

  it('navigates to experience page when an experience proof link is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('switch', { name: /toggle proof mode/i }));

    const skills = getSkills();
    const skillWithExpProof = skills
      .flatMap((c) => c.skills)
      .find((s) => s.proofLinks.some((pl) => pl.type === 'experience'));

    if (skillWithExpProof) {
      const expLink = skillWithExpProof.proofLinks.find(
        (pl) => pl.type === 'experience',
      )!;
      // There may be multiple buttons with the same description; click the first
      const buttons = screen.getAllByText(expLink.description);
      fireEvent.click(buttons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/experience', {
        state: { expandExperienceId: expLink.id },
      });
    }
  });

  it('tracks proof link click in achievement store', () => {
    renderPage();
    fireEvent.click(screen.getByRole('switch', { name: /toggle proof mode/i }));

    const skills = getSkills();
    const skillWithProof = skills
      .flatMap((c) => c.skills)
      .find((s) => s.proofLinks.length > 0);

    if (skillWithProof) {
      const link = skillWithProof.proofLinks[0];
      const buttons = screen.getAllByText(link.description);
      fireEvent.click(buttons[0]);

      const state = useAchievementStore.getState();
      expect(state.proofLinksClicked).toBe(1);
    }
  });

  it('toggles proof mode off when switch is clicked twice', () => {
    renderPage();
    const toggle = screen.getByRole('switch', { name: /toggle proof mode/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});
