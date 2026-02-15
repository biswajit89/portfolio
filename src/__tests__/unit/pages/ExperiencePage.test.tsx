import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExperiencePage from '@/pages/ExperiencePage';
import { useAchievementStore } from '@/store/achievementStore';
import { useUIStore } from '@/store/uiStore';

describe('ExperiencePage', () => {
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

  it('renders the Experience heading', () => {
    render(<ExperiencePage />);
    expect(screen.getByRole('heading', { level: 1, name: /experience/i })).toBeInTheDocument();
  });

  it('renders company groups from portfolio data', () => {
    render(<ExperiencePage />);
    expect(screen.getByText('Securonix India Pvt. Ltd')).toBeInTheDocument();
    expect(screen.getByText('Monet Networks Inc')).toBeInTheDocument();
    expect(screen.getByText('Oneclikk')).toBeInTheDocument();
  });

  it('renders roles within company groups', () => {
    render(<ExperiencePage />);
    expect(screen.getByText('Sr. Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Intern')).toBeInTheDocument();
  });

  it('tracks experience expand in achievement store when a role is expanded', () => {
    render(<ExperiencePage />);
    const toggleButtons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(toggleButtons[0]);
    const state = useAchievementStore.getState();
    expect(state.expandedExperiences.length).toBe(1);
  });

  it('tracks multiple different experience expands', () => {
    render(<ExperiencePage />);
    const toggleButtons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(toggleButtons[0]);
    // Re-query: first is now expanded, click the next collapsed one
    const collapsed = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(collapsed[0]);
    const state = useAchievementStore.getState();
    expect(state.expandedExperiences.length).toBe(2);
  });

  it('unlocks Deep Diver achievement after expanding 2 experiences', () => {
    render(<ExperiencePage />);
    const toggleButtons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(toggleButtons[0]);
    const collapsed = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(collapsed[0]);
    const state = useAchievementStore.getState();
    expect(state.unlockedAchievements).toContain('achievement-deep-diver');
  });

  it('only expands one role at a time (accordion behavior)', () => {
    render(<ExperiencePage />);
    const toggleButtons = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(toggleButtons[0]);
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1);

    const collapsed = screen.getAllByRole('button', { expanded: false });
    fireEvent.click(collapsed[0]);
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1);
  });

  it('shows "Current" badge for the active company', () => {
    render(<ExperiencePage />);
    expect(screen.getByText('Current')).toBeInTheDocument();
  });
});
