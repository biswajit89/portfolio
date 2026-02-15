import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactPage from '@/pages/ContactPage';
import { useUIStore } from '@/store/uiStore';
import { useAchievementStore } from '@/store/achievementStore';
import { getProfile } from '@/utils/content';

describe('ContactPage', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
    useAchievementStore.setState({
      unlockedAchievements: [],
      viewedProjects: [],
      expandedExperiences: [],
      proofLinksClicked: 0,
      contactFormSubmitted: false,
    });
  });

  it('renders the page heading', () => {
    render(<ContactPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /get in touch/i }),
    ).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    render(<ContactPage />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders social links from profile data', () => {
    render(<ContactPage />);
    const profile = getProfile();

    if (profile.socials.linkedin) {
      const linkedinLink = screen.getByLabelText('LinkedIn');
      expect(linkedinLink).toHaveAttribute('href', profile.socials.linkedin);
    }

    if (profile.socials.github) {
      const githubLink = screen.getByLabelText('GitHub');
      expect(githubLink).toHaveAttribute('href', profile.socials.github);
    }

    const emailLink = screen.getByLabelText(profile.email);
    expect(emailLink).toHaveAttribute('href', `mailto:${profile.email}`);
  });

  it('social links open in new tab', () => {
    render(<ContactPage />);
    const profile = getProfile();

    if (profile.socials.linkedin) {
      const linkedinLink = screen.getByLabelText('LinkedIn');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('displays location from profile', () => {
    render(<ContactPage />);
    const profile = getProfile();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });
});
