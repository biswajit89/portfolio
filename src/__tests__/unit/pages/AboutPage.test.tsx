import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import AboutPage from '@/pages/AboutPage';
import { useUIStore } from '@/store/uiStore';
import { getProfile } from '@/utils/content';

describe('AboutPage', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders the About heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument();
  });

  it('displays the narrative section with profile summary', () => {
    render(<AboutPage />);
    const profile = getProfile();
    const narrative = screen.getByTestId('narrative');
    expect(narrative).toHaveTextContent(profile.summary);
  });

  it('displays the "What I focus on" heading', () => {
    render(<AboutPage />);
    expect(screen.getByText(/what i focus on/i)).toBeInTheDocument();
  });

  it('renders all 5 strength chips', () => {
    render(<AboutPage />);
    const grid = screen.getByTestId('strengths-grid');
    const titles = ['Performance', 'UI Systems', 'Security', 'Observability', 'DX'];
    for (const title of titles) {
      expect(within(grid).getByText(title)).toBeInTheDocument();
    }
  });

  it('displays the "How I work" section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/how i work/i)).toBeInTheDocument();
    expect(screen.getByText(/ship clean, readable code/i)).toBeInTheDocument();
  });

  it('displays the "Currently exploring" section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/currently exploring/i)).toBeInTheDocument();
    expect(screen.getByText(/llm-powered dev tools/i)).toBeInTheDocument();
  });

  it('displays the "Outside work" section', () => {
    render(<AboutPage />);
    expect(screen.getByText(/outside work/i)).toBeInTheDocument();
  });

  it('has accessible section landmark with aria-labelledby', () => {
    render(<AboutPage />);
    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toBeInTheDocument();
  });
});
