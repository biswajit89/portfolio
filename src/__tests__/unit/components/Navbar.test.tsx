import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Navbar, getHighlightedSection } from '@/components/ui/Navbar';
import { useUIStore } from '@/store/uiStore';

// Simulate scrolled state so nav becomes visible
function simulateScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true });
  fireEvent.scroll(window);
}

// --- getHighlightedSection pure function tests ---

describe('getHighlightedSection', () => {
  const sections = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];

  it('returns the matching section (case-insensitive)', () => {
    expect(getHighlightedSection('about', sections)).toBe('About');
    expect(getHighlightedSection('PROJECTS', sections)).toBe('Projects');
    expect(getHighlightedSection('Home', sections)).toBe('Home');
  });

  it('falls back to the first section when no match', () => {
    expect(getHighlightedSection('unknown', sections)).toBe('Home');
    expect(getHighlightedSection('', sections)).toBe('Home');
  });

  it('returns empty string for empty sections array', () => {
    expect(getHighlightedSection('home', [])).toBe('');
  });
});

// --- Navbar component tests ---

describe('Navbar', () => {
  const defaultProps = {
    currentSection: 'home',
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
    // Start scrolled so nav is visible
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
  });

  it('renders all section buttons with aria-labels when scrolled', () => {
    render(<Navbar {...defaultProps} />);
    const expectedSections = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];
    for (const section of expectedSections) {
      expect(screen.getAllByLabelText(section).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('highlights the current section with aria-current', () => {
    render(<Navbar {...defaultProps} currentSection="experience" />);
    const activeButtons = screen.getAllByLabelText('Experience');
    const hasActive = activeButtons.some(
      (btn) => btn.getAttribute('aria-current') === 'page',
    );
    expect(hasActive).toBe(true);
  });

  it('does not highlight non-current sections', () => {
    render(<Navbar {...defaultProps} currentSection="home" />);
    const aboutButtons = screen.getAllByLabelText('About');
    for (const btn of aboutButtons) {
      expect(btn.getAttribute('aria-current')).toBeNull();
    }
  });

  it('calls onNavigate with section id on click', () => {
    const onNavigate = vi.fn();
    render(<Navbar currentSection="home" onNavigate={onNavigate} />);
    const projectsButtons = screen.getAllByLabelText('Projects');
    fireEvent.click(projectsButtons[0]);
    expect(onNavigate).toHaveBeenCalledWith('projects');
  });

  it('renders a hamburger button for mobile', () => {
    render(<Navbar {...defaultProps} />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', () => {
    render(<Navbar {...defaultProps} />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });

  it('has fixed bottom positioning for desktop nav', () => {
    const { container } = render(<Navbar {...defaultProps} />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('fixed');
    expect(nav?.className).toContain('bottom-6');
  });

  it('hides navigation when not scrolled', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    const { container } = render(<Navbar {...defaultProps} />);
    const nav = container.querySelector('nav');
    expect(nav).toBeNull();
  });

  it('shows navigation after scrolling past threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    const { container } = render(<Navbar {...defaultProps} />);
    expect(container.querySelector('nav')).toBeNull();

    act(() => simulateScroll(400));
    expect(container.querySelector('nav')).not.toBeNull();
  });
});
