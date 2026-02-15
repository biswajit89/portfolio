import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FadeSlide } from '@/components/motion/FadeSlide';
import { useUIStore } from '@/store/uiStore';

describe('FadeSlide', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: false });
  });

  it('renders children', () => {
    render(
      <FadeSlide>
        <p>Hello</p>
      </FadeSlide>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('wraps children in a motion div when animations are enabled', () => {
    const { container } = render(
      <FadeSlide>
        <span>Animated</span>
      </FadeSlide>,
    );
    // Framer Motion renders a div wrapper
    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper?.getAttribute('style')).toBeTruthy();
  });

  it('renders children directly without wrapper when reduced motion is enabled', () => {
    useUIStore.setState({ isReducedMotion: true });
    const { container } = render(
      <FadeSlide>
        <p data-testid="child">Static</p>
      </FadeSlide>,
    );
    // Should render the child directly without a motion wrapper
    expect(screen.getByTestId('child')).toBeInTheDocument();
    // The first element should be the <p> itself, not a wrapping div
    expect(container.firstElementChild?.tagName).toBe('P');
  });

  it('defaults direction to up', () => {
    const { container } = render(
      <FadeSlide>
        <span>Up</span>
      </FadeSlide>,
    );
    // Framer Motion applies initial styles; the wrapper should exist
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeTruthy();
    expect(screen.getByText('Up')).toBeInTheDocument();
  });

  it('accepts all direction variants without error', () => {
    const directions = ['up', 'down', 'left', 'right'] as const;
    for (const dir of directions) {
      const { unmount } = render(
        <FadeSlide direction={dir}>
          <span>{dir}</span>
        </FadeSlide>,
      );
      expect(screen.getByText(dir)).toBeInTheDocument();
      unmount();
    }
  });

  it('accepts delay and stagger props', () => {
    // Should render without errors when delay/stagger are provided
    render(
      <FadeSlide delay={0.2} stagger={0.1}>
        <span>Delayed</span>
      </FadeSlide>,
    );
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });
});
