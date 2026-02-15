import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '@/components/ui/Footer';

describe('Footer', () => {
  const onNavigate = vi.fn();

  beforeEach(() => {
    onNavigate.mockClear();
  });

  it('renders quick links for all 7 sections', () => {
    render(<Footer onNavigate={onNavigate} />);
    const sections = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];
    for (const section of sections) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }
  });

  it('calls onNavigate with lowercase section name on link click', () => {
    render(<Footer onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText('Projects'));
    expect(onNavigate).toHaveBeenCalledWith('projects');
  });

  it('renders social links with correct aria-labels', () => {
    render(<Footer onNavigate={onNavigate} />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  it('social links open in new tab', () => {
    render(<Footer onNavigate={onNavigate} />);
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders footer with contentinfo role', () => {
    const { container } = render(<Footer onNavigate={onNavigate} />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveAttribute('role', 'contentinfo');
  });

  it('renders copyright text with profile name', () => {
    render(<Footer onNavigate={onNavigate} />);
    expect(screen.getByText(/Biswajit Nath/)).toBeInTheDocument();
  });

  it('renders last updated text', () => {
    render(<Footer onNavigate={onNavigate} />);
    expect(screen.getByText(/Last updated Feb 2026/)).toBeInTheDocument();
  });
});
